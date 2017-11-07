import { Connection } from "./connection";
import { Message } from "./message";
import { Listener } from "./listener";
export declare class Hub {
    private hubName;
    private subscribers;
    private listeners;
    private broadcastListeners;
    constructor(hubName: string);
    connect(connection: Connection): void;
    disconnect(connection: Connection): void;
    getActiveConnections(): number;
    addListener(listener: Listener): void;
    addBroadcastListener(listener: Listener): void;
    removeListener(listener: Listener): void;
    removeBroadcastListener(subscriberId: string): void;
    getHubName(): string;
    post<T>(message: Message<T>): void;
    broadcast<T>(message: Message<T>): void;
    dispose(): void;
    private isAnyListener();
    private isAnyBroadcastListener();
}
