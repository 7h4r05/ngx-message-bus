import { Connection } from "./connection";
import { Hub } from "./hub";

interface IMap {
    [hubName: string]: Hub;
}

export class MessageBus {

    private hubs: IMap;

    constructor() {
        this.hubs = {};
    }

    connect(hubName: string, subscriberId: string):Connection {
        hubName = hubName.toString();
        if(!this.hubs[hubName] || this.hubs[hubName] === null) {
            this.hubs[hubName] = new Hub(hubName);
        }
        const hub: Hub = this.hubs[hubName];
        const connection: Connection = new Connection(hub, subscriberId);
        hub.connect(connection);
        return connection;
    }

    disconnect(connection: Connection): void {
        if(!connection || connection == null) {
            return;
        }

        let hub: Hub = this.hubs[connection.getHubName().toString()];
        if(hub) {
            hub.disconnect(connection);
            if(hub.getActiveConnections() < 1) {
                hub.dispose();
                this.hubs[connection.getHubName()] = null;
            }
        }
    }
}