import { AbstractRoutes, PageRouteInfos, PUBLIC_ROUTE } from "hornet-js-core/src/routes/abstract-routes";
import { URL_COMPOSANT } from "src/utils/urls";
import { HomePage } from "src/views/gen/gen-hom-page";
import { CataloguePage } from "src/views/gen/gen-cat-page";
import { PictoPage } from "src/views/gen/gen-pic-page";

export class Routes extends AbstractRoutes {
    constructor() {
        super();

        /* Routes des pages */
        this.addPageRoute("/", () => new PageRouteInfos(HomePage), PUBLIC_ROUTE);

        /* Routes des pages */
        this.addPageRoute("/accueil", () => new PageRouteInfos(HomePage), PUBLIC_ROUTE);
        this.addPageRoute("/catalogue", () => new PageRouteInfos(CataloguePage), PUBLIC_ROUTE);
        this.addPageRoute("/pictogrammes", () => new PageRouteInfos(PictoPage), PUBLIC_ROUTE);

        /* Routes lazy */
        this.addLazyRoutes(URL_COMPOSANT, "showroom/showroom-routes");

    }

}
