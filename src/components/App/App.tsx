import * as React from "react";
import {RouteComponentProps, Switch} from "react-router";
import {Route} from "react-router-dom"
import {ConnectedRouter} from "react-router-redux";
import ChatComponent from "../Chat/ChatComponent";
import {Aux} from "../Common/AuxContainer";
import EnsureLoggedInRoute from "../EnsureLoggedIn/EnsureLoggedInRoute";
import HeaderComponent from "../Header/HeaderComponent";
import LoginContainer from "../Login/LoginContainer";
import ProfileComponent from "../Profile/ProfileComponent";
import RegisterContainer from "../Registration/RegisterContainer";
import WelcomeComponent from "../Welcome/WelcomeComponent";

import './App.css';

class App extends React.Component<{history: any}> {
    public render() {
        return (
            <ConnectedRouter history={this.props.history}>
                <div className="App">
                    <Route exact={false} path="/" component={HeaderComponent}/>
                    <Switch>
                        <Route exact={true} path="/" component={WelcomeComponent}/>
                        <Route exact={true} path="/login" component={LoginContainer}/>
                        <Route exact={true} path="/register" component={RegisterContainer}/>
                        <Route component={PrivateRoutes}/>
                    </Switch>
                </div>
            </ConnectedRouter>
        );
    }
}

function PrivateRoutes(props: RouteComponentProps<any>) {
    return (
        <Aux>
            <EnsureLoggedInRoute key="1" exact={true} path="/chat" component={ChatComponent} {...props}/>
            <EnsureLoggedInRoute key="2" exact={true} path="/profile" component={ProfileComponent} {...props}/>
        </Aux>
    );
}

export default App;
