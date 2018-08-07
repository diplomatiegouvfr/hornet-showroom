import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import * as ReactDOM from "react-dom";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";
import * as classNames from "classnames";
import { GitLabLink } from "src/views/components/gitlab-link";

export interface SummaryOpenCloseDetail {
    opened: boolean;
}

export let SUMMARY_OPEN_CLOSE = new HornetEvent<SummaryOpenCloseDetail>("SUMMARY_OPEN_CLOSE");


const logger: Logger = Utils.getLogger("hornet-showroom.summary");


export interface SummaryProps extends HornetComponentProps {
    summary: any;
}

export interface SummaryState {
    isVisible: boolean;
}

/**
 * Permet d'afficher le sommaire d'une page html
 */
export class Summary<P extends SummaryProps, S extends SummaryState> extends HornetComponent<SummaryProps, any> {

    currentItem: any;

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            isVisible: true,
        };
    }

    /**
     * @inheritDoc
     */
    componentDidMount(): void {
        super.componentDidMount();
        this.initActive();
        window.addEventListener("scroll", this.handleScroll);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount(): void {
        super.componentWillUnmount();
        window.removeEventListener("scroll", this.handleScroll);
    }

    /**
     * @inheritDoc
     */
    componentDidUpdate(prevProps: SummaryProps, prevState: SummaryState, prevContext: any): void {
        super.componentDidUpdate(prevProps, prevState, prevContext);
        this.initActive();
    }

    /**
     * @inheritDoc
     */
    render() {
        const visible = this.state.isVisible ? "summary-visible" : "summary-hidden";


        const classNameButtonGitlab = {
            "gitlab-button": true,
            //  "gitlab-button-right-0": summary.length === 0
        };

        return (
            <div>
                <div id={"gitlab-button"} className={classNames(classNameButtonGitlab)}><GitLabLink /></div>
                <div className={"summary " + visible}>
                    {this.state.isVisible ?
                        <div>
                            <div className="summary-arrow">
                                <img src={this.genUrlStatic("/img/arrow-right.svg")} onClick={this.openHide} />
                            </div>
                            <div className="summary-titles">
                                {this.state.summary.map((title, index) => {
                                    return (
                                        <div className={"summary-title"} key={"title" + index.toString()}>
                                            <a id={"title-" + title.id} onClick={() => { this.goToAnchor(title.id); }}
                                                className={"summary-title summary-title-" + title.level}>{title.name}</a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        : <img src={this.genUrlStatic("/img/arrow-left.svg")} onClick={this.openHide} />}
                </div>
            </div>
        );
    }

    /**
     * scroll jusqu'a l'ancre en prenant en compte le header
     * @param anchor
     */
    goToAnchor(anchor) {
        document.getElementById(anchor).scrollIntoView();
        window.scroll(window.scrollX, window.scrollY - 59);
    }

    /**
     * cache/montre le sommaire
     */
    openHide(): void {
        if (this.state.isVisible) {
            this.fire(SUMMARY_OPEN_CLOSE.withData({ opened: false }));
            this.setState({ isVisible: false });
        } else {
            this.fire(SUMMARY_OPEN_CLOSE.withData({ opened: true }));
            this.setState({ isVisible: true });
        }
    }

    /**
     * initialise le titre actif
     */
    initActive(): void {
        let id = "";
        if (!this.currentItem) {
            id = this.state.summary[ 0 ].id;
            this.currentItem = this.state.summary[ 0 ];
        } else {
            id = this.currentItem.id;
        }

        const elem = document.getElementById("title-" + id);
        if (elem) {
            elem.className += " title-active";
        }
    }

    /**
     * gestion du scroll de la page dans le menu
     * permet de déterminer le titre actif
     * @param e
     */
    handleScroll(e): void {
        const scrollPosition = e.target.scrollingElement.scrollTop;

        let closest = null;
        let closestItem = null;

        this.state.summary.map((item) => {
            const elem = document.getElementById(item.id);
            const elemTitle = document.getElementById("title-" + item.id);
            if (closest && elem) {

                elemTitle.className = elemTitle.className.replace(" title-active", "");
                const pos = this.getTop(elem).top;
                if (pos <= (scrollPosition + 80)) {
                    closest = elem;
                    closestItem = item;
                }
            } else {
                if (elem && elemTitle) {
                    elemTitle.className = elemTitle.className.replace(" title-active", "");
                    closest = elem;
                    closestItem = item;
                }
            }
        });

        if (closestItem) {
            this.currentItem = closestItem;
            let activeTitle = document.getElementById("title-" + closestItem.id);
            if (activeTitle) {
                activeTitle.className += " title-active";
            }
        }
    }

    /**
     * renvoie la position top et left de l'élément dans la page
     * @param element
     * @returns {{top: number; left: number}}
     */
    getTop(element): any {
        let topVal = 0;
        let leftVal = 0;
        do {
            topVal += element.offsetTop || 0;
            leftVal += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: topVal,
            left: leftVal,
        };
    }
}


