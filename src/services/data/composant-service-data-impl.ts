import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import * as fs from "fs";
import * as path from "path";

const logger: Logger = Utils.getLogger("hornet.showroom.services.composant-service-page-impl");
const composantDirectory = "node_modules/app/hornet-js-react-components/docs";

export interface ComposantsService {
    rechercheComposantMd(composantName: string): Promise<any> ;

    readDirRecursive(dir, callback): any;
}


/**
 *
 * recuperer le composant , le md
 *
 */
export class ComposantServiceImpl implements ComposantsService {

    readDirRecursive(dir, callback) {
        var files = fs.readdirSync(dir);
        files.forEach((file) => {
            var nextRead = path.join(dir, file);
            var stats = fs.lstatSync(nextRead);
            if (stats.isDirectory()) {
                this.readDirRecursive(nextRead + path.sep, callback);
            } else {
                callback(dir, file);
            }
        });
    };


    fileExists = function(file) {
        try {
            var stat = fs.statSync(file);
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

        let sourceDir = source.split(path.sep);
        let newPath = "";
        for (let i = 2; i < sourceDir.length; i++) {
            (i < (sourceDir.length - 1)) ?
                newPath += path.join(sourceDir[i] + path.sep) : newPath += path.join(sourceDir[i]);
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
                    requirePath: this.requirePath(dir + composantName + ".md")
                };
        });

        return Promise.resolve(composant);
    }
}
