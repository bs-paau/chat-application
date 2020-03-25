import {Contact, Room, User} from "../../../types";

export interface UserState {
    loggedIn: boolean;
    currentUser?: User;
    authToken?: string;
    rooms: Room[];
    contacts: Contact[];
    currentRoom: number;
}