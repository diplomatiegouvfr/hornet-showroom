/**
 * Copyright ou © ou Copr. Ministère de l'Europe et des Affaires étrangères (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * Ce logiciel est un programme informatique servant à faciliter la création
 * d'applications Web conformément aux référentiels généraux français : RGI, RGS et RGAA
 * <p/>
 * Ce logiciel est régi par la licence CeCILL soumise au droit français et
 * respectant les principes de diffusion des logiciels libres. Vous pouvez
 * utiliser, modifier et/ou redistribuer ce programme sous les conditions
 * de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA
 * sur le site "http://www.cecill.info".
 * <p/>
 * En contrepartie de l'accessibilité au code source et des droits de copie,
 * de modification et de redistribution accordés par cette licence, il n'est
 * offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
 * seule une responsabilité restreinte pèse sur l'auteur du programme,  le
 * titulaire des droits patrimoniaux et les concédants successifs.
 * <p/>
 * A cet égard  l'attention de l'utilisateur est attirée sur les risques
 * associés au chargement,  à l'utilisation,  à la modification et/ou au
 * développement et à la reproduction du logiciel par l'utilisateur étant
 * donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 * manipuler et qui le réserve donc à des développeurs et des professionnels
 * avertis possédant  des  connaissances  informatiques approfondies.  Les
 * utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
 * logiciel à leurs besoins dans des conditions permettant d'assurer la
 * sécurité de leurs systèmes et ou de leurs données et, plus généralement,
 * à l'utiliser et l'exploiter dans les mêmes conditions de sécurité.
 * <p/>
 * Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 * pris connaissance de la licence CeCILL, et que vous en avez accepté les
 * termes.
 * <p/>
 * <p/>
 * Copyright or © or Copr. Ministry for Europe and Foreign Affairs (2017)
 * <p/>
 * pole-architecture.dga-dsi-psi@diplomatie.gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to facilitate creation of
 * web application in accordance with french general repositories : RGI, RGS and RGAA.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software.  You can  use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 *
 */

/**
 * hornet-js-react-components - Ensemble des composants web React de base de hornet-js
 *
 * @author MEAE - Ministère de l'Europe et des Affaires étrangères
 * @version v5.2.4
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as React from "react";
import { MenuItemConfig } from "src/widgets/navigation/menu";
import { MENU_ROOT, LVL_SEPARATOR, MASKED_CLASSNAME } from "hornet-js-components/src/utils/menu-constantes";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { MenuLink } from "src/widgets/navigation/menu-link";
import * as classNames from "classnames";
import KeyboardEvent = __React.KeyboardEvent;
import HTMLAttributes = __React.HTMLAttributes;
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import { UPDATE_PAGE_EXPAND } from "hornet-js-react-components/src/widget/screen/layout-switcher";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";

const expandBreakPointSize = 1640;
const expandSecondBreakPointSize = 1400;
const expandMenuSize = "16.5%";
const expandReducMenuSize = "20%";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.navigation.menu-navigation");

/**
 * Propriétés MenuNavigation
 */
export interface MenuNavigationProps extends HornetComponentProps {
    /* Elements du même niveau de menu */
    items: Array<MenuItemConfig>;
    /* Profondeur dans l'arborescence du menu : zéro pour la racine */
    level?: number;
    /* Booléen déterminant si le lien est affiché */
    isVisible?: boolean;
    /* Dans le cas d'un enfant; identifiant du parent */
    idParent?: string;
    /* Elements complémentaires du menu */
    infosComplementaires?: React.ReactElement<HornetComponentProps>[];
    /* méthode de fermeture du menu */
    closeMenu: Function;
    /* Indique si le lien ne passe pas par le routeur */
    dataPassThru?: boolean;
    /** indique si le menu doit se fermer lors d'un click sur un lien */
    closeOnLinkClick?: boolean;

    /** Determine l'etat du toggle */
    toggleMenState?: boolean;

    isMenuOpen?: boolean;
}

/**
 * Propriétés MenuItem
 */
export interface MenuItemProps extends HornetComponentProps {
    item: MenuItemConfig;
    isSubMenu: boolean;
    /* Booléen déterminant si le lien est affiché */
    isVisible?: boolean;
    /*méthode de fermeture du menu*/
    closeMenu: Function;
    /* Indique si le lien ne passe pas par le routeur */
    dataPassThru?: boolean;
    /** indique si le menu doit se fermer lors d'un click sur un lien */
    closeOnLinkClick?: boolean;

    isMenuOpen?: boolean;
}

/**
 * Menu Item
 */
export class MenuItem extends HornetComponent<MenuItemProps, any> {

    static defaultProps = {
        item: {},
        isSubMenu: false,
        isVisible: false,
    };

    constructor(props, context) {
        super(props, context);

        /* calcule la taille des menus*/
        const test = Utils.getCls("hornet.pageLayoutWidth");
        let cssStyle = {
            width: "",
        };
        const isSubMenu: boolean = this.state.isSubMenu;
        if (!isSubMenu) {
            if (window.innerWidth > expandBreakPointSize) {
                cssStyle = {
                    width: ((test === "")) ? expandMenuSize : "",
                };
            } else if (window.innerWidth > expandSecondBreakPointSize) {
                cssStyle = {
                    width: ((test === "")) ? expandReducMenuSize : "",
                };
            }
        }
        this.state = {
            ...this.state,
            style: cssStyle,
        };

    }

    /**
     * Calcule la taille du menu en fonction de la taille de l'écran
     */
    resizeMenu() {
        const test = Utils.getCls("hornet.pageLayoutWidth");
        let cssStyle = {
            width: "",
        };
        const isSubMenu: boolean = this.state.isSubMenu;
        if (!isSubMenu) {
            if (window.innerWidth > expandBreakPointSize) {
                cssStyle = {
                    width: ((test === "")) ? expandMenuSize : "",
                };
            } else if (window.innerWidth > expandSecondBreakPointSize) {
                cssStyle = {
                    width: ((test === "")) ? expandReducMenuSize : "",
                };
            }
        }
        this.setState({ style: cssStyle });
    }

    /**
     * Change la taille du menu lorque la taille de l'écran est modifiée
     */
    handleResize() {
        this.resizeMenu();
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        super.componentDidMount();
        // window.addEventListener("resize", this.handleResize);
        // this.listen(UPDATE_PAGE_EXPAND, this.resizeMenu);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        super.componentWillUnmount();
        // window.removeEventListener("resize", this.handleResize);
        // this.remove(UPDATE_PAGE_EXPAND, this.resizeMenu);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        const item: MenuItemConfig = this.state.item;
        const isSubMenu: boolean = this.state.isSubMenu;
        if (item.visibleDansMenu) {
            // logger.debug("MenuItem.render item.id : ", item.id);
            const attributesLi: HTMLAttributes<HTMLElement> = {};

            let active = false;
            if (typeof window !== "undefined") {
                let url = window.location.pathname;
                const ind = url.indexOf(this.getContextPath());
                if (ind > -1) {
                    url = url.substring(this.getContextPath().length, url.length);
                }
                const activeMenu = NavigationUtils.getCurrentItem([ this.state.item ], url);

                if (activeMenu) {
                    active = true;
                }
            }

            /*on créer un identifiant pour la balise li*/
            attributesLi.id = this.getLiId();

            const isHidden = !(this.isVisible());
            const isActive = (active) ? " is-active" : "";
            const hidden = (isHidden) && !(active) ? " " + MASKED_CLASSNAME : "";
            attributesLi.className = (isSubMenu) ? "sub-nav-item" : "nav-item";
            attributesLi.className = attributesLi.className + hidden + isActive;

            const expanded = window.innerWidth > 1200 ? true : !isHidden;
            attributesLi.role = (item.level < 2) ? "presentation" : null;

            let subMenu: JSX.Element = <div></div>;
            if (item.url && NavigationUtils.hasVisibleSubMenu(item)) {
                // logger.warn("Le menu «" + this.i18n(item.text) + "» possède des sous menus, il ne devrait pas avoir d'url");
            }


            let menuName = item.text.replace(/[\.\s]/g, "-").toLowerCase();
            menuName = menuName.replace(/-$/g, "");
            attributesLi.className += " menu-link-" + menuName;

            const closeOnLinkClick = this.props.closeOnLinkClick;
            const menuOpen = this.props.isMenuOpen;
            if (this.hasSubMenu()) {
                subMenu = <MenuNavigation items={item.submenu}
                    level={item.level + 1} isMenuOpen={menuOpen}
                    idParent={item.id}
                    closeMenu={this.state.closeMenu}
                    dataPassThru={this.state.dataPassThru}
                    closeOnLinkClick={closeOnLinkClick}
                />;
            }
            return (
                <li {...attributesLi} aria-expanded={expanded} onKeyDown={this.handleKeyDown} style={this.state.style}>
                    <MenuLink item={item}
                        closeMenu={this.state.closeMenu}
                        onClick={this.hideOrShowChildren}
                        dataPassThru={this.props.dataPassThru}
                        closeOnLinkClick={closeOnLinkClick}
                    />
                    {subMenu}
                </li>
            );
        }
        else {
            return null;
        }
    }

    /**
     * Fait apparaitre ou disparaitre les sous menus
     */
    public hideOrShowChildren() {
        const item: MenuItemConfig = this.state.item;
        const liId = this.getLiId();
        const elem = document.getElementById(liId);
        if (elem) {
            const isVisible = NavigationUtils.isVisible(elem);
            if (isVisible && this.props.isMenuOpen) {
                NavigationUtils.hideElement(elem);
            } else {
                NavigationUtils.showElement(elem);
            }
        }
    }

    /**
     * teste si le sous menu est visible ou non
     * @returns {boolean|any} le sous menu est visible
     */
    private isVisible(): boolean {
        const liId = this.getLiId();
        const elem = document.getElementById(liId);
        if (elem) {
            return NavigationUtils.isVisible(elem);
        }
        return false;
    }

    /**
     * test si le menu parent est visible
     * @returns {boolean} le menu parent est visible
     */
    private isParentVisible(): boolean {
        const liId = this.getLiId();
        const ind = liId.lastIndexOf(LVL_SEPARATOR);
        const parentLiId = liId.substring(0, ind);
        const parentLi = document.getElementById(parentLiId);
        if (parentLi) {
            return NavigationUtils.isVisible(parentLi);
        }
        return false;
    }

    /*
     * Retourne l'identiant de la balise li du menu item
     * @returns {string} identifiant de la balise li
     */
    private getLiId() {
        const item: MenuItemConfig = this.state.item;
        const liId: string = item.id.substring(MENU_ROOT.length - 1, item.id.length);
        return "li" + liId;
    }

    /**
     * Ferme le menu contenant le menu item
     */
    private hideMenu() {
        const isSubMenu: boolean = this.state.isSubMenu;
        if (isSubMenu) {
            const item: MenuItemConfig = this.state.item;
            if (this.hasSubMenu()) {
                this.hideOrShowChildren();
            } else {
                const liId = this.getLiId();
                const ind = liId.lastIndexOf(LVL_SEPARATOR);
                const parentLiId = liId.substring(0, ind);
                const parentLi = document.getElementById(parentLiId);
                if (parentLi) {
                    NavigationUtils.hideElement(parentLi);
                    const navId = "nav" + parentLiId.substring(2, parentLiId.length);
                    NavigationUtils.setFocus(navId);
                }
            }
        }

    }

    /**
     * cache un menu et tous ses sous-menus
     * @param parentId identifiant de la balise li qui doit être cachée
     */
    private hideAllMenu(parentId) {

        const elem = document.getElementById(parentId);
        if (elem) {
            NavigationUtils.hideElement(elem);
        }

        /*On récupère le premier item du sous menu, si il n'existe pas, il n'y a pas de sous-menu*/
        const firstChildId = parentId + LVL_SEPARATOR + 0;
        let childElem = document.getElementById(firstChildId);
        let ind = 0;
        if (childElem) {
            while (childElem) {
                let id = parentId + LVL_SEPARATOR + ind;
                this.hideAllMenu(id);
                ind++;
                id = parentId + LVL_SEPARATOR + ind;
                childElem = document.getElementById(id);

            }
        }
    }

    /**
     * ferme tous les menu parents et va au menu suivant
     */
    private hideAllParentMenu() {
        let liId = this.getLiId();
        const ind = liId.indexOf(LVL_SEPARATOR, 3);
        liId = liId.substring(0, ind);
        this.hideAllMenu(liId);
    }

    /**
     * teste si le menu a des sous menus
     * @returns {boolean} le menu a des sous menus
     */
    private hasSubMenu() {
        return this.state.item.submenu && this.state.item.submenu.length > 0;
    }

    /**
     * Fonction appelée lors d'un appui de touche sur un élément de menu.
     * @param e évenèment déclencheur
     * @private
     */
    private handleKeyDown(event) {
        const keyCode = event.keyCode;
        const isVisible = this.isVisible();
        const isSubMenu: boolean = this.state.isSubMenu;
        switch (keyCode) {
            case KeyCodes.DOWN_ARROW:
                /*si c'est un sous menu on rend visible ses items */
                if (!isSubMenu && !isVisible) {
                    if (this.hasSubMenu()) {
                        this.hideOrShowChildren();
                    }
                }
                break;
            case KeyCodes.RIGHT_ARROW:
                /*si c'est un sous menu on cache/rend visible ses items s'il en a
                * ou on ferme le menu et on passe au suivant si il n'en a pas*/
                if (isSubMenu && !isVisible) {
                    if (this.hasSubMenu()) {
                        this.hideOrShowChildren();
                    } else {
                        this.hideAllParentMenu();
                    }
                }
                break;
            case KeyCodes.LEFT_ARROW:
                /*si c'est un item n'ayant pas de sous menu, on le cache*/
                if (isSubMenu) {
                    if (isVisible || !(this.hasSubMenu())) {
                        this.hideMenu();
                    } else {
                        let liId = this.getLiId();
                        const ind = liId.lastIndexOf(LVL_SEPARATOR);
                        liId = liId.substring(0, ind);
                        this.hideAllMenu(liId);
                    }
                }
                break;
            case KeyCodes.ENTER:
                let navId = this.state.item.id;
                navId = navId + LVL_SEPARATOR + "0";
                NavigationUtils.setFocus(navId);
        }
    }

}


/**
 * Groupe d'éléments de menu
 * @type {ComponentClass<MenuNavigationProps>}
 */
export class MenuNavigation extends HornetComponent<MenuNavigationProps, any> {

    static defaultProps = {
        items: [],
        level: 0,
    };

    componentDidMount() {
        super.componentDidMount();
        const id = "nav" + LVL_SEPARATOR + "0";
        const element = document.getElementById(id);
        if (element) {
            element.focus();
        }
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        const level: number = this.props.level;
        const isVisible: boolean = this.props.isVisible;
        // logger.debug("MenuNavigation.render idParent : ", this.state.idParent);
        let infoComplementaires: JSX.Element;

        // Menu de premier niveau
        if (this.state.level === 0) {
            infoComplementaires = this.state.infosComplementaires;
        } else {
            infoComplementaires = <div></div>;
        }

        const closeMenu = this.state.closeMenu;
        const isSubMenu: boolean = (this.state.level !== 0);
        let indexKey = 0;
        const dataPassThru = this.props.dataPassThru;
        const closeOnLinkClick = this.props.closeOnLinkClick;
        const menuOpen = this.props.isMenuOpen;
        const items: MenuItem[] = this.state.items.map(function (item: MenuItemConfig) {
            if (item.visibleDansMenu) {
                indexKey++;
                return <MenuItem item={item} isMenuOpen={menuOpen}
                    isSubMenu={isSubMenu}
                    key={indexKey + item.text + item.url}
                    closeMenu={closeMenu}
                    dataPassThru={dataPassThru}
                    closeOnLinkClick={closeOnLinkClick} />;
            }
        });

        const classes: ClassDictionary = {
            nav: true,
            "flex-container": true,
            "sub-nav-1": (level === 1),
            "sub-nav-2": (level === 2),
            masked: !isVisible,
        };

        const attributesUl: HTMLAttributes<HTMLElement> = {};
        attributesUl.className = classNames(classes);

        if (level === 0) {
            /* le premier niveau de menu est horizontal */
            attributesUl.onKeyDown = this.onKeyDownHorizontalMenu;
        } else {
            /* les sous menus sont ensuite verticaux */
            attributesUl.onKeyDown = this.onKeyDownVerticalMenu;
        }
        attributesUl[ "aria-labelledby" ] = (this.state.idParent) ? this.state.idParent : null;

        return (
            <ul {...attributesUl}>
                {items}
                {infoComplementaires}
            </ul>
        );
    }

    /**
     * @param id identifiant de l'élément de menu
     * @return {number} l'index de l'élément parent au niveau de menu zéro (0 pour le premier élément)
     */
    private static getRootParentIndex(id: string): number {
        const beginIndex: number = MENU_ROOT.length;
        let endIndex: number = id.indexOf(LVL_SEPARATOR, beginIndex);
        if (endIndex < 0) {
            endIndex = id.length;
        }
        return parseInt(id.substr(beginIndex, endIndex), 10);
    }

    /**
     * @param e évènement clavier
     * @returns {boolean} true lorsque l'évènement clavier à au moins l'un des modificateurs actifs (tels que Alt, Ctrl, etc...)
     */
    private hasKeyModifier(e: KeyboardEvent<HTMLElement>): boolean {
        return (e !== null && (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey));
    }

    /**
     * Fonction appelée lors d'un appui de touche sur un élément de menu horizontal.
     * @param e évenèment déclencheur
     * @private
     */
    private onKeyDownHorizontalMenu(e: KeyboardEvent<HTMLElement>): void {
        if (!this.hasKeyModifier(e)) {
            /* On ne prend en compte que les évènements clavier sans modificateur, pour ne pas surcharger
             * des raccourcis standards tels Alt+ArrowLeft */
            const keyCode: number = e.keyCode;
            const id: string = e.target[ "id" ];
            if (id) {
                const lastSeparatorIndex: number = id.lastIndexOf(LVL_SEPARATOR);
                const itemHierarchy: string = id.substr(0, lastSeparatorIndex + 1);
                const itemIndex: number = parseInt(id.substr(lastSeparatorIndex + 1, id.length), 10);
                const items: MenuItemConfig[] = this.state.items;
                /* Element de menu courant : peut être null lorsqu'on est sur un élément MenuInfosComplementaires */
                const item: MenuItemConfig = items[ itemIndex ];
                let idToFocus: string = id;
                let preventDefault: boolean = true;
                switch (keyCode) {
                    case KeyCodes.RIGHT_ARROW:
                        // on n'est pas sur le dernier item du niveau : vers item suivant de même niveau
                        /* Attention il y a éventuellement des MenuInfosComplementaires à la suite de items */
                        if (MenuNavigation.isElementExists(itemHierarchy + (itemIndex + 1))) {
                            idToFocus = itemHierarchy + (itemIndex + 1);
                        } // sinon retour au premier item de même niveau
                        else {
                            idToFocus = items[ 0 ].id;
                        }
                        break;
                    case KeyCodes.LEFT_ARROW:
                        // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                        if (itemIndex > 0) {
                            idToFocus = items[ itemIndex - 1 ].id;
                        } // sinon retour au dernier item de même niveau
                        else {
                            // indiceToFocus = items[items.length - 1].index;
                            let indexToFocus: number = items.length - 1;
                            /* On ne se base pas sur items.length car il y a éventuellement des MenuInfosComplementaires à la suite */
                            let last: boolean = false;
                            while (!last) {
                                // if (MenuNavigation.isElementExists(indiceToFocus + 1)) {
                                if (MenuNavigation.isElementExists(itemHierarchy + (indexToFocus + 1))) {
                                    // indiceToFocus++;
                                    indexToFocus++;
                                } else {
                                    last = true;
                                }
                            }
                            idToFocus = itemHierarchy + indexToFocus;
                        }
                        break;
                    case KeyCodes.DOWN_ARROW:
                        /*  sous-menu existant : on va au premier élément du sou-menu */
                        if (item && item.submenu && item.submenu[ 0 ]) {
                            // indiceToFocus = item.submenu[0].index;
                            idToFocus = item.submenu[ 0 ].id;
                        }

                        break;
                    case KeyCodes.UP_ARROW:
                        // on ne fait un changement qu'à partir du niveau 2
                        break;
                    case KeyCodes.ESCAPE:
                        NavigationUtils.setFocus("menu-main");
                        break;
                    case KeyCodes.ENTER:
                    case KeyCodes.SPACEBAR:
                        idToFocus = id + LVL_SEPARATOR + "0";
                    default:
                        preventDefault = false;
                }
                if (idToFocus !== id) {
                    NavigationUtils.setFocus(idToFocus);
                }
                /* On supprime le comportement par défaut pour les touches utilisées pour la navigation: 
                pour éviter par exemple de faire défiler les ascenseurs */
                if (preventDefault) {
                    e.preventDefault();
                }
            }
        }
    }

    /**
     * Fonction appelée lors d'un appui de touche sur un élément de menu vertical
     * @param e
     * @private
     */
    private onKeyDownVerticalMenu(e: KeyboardEvent<HTMLElement>): void {
        if (!this.hasKeyModifier(e)) {
            /* On ne prend en compte que les évènements clavier sans modificateur, pour ne pas surcharger
             * des raccourcis standards tels Alt+ArrowLeft */
            const key: number = e.keyCode;
            const id: string = e.target[ "id" ];
            if (id) {
                const lastSeparatorIndex: number = id.lastIndexOf(LVL_SEPARATOR);
                const itemHierarchy: string = id.substr(0, lastSeparatorIndex + 1);
                const itemIndex: number = parseInt(id.substr(lastSeparatorIndex + 1, id.length), 10);
                const items: MenuItemConfig[] = this.state.items;

                let idToFocus: string = id;
                let preventDefault: boolean = true;

                switch (key) {
                    case KeyCodes.RIGHT_ARROW:
                        /* Element de menu courant : peut être null lorsqu'on est sur un élément MenuInfosComplementaires */
                        const item: MenuItemConfig = items[ itemIndex ];
                        /*  sous-menu existant : on va au premier élément du sous-menu */
                        if (item && item.submenu && item.submenu[ 0 ]) {
                            idToFocus = item.submenu[ 0 ].id;
                        } else {
                            /* On va à l"élément de niveau 0 suivant */
                            const rootParentIndex: number = MenuNavigation.getRootParentIndex(id);
                            /* On ne se base pas sur items.length car il y a éventuellement des MenuInfosComplementaires à la suite */
                            if (MenuNavigation.isElementExists(MENU_ROOT + (rootParentIndex + 1))) {
                                idToFocus = MENU_ROOT + (rootParentIndex + 1);
                            } // sinon retour au premier item de niveau 0
                            else {
                                idToFocus = MENU_ROOT + "0";
                            }
                        }
                        break;
                    case KeyCodes.ESCAPE:
                        /* On va à l"élément parent */
                        idToFocus = this.state.idParent;
                        break;
                    case KeyCodes.LEFT_ARROW:
                        /* premier niveau de sous-menu : on va à l'élément de niveau 0 précédent*/
                        if (this.state.level === 1) {
                            const rootParentIndex: number = MenuNavigation.getRootParentIndex(id);
                            // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                            if (rootParentIndex > 0) {
                                idToFocus = MENU_ROOT + (rootParentIndex - 1);
                            }// sinon retour au dernier item de même niveau
                            else {
                                let indexToFocus: number = rootParentIndex;
                                let last: boolean = false;
                                while (!last) {
                                    if (MenuNavigation.isElementExists(MENU_ROOT + (indexToFocus + 1))) {
                                        indexToFocus++;
                                    } else {
                                        last = true;
                                    }
                                }
                                idToFocus = MENU_ROOT + (indexToFocus + 1);
                            }
                        } else {
                            /* On va à l'élément parent */
                            idToFocus = this.state.idParent;
                        }
                        break;
                    case KeyCodes.DOWN_ARROW:
                        // si on n'est pas sur le dernier item du niveau : vers item suivant de même niveau
                        if (itemIndex < (items.length - 1)) {
                            idToFocus = itemHierarchy + (itemIndex + 1);
                        } // sinon retour au premier item de même niveau
                        else {
                            idToFocus = items[ 0 ].id;
                        }

                        break;
                    case KeyCodes.UP_ARROW:
                        // on n'est pas sur le premier item du niveau : vers item précédent de même niveau
                        if (itemIndex > 0) {
                            idToFocus = itemHierarchy + (itemIndex - 1);
                        }// sinon retour au dernier item de même niveau
                        else {
                            idToFocus = items[ items.length - 1 ].id;
                        }
                        break;
                    case KeyCodes.ENTER:
                    case KeyCodes.SPACEBAR:
                        idToFocus = id + LVL_SEPARATOR + "0";
                    default:
                        preventDefault = false;
                }
                if (idToFocus !== id) {
                    NavigationUtils.setFocus(idToFocus);
                }
                /* On stoppe si nécessaire la propagation pour éviter de redéclencher ce handler sur les éléments de menu parents */
                e.stopPropagation();
                /* On supprime le comportement par défaut pour les touches utilisées pour la navigation:
                 pour éviter par exemple de faire défiler les ascenceurs */
                if (preventDefault) {
                    e.preventDefault();
                }
            }
        }
    }


    /**
     * Test si un element existe
     * @param id identifiant de l'élément à vérifier
     * @returns boolean
     * @private
     */
    static isElementExists(id: string): boolean {
        return (document.getElementById(id) && document.getElementById(id).focus !== null);
    }

}
