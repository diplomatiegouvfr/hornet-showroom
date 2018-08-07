import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import { Client } from "hornet-js-core/src/client";
import { Routes } from "src/routes/routes";
import { HornetApp } from "src/views/layouts/hornet-app";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";
import { ReactClientInitializer } from "hornet-js-react-components/src/react/react-client";

const startClient = () => {
    const logger: Logger = Utils.getLogger("hornet-showroom.client");

    function routeLoader(name: string, callback: any) {
        logger.info("routeLoaderClient(" + name + ")");
        // WEBPACK_AUTO_GENERATE_CLIENT_ROUTE_LOADING

        return null;
    }

    try {
        (<any>Error).stackTraceLimit = Infinity;

        const configClient = {
            appComponent: HornetApp,
            errorComponent: ErrorPage,
            routesLoaderfn: routeLoader,
            defaultRoutesClass: new Routes(),
            directorClientConfiguration: {
                html5history: true,
                strict: false,
                convert_hash_in_init: false,
                recurse: false,
                notfound: () => {
                    logger.error("Erreur. Cette route n'existe pas :'" + this.path + "'");
                },
            },
        };

        // On supprime le spinner de chargement de l'application
        // Cela ne gêne pas React car il est en dehors de sa div "app"
        const readyCallback = () => {
            const appLoading = document.getElementById("firstLoadingSpinner");
            if (appLoading) {
                appLoading.parentNode.removeChild(appLoading);
            }
        };

        const clientInit: ReactClientInitializer = new ReactClientInitializer(configClient.appComponent, readyCallback);

        Client.initAndStart(configClient, clientInit);
    } catch (exc) {
        logger.error("Erreur lors du chargement de l'appli côté client (Exception)", exc);
    }

};

startClient();
