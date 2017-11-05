export interface ISubscription<T>{
    groupId: string;
    callback: (payload: any) => void;
}
