export interface User {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
}

export interface Room {
    roomId: number;
    name: string;
    description: string;
    createdOn: Date;
    private: boolean;
}

export interface Contact {
    id: number;
    isPending: boolean;
    username: string;
}