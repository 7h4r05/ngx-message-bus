import { NgModule } from '@angular/core';
import { MessageBus } from './src/message.bus';
import { ErrorHandlingEnum } from './src/error-handling.enum';
import { MessageBusConfig } from './src/message-bus.config';
import { ModuleWithProviders } from '@angular/core';

export * from "./src/connection";
export * from "./src/hub";
export * from "./src/listener";
export * from "./src/message.bus";
export * from "./src/message";
export * from "./src/subscription";
export * from './src/error-handling.enum';


@NgModule({ 
    providers:[
        {
            provide: MessageBusConfig,
            useValue: { ErrorHandling: ErrorHandlingEnum.Log }
        },
        MessageBus
    ]
}) 
export class MessageBusModule { 
    static withConfig(errorHandling: ErrorHandlingEnum): ModuleWithProviders{
        return {
            ngModule: MessageBusModule,
            providers: [
                {
                    provide: MessageBusConfig,
                    useValue: { ErrorHandling: errorHandling } 
                },
                MessageBus
            ]
        }
    }
} 