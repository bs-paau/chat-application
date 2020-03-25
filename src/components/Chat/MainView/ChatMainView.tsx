import {ChangeEvent} from "react";
import * as React from "react";
import TextareaAutosize from "react-autosize-textarea/lib/TextareaAutosize";
import {connect, Dispatch} from "react-redux";
import {ReduxAction} from "../../../logic/redux/actions";
import {StoreState} from "../../../logic/redux/types";
import {RoomMessage} from "../../../logic/rest";
import {User} from "../../../types";
import "./ChatMainView.css";
import {MessageComponent} from "./MessageComponent";

interface IChatMainViewProps extends IChatMainViewPublicProps{
    user: User;
}

interface IChatMainViewPublicProps {
    messages: RoomMessage[];
    sendMessage: (content: string) => void;
}

interface IChatMainViewState {
    message: string;
}

class ChatMainView extends React.Component<IChatMainViewProps, IChatMainViewState> {

    constructor(context: any) {
        super(context);
    }

    public render() {
        return (
            <div id="main-view">
                <MessageComponent messages={this.props.messages} currentUserId={this.props.user.userId}/>
                <div id="new-message">
                    <div id="new-message-inner">
                        <TextareaAutosize
                            className="default-input"
                            id="new-message-field"
                            autoFocus={true}
                            placeholder="Message"
                            onKeyPress={this.handleTextAreaKeyPress}
                            onChange={this.onChangeMessage}/>

                        <input type="submit" value="Send Message" className="default-input-button primary-color-bg"
                               id="send-message-button" onClick={this.onSendMessage}/>
                    </div>
                </div>

            </div>
        );
    }

    private onSendMessage = () => {
        this.props.sendMessage(this.state.message);
    };

    private handleTextAreaKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== "Enter" || event.shiftKey) {
            return;
        }

        event.currentTarget.style.height = "auto";
        event.currentTarget.value = "";
        event.preventDefault();
        event.stopPropagation();

        this.onSendMessage();
    };

    private onChangeMessage = (evt: ChangeEvent<HTMLTextAreaElement>) => this.setState({message: evt.target.value});
}

function mapStateToProps(state: StoreState, publicProps: IChatMainViewPublicProps) : Partial<IChatMainViewProps> {
    return {
        ...publicProps,
        user: state.user.currentUser
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>) : Partial<IChatMainViewProps>{
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatMainView);


