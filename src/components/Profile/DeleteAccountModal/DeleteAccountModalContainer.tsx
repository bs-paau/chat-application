import * as React from "react";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {Dispatch} from "redux";
import {ReduxAction} from "../../../logic/redux/actions";
import {profileDeleteSuccess} from "../../../logic/redux/actions/userAction";
import {StoreState} from "../../../logic/redux/types";
import {DefaultApi} from "../../../logic/rest";
import {DeleteAccountModal} from "./DeleteAccountModal";

// Container

class DeleteAccountModalContainer extends React.Component<IDeleteAccountModalContainerProps> {
    public render(): React.ReactNode {
        return <DeleteAccountModal
            show={this.props.show}
            container={this.props.container}
            onDelete={this.handleDelete}
            onDiscard={this.handleDiscard}/>
    }

    private handleDelete = async () => {
        const api = new DefaultApi();
        const response = await api.usersUserIdDelete(
            this.props.userId,
            this.props.authToken,
            { headers: { "Accept": "application/json", "Content-Type": "application/json" } });
        // tslint:disable
        console.log(response.status);
        this.props.profileDeleteSuccess();
        this.props.history.replace("/");
    };

    private handleDiscard = () => {
        this.props.onDismiss();
    };
}

// Props

export interface IDeleteAccountModalContainerProps extends IDeleteAccountModalContainerPublicProps {
    profileDeleteSuccess: () => void;

    userId: number;
    authToken: string;
}

export interface IDeleteAccountModalContainerPublicProps extends RouteComponentProps<any>{
    container: any;
    onDismiss: () => void;
    show: boolean;
}


// Redux

function mapStateToProps(state: StoreState, publicProps: IDeleteAccountModalContainerPublicProps): Partial<IDeleteAccountModalContainerProps> {
    return {
        container: publicProps.container,
        userId: state.user.currentUser!.userId,
        authToken: state.user.authToken,
        location: publicProps.location,
        history: publicProps.history
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): Partial<IDeleteAccountModalContainerProps> {
    return {
        profileDeleteSuccess: () => dispatch(profileDeleteSuccess())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeleteAccountModalContainer));

