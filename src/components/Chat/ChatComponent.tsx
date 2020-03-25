import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {Message as StompMessage} from "stompjs";
import {IWebSocketMessage, WebSocketHelper} from "../../logic/business/WebSocketHelper";
import {ReduxAction} from "../../logic/redux/actions";
import {StoreState} from "../../logic/redux/types";
import {DefaultApi} from "../../logic/rest";
import {RoomMessage} from "../../logic/rest/api";
import {Room, User} from "../../types";
import "./ChatComponent.css";
import ChatMainView from "./MainView/ChatMainView";
import CreateRoomModal from "./Modals/CreateRoomModal";
import JoinRoomModal from "./Modals/JoinRoomModal";
import ChatSidebar from "./Sidebar/ChatSidebar";

interface IChatComponentProps{
    rooms: Room[];
    currentRoomId: number;
    authToken: string;
    user: User;
}

interface IChatComponentState {
    displayJoinRoomModal: boolean;
    displayCreateRoomModal: boolean;
    messages: RoomMessage[];
}

class ChatComponent extends React.Component<IChatComponentProps, IChatComponentState> {


    constructor(props: IChatComponentProps, context: any) {
        super(props, context);
        this.state = {displayJoinRoomModal: false, displayCreateRoomModal: false, messages: []};
    }

    public render(): any {
        return (
            <div id="flex-container">
                <JoinRoomModal show={this.state.displayJoinRoomModal} onHide={this.hideJoinRoomModal}/>
                <CreateRoomModal show={this.state.displayCreateRoomModal} onHide={this.hideCreateRoomModal}/>
                <ChatSidebar showJoinRoomModal={this.showJoinRoomModal} showCreateRoomModal={this.showCreateRoomModal}/>
                <ChatMainView sendMessage={this.sendMessage} messages={this.state.messages}/>
            </div>
        );
    }

    public async componentDidMount(): Promise<void> {
        await WebSocketHelper.connect();
        WebSocketHelper.subscribe("/topic/info", this.messageReceived);
        for (const room of this.props.rooms) {
            WebSocketHelper.subscribe("/queue/room/" + room.roomId, this.messageReceived);
        }
    }

    public async componentDidUpdate(prevProps: Readonly<IChatComponentProps>, prevState: Readonly<IChatComponentState>, snapshot?: any) {
        if(prevProps.currentRoomId !== this.props.currentRoomId) {
            try {
                const api = new DefaultApi();
                const result = await api.roomsRoomIdMessagesGet(this.props.currentRoomId, this.props.authToken, {headers: {
                    "Accept": "application/json",
                        "Content-Type": "application/json"
                }});
                this.setState({messages: result.result});
            } catch (e) {
                console.log(e);
            }
        }
    }

    private messageReceived = (message: StompMessage) => {
        const msg: IWebSocketMessage = JSON.parse(message.body);
        const roomMsg : RoomMessage = {
            id: Math.floor(Math.random() * 99999),
            timeSent: msg.timeSent || new Date(),
            content: msg.content,
            senderName: msg.username,
            senderId: msg.senderId,
            roomId: msg.roomId || 0
        };
        const newMsgs = Array.from(this.state.messages);
        newMsgs.push(roomMsg);
        this.setState({messages: newMsgs});
    };

    private sendMessage = (content: string) => {
        const message: IWebSocketMessage = {
            content,
            roomId: this.props.currentRoomId,
            senderId: this.props.user.userId,
            type: "CHAT",
            username: this.props.user.username
        };
        WebSocketHelper.send(message, `/app/chat.room.${this.props.currentRoomId}`);
    };

    private hideJoinRoomModal = () => {
        this.setState({displayJoinRoomModal: false});
    };

    private showJoinRoomModal = () => {
        this.setState({displayJoinRoomModal: true});
    };

    private hideCreateRoomModal = () => {
        this.setState({displayCreateRoomModal: false});
    };

    private showCreateRoomModal = () => {
        this.setState({displayCreateRoomModal: true});
    };
}


function mapStateToProps(state: StoreState) : Partial<IChatComponentProps> {
    return {
        rooms: state.user.rooms,
        currentRoomId: state.user.currentRoom,
        authToken: state.user.authToken,
        user: state.user.currentUser
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>) : Partial<IChatComponentProps>{
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);