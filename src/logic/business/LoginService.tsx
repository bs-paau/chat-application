import {Contact, Room} from "../../types";
import {DefaultApi} from "../rest";

export class LoginService {
    public static async doAfterLogin(userId: number, token: string, roomCallback: (rooms: Room[]) => void, contactsCallback: (contact: Contact[]) => void) {
        await this.loadRooms(userId, token, roomCallback);
        await this.loadContacts(userId, token, contactsCallback)
    }

    private static async loadRooms(userId: number, token: string, callback: (rooms: Room[]) => void) {
        try {
            const api = new DefaultApi();
            const result = await api.roomsUserUserIdGet(userId, token, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            const rooms = result.result;
            const typedRooms = rooms.map<Room>(r => {
                return {
                    createdOn: r.createdon,
                    description: r.description,
                    name: r.name,
                    private: r.private,
                    roomId: r.id
                };
            });
            callback(typedRooms);
        } catch (e) {
            console.log(e);
        }

    }

    private static async loadContacts(userId: number, token: string, callback: (contact: Contact[]) => void) {
        try {
            const api = new DefaultApi();
            const result = await api.usersUserIdContactsGet(userId, token, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });
            const contacts = result.contacts;
            const typedContacts = contacts.map<Contact>(c => {
                return {
                    id: +c.id,
                    isPending: c.isPending,
                    username: c.username
                };
            });
            callback(typedContacts);
        } catch (e) {
            console.log(e);
        }
    }
}