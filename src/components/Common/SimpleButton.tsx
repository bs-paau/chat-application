import {MouseEventHandler} from "react";
import * as React from "react";

export interface ISimpleButtonProps {
    id?: string;
    text: string;
    onClick?: MouseEventHandler<HTMLInputElement>;
    className?: string;
}

export function SimpleButton({id, text, onClick, className}: ISimpleButtonProps) {
    return <input className={"default-input-button no-margin " + className}
                  type="submit"
                  value={text}
                  id={id}
                  onClick={onClick}/>

}