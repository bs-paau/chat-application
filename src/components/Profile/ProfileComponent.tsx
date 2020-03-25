import * as React from "react";
import {connect} from "react-redux";
import {StoreState} from "../../logic/redux/types";
import {User} from "../../types";
import {SimpleButton} from "../Common/SimpleButton";
import DeleteAccountModalContainer from "./DeleteAccountModal/DeleteAccountModalContainer";

import "../Common/FloatingLabelInput.css";
import "./ProfileComponent.css";

import UpdateProfileModalContainer from "./UpdateProfileModal/UpdateProfileModalContainer";


export interface IProfileComponentProps {
    currentUser: User;
}

interface IProfileComponentState {
    showProfileUpdateModal: boolean;
    showProfileDeleteModal: boolean;
}

export class ProfileComponent extends React.Component<IProfileComponentProps, IProfileComponentState> {
    constructor(props: IProfileComponentProps) {
        super(props);
        this.state = {showProfileDeleteModal: false, showProfileUpdateModal: false};
    }

    public render() {
        return (
            <div id="profile">

                <div className="col-12 col-s-12">
                    <h2>
                        Welcome <span className="primary-color text">
                        <FirstAndLastName {...this.props.currentUser}/>
                    </span>
                    </h2>
                </div>


                <div className="col-12 col-s-12">

                    <div id="inner-profile" className="text-center modal-container">
                        <UpdateProfileModalContainer container={this} show={this.state.showProfileUpdateModal}
                                                     onDismiss={this.onProfileModalDismiss}/>
                        <DeleteAccountModalContainer container={this} show={this.state.showProfileDeleteModal}
                                                     onDismiss={this.onProfileDeleteDismiss}/>
                    </div>


                    <div className="box simple-card">
                        <div id="user-data">
                            <UserDataRow text="First Name" value={getCapitalized(this.props.currentUser.firstName)}/>
                            <UserDataRow text="Last Name" value={getCapitalized(this.props.currentUser.lastName)}/>
                            <UserDataRow text="Username" value={this.props.currentUser.username}/>
                            <UserDataRow text="User ID" value={this.props.currentUser.userId}/>
                            <UserDataRow text="E-Mail" value={this.props.currentUser.email}/>
                        </div>
                    </div>

                    <div className="Buttons">
                        <SimpleButton text="Edit Profile" onClick={this.onEditProfileClick}/>
                    </div>
                    <div className="Buttons">
                        <SimpleButton text="Delete your Account" className="secondary-color-bg"
                                      onClick={this.showProfileDeleteModal}/>

                    </div>
                </div>
            </div>


        );
    }

    private showProfileDeleteModal = () => {
        this.setState({showProfileDeleteModal: true});
    };

    private onProfileModalDismiss = () => {
        return this.setState({showProfileUpdateModal: false});
    };

    private onProfileDeleteDismiss = () => {
        return this.setState({showProfileDeleteModal: false});
    };

    private onEditProfileClick = () => {
        this.setState({showProfileUpdateModal: true});
    }
}

function UserDataRow({text, value}: { text: string, value: string | number }) {
    return (
        <span id="user-data-row">
            <span id="user-data-row-key">{text}:</span>
            <span id="user-data-row-value" className="primary-color">{value}</span>
            <br/>
        </span>
    );
}

function FirstAndLastName(props: { firstName: string, lastName: string }) {
    return <span>{getFirstAndLastNameCapitalized(props)}</span>
}

function getFirstAndLastNameCapitalized({firstName, lastName}: { firstName: string, lastName: string }): string {
    const cFirstName = getCapitalized(firstName);
    const cLastName = getCapitalized(lastName);
    return `${cFirstName} ${cLastName}`;
}

function getCapitalized(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);

}

export function mapStateToProps({user: {currentUser}}: StoreState): Partial<IProfileComponentProps> {
    return {currentUser};
}

export default connect(mapStateToProps)(ProfileComponent);