import { Message } from "./message";
import { Hub } from "./hub";
import { Subscription } from "./subscription";
import { Listener } from "./listener";

export class Connection {
    private subscriberId: string;
    private hub: Hub;

    constructor(hub: Hub, subscriberId: string) {
        this.hub = hub;
        this.subscriberId = subscriberId;
    }

    getHubName(): string {
        return this.hub.getHubName();
    }

    getSubscriberId(): string {
        return this.subscriberId.toString();
    }

    off<T>(subscription: Subscription<T>): void {
        this.hub.removeListener(this.subscriptionToListener(subscription));
    }

    offBroadcast(): void {
        this.hub.removeBroadcastListener(this.getSubscriberId());
    }

    on<T>(subscription: Subscription<T>): void {
        this.hub.addListener(this.subscriptionToListener(subscription));
    }

    onBroadcast(callBack: (payload: any) => void): void {
        this.hub.addBroadcastListener({
            subscriberId: this.subscriberId,
            callback: callBack,
            groupId: null
        });
    }

    post<T>(message: Message<T>): void {
        message.publisherId = this.subscriberId;
        message.timeGenerated = new Date();
        this.hub.post(message);
    }

    broadcast<T>(data: T): void {
        const message:Message<T> = {
            publisherId: this.subscriberId,
            payload: data,
            timeGenerated: new Date(),
            groupId: null,
            metadata: null,
            recipentIds: null
        };
        this.hub.broadcast(message);
    }

    private subscriptionToListener<T>(subscription: Subscription<T>):Listener {
        return {
            subscriberId: this.getSubscriberId(),
            groupId: subscription.groupId,
            callback: subscription.callback
        };
    }
}