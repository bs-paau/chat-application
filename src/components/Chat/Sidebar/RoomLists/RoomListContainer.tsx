import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReduxAction} from "../../../../logic/redux/actions";
import {changeCurrentRoom} from "../../../../logic/redux/actions/userAction";
import {StoreState} from "../../../../logic/redux/types";
import {Room} from "../../../../types";
import {RoomList} from "./RoomList";

interface IRoomListContainerProps extends IRoomListContainerPublicProps {
    rooms: Room[];
    changedCurrentRoom: (roomId: number) => void;
    currentRoom: number;
}

interface IRoomListContainerPublicProps {
    showJoinRoomModal: VoidFunction;
    showCreateRoomModal: VoidFunction;
}

class RoomListContainer extends React.Component<IRoomListContainerProps> {

    public render(): React.ReactNode {
        //tslint:disable
        return (
            <RoomList rooms={this.props.rooms}
                      showJoinRoomModal={this.props.showJoinRoomModal}
                      showCreateRoomModal={this.props.showCreateRoomModal}
                      currentRoom={this.props.currentRoom}
                      onJoinRoom={this.joinRoom}/>
        );
    }

    private joinRoom = (room: Room) => {
        this.props.changedCurrentRoom(room.roomId);
    };
}

function mapStateToProps(state: StoreState, publicProps: IRoomListContainerPublicProps): Partial<IRoomListContainerProps> {
    return {
        rooms: state.user.rooms,
        currentRoom: state.user.currentRoom,
        ...publicProps
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): Partial<IRoomListContainerProps> {
    return {
        changedCurrentRoom: roomId => dispatch(changeCurrentRoom(roomId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomListContainer);