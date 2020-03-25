import {ChangeEvent, KeyboardEvent} from "react";
import * as React from "react";
import {Alert} from "react-bootstrap";
import {Link} from "react-router-dom";
import * as Spinner from "react-spinkit";
import {VisibilityContainer} from "../Common/VisibilityContainer";
import "./LoginComponent.css";

export type OnLoginFunction = (username: string, password: string, showError: (error: string) => void) => void;

export interface ILoginComponentProps {
    onLogin: OnLoginFunction;
    isPending: boolean;
}

export interface ILoginComponentState {
    username: string;
    password: string;
    showError: boolean;
    errorMessage?: string;
}

export class LoginComponent extends React.Component<ILoginComponentProps, ILoginComponentState> {

    constructor(props: ILoginComponentProps) {
        super(props);
        this.state = {password: "", username: "", showError: false};
    }

    public render() {
        return (
            <div id="login">
                <VisibilityContainer visible={this.state.showError}>
                    <Alert bsStyle="warning" id="alert-box" onDismiss={this.handleDismiss}>
                        <strong>{this.state.errorMessage}</strong>
                    </Alert>
                </VisibilityContainer>
                <div className="simple-card">
                    <div id="loginText">Log In</div>
                    <form>
                        <input type="text" placeholder="Username" className="default-input" autoComplete="username"
                               value={this.state.username} onChange={this.updateUsername}/>
                        <input type="password" placeholder="Password" className="default-input"
                               value={this.state.password} onChange={this.updatePassword}
                               autoComplete="current-password" onKeyPress={this.onKeyPress}/>
                        <input type="button" value="Log In" className="default-input-button" onClick={this.doLogin}
                               disabled={this.props.isPending}/>
                        <VisibilityContainer visible={this.props.isPending} id="spinner-box" displayNone={true}>
                            <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                        </VisibilityContainer>
                        <p>
                            <Link to="/register">Register a new Account</Link><br/>
                            <Link to="/reset_pw">Forgot your password</Link>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    private onKeyPress = async (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter") {
            await this.doLogin();
        }
    };

    private updateUsername = (evt: ChangeEvent<HTMLInputElement>) => this.setState({username: evt.target.value});
    private updatePassword = (evt: ChangeEvent<HTMLInputElement>) => this.setState({password: evt.target.value});
    private handleDismiss = () => this.setState({showError: false});
    private showError = (error: string) => this.setState({showError: true, errorMessage: error});
    private doLogin = async () => this.props.onLogin(this.state.username, this.state.password, this.showError);
}

