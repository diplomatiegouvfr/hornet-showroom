import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { Editor } from "src/views/components/editor";
import { Preview } from "src/views/components/preview";
import * as ReactDom from "react-dom";
import * as classNames from "classnames";
import * as _ from "lodash";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { STOP_HIGHLIGHT_EVENT } from "src/views/layouts/hornet-app";
import { Summary, SUMMARY_OPEN_CLOSE } from "src/views/components/summary";

const path = require("path");
const logger: Logger = Utils.getLogger("hornet-showroom.showroom.page");

export interface docProps extends HornetComponentProps {
    title?: string;
    composantName: string;
    word?: string;
}


export class Doc extends HornetComponent<docProps, any> {

    preview: any = [];
    editor: any = [];
    div: any;

    scopeHornetComposant: {};
    isFirst: boolean = true;


    constructor(props) {
        super(props);
        this.listen(STOP_HIGHLIGHT_EVENT, this.reload);
        this.listen(SUMMARY_OPEN_CLOSE, this.summaryOpenClose);
        if (!Utils.isServer) {
            if (window) {
                window.scrollTo(0, 0);
            }
        }
    }

    /**
     * @inheritDoc
     * @param nextProps
     * @param nextState
     * @param nextContext
     */
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextState.composantName === this.state.composantName) {
            if (this.editor && this.editor.length > 0) {
                this.editor.forEach((item) => {
                    if (item) {
                        item.setState({ code: nextState.code });
                    }
                });
            }
            if (this.preview && this.preview.length > 0) {
                this.preview.forEach((item) => {
                    if (item) {
                        item.setState({ code: nextState.code });
                    }
                });
            }
            return false;
        }
        this.isFirst = true;
        return true;

    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        super.componentWillUnmount();
        this.remove(STOP_HIGHLIGHT_EVENT, this.reload);
        this.remove(SUMMARY_OPEN_CLOSE, this.summaryOpenClose);
        this.stopListenCopy();
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        super.componentDidMount();
        if (this.state.word) {
            this.scrollToFirstWord();
        }
        this.listenCopy();
    }

    /**
     * @inheritDoc
     */
    componentDidUpdate(prevProps, prevState, prevContext) {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        this.listenCopy();
        if (prevState.composantName !== this.state.composantName) {
            if (!Utils.isServer) {
                if (window) {
                    window.scrollTo(0, 0);
                }
            }
        }
        if (this.state.word) {
            this.scrollToFirstWord();
        }
    }

    /**
     * rendu du composant
     */
    render() {
        return (
            <div>
                {this.state.hasError ? this.state.error.toString() : this.docRender()}
            </div>);
    }

    /**
     * Ajoute des balise html autour du mot rechercher pour le surligner
     * @param text texte du md
     * @returns {any | string}
            */
    highlightWord(text) {
        // on découpe le texte du md aux endroits ou il y a le mot

        const data = text.split(new RegExp(this.state.word, "i"));
        let result = data[ 0 ];
        // chaine permttant de savoir ou on en est dans texte
        let cuttedText = data[ 0 ];
        for (let i = 0; i < data.length - 1; i++) {
            // on récupère le mot dans le texte a l'endroit souhaité
            const word = text.substring(cuttedText.length, cuttedText.length + this.state.word.length);

            const beginning = text.substring(0, cuttedText.length);

            const begOpen = beginning.lastIndexOf("<");
            const begClose = beginning.lastIndexOf(">");

            /**
             * On regarde les positions des balises ouvrantes et fermante avant le mot pour savoir s'il se trouve dans une balise ou non
             */
            if ((begOpen === -1 && begClose === -1) ||
                (begClose !== -1 && begOpen === -1) ||
                (begOpen !== -1 && begClose !== -1 && begClose > begOpen)) {
                if (this.isFirst) {
                    result += "<span class=\"search-word-md\" id=\"first-word\">" + word + "</span>" + data[ i + 1 ];
                    this.isFirst = false;
                } else {
                    result += "<span class=\"search-word-md\">" + word + "</span>" + data[ i + 1 ];
                }
            } else {
                result += word + data[ i + 1 ];
            }

            cuttedText += word + data[ i + 1 ];
        }
        return result;
    }

    /**
     * Supprime le mot surligné
     * @param event
     */
    reload(event) {
        this.setState({ word: null }, () => {
            this.forceUpdate();
        });
    }

    /**
     * Mise à jour lorsque le code change
     * @param newCode
     */
    handleChangeCode(newCode: string, key?: number): void {
        if (this.preview) {
            if (key !== null && typeof key !== "undefined" && this.preview && this.preview.length > 0) {
                this.preview[ key ].setState({ code: newCode });
            } else {
                this.preview.forEach((item) => {
                    item.setState({ code: newCode });
                });
            }
        }
    }

    /**
     * Permet de récupérer le fichier md du composant passé en paramètre
     * et de le convertir en flux html
     */
    docRender = () => {
        let mdRender;

        if (!Utils.isServer) {

            // scroll en haut de page
            const componentDoc = require("src/gen-doc/composantDoc");

            this.scopeHornetComposant = componentDoc[ "hornetComponent" ];
            // Injection composant specifique
            this.scopeHornetComposant[ "React" ] = React;

            const mdSource = "comp." + this.props.composantName.replace(/\//g, ".");
            let text = _.get(componentDoc, mdSource) as any;

            text = this.includeMd(text, componentDoc);

            text = text.replace(/<a /g, "<a target=\"_blank\"");

            const tab = (text) ? this.getEditorCode(text) : [];
            let removenext = false;

            const summary = (text) ? this.summarize(text) : [];


            this.preview = [];
            this.editor = [];
            let indKey = -1;
            mdRender = (
                <div ref={(div) => {
                    this.div = div;
                }}
                >

                    {summary && summary.length > 0 ? <Summary summary={summary} /> : null}
                    {tab.map((item, i) => {
                        const baliseShowroom = "<code class=\"javascript showroom\">";
                        const closeBalise = "</code>";
                        const removeBalise = "<pre class=\"container-code\">";
                        const removeBaliseEnd = "</pre>";

                        if (item.indexOf(baliseShowroom) !== -1) {
                            const indDebut = baliseShowroom.length;
                            const indFin = item.length - closeBalise.length;
                            let code = item.substring(indDebut, indFin);
                            code = this.escape(code);
                            removenext = true;
                            indKey++;
                            return <div id="content-doc" key={i} className="content-doc-container">
                                <pre className="container-code">
                                    <button className="copy-code-editor-button" onClick={() => {
                                        this.copyEditor(indKey);
                                    }}>Copier</button>
                                    <Editor ref={(editor) => {
                                        if (editor) {
                                            this.editor.push(editor);
                                        }
                                    }} code={code} composantName={this.state.composantName}
                                        handleChangeCode={this.handleChangeCode.bind(this)} keyInMd={indKey} />
                                    <Preview code={code} scope={this.scopeHornetComposant} ref={(preview) => {
                                        if (preview) {
                                            this.preview.push(preview);
                                        }
                                    }} />
                                </pre>
                            </div>;
                        } else {
                            let codeTxt = item;

                            if (item.indexOf(removeBalise) !== -1) {
                                const indFin = item.length - removeBalise.length;
                                codeTxt = item.substring(0, indFin);
                            }
                            if (codeTxt.indexOf(removeBaliseEnd) !== -1 && removenext) {
                                codeTxt = codeTxt.replace(removeBaliseEnd, "");
                                removenext = false;
                            }
                            if (this.state.word) {
                                codeTxt = this.highlightWord(codeTxt);
                            }

                            return <div className="content-doc-container" dangerouslySetInnerHTML={{ __html: codeTxt }}
                                key={i} />;
                        }
                    })}
                </div>
            );

        } else {
            mdRender = this.div;
        }

        return mdRender;
    }

    /**
     * rempalce les inclusions de md par le contenu du md
     * Afin de construire le chemin, se baser sur le fichier composantDoc.ts
     */
    includeMd(text, componentDoc) {
        let newText = text;
        const baliseInclude = /{\s*showroom\s*mdinclude\s*[|]\s*/;
        const baliseClose = "}";
        let index = newText.search(baliseInclude);
        while (index !== -1) {
            const beginCode = newText.substring(index, newText.length);
            const indexClose = beginCode.indexOf(baliseClose);

            let code = beginCode.substring(0, indexClose);
            code = code.replace(baliseInclude, "")
                .replace(/\s/g, "")
                .replace(/\n/g, "");

            const mdSource = "comp." + code.replace(/\//g, ".");
            const mdCode = _.get(componentDoc, mdSource) as any;

            const begin = newText.substring(0, index);
            const end = beginCode.substring(indexClose + 1, beginCode.length);

            newText = begin + mdCode + end;

            index = newText.search(baliseInclude);
        }

        return newText;
    }

    /**
     * Scroll au premier mot correspondant à la recherche
     */
    scrollToFirstWord() {
        const target = document.getElementById("first-word");
        if (target) {
            const offset = target.offsetTop;
            window.scrollTo(0, offset);
        }
    }

    /**
     * Decoupage du code markdown afin d'identifier la
     * partie ou le live codiing sera ajouté lors du rendu
     *
     * @param textMd
     */
    getEditorCode(textMd: string) {

        const tabCode = [];
        const returnTab = [];
        const baliseShowroom = "<code class=\"javascript showroom\">";
        const closeBalise = "</code>";
        let text = "";
        let comp = 0;
        let currentText = textMd;
        let ind = 0;

        /**
         * découpage du code en fonction de la balise showroom
         */
        while (text.length !== textMd.length) {
            const index = currentText.indexOf(baliseShowroom, 1);
            let temp = "";
            if (index === -1) {
                // il n'y a plus de balise showroom
                temp = currentText;
                text += currentText;
            } else {
                // découpage avant la balise showroom
                // elle sera au début de la chaîne suivante
                temp = textMd.substring(text.length, text.length + index);
                text = text + temp;
                currentText = textMd.substring(text.length, textMd.length);
            }
            tabCode[ comp ] = temp;
            comp++;
        }

        /**
         * découpage du code en fonction de la balise fermante showroom
         */
        tabCode.forEach((item) => {
            const index = item.indexOf(closeBalise);
            const indexOpen = item.indexOf(baliseShowroom);
            if (indexOpen === 0) {
                // la balise showroom se trouve au début de la chaine
                // il s'agit donc d'un live coding, on le découpe
                const debut = item.substring(0, index + closeBalise.length);
                const fin = item.substring(index + closeBalise.length, item.length);
                if (debut !== "") {
                    returnTab[ ind ] = debut;
                    ind++;
                }
                if (fin !== "") {
                    returnTab[ ind ] = fin;
                    ind++;
                }
            } else {
                returnTab[ ind ] = item;
                ind++;
            }

        });
        return returnTab;

    }

    /* remplace les balises html mal formatée */
    escape(html) {
        return html
            .replace(/&amp;/i, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, "\"")
            .replace(/&#39;/g, "'");
    }

    /**
     * récupère le sommaire du md
     * @param html
     */
    summarize(html): any {
        const titles = html.match(RegExp("<h[2-4?][^>]+>(.*)<\/h[^>]+>|iU", "gi"), "gi");
        const summary = [];
        if (titles) {
            titles.map((menu) => {
                const ids = menu.match(RegExp("id=\"(.?)*\"", "gi"));
                if (ids) {
                    let id = ids[ 0 ].replace("id=\"", "");
                    id = id.replace("\"", "");

                    let name = "";
                    let index = menu.indexOf(">");
                    name = menu.substring(index + 1, menu.length);
                    index = name.indexOf("</");
                    name = name.substring(0, index);


                    id = id.replace(RegExp("<[^>]*>", "gi"), "");
                    name = name.replace(RegExp("<[^>]*>", "gi"), "");

                    const levelMenu = menu[ 2 ];
                    summary.push({
                        id: this.escape(id),
                        name: this.escape(name),
                        level: levelMenu,
                    });
                }
            });
        }
        return summary;
    }

    /**
     * met à jour le css du content en fonction de la visibilité du sommaire
     * @param ev
     */
    summaryOpenClose(ev) {
        const docs = document.getElementsByClassName("content-doc-container");
        const gitlabButton = document.getElementById("gitlab-button");
        for (let i = 0; docs[ i ]; i++) {
            if (ev.detail.opened) {
                docs[ i ].className = "content-doc-container";
                gitlabButton.classList.remove("gitlab-button-right-0");
            } else {
                docs[ i ].className = "content-doc-container doc-expanded";
                gitlabButton.classList.add("gitlab-button-right-0");
            }
        }
    }

    /**
     * lie les boutons copy a la méthode de copiage
     */
    listenCopy() {
        const elements = document.getElementsByClassName("copy-code-button");
        for (let i = 0; elements[ i ]; i++) {
            elements[ i ].addEventListener("click", this.copyCode);
        }
    }

    /**
     * remove les elements de copy
     */
    stopListenCopy() {
        const elements = document.getElementsByClassName("copy-code-button");
        for (let i = 0; elements[ i ]; i++) {
            elements[ i ].removeEventListener("click", this.copyCode);
        }
    }

    /**
     * copie le contenu de la zone de code
     * @param ev
     */
    copyCode(ev) {
        window.getSelection().removeAllRanges();
        const range = document.createRange();
        const parent = ev.target.parentNode;
        const code = parent.childNodes[ 1 ];
        range.selectNode(code);
        window.getSelection().addRange(range);
        document.execCommand("copy");
    }

    /**
     * copie le code de l'éditeur donc le numéro est indKey
     * @param indKey
     */
    copyEditor(indKey) {
        if (this.editor[ indKey ]) {
            const code = this.editor[ indKey ].state.code || this.editor[ indKey ].props.code;
            // le texte n'etant pas présent dans un tag on créer une textarea pour l'utiliser
            const textarea = document.createElement("textarea");
            textarea.textContent = code;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
}
