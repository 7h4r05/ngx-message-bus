import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IMessage } from './message.interface';
import { IListener } from './listener.interface';
import { ISubscription } from './subscription.interface';

export interface IConnection{
    getHubName(): string;
    getSubscriberId(): string;

    post<T>(message: IMessage<T>);
    broadcast<T>(data: T);

    off<T>(subscription: ISubscription<T>): void;
    offBroadcast<T>();
    on<T>(subscription: ISubscription<T>):void;
    onBroadcast<T>(callBack: (payload: any) => void):void;
}
