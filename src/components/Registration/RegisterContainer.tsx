import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {push} from "react-router-redux";
import {PasswordValidator} from "../../logic/business/PasswordValidator";
import * as actions from "../../logic/redux/actions";
import {loginUserSuccess} from "../../logic/redux/actions/userAction";
import {Body1, DefaultApi, User as RestUser} from "../../logic/rest";
import {User} from "../../types";
import RegisterComponent from "./RegisterComponent";


export interface IRegisterParams {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    tosAccepted: boolean;
    showError: (error: string) => void;
}

export type RegisterFunction = (props: IRegisterParams) => void;

class RegisterContainer extends React.Component<IRegisterContainerProps, {isPending: boolean}> {

    private static convertToUserDTO(user: RestUser): User {
        return {
            username: user.username!,
            userId: user.id,
            lastName: user.lastname!,
            firstName: user.firstname!,
            email: user.email!,
            emailVerified: user.emailVerified,
        };
    }

    constructor(props: IRegisterContainerProps) {
        super(props);
        this.state = {isPending: false};
    }

    public render(): React.ReactNode {
        return (<RegisterComponent onRegister={this.onRegister} isPending={this.state.isPending}/>);
    }
    
    private checkFields(props: IRegisterParams): boolean {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(props.firstName === "") {
            props.showError("Please enter a first name!");
            return true;
        }

        if(props.lastName === "") {
            props.showError("Please enter a last name!");
            return true;
        }

        if(props.username === "") {
            props.showError("Please enter a username!");
            return true;
        }

        if(props.email === "") {
            props.showError("Please enter an email!");
            return true;
        }

        if(!emailRegex.test(props.email))
        {
            props.showError("Please enter a valid E-Mail address!")
            return true;
        }

        if(props.password === "") {
            props.showError("Please enter a password name!");
            return true;
        }

        if(!PasswordValidator.validatePassword(props.password)) {
            props.showError("Password must match the following criteria: \"Minimum eight characters, at least one lower and one upper case letter and one number\"");
            return true;
        }

        if (props.password !== props.confirmPassword) {
            props.showError("Passwords do not match!");
            return true;
        }

        if(!props.tosAccepted) {
            props.showError("You have to accept the TOS!");
            return true;
        }

        return false;
    }

    private onRegister = async (props: IRegisterParams) => {
        if(this.checkFields(props)) {
            return;
        }

        this.setState({isPending: true});

        const api = new DefaultApi();
        const body: Body1 = {
            username: props.username,
            password: props.password,
            lastname: props.lastName,
            firstname: props.firstName,
            email: props.email
        };

        try {
            const response = await api.registerPost(body, {headers: {"Accept": "application/json"}});
            const userDto = RegisterContainer.convertToUserDTO(response.data.user);
            this.props.loginUserSuccess(userDto, response.data.authToken);
            this.setState({isPending: true});
            this.props.pushHistory("/profile");
        } catch (e) {
            let handled = false;
            const show = (error: string) => {
                handled = true;
                props.showError(error);
            };

            if (e instanceof Response) {
                switch (e.status) {
                    case 400:
                        const json400 = await e.json();
                        switch (json400.reason) {
                            case "missing_parameter":
                                show("Please fill out all fields!");
                                break;
                            case "email_invalid":
                                show("Please enter a valid email!");
                                break;
                            case "password_not_match_criterias":
                                show("The Password does not match the criterias!");
                                break;
                            case "other_reason":
                                show("Unable to register! Please try again later.");
                        }
                        break;
                    case 409:
                        const json409 = await e.json();
                        switch (json409.reason) {
                            case "username_already_used":
                                show("The username is already taken!");
                                break;
                            case "email_already_used":
                                show("An account is already registered for this email!");
                        }
                }
            }
            if (!handled) {
                show("Unable to register! Please try again later");
            }
        }
        this.setState({isPending: true});
    };
}

interface IRegisterContainerProps {
    pushHistory: (route: string) => void;
    loginUserSuccess: (user: User, authToken: string) => void;
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ReduxAction>): Partial<IRegisterContainerProps> {
    return {
        loginUserSuccess: (user: User, authToken: string) => dispatch(loginUserSuccess(user, authToken)),
        pushHistory: (route: string) => dispatch(push(route)),
    }
}

export default connect(null, mapDispatchToProps)(RegisterContainer);