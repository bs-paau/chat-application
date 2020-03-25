import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom"
import * as actions from "../../logic/redux/actions";
import {logoutUserSuccess} from "../../logic/redux/actions/userAction";
import {StoreState} from "../../logic/redux/types";
import {DefaultApi} from "../../logic/rest";
import './HeaderComponent.css';
import logo from './images/logo.png';

export interface IHeaderComponentProps extends RouteComponentProps<any> {
    loggedIn: boolean;
    logoutUserSuccess: () => void;
    authToken: string;
}


export class HeaderComponent extends React.Component<RouteComponentProps<any> & IHeaderComponentProps> {
    public render() {

        const fullSizePages = ["/chat"];
        const isFullSize = fullSizePages.indexOf(this.props.location.pathname) === -1;

        return (
            <div id="header">
                <div id="headerCenter" style={{maxWidth: isFullSize ? "1500px" : "none"}}>
                    <Link to="/">
                        <img id="app-header_logo" src={logo} alt="Simple.Chat"/>
                    </Link>

                    <a className="headerButton" type="button" hidden={!this.props.loggedIn}
                       onClick={this.handleLogout}>Logout</a>
                    <ConditionalLink to="/profile" content="Profile" visible={this.props.loggedIn}/>

                    <ConditionalLink to="/register" content="Register" visible={!this.props.loggedIn}/>
                    <ConditionalLink to="/login" content="Login" visible={!this.props.loggedIn}/>

                    <ConditionalLink to="/chat" content="Chat" visible={this.props.loggedIn}/>
                </div>
            </div>
        );
    }

    private handleLogout = () => {
        const api = new DefaultApi();
        api.logoutGet(this.props.authToken, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        this.props.logoutUserSuccess();
        this.props.history.replace("/");
    };
}

function ConditionalLink({to, content, visible}: { to: string, content: string, visible: boolean }) {
    if (visible) {
        return <Link className="headerButton" to={to}>{content}</Link>
    }
    return null;
}


export function mapStateToProps({user}: StoreState, publicProps: RouteComponentProps<any>): Partial<IHeaderComponentProps> {
    return {...publicProps, loggedIn: user.loggedIn, authToken: user.authToken};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ReduxAction>): Partial<IHeaderComponentProps> {
    return {
        logoutUserSuccess: () => dispatch(logoutUserSuccess())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComponent));