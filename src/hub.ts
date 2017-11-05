import { Connection } from './connection';
import { Message } from './message';
import { Listener } from './listener';


export class Hub{
    
        private hubName: string;
    
        private subscribers: Connection[];
        private listeners: Listener[];
        private broadcastListeners: Listener[];
    
        constructor(hubName: string){
            this.subscribers = [];
            this.listeners = [];
            this.broadcastListeners = [];
            this.hubName = hubName;
        }

        connect(connection: Connection){

            this.subscribers.push(connection);
        }

        disconnect(connection: Connection){
            if(!this.subscribers || this.subscribers.length === 0){
                return;
            }
            const subscriberIndex = this.subscribers.findIndex(sub => sub.getSubscriberId() === connection.getSubscriberId());
            if(subscriberIndex >= 0){
                this.subscribers.splice(subscriberIndex, 1);
            }
            if(this.isAnyListener()){
                let listenerIndex = -1;
                while( (listenerIndex = this.listeners.findIndex(l => l.subscriberId.toString() === connection.getSubscriberId())) >= 0){
                    this.listeners.splice(listenerIndex, 1);
                }
            }

            if(this.isAnyBroadcastListener()){
                let broadcastListenerIndex = -1;
                while( (broadcastListenerIndex = this.broadcastListeners.findIndex(l => l.subscriberId.toString() === connection.getSubscriberId())) >= 0){
                    this.broadcastListeners.splice(broadcastListenerIndex, 1);
                }
            }
        }

        getActiveConnections(){
            return this.subscribers.length;
        }
        
        addListener(listener: Listener){
            if(!this.listeners.find(l => l.subscriberId.toString() === listener.subscriberId.toString() && l.groupId.toString() === listener.groupId.toString())){
                this.listeners.push(listener);
            }
        }

        addBroadcastListener(listener: Listener){
            if(!this.broadcastListeners.find(l => l.subscriberId.toString() === listener.subscriberId.toString())){
                this.broadcastListeners.push(listener);
            }
        }

        removeListener(listener: Listener){
            if(!this.isAnyListener()){
                return;
            }
            const listenerToRemoveIndex = this.listeners.findIndex(l => l.subscriberId.toString() === listener.subscriberId.toString() 
            && l.groupId.toString() === listener.groupId.toString());
            if(listenerToRemoveIndex > -1){
                this.listeners.splice(listenerToRemoveIndex, 1);
            }
        }

        removeBroadcastListener(subscriberId: string){
            if(!this.isAnyBroadcastListener()){
                return;
            }
            const listenerToRemoveIndex = this.broadcastListeners.findIndex(listener => listener.subscriberId.toString() === subscriberId.toString());
            if(listenerToRemoveIndex > -1){
                this.broadcastListeners.splice(listenerToRemoveIndex, 1);
            }
        }

        getHubName(){
            return this.hubName;
        }

        post<T>(message: Message<T>){
            if(!this.isAnyListener() && message){
                return;
            }
            let recipents = this.listeners;
            
            if(!message.recipentIds || message.recipentIds.indexOf(message.publisherId.toString()) < 0) {
                recipents = recipents.filter(l => l.subscriberId.toString() !== message.publisherId.toString());
            }
            if(message.recipentIds && message.recipentIds.length > 0){
                recipents = recipents.filter(sub => message.recipentIds.indexOf(sub.subscriberId.toString()) >= 0);
            }
            if(message.groupId && message.groupId.length > 0){
                recipents = recipents.filter(sub => sub.groupId.toString() === message.groupId.toString());
            }

            if(!recipents || recipents.length === 0){
                return;
            }
            recipents.forEach(recipent => recipent.callback(message.payload));
        }

        broadcast<T>(message: Message<T>){
            if(!this.isAnyBroadcastListener()){
                return;
            }
            this.broadcastListeners
            .filter(listener => listener.subscriberId.toString() !== message.publisherId.toString())
            .forEach(listener => listener.callback(message.payload));
        }


        dispose(){
            this.subscribers = null;
            this.broadcastListeners = null;
            this.hubName = null;
            this.listeners = null;
        }

        private isAnyListener(){
            return this.listeners && this.listeners.length > 0;
        }

        private isAnyBroadcastListener(){
            return this.broadcastListeners && this.broadcastListeners.length > 0;
        }
    }
    