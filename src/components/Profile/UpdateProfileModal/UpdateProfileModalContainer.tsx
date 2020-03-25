import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {PasswordValidator} from "../../../logic/business/PasswordValidator";
import {ReduxAction} from "../../../logic/redux/actions";
import {updateProfileSuccess} from "../../../logic/redux/actions/userAction";
import {StoreState} from "../../../logic/redux/types";
import {Body2, DefaultApi, User as RestUser} from "../../../logic/rest";
import {User} from "../../../types";
import {IProfileData, UpdateProfileModal} from "./UpdateProfileModal";

// Container

interface IUpdateProfileModalContainerState {
    showError: boolean;
    errorMessage?: string;
    isPending: boolean;
}

class UpdateProfileModalContainer extends React.Component<IUpdateProfileModalContainerProps, IUpdateProfileModalContainerState> {
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

    constructor(props: IUpdateProfileModalContainerProps, context: any) {
        super(props, context);
        this.state = {showError: false, isPending: false};
    }

    public render(): React.ReactNode {
        return <UpdateProfileModal
            user={this.props.user}
            container={this.props.container}
            show={this.props.show}
            onHide={this.handleOnHide}
            onSubmit={this.handleOnSubmit}
            onErrorDismiss={this.handleOnErrorDismiss}
            showError={this.state.showError}
            errorMessage={this.state.errorMessage}
            isPending={this.state.isPending}/>
    }

    private handleOnHide = () => {
        this.props.onDismiss();
    };

    private handleOnErrorDismiss = () => {
        this.setState({showError: false});
    };

    private showError = (error: string) => {
        this.setState({showError: true, errorMessage: error});
    };

    private handleOnSubmit = async (data: IProfileData) => {
        this.setState({isPending: true});
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (data.email !== undefined && data.emailVerify !== data.email) {
            return this.showError("Email fields does not match!");
        }

        if (data.email !== undefined && !emailRegex.test(data.email!)) {
            return this.showError("Please enter a valid email!");
        }

        if (data.password !== undefined && data.password !== data.passwordVerify) {
            return this.showError("Password fields does not match!");
        }

        if (data.password !== undefined && !PasswordValidator.validatePassword(data.password)) {
            return this.showError("Password must match the following criteria: \"Minimum eight characters, at least one lower and one upper case letter and one number\"");
        }

        this.setState({showError: false});

        const body: Body2 = {
            email: data.email === this.props.user.email ? undefined : data.email,
            firstname: data.firstname === this.props.user.firstName ? undefined : data.firstname,
            lastname: data.lastname === this.props.user.lastName ? undefined : data.lastname,
            password: data.password
        };
        await this.doRequest(body);
    };

    private doRequest = async (body: Body2) => {
        const api = new DefaultApi();
        const options = {headers: {"Accept": "application/json", "Content-Type": "application/json"}};

        try {
            const response = await api.usersUserIdPut(this.props.user.userId, this.props.authToken, body, options);
            this.props.updateProfileSuccess(UpdateProfileModalContainer.convertToUserDTO(response.user));
            this.setState({isPending: false});
            this.props.onDismiss();
        } catch (e) {
            let handled = false;
            const show = (error: string) => {
                handled = true;
                this.showError(error);
            };

            if (e instanceof Response) {
                switch (e.status) {
                    case 403:
                        show("Not logged in!");
                        break;
                    case 400:
                        show("No fields to update!");
                        break;
                    case 409:
                        show("Email already used!");
                        break;
                }
            }
            if (!handled) {
                show("Unable to update profile! Please try again later");
            }
        }
        this.setState({isPending: false});
    };
}

// Props

interface IUpdateProfileModalContainerProps extends IUpdateProfileModalContainerPublicProps {
    user: User;
    authToken: string;
    updateProfileSuccess: (user: User) => void;
}

interface IUpdateProfileModalContainerPublicProps {
    onDismiss: () => void;
    container: any;
    show: boolean;
}

// Redux


export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): Partial<IUpdateProfileModalContainerProps> {
    return {
        updateProfileSuccess: user => (dispatch(updateProfileSuccess(user)))
    }
}


function mapStateToProps(state: StoreState, publicProps: IUpdateProfileModalContainerPublicProps): Partial<IUpdateProfileModalContainerProps> {
    return {
        ...publicProps,
        user: state.user.currentUser,
        authToken: state.user.authToken,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfileModalContainer);

