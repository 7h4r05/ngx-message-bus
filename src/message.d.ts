export declare class Message<T> {
    payload: T;
    groupId: string;
    recipentIds: string[];
    publisherId?: string;
    timeGenerated?: Date;
    metadata?: string;
}
