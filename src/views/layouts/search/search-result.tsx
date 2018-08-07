import { Utils } from "hornet-js-utils";
import { Logger } from "hornet-js-utils/src/logger";
import *  as React from "react";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { HornetEvent, CHANGE_URL_WITH_DATA_EVENT } from "hornet-js-core/src/event/hornet-event";
import { SEARCH_RESULT_EVENT } from "src/views/layouts/hornet-app";

export interface SelectedResultChangeDetail {
    result: any;
}
export const SELECTED_RESULT_CHANGE = new HornetEvent<SelectedResultChangeDetail>("SELECTED_RESULT_CHANGE");

const logger: Logger = Utils.getLogger("search-result.showroom.page");

export interface SearchResultProps extends HornetComponentProps {
    item: any;
}


/**
 * Composant permettant d'afficher un résultat de recherche
 */
export class SearchResult extends HornetComponent<SearchResultProps, any> {

    constructor(props, context?: any) {
        super(props, context);

        this.state = {
            ...this.state,
            isActive: false,
        };
    }

    /**
     * @inheritDoc
     */
    componentDidMount() {
        this.listen(SELECTED_RESULT_CHANGE, this.setSelectedResult);
        this.listen(SEARCH_RESULT_EVENT, this.activeResult);
    }

    /**
     * @inheritDoc
     */
    componentWillUnmount() {
        this.remove(SELECTED_RESULT_CHANGE, this.setSelectedResult);
        this.remove(SEARCH_RESULT_EVENT, this.activeResult);
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {
        // remplacement des balise posant problème dans le résumé
        let text = this.props.item.all.replace(new RegExp(this.props.item.word, "gi"), "<span class=\"search-word\">" +
            this.props.item.word +
            "</span>");
        text = text.replace(new RegExp("<pre>", "g"), "<div class=\"pre\">");
        text = text.replace(new RegExp("</pre>", "g"), "</div>");
        text = text.replace(new RegExp("<code", "g"), "<div class=\"code\" ");
        text = text.replace(new RegExp("</code>", "g"), "</div>");

        const className = this.state.isActive ? "result-container result-container-active" : "result-container";
        return (
            <div className={className} onClick={this.openDoc.bind(this.props.item)}>
                <span className="result-name">{this.props.item.name}</span><br />
                <span className="result-path">{this.props.item.path}</span><br />
                <span className="result-all" dangerouslySetInnerHTML={{ __html: text as any }}></span>
            </div>
        );
    }

    /**
     * Remet l'état à inactif
     * @param event
     */
    activeResult(event) {
        this.setState({ isActive: false });
    }

    /**
     * Change le résultat actif
     * @param event
     */
    setSelectedResult(event) {
        this.changeActive(event.detail.result);
    }

    /**
     * Ouvre la documentation liée au résultat
     */
    openDoc() {
        const itemUrl = this.props.item.url;
        this.fire(SELECTED_RESULT_CHANGE.withData({ result: this.props.item }));
        this.fire(CHANGE_URL_WITH_DATA_EVENT.withData({ url: itemUrl, data: { word: this.props.item.word }, cb: null }));
    }

    /**
     * Change le résultat actif
     */
    changeActive(item) {
        if (this.props.item !== item) {
            if (this.state.isActive) {
                this.setState({ isActive: false });
            }
        } else {
            if (!this.state.isActive) {
                this.setState({ isActive: true });
            }
        }
    }
}
