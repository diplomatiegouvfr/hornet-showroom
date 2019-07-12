import { Utils } from "hornet-js-utils";
import * as React from "react";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { URL_CHANGE_EVENT } from "hornet-js-core/src/routes/router-client-async-elements";

/**
 * Fil d'ariane
 */
export class GitLabLink extends HornetComponent<HornetComponentProps, any> {


    communityLink: any = {}; // 

    /**
     * Construit une instance de BreadCrumb
     * @param props propriétés
     * @param context contexte
     */
    constructor(props: HornetComponentProps, context?: any) {
        super(props, context);

        const currentRoutePath = Utils.getCls("hornet.routePath");
        const menuConfig = NavigationUtils.getConfigMenu();
        const currentItem = NavigationUtils.getCurrentItem(menuConfig, currentRoutePath);
        this.state =
            {
                ...this.state,
                currentPath: currentRoutePath,
                url: currentItem ? (currentItem as any).gitlabUrl : null,
            };
        this.communityLink = Utils.appSharedProps.get("hornet.communityLink");
        this.listen(URL_CHANGE_EVENT, this.handleChangePath);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        if (this.communityLink) {
            return (
                (this.state.url && this.communityLink.git.labDoc) ? (this.renderGitlabLink()) :
                    this.state.url && this.communityLink.git.hubDoc ? (this.renderGithubLink()) : <div />
            );
        } else return (<div />);
    }

    componentWillUnmount() {
        this.remove(URL_CHANGE_EVENT, this.handleChangePath);
    }


    /**
     * génération du bouton gitlab
     * @returns {any}
     */
    renderGitlabLink() {


        /*
                <svg width="28" height="28" className="tanuki-logo" viewBox="0 0 36 36">
                        <path className="tanuki-shape tanuki-left-ear" fill="#e24329"
                            d="M2 14l9.38 9v-9l-4-12.28c-.205-.632-1.176-.632-1.38 0z" />
                        <path className="tanuki-shape tanuki-right-ear" fill="#e24329"
                            d="M34 14l-9.38 9v-9l4-12.28c.205-.632 1.176-.632 1.38 0z" />
                        <path className="tanuki-shape tanuki-nose" fill="#e24329" d="M18,34.38 3,14 33,14 Z" />
                        <path className="tanuki-shape tanuki-left-eye" fill="#fc6d26"
                            d="M18,34.38 11.38,14 2,14 6,25Z" />
                        <path className="tanuki-shape tanuki-right-eye" fill="#fc6d26"
                            d="M18,34.38 24.62,14 34,14 30,25Z" />
                        <path className="tanuki-shape tanuki-left-cheek" fill="#fca326"
                            d="M2 14L.1 20.16c-.18.565 0 1.2.5 1.56l17.42 12.66z" />
                        <path className="tanuki-shape tanuki-right-cheek" fill="#fca326"
                            d="M34 14l1.9 6.16c.18.565 0 1.2-.5 1.56L18 34.38z" />
                    </svg>
        */
        return (

            <a className ="home button-action picto-svg" title="Modifier le fichier sur gitlab" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.git.labDoc + this.state.url : ""} >
            </a>
        );
    }

    /**
     * génération du bouton gitlab
     * @returns {any}
     */
    renderGithubLink() {
        return (

            <a className="home" title="Modifier le fichier sur github" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.git.hubDoc + this.state.url : ""}>
                <div className={"fl"}>
                    <svg aria-hidden="true" className="octicon octicon-mark-github"
                         height="32" version="1.1" viewBox="0 0 16 16" width="32">
                        <path fill-rule="evenodd" 
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
                            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
                            1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 
                            0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 
                            0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 
                            2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z">
                        </path>
                    </svg>
                </div>
            </a>
        );
    }

    /**
     * Méthode exécutée lors du Changement de currentPath
     * @param ev
     */
    handleChangePath(ev) {
        const currentEvPath = ev.detail.newPath;

        const menuConfig = NavigationUtils.getConfigMenu();
        const currentItem = NavigationUtils.getCurrentItem(menuConfig, currentEvPath);

        let repeUrl = null;
        if (currentItem) {
            repeUrl = (currentItem as any).gitlabUrl;
        }
        this.setState({ currentPath: currentEvPath, url: repeUrl});
    }
}
