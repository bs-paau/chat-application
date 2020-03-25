import * as React from "react";
import "./ChatSidebar.css";
import RoomListContainer from "./RoomLists/RoomListContainer";

interface IChatSidebarProps {
    showJoinRoomModal: VoidFunction;
    showCreateRoomModal: VoidFunction;
}

class ChatSidebar extends React.Component<IChatSidebarProps> {
    public render() {
        return (
            <aside id="sidebar">
                <RoomListContainer showJoinRoomModal={this.props.showJoinRoomModal}
                                   showCreateRoomModal={this.props.showCreateRoomModal}/>
            </aside>
        );
    }
}

export default ChatSidebar