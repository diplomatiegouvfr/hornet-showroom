import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Picto } from "hornet-js-react-components/src/img/picto";
import { Icon } from "hornet-js-react-components/src/widget/icon/icon";

const logger: Logger = Utils.getLogger("hornet-showroom.views.gen.gen-pic-page");

/**
 * Ecran d'affichage des pictogrammes
 */
export class PictoPage extends HornetPage<any, HornetComponentProps, any> {

    HornetComposant: any;

    prepareClient() {

    }

    /**
     * @inheritDoc
     */
    componentWillMount() {
        super.componentWillMount();

        /*tableau des picto*/
        this.HornetComposant = [];

        let present = false;
        /**
         * récupère tous les pictogrammes de Picto
         */
        for (var property in Picto) {
            if (Picto.hasOwnProperty(property) && property !== "defaultProps") {
                for (var picto in Picto[property]) {
                    present = false;
                    this.HornetComposant.map((composant, index) => {
                        if (composant.name == picto) {
                            present = true;
                        }
                    });

                    if (!present) {
                        this.HornetComposant.push({
                            src: property,
                            name: picto,
                            label: "Picto." + property + "." + picto,
                            color: property
                        });
                    }
                }
            }
        }
    }

    /**
     * rendu de la page des pictogrammes
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HomePage render");

        return (
            <div id="pagePicto">
                <h1>Pictogrammes </h1>
                {this.renderTuile()}
            </div>
        );
    }


    /**
     *  Génération de la tuile
     */
    renderTuile(): JSX.Element {

        let htmlLink: JSX.Element[] = this.HornetComposant.map((composant, index) => {
            return (
                <div className={"picto-tule grid"}>
                    <Icon src={Picto[composant.color][composant.name]} alt={composant.name} title={composant.name}
                          classImg={"showroom-picto"} classLink={"picto-button picto-" + composant.src + " one-half"}/>
                    <br/>
                    <div className={"picto-info-container grid-1"}>
                        <button onClick={() => {
                            this.copyName(index)
                        }} title="copier" className="picto-copy-button"></button>
                        <div className="picto-name-container">
                            <div id={"picto-" + index} className="picto-info-name">{composant.label}</div>
                        </div>
                        {this.renderColors(composant, index)}
                    </div>
                </div>
            );
        });

        return (
            <div className="grid-5 has-gutter-xl">
                {htmlLink}
            </div>
        );
    }

    /**
     * copie le nom du picto
     * @param index
     */
    copyName(index) {
        window.getSelection().removeAllRanges();
        let range = document.createRange();
        let code = document.getElementById("picto-" + index);
        if (code) {
            range.selectNode(code);
            window.getSelection().addRange(range);
            document.execCommand("copy");
        }
    }

    /**
     * génération des couleurs d'un composant
     * @param composant composant dont on veut les couleurs
     * @param index index du composant
     * @returns {any}
     */
    renderColors(composant: any, index: any) {

        /**
         * l'ajout d'une nouvelle couleur doit se faire dans ce tableau, de plus,
         * il faudra ajouter la couleur dans les themes de la façon suivante:
         * .picto-color-[nom couleur]{
         *   background-color: [code couleur];
         *  }
         */
        let colors = ["black", "white", "blue", "grey"];

        let pictoColor = [];

        colors.map((color, index) => {
            if (Picto[color][composant.name]) {
                pictoColor.push(color)
            }
        });


        return (
            <div className={"picto-colors"}>
                {pictoColor.map((color, index) => {
                    let isColor = false;
                    if (color == composant.color) {
                        isColor = true;
                    }
                    let cname = isColor ? " picto-color-active" : "";
                    return <a className={"picto-color picto-color-" + color + cname} onClick={() => {
                        this.changeColor(composant, color)
                    }}/>
                })}
            </div>
        );
    }

    /**
     * change la couleur active du pictogramme
     * @param composant
     * @param color
     * @returns {any}
     */
    changeColor(composant: any, color: any) {
        this.HornetComposant.map((comp, index) => {
            if (composant.name == comp.name) {
                this.HornetComposant[index].color = color;
                this.HornetComposant[index].src = color;
                this.HornetComposant[index].label = "Picto." + comp.color + "." + comp.name,
                    this.setState({reload: true})
            }
        });
        return null
    }
}