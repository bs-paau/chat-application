import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

export interface IWebSocketMessage {
    type: string,
    senderId: number;
    username: string;
    targetId?: number;
    roomId?: number;
    content: string;
    timeSent?: Date;
}

export class WebSocketHelper {
    public static socket: any;
    public static stompClient: Stomp.Client;

    public static connect() : Promise<void> {
        this.socket = new SockJS("http://localhost:8080/ws");
        this.stompClient = Stomp.over(this.socket);
        return new Promise<void>(resolve => {
            this.stompClient.connect({}, frame => resolve(), this.onError);
        });
    }

    public static send(message: IWebSocketMessage, channel: string) {
        this.stompClient.send(channel, {}, JSON.stringify(message));
    }

    public static subscribe(channel: string,  callback: (message: Stomp.Message) => void) {
        this.stompClient.subscribe(channel, callback);
    }

    private static onError = (error: string) => {
        console.log("STOMP ERROR: " + error);
    };

}