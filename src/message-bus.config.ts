import { ErrorHandlingEnum } from './error-handling.enum';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageBusConfig {

    public ErrorHandling: ErrorHandlingEnum = ErrorHandlingEnum.Log;
}