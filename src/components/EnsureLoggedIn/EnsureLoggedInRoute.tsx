import * as React from "react";
import {connect} from "react-redux";
import {Route, RouteComponentProps} from "react-router";
import {Dispatch} from "redux";
import {ReduxAction} from "../../logic/redux/actions";
import {StoreState} from "../../logic/redux/types";

interface IPublicEnsureLoggedInComponentProps extends RouteComponentProps<any>  {
    component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    path?: string;
    exact?: boolean;
}

interface IEnsureLoggedInComponentProps extends IPublicEnsureLoggedInComponentProps{
    loggedIn: boolean;
}


class EnsureLoggedInRoute extends React.Component<IEnsureLoggedInComponentProps> {
    public componentDidMount(): void {
        if(!this.props.loggedIn) {
            this.props.history.replace("/login");
        }
    }

    public render(): React.ReactNode {
        const {loggedIn, exact, path, component} = this.props;
        if (loggedIn) {
            return <Route exact={exact} path={path} component={component}/>
        }
        return null;
    }
}

export function mapStateToProps({user : {loggedIn}} : StoreState, ownProps: IPublicEnsureLoggedInComponentProps) : Partial<IEnsureLoggedInComponentProps>{
    return { loggedIn, ...ownProps };
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>) : Partial<IEnsureLoggedInComponentProps> {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInRoute);
