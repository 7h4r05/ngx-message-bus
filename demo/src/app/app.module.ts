import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WidgetModule } from './modules/widget/widget.module';
import { MessageBusModule } from '../../../public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    WidgetModule,
    MessageBusModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
