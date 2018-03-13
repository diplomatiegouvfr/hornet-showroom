import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";

const logger: Logger = Utils.getLogger("hornet-showroom.views.layouts.hornet-layout");

const styleLoader: any = ".loader-page:before {display: block;position: absolute;content: '';left: -200px;width: 200px;height: 4px;background-color: #00d468;animation: loadingPage 2s linear infinite;}@keyframes loadingPage {from {left: -200px; width: 30%;}50% {width: 30%;}70% {width: 70%;}80% { left: 50%;}95% {left: 120%;}to {left: 100%;}}";

export interface HornetLayoutProps extends HornetComponentProps {
    content: string,
    state: any,
    appLogo: string,
    appTheme: string,
    fwkTheme: string,
    appStatic: string,
    applicationLoading: string,
    nojavascript: boolean,
    applicationTitle: string
}

/**
 * Layout de l'application
 */
export class HornetLayout extends HornetPage<any, HornetLayoutProps, any> {

    static defaultProps = {
        appLogo: "/img/favicon.png",
        appTheme: "/css/theme.css",
        codeMirrorTheme: "/css/codemirror.css",
        highlightTheme: "/css/github.css",
        fwkTheme: process.env.NODE_ENV === "production" ? "/css/theme-min.css" : "/css/theme.css",
        appStatic: "/js/client.js",
        nojavascript: false,
        applicationTitle: "",
        workingZoneWidth: "100%"

    };

    constructor(props: HornetLayoutProps, context?: any) {
        super(props, context);

        const currentUrl = Utils.getCls("hornet.routePath");
        this.state = {
            ...this.state,
            applicationTitle: this.i18n(NavigationUtils.retrievePageTextKey(NavigationUtils.getConfigMenu(), currentUrl))
        }
    }

    prepareClient() {
    }

    private getLoadingText(): string {
        return this.state.applicationLoading || this.i18n("applicationLoading");
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW HornetLayout render");
        let loaderStyle: React.CSSProperties = {
            "width": "100%",
            "position": "absolute",
            "overflow": "hidden",
            "backgroundColor": "#eee",
            "height": "4px",
            zIndex: 9999
        };


        let loadingOverlayStyle: React.CSSProperties = {
            background: "black",
            position: "fixed",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            opacity: 0.1,
            "zIndex": 9999
        };

        try {
            return (
                <html dir="ltr" lang="fr">
                    <head>
                        <meta name="viewport"
                            content="width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
                        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                        <link rel="icon" type="image/png" href={this.genUrlStatic(this.state.appLogo)} />
                        <title>{this.i18n("applicationTitle") + "  - " + this.i18n(this.state.applicationTitle)}</title>
                        <link rel="stylesheet" type="text/css" href={HornetLayout.genUrlTheme(this.state.fwkTheme)} />
                        <link rel="stylesheet" type="text/css" href={this.genUrlStatic(this.state.appTheme)} />
                        <link rel="stylesheet" type="text/css" href={this.genUrlStatic(this.state.codeMirrorTheme)} />
                        <link rel="stylesheet" type="text/css" href={this.genUrlStatic(this.state.highlightTheme)} />
                    </head>
                    <body>
                        {
                            !this.state.nojavascript ?
                                <div id="firstLoadingSpinner">
                                    <style dangerouslySetInnerHTML={{ __html: styleLoader }} />
                                    <div style={loadingOverlayStyle} />
                                    <div style={loaderStyle} className="loader-page" />
                                </div>
                                : null
                        }
                        <div id="app" dangerouslySetInnerHTML={{ __html: this.state.content }} />
                        <script dangerouslySetInnerHTML={{ __html: (this.state.state || "").toString() }} />
                        {this.renderScript()}
                    </body>
                </html>
            );
        } catch (e) {
            logger.error("Render hornet-layout exception", e);
            throw e;
        }
    }

    private renderScript(): JSX.Element {
        logger.debug("VIEW HornetLayout renderScript");
        if (!this.state.nojavascript) {
            return (<script src={this.genUrlStatic(this.state.appStatic)}></script>);
        }
        return null;
    }

}