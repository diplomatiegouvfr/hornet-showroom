import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { HornetContent } from "src/views/layouts/hornet-content";
import { URL_CHANGE_EVENT } from "hornet-js-core/src/routes/router-client-async-elements";
import * as classNames from "classnames";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { UPDATE_PAGE_EXPAND } from "hornet-js-react-components/src/widget/screen/layout-switcher";

import * as _ from "lodash";
import { SEARCH_CLOSE_EVENT, SearchLayout } from "src/views/layouts/search/search-layout";
import { MENU_OPEN_EVENT, MenuShowroom } from "src/views/layouts/menu-showroom";
import { MENU_LINK_ACTIVATED } from "src/widgets/navigation/menu-link";

const logger: Logger = Utils.getLogger("hornet-showroom.views.layouts.hornet-app");

export interface SearchResultEventDetail {
    results: any;
}
export const SEARCH_RESULT_EVENT = new HornetEvent<SearchResultEventDetail>("SEARCH_RESULT_EVENT");

export interface StopHighlightEventDetail {
}
export const STOP_HIGHLIGHT_EVENT = new HornetEvent<StopHighlightEventDetail>("STOP_HIGHLIGHT_EVENT");

export interface HornetAppProps extends HornetComponentProps {
    componentContext: any;
    context: any;
    relativeLogoUrl: string;
    content: Class<HornetPage<any, any, any>>;
}

export class HornetApp extends HornetPage<any, HornetAppProps, any> {

    elementToFocus: string;

    constructor(props: HornetAppProps, context?: any) {
        super(props, context);

        this.state = {
            ...this.state,
            logoUrl: this.genUrlStatic(props.relativeLogoUrl),
            content: props.content,
            isMenuOpen: false,
        };

        this.listen(URL_CHANGE_EVENT, (ev) => {

            const currentPath = ev.detail.newPath;
            const title = NavigationUtils.retrievePageTextKey(NavigationUtils.getConfigMenu(), currentPath);

            NavigationUtils.applyTitlePageOnClient(this.i18n("applicationTitle") + "  - " + this.i18n(title));
        });

        this.listen(UPDATE_PAGE_EXPAND, (ev: HornetEvent<boolean>) => {
            const configMax = 1200;
            let maxWidth;
            if (typeof Utils.getCls("hornet.pageLayoutWidth") === "undefined") {
                maxWidth = "";
            } else {
                if (window.document.getElementById("page").style.maxWidth.length === 0) {
                    maxWidth = configMax;
                } else {
                    maxWidth = "";
                }
            }
            Utils.setCls("hornet.pageLayoutWidth", maxWidth);
            logger.trace("changement des props d'affichage de l'utilisateur :" + maxWidth);
            this.forceUpdate();
        });

        this.listen(MENU_OPEN_EVENT, this.menuIsOpen);
        this.listen(SEARCH_CLOSE_EVENT, this.searchClose);
        this.listen(MENU_LINK_ACTIVATED, this.menuLinkActived);


    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.remove(MENU_OPEN_EVENT, this.menuIsOpen);
        this.remove(SEARCH_CLOSE_EVENT, this.searchClose);
        this.remove(MENU_LINK_ACTIVATED, this.menuLinkActived);
    }

    componentDidUpdate() {
        if (this.elementToFocus) {
            const elem = document.getElementById(this.elementToFocus);
            if (elem) {
                // on scroll une première fois avant pour un meilleur effet visuel
                elem.scrollIntoView();
                elem.focus();
                setTimeout(function () { elem.scrollIntoView(); elem.focus(); }, 500);
            }
            this.elementToFocus = null;
        }
    }

    static defaultProps = {
        composantPage: null,
        relativeLogoUrl: "/img/logoHornet.png",
        workingZoneWidth: "100%",
    };

    onClickLinkFullscreen() {
        this.setState({ modeFullscreen: !this.state.modeFullscreen });
    }

    /**
     * @inheritDoc
     */
    prepareClient() {
    }


    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HornetApp render");
        const title = this.i18n("applicationTitle");

        const classes: any = {
            "mode-fullscreen": this.state.modeFullscreen,
        };

        const messIntl = this.i18n("header");

        const applicationTitle = this.i18n("applicationTitle");

        const lienAide = (this.state.linkHelpVisible) ?
            <li><a title={messIntl.help + applicationTitle} href={this.genUrl("/aide")}>{messIntl.help}</a></li>
            : null;

        const menuClassName = this.state.isMenuOpen ? "fl menu-showroom menuOpen" : "fl menu-showroom menuClosed";

        return (
            <div id="site" className={classNames(classes)}>
                <div className="header-showroom">
                    <div className={menuClassName}>
                        <div className="logo-showroom">
                            {this.state.isMenuOpen ?
                                <a href={this.genUrl(Utils.config.getOrDefault("welcomePage", "/"))} title={title}
                                    id="img-logo">
                                    <img src={this.genUrlStatic("/img/logo_hornet_showroom.png")}
                                        alt={this.i18n("applicationTitle")} />
                                </a> : <div />}
                        </div>
                        <SearchLayout isVisible={this.state.isMenuOpen} />
                        <MenuShowroom menuState={this.state.isMenuOpen} />

                    </div>
                </div>
                <HornetContent content={this.state.content} isMenuVisible={this.state.isMenuOpen} />
            </div>
        );
    }

    /**
     * Changement de langue
     * @param i18nLocale
     */
    private changeInternationalization(i18nLocale: string) {

        this.getService().changeLanguage({ hornetI18n: i18nLocale }, (retourApi) => {
            logger.trace("Retour API PartenaireApi.rechercher :", retourApi.body);
            Utils.setCls("hornet.internationalization", retourApi.body);
            this.forceUpdate();
        });
    }

    /**
     * Gère l'ouverture du menu
     */
    private menuIsOpen(event) {
        this.setState({ isMenuOpen: event.detail.open });
    }

    /**
     * Supprime le surlignage du mot rechercher
     * @param event
     */
    searchClose(event) {
        this.deleteNavigateData();
        this.fire(STOP_HIGHLIGHT_EVENT);
    }


    private menuLinkActived(event) {
        if (!this.state.isMenuOpen) {
            this.elementToFocus = event.detail.linkId;
        }
        this.setState({ isMenuOpen: true });
    }
}
