import * as admin from 'firebase-admin';
// import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { NotificationItem } from '@adyen/api-library/lib/src/typings/notification/notificationItem';
import { NotificationResponse } from '@adyen/api-library/lib/src/typings/platformsNotifications/notificationResponse';
import { Notification } from '@adyen/api-library/lib/src/typings/notification/notification';
import { PaymentEventData, Status } from '../../../src/db/adyenEvents/types';
import adyenEvents from '../../../src/db/adyenEvents/adyenEvents';

admin.initializeApp();

const adyenWebhookHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('Adyen webhook received: ', JSON.stringify(req.body));
  try {
    // Get the request body

    // TODO Uncomment the below as soon as API is tested
    // Decode the signature and calculate the expected signature
    // const signature = req.headers['x-adyen-signature'] as string;
    // const secretKey = process.env.ADYEN_SECRET_KEY as string;
    // const expectedSignature = crypto
    //   .createHmac('sha256', secretKey)
    //   .update(JSON.stringify(req.body))
    //   .digest('hex');
    //
    // // Verify the signature
    // if (signature !== expectedSignature) {
    //   res.status(401).send('Invalid signature');
    // }

    const { notificationItems } = req.body as Notification;
    const dbData = notificationItems.map((notificationItem: NotificationItem) => {
      const event = notificationItem.NotificationRequestItem;
      const data: PaymentEventData = {
        data: event,
        eventType: event.eventCode,
        receiveDate: new Date(),
        pspReference: event.pspReference,
        status: Status.RECEIVED,
      };
      return data;
    });

    // We should make the below function fast, as adyen will resend events again, if API is slow (> 10sec)
    await adyenEvents.saveEvents(dbData);

    const response = new NotificationResponse();
    response.notificationResponse = '[accepted]';
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send('Internal server error');
  }
};

export default adyenWebhookHandler;
