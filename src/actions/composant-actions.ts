import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { ComposantsService } from "src/services/data/composant-service-data-impl";

import { RouteActionService } from "hornet-js-core/src/routes/abstract-routes";


const logger: Logger = Utils.getLogger("showroom.actions.composant-actions");


/**
 * Action de recherche de partenaires répondant aux critères indiqués
 */
export class rechercheComposantMd extends RouteActionService<{ composant: string }, ComposantsService> {

    execute(): Promise<any> {
        logger.info("Action: Recherche composant");

        return this.getService().rechercheComposantMd(this.attributes.composant);
    }
}
