import { Logger } from "hornet-js-logger/src/logger";
import *  as React from "react";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import * as AppModule from "src/resources/upgrading.json";

const logger: Logger = Logger.getLogger("hornet-showroom.versionning");

export interface VersionProps extends HornetComponentProps {

}

export interface VersionState {

}

/**
 * Permet d'afficher le sommaire d'une page html
 */
export class Versionning<P extends VersionProps, S extends VersionState> extends HornetComponent<VersionProps, any> {

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        return (
            <div className="grid-2 has-gutter-xl">
                {this.renderModule()}
            </div>
        );
    }

    /**
     * renvoie le code html des element à afficher
     * @returns {any[]}
     */
    renderModule() {

        const htmlRender = [];
        let cptModule = 0;
        let cptNode = 0;
        if (AppModule && (AppModule as any).app) {

            for (const rub in (AppModule as any).app) {
                const node = (AppModule as any).app[ rub ];
                if (node && (node as any).length) {
                    const htmlCode = [];
                    for (const el in (node as any)) {
                        const doc = node[el].doc ? (<a href={node[el].doc} target={"_blank"}>Documentation
                        </a>) : null;

                        htmlCode.push(
                            <div className="one-half card" key={"moduleversion_" + cptNode++} >
                                <a href={node[el].link} target={"_blank"}>
                                    <img src={this.genUrlStatic(node[ el ].logo)} className="version-img" />
                                    <br />
                                    <span>  {node[ el ].name} <br /> <strong>{node[ el ].version} </strong></span>
                                </a>
                                {doc}
                            </div >);
                    }
                    htmlRender.push(
                        <div key={"rub_" + cptModule++}>
                            <p className="version-title"><strong>{rub}</strong> </p>
                            <div className="version-content" >
                                <div className={"grid-" + node.length + " has-gutter-l"} >{htmlCode} </div>
                            </div>
                        </div>);
                }
            }
        }
        return htmlRender;
    }
}
