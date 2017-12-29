const path = require("path");
const fs = require("fs");
const _ = require("lodash");

class PathHelper {

}

/**
 * Convertit un chemin vers sa représentation en object
 * 'foo/bar/test.ext' : {for: {bar: {test: 'foo/bar/test.ext'}}}
 */
PathHelper.toObject = function (pathToParse, until, clean) {
    let sourceInfo = path.parse(pathToParse);
    let untilDir = until.toLowerCase();
    let pathObject = pathToParse;

    do {
        let tmpObj = {};
        if (clean) {
            tmpObj[PathHelper.cleanName(sourceInfo.name)] = pathObject;
        } else {
            tmpObj[sourceInfo.name] = pathObject;
        }
        pathObject = tmpObj;
        sourceInfo = path.parse(sourceInfo.dir);
    } while (sourceInfo.dir && sourceInfo.name.toLowerCase() !== untilDir);

    return pathObject;
};

/**
 * Convertit un chemin vers sa représentation en object
 * 'foo/bar/test.ext' : {for: {bar: {test: 'foo/bar/test.ext'}}}
 */
PathHelper.toObjectBuilder = function (pathToParse, until, clean) {
    let sourceInfo = path.parse(pathToParse);
    let untilDir = until.toLowerCase();
    let pathObject = pathToParse;

    do {
        let tmpObj = {};
        if (clean) {
            tmpObj[PathHelper.cleanName(sourceInfo.name)] = pathObject;
        } else {
            tmpObj[sourceInfo.name] = pathObject;
        }
        pathObject = tmpObj;
        sourceInfo = path.parse(sourceInfo.dir);
    } while (sourceInfo.dir && sourceInfo.name.toLowerCase() !== untilDir && !fs.existsSync(path.join(sourceInfo.dir, "builder.js")));


    let tmpObj = {};
    if (clean) {
        tmpObj[PathHelper.cleanName(sourceInfo.name)] = pathObject;
    } else {
        tmpObj[sourceInfo.name] = pathObject;
    }
    pathObject = tmpObj;

    return pathObject;
};

/**
 * Recherche les fichiers dans un répertoire suivant l'extension
 */
PathHelper.listFiles = function (pathToParse, ext, filtersExclude) {
    let files = [];
    let listFiles = fs.readdirSync(pathToParse);

    listFiles.forEach(function (file) {
        let currentPath = path.join(pathToParse, file);

        if (fs.statSync(currentPath).isFile()) {

            let filterFile = false;
            if (filtersExclude) {
                filterFile = filtersExclude.find((filter) => {
                    filterFile = currentPath.match(filter);
                    return filterFile;
                })
            }


            if (path.extname(currentPath) == ext && !filterFile) {
                files.push(currentPath);
            }
        }
        if (fs.statSync(currentPath).isDirectory()) {
            Array.prototype.push.apply(files, PathHelper.listFiles(currentPath, ext, filtersExclude));
        }
    });
    return files;
};

/**
 * Recherche les fichiers dans un répertoire suivant l'extension, enregistre dans un objet retenant le nom et le chemin
 */
PathHelper.listFilesWithDirName = function (pathToParse, ext, filtersExclude) {
    let files = [];
    let listFiles = fs.readdirSync(pathToParse);

    listFiles.forEach(function (file) {
        let currentPath = path.join(pathToParse, file);
        let dirName = currentPath.split("/");
        let projectName = PathHelper.cleanName(dirName[dirName.length - 1]);

        if (fs.statSync(currentPath).isFile()) {

            let filterFile = false;
            if (filtersExclude) {
                filterFile = filtersExclude.find((filter) => {
                    filterFile = currentPath.match(filter);
                    return filterFile;
                })
            }


            if (path.extname(currentPath) == ext && !filterFile) {
                let data = {
                    "name": projectName,
                    "dataPath": currentPath
                }
                files.push(data);
            }
        }
        if (fs.statSync(currentPath).isDirectory()) {
            Array.prototype.push.apply(files, PathHelper.listFiles(currentPath, ext, filtersExclude));
        }
    });
    return files;
};

/**
 * Liste les dossier présent dans le path et commençant par startWith
 */
PathHelper.listDir = function (pathToParse, startWith) {
    let dirs = [];
    let listFiles = fs.readdirSync(pathToParse);

    listFiles.forEach(function (file) {
        let currentPath = path.join(pathToParse, file);
        let dirName = currentPath.split("/");
        let projectName = PathHelper.cleanName(dirName[dirName.length - 1]);
        if (fs.statSync(currentPath).isDirectory()) {
            if (projectName.indexOf(startWith) == 0 &&
                projectName != "hornet-js-man" &&
                projectName != "hornet-js-builder" &&
                projectName != "hornet-js-community"
            ) {
                let data = {
                    "name": projectName,
                    "dataPath": currentPath
                };
                dirs.push(data)
            }
        }
    });

    return dirs;
}
/**
 * Clean des chemins de fichier
 */
PathHelper.cleanName = function (name) {
    let newNane = name.toLowerCase();
    newNane = newNane.replace(/[àáâãäå]/g, "a");
    newNane = newNane.replace(/æ/g, "ae");
    newNane = newNane.replace(/ç/g, "c");
    newNane = newNane.replace(/[èéêë]/g, "e");
    newNane = newNane.replace(/[ìíîï]/g, "i");
    newNane = newNane.replace(/ñ/g, "n");
    newNane = newNane.replace(/[òóôõö]/g, "o");
    newNane = newNane.replace(/œ/g, "oe");
    newNane = newNane.replace(/[ùúûü]/g, "u");
    newNane = newNane.replace(/[ýÿ]/g, "y");
    newNane = newNane.replace(/^\d+\s*\-?\s*/, "");
    newNane = newNane.replace(/\/\d+\s*\-?\s*/g, "/");
    newNane = newNane.replace(/\s/g, "_");
    return newNane;
};


module.exports = PathHelper;