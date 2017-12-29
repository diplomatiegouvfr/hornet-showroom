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
 * @version v5.1.0
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import * as React from "react";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { MenuNavigation } from "src/widgets/navigation/menu-navigation";
import { MENU_LINK_ACTIVATED } from "src/widgets/navigation/menu-link";
import * as _ from "lodash";
import * as classnames from "classnames";
import * as classNames from "classnames";
import * as ReactDOM from "react-dom";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import { MenuInfoAccessibilite } from "hornet-js-react-components/src/widget/navigation/menu-info-accessibilite";
import { Utils } from "hornet-js-utils";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { UPDATE_PAGE_EXPAND_MENU } from "hornet-js-react-components/src/widget/screen/layout-switcher";

import HTMLAttributes = __React.HTMLAttributes;

const showIconSize = 720;

/**
 * Propriétés d'un élément de menu
 */
export interface MenuItemConfig {
    /** Identifiant unique au sein du menu */
    id?: string;
    /** URL éventuelle à atteindre lors d'un clic sur l'élément */
    url?: string;
    /** Clé du libellé dans les messages internationalisés */
    text: string;
    /** Clé de message internationalisé du texte dinfobulle affiché pour l'élément dans le plan de l'application */
    title?: string;
    /** Niveau de l'élément : 0 pour un élément à la racine d'un menu; 1 pour un élément d'un premier niveau de sous-menu; etc... */
    level?: number;
    /** Eléments de sous-menu de cet élément */
    submenu?: Array<MenuItemConfig>;
    /** Indique si l'élément doit être visible dans le menu */
    visibleDansMenu: boolean;
    /** Indique si l'élément doit être visible dans le plan */
    visibleDansPlan?: boolean;
    /** Nom de rôle ou liste de noms de rôles autorisé(s) à accéder à ce menu */
    rolesAutorises?: string | string[];
}


export interface MenuProps extends HornetComponentProps {
    configMenu?: MenuItemConfig[];
    /** Affichage du bouton d'accessibilité */
    showIconInfo?: boolean;
    /**
     * Largeur maximale de la zone de travail en pixel
     * Utilisé par le composant LayoutSwitcher pour agrandir ou rétrécir la
     * zone de travail
     */
    workingZoneWidth?: string;

    /** indique si le menu doit être affiché verticalement */
    vertical?: boolean;
    /** fonction appelée au click sur le toggler**/
    onToggleClick?: Function;
    /** Indique si le lien ne passe pas par le routeur */
    dataPassThru?: boolean;
    /** indique si le menu doit se fermer lors d'un click sur un lien */
    closeOnLinkClick?: boolean;
    /** indique si le menu doit se fermer lors d'un click en dehors de la zone */
    closeOnClickOutside?: boolean;
    /** indique si le menu doit se fermer lors d'une tabulation en dehors de la zone */
    closeOnTabOutside?: boolean;

    toggleMenuState?: boolean;

    isMenuOpen?: boolean;
}

export class Menu extends HornetComponent<MenuProps, any> {

    private burgerIcon: HTMLElement;

    static defaultProps = {
        closeOnLinkClick: true,
        closeOnClickOutside: true,
        closeOnTabOutside: true
    };

    constructor(props: MenuProps, context?: any) {
        super(props, context);

        this.state.items = this.props.configMenu ? NavigationUtils.getFilteredConfigNavigation(_.cloneDeep(this.props.configMenu), this.user) : NavigationUtils.getFilteredConfigNavigation(NavigationUtils.getConfigMenu(), this.user);
        if (this.props.closeOnClickOutside) this.handleMenuOutsideClick.bind(this);
        //this.state.isMenuActive = false;

        this.handleLayoutExpand();

        this.listen(UPDATE_PAGE_EXPAND_MENU, this.handleUpatePageMenuExpand);

        // /        this.listen(MENU_LINK_ACTIVATED, this.handleMajLink);
    }

    /**
     * Change la taille du menu lorque la taille de l'écran est modifiée
     */
    /*handleResize() {
        let show = window.innerWidth > showIconSize;
        this.setState({ shouldShowIconInfo: show });
    }*/

    /**
     * @inheritDoc
     */
    componentDidMount() {
        // window.addEventListener("resize", this.handleResize);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        //window.removeEventListener('resize', this.handleResize);
        // this.remove(MENU_LINK_ACTIVATED, this.handleMajLink);
        this.remove(UPDATE_PAGE_EXPAND_MENU, this.handleUpatePageMenuExpand);
    }

    /**
     * Gestion du clic clavier
     * @param event
     */
    private handleKeyDown(event: KeyboardEvent): void {
        /*echap*/
        let keyCode = event.keyCode;
        switch (keyCode) {
            case KeyCodes.ESCAPE:
                this.handleToggleMenu();
                this.burgerIcon.focus();
                break;
            /*tab si l'element focus n'est pas dans le menu, on ferme celui-ci*/
            case KeyCodes.TAB:
                if (this.state.closeOnTabOutside) {
                    let focus = document.activeElement;
                    let menuMain = document.getElementById("menu-main");
                    /*le changement de focus passe par le body*/
                    let body = document.body;
                    if (menuMain && focus && focus != menuMain && focus != body) {
                        let inMenu = menuMain.contains(focus);
                        if (!inMenu) {
                            this.handleToggleMenu();
                        }
                    }
                }
                break;
        }
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        let classname: any = {};
        if (typeof window != "undefined") {
            classname = {
                "vertical": this.state.vertical && (window.innerWidth > showIconSize) ? true : false,
                "menuHaut": true
            };
        } else {
            classname = {
                "vertical": this.state.vertical,
                "menuHaut": true
            };
        }

        let menuAttributes: HTMLAttributes<HTMLElement> = {};
        menuAttributes.className = classNames(classname);

        return (
            <nav id="menu-main" aria-label={this.i18n("menu.mainMenu")} data-title="Menu" {...menuAttributes}>
                {this.state.items.length > 0 ? this.renderMenuButton() : null}
                {!Utils.isServer ? this.renderNavigationMenu() : <div />}
            </nav>
        );
    }

    /**
     * Rendu du bouton burger du menu
     * @returns {any}
     */
    private renderMenuButton(): JSX.Element {

        let active = (this.props.toggleMenuState) ? this.props.toggleMenuState : false;
        let buttonClasses = {
            toggler: true,
            "is-active": active
        };

        return (
            <button className={classnames(buttonClasses)}
                onClick={this.handleToggleMenu.bind(this)}
                aria-controls="menu-container"
                aria-expanded={active}
                aria-haspopup={true}
                ref={(button) => {
                    this.burgerIcon = button;
                }}
            >
                <span>{active ? this.i18n("menu.closeMenu") : this.i18n("menu.openMenu")}</span>
            </button>
        );
    }

    /**
     * Rendu du menu vide (permet de gérer des transition css sur le menu)
     * @returns {any}
     */
    private renderEmptyNavigationMenu(): JSX.Element {
        return (
            <div className="menu-container" id="menu-container">
                <div className={"menuEmpty"}></div>
                <div className={"menu-content " + this.state.classNameExpanded}
                    style={{ maxWidth: this.state.currentWorkingZoneWidth }}>
                </div>
            </div>
        );
    }

    /**
     * Rendu du menu
     * @returns {any}
     */
    private renderNavigationMenu(): JSX.Element {

        /*if (this.state.isMenuActive) {
            let body = document.body;
            body.classList.add("noscroll");
        }*/

        let shouldShowIconInfo = this.state.shouldShowIconInfo;
        if (typeof shouldShowIconInfo == "undefined") {
            shouldShowIconInfo = window.innerWidth > showIconSize;
        }

        return (
            <div className="menu-container" id="menu-container">
                {this.props.closeOnClickOutside ? <div className="menu-overlay"
                    onClick={this.handleToggleMenu.bind(this)}></div> : null}

                <div className={"menu-content " + this.state.classNameExpanded}
                    style={{ maxWidth: this.state.currentWorkingZoneWidth }}>
                    {this.state.showIconInfo && shouldShowIconInfo ? <MenuInfoAccessibilite /> : null}
                    <MenuNavigation items={this.state.items} isMenuOpen={this.props.isMenuOpen}
                                    isVisible={this.state.toggleMenuState}
                                    closeMenu={this.handleToggleMenu.bind(this)}
                                    dataPassThru={this.props.dataPassThru}
                                    closeOnLinkClick={this.props.closeOnLinkClick}/>
                </div>
            </div>
        );
    }

    /**
     * Action permettant d'afficher/masquer le menu
     */
    handleToggleMenu() {

        var body = document.body;
        body.classList.remove("noscroll");
        let active = !this.state.toggleMenuState;
        if (!active) {
            document.removeEventListener("keydown", this.handleKeyDown, false);
        } else {
            document.addEventListener("keydown", this.handleKeyDown, false);
        }

        if (this.state.onToggleClick) {
            this.state.onToggleClick();
        }
        //this.setState({ isMenuActive: active });
    }


    componentDidUpdate() {
        //gestion de levent click ua chargement de la page
        if (typeof document !== undefined && this.props.closeOnClickOutside) {
            if (!this.state.toggleMenuState) {
                document.removeEventListener("click", this.handleMenuOutsideClick, false);
            } else {
                document.addEventListener("click", this.handleMenuOutsideClick, false);
            }

        }
    }

    /**
     *
     * @param e Event
     */
    handleMenuOutsideClick(e) {
        e.stopPropagation();
        return false;
    }

    private handleLayoutExpand() {
        // préparation de la taille pour le layout expanding
        let maxWidth;
        let classNameExpanded = "mainLayoutClassNameExpanded";
        if (!(Utils.appSharedProps.get("isExpandedLayout"))) {
            maxWidth = this.state.workingZoneWidth;
            classNameExpanded = "mainLayoutClassName";
        }
        this.state.currentWorkingZoneWidth = maxWidth;
        this.state.classNameExpanded = classNameExpanded;
    }

    /*private handleMajLink() {
        this.setState({ majlink: true });
    }*/

    private handleUpatePageMenuExpand() {
        this.handleLayoutExpand();
        this.setState({ maj: true });
    }

}