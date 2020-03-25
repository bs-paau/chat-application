import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {push} from "react-router-redux";
import {LoginService} from "../../logic/business/LoginService";
import * as actions from "../../logic/redux/actions";
import {loginUserSuccess, updatedFriendList, updatedRoomList} from "../../logic/redux/actions/userAction";
import {Body, DefaultApi, User as RestUser} from "../../logic/rest";
import {Contact, Room, User} from "../../types";
import {LoginComponent} from "./LoginComponent";

interface ILoginContainerProps {
    pushHistory: (route: string) => void;
    loginUserSuccess: (user: User, authToken: string) => void;
    updatedRoomList: (rooms: Room[]) => void;
    updatedContactList: (contacts: Contact[]) => void;
}

interface ILoginContainerState {
    isPendingLogin: boolean;
}

class LoginContainer extends React.Component<ILoginContainerProps, ILoginContainerState> {
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

    constructor(props: ILoginContainerProps) {
        super(props);
        this.state = {isPendingLogin: false};
    }

    public render(): React.ReactNode {
        return (<LoginComponent onLogin={this.onLogin} isPending={this.state.isPendingLogin}/>)
    }


    private onLogin = async (username: string, password: string, showError: (error: string) => void) => {
        if (username === "") {
            showError("Please enter a username!");
            return;
        }

        if (password === "") {
            showError("Please enter a password!");
            return;
        }

        this.setState({isPendingLogin: true});

        const api = new DefaultApi();
        const body: Body = {password, username};

        try {
            const response = await api.loginPost(body, {headers: {"Accept": "application/json"}});
            const userDto = LoginContainer.convertToUserDTO(response.data.user);
            this.props.loginUserSuccess(userDto, response.data.authToken);

            await LoginService.doAfterLogin(response.data.user.id, response.data.authToken, this.props.updatedRoomList, this.props.updatedContactList);

            this.setState({isPendingLogin: false});
            this.props.pushHistory("/profile");
        } catch (e) {
            let handled = false;
            const show = (error: string) => {
                handled = true;
                showError(error);
            };

            if (e instanceof Response) {
                switch (e.status) {
                    case 403:
                        show("Invalid username or password!");
                        break;
                    case 400:
                        const json = await e.json();
                        switch (json.reason) {
                            case "missing_username":
                                show("Please enter a username!");
                                break;
                            case "missing_password":
                                show("Please enter a password!");
                        }
                }
            }
            if (!handled) {
                show("Unable to login! Please try again later");
            }
            this.setState({isPendingLogin: false});
        }
    };
}


export function mapDispatchToProps(dispatch: Dispatch<actions.ReduxAction>): Partial<ILoginContainerProps> {
    return {
        loginUserSuccess: (user: User, authToken: string) => dispatch(loginUserSuccess(user, authToken)),
        pushHistory: (route: string) => dispatch(push(route)),
        updatedRoomList: rooms => dispatch(updatedRoomList(rooms)),
        updatedContactList: contacts => dispatch(updatedFriendList(contacts))
    }
}

export default connect(null, mapDispatchToProps)(LoginContainer);