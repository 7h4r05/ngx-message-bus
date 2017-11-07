export declare class Subscription<T> {
    groupId: string;
    callback: (payload: T) => void;
}
