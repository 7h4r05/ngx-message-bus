import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IConnection }  from '../interfaces/connection.interface';
import { IMessage } from '../interfaces/message.interface';
import { Hub } from '../hub';
import { ISubscription } from '../interfaces/subscription.interface';
import { IListener } from '../interfaces/listener.interface';

export class MessageBusConnection implements IConnection{
    private subscriberId: string;
    private hub: Hub;

    constructor(hub: Hub, subscriberId: string){
        this.hub = hub;
        this.subscriberId = subscriberId;
    }

    getHubName():string{
        return this.hub.getHubName();
    }

    getSubscriberId(): string{
        return this.subscriberId.toString();
    }

    off<T>(subscription: ISubscription<T>){
        this.hub.removeListener(this.subscriptionToListener(subscription));
    }

    offBroadcast<T>(){
        this.hub.removeBroadcastListener(this.getSubscriberId());
    }

    on<T>(subscription: ISubscription<T>){
        this.hub.addListener(this.subscriptionToListener(subscription));
    }

    onBroadcast<T>(callBack: (payload: any) => void){
        this.hub.addBroadcastListener({
            subscriberId: this.subscriberId,
            callback: callBack,
            groupId: null
        });
    }

    post<T>(message: IMessage<T>){
        message.publisherId = this.subscriberId;
        message.timeGenerated = new Date();
        this.hub.post(message);
    }

    broadcast<T>(data: T){
        const message:IMessage<T> = {
            publisherId: this.subscriberId,
            payload: data,
            timeGenerated: new Date(),
            groupId: null,
            metadata: null,
            recipentIds: null
        };
        this.hub.broadcast(message);
    }

    private subscriptionToListener<T>(subscription: ISubscription<T>):IListener{
        return {
            subscriberId: this.getSubscriberId(),
            groupId: subscription.groupId,
            callback: subscription.callback
        };
    }
}