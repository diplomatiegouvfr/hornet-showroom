import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Versionning } from "src/views/components/versionning";

export interface Tuile {
    label: string;
    url: string;
    imgSrc: string;
    alt?: string;
}

const logger: Logger = Logger.getLogger("hornet-showroom.views.gen.gen-hom-page");

const tuiles = {
    hornetJs: [
        {
            label: "Présentation",
            url: "/composant/page/hornet-js/documentation_framework/hornet-js/presentation",
            imgSrc: "/img/pictos_acces_rapide/presentation/presentation_white.svg",
        },
        {
            label: "Tutoriel",
            url: "composant/page/hornet-js/tutoriel/javascript/creer-un-projet",
            imgSrc: "/img/pictos_acces_rapide/guide/guide_white.svg",
        },
        {
            label: "Installation",
            url: "composant/page/hornet-js/installation/node",
            imgSrc: "/img/pictos_acces_rapide/installation_poste/installation_white.svg",
        },
        {
            label: "Composants",
            url: "catalogue",
            imgSrc: "/img/pictos_acces_rapide/catalogue_composants/composant_white.svg",
        },
        {
            label: "Architecture",
            url: "composant/page/hornet-js/architecture/frontend",
            imgSrc: "/img/pictos_acces_rapide/architecture/architecture_white.svg",
            alt: "Architecture Frontend",
        },
        {
            label: "Démonstration",
            url: "composant/page/hornet-js/tutoriel/javascript/demonstration",
            imgSrc: "/img/pictos_acces_rapide/demo/picto_hornet_white.svg",
        },
    ],
    hornetJsLite: [
        {
            label: "Présentation",
            url: "/composant/page/hornet-js-lite/architecture/architecture",
            imgSrc: "/img/pictos_acces_rapide/presentation/presentation_white.svg",
        },
        {
            label: "Tutoriel",
            url: "/composant/page/hornet-js-lite/tutoriel/creer-un-projet",
            imgSrc: "/img/pictos_acces_rapide/guide/guide_white.svg",
            alt: "",
        },
        {
            label: "Installation",
            url: "composant/page/hornet-js-lite/installation/base_de_donnees",
            imgSrc: "/img/pictos_acces_rapide/installation_poste/installation_white.svg",
        },
        {
            label: "Composants",
            url: "catalogue",
            imgSrc: "/img/pictos_acces_rapide/catalogue_composants/composant_white.svg",
        },
        {
            label: "Architecture",
            url: "composant/page/hornet-js-lite/architecture/architecture",
            imgSrc: "/img/pictos_acces_rapide/architecture/architecture_white.svg",
            alt: "Architecture frontend",
        },
        {
            label: "Démonstration",
            url: "composant/page/hornet-js-lite/tutoriel/demonstration",
            imgSrc: "/img/pictos_acces_rapide/demo/picto_hornet_white.svg",
            alt: "Démonstration",
        },
    ],
};

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
                {this.renderPalier()}
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
                        href={this.genUrl("/composant/page/hornet-js/documentation_framework/hornet-js/presentation")}>ici</a>
                        ! </p>
                    <p>Note : <b>Hornet.js</b> est un framework basé sur le langage TypeScript, nous partons du
                        principe que vous possédez les bases de la programmation dans ce langage ou en
                        JavaScript.</p>
                </blockquote>
            </div>
        );
    }

    renderPalier(): JSX.Element {

        return (
            <div className={"card mbm"}>
                <h1>Palier technique</h1>
                <hr />
                <Versionning />
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
                    <p> A l'écoute de vos besoins et de vos créations, rejoignez la <a
                        href={this.genUrl("/composant/page/contribution")}>communauté </a> Hornet en soumettant vos composants afin de
                        compléter le catalogue !
                        Collaborer et échanger avec les équipes Hornet.js pour améliorer et enrichir le framework. </p>
                </div>
                <div className={"one-sixth pll ptl"}>
                    <img src={this.genUrlStatic("/img/pictos_acces_rapide/communaute/communaute_blue.svg")} alt="communaute"
                        style={{ width: "10em" }} />
                </div>
            </div>
        );
    }

    /**
     *
     * @returns {JSX.Element}
     */
    renderHornetHornetLite(): JSX.Element {
        // Force la lageur de la tuile

        return (
            <div>
                <div className={"grid mbm"}>

                    <div className={"card"}>

                        <h2>HORNET.JS - HORNET.JS LITE</h2>
                        <hr className={"hr-5"} />
                        <div>
                            <div className={"fl prm"}>
                                <img src={this.genUrlStatic("/img/logos/ico-info.svg")} alt="information"
                                    style={{ width: "10em" }} />
                            </div>
                            <div className={"fl"} style={{ marginBottom: "1em" }}>
                                <p>
                                    <b>Hornet.js</b> et <b>Hornet.js Lite</b> s'appuient sur la même stack côté frontend.
                                </p>
                                <p>De part son découpage en services, <b>Hornet.js</b> répondra aux besoins des applications:</p>
                                <ul>
                                    <li>de forte volumétrie.</li>
                                    <li>de forte capacité de montée en charge</li>
                                </ul>

                                <p>Disposant d'une architecture robuste et d'un backend Java,
                                    <b>Hornet.js</b> sera en mesure de supporter un nombre d'utilisateurs plus conséquent.</p>

                                <p><b>Hornet.js Lite</b> dispose d'une infrastructure simplifiée.
                                    La partie "services" est assurée via le module "hornet-js-database" basé sur
                                    l'ORM Sequelize</p>
                            </div>
                        </div>
                        <hr />
                        <div className={"clear mtl grid has-gutter-xl"}>
                            {this.renderTuilesCard("HORNET-JS", tuiles.hornetJs, "hornet-js", {})}
                            {this.renderTuilesCard("HORNET-JS-LITE", tuiles.hornetJsLite, "hornet-js-lite", {})}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    /**
     * Rendu d'une card contenant des tuiles
     * @param {string} title
     * @param tuiles
     * @param aStyle
     * @returns {any}
     */
    renderTuilesCard(title: string, tuiles: Tuile[], className, aStyle): JSX.Element {
        return (
            <div className={className}>
                <h3>{title}</h3>
                <hr className={"hr-5"} />
                <div className="grid-3 has-gutter">
                    {tuiles.map((tuile) => this.renderTuile(tuile, aStyle))}
                </div>
            </div>
        );
    }

    /**
     * Rendu D'une tuile
     * @param tuile
     * @param aStyle
     * @returns {any}
     */
    renderTuile(tuile, aStyle): JSX.Element {
        return (
            <a href={this.genUrl(tuile.url)} className="home-tule" style={aStyle} >
                <img src={this.genUrlStatic(tuile.imgSrc)} alt={tuile.alt || tuile.label} />
                {tuile.label}
            </a>
        );
    }
}
