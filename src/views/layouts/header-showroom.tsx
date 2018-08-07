import *  as React from "react";

import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { BreadCrumb } from "hornet-js-react-components/src/widget/navigation/bread-crumb";
import { HeaderPage } from "hornet-js-react-components/src/widget/header/header-page";
import { Utils } from "hornet-js-utils";
import { SocialNetwork } from "src/views/components/social-network";

export interface HeaderShowroomProps extends HornetComponentProps {
    isVisible?: boolean;
}

/**
 * Composant de recherche dans le menu et affichage des résultats
 */
export class HeaderShowroom extends HornetComponent<HeaderShowroomProps, any> {


    render() {

        return (
            <HeaderPage>
                <div id="header-showroom">
                    <div className="grid-4 has-gutter">
                        <div className={"header-titre one-sixth"}>
                            <a href={this.genUrl(Utils.config.getOrDefault("welcomePage", "/"))}
                                title={this.i18n("applicationTitle")}>SHOWROOM</a>
                        </div>
                        <div className={"one-half"}><BreadCrumb /></div>
                        <div className={"one-sixth social-network"}><SocialNetwork /></div>
                        <div className={"one-sixth header-version"}>{"v" + Utils.appSharedProps.get("appVersion")}</div>
                    </div>
                </div>
            </HeaderPage>
        );
    }
}
