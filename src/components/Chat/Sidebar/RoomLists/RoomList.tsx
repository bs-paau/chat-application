import {ReactNode} from "react";
import * as React from "react";
import {FaPlus, FaSearch} from "react-icons/lib/fa";
import {Room} from "../../../../types";
import {Aux} from "../../../Common/AuxContainer";
import "./RoomList.css";

interface IRoomListProps {
    rooms: Room[];
    showJoinRoomModal: VoidFunction;
    showCreateRoomModal: VoidFunction;
    onJoinRoom: (room: Room) => void;
    currentRoom: number;
}

export class RoomList extends React.Component<IRoomListProps> {

    public render(): React.ReactNode {
        //tslint:disable
        return (
            <Aux>
                <div id="public-channel-list">
                    <div id="channel-list-header">
                        <h3>Public Rooms</h3>
                        <div className="simple-flex">
                            <button type="button" id="channel-button" onClick={this.handleAddPublicRoom}>
                                <FaSearch/>
                            </button>
                            <button type="button" id="channel-button" onClick={this.handleCreateRoom}>
                                <FaPlus/>
                            </button>
                        </div>
                    </div>
                    {this.buildPublicChannels(this.props.rooms)}
                </div>
                <div id="private-channel-list">
                    <div id="channel-list-header">
                        <h3>Private Rooms</h3>
                        <button type="button" id="channel-button" onClick={this.handleCreateRoom}>
                            <FaPlus/>
                        </button>
                    </div>
                    {this.buildPrivateChannels(this.props.rooms)}
                </div>
            </Aux>
        );
    }

    private handleAddPublicRoom = () => {
        this.props.showJoinRoomModal();
    };

    private handleCreateRoom = () => {
        this.props.showCreateRoomModal();
    };

    private buildRoomDiv(room: Room): ReactNode {
        const mark = this.props.currentRoom === room.roomId ?
            <div className={"mark primary-color-bg"}/> : <div/>;

        // tslint:disable-next-line
        return (
            <div className={"room-name-box"}>
                {mark}
                <div className="channel" key={room.roomId} onClick={evt => this.props.onJoinRoom(room)}>#{room.name}</div>
            </div>
        );
    }

    private buildPrivateChannels(rooms: Room[]): ReactNode[] {
        return rooms
            .filter(r => r.private)
            .map((room) => this.buildRoomDiv(room));
    }

    private buildPublicChannels(rooms: Room[]): ReactNode[] {
        return rooms
            .filter(r => !r.private)
            .map((room) => this.buildRoomDiv(room));
    }
}
