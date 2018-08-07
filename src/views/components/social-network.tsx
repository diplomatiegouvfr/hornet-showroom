import { Utils } from "hornet-js-utils";
import * as React from "react";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { NavigationUtils } from "hornet-js-components/src/utils/navigation-utils";
import { URL_CHANGE_EVENT } from "hornet-js-core/src/routes/router-client-async-elements";


/**
 * Fil d'ariane
 */
export class SocialNetwork extends HornetComponent<HornetComponentProps, any> {


    communityLink: any = {}; // 

    /**
     * Construit une instance de BreadCrumb
     * @param props propriétés
     * @param context contexte
     */
    constructor(props: HornetComponentProps, context?: any) {
        super(props, context);

        this.communityLink = Utils.appSharedProps.get("hornet.communityLink");

        this.listen(URL_CHANGE_EVENT, this.handleChangePath);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        /**
         */
        return (
            <div>
                {(this.communityLink && this.communityLink.git.labGen) ? this.renderGitlabLink() : ""}
                {(this.communityLink && this.communityLink.git.hubGen) ? this.renderGithubLink() : ""}
                {(this.communityLink && this.communityLink.twitter) ? this.renderTwitterLink() : ""}
                {(this.communityLink && this.communityLink.facebook) ? this.renderFacebookLink() : ""}
            </div>
        );

    }

    componentWillUnmount() {
        this.remove(URL_CHANGE_EVENT, this.handleChangePath);
    }


    /**
     * génération du bouton gitlab
     * @returns {any}
                    */
    renderGitlabLink() {
        return (
            <a className="home" title="gitlab Hornet.js" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.git.labGen : ""} >
                <div className={"fr"}>
                    <svg width="32" height="32" className="tanuki-logo" viewBox="0 0 36 36">
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
                </div>
            </a>
        );
    }

    /**
     * génération du bouton gitlab
     * @returns {any}
                    */
    renderGithubLink() {
        return (
            <a className="home" title="github diplomatiegouvfr" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.git.hubGen : ""}>
                <div className={"fr"}>
                    <svg aria-hidden="true" className="octicon octicon-mark-github" 
                    height="32" version="1.1" viewBox="0 0 16 16" width="32">
                        <path fill="#fff" fillRule="evenodd"
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 
                            7.59.4.07.55-.17.55-.38
                            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
                            1.08.58 1.23.82.72 1.21 1.87.87 
                            2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 
                            .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 
                            1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
                            1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                </div>
            </a>
        );
    }

    /**
     * génération du bouton twitter
     * @returns {any}
                    */
    renderTwitterLink() {

        return (
            <a className="home" title="Twitter @FrameworkHornet" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.twitter : ""}>
                <div className={"fr"}>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg3626" 
                    viewBox="0 0 300.00006 244.18703" height="32" width="32">
                        <g transform="translate(-539.17946,-568.85777)" id="layer1">
                            <path fill="#1da1f2" fillOpacity="1" fillRule="nonzero" stroke="none" id="path3611"
                                d="m 633.89823,812.04479 c 112.46038,0 173.95627,-93.16765 173.95627,-173.95625 0,-2.64628 -0.0539,-5.28062 
                                -0.1726,-7.90305 11.93799,-8.63016 22.31446,-19.39999 30.49762,-31.65984 -10.95459,4.86937 
                                -22.74358,8.14741 -35.11071,9.62551 12.62341,-7.56929 22.31446,-19.54304 26.88583,-33.81739 
                                -11.81284,7.00307 -24.89517,12.09297 -38.82383,14.84055 -11.15723,-11.88436 
                                -27.04079,-19.31655 -44.62892,-19.31655 -33.76374,0 -61.14426,27.38052 
                                -61.14426,61.13233 0,4.79784 0.5364,9.46458 1.58538,13.94057 
                                -50.81546,-2.55686 -95.87353,-26.88582 -126.02546,-63.87991 
                                -5.25082,9.03545 -8.27852,19.53111 -8.27852,30.73006 
                                0,21.21186 10.79366,39.93837 27.20766,50.89296 -10.03077,-0.30992 
                                -19.45363,-3.06348 -27.69044,-7.64676 -0.009,0.25652 -0.009,0.50661 
                                -0.009,0.78077 0,29.60957 21.07478,54.3319 49.0513,59.93435 
                                -5.13757,1.40062 -10.54335,2.15158 -16.12196,2.15158 -3.93364,0 
                                -7.76596,-0.38716 -11.49099,-1.1026 7.78383,24.2932 30.35457,41.97073 57.11525,42.46543 
                                -20.92578,16.40207 -47.28712,26.17062 -75.93712,26.17062 
                                -4.92898,0 -9.79834,-0.28036 -14.58427,-0.84634 27.05868,17.34379 59.18936,27.46396 93.72193,27.46396" />
                        </g>
                    </svg>

                </div>
            </a >
        );
    }

    /**
     * génération du bouton gitlab
     * @returns {any}
                    */
    renderFacebookLink() {
        return (
            <a className="home" title="Facebook" id="logo" target={"_blank"}
                href={this.communityLink ? this.communityLink.githubUrl : ""}>
                <div className={"fr"}>
                    facebook
                </div>
            </a>
        );
    }


    /**
     * Méthode exécutée lors du Changement de currentPath
     * @param ev
     */
    handleChangePath(ev) {
        const currentNewPath = ev.detail.newPath;

        const menuConfig = NavigationUtils.getConfigMenu();
        const currentItem = NavigationUtils.getCurrentItem(menuConfig, currentNewPath);
        let urlParams = null;
        if (currentItem) {
            urlParams = (currentItem as any).gitlabUrl;
        }
        this.setState({
            currentPath: currentNewPath,
            url: urlParams,
        });
    }
}
