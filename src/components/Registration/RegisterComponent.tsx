import {ChangeEvent} from "react";
import * as React from "react";
import {Alert} from "react-bootstrap";
import * as Spinner from "react-spinkit";
import {VisibilityContainer} from "../Common/VisibilityContainer";
import "./RegisterComponent.css";
import { RegisterFunction} from "./RegisterContainer";

interface IRegisterComponentState {
    tosAccepted: boolean;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    showError: boolean;
    errorMessage: string;
}

class RegisterComponentState implements IRegisterComponentState {
    public confirmPassword: string = "";
    public email: string = "";
    public firstName: string = "";
    public lastName: string = "";
    public password: string = "";
    public username: string = "";
    public tosAccepted: boolean = false;
    public errorMessage: string = "";
    public showError: boolean = false;
}

interface IRegisterComponentProps {
    onRegister: RegisterFunction;
    isPending: boolean;
}

export default class RegisterComponent extends React.Component<IRegisterComponentProps, IRegisterComponentState> {

    constructor(props: IRegisterComponentProps, context: any) {
        super(props, context);
        this.state = new RegisterComponentState();
    }

    public render() {
        return (
            <div id="SignUp">
                <VisibilityContainer visible={this.state.showError}>
                    <Alert bsStyle="warning" id="alert-box" onDismiss={this.handleDismiss}>
                        <strong>{this.state.errorMessage}</strong>
                    </Alert>
                </VisibilityContainer>
                <div className="simple-card">
                    <div id="SignUpText">Sign Up</div>
                    <form>
                        <input type="text" placeholder="First Name" className="default-input" autoComplete="fname"
                               value={this.state.firstName} onChange={this.firstNameChange}/>
                        <input type="text" placeholder="Last Name" className="default-input" autoComplete="lName"
                               value={this.state.lastName} onChange={this.lastNameChange}/>
                        <input type="text" placeholder="Username" className="default-input"
                               value={this.state.username} onChange={this.userNameChange}/>
                        <input type="email" placeholder="Email" className="default-input" value={this.state.email}
                               onChange={this.emailChange} autoComplete="email"/>
                        <input type="password" placeholder="Password" className="default-input"
                               autoComplete="new-password" value={this.state.password} onChange={this.passwordChange}/>
                        <input type="password" placeholder="Confirm Password" className="default-input"
                               autoComplete="new-password" value={this.state.confirmPassword}
                               onChange={this.cPasswordChange}/>

                        <div id="tos-container" className="no-select" onClick={this.handleOnTosClick}>
                            <input className="tos" name="remember" type="checkbox" checked={this.state.tosAccepted}/>
                            <span className="tos"> &nbsp;&nbsp; I agree to the SimpleChat Terms of Service</span>
                        </div>

                        <input type="button" value="Sign Up" className="default-input-button"
                               onClick={this.handleRegister}/>

                        <VisibilityContainer visible={this.props.isPending} id="spinner-box" displayNone={true}>
                            <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                        </VisibilityContainer>
                    </form>
                </div>
                <div className="col-12 col-s-12"/>
            </div>

        );
    }

    private handleDismiss = () => this.setState({showError: false});
    private showError = (error: string) => this.setState({showError: true, errorMessage: error});

    private readonly handleRegister = async () => {
        this.props.onRegister({
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            tosAccepted: this.state.tosAccepted,
            showError: this.showError
        });
    };

    private readonly handleOnTosClick = () => this.setState({tosAccepted: !this.state.tosAccepted});
    private readonly firstNameChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({firstName: evt.target.value});
    private readonly lastNameChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({lastName: evt.target.value});
    private readonly userNameChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({username: evt.target.value});
    private readonly emailChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({email: evt.target.value});
    private readonly passwordChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({password: evt.target.value});
    private readonly cPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => this.setState({confirmPassword: evt.target.value});

}
