import { NgModule } from '@angular/core';

import { MessageBus } from './message.bus';

@NgModule({
    providers:[
        MessageBus
    ]
})
export class MessageBusModule{

}
