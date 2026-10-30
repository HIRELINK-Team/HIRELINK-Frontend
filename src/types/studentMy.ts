export type StudentMyMenuId =
  | 'personal-info'
  | 'documents'
  | 'matching-conditions'
  | 'notifications'
  | 'customer-center'
  | 'terms';

export type StudentMyMenu = {
  description?: string;
  id: StudentMyMenuId;
  title: string;
};

export type StudentMyProfile = {
  name: string;
  topikLevel: string;
  visaStatus: string;
};

export type StudentMyProgress = {
  descriptionLines: readonly string[];
  percent: number;
  title: string;
};
