import { NotificationRequestItem } from '@adyen/api-library/lib/src/typings/notification/notificationRequestItem';
import EventCodeEnum = NotificationRequestItem.EventCodeEnum;


export type PaymentEventData = {
    data: NotificationRequestItem;
    eventType: EventCodeEnum;
    receiveDate: Date;
    pspReference: string; // The payment reference assigned by Adyen. Used as idempotency key.
    status: Status;
};

export enum Status {
    RECEIVED,
}
