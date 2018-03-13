import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import * as ReactDOM from "react-dom"
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";


let CodeMirror = null;

const logger: Logger = Utils.getLogger("hornet-showroom.editor");
if (!Utils.isServer) {

    CodeMirror = require("react-codemirror2").UnControlled;

    require("codemirror/mode/jsx/jsx");
    require("codemirror/addon/fold/foldcode");
    require("codemirror/addon/fold/foldgutter");
    require("codemirror/addon/fold/brace-fold");
    require("codemirror/addon/fold/comment-fold");
}


export interface EditorProps extends HornetComponentProps {
    code: string, //code de l'editeur
    composantName: string, //Nom du composant
    scope?: {}, //liste des componsants que l'on souhaite utiliser dans l'editeur
    selectedLines?: {},
    handleChangeCode?: (code: string, keyInMd?: number) => void,
    keyInMd?: number;
}

export interface EditorState {
    code: string  //code de l'editeur
}


export class Editor<P extends EditorProps, S extends EditorState> extends HornetComponent<EditorProps, any>{

    editor: any;

    constructor(props?: P, context?: any) {
        super(props, context);

        //autobinding
        this.updateCode = this.updateCode.bind(this);
    }

    /**
     * mise a jour du code
     *  @param  newCode 
     */
    updateCode(newCode: string) {

        this.props.handleChangeCode(newCode, this.props.keyInMd);
    }

    /**
     * @inheritDoc
     * @param {Readonly<P>} nextProps
     * @param {Readonly<S>} nextState
     * @returns {boolean}
     * 
     */
    shouldComponentUpdate(nextProps, nextState) {
        if ((nextProps && nextProps.code !== this.props.code) || (nextState && nextState.code != undefined && nextState.code != this.state.code)) {
            return true;
        }
        return false;
    }

    /**
     * @inheritDoc
     * 
     */
    render() {

        /**
         * option codeMirror
         **/
        let options = {
            firstLineNumber: 1,
            lineNumbers: true,
            mode: "jsx",
            indentWithTabs: true,
            extraKeys: {
                "Ctrl-Q": function (cm) {
                    cm.foldCode(cm.getCursor());
                }
            },
            foldGutter: true,
            gutters: [ "CodeMirror-linenumbers", "CodeMirror-foldgutter" ],
            lineWrapping: true,

        };

        return (
            <div id="content-editor">
                <p className="bg-alert">Render React, il faut explicitement mettre le "return" afin de voir le
                    rendu. </p>
                <CodeMirror
                    ref={(editor) => {
                        if (editor !== null) {
                            this.editor = editor
                        }
                    }}
                    value={this.state.code}
                    onChange={(editor, metadata, value) => {
                        this.updateCode(value);
                    }}
                    options={options}
                />
            </div>
        );
    }
};