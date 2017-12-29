import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";

const logger: Logger = Utils.getLogger("hornet-showroom.views.gen.gen-hom-page");

/**
 * Ecran de page d'accueil de l'application
 */
export class HomePage extends HornetPage<any, HornetComponentProps, any> {

    prepareClient() {
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HomePage render");

        return (
            <div id="pageAccueil">
                {this.renderPresentationHornet()}
                {this.renderHornetCommunity()}
                {this.renderHornetHornetLite()}
            </div>
        );
    }

    /**
     *
     * @returns {JSX.Element}
     */
    renderPresentationHornet(): JSX.Element {

        return (
            <div className={"card mbm"}>
                <h1>Présentation </h1>
                <hr className={"hr-5"} />
                <div className="grid">
                    <div>
                        <blockquote>
                            <p><b>Hornet.js</b> est le framework de développement des applications conformes aux
                                spécificités
                                du Ministère de l'Europe et des Affaires étrangères. </p>
                            <p> La sécurité, l'accessibilité et l'intéropérabilité sont des notions fortement présentes
                                dans
                                <b> Hornet.js</b>.
                            </p>
                            <p>Prenez connaissance des bonnes pratiques, consultez les explications et les étapes de
                                mise en place !</p>
                            <p> L'équipe <b>Hornet.js</b> vous encourage à tester vos configurations de composant dans
                                le
                                live
                                coding disponible dans le catalogue des composants. </p>
                            <p> Votre découverte du framework <b>Hornet.js</b> commence <a
                                href={this.genUrl("composant/page/hornet-js/tutoriel/javascript/creer-un-projet")}>ici</a>
                                ! </p>
                            <p>Note : <b>Hornet.js</b> est un framework basé sur le langage TypeScript, nous partons du
                                principe que vous possédez les bases de la programmation dans ce langage ou en
                                JavaScript.</p>
                        </blockquote>
                    </div>

                    <div className={"one-fifth"}>
                        <div className="all-picto-module">
                            <img src={this.genUrlStatic("/img/logos/compo_logos_showroom.jpg")} alt="modules" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    /**
     * 
     * @returns {JSX.Element}
     */
    renderHornetCommunity(): JSX.Element {
        return (
            <div className={"grid mbm"}>

                <div className={"card"}>
                    <h2>La communauté </h2>
                    <hr className={"hr-5"} />
                    <p> A l'écoute de vos besoins et de vos créations, rejoignez la <a href={this.genUrl("/composant/page/contribution")}>communauté </a> Hornet en soumettant vos composants afin de compléter le catalogue !
                        Collaborer et échanger avec les équipes Hornet.js opur  améliorer et enrichir le framework. </p>
                </div>
                <div className={"one-sixth pll ptl"}>
                    <img src={this.genUrlStatic("/img/pictos_acces_rapide/communaute/communaute_blue.svg")} alt="communaute" style={{ "width": "10em" }} />
                </div>
            </div>

        );
    }


    /**
     *
     * @returns {JSX.Element}
            */
    renderHornetHornetLite(): JSX.Element {

        //Force la lageur de la tuile
        let aStyle = { "max-width": "12em" };
        return (
            <div>
                <div className={"grid mbm"}>
                    <div className={"one-sixth pll ptl"}>
                        <img src={this.genUrlStatic("/img/logos/ico-info.svg")} alt="information"
                            style={{ "width": "10em" }} />
                    </div>
                    <div className={"card"}>
                        <h2>HORNET.JS - HORNET.JS LITE</h2>
                        <hr className={"hr-5"} />
                        <p>
                            <b>Hornet.js</b> et <b>Hornet.js Lite</b> s'appuient sur la même stack côté frontend.
                        </p>
                        <p>De part son découpage en services, <b>Hornet.js</b> répondra aux besoins des
                            applications:</p>
                        <ul>
                            <li>de forte volumétrie.</li>
                            <li>de forte capacité de montée en charge</li>
                        </ul>
                        <p>Disposant d'une architecture robuste et d'un backend Java, <b>Hornet.js</b> sera en mesure de supporter un nombre d'utilisateurs plus conséquent.</p>

                        <p><b>Hornet.js Lite</b> dispose d'une infrastructure simplifiée. La partie "services" est assurée via le module "hornet-js-database" basé sur
                            l'ORM Sequelize</p>
                    </div>
                </div>

                <div className={"grid has-gutter-xl"}>
                    <div className={"card hornet-js"}>
                        <h2>HORNET.JS</h2>
                        <hr className={"hr-5"} />
                        <div className="grid-2 has-gutter-xl">
                            <a className="home-tule"
                                href={this.genUrl("composant/page/hornet-js/installation/node")}
                                style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/installation_poste/installation_white.svg")}
                                    alt="Installation de node" /> <br />
                                Installation
                            </a>

                            <a href={this.genUrl("catalogue")} className="home-tule" style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/catalogue_composants/composant_white.svg")}
                                    alt="Composants" /> <br />
                                Composants
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js/architecture/frontend")}
                                className="home-tule" style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/architecture/architecture_white.svg")}
                                    alt="Architecture frontend" />
                                Architecture
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js/tutoriel/javascript/creer-un-projet")}
                                className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/guide/guide_white.svg")}
                                    alt="Tutoriel" />
                                Tutoriel
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js/tutoriel/javascript/demonstration")}
                                className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/demo/picto_hornet_white.svg")}
                                    alt="Démonstration" />
                                Démonstration
                            </a>
                            <a href={this.genUrl("composant/page/contribution")} className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/communaute/communaute_white.svg")}
                                    alt="Communauté" />
                                Communauté</a>
                        </div>
                    </div>
                    <div className={"card hornet-js-lite"}>
                        <h2>HORNET.JS-LITE</h2>
                        <hr className={"hr-5"} />
                        <div className="grid-2 has-gutter-xl">
                            <a className="home-tule"
                                href={this.genUrl("composant/page/hornet-js-lite/installation/base_de_donnees")}
                                style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/installation_poste/installation_white.svg")}
                                    alt="Installation de node" /> <br />
                                Installation
                            </a>

                            <a href={this.genUrl("catalogue")} className="home-tule" style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/catalogue_composants/composant_white.svg")}
                                    alt="Composants" /> <br />
                                Composants
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js-lite/architecture/architecture")}
                                className="home-tule" style={aStyle}>
                                <img
                                    src={this.genUrlStatic("/img/pictos_acces_rapide/architecture/architecture_white.svg")}
                                    alt="Architecture frontend" />
                                Architecture
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js-lite/tutoriel/sequelize")}
                                className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/guide/guide_white.svg")}
                                    alt="Tutoriel" />
                                Tutoriel
                            </a>
                            <a href={this.genUrl("composant/page/hornet-js-lite/tutoriel/demonstration")}
                                className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/demo/picto_hornet_white.svg")}
                                    alt="Démonstration" />
                                Démonstration
                            </a>
                            <a href={this.genUrl("composant/page/contribution")} className="home-tule" style={aStyle}>
                                <img src={this.genUrlStatic("/img/pictos_acces_rapide/communaute/communaute_white.svg")}
                                    alt="Communauté" />
                                Communauté</a>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}