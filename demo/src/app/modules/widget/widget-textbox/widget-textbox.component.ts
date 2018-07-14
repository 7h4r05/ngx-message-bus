import { Component, Input } from '@angular/core';
import { MessageBus, Connection }  from 'ngx-message-bus';

import { IWidget } from '../iwidget.interface';

@Component({
    selector: 'widget-textbox',
    templateUrl: './widget-textbox.component.html'
})
export class WidgetTextboxComponent implements IWidget{
    value: string;
    @Input() connectionId: string;
    @Input() id: string;
    @Input() type: string;
    data: string;
    hubConnection: Connection;
    constructor(private messageBus: MessageBus){

    }

    ngOnInit(){
        this.hubConnection = this.messageBus.connect(this.connectionId, this.id);

        const subscription = {
            groupId: this.type,
            callback: this.handleEvent.bind(this)
        };
        this.hubConnection.on(subscription);
        this.hubConnection.onBroadcast(this.handleBroadcast.bind(this));
    }

    changed(text){
        this.value = text;
        this.hubConnection.broadcast(text);
    }
    broadcast(){
        this.hubConnection.broadcast
    }

    handleBroadcast(data: any){
        this.value = data;
        this.data = data;
    }

    on(){
        if(this.hubConnection === null){
            this.hubConnection = this.messageBus.connect(this.connectionId, this.id);
            this.hubConnection.onBroadcast(this.handleBroadcast.bind(this));
        }
        const subscription= {
            groupId: this.type,
            callback:  this.handleEvent.bind(this)
        };
        this.hubConnection.on(subscription);
    }

    off(){
        const subscription= {
            groupId: this.type,
            callback:  this.handleEvent.bind(this)
        };
        this.hubConnection.off(subscription);
        this.messageBus.disconnect(this.hubConnection);
        this.hubConnection = null;
    }

    handleEvent(data: any){
        this.value = data;
        this.data = data;
    }
}