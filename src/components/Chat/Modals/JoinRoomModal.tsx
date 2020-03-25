import {ChangeEvent} from "react";
import * as React from "react";
import {Alert, Label, Modal} from "react-bootstrap";
import {FaSearch} from "react-icons/lib/fa";
import {connect, Dispatch} from "react-redux";
import * as Spinner from "react-spinkit";
import {ReduxAction} from "../../../logic/redux/actions";
import {updatedRoomList} from "../../../logic/redux/actions/userAction";
import {StoreState} from "../../../logic/redux/types";
import {Body7, DefaultApi, Room} from "../../../logic/rest";
import {Room as StateRoom} from "../../../types";
import {SimpleButton} from "../../Common/SimpleButton";
import {VisibilityContainer} from "../../Common/VisibilityContainer";
import "./JoinRoomModal.css";


export interface IJoinRoomModalProps extends IJoinRoomModalPublicProps {
    userId: number;
    authToken: string;
    rooms: StateRoom[];
    updatedRoomList: (rooms: StateRoom[]) => void;
}

export interface IJoinRoomModalPublicProps {
    show: boolean;
    onHide: () => void;
}

export interface IJoinRoomModalState {
    isLoading: boolean;
    isJoining: boolean;
    showError: boolean;
    errorMessage?: string;
    rooms?: Room[];
    searchTerm?: string;
}

class JoinRoomModal extends React.Component<IJoinRoomModalProps, IJoinRoomModalState> {

    constructor(props: IJoinRoomModalProps, context: any) {
        super(props, context);
        this.state = {isLoading: true, isJoining: false, showError: false};
    }

    public async componentDidUpdate(prevProps: Readonly<IJoinRoomModalProps>, prevState: Readonly<IJoinRoomModalState>, snapshot?: any) {
        if (!prevProps.show && this.props.show) {
            this.setState({isLoading: true});
            const api = new DefaultApi();
            const response = await api.roomsPublicGet(this.props.authToken, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            this.setState({rooms: response.result, isLoading: false, isJoining: false});
        }
    }

    public render(): React.ReactNode {
        return (
            <Modal onHide={this.onHide} show={this.props.show}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Join Room</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <VisibilityContainer visible={this.state.showError} displayNone={true}>
                        <Alert bsStyle="warning" id="alert-box-profile" onDismiss={this.handleOnErrorDismiss}>
                            <strong>{this.state.errorMessage}</strong>
                        </Alert>
                    </VisibilityContainer>

                    <h4>Search for a room:</h4>
                    <div id="room-search-box">
                        <FaSearch id="room-search-glass"/>
                        <input type="text" id="room-search-filter" className="default-input" onChange={this.updateSearchterm}/>
                    </div>
                    <div id="select-room-header">Rooms you can join:</div>
                    <div id="room-list">
                        <VisibilityContainer visible={this.state.isLoading} displayNone={true}>
                            <div id="room-spinner">
                                <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                            </div>
                        </VisibilityContainer>
                        <VisibilityContainer visible={!this.state.isLoading} displayNone={true}>
                            {this.buildRoomItems()}
                        </VisibilityContainer>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <SimpleButton text="Close" className="secondary-color-bg" onClick={this.onHide}/>
                    <VisibilityContainer visible={this.state.isJoining} displayNone={true}>
                        <div id="room-spinner">
                            <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                        </div>
                    </VisibilityContainer>
                </Modal.Footer>
            </Modal>
        );
    }

    private handleOnErrorDismiss = () => this.setState({showError: false});
    private showError = (error: string) => this.setState({showError: true, errorMessage: error});
    private updateSearchterm = (evt: ChangeEvent<HTMLInputElement>) => this.setState({searchTerm: evt.target.value});

    private onRoomClick = async (room: Room) => {
        this.setState({isJoining: true});
        const api = new DefaultApi();
        const body: Body7 = {
            userId: this.props.userId
        };
        try {
            const result : any = await api.roomRoomIdJoinPost(room.id, this.props.authToken, body, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            const joinedRoom = result.joined_room;
            const castedRoom : StateRoom = {
                name: joinedRoom.name,
                roomId: joinedRoom.id,
                description: joinedRoom.description,
                private: joinedRoom.private,
                createdOn: joinedRoom.createdon
            };
            const newRooms = Array.from(this.props.rooms);
            newRooms.push(castedRoom);
            this.props.updatedRoomList(newRooms);

            this.onHide();
        } catch (e) {
            let handled = false;
            const show = (error: string) => {
                handled = true;
                this.showError(error);
            };

            if (e instanceof Response) {
                switch (e.status) {
                    case 403:
                        show("Not logged in!");
                        break;
                    case 404:
                        show("Invalid room!");
                        break;
                    case 409:
                        show("You are already a member of this room!");
                        break;
                }
            }
            if (!handled) {
                show("Unable to join room! Please try again later");
            }
            this.setState({isJoining: false});
        }
    };


    private buildRoomItems = () => {
        const error = <div id="error-info"><Label bsStyle="info">You joined all rooms! Calm down!!</Label></div>;

        if (this.state.rooms == null) {
            return error;
        }

        let filteredRooms = this.state.rooms!
            .filter(r => this.props.rooms.filter(ir => ir.roomId === r.id).length === 0);

        if (filteredRooms.length === 0) {
            return error;
        }

        if (this.state.searchTerm != null && this.state.searchTerm!.length > 0) {
            filteredRooms = filteredRooms.filter(r =>
                r.name.toLowerCase().indexOf(this.state.searchTerm!.toLowerCase()) !== -1
            );
        }

        return filteredRooms.map(r => <RoomListItem key={r.id} room={r} onClick={this.onRoomClick}/>);
    };

    private onHide = () => {
        this.props.onHide();
    };
}

//tslint:disable
function RoomListItem({room, onClick}: { room: Room, onClick: (room: Room) => void }) {
    return (
        <div className="room-list-item bot-border" onClick={() => onClick(room)}>
            <div className="room-list-item-header">
                <div className="room-list-item-name primary-color"># {room.name}</div>
                <div className="room-list-item-admin">by {room.ownerName}</div>
            </div>
            <div className="room-list-item-description">{room.description}</div>
        </div>
    );
}


function mapStateToProps(state: StoreState, publicProps: IJoinRoomModalPublicProps): Partial<IJoinRoomModalProps> {
    return {
        authToken: state.user.authToken,
        userId: state.user.currentUser!.userId,
        rooms: state.user.rooms,
        ...publicProps
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): Partial<IJoinRoomModalProps> {
    return {
        updatedRoomList: rooms => dispatch(updatedRoomList(rooms))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoomModal);