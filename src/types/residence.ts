export type ResidenceQualification =
  'D2_1' | 'D2_2' | 'D2_3' | 'D2_4' | 'D2_6' | 'D2_7' | 'D2_8' | 'D4_1';

export type AcademicStatus =
  | 'ENROLLED'
  | 'COMPLETED'
  | 'GRADUATED'
  | 'LEAVE_OF_ABSENCE'
  | 'EXCHANGE_IN_PROGRESS'
  | 'EXCHANGE_ENDED'
  | 'INTERRUPTED'
  | 'PROGRAM_IN_PROGRESS'
  | 'PROGRAM_COMPLETED'
  | 'VISITING_IN_PROGRESS'
  | 'VISITING_ENDED'
  | 'TRAINING_IN_PROGRESS'
  | 'TRAINING_COMPLETED'
  | 'TRAINING_INTERRUPTED';

export type ResidenceInfo = {
  academicStatus: AcademicStatus;
  residenceQualification: ResidenceQualification;
};
