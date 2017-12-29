import { AbstractRoutes, PageRouteInfos, DataRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { ShowroomPage } from "src/views/layouts/showroom";
import * as ComposantActions from "src/actions/composant-actions";

import { ComposantServiceImpl } from "src/services/data/composant-service-data-impl";
import { ShowroomServiceImpl } from "src/services/page/showroom-service-page";

export default class ShowroomRoutes extends AbstractRoutes {
    constructor() {
        super();

        this.addPageRoute("/page/(.+)",
            (composantname) => new PageRouteInfos(ShowroomPage, { composant: composantname }, ShowroomServiceImpl),
            PUBLIC_ROUTE
        );

        this.addDataRoute("/test/(.+)",
            (composantname) => new DataRouteInfos(ComposantActions.rechercheComposantMd, { composant: composantname }, ComposantServiceImpl),
            PUBLIC_ROUTE
        );
    }
}