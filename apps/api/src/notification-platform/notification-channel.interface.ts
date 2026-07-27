export type NotificationChannelType =
  | 'EMAIL'
  | 'SMS'
  | 'IN_APP'
  | 'PUSH'
  | 'WEBHOOK';

export interface NotificationPayload {
  recipient: string;
  subject?: string;
  body: string;
  data?: Record<string, any>;
  tenantId?: string;
}

export interface INotificationChannel {
  type: NotificationChannelType;
  send(payload: NotificationPayload): Promise<boolean>;
}
