import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { MessageBus, Connection, Message } from '../../../../../../public_api';
import { IWidget} from '../iwidget.interface';


@Component({
    selector: 'widget-state-selector',
    templateUrl: './widget-state-selector.component.html',
    styleUrls: ['./widget-state-selector.component.css']
})
export class WidgetStateSelectorComponent implements IWidget{
    @Input() values: string[];
    @Input() connectionId: string;
    @Input() id: string;
    @Input() type: string;
    selectedValue: string;
    data: string;
    private hubConnection: Connection;
    targetRecipent: string;
    targetType: string;

    constructor(private messageBus: MessageBus){

    }

    ngOnInit(){
        this.hubConnection = this.messageBus.connect(this.connectionId, this.id);

        this.hubConnection.onBroadcast(this.handleBroadcast.bind(this));
    }

    setValue(value: string){
        this.selectedValue = value;
    }

    broadcast(){
        this.hubConnection.broadcast(this.selectedValue);
    }

    handleBroadcast(data: any){
        this.selectedValue = data.toString();
        this.data = data.toString();
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
            callback:  null
        };
        this.hubConnection.off(subscription);
        this.messageBus.disconnect(this.hubConnection);
        this.hubConnection = null;
    }

    handleEvent(data: any){
        this.selectedValue = data.toString();
        this.data = data.toString();
    }

    send(){
        const message:Message<any> = {
            recipientIds: null,
            payload: this.selectedValue,
            groupId: this.targetType
        };
        

        if(this.targetRecipent && this.targetRecipent.length >0 && this.targetRecipent != "null"){
            message.recipientIds = [ this.targetRecipent];
        }
        this.hubConnection.post(message);
    }
}