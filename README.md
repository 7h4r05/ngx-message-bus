# ngx-message-bus

> Message Bus for Angular 8+ for communication between components.

For Angular version 7.x, you need to choose 7.0.0 version.
For Angular version 6.x, you need to choose 3.0.0 version.
For Angular versions before 6, you need to choose a 1.x version of this module.

Provides:

- creation of virtual hubs
- communication within hubs across whole application
- direct messaging within hubs
- bulk messaging by type within hubs
- broadcasting messages within hubs

## Usage

### Import Module
Import module 

```ts
import  { MessageBusModule } from 'ngx-message-bus';

@NgModule({
    imports: [
        //...,
        MessageBusModule
    ]
})
```

### Managing the connection

#### Open the connection

Opens the connection to hub and stores Connection object allowing listening, broadcasting and posting messages.

```ts

ngOnInit(){
    //initializes the connection to the hub with specific id. subscriberId is the unique id of entity making the connection
    this.myConnection = this.messageBus.connect(hubId, subscriberId);
}

```

#### Closing connection

Closes the connection. Remove the subscriber from hub and kills all listeners.

```ts
ngOnDestroy(){
    this.messageBus.disconnect(this.myConnection);
}

```

### Listening for messages

#### Start listening for messages

To start listening for a specific type of message create a subscription object and pass it to 'on' method. Each time the message arrives to the group or to the subscriber the 'handleMessage' method will be called.

```ts
const subscription = {
    groupId: messageTypeId,
    callback: this.handleMessage.bind(this)
};
this.myConnection.on(subscription);

```

#### Stop listening to messages

```ts
 const subscription= {
    groupId: this.type,
    callback:  null
};
this.hubConnection.off(subscription);
```

#### Listen for broadcasts

Broadcast messages require only callback function to be passed

```ts
this.myConnection.onBroadcast(this.handleBroadcast.bind(this));
```

#### Stop listening for broadcasts

```ts
this.myConnection.offBroadcast();
```

### Posting messages

#### Post message

To post a message, a Message object needs to be created.

```ts
 const message = {
            recipientIds: [1,2,3],
            payload: { //... some data },
            groupId: 'XYZ'
        };
        this.hubConnection.post(message);
```

All recipients with ids: 1,2,3 and listening to group 'XYZ' will receive the message. recipientIds and groupId is optional. If one is not defined then 'any' is assumed. For example:

```ts
 const message = {
    recipientIds: null,
    payload: { //... some data },
    groupId: 'XYZ'
};
this.myConnection.post(message);
```

Targets all listeners in 'XYZ' group within the hub.

#### Broadcasting message

To broadcast a message simple data needs to be passed

```ts
   this.myConnection.broadcast({//... some data});
```

### Exception in listener's call back
By default message bus will catch the exception and print it into the console. There's a possibility to consume the exception with no action (None) or to rethrow the exception.

```ts
import  { MessageBusModule, ErrorHandlingEnum } from 'ngx-message-bus';

@NgModule({
    imports: [
        //...,
        MessageBusModule.withConfig(ErrorHandlingEnum.Throw)
    ]
})
```

When ErrorHandlingEnum is defined as

```ts
export declare enum ErrorHandlingEnum {
    None = 0,
    Throw = 1,
    Log = 2,
}
```

None = exception is consumed.
Throw = rethrow the exception. Note: it may break your application.
Log = print the excpetion into the console.