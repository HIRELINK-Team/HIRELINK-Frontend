export type StudentNotificationId =
  | 'matching-recommendation'
  | 'application-result'
  | 'saved-job'
  | 'document-status'
  | 'document-expiry'
  | 'employment-permit'
  | 'service-news';

export type StudentNotificationSettings = Record<
  StudentNotificationId,
  boolean
>;
