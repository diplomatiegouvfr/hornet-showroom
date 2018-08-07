import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";

const logger: Logger = Utils.getLogger("hornet-showroom.views.gen.gen-hom-page");

/*tableau des composants*/
const hornetComposant =
    {
        Layouts: [
            {
                label: "Acccordions",
                picto: "/img/pictos_composants/accordions/accordion_white.svg",
                url: "/composant/page/hornet-js/composants/layouts/accordions",
            },
            {
                label: "Form",
                picto: "/img/pictos_composants/form/form_white.svg",
                url: "/composant/page/hornet-js/composants/layouts/form",
            },
            {
                label: "HeaderPage",
                picto: "/img/pictos_composants/header/header_white.svg",
                url: "/composant/page/hornet-js/composants/layouts/headerpage",
            },
            {
                label: "Navigation",
                picto: "/img/pictos_composants/navigation/navigation_white.svg",
                url: "/composant/page/hornet-js/composants/layouts/navigation",
            },
            {
                label: "Tabs",
                picto: "/img/pictos_composants/tabs/tabs_white.svg",
                url: "/composant/page/hornet-js/composants/layouts/tabs",
            },
        ],
        Buttons: [
            {
                label: "Button",
                picto: "/img/pictos_composants/button/button_white.svg",
                url: "composant/page/hornet-js/composants/buttons/button",
            },
            {
                label: "TopButton",
                picto: "/img/pictos_composants/button/top-button.svg",
                url: "composant/page/hornet-js/composants/buttons/topbutton",
            },
            {
                label: "ButtonInfoAccessibilite",
                picto: "/img/pictos_composants/button/button-info-accessibilite.svg",
                url: "composant/page/hornet-js/composants/buttons/buttoninfoaccessibilite",
            },
        ],
        Commons: [
            {
                label: " ChangeLanguage",
                picto: "/img/pictos_composants/language/language_white.svg",
                url: "/composant/page/hornet-js/composants/commons/changelanguage",
            },
            {
                label: "Icon",
                picto: "/img/pictos_composants/icon/icon_white.svg",
                url: "composant/page/hornet-js/composants/commons/icon",
            },
            {
                label: "Pictogrammes",
                picto: "/img/pictos_composants/icon/pictogrammes.svg",
                url: "pictogrammes",
            },
            {
                label: "Spinner",
                picto: "/img/pictos_composants/spinner/spinner_white.svg",
                url: "/composant/page/hornet-js/composants/commons/spinner",
            },
            {
                label: "Tooltip",
                picto: "/img/pictos_composants/info/info_white.svg",
                url: "/composant/page/hornet-js/composants/commons/tooltip",
            },
        ],

        Contents: [
            {
                label: "Chart",
                picto: "/img/pictos_composants/chart/chart_white.svg",
                url: "composant/page/hornet-js/composants/contents/chart",
            },
            {
                label: "Table",
                picto: "/img/pictos_composants/table/table_white.svg",
                url: "/composant/page/hornet-js/composants/contents/table",
            },
        ],
        Dialogs: [
            {
                label: "Alert",
                picto: "/img/pictos_composants/alert/alert_white.svg",
                url: "composant/page/hornet-js/composants/dialogs/alert",
            },
            {
                label: "Modal",
                picto: "/img/pictos_composants/modal/modal_white.svg",
                url: "composant/page/hornet-js/composants/dialogs/modal",
            },
            {
                label: "Notification",
                picto: "/img/pictos_composants/notification/notifications_white.svg",
                url: "/composant/page/hornet-js/composants/dialogs/notification",
            },
        ],
        Headers: [
            {
                label: "LayoutSwitcher",
                picto: "/img/pictos_composants/layout_switcher/layout_switcher_white.svg",
                url: "/composant/page/hornet-js/composants/headers/layoutswitcher",
            },
            {
                label: "User",
                picto: "/img/pictos_composants/user/user_white.svg",
                url: "/composant/page/hornet-js/composants/headers/user",
            },
        ],
        Inputs: [
            {
                label: "AutoComplete",
                picto: "/img/pictos_composants/auto_complete/auto_complete_white.svg",
                url: "/composant/page/hornet-js/composants/inputs/autocompletefield",
            },
            {
                label: "CalendarField",
                picto: "/img/pictos_composants/calendar_field/calendar_white.svg",
                url: "/composant/page/hornet-js/composants/inputs/calendarfield",
            },
            {
                label: "InputField",
                picto: "/img/pictos_composants/inputfield/inputfield_white.svg",
                url: "/composant/page/hornet-js/composants/inputs/inputfield",
            },
            {
                label: "TextareaField",
                picto: "/img/pictos_composants/textareafield/textareafield_white.svg",
                url: "/composant/page/hornet-js/composants/inputs/textareafield",
            },
            {
                label: "UploadfileField",
                picto: "/img/pictos_composants/upload_file_field/uploadfield_white.svg",
                url: "/composant/page/hornet-js/composants/inputs/uploadfilefield",
            },
        ],
        List_Group: [
            {
                label: "Dropdown",
                picto: "/img/pictos_composants/dropdown/dropdown_white.svg",
                url: "/composant/page/hornet-js/composants/list_group/dropdown",
            },
            {
                label: "CheckboxField",
                picto: "/img/pictos_composants/checkbox/checkbox_white.svg",
                url: "/composant/page/hornet-js/composants/list_group/checkboxfield",
            },
            {
                label: "RadiosField",
                picto: "/img/pictos_composants/radio/radiofield_white.svg",
                url: "/composant/page/hornet-js/composants/list_group/radiosfield",
            },
            {
                label: "SelectField",
                picto: "/img/pictos_composants/selectfield/selectfield_white.svg",
                url: "/composant/page/hornet-js/composants/list_group/selectfield",
            },
        ],
    };


/**
 * Ecran de page d'accueil de l'application
 */
export class CataloguePage extends HornetPage<any, HornetComponentProps, any> {


    indexCompo = 0;

    prepareClient() {
    }

    /**
     * rendu de la page des composants
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HomePage render");

        return (
            <div id="pageComposant">
                <h1>Catalogue des composants </h1>
                {this.renderCard()}
            </div>
        );
    }


    /**
     * Rendu des cards et leur contenu
     */
    renderCard(): JSX.Element {
        const htmlLink: JSX.Element[] = Object.keys(hornetComposant).map((composants, index) => {

            return (
                <div className={"card mbl"} key={"rub_" + index}>
                    <h2 className="card-span-title">{composants}</h2>
                    <hr className="hr-5" />
                    {this.renderTuile(hornetComposant[ composants ])}
                </div>
            );
        });
        return (
            <div className="grid-3 has-gutter-l">
                {htmlLink}
            </div>
        );
    }


    /**
     *  Génération de la tuile
     */
    renderTuile(listCompo): JSX.Element {

        // Force la lageur de la tuile 
        const aStyle = {
            width: "10.5em",
        };

        if (listCompo) {
            const htmlLink: JSX.Element[] = listCompo.map((compo, index) => {
                this.indexCompo++;
                return (
                    <a href={this.genUrl(compo.url)} className="home-tule" style={aStyle} key={"compo_" + this.indexCompo}>
                        {(compo.picto) ? <img src={this.genUrlStatic(compo.picto)} alt={compo.label} /> : null}
                        <br />
                        {compo.label}
                    </a >
                );

            });

            return <div className="grid-4 has-gutter-l">{htmlLink}</div>;
        }
    }

}
