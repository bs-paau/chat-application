import {ChangeEvent} from "react";
import * as React from "react";
import {Alert, Modal} from "react-bootstrap";
import * as Spinner from "react-spinkit";
import {User} from "../../../types";
import {FloatingLabelInput} from "../../Common/FloatingLabelInput";
import {SimpleButton} from "../../Common/SimpleButton";
import {VisibilityContainer} from "../../Common/VisibilityContainer";
import EmailInputContainer from "./Email/EmailInputContainer";
import {PasswordFloatingLabelInput} from "./Password/PasswordFloatingLabelInput";
import "./UpdateProfileModal.css";


export interface IProfileData {
    firstname?: string;
    lastname?: string;
    email?: string;
    emailVerify?: string;
    password?: string;
    passwordVerify?: string;
}

interface IUpdateProfileModalProps {
    user: User;
    container: any;
    show: boolean;
    onHide: () => void;
    onErrorDismiss: () => void;
    onSubmit: (data: IProfileData) => void;
    showError: boolean;
    errorMessage?: string;
    isPending: boolean;
}

interface IUpdateProfileModalState {
    email?: string;
    verifyEmail?: string;
    password?: string;
    verifyPassword?: string;
    firstname?: string;
    lastname?: string;
}

export class UpdateProfileModal extends React.Component<IUpdateProfileModalProps, IUpdateProfileModalState> {
    constructor(props: IUpdateProfileModalProps, context: any) {
        super(props, context);
        this.state = {};
    }

    public render(): React.ReactNode {
        const firstName = getCapitalized(this.props.user.firstName);
        const lastName = getCapitalized(this.props.user.lastName);

        return <Modal onHide={this.modalOnHide} show={this.props.show} container={this.props.container}
                      style={{marginTop: "100px"}}>
            <Modal.Header closeButton={true}>
                <Modal.Title>Edit your profile</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <VisibilityContainer visible={this.props.showError} displayNone={true}>
                    <Alert bsStyle="warning" id="alert-box-profile" onDismiss={this.props.onErrorDismiss}>
                        <strong>{this.props.errorMessage}</strong>
                    </Alert>
                </VisibilityContainer>
                <FloatingLabelInput id="first-name-input" label="First Name" value={firstName}
                                    onChange={this.firstnameChanged}/>
                <FloatingLabelInput id="last-name-input" label="Last Name" value={lastName}
                                    onChange={this.lastnameChanged}/>
                <EmailInputContainer emailChanged={this.emailChanged} emailVerifyChanged={this.emailVerifyChanged}/>
                <PasswordFloatingLabelInput passwordChanged={this.passwordChanged}
                                            passwordVerifyChanged={this.passwordVerifyChanged}/>
            </Modal.Body>

            <Modal.Footer>
                <SimpleButton text="Update Profile" onClick={this.onSubmit}/>
                <VisibilityContainer visible={this.props.isPending} id="spinner-box" displayNone={true}>
                    <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                </VisibilityContainer>                
            </Modal.Footer>
        </Modal>
    }

    private firstnameChanged = (evt: ChangeEvent<HTMLInputElement>) => this.setState({firstname: evt.target.value});
    private lastnameChanged = (evt: ChangeEvent<HTMLInputElement>) => this.setState({lastname: evt.target.value});
    private emailChanged = (evt: string) => this.setState({email: evt});
    private emailVerifyChanged = (evt: string) => this.setState({verifyEmail: evt});
    private passwordChanged = (evt: string) => this.setState({password: evt});
    private passwordVerifyChanged = (evt: string) => this.setState({verifyPassword: evt});

    private modalOnHide = () => this.props.onHide();

    private onSubmit = () => {
        const profileData: IProfileData = {
            email: this.state.email, emailVerify: this.state.verifyEmail,
            password: this.state.password, passwordVerify: this.state.verifyPassword,
            firstname: this.state.firstname, lastname: this.state.lastname,
        };
        this.props.onSubmit(profileData);
    };
}



function getCapitalized(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

