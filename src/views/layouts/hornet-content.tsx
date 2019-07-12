import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-logger/src/logger";
import *  as React from "react";
import { Class } from "hornet-js-utils/src/typescript-utils";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { COMPONENT_CHANGE_EVENT, PAGE_READY_EVENT } from "hornet-js-core/src/routes/router-client-async-elements";
import { HeaderShowroom } from "src/views/layouts/header-showroom";
import includes = require("lodash.includes");


import { TopButton } from "hornet-js-react-components/src/widget/button/top-button";

import { fireHornetEvent } from "hornet-js-core/src/event/hornet-event";
import { ERROR_EVENT } from "src/views/components/event";
import { SEARCH_CLOSE_EVENT } from "src/views/layouts/search/search-layout";

const logger: Logger = Logger.getLogger("hornet-showroom.views.layouts.gen-cnt-cmp");

export interface ContentProps extends HornetComponentProps {
    content: Class<HornetPage<any, any, any>>;
    isMenuVisible?: boolean;
    error?: any;
    navigateData?: any;
}

export class HornetContent extends HornetComponent<ContentProps, any> {

    // public readonly props: Readonly<ContentProps>;

    constructor(props?: ContentProps, context?: any) {
        super(props, context);

        this.listen(COMPONENT_CHANGE_EVENT, (ev) => {
            this.fadeIn();
            if (!(ev.detail.newComponent === ErrorPage)) {
                this.setState({ content: ev.detail.newComponent, navigateData: ev.detail.data }, () => {
                    this.fire(PAGE_READY_EVENT.withData({}));
                    this.fadeIn(true);
                });
            }

        });
        this.listen(SEARCH_CLOSE_EVENT, this.searchClose);

    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW Content render");

        const title = this.i18n("topButtonTitle");
        const clsSize = Utils.getCls("hornet.pageLayoutWidth");
        const size = typeof clsSize === "undefined" ? 1200 : clsSize;

        let content;

        if (this.state.error && !this.state.error.hasBeenReported) {
            content = <ErrorPage error={this.state.error} />;
        } else {
            content = this.wrap(this.state.content, { navigateData: this.state.navigateData }, (this.props as any));
        }

        const className = this.state.isMenuVisible ? "menuVisible" : "";
        return (
            <div style={{ width: "100%" }}>
                <HeaderShowroom />
                <main id="showroom-page" className={className}>
                    <div id={"doc-container"}>
                        {content}
                    </div>
                    <TopButton title={title} />
                </main>
            </div>
        );
    }

    searchClose(event) {
        this.setState({ navigateData: null });
    }

    /**
     * Ajout animation lors des changements de page
     * @param {boolean} bool
     */
    fadeIn(bool?: boolean) {

        // on applique le fadeIn/fadeOut que sur un changement de page et non lorsque l'on utilise le summary avec les anchors
        if (window && window.location && window.location.href && !includes(window.location.href, "#")) {
            const e = document.getElementById("doc-container");
            if (bool) {
                e.classList.remove("animate-out");
                e.classList.add("animate-in");
            } else {
                e.classList.add("animate-out");
                e.classList.remove("animate-in");
            }
        }
    }

}
