export class Listener {
    subscriberId: string;
    groupId: string;
    callback: (payload: any) => void;
}