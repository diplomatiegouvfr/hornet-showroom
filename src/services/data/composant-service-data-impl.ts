import { Logger } from "hornet-js-logger/src/logger";
import * as fs from "fs";
import * as path from "path";

const logger: Logger = Logger.getLogger("hornet.showroom.services.composant-service-page-impl");
const composantDirectory = "node_modules/hornet-js-react-components/docs";

export interface ComposantsService {
    rechercheComposantMd(composantName: string): Promise<any>;

    readDirRecursive(dir, callback): any;
}

/**
 *
 * recuperer le composant , le md
 *
 */
export class ComposantServiceImpl implements ComposantsService {

    readDirRecursive(dir, callback) {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const nextRead = path.join(dir, file);
            const stats = fs.lstatSync(nextRead);
            if (stats.isDirectory()) {
                this.readDirRecursive(nextRead + path.sep, callback);
            } else {
                callback(dir, file);
            }
        });
    }

    fileExists = function (file) {
        let stat: fs.Stats;
        try {
            stat = fs.statSync(file);
        } catch (_) {
            return false;
        }

        return stat.isFile();
    };

    /**
     * Contruction du chemin pour accèder à la doc a l'aide re require
     * @param source
     * @returns {string}
     */

    requirePath(source) {

        const sourceDir = source.split(path.sep);
        let newPath = "";
        for (let i = 2; i < sourceDir.length; i++) {
            (i < (sourceDir.length - 1)) ?
                newPath += path.join(sourceDir[ i ] + path.sep) : newPath += path.join(sourceDir[ i ]);
        }
        return newPath;

    }

    rechercheComposantMd(composantName: string): Promise<any> {

        let composant = {};

        this.readDirRecursive(composantDirectory, (dir, file) => {

            if (this.fileExists(dir + composantName + ".md"))
                composant = {
                    docSource: dir + composantName + ".md",
                    name: composantName,
                    requirePath: this.requirePath(dir + composantName + ".md"),
                };
        });

        return Promise.resolve(composant);
    }
}
