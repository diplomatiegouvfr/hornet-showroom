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
        marked.InlineLexer.prototype.oldToken = marked.InlineLexer.prototype.token;
        marked.Lexer.prototype.oldToken = marked.Lexer.prototype.token;

        marked.InlineLexer.prototype.token = function () {

            this.rules.code = /^(`+)\s*([\s\S]*?(?:\sshowroom)?[^`])\s*\1(?!`)/g;
            return this.oldToken(arguments[0]);
        };

        marked.Lexer.prototype.token = function () {
            this.rules.fences = /^ *(`{3,}|~{3,})[ \.]*(\S+(?:\sshowroom)?)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/;
            return this.oldToken(arguments[0], arguments[1], arguments[2]);
        };


        /* surcharge fonction du module marked */
        function escape(html, encode) {

            return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        marked.Renderer.oldCode = marked.Renderer.code;
        marked.Renderer.prototype.oldcode = marked.Renderer.prototype.code;
        marked.Renderer.prototype.code = function (code, lang, escaped) {

            if (lang == "javascript showroom") {
                return '<pre class="container-code"><code class="' +
                    escape(lang, true) +
                    '">' +
                    escape(code, true) +
                    '\n</code></pre>\n';
            } else {
                if (this.options.highlight) {
                    var out = this.options.highlight(code, lang);
                    if (out != null && out !== code) {
                        escaped = true;
                        code = out;
                    }
                }

                if (!lang) {
                    return '<pre><button class="copy-code-button">Copier</button><code>' +
                        (escaped ? code : escape(code, true)) +
                        '\n</code></pre>';
                }

                return '<pre><button class="copy-code-button">Copier</button><code class="' +
                    this.options.langPrefix +
                    escape(lang, true) +
                    '">' +
                    (escaped ? code : escape(code, true)) +
                    '\n</code></pre>\n';
            }
        };

        /**
         * SURCHARGE
         * Reformate les liens présents dans le md si celui pointe vers
         * un autre ".md"
         */
        marked.Renderer.prototype.link = function (href, title, text) {

            var rgx = new RegExp(/(^[\.])([\W\w]+)(\.md$)/, "g");

            if (rgx.test(href)) {
                href = PathHelper.cleanName(href.split(".md")[0]);
            }

            var out = '<a href="' + href + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '>' + text + '</a>';
            return out;
        };


        /**
         * SURCHARGE
         * modification Id des balise h
         */
        let idcpt = 0;
        marked.Renderer.prototype.heading = function (text, level, raw) {

            return '<h' +
                level +
                ' id="' +
                this.options.headerPrefix +
                raw.toLowerCase().replace(/[^\w]+/g, '-') + "-" + idcpt++ +
                '">' +
                text +
                '</h' +
                level +
                '>\n';
        };


        const hljs = require("highlight.js");
        marked.setOptions({
            highlight: function (code, lang) {
                if (typeof lang === "undefined") {
                    return hljs.highlightAuto(code).value;
                } else if (lang === "nohighlight") {
                    return code;
                } else {
                    return hljs.highlight(lang, code).value;
                }

            }
        });


        //Add task if needed
        gulp.beforeTask("compile", function () {
            helper.info("Exemple before compile task");

            //Recuperation de la documentation dans le composant
            //var composantDirectory = "node_modules/app/hornet-js-react-components/";

            var fwkName = "hornet-js";
            var builderName = "hornet-js-builder";
            var docName = "hornet-js-man";
            var templateHornetName = "generator-hornet-js";
            var templateHornetLiteName = "generator-hornet-js-lite";
            var templateHornetLiteBatchName = "generator-hornet-js-lite-batch";
            var hornetThemes = "hornet-themes-intranet";
            var communityName = "hornet-js-community";
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
                "edition-action-column",
                "edition-action-body-cell",
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
            let compFiles = PathHelper.listFiles(composantDirectory, ".tsx", [/generator-hornet-js/, /generator-hornet-js-lite/, /generator-hornet-js-lite-batch/]);
            let projects = PathHelper.listDir(nodeModuleDir, "hornet-js");
            let mdFwkFiles = [];

            let mdCommunityFiles = (fs.existsSync(communityDir)) ? PathHelper.listFiles(communityDir, ".md") : [];

            if (project.builderJs.externalModules.enabled) {
                mdFwkFiles = PathHelper.listFiles(fwkDir, ".md", [/node_modules/, /\-dts/, /LICENSE.md/, /definition-ts/, /CHANGELOG.md/]);

            } else {
                for (var i = 0; i < projects.length; i++) {
                    let file = PathHelper.listFilesWithDirName(projects[i].dataPath, ".md", [/\-dts/, /LICENSE.md/, /CHANGELOG.md/, /definition-ts/]);
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
            MenuHelper.getFiles(project, helper, hornetThemes, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetName, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetLiteName, filesToObject);
            MenuHelper.getFiles(project, helper, templateHornetLiteBatchName, filesToObject);

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
                            let menuFile = {
                                "text": MenuHelper.cleanName(projects[i].name),
                                "title": projects[i].name,
                                "visibleDansMenu": true,
                                "visibleDansPlan": true,
                                "submenu": [fmkMenuObject.menu[j]]
                            }
                            tmpMenuNode = menuFile;
                        } else {
                            tmpMenuNode.submenu.push(fmkMenuObject.menu[j]);
                        }
                    }
                    fmkMenuObjects.push(tmpMenuNode);
                }
                fmkMenu = {
                    "text": "HORNET-JS",
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

            let menuProjet = [fmkMenu, builderMenu, templateHornetMenu, templateHornetLiteMenu, templateHornetLiteBatchMenu];
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

        });

        gulp.afterTask("compile", function () {
            helper.info("Exemple after compile task");
        });

        gulp.addTaskDependency("package-zip-static", "prepare-package:spa");
    },
    externalModules: {
        enabled: false,
        directories: [

        ]
    },
    config: {
        clientExclude: {
            modules: ["config", "continuation-local-storage"],
            noParse: ["node_modules/app/typescript"]
        },
        typescript: { //bin: "~/Dev/node-v4.5.0-linux-x64/lib/node_modules/typescript"
        },
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
            [/moment[\/\\]locale$/, /fr|en/],
            [/intl[\/\\]locale-data[\/\\]jsonp$/, /fr|en/]

        ],      
        spaFilter: ["^((?!.*config\/)).*"]        
    }
};