import *  as React from "react";
import { HornetComponent } from "hornet-js-react-components/src/widget/component/hornet-component";
import { HornetComponentProps } from "hornet-js-components/src/component/ihornet-component";
import { Menu } from "src/widgets/navigation/menu";
import { SELECTED_RESULT_CHANGE } from "src/views/layouts/search/search-result";
import { HornetEvent } from "hornet-js-core/src/event/hornet-event";


export interface MenuOpenEventDetail {
    open: boolean
}
export var MENU_OPEN_EVENT = new HornetEvent<MenuOpenEventDetail>("MENU_OPEN_EVENT");


export interface MenuShowroomProps extends HornetComponentProps {
    menuState?: boolean;
    isMenuOpen?: boolean;
};


/**
 * Menu du showroom
 */
export class MenuShowroom extends HornetComponent<MenuShowroomProps, any> {

    constructor(props, context?: any) {
        super(props, context);

        this.listen(SELECTED_RESULT_CHANGE, (event) => {
            let reload = !this.state.reload;
            this.setState({ reload: reload })
        });

        this.state.isMenuOpen = false;
    }

    /**
     * @inheritDoc
     */
    render(): JSX.Element {

        return (
            <div id="showroom-menu-container">
                <Menu vertical={true} onToggleClick={this.openCloseMenu} closeOnLinkClick={false}
                      closeOnClickOutside={false} closeOnTabOutside={false} toggleMenuState={this.props.menuState}
                      isMenuOpen={this.props.menuState}/>
            </div>
        );
    }

    /**
     * fermeture et ouverture du menu, appelée au click sur le toggler du menu
     */
    private openCloseMenu() {
        if (this.state.isMenuOpen == false && !this.props.menuState) {
            this.fire(MENU_OPEN_EVENT.withData({ open: true }));
            this.setState({ isMenuOpen: true });
        } else {
            this.fire(MENU_OPEN_EVENT.withData({ open: false }));
            this.setState({ isMenuOpen: false, });
        }
    }
}