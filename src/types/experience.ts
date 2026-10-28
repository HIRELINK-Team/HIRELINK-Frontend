export type Experience = {
  duties: string;
  endMonth: string;
  id: string;
  startMonth: string;
  workplace: string;
};

export type ExperienceDraft = Omit<Experience, 'id'>;
