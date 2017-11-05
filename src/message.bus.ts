import { IConnection } from './interfaces/connection.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IMessage } from './interfaces/message.interface';
import { MessageBusConnection } from './implementation/message-bus.connection';
import { Hub } from './hub';

interface Map{
    [hubName: string]: Hub;
}

export class MessageBus{

    private hubs: Map;

    constructor(){
        this.hubs = {};
    }

    connect(hubName: string, subscriberId: string):IConnection{
        hubName = hubName.toString();
        if(!this.hubs[hubName] || this.hubs[hubName] === null){
            this.hubs[hubName] = new Hub(hubName);
        }
        const hub = this.hubs[hubName];
        const connection = new MessageBusConnection(hub, subscriberId);
        hub.connect(connection);
        return connection;
    }

    disconnect(connection: IConnection){
        if(!connection || connection == null){
            return;
        }

        let hub = this.hubs[connection.getHubName().toString()];
        if(hub){
            hub.disconnect(connection);
            if(hub.getActiveConnections() < 1){
                hub.dispose();
                this.hubs[connection.getHubName()] = null;
            }
        }
    }
}