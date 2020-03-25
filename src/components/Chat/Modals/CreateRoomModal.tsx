import {ChangeEvent} from "react";
import * as React from "react";
import {Modal} from "react-bootstrap";
import {connect, Dispatch} from "react-redux";
import * as Spinner from "react-spinkit";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import {ReduxAction} from "../../../logic/redux/actions";
import {updatedRoomList} from "../../../logic/redux/actions/userAction";
import {StoreState} from "../../../logic/redux/types";
import {Body6, DefaultApi} from "../../../logic/rest";
import {Room, User} from "../../../types";
import {FloatingLabelInput} from "../../Common/FloatingLabelInput";
import {SimpleButton} from "../../Common/SimpleButton";
import {VisibilityContainer} from "../../Common/VisibilityContainer";
import "./CreateRoomModal.css";


export interface ICreateRoomModalProps extends ICreateRoomModalPublicProps {
    authToken: string;
    user: User;
    rooms: Room[];
    updatedRoomList: (rooms: Room[]) => void;
}

export interface ICreateRoomModalPublicProps {
    show: boolean;
    onHide: () => void;
}

export interface ICreateRoomModalState {
    roomName: string;
    public: boolean;
    isLoading: boolean;
    description: string;
}

class CreateRoomModal extends React.Component<ICreateRoomModalProps, ICreateRoomModalState> {
    constructor(props: ICreateRoomModalProps, context: any) {
        super(props, context);
        this.state = {roomName: "", description: "", public: true, isLoading: false};
    }

    public async componentDidMount(): Promise<void> {
        // const api = new DefaultApi();
        // const response = await api.roomsPublicGet(this.props.authToken, {
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json"
        //     }
        // });
        // this.setState(response.result);

    }

    public render(): React.ReactNode {
        return (
            <Modal onHide={this.props.onHide} show={this.props.show}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Create a room</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <h4>Create a new public or private room</h4>
                    <form>
                        <FloatingLabelInput id="room-name" label="Room Name" onChange={this.changeRoomName}/>
                        <FloatingLabelInput id="room-name" label="Description " onChange={this.changeDescription}/>
                        <div className="simple-flex">
                            <span style={{marginLeft: "5px", marginRight: "10px", fontWeight: "bold"}}>Public: </span>
                            <Toggle checked={this.state.public} onChange={this.changePublic}/>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <SimpleButton text="Create" className="primary-color-bg" onClick={this.onCreate}/>
                    <VisibilityContainer visible={this.state.isLoading} displayNone={true}>
                        <div id="room-spinner">
                            <Spinner name="three-bounce" className="spinner" fadeIn="quarter"/>
                        </div>
                    </VisibilityContainer>
                </Modal.Footer>
            </Modal>
        );
    }


    private changeRoomName = (evt: ChangeEvent<HTMLInputElement>) => this.setState({roomName: evt.target.value});
    private changeDescription = (evt: ChangeEvent<HTMLInputElement>) => this.setState({description: evt.target.value});
    private changePublic = (evt: ChangeEvent<HTMLInputElement>) => this.setState({public: evt.target.checked});


    private onCreate = async () => {
        this.setState({isLoading: true});
        const api = new DefaultApi();
        const body: Body6 = {
            privacy: this.state.public ? Body6.PrivacyEnum.Public : Body6.PrivacyEnum.Private,
            roomName: this.state.roomName,
            description: this.state.description
        };
        const result = await api.roomsUserUserIdPost(this.props.user.userId, this.props.authToken, body, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        const room = result.room;
        const castedRoom : Room = {
            name: room.name,
            roomId: room.id,
            description: room.description,
            private: room.private,
            createdOn: room.createdon
        };

        const newRooms = Array.from(this.props.rooms);
        newRooms.push(castedRoom);
        this.props.updatedRoomList(newRooms);
        this.setState({isLoading: false});
        this.props.onHide();
    };
}

function mapStateToProps(state: StoreState, publicProps: ICreateRoomModalPublicProps): Partial<ICreateRoomModalProps> {
    return {
        authToken: state.user.authToken,
        user: state.user.currentUser,
        rooms: state.user.rooms,
        ...publicProps
    }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): Partial<ICreateRoomModalProps> {
    return {
        updatedRoomList: rooms => dispatch(updatedRoomList(rooms))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoomModal);