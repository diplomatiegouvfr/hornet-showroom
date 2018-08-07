import *  as React from "react";
import * as ReactDOM from "react-dom";
import {
    HornetEvent,
    listenHornetEvent,
    listenOnceHornetEvent,
    fireHornetEvent,
    removeHornetEvent,
} from "hornet-js-core/src/event/hornet-event";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Utils } from "hornet-js-utils";
import { ERROR_EVENT } from "src/views/components/event";
import { Logger } from "hornet-js-utils/src/logger";

const ts = require("typescript");
const logger: Logger = Utils.getLogger("hornet-showroom.preview");


export interface PreviewProps extends HornetComponentProps {
    code: string;
    scope: {};

}

export interface PreviewState {
    code?: string;
    errorPreview?: string;
    previewVisible?: boolean;
}

export class Preview<P extends PreviewProps, S extends PreviewState> extends HornetComponent<PreviewProps, any> {

    reload: boolean = false;
    div: any;
    preview: any;

    constructor(props, context?: any) {
        super(props);
        this.state = {
            ...this.state,
            previewVisible: false,
            hasError: false,
        };
    }

    /**
     * @inheritDoc
     * @param {Readonly<P>} nextProps
     * @param {Readonly<S>} nextState
     * @returns {Readonly<P> | boolean | Readonly<S>}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps && nextProps.code !== this.props.code)
            || (nextState && nextState.code !== undefined && nextState.code !== this.state.code)
            || this.reload;
    }

    /**
     * @inheritDoc
     * @param {P} nextProps
     * @param {S} nextState
     * @param nextContext
     */
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.reload = false;
        this.setState({ previewVisible: false, hasError: false });
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.executeCode();
    }

    /**
     * @inheritDoc
     * @param {P} prevProps
     * @param {S} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        if ((this.props.code !== prevProps.code) || (this.state.code !== undefined && this.state.code !== prevState.code)) {
            // Ajout d'un try catch car non catché par la methode componentDidCatch
            try {
                this.executeCode();
            } catch (e) {
                this.reload = true;
                this.setState({ hasError: true, error: e });
            }
        }
    }

    /**
     * @inheritDoc
     * @param error 
     * @param info 
     */
    componentDidCatch(error, info) {
        this.reload = true;
        this.setState({ hasError: true, error });
    }

    /**
     * @inheritDoc
     * @returns {any}
     */
    render() {
        return (
            <div id="content-show">
                {this.state.hasError ? <div className="preview-error"> {this.state.error.toString()}<br /></div> :
                    <div ref={(preview) => {
                        this.preview = preview;
                    }} className="previewArea">
                        {this.state.previewVisible ? <div>{this.state.div}</div> : null}
                    </div>}
            </div>
        );

    }

    /**
     * retourne  le code jsx convertis en js a l'aide de l'api typescript
     */
    compileCode() {

        const code = this.state.code;
        const scope = this.props.scope;

        const options = {
            target: "es5",
            module: "commonjs",
            moduleResolution: "classic",
            experimentalDecorators: true,
            jsx: "react",
            noResolve: true,
        };

        const sourceCode = `
            (function (${Object.keys(scope).join(", ")}, preview) {
               ${code};
            }); `;

        this.reload = true;


        return ts.transpileModule(sourceCode, { compilerOptions: options }).outputText;
    }

    /**
     * Injecte les composants Hornet.js dans le preview
     * @param mountNode 
     */
    buildScope(mountNode) {
        return Object.keys(this.props.scope).map((key) => {
            return this.props.scope[ key ];
        }).concat(mountNode);
    }

    /**
     * Excecute le code converti ou retourne les erreurs
     */
    executeCode() {
        logger.info(" PREVIEW - executeCode");
        const preview = ReactDOM.findDOMNode(this.preview);
        const scope = this.buildScope(preview);
        const compileCode = this.compileCode();
        const code = eval(compileCode).apply(null, scope);

        const codeDiv = <div> {code} </div>;

        this.setState({ div: codeDiv, previewVisible: true });
    }
    /**
     * Surcharge de la methode listen de hornetComponent
     * @param event 
     * @param callback 
     * @param capture 
     */
    listen<T extends HornetEvent<any>>(event: T, callback: (ev: T) => void, capture: boolean = true): void {
        if (!Utils.isServer) {
            listenHornetEvent(event, callback, capture);
        }
    }
}
