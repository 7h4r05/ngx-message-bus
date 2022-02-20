import { ErrorHandlingEnum } from './error-handling.enum';
import { Connection } from "./connection";
import { Message } from "./message";
import { Listener } from "./listener";

export class Hub {
        private hubName: string;
        private subscribers: Connection[];
        private listeners: Listener[];
        private broadcastListeners: Listener[];

        constructor(hubName: string,
            private errorHanndling: ErrorHandlingEnum) {
            this.subscribers = [];
            this.listeners = [];
            this.broadcastListeners = [];
            this.hubName = hubName;
        }

        connect(connection: Connection):void {
            this.subscribers.push(connection);
        }

        disconnect(connection: Connection):void {
            if(!this.subscribers || this.subscribers.length === 0) {
                return;
            }
            const subscriberIndex: number = this.subscribers.findIndex(sub => sub.getSubscriberId() === connection.getSubscriberId());
            if(subscriberIndex >= 0) {
                this.subscribers.splice(subscriberIndex, 1);
            }
            if(this.isAnyListener()) {
                let listenerIndex: number = -1;
                while( (listenerIndex = this.listeners.findIndex(l => l.subscriberId.toString() === connection.getSubscriberId())) >= 0) {
                    this.listeners.splice(listenerIndex, 1);
                }
            }

            if(this.isAnyBroadcastListener()) {
                let broadcastListenerIndex: number = -1;
                while( (broadcastListenerIndex = this.broadcastListeners
                    .findIndex(l => l.subscriberId.toString() === connection.getSubscriberId())) >= 0) {
                    this.broadcastListeners.splice(broadcastListenerIndex, 1);
                }
            }
        }

        getActiveConnections():number {
            return this.subscribers.length;
        }

        addListener(listener: Listener):void {
            if(!this.listeners.find(l => l.subscriberId.toString() === listener.subscriberId.toString()
            && l.groupId.toString() === listener.groupId.toString())) {
                this.listeners.push(listener);
            }
        }

        addBroadcastListener(listener: Listener):void {
            if(!this.broadcastListeners.find(l => l.subscriberId.toString() === listener.subscriberId.toString())) {
                this.broadcastListeners.push(listener);
            }
        }

        removeListener(listener: Listener):void {
            if(!this.isAnyListener()) {
                return;
            }
            const listenerToRemoveIndex: number = this.listeners
            .findIndex(l => l.subscriberId.toString() === listener.subscriberId.toString()
            && l.groupId.toString() === listener.groupId.toString());
            if(listenerToRemoveIndex > -1) {
                this.listeners.splice(listenerToRemoveIndex, 1);
            }
        }

        removeBroadcastListener(subscriberId: string):void {
            if(!this.isAnyBroadcastListener()) {
                return;
            }
            const listenerToRemoveIndex: number = this.broadcastListeners
            .findIndex(listener => listener.subscriberId.toString() === subscriberId.toString());
            if(listenerToRemoveIndex > -1) {
                this.broadcastListeners.splice(listenerToRemoveIndex, 1);
            }
        }

        getHubName():string {
            return this.hubName;
        }

        post<T>(message: Message<T>):void {
            if(!this.isAnyListener() && message) {
                return;
            }

            const isMsgRecipientsValid = this.isRecipientsValid(message);
            
            let recipients: Listener[] = this.listeners;

            if(!isMsgRecipientsValid || message.recipientIds.indexOf(message.publisherId.toString()) < 0) {
                recipients = recipients.filter(l => l.subscriberId.toString() !== message.publisherId.toString());
            }
            if(isMsgRecipientsValid && message.recipientIds.length > 0) {
                recipients = recipients.filter(sub => message.recipientIds.indexOf(sub.subscriberId.toString()) >= 0);
            }
            if(message.groupId && message.groupId.length > 0) {
                recipients = recipients.filter(sub => sub.groupId.toString() === message.groupId.toString());
            }

            if(!recipients || recipients.length === 0) {
                return;
            }
            recipients.forEach(recipient => {
                try{
                recipient.callback(message.payload);
                }catch(e){
                    switch(this.errorHanndling){
                        case ErrorHandlingEnum.Log:
                            console.error(e);
                            break;
                        case ErrorHandlingEnum.Throw:
                            throw e;
                        case ErrorHandlingEnum.None:
                        default:
                            break;
                    }
                }
            });
        }

        broadcast<T>(message: Message<T>):void {
            if(!this.isAnyBroadcastListener()) {
                return;
            }
            this.broadcastListeners
            .filter(listener => listener.subscriberId.toString() !== message.publisherId.toString())
            .forEach(listener => listener.callback(message.payload));
        }


        dispose():void {
            this.subscribers = null;
            this.broadcastListeners = null;
            this.hubName = null;
            this.listeners = null;
        }

        private isRecipientsValid<T>(message: Message<T>):boolean {
            return message.recipientIds && message.recipientIds.length ? true : false;
        }

        private isAnyListener():boolean {
            return this.listeners && this.listeners.length > 0;
        }

        private isAnyBroadcastListener():boolean {
            return this.broadcastListeners && this.broadcastListeners.length > 0;
        }
    }
