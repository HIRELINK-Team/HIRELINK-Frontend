export type StudentDocumentStatus = 'registered' | 'required';

export type StudentDocument = {
  id:
    | 'alien-registration-card'
    | 'enrollment-certificate'
    | 'transcript'
    | 'topik-transcript'
    | 'part-time-work-permit';
  registeredAt?: string;
  status: StudentDocumentStatus;
  title: string;
};

export type StudentDocumentGuideItem = {
  description: string;
  icon: string;
  title: string;
};

export type StudentAlienRegistrationDetail = {
  label: string;
  value: string;
};

export type StudentTranscriptDetail = {
  label: string;
  value: string;
};

export type StudentTopikDetail = {
  label: string;
  value: string;
};

export type StudentAlienRegistrationGuideItem = {
  icon: string;
  title: string;
};

export type EnrollmentPreviewResponse = {
  draftId: string;
  universityName: string;
  campusName: string | null;
  gradeLevel: number;
  extracted: {
    universityName: string;
    campusName: string | null;
    gradeLevel: number | null;
    semesterCount: number | null;
  };
};

export type EnrollmentDocumentResponse = {
  universityName: string;
  campusName: string | null;
  gradeLevel: number;
  registeredAt: string;
};
