import { ErrorHandlingEnum } from './error-handling.enum';
import { Connection } from "./connection";
import { Hub } from "./hub";
import { Injectable } from "@angular/core";

interface IMap {
    [hubName: string]: Hub;
}

@Injectable({
    providedIn: 'root'
})
export class MessageBus {
    errorHandling = ErrorHandlingEnum.Log;
    private hubs: IMap;

    constructor() {
        this.hubs = {};
    }

    setLogLevel(errorHandling: ErrorHandlingEnum) {
        this.errorHandling = errorHandling;
    }

    connect(hubName: string, subscriberId: string):Connection {
        hubName = hubName.toString();
        if(!this.hubs[hubName] || this.hubs[hubName] === null) {
            this.hubs[hubName] = new Hub(hubName, this.errorHandling);
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
        const hubName:string = connection.getHubName().toString();
        let hub: Hub = this.hubs[hubName];
        if(hub) {
            hub.disconnect(connection);
            if(hub.getActiveConnections() < 1) {
                hub.dispose();
                this.hubs[hubName] = null;
            }
        }
    }
}