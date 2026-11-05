export type Experience = {
  duties: string;
  endMonth: string;
  id: string;
  startMonth: string;
  workplace: string;
};

export type ExperienceDraft = Omit<Experience, 'id'>;

export type StudentCareerResponse = {
  careerId: number;
  careerName: string;
  startMonth: string;
  endMonth: string;
  description: string | null;
};

export type CreateStudentCareerRequest = {
  careerName: string;
  startMonth: string;
  endMonth: string;
  description?: string | null;
};

export type UpdateStudentCareerRequest = Partial<{
  careerName: string;
  startMonth: string;
  endMonth: string;
  description: string | null;
}>;
