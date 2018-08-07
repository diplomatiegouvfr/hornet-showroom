import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Notification } from "hornet-js-react-components/src/widget/notification/notification";
import { BusinessErrorList } from "hornet-js-utils/src/exception/business-error-list";

const logger: Logger = Utils.getLogger("hornet-showroom.views.gen.gen-err-page");

export class ErrorPage extends HornetPage<any, HornetComponentProps, any> {

    constructor(props?: HornetComponentProps, context?: any) {
        super(props, context);
    }

    prepareClient() {

    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW ErreurPage render");
        const error = Utils.getCls("hornet.currentError");
        let exceptions;
        if (error !== null) {
            if (error instanceof BusinessErrorList) {
                exceptions = (error as BusinessErrorList).getErrors();
            } else {
                exceptions = [ error ];
            }
        }
        return (
            <div>
                <h2>{this.i18n("errorsTitle")}</h2>
                <Notification id="errorPage" exceptions={exceptions} />
            </div>
        );
    }
}
