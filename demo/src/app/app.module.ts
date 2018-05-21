import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MessageBus } from 'ngx-message-bus';
import { AppComponent } from './app.component';
import { WidgetModule } from './modules/widget/widget.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    WidgetModule
  ],
  providers:[ 
    MessageBus
   ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
