export interface Subscription<T>{
    groupId: string;
    callback: (payload: any) => void;
}
