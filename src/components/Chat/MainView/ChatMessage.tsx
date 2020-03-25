import * as React from "react";
import {HumanizedTime} from "../../Common/HumanizedTime";
import avatar from "./avatar.png";
import "./ChatMessage.css";

interface IChatMessageProps {
    sender: string;
    body: string;
    time: Date;
    isFromCurrentUser: boolean;
}

export class ChatMessage extends React.Component<IChatMessageProps> {
    public render(): React.ReactNode {
        const alignSelf = this.props.isFromCurrentUser ? "flex-end" : "flex-start";
        const background = this.props.isFromCurrentUser ? "#87a8b4" : "#5eb46a";

        return (
            <div className="bubble" style={{alignSelf, background}}>
                <img src={avatar} alt="Avatar" className="avatar"/>
                <div className="message-box">
                    <p>{this.props.body}</p>
                    <div className="time">
                        <HumanizedTime time={this.props.time}/>
                    </div>
                </div>
            </div>
        );
    }
}