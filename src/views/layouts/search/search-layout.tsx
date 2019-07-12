import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import *  as React from "react";
import { SEARCH_RESULT_EVENT } from "src/views/layouts/hornet-app";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { SearchResult } from "src/views/layouts/search/search-result";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import includes = require("lodash.includes");
import cloneDeep = require("lodash.clonedeep");

const logger: Logger = Logger.getLogger("search-result.showroom.page");

export interface SearchLayoutProps extends HornetComponentProps {
    isVisible?: boolean;
}

export interface SearchCloseEventDetail {
    result: any;
}

export let SEARCH_CLOSE_EVENT = new HornetEvent<SearchCloseEventDetail>("SEARCH_CLOSE_EVENT");

/**
 * Composant de recherche dans le menu et affichage des résultats
 */
export class SearchLayout extends HornetComponent<SearchLayoutProps, any> {

    docs;
    searchContainer: any = null;
    static defaultProps = {
        isVisible: true,
    };

    constructor(props, context?: any) {
        super(props, context);

        if (!Utils.isServer) {
            this.docs = require("src/gen-doc/composantDoc");
        }

        this.listen(SEARCH_RESULT_EVENT, this.updateResult);

    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.remove(SEARCH_RESULT_EVENT, this.updateResult);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        const searchBarClassName = this.props.isVisible ? "search-bar" : "search-bar not-visible";

        const searchClassName = this.props.isVisible ? "search" : "search not-visible";

        const searchInputClassName = this.props.isVisible ? "" : "not-visible";
        const visibilityClassName = this.state.results ? "search-result-panel" : "search-result-panel result-hidden";

        let lastClassName = this.props.isVisible ? "search-result-panel-hidden" : "search-result-panel-hidden not-visible";
        lastClassName = ((this.state.results && this.state.results.length) && this.props.isVisible)
            ? "search-result-panel-container" : lastClassName;

        const placeHolder = this.i18n("menu.search.placeholder");

        return (

            <div className={searchBarClassName}>
                <div className={searchClassName}>
                    <input id="search-input"
                        className={searchInputClassName}
                        type="text"
                        name="search"
                        placeholder={placeHolder}
                        onInput={this.search}
                        onChange={this.openSearch} />

                    <img className="search-close-icon search-close-icon-hidden"
                        id={"search-close-icon-search"}
                        src={this.genUrlStatic("/img/close-icon.svg")}
                        onClick={this.closeSearch} />
                </div>

                <div id="search-result-panel-container" className={lastClassName} ref={(divContainer) => {
                    this.searchContainer = divContainer;
                }}>
                    <span id="result" />
                    <div className="result-panel">
                        <div className="search-result-panel">
                            {(this.state.results) ?
                                this.state.results.map((item, index) => {
                                    return <SearchResult item={item} key={index} />;
                                }) : null}
                        </div>
                    </div>
                </div>

            </div>

        );
    }

    /**
     * Mise à jour des résultats de recherche
     * @param event
     */
    updateResult(event) {
        const data = this.resultReceived(event);
        this.setState({ results: data });
    }

    /**
     * récupération des résultats de la recherche
     * @param event
     * @returns {Array}
     */
    resultReceived(event) {
        const results = event.detail.results;
        const formatedResults = [];
        this.formatResult(results, "", formatedResults);
        return formatedResults;
    }

    /**
     * Formattage des données reçues dans le résultat de la recherche
     * @param results résultats récupérés de la recherche
     * @param pathToResult chemin du composant
     * @param formatedResults résultats formatés
     */
    formatResult(results, pathToResult, formatedResults) {
        for (const key in results) {
            const pathComp = pathToResult + "/" + key;
            if (results[ key ].input) {
                const data = {
                    url: "/composant/page" + pathComp,
                    name: key,
                    before: results[ key ][ 1 ],
                    after: results[ key ][ 3 ],
                    all: results[ key ][ 0 ],
                    word: results[ key ][ 2 ],
                    path: pathComp,
                };
                formatedResults.push(data);
            } else {
                this.formatResult(results[ key ], pathComp, formatedResults);
            }
        }

    }

    /**
     * fermeture de l'affichage de recherche
     */
    private closeSearch() {
        const imgCross = document.getElementById("search-close-icon-search");
        imgCross.classList.add("search-close-icon-hidden");

        const elem = document.getElementById("showroom-menu-container");
        const result = document.getElementById("result");
        const inputSearch = document.getElementById("search-input") as any;

        if (elem) {
            elem.classList.remove("showroom-menu-hidden");
            inputSearch.value = "";

            if (!includes(result.classList, "showroom-result-hidden")) {
                result.classList.add("showroom-result-hidden");
            }

            if (!includes(this.searchContainer.classList, "search-result-panel-hidden")) {
                this.searchContainer.classList.add("search-result-panel-hidden");
            }
            this.setState({ results: [] });
        }
        this.fire(SEARCH_CLOSE_EVENT);
    }

    /**
     * Ouverture de l'affichage de recherche
     */
    private openSearch() {

        const value = (document.getElementById("search-input") as any).value;

        const imgCross = document.getElementById("search-close-icon-search");
        if (value) {

            imgCross.classList.remove("search-close-icon-hidden");
        } else {
            imgCross.classList.add("search-close-icon-hidden");
        }


        if (value && value.length > 2) {
            const elem = document.getElementById("showroom-menu-container");
            const result = document.getElementById("result");

            if (elem) {
                if (!includes(elem.classList, "showroom-menu-hidden")) {
                    elem.classList.add("showroom-menu-hidden");
                }

                if (this.searchContainer.classList) {
                    this.searchContainer.classList.remove("showroom-result-hidden");
                }

                result.classList.remove("showroom-result-hidden");
                this.searchContainer.classList.remove("search-result-panel-hidden");
                this.searchContainer.classList.add("search-result-panel-container");

            }
        }
    }

    /* nombre de résultats matchant la recherche*/
    protected matches: number = 0;

    /**
     * Fonction de recherche des md contenant le mot recherché
     * @param object
     * @param criteria
     * @returns {any}
     */
    protected searchData(object, criteria) {
        for (const key in object) {
            if (typeof object[ key ] === "string") {
                const test = object[ key ].match(
                    RegExp("((?:[a-z'-]+[^a-z'-]+){0,10})(" + criteria + ")((?:[^a-z'-]+[a-z'-]+){0,10})", "i"), "gi");

                if (!test) {
                    delete object[ key ];
                } else {
                    this.matches++;
                    object[ key ] = test;
                }
            } else {
                const child = this.searchData(object[ key ], criteria);
                object[ key ] = null;
                for (const children in child) {
                    if (child[ children ]) {
                        if (!object[ key ]) object[ key ] = {};
                        object[ key ][ children ] = child[ children ];
                    }
                }
                if (!object[ key ]) {
                    delete object[ key ];
                }
            }
        }
        return object;
    }

    /**
     * Lancement de la recherche des md contenant le mot rechercher
     */
    protected search() {
        const value = (document.getElementById("search-input") as any).value;
        if (value && value.length > 2) {

            this.matches = 0;
            const clone = cloneDeep(this.docs.comp);
            const result = this.searchData(clone, value);
            let message = this.i18n("menu.search.multipleResult");
            if (this.matches === 1) {
                message = this.i18n("menu.search.result");
            }
            (document.getElementById("result") as any).innerHTML = this.matches.toString() + " " + message;
            this.fire(SEARCH_RESULT_EVENT.withData({ results: result }));
        } else {
            (document.getElementById("result") as any).innerHTML = "";

            // fermeture du menu si il y a  moins de deux lettres
            const inputSearch = document.getElementById("search-input") as any;
            this.closeSearch();
            inputSearch.value = value;
        }
    }
}
