import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WidgetStateSelectorComponent } from './widget-state-selector/widget-state-selector.component';
import { WidgetTextboxComponent } from './widget-textbox/widget-textbox.component';
@NgModule({
    imports:[
        CommonModule,
        FormsModule
    ],
    declarations:[
        WidgetStateSelectorComponent,
        WidgetTextboxComponent
    ],
    exports: [
        WidgetStateSelectorComponent,
        WidgetTextboxComponent
    ]
})
export class WidgetModule{

}