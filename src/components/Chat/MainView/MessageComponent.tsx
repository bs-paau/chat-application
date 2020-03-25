import * as React from "react";
import {RoomMessage} from "../../../logic/rest/api";
import {ChatMessage} from "./ChatMessage";
import "./MessageComponent.css";

interface IMessageComponentProp {
    messages: RoomMessage[];
    currentUserId: number;
}

export class MessageComponent extends React.Component<IMessageComponentProp> {

    public render(): React.ReactNode {
        return (
            <div id="messages-list">
                {this.buildMessages()}
            </div>
        );
    }

    private buildMessages = () => {
        return this.props.messages.map(m => <ChatMessage key={m.id} sender={m.senderName} body={m.content} time={m.timeSent}
                                                         isFromCurrentUser={m.senderId === this.props.currentUserId}/>)
    }
}