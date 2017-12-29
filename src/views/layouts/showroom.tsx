import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetPage } from "hornet-js-react-components/src/widget/component/hornet-page";
import { Doc } from "src/views/components/doc";
import { ShowroomService } from "src/services/page/showroom-service-page";
import { SEARCH_CLOSE_EVENT } from "src/views/layouts/search/search-layout";

const logger: Logger = Utils.getLogger("hornet-showroom.showroom.page");

export interface showroomProps {

};


/**
 * Ecran de page d'accueil de l'application
 */
export class ShowroomPage extends HornetPage<ShowroomService, showroomProps, any> {


    constructor(props, context?: any) {
        super(props, context);

        this.listen(SEARCH_CLOSE_EVENT, this.searchClose);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {

        this.remove(SEARCH_CLOSE_EVENT, this.searchClose);
    }

    prepareClient() {
        //console.log("Showroopage");
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        logger.info("VIEW showroomPage render");
        let word;
        if (this.state.navigateData) {
            word = this.state.navigateData.word;
        }
        return (
            <div id="">
                <div className="container">
                    {(this.attributes.composant) ? <Doc composantName={this.attributes.composant} word={word} /> : null
                    }
                </div>
            </div>
        );
    }

    searchClose(event) {
        this.setState({ navigateData: null });
    }

}