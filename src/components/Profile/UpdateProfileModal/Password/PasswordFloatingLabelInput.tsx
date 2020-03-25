import {ChangeEvent, ChangeEventHandler} from "react";
import * as React from "react";
import {Aux} from "../../../Common/AuxContainer";
import {FloatingLabelInput} from "../../../Common/FloatingLabelInput";
import {VisibilityContainer} from "../../../Common/VisibilityContainer";
import "./PasswordFloatingLabelInput.css";

function PasswordSecondField({isEditable, onChange}: { isEditable: boolean, onChange: ChangeEventHandler<HTMLInputElement> }) {
    return <VisibilityContainer visible={isEditable} displayNone={true}>
        <FloatingLabelInput id="password-label" label="Password" value="" disabled={!isEditable}
                            inputType="password" onChange={onChange}/>
    </VisibilityContainer>
}

export class PasswordFloatingLabelInput extends React.Component<IPasswordFloatingLabelInputProps, IPasswordFloatingLabelInputState> {
    constructor(props: IPasswordFloatingLabelInputProps, context: any) {
        super(props, context);
        this.state = {isInEditMode: false}
    }

    public render(): React.ReactNode {
        return <Aux>
            <FloatingLabelInput id="password-label" label="Password" value={this.state.isInEditMode ? "" : "****"}
                                disabled={!this.state.isInEditMode}
                                inputType="password" onChange={this.pwOnChange}>
                <VisibilityContainer visible={!this.state.isInEditMode}>
                    <a type="button" id="edit-button-password" className="primary-color"
                       onClick={this.onEditButtonClick}>Edit</a>
                </VisibilityContainer>
            </FloatingLabelInput>
            <PasswordSecondField isEditable={this.state.isInEditMode} onChange={this.pwVerifyOnChange}/>
        </Aux>
    }

    private pwOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
        this.props.passwordChanged(evt.target.value);
    };

    private pwVerifyOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
        this.props.passwordVerifyChanged(evt.target.value);
    };

    private onEditButtonClick = () => {
        this.setState({isInEditMode: true});
        this.props.passwordChanged("");
        this.props.passwordVerifyChanged("");
    }
}


interface IPasswordFloatingLabelInputState {
    isInEditMode: boolean;
}

interface IPasswordFloatingLabelInputProps {
    passwordChanged: (value: string) => void;
    passwordVerifyChanged: (value: string) => void;
}