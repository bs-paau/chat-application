import {ChangeEvent} from "react";
import * as React from "react";
import {connect} from "react-redux";
import {StoreState} from "../../../../logic/redux/types";
import {EmailInputComponent} from "./EmailInputComponent";


class EmailInputContainer extends React.Component<IEmailInputContainerProps, IEmailInputContainerState> {
    constructor(props: IEmailInputContainerProps) {
        super(props);
        this.state = {displayEmailEditFields: false, displayVerifyEmailPopup: !this.props.isVerified};
    }

    public render(): React.ReactNode {
        return <EmailInputComponent
            onMouseLeave={this.handleMouseLeave}
            onMouseOver={this.handleMouseOver}
            onClickOutside={this.handleClickOutside}
            isEditable={this.state.displayEmailEditFields}
            isVerified={this.props.isVerified}
            email={this.props.email}
            onEditButtonClick={this.handleEditButtonClick}
            showVerifyPopup={this.state.displayVerifyEmailPopup}
            onEmailChange={this.onEmailChange}
            onEmailVerifyChange={this.onEmailVerifyChange}/>
    }

    public onEmailChange = (evt: ChangeEvent<HTMLInputElement>) => {
        this.props.emailChanged(evt.target.value);
    };

    public onEmailVerifyChange = (evt: ChangeEvent<HTMLInputElement>) => {
        this.props.emailVerifyChanged(evt.target.value);
    };

    public handleEditButtonClick = () => {
        this.props.emailChanged(this.props.email);
        this.props.emailVerifyChanged("");
        this.setState({displayEmailEditFields: true});
    };

    public handleClickOutside = () => {
        this.setState({displayVerifyEmailPopup: false});
    };

    public handleMouseOver = () => {
        if (!this.state.displayEmailEditFields) {
            this.setState({displayVerifyEmailPopup: true});
        }
    };

    public handleMouseLeave = () => {
        if (!this.state.displayEmailEditFields) {
            this.setState({displayVerifyEmailPopup: false});
        }
    };
}

interface IEmailInputContainerProps  extends IEmailInputContainerPublicProps {
    email: string;
    isVerified: boolean;
}

interface IEmailInputContainerPublicProps {
    emailChanged: (value: string) => void;
    emailVerifyChanged: (value: string) => void;
}

interface IEmailInputContainerState {
    displayVerifyEmailPopup: boolean;
    displayEmailEditFields: boolean;
}

function mapStateToProps(state: StoreState, publicProps: IEmailInputContainerPublicProps): Partial<IEmailInputContainerProps> {
    return {
        ...publicProps,
        email: state.user.currentUser!.email,
        isVerified: state.user.currentUser!.emailVerified,
    }
}

export default connect(mapStateToProps)(EmailInputContainer);