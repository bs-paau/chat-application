import {Contact, Room, User} from "../../../types";
import * as constants from "../constants/index";

export type UserAction =
    | LoginUserSuccess
    | ProfileDeleteSuccess
    | LogoutUserSuccess
    | UpdateProfileSuccess
    | UpdatedRoomList
    | UpdatedFriendList
    | ChangeCurrentRoom;


// LOGIN_USER_SUCCESS

export interface LoginUserSuccess {
    type: constants.LOGIN_USER_SUCCESS;
    user: User;
    authToken: string;
}

export function loginUserSuccess(user: User, authToken: string): LoginUserSuccess {
    return {
        type: constants.LOGIN_USER_SUCCESS,
        user,
        authToken
    }
}

// PROFILE_DELETE_SUCCESS

export interface ProfileDeleteSuccess {
    type: constants.PROFILE_DELETE_SUCCESS;
}

export function profileDeleteSuccess(): ProfileDeleteSuccess {
    return {
        type: constants.PROFILE_DELETE_SUCCESS,
    }
}

// LOGOUT_USER_SUCCESS

export interface LogoutUserSuccess {
    type: constants.LOGOUT_USER_SUCCESS;
}

export function logoutUserSuccess(): LogoutUserSuccess {
    return {
        type: constants.LOGOUT_USER_SUCCESS,
    }
}

// UPDATE_PROFILE_SUCCESS

export interface UpdateProfileSuccess {
    type: constants.UPDATE_PROFILE_SUCCESS;
    user: User;
}

export function updateProfileSuccess(user: User): UpdateProfileSuccess {
    return {
        type: constants.UPDATE_PROFILE_SUCCESS,
        user
    }
}

// UPDATED_ROOM_LIST

export interface UpdatedRoomList {
    type: constants.UPDATED_ROOM_LIST;
    rooms: Room[];
}

export function updatedRoomList(rooms: Room[]): UpdatedRoomList {
    return {
        type: constants.UPDATED_ROOM_LIST,
        rooms
    }
}

// UPDATED_FRIEND_LIST

export interface UpdatedFriendList {
    type: constants.UPDATED_FRIEND_LIST;
    contacts: Contact[]
}

export function updatedFriendList(contacts: Contact[]): UpdatedFriendList {
    return {
        type: constants.UPDATED_FRIEND_LIST,
        contacts
    }
}

// CHANGE_CURRENT_ROOM

export interface ChangeCurrentRoom {
    type: constants.CHANGE_CURRENT_ROOM;
    roomId: number;
}

export function changeCurrentRoom(roomId: number): ChangeCurrentRoom {
    return {
        type: constants.CHANGE_CURRENT_ROOM,
        roomId
    }
}