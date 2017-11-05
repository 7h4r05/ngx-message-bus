export class Subscription<T>{
    groupId: string;
    callback: (payload: any) => void;
}
