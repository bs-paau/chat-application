import {ReduxAction} from '../actions';
import {
    ChangeCurrentRoom,
    LoginUserSuccess,
    UpdatedFriendList,
    UpdatedRoomList,
    UpdateProfileSuccess
} from "../actions/userAction";
import {
    CHANGE_CURRENT_ROOM,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER_SUCCESS,
    PROFILE_DELETE_SUCCESS, UPDATE_PROFILE_SUCCESS, UPDATED_FRIEND_LIST, UPDATED_ROOM_LIST,
} from "../constants";
import {UserState} from "../types/user_state";

export function userReducer(state: UserState, action: ReduxAction): UserState {
    if (state === undefined) {
        return {loggedIn: false, rooms: [], contacts: [], currentRoom: -1};
    }

    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            const castedAction = (action as LoginUserSuccess);
            const {authToken, user} = castedAction;
            return {...state, loggedIn: true, authToken, currentUser: user};
        case PROFILE_DELETE_SUCCESS:
            return {...state, loggedIn: false, authToken: "", currentUser: undefined};
        case LOGOUT_USER_SUCCESS:
            return {...state, loggedIn: false, authToken: "", currentUser: undefined};
        case UPDATE_PROFILE_SUCCESS:
            const updateProfileSuccess = (action as UpdateProfileSuccess);
            return {...state, currentUser: updateProfileSuccess.user};
        case UPDATED_ROOM_LIST:
            const updatedRoomList = (action as UpdatedRoomList);
            return {...state, rooms: updatedRoomList.rooms};
        case UPDATED_FRIEND_LIST:
            const updatedFriendList = (action as UpdatedFriendList);
            return {...state, contacts: updatedFriendList.contacts};
        case CHANGE_CURRENT_ROOM:
            const changeCurrentRoom = (action as ChangeCurrentRoom);
            return {...state, currentRoom: changeCurrentRoom.roomId}
    }
    return state;
}