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
 * @version v5.2.3
 * @link git+https://github.com/diplomatiegouvfr/hornet-js.git
 * @license CECILL-2.1
 */

import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as React from "react";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { IMenuItem } from "hornet-js-components/src/component/imenu-item";
import {
    HAVING_SUBMENU_CLASSNAME,
    MENU_ROOT,
    DOWN_ARROW_IMG_HOVER,
    DOWN_ARROW_IMG,
    RIGHT_ARROW_IMG_HOVER,
    RIGHT_ARROW_IMG,
    IMG_PATH
} from "hornet-js-components/src/utils/menu-constantes";
import { KeyCodes } from "hornet-js-components/src/event/key-codes";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import { fireHornetEvent } from "hornet-js-core/src/event/hornet-event";

const logger: Logger = Utils.getLogger("hornet-js-react-components.widget.navigation.menu-link");

export interface LinkActivatedDetail {
    linkId: string;
}

export var MENU_LINK_ACTIVATED = new HornetEvent<LinkActivatedDetail>("MENU_LINK_ACTIVATED");

export interface MenuLinkProps extends HornetComponentProps {
    /* Object représentant l'élément de menu */
    item: IMenuItem;
    /* Fonction servant à propager la modification l'état de visibilité du sous-menu*/
    setSubmenuVisibleHandler?: Function;
    /* Indique si le lien ne passe pas par le routeur */
    dataPassThru?: boolean;
    /* Surcharge du path afin de modifier les images par défaut */
    imgFilePath?: string;
    /*méthode de fermeture du menu*/
    closeMenu: Function;
    /*méthode appelée en cliquant sur le texte*/
    onClick?: Function;
    /** indique si le menu doit se fermer lors d'un click sur un lien */
    closeOnLinkClick?: boolean;
}

/**
 * Lien d"un élément de menu
 * @type {ComponentClass<MenuLinkProps>}
 */
export class MenuLink extends HornetComponent<MenuLinkProps, any> {

    static defaultProps = {
        item: {},
        dataPassThru: false
    };

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        let item = this.state.item;
        let attributesA = {};

        let hasSubMenu = NavigationUtils.hasVisibleSubMenu(item);
        attributesA[ "href" ] = (item.url) ? this.genUrl(item.url) : "#";
        attributesA[ "className" ] = hasSubMenu ? HAVING_SUBMENU_CLASSNAME : null;
        attributesA[ "id" ] = item.id;
        attributesA[ "data-indice" ] = item.id;
        attributesA[ "title" ] = this.i18n(item.text);
        if (this.state.dataPassThru) {
            attributesA[ "data-pass-thru" ] = "true";
        }
        /* On se branche sur les évènements React onMouseEnter et onMouseLeave car plusieurs évènements
         onMouseOver et onMouseOut sont déclenchés et génèrent donc un rendu React pour le survol d'un même élément de menu */
        attributesA[ "onMouseEnter" ] = this.handleMouseEnter;
        attributesA[ "onMouseLeave" ] = this.handleMouseLeave;
        /* On n'accède pas aux éléments de menu (autres que le premier) via la tabulation */
        if (item.id === MENU_ROOT + "0") {
            attributesA[ "tabIndex" ] = 0;
        } else {
            attributesA[ "tabIndex" ] = -1;
        }
        let subMenuLibelle = this.i18n("navigation.submenu");
        return (
            <a {...attributesA} onKeyDown={this.handleKeyDown} onClick={this.activateLink}>
                <span className="menulink-title">
                    {this.i18n(item.text)}
                </span>
            </a>);
    }

    /**
     * Gestion du clic sur entrer ou espace
     * @param event
     */
    private handleKeyDown(event): void {
        if (event.keyCode === KeyCodes.ENTER || event.keyCode === KeyCodes.SPACEBAR) {
            let item = this.state.item;
            let url = (item.url) ? this.genUrl(item.url) : "#";
            window.router.setRoute(this.genUrl(url));
            fireHornetEvent(MENU_LINK_ACTIVATED);
            if (this.props.closeOnLinkClick) {
                this.closeMenu();
            }
        }
    }

    /**
     * Méthode appelée lors du click sur le lien
     */
    private activateLink(e) {
        fireHornetEvent(MENU_LINK_ACTIVATED.withData({linkId: e.target.id}));
        if (this.props.closeOnLinkClick) {
            this.closeMenu();
        }
        this.state.onClick();
    }

    /**
     * Méthode appelée pour femer le menu
     */
    private closeMenu() {
        let item = this.state.item;
        let hasSubMenu = NavigationUtils.hasVisibleSubMenu(item);
        if (!hasSubMenu) {
            this.state.closeMenu();
        }
    }


    /**
     * Gestion de l'évènement d'entrée de la souris sur l'élément
     */
    private handleMouseEnter() {
        let element = document.getElementById(this.state.item.id);

        /* On affiche tous les éléments parents de l'élément sélectionné en partant du root */
        NavigationUtils.rideDownElementAndToggle(element);

        //
        // if (element && element.focus) {
        //     element.focus();
        // }
    }

    /**
     * Evènement lancé lorsque le pointer n'est plus sur le lien
     * @private
     */
    handleMouseLeave() {
        let element = document.getElementById(this.state.item.id);

        /* On masque tous les éléments parents en partant du parent */
        NavigationUtils.rideDownElementAndToggle(element, true);

        /* On enleve le focus */
        if (element.blur) {
            element.blur();
        }
    }

    /**
     * Permet de générer l'image adéquate selon la profondeur
     * @param item
     * @param libelle
     * @param hover
     * @returns {string}
     * @private
     */
    private getImgSubMenu(item: IMenuItem, libelle: string, hover?: boolean) {
        let imgSubMenu = <div></div>;

        if (item.submenu && NavigationUtils.hasVisibleSubMenu(item)) {
            let props = {};

            props[ "alt" ] = libelle + this.i18n(item.text);
            props[ "className" ] = "subnav-0";

            imgSubMenu = <img {...props} />;
        }

        return imgSubMenu;
    }

    /**
     * Méthode renvoyant le chemin absolu de l'image à afficher
     * @param item
     * @param hover
     * @returns {string}
     * @private
     */
    private getFilePathImg(item: IMenuItem, hover: boolean) {

        let srcImg = (hover) ? DOWN_ARROW_IMG_HOVER : DOWN_ARROW_IMG;
        if (item.level > 0) {
            srcImg = (hover) ? RIGHT_ARROW_IMG_HOVER : RIGHT_ARROW_IMG;
        }
        let urlTheme = this.state.imgFilePath || HornetComponent.genUrlTheme();

        return urlTheme + IMG_PATH + srcImg;
    }
}