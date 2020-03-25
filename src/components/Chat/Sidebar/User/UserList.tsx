import * as React from "react";
import {ReactNode} from "react";
import {Contact} from "../../../../types";
import "./UserList.css";

interface IUserListProps {
    contacts: Contact[];
}

export class UserList extends React.Component<IUserListProps> {
    private static buildUserByName(name: string): ReactNode {
        return (<div className="user" key={name}>#{name}</div>);
    }

    public render():React.ReactNode  {
        return (
            <div id="user-list">
                <h3>All Users:</h3>
                {this.buildUsers()}
            </div>
        );
    }

    private buildUsers(): ReactNode[] {
        return this.props.contacts.map((user) => UserList.buildUserByName(user.username));
    }

}
