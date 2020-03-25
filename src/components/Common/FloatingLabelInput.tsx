import {ChangeEventHandler, ReactNode, Ref} from "react";
import * as React from "react";
import "./FloatingLabelInput.tsx";

export interface IFloatingLabelInputProps {
    id: string;
    label: string;
    inputType?: string;
    value?: string;
    children?: ReactNode;
    itemRef?: Ref<HTMLInputElement>;
    disabled?: boolean;
    onMouseOver?: () => void;
    onMouseLeave?: () => void;
    className?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}

export class FloatingLabelInput extends React.Component<IFloatingLabelInputProps> {
    public static defaultProps: Partial<IFloatingLabelInputProps> = {
        disabled: false,
        inputType: "text"
    };


    public render(): React.ReactNode {
        return <div className="floatlabel" onMouseOver={this.props.onMouseOver} onMouseLeave={this.props.onMouseLeave}>
            <input type={this.props.inputType}
                   spellCheck={false}
                   required={true}
                   className={"default-input floatlabel-input " + this.props.className}
                   id={this.props.id}
                   defaultValue={this.props.value}
                   ref={this.props.itemRef}
                   disabled={this.props.disabled}
                   onChange={this.props.onChange}
            />
            <label className="floatlabel-label" htmlFor={this.props.id}>{this.props.label}</label>
            {this.props.children}
        </div>;
    }
}