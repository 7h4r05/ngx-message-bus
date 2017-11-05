export interface IListener{
    subscriberId: string;
    groupId: string;
    callback: (payload: any) => void;
}