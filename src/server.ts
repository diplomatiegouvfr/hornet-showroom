// L'import de hornet-js-utils doit être fait le plus tôt possible
import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as fs from "fs";
import { AppliI18nLoader } from "src/i18n/app-i18n-loader";
import { ServerConfiguration } from "hornet-js-core/src/server-conf";
import * as HornetServer from "hornet-js-core/src/server";
import { HornetApp } from "src/views/layouts/hornet-app";
import { HornetLayout } from "src/views/layouts/hornet-layout";
import { ErrorPage } from "hornet-js-react-components/src/widget/component/error-page";
import { Routes } from "src/routes/routes";
import {
    PageRenderingMiddleware,
    UnmanagedViewErrorMiddleware,
} from "hornet-js-react-components/src/middleware/component-middleware";


import * as HornetMiddlewares from "hornet-js-core/src/middleware/middlewares";

const MENU = require("src/resources/navigation");

const logger: Logger = Utils.getLogger("applitutoriel.server");

function routeLoader(name) {
    logger.info("routeLoaderServer(" + name + ")");
    return require("src/routes/" + name);
}

export class Server {
    // let configServer: ServerConfiguration;

    // constructor(configServer: ServerConfiguration, Array<Class<AbstractHornetMiddleware>>){
    //
    // }


    static configure() {
        const configServer: ServerConfiguration = {
            serverDir: __dirname,
            staticPath: "../static",
            appComponent: HornetApp,
            layoutComponent: HornetLayout,
            errorComponent: ErrorPage,
            defaultRoutesClass: new Routes(),
            sessionStore: null, // new RedisStore({host: "localhost",port: 6379,db: 2,pass: "RedisPASS"}),
            routesLoaderPaths: [ "src/routes/" ],
            /*Directement un flux JSON >>internationalization:require("./i18n/messages-fr-FR.json"),*/
            /*Sans utiliser le système clé/valeur>> internationalization:null,*/
            internationalization: new AppliI18nLoader(),
            menuConfig: MENU.menu,
            loginUrl: null,
            logoutUrl: null,
            welcomePageUrl: Utils.config.get("welcomePage"),
            publicZones: [
                Utils.config.get("welcomePage"),
            ],
        };

        Utils.appSharedProps.set("hornet.communityLink", Utils.config.getOrDefault("communityLink", null));

        const key = Utils.config.getOrDefault("server.https.key", false);
        const cert = Utils.config.getOrDefault("server.https.cert", false);
        if (key && cert) {
            configServer.httpsOptions = {
                key: fs.readFileSync(key, "utf8"),
                cert: fs.readFileSync(cert, "utf8"),
                passphrase: Utils.config.get("server.https.passphrase"),
            };
        }
        return configServer;
    }

    static middleware() {
        return new HornetMiddlewares.HornetMiddlewareList()
            .addAfter(PageRenderingMiddleware, HornetMiddlewares.UserAccessSecurityMiddleware)
            .addAfter(UnmanagedViewErrorMiddleware, HornetMiddlewares.DataRenderingMiddleware);
    }

    static startApplication() {
        const server = new HornetServer.Server(Server.configure(), Server.middleware());
        server.start();
    }

}
