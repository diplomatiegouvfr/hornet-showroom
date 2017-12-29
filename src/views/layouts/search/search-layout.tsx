import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { SEARCH_RESULT_EVENT } from "src/views/layouts/hornet-app";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { SearchResult } from "src/views/layouts/search/search-result";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import * as _ from "lodash";

const logger: Logger = Utils.getLogger("search-result.showroom.page");

export interface SearchLayoutProps extends HornetComponentProps {
    isVisible?: boolean;
}

export interface SearchCloseEventDetail {
    result: any
}

export var SEARCH_CLOSE_EVENT = new HornetEvent<SearchCloseEventDetail>("SEARCH_CLOSE_EVENT");

/**
 * Composant de recherche dans le menu et affichage des résultats
 */
export class SearchLayout extends HornetComponent<SearchLayoutProps, any> {

    docs;
    searchContainer: any = null;
    static defaultProps = {
        isVisible: true
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

        let searchBarClassName = this.props.isVisible ? "search-bar" : "search-bar not-visible";

        let searchClassName = this.props.isVisible ? "search" : "search not-visible";

        let searchInputClassName = this.props.isVisible ? "" : "not-visible";
        let visibilityClassName = this.state.results ? "search-result-panel" : "search-result-panel result-hidden";

        let lastClassName = this.props.isVisible ? "search-result-panel-hidden" : "search-result-panel-hidden not-visible";
        lastClassName = ((this.state.results && this.state.results.length) && this.props.isVisible) ? "search-result-panel-container" : lastClassName;

        let placeHolder = this.i18n("menu.search.placeholder");

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
                            {this.state.results ? this.state.results.map((item, index) =>
                                <SearchResult item={item} key={index} />
                            ) : null}
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
        let data = this.resultReceived(event);
        this.setState({ results: data });
    }

    /**
     * récupération des résultats de la recherche
     * @param event
     * @returns {Array}
     */
    resultReceived(event) {
        let results = event.detail.results;
        let formatedResults = [];
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
        for (let key in results) {
            let path = pathToResult + "/" + key;
            if (results[ key ].input) {
                let data = {
                    "url": "/composant/page" + path,
                    "name": key,
                    "before": results[ key ][ 1 ],
                    "after": results[ key ][ 3 ],
                    "all": results[ key ][ 0 ],
                    "word": results[ key ][ 2 ],
                    "path": path
                };
                formatedResults.push(data);
            } else {
                this.formatResult(results[ key ], path, formatedResults);
            }
        }

    }

    /**
     * fermeture de l'affichage de recherche
     */
    private closeSearch() {
        let imgCross = document.getElementById("search-close-icon-search");
        imgCross.classList.add("search-close-icon-hidden");

        let elem = document.getElementById("showroom-menu-container");
        let result = document.getElementById("result");
        let inputSearch = document.getElementById("search-input") as any;

        if (elem) {
            elem.classList.remove("showroom-menu-hidden");
            inputSearch.value = "";

            if (!_.includes(result.classList, "showroom-result-hidden")) {
                result.classList.add("showroom-result-hidden");
            }

            if (!_.includes(this.searchContainer.classList, "search-result-panel-hidden")) {
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

        let value = (document.getElementById("search-input") as any).value;

        let imgCross = document.getElementById("search-close-icon-search");
        if (value) {

            imgCross.classList.remove("search-close-icon-hidden");
        } else {
            imgCross.classList.add("search-close-icon-hidden");
        }


        if (value && value.length > 2) {
            let elem = document.getElementById("showroom-menu-container");
            let result = document.getElementById("result");

            let resultPanel = document.getElementById("search-result-panel-container");

            if (elem) {
                if (!_.includes(elem.classList, "showroom-menu-hidden")) {
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
        for (var key in object) {
            if (typeof object[ key ] === "string") {
                let test = object[ key ].match(RegExp("((?:[a-z'-]+[^a-z'-]+){0,10})(" + criteria + ")((?:[^a-z'-]+[a-z'-]+){0,10})", "i"), "gi");
                if (!test) {
                    delete object[ key ];
                } else {
                    this.matches++;
                    object[ key ] = test;
                }
            } else {
                let child = this.searchData(object[ key ], criteria);
                object[ key ] = null;
                for (var children in child) {
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
        let value = (document.getElementById("search-input") as any).value;
        if (value && value.length > 2) {

            this.matches = 0;
            let clone = _.cloneDeep(this.docs.comp);
            let result = this.searchData(clone, value);
            let message = this.i18n("menu.search.multipleResult");
            if (this.matches == 1) {
                message = this.i18n("menu.search.result");
            }
            (document.getElementById("result") as any).innerHTML = this.matches.toString() + " " + message;
            this.fire(SEARCH_RESULT_EVENT.withData({ results: result }));
            //console.log("=>", result)
        } else {
            (document.getElementById("result") as any).innerHTML = "";

            // fermeture du menu si il y a  moins de deux lettres
            let inputSearch = document.getElementById("search-input") as any;
            this.closeSearch();
            inputSearch.value = value;
        }
    }

}