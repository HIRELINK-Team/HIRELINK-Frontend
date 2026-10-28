export type IndustryId =
  | 'foodCafe'
  | 'retail'
  | 'officeTourism'
  | 'translation'
  | 'dutyFree'
  | 'majorStudy'
  | 'internship'
  | 'other';

export type IndustryOption = {
  id: IndustryId;
  label: string;
};
