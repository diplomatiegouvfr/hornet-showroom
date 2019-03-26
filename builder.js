var path = require("path");
var fs = require("fs");
const _ = require("lodash");

const PathHelper = require("./path-helper");
const MenuHelper = require("./menu");


module.exports = {
    type: "application",
    authorizedPrerelease: "true",
    gulpTasks: function (gulp, project, conf, helper) {

        const marked = require("markdown-loader/node_modules/marked");
        const MdHelper = require("./md-helper");
        const hljs = require("highlight.js");

        /**SURCHARGE MARKDOWN-LOADER */
        MdHelper.liveCoding(marked);
        MdHelper.mdLink(marked);
        MdHelper.htmlTitle(marked);
        MdHelper.htmlTable(marked);
        MdHelper.highlight(marked, hljs);

        //Add task if needed
        gulp.beforeTask("compile", _.once(beforeCompile));
                
        function beforeCompile() {
            helper.info("Before compile task!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

            //Recuperation de la documentation dans le composant
            //var composantDirectory = "node_modules/app/hornet-js-react-components/";

            var fwkName = "hornet-js";
            var builderName = "hornet-js-builder";
            var docName = "hornet-js-man";
            var templateHornetName = "generator-hornet-js";
            var templateHornetLiteName = "generator-hornet-js-lite";
            var templateHornetLiteBatchName = "generator-hornet-js-lite-batch";
            var monitorName = "hornet-js-gc-monitor";
            var hornetThemesName = "hornet-themes-intranet";
            var communityName = "hornet-js-community";
            var applitutorieljsName = "applitutoriel-js";
            var applitutorieljsliteName = "applitutoriel-js-lite";
            var applitutorieljsbatchName = "applitutoriel-js-batch";


            var navigationMergeFile = "./src/resources/navigationMerge.json";
            var navigationExtFile = "./src/resources/navigationExt.json";

            var composantDirectory = helper.NODE_MODULES_APP;
            var docDir = path.join(helper.NODE_MODULES_APP, docName, "docs");
            var fwkDir = path.join(project.dir, helper.NODE_MODULES_APP, fwkName);
            var communityDir = path.join(helper.NODE_MODULES_APP, communityName, "docs");
            var nodeModuleDir = path.join(project.dir, helper.NODE_MODULES_APP);

            if (project.builderJs.externalModules.enabled) {
                var extModules = project.builderJs.externalModules.directories;
                for (let i = 0; i < extModules.length; i++) {
                    let tmp = extModules[i].toLowerCase().split("/");

                    console.log("externals : ", extModules[i]);

                    if (tmp.indexOf("hornet-js-man") > -1) {
                        docDir = path.join(extModules[i], "docs");
                    }

                    if (tmp.indexOf(communityName) > -1) {
                        communityDir = path.join(extModules[i], "docs");
                    }

                    if (tmp.indexOf("hornet-js") > -1) {
                        composantDirectory = extModules[i];
                    }

                    if (fs.existsSync(path.join(extModules[i], "package.json"))) {
                        if (require(path.join(extModules[i], "package.json")).name == fwkName) {
                            fwkDir = extModules[i];
                        }
                    }
                }

            }

            var composantIndex = "src/gen-doc/composantDoc.ts";
            var menuSourceFile = "src/resources/navigation.json";

            var reactComp = [];
            var hornetComponent = {};

            var fileExclude = [
                "readme",
                "license",
                "licence",
                "builder",
                "changelog",
                "test-wrapper",
                "chart-donut",
                "chart-donut",
                "input-text-body-cell"
            ];

            //Liste des composants supplementaires
            let extraComponent = {
                DataSource: "hornet-js-core/src/component/datasource/datasource",
                DataSourceConfigPage: "hornet-js-core/src/component/datasource/config/service/datasource-config-page",
                DataSourceConfig: "hornet-js-core/src/component/datasource/config/service/datasource-config",
                DataSourceMap: "hornet-js-core/src/component/datasource/config/datasource-map",
                DataSourceMaster: "hornet-js-core/src/component/datasource/datasource-master",
                DataSourceLinked: "hornet-js-core/src/component/datasource/datasource-linked",
                DefaultSort: "hornet-js-core/src/component/datasource/options/datasource-option",
                SpinnerOption: "hornet-js-core/src/component/datasource/options/datasource-option",
                NotificationManager: "hornet-js-core/src/notification/notification-manager",
                Notifications: "hornet-js-core/src/notification/notification-manager",
                NotificationType: "hornet-js-core/src/notification/notification-manager",
                Position: "hornet-js-react-components/src/widget/dropdown/dropdown",
                Tabs: "hornet-js-react-components/src/widget/tab/tabs"
            };

            // suppression des fichiers générés
            if (helper.fileExists(menuSourceFile)) {
                fs.unlink(menuSourceFile);
            }

            if (helper.fileExists(composantIndex)) {
                fs.unlink(composantIndex);
            }

            // recherche des fichiers à traiter

            let filesToObject = {};
            let mdFiles = PathHelper.listFiles(docDir, ".md");
            let compFiles = PathHelper.listFiles(composantDirectory, ".tsx", 
                [/generator-hornet-js/, /generator-hornet-js-lite/, /generator-hornet-js-lite-batch/, /applitutoriel-js-lite/, /applitutoriel-js-common/, /hornet-js-react-components\/test/]);
            let projects = PathHelper.listDir(nodeModuleDir, /^hornet-js(?!-gc)(?!-man)(?!-community)(?!-builder)/); //exclusion du gc-monitor, man, builder et community
            let mdFwkFiles = [];

            let mdCommunityFiles = (fs.existsSync(communityDir)) ? PathHelper.listFiles(communityDir, ".md") : [];

            if (project.builderJs.externalModules.enabled) {
                mdFwkFiles = PathHelper.listFiles(fwkDir, ".md", [/node_modules/, /\-dts/, /LICENSE.md/, /LICENCE.md/, /definition-ts/, /CHANGELOG.md/, /CONTRIBUTING.md/, /static/]);

            } else {
                for (var i = 0; i < projects.length; i++) {
                    let file = PathHelper.listFilesWithDirName(projects[i].dataPath, ".md", [/\-dts/, /LICENSE.md/, /LICENCE.md/,/CHANGELOG.md/, /definition-ts/, /CONTRIBUTING.md/, /static/]);
                    mdFwkFiles[i] = file;
                }
            }


            /*
             * génération de l'import des fichiers MD
             */
            mdFiles.forEach(function (file) {
                let fileToObject = PathHelper.toObject(file, "docs", true);
                filesToObject = _.merge(filesToObject, fileToObject);
            });

            mdCommunityFiles.forEach(function (file) {
                let fileToObject = PathHelper.toObject(file, "docs", true);
                filesToObject = _.merge(filesToObject, fileToObject);
            });

            if (project.builderJs.externalModules.enabled) {
                mdFwkFiles.forEach(function (file) {
                    let fileToObject;
                    fileToObject = PathHelper.toObjectBuilder(file, fwkName, true);
                    filesToObject = _.merge(filesToObject, fileToObject);
                });
            } else {
                for (var i = 0; i < mdFwkFiles.length; i++) {
                    mdFwkFiles[i].forEach(function (file) {
                        let fileToObject;
                        fileToObject = PathHelper.toObjectBuilder(file.dataPath, projects[i].name, true);
                        filesToObject = _.merge(filesToObject, fileToObject);
                    });
                }
            }

            MenuHelper.getFiles(project, helper, builderName, filesToObject);
            MenuHelper.getFiles(project, helper, hornetThemesName, filesToObject);
            MenuHelper.getFiles(project, helper, monitorName, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetName, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetLiteName, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetLiteBatchName, filesToObject);
            MenuHelper.getFiles(project, helper, applitutorieljsName, filesToObject);
            MenuHelper.getFiles(project, helper, applitutorieljsliteName, filesToObject);
            MenuHelper.getFiles(project, helper, applitutorieljsbatchName, filesToObject);
        
            let declareObj = JSON.stringify(filesToObject,
                (key, value) => {
                    if (typeof value === "string") {
                        return "require('" + value + "'),";
                    }
                    return value;
                }, 2);

            declareObj = "export var comp = " + declareObj + "\r\n";
            declareObj = declareObj.replace(/\"require\(\'([^\)\']+)\'\),\"/g, "require(\"$1\")");

            fs.writeFileSync(composantIndex, declareObj);

            /*
             * génération de l'import des composants React
             */
            // exclusion de certain fichier
            compFiles = compFiles.filter((file) => {
                return fileExclude.indexOf(path.basename(file, ".tsx").toLowerCase()) === -1
            });

            compFiles.forEach((file) => {
                var fileJs = fs.readFileSync(file).toString();
                var re = /export class\s+(\w+)[\s|<]/ig;
                result = re.exec(fileJs);

                if (result && result[1]) {
                    let componentPath = path.relative(composantDirectory, file);
                    // suppression de l'extension pour l'import
                    let componentPathObject = path.parse(componentPath);
                    componentPath = path.join(componentPathObject.dir, componentPathObject.name);

                    if (file.indexOf("content") > -1) {
                        reactComp.splice(0, 0, "import { " + result[1] + " } from \"" + componentPath + "\";\n");
                        hornetComponent[result[1]] = {};
                    } else {
                        reactComp.push("import { " + result[1] + " } from \"" + componentPath + "\";\n");
                        hornetComponent[result[1]] = {};
                    }
                }
            });

            // add extra module et composant
            for (var component in extraComponent) {
                reactComp.push("import { " + component + " } from \"" + extraComponent[component] + "\";\n");
                hornetComponent[component] = {};
            }

            reactComp.forEach((ligne) => {
                fs.appendFileSync(composantIndex, ligne);
            });


            //Creation la variable des composants hornet a injecter dans l'editeur
            fs.appendFileSync(composantIndex, "export var hornetComponent = {\n");
            for (var component in hornetComponent) {
                fs.appendFileSync(composantIndex, " \t\"" + component + "\" : " + component + ", \n");
            }

            fs.appendFileSync(composantIndex, "} ;");

            /*
             * génération du menu
             */

            //génération du menu hornet-js
            let fmkMenu = {},
                communityMenu = {};
            if (project.builderJs.externalModules.enabled) {
                let fmkMenuObject = MenuHelper.toObject(mdFwkFiles, fwkName, fwkDir);

                fmkMenu = {
                    "text": "HORNET-JS",
                    "visibleDansMenu": true,
                    "visibleDansPlan": true,
                    "submenu": fmkMenuObject.menu
                };


            } else {
                let fmkMenuObjects = [];
                let files = [];
                for (var i = 0; i < mdFwkFiles.length; i++) {
                    files[i] = [];
                    for (var j = 0; j < mdFwkFiles[i].length; j++) {
                        files[i].push(mdFwkFiles[i][j].dataPath)
                    }
                }
                for (var i = 0; i < mdFwkFiles.length; i++) {
                    let fmkMenuObject = MenuHelper.toObject(files[i], projects[i].name, projects[i].dataPath);
                    let tmpMenuNode = {}

                    for (var j = 0; j < fmkMenuObject.menu.length; j++) {

                        if (!("submenu" in tmpMenuNode)) {
                            //permet de ne pas afficher de sous répertoire dans le cas d'un seul élément
                            let menu = {
                                "text": projects[i].name,
                                "title": projects[i].name,
                                "visibleDansMenu": true,
                                "visibleDansPlan": true,
                                "url": fmkMenuObject.menu[j].url
                            };
                            tmpMenuNode = menu;
                        } else {
                            tmpMenuNode.submenu.push(fmkMenuObject.menu[j]);
                        }
                    }
                    fmkMenuObjects.push(tmpMenuNode);
                }
                fmkMenu = {
                    "text": "hornet-js",
                    "visibleDansMenu": true,
                    "visibleDansPlan": true,
                    "submenu": fmkMenuObjects
                }
            }

            // ajout des menus des autres projets
            let builderMenu = MenuHelper.getMenu(project, helper, builderName);
            let templateHornetMenu = MenuHelper.getMenu(project, helper, templateHornetName);
            let templateHornetLiteMenu = MenuHelper.getMenu(project, helper, templateHornetLiteName);
            let templateHornetLiteBatchMenu = MenuHelper.getMenu(project, helper, templateHornetLiteBatchName);
            let monitorMenu = MenuHelper.getMenu(project, helper, monitorName);
            let hornetThemesMenu = MenuHelper.getMenu(project, helper, hornetThemesName);
            let applitutorieljsMenu = MenuHelper.getMenu(project, helper, applitutorieljsName);
            let applitutorieljsliteMenu = MenuHelper.getMenu(project, helper, applitutorieljsliteName);
            let applitutorieljsbatchMenu = MenuHelper.getMenu(project, helper, applitutorieljsbatchName);
           
            //génération du menu hornet-man
            let manMenuObject = MenuHelper.toObject(mdFiles, "docs", docDir);

            let communityMenuObject = MenuHelper.toObject(mdCommunityFiles, "docs", communityDir);

            // on duplique des entree existantes
            if (helper.fileExists(navigationMergeFile)) {
                let menuMergeSourceFile = require(navigationMergeFile);

                if (menuMergeSourceFile) {
                    manMenuObject = MenuHelper.menuExtendMerged(menuMergeSourceFile, manMenuObject);
                }
            }

            // ajoute des nouveaux noeud dans le menu
            if (helper.fileExists(navigationExtFile)) {
                let menuExtSourceFile = require(navigationExtFile);
                if (menuExtSourceFile) {
                    manMenuObject = MenuHelper.menuExtend(menuExtSourceFile, manMenuObject);
                }
            }

            let menuProjet = [fmkMenu, builderMenu, monitorMenu, hornetThemesMenu, templateHornetMenu, templateHornetLiteMenu, 
                templateHornetLiteBatchMenu, applitutorieljsMenu, applitutorieljsliteMenu, applitutorieljsbatchMenu];
            let menuProjets = {
                "text": "PROJETS",
                "visibleDansMenu": true,
                "visibleDansPlan": true,
                "submenu": menuProjet
            };

            let menuCommunity = {
                "text": "COMMUNITY",
                "visibleDansMenu": true,
                "visibleDansPlan": true,
                "submenu": communityMenuObject.menu
            }

            manMenuObject.menu.push(menuProjets);
            manMenuObject.menu.push(menuCommunity);


            /*Ajout url sur l'entrée catalogue des composants */
            manMenuObject.menu.map((menuObj, i) => {
                if (menuObj.submenu) {
                    var nodeCatalogueComp = _.findIndex(menuObj.submenu, {
                        "text": "Catalogue de composant "
                    });
                    if (nodeCatalogueComp > -1) {
                        menuObj.submenu[nodeCatalogueComp].url = "/catalogue";
                    }
                }
            });

            MenuHelper.sortMenu(manMenuObject);

            let menuObject = manMenuObject;

            declareObj = JSON.stringify(menuObject, " ", 2);

            //Creation des elements du menu
            if (!helper.fileExists(menuSourceFile)) {
                fs.writeFileSync(menuSourceFile, declareObj);
            }

        };

        
        gulp.addTaskDependency("package-zip-static", "prepare-package:spa");
    },
    externalModules: {
        enabled: false,
        directories: [
            
        ]
    },
    config: {
        clientExclude: {
            noParse: ["node_modules/app/typescript"],
            modules: [
                "config",
                "continuation-local-storage",
                "carbone",
                "pdfmake",
                "pdfmake/src/printer",
                "pdfkit",
                "nodemailer",
                "fontkit"
            ]
        },
        typescript: {},
        webpack: {
            module: {
                rules: [{
                    test: /\.(md)$/,
                    use: [{
                            loader: "html-loader"
                        },
                        {
                            loader: "markdown-loader",
                            options: {
                                breaks: true
                            }
                        }
                    ]
                }]
            }
        },
        template: [{
            context: [{
                error: "404",
                suffixe: "_404",
                message: "Oops! Nous ne trouvons pas ce que vous cherchez!"
            }, {
                error: "500",
                suffixe: "_500",
                message: "Oops! Une erreur est survenue!"
            }],
            dir: "./template/error",
            dest: "/error"
        }, {
            context: {
                message: "test template"
            }
        }],
        clientContext: [
            [/moment[\/\\]locale$/, /fr/],
            [/intl[\/\\]locale-data[\/\\]jsonp$/, /fr/],
            [/.appender/, /console/]

        ],
        spaFilter: ["^((?!.*config\/)).*"]
    }
};