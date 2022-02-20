export class Message<T>{
    payload: T;
    groupId: string;
    recipientIds?: string[];
    publisherId?: string;
    timeGenerated?: Date;
    metadata?: string;
}
