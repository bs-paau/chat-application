import * as React from "react";

export class VisibilityContainer extends React.Component<{ visible: boolean, id?: string, itemRef?: any, displayNone?: boolean }> {
    public render(): React.ReactNode {
        const style = {
            opacity: this.props.visible ? 1 : 0,
            display: this.props.displayNone && !this.props.visible ? "none" : undefined
        };

        return <div
            style={style}
            id={this.props.id}
            ref={this.props.itemRef}>
            {this.props.children}
        </div>
    }
}