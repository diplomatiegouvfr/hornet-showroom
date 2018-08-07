const path = require("path");
const fs = require("fs");
const PathHelper = require("./path-helper");
const _ = require("lodash");

class MenuHelper {

}

/**
 * Convertit un chemin vers sa représentation en object
 * 'foo/bar/test.ext' : {for: {bar: {test: 'foo/bar/test.ext'}}}
 */
MenuHelper.toObject = function (mdFiles, until, startDirectory) {

    let filesToObject = {};

    mdFiles.forEach(function (file) {
        let fileToObject = PathHelper.toObject(file, until, false);
        filesToObject = _.merge(filesToObject, fileToObject);
    });

    function transformAttribut(objCible, objParse, startDirectory) {
        for (let attr in objParse) {
            if (typeof objParse[attr] === "string") {

                let data = {};

                let componentPath = path.relative(startDirectory, objParse[attr]);
                let gitUrl = componentPath;
                let componentPathObject = path.parse(componentPath);
                componentPath = PathHelper.cleanName(path.join(componentPathObject.dir, componentPathObject.name));

                /** Pour les fichiers de documentation à la racine du projet, on ajoute le nom du projet dans l'url*/
                if (componentPathObject.dir == "") {

                    let dirName = startDirectory.split("/");
                    let projectName = PathHelper.cleanName(dirName[dirName.length - 1]);
                    //Un fichier builder.js est présent à la racine de chaque projet
                    if (fs.existsSync(path.join(startDirectory, "builder.js"))) {
                        componentPath = projectName + "/" + componentPath;
                    }

                    //ajout d'une condition pour hornet-js-builder car il ne possède pas de fichier builder.js
                    if (projectName == "hornet-js-builder" || projectName == "hornet-js-gc-monitor") {
                        componentPath = projectName + "/" + componentPath;
                    }
                } else {
                    // on ajoute les liens gitlab pour les fichiers liés à hornet-js-man
                    //@todo: variabiliser le nom du projet "hornet-js-man"
                    data["gitlabUrl"] = "/hornet-js-man/blob/develop/docs/" + gitUrl;
                }

                data = _.merge(data, {
                    "text": MenuHelper.cleanName(attr) + " ",
                    "title": attr,
                    "url": "/composant/page/" + componentPath,
                    "visibleDansMenu": true,
                    "visibleDansPlan": true
                });

                objCible.push(data);
            } else {
                objCible.push({
                    "text": MenuHelper.cleanName(attr) + " ",
                    "title": attr,
                    "visibleDansMenu": true,
                    "visibleDansPlan": true,
                    "submenu": []
                });
                transformAttribut(objCible[objCible.length - 1].submenu, objParse[attr], startDirectory);
            }
        }
    }

    let obj = {}
    obj.menu = [];
    transformAttribut(obj.menu, filesToObject, startDirectory);

    return obj;

}

/**
 * retourne les fichiers du projets
 * @param project
 * @param helper
 * @param projectName nom du projet dont il faut récupérer les fichiers
 * @param filesToObject objet dans lequel sont ajoutés les fichiers
 * @returns {*}
 */
MenuHelper.getFiles = function (project, helper, projectName, filesToObject) {
    var directory = path.join(project.dir, helper.NODE_MODULES_APP, projectName);

    if (project.builderJs.externalModules.enabled) {
        var extModules = project.builderJs.externalModules.directories;
        docName = "hornet-man";
        for (let i = 0; i < extModules.length; i++) {
            let tmp = extModules[i].toLowerCase().split("/");
            if (tmp.indexOf(projectName) > -1) {
                directory = path.join(extModules[i], "docs");
            }

            if (fs.existsSync(path.join(extModules[i], "package.json"))) {
                if (require(path.join(extModules[i], "package.json")).name == projectName) {
                    directory = extModules[i];
                }
            }
        }
    }

    let files = [];
    if (project.builderJs.externalModules.enabled) {
        files = PathHelper.listFiles(directory, ".md", [/node_modules/, /\-dts/, /LICENSE.md/, /LICENCE.md/, /CHANGELOG.md/, /definition-ts/, /generators/, /CONTRIBUTING.md/, /static/, /.svn/, "/.vscode/", "/.idea/"]);
    } else {
        files = PathHelper.listFiles(directory, ".md", [/\-dts/, /LICENSE.md/, /LICENCE.md/, /CHANGELOG.md/, /definition-ts/, /generators/, /CONTRIBUTING.md/, /static/]);

    }

    //  let filesToObject = {};
    if (project.builderJs.externalModules.enabled) {
        files.forEach(function (file) {
            let fileToObject = PathHelper.toObjectBuilder(file, projectName, true);
            filesToObject = _.merge(filesToObject, fileToObject);
        });
    } else {
        files.forEach(function (file) {
            let fileToObject = PathHelper.toObject(file, "app", true);
            filesToObject = _.merge(filesToObject, fileToObject);
        });
    }

    return filesToObject;
}

/**
 * génère le menu d'un projet
 * @param project
 * @param helper
 * @param projectName nom du projet dont on veux le menu
 * @returns {{text: string, visibleDansMenu: boolean, visibleDansPlan: boolean, submenu: (React.HTMLProps<HTMLElement>|HTMLFactory<HTMLElement>|Array|*|boolean)}}
 */
MenuHelper.getMenu = function (project, helper, projectName) {
    var directory = path.join(project.dir, helper.NODE_MODULES_APP, projectName);

    if (project.builderJs.externalModules.enabled) {
        var extModules = project.builderJs.externalModules.directories;
        docName = "hornet-man";
        for (let i = 0; i < extModules.length; i++) {
            let tmp = extModules[i].toLowerCase().split("/");

            if (tmp.indexOf(projectName) > -1) {
                directory = path.join(extModules[i], "docs");
            }

            if (fs.existsSync(path.join(extModules[i], "package.json"))) {
                if (require(path.join(extModules[i], "package.json")).name == projectName) {
                    directory = extModules[i];
                }
            }
        }
    }

    let files = [];
    if (project.builderJs.externalModules.enabled) {
        files = PathHelper.listFiles(directory, ".md", [/node_modules/, /\-dts/, /LICENSE.md/, /LICENCE.md/, /CHANGELOG.md/, /definition-ts/, /generators/, /CONTRIBUTING.md/, /static/]);
    } else {
        files = PathHelper.listFiles(directory, ".md", [/\-dts/, /LICENSE.md/, /LICENCE.md/, /CHANGELOG.md/, /definition-ts/, /generators/, /CONTRIBUTING.md/, /static/]);

    }

    let menuObject = MenuHelper.toObject(files, projectName, directory);
    let menu = {};
    if(menuObject.menu.length === 1){
        //permet de ne pas afficher de sous répertoire dans le cas d'un seul élément
        menu = {
            "text": projectName,
            "title": projectName,
            "visibleDansMenu": true,
            "visibleDansPlan": true,
            "url": menuObject.menu[0].url
        };
    }else{
        menu = {
            "text": projectName,
            "title": projectName,
            "visibleDansMenu": true,
            "visibleDansPlan": true,
            "submenu": menuObject.menu
        };
    }

    return menu;
}

/**
 * Recherche les fichiers dans un répertoire suivant l'extension
 */
MenuHelper.cleanName = function (name) {
    let newNane = name;
    newNane = newNane.replace(/^\d+\s*\-?\s*/, "");
    newNane = newNane.replace(/\s*-\s*/g, " ");
    //newNane = _.camelCase(newNane);
    return newNane;
};


/**
 * Fonction permetant d'ajout des éléments dans le menu générer
 *
 * @param mode choix du traitemement à appliquer
 */
MenuHelper.menuExtend = function (menuExt, menuSource) {

    function recursiveMenu(objRef, extendedMenu) {
        extendedMenu.map((extM, i) => {
            if (objRef.submenu) {
                var keyNode = _.findIndex(objRef.submenu, {
                    "title": extM.title
                });

                if (keyNode > -1) {

                    if (extM.submenu && objRef.submenu[keyNode]) {
                        recursiveMenu(objRef.submenu[keyNode], extM.submenu);
                    }
                    //suppression du noeud 
                    delete extM.submenu;
                    if (Object.keys(extM).length > Object.keys(objRef.submenu[keyNode]).length) {
                        _.merge(objRef.submenu[keyNode], extM);
                    }

                } else {
                    if (!_.includes(objRef.submenu, extM)) {
                        objRef.submenu.push(extM);
                    }
                }
            }
        });
    }

    menuSource.menu.map((src, index) => {
        let idx = _.findIndex(menuExt.menu, {
            "title": src.title
        });
        if (idx > -1) {
            recursiveMenu(menuSource.menu[index], menuExt.menu[idx].submenu);
        }
    });


    return menuSource;
}


/**
 * recupère les sous menu d'un menu existant
 */
MenuHelper.menuExtendMerged = function (menuExt, menuSource) {

    // on reconstruit le menu merge avec les valeurs manquantes
    function recursiveMerge(mExt, mSource) {

        mExt.map((ext, i) => {
            if (mExt[i].submenu == undefined) {
                //let node = {}
                menuSource.menu.map((src, index) => {
                    recursiveFind(src.submenu, mExt[i])
                })
            } else {
                recursiveMerge(mExt[i].submenu, mSource);
            }

        });

    }


    /**
     * trouve le menu dont le title est le meme que mExt
     * et fussionne les deux menus
     * @param menu
     * @param mExt
     */
    function recursiveFind(menu, mExt) {
        for (let i = 0; i < menu.length; i++) {
            if (menu[i].title == mExt.title) {
                if (mExt.submenu == undefined) {
                    mExt.submenu = [];
                }
                //_.merge(mExt, menu[i]);
                if(menu[i].submenu){
                    mExt.submenu = mExt.submenu.concat(menu[i].submenu);
                }
            } else {
                if (menu[i].submenu !== undefined) {
                    recursiveFind(menu[i].submenu, mExt);
                }
            }
        }
    }


    menuSource.menu.map((src, index) => {
        let idx = _.findIndex(menuExt.menu, {
            "text": src.text
        });
        if (idx > -1) {
            recursiveMerge(menuExt.menu[idx].submenu, menuSource.menu);
        }
    });

    // on ajoute les nouvelles valeurs au futur menu
    this.menuExtend(menuExt, menuSource);

    return menuSource;
}

/**
 * trie du menu
 * @param menuSource
 * @returns {*}
 */
MenuHelper.sortMenu = function (menuSource) {

    /**
     * trie les menus en fonction de la position donnée dans ceux-ci
     * @param menu
     * @returns {*}
     */
    function recursiveSort(menu) {
    
        menu.map((item, index) => {
            if (item && item.position) {
                let newMenu = [];
                let comp = 0;
                for (let i = 0; i < menu.length; i++) {
                    if (i == item.position) {
                        newMenu[comp] = item;
                        comp++;
                    }
                    if (menu[i] != item) {
                        newMenu[comp] = menu[i];
                        comp++;
                    }
                }
                menu = newMenu;
            }
            if (item && item.submenu) {
                if (item.position) {
                    menu[item.position].submenu = recursiveSort(item.submenu);
                } else {
                    menu[index].submenu = recursiveSort(item.submenu);
                }
            }
        });
        return menu
    }

    menuSource.menu = recursiveSort(menuSource.menu);
    return menuSource;
}

module.exports = MenuHelper;