import {ChangeEvent, ChangeEventHandler, RefObject} from "react";
import * as React from "react";
import {Label, Popover} from "react-bootstrap";
import {FloatingLabelInput} from "../../../Common/FloatingLabelInput";

import {Aux} from "../../../Common/AuxContainer";
import {VisibilityContainer} from "../../../Common/VisibilityContainer";
import "./EmailInputComponent.css";

interface IEmailInputFirstFieldProps {
    isInitial: boolean,
    isEditable: boolean,
    isVerified: boolean,
    showVerifyPopup: boolean,

    target: RefObject<HTMLDivElement>
    email: string,

    onMouseLeave: () => void,
    onMouseOver: () => void,
    onEditButtonClick: () => void,
    onChange: ChangeEventHandler<HTMLInputElement>
}

function EmailInputFirstField(props: IEmailInputFirstFieldProps) {

    const {onChange, isInitial, isEditable, isVerified, email, onMouseLeave, onMouseOver, onEditButtonClick, showVerifyPopup, target} = props;
    const verifiedBsStyle = isVerified ? "success" : "warning";
    const verifiedBsText = isVerified ? "Verified" : "Not Verified";

    return <FloatingLabelInput id="email-input"
                               className="email-input"
                               label="E-Mail"
                               value={isEditable ? "" : email}
                               disabled={!isEditable}
                               onMouseOver={onMouseOver}
                               onMouseLeave={onMouseLeave}
                               onChange={onChange}>

        <VisibilityContainer visible={!isEditable}>
            <Label bsStyle={verifiedBsStyle} id="not-verified-label">{verifiedBsText}</Label>
        </VisibilityContainer>

        <VisibilityContainer visible={showVerifyPopup && !isInitial}
                             itemRef={target}
                             id="not-verified-div">
            <Popover id="not-verified-popover" placement="top" positionLeft="25%" positionTop="-50px">
                <span id="not-verified-text">Please verify your e-mail address to secure your account.</span>
            </Popover>
        </VisibilityContainer>
        <VisibilityContainer visible={!isEditable}>
            <a type="button" id="edit-button-email" className="primary-color"
               onClick={onEditButtonClick}>Edit</a>
        </VisibilityContainer>
    </FloatingLabelInput>
}

function EmailInputSecondField({isEditable, onChange}: { isEditable: boolean, onChange: ChangeEventHandler<HTMLInputElement> }) {
    return <VisibilityContainer visible={isEditable} displayNone={true}>
        <FloatingLabelInput id="email-input-verify"
                            className="email-input"
                            label="Confirm E-Mail"
                            onChange={onChange}/>
    </VisibilityContainer>
}

export class EmailInputComponent extends React.Component<IEmailInputComponentProps, { initial: boolean, email: string, verify: string }> {
    private target = React.createRef<HTMLDivElement>();

    constructor(props: IEmailInputComponentProps, context: any) {
        super(props, context);
        this.state = {initial: true, email: this.props.email, verify: ""};
    }

    public componentWillUnmount(): void {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    public componentDidMount(): void {
        document.addEventListener("mousedown", this.handleClickOutside);
        setTimeout(() => this.setState({initial: false}), 300);
    }

    public render(): React.ReactNode {
        return <Aux>
            <EmailInputFirstField {...this.props} email={this.state.email} isInitial={this.state.initial} target={this.target} onChange={this.props.onEmailChange}/>
            <EmailInputSecondField {...this.props} onChange={this.props.onEmailVerifyChange}/>
        </Aux>
    }

    private handleClickOutside = (event: MouseEvent) => {
        if (this.target && !this.target.current!.contains(event.target as Node)) {
            this.props.onClickOutside();
        }
    };
}

interface IEmailInputComponentProps {
    onMouseOver: () => void,
    onMouseLeave: () => void,
    onEditButtonClick: () => void,
    onClickOutside: () => void,

    isEditable: boolean,
    isVerified: boolean,
    showVerifyPopup: boolean,

    email: string,

    onEmailChange: (evt: ChangeEvent<HTMLInputElement>) => void;
    onEmailVerifyChange: (evt: ChangeEvent<HTMLInputElement>) => void;
}