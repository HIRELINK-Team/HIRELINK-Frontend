import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import { DocumentBadgeIssued } from '../../components/student/documents/DocumentBadgeIssued';
import { DocumentManagementGuide } from '../../components/student/documents/DocumentManagementGuide';
import { DocumentRegistrationList } from '../../components/student/documents/DocumentRegistrationList';
import { EnrollmentCertificateCamera } from '../../components/student/documents/EnrollmentCertificateCamera';
import { EnrollmentCertificateComplete } from '../../components/student/documents/EnrollmentCertificateComplete';
import { EnrollmentCertificateInformation } from '../../components/student/documents/EnrollmentCertificateInformation';
import { EnrollmentCertificateReview } from '../../components/student/documents/EnrollmentCertificateReview';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { TranscriptCamera } from '../../components/student/documents/TranscriptCamera';
import { TranscriptComplete } from '../../components/student/documents/TranscriptComplete';
import { TranscriptInformation } from '../../components/student/documents/TranscriptInformation';
import { TranscriptReview } from '../../components/student/documents/TranscriptReview';
import { TopikCamera } from '../../components/student/documents/TopikCamera';
import { TopikComplete } from '../../components/student/documents/TopikComplete';
import { TopikInformation } from '../../components/student/documents/TopikInformation';
import { TopikReview } from '../../components/student/documents/TopikReview';
import { AlienRegistrationBackCamera } from '../../components/student/onboarding/AlienRegistrationBackCamera';
import {
  AlienRegistrationBackInfo,
  type AlienRegistrationBackInfoValues,
} from '../../components/student/onboarding/AlienRegistrationBackInfo';
import { AlienRegistrationBackGuide } from '../../components/student/onboarding/AlienRegistrationBackGuide';
import { AlienRegistrationFrontComplete } from '../../components/student/onboarding/AlienRegistrationFrontComplete';
import { AlienRegistrationFrontInfo } from '../../components/student/onboarding/AlienRegistrationFrontInfo';
import type { AlienRegistrationFormValues } from '../../components/student/onboarding/AlienRegistrationEdit';
import {
  STUDENT_ALIEN_REGISTRATION_DETAILS,
  STUDENT_BASIC_DOCUMENTS,
} from '../../mocks/studentDocuments';
import type { StudentNavigationTab } from '../../types/studentHome';
import {
  confirmEnrollmentCertificate,
  getEnrollmentCertificate,
  previewEnrollmentCertificate,
} from '../../api/studentEnrollment';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import {
  getDocumentCompletion,
  getStudentBadge,
  type StudentDocumentCompletion,
} from '../../api/student/studentDocumentStatus';
import { IS_DEMO_MODE } from '../../config/demoMode';
import type {
  EnrollmentPreviewResponse,
  EnrollmentDocumentResponse,
  StudentDocument,
} from '../../types/studentDocument';

export type StudentDocumentManagementView =
  | 'guide'
  | 'registration'
  | 'alien-information'
  | 'alien-camera'
  | 'alien-front-info'
  | 'alien-back-guide'
  | 'alien-back-camera'
  | 'alien-back-info'
  | 'alien-complete'
  | 'enrollment-information'
  | 'enrollment-camera'
  | 'enrollment-review'
  | 'enrollment-complete'
  | 'transcript-information'
  | 'transcript-camera'
  | 'transcript-review'
  | 'transcript-complete'
  | 'topik-information'
  | 'topik-camera'
  | 'topik-review'
  | 'topik-complete'
  | 'badge-issued';

const ALIEN_REGISTRATION_VALUES: AlienRegistrationFormValues = {
  name: STUDENT_ALIEN_REGISTRATION_DETAILS[0]?.value ?? '-',
  nationality: STUDENT_ALIEN_REGISTRATION_DETAILS[1]?.value ?? '-',
  residenceQualification: STUDENT_ALIEN_REGISTRATION_DETAILS[2]?.value ?? '-',
  registrationNumber: STUDENT_ALIEN_REGISTRATION_DETAILS[4]?.value ?? '-',
  issueDate: '-',
  serialNumber: '-',
  expiryDate:
    STUDENT_ALIEN_REGISTRATION_DETAILS[3]?.value.split(' - ')[1] ?? '-',
};

const ALIEN_REGISTRATION_BACK_VALUES: AlienRegistrationBackInfoValues = {
  permissionDate: '-',
  expirationDate: ALIEN_REGISTRATION_VALUES.expiryDate,
  reportDate: '-',
  serialNumber: '-',
};

type StudentDocumentManagementPageProps = {
  documentCompletion?: Partial<Record<StudentDocument['id'], boolean>>;
  documentRegistrationDates?: Partial<Record<StudentDocument['id'], string>>;
  initialView?: StudentDocumentManagementView;
  onDocumentComplete?: (
    documentId: StudentDocument['id'],
    registeredAt: string,
  ) => void;
  onDocumentClick?: (document: StudentDocument) => void;
  onDocumentFlowExit?: () => void;
  onExit?: () => void;
  onGuideStart?: () => void;
  onBadgeConfirm?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentDocumentManagementPage({
  documentCompletion,
  documentRegistrationDates: externalDocumentRegistrationDates,
  initialView = 'guide',
  onDocumentComplete,
  onDocumentClick,
  onDocumentFlowExit,
  onExit,
  onGuideStart,
  onBadgeConfirm,
  onTabChange,
}: StudentDocumentManagementPageProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<StudentDocumentManagementView>(initialView);
  const [serverCompletion, setServerCompletion] =
    useState<StudentDocumentCompletion | null>(null);
  const [completionError, setCompletionError] = useState(false);
  const [completionAttempt, setCompletionAttempt] = useState(0);
  const initialBadgeActive = useRef<boolean | null>(null);
  useEffect(() => {
    if (IS_DEMO_MODE) return;
    let active = true;
    void getStudentBadge()
      .then((badge) => {
        if (active) initialBadgeActive.current = badge.active;
      })
      .catch(() => {
        if (active) initialBadgeActive.current = null;
      });
    void getDocumentCompletion()
      .then((result) => {
        if (active) {
          setServerCompletion(result);
          setCompletionError(false);
        }
      })
      .catch(() => {
        if (active) setCompletionError(true);
      });
    return () => {
      active = false;
    };
  }, [completionAttempt]);
  const [enrollmentLookup, setEnrollmentLookup] = useState<
    | { status: 'loading' | 'error'; document: null }
    | { status: 'loaded'; document: EnrollmentDocumentResponse | null }
  >({ status: 'loading', document: null });

  useEffect(() => {
    if (initialView !== 'guide' && initialView !== 'registration') return;
    let active = true;
    getEnrollmentCertificate()
      .then((document) => {
        if (active) setEnrollmentLookup({ status: 'loaded', document });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (getApiErrorStatus(error) === 404) {
          setEnrollmentLookup({ status: 'loaded', document: null });
        } else {
          setEnrollmentLookup({ status: 'error', document: null });
          window.alert(
            getApiErrorResponse(error)?.message ??
              '재학증명서 정보를 불러오지 못했어요. 다시 시도해주세요.',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [initialView]);
  const [enrollmentPreview, setEnrollmentPreview] =
    useState<EnrollmentPreviewResponse | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [confirmedEnrollment, setConfirmedEnrollment] =
    useState<EnrollmentDocumentResponse | null>(null);
  const [enrollmentConfirmError, setEnrollmentConfirmError] = useState<
    string | null
  >(null);
  const [isEnrollmentConfirming, setIsEnrollmentConfirming] = useState(false);
  const enrollmentConfirming = useRef(false);
  const [isEnrollmentUploading, setIsEnrollmentUploading] = useState(false);
  const enrollmentRequestId = useRef(0);
  const enrollmentUploading = useRef(false);
  const documentCompletionPending = useRef(false);

  const handleEnrollmentConfirm = async () => {
    if (!enrollmentPreview || enrollmentConfirming.current) return;
    if (confirmedEnrollment) {
      setView('enrollment-complete');
      return;
    }
    enrollmentConfirming.current = true;
    setIsEnrollmentConfirming(true);
    setEnrollmentConfirmError(null);
    try {
      const result = await confirmEnrollmentCertificate(
        enrollmentPreview.draftId,
      );
      setConfirmedEnrollment(result);
      setView('enrollment-complete');
    } catch (error) {
      const status = getApiErrorStatus(error);
      const message = getApiErrorResponse(error)?.message;
      const messages: Record<number, string> = {
        400: '인식 결과가 올바르지 않아요. 다시 업로드해주세요.',
        401: '로그인 후 다시 시도해주세요.',
        403: '등록 권한을 확인해주세요. 온보딩을 완료해야 할 수 있어요.',
        404: '등록에 필요한 정보를 찾을 수 없어요.',
        409: '인식 결과가 만료되었거나 이미 등록되었어요. 다시 업로드해주세요.',
        422: '서류 정보를 확인할 수 없어요. 다시 업로드해주세요.',
      };
      setEnrollmentConfirmError(
        status === 422 && message
          ? message
          : (status && messages[status]) ||
              '등록하지 못했어요. 다시 시도해주세요.',
      );
    } finally {
      enrollmentConfirming.current = false;
      setIsEnrollmentConfirming(false);
    }
  };

  const handleEnrollmentUpload = async (file: File) => {
    if (enrollmentUploading.current) return;
    setEnrollmentError(null);
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      setEnrollmentError('PDF, JPG, PNG 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEnrollmentError('파일 크기는 5MB 이하여야 해요.');
      return;
    }
    const requestId = ++enrollmentRequestId.current;
    enrollmentUploading.current = true;
    setIsEnrollmentUploading(true);
    try {
      const preview = await previewEnrollmentCertificate(file);
      if (requestId !== enrollmentRequestId.current) return;
      setEnrollmentPreview(preview);
      setConfirmedEnrollment(null);
      setEnrollmentConfirmError(null);
      setView('enrollment-review');
    } catch (error) {
      if (requestId !== enrollmentRequestId.current) return;
      const status = getApiErrorStatus(error);
      const serverMessage = getApiErrorResponse(error)?.message;
      const messages: Record<number, string> = {
        400: '파일을 확인하고 다시 업로드해주세요.',
        413: '파일 크기는 5MB 이하여야 해요.',
        415: 'PDF, JPG, PNG 파일만 업로드할 수 있어요.',
        422: '서류를 인식할 수 없어요. 선명한 파일로 다시 시도해주세요.',
        502: '서류 인식 서비스에 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
      };
      setEnrollmentError(
        status === 422 && serverMessage
          ? serverMessage
          : (status && messages[status]) ||
              '업로드에 실패했어요. 다시 시도해주세요.',
      );
    } finally {
      if (requestId === enrollmentRequestId.current) {
        enrollmentUploading.current = false;
        setIsEnrollmentUploading(false);
      }
    }
  };

  const handleEnrollmentCameraBack = () => {
    enrollmentRequestId.current += 1;
    enrollmentUploading.current = false;
    setIsEnrollmentUploading(false);
    setEnrollmentError(null);
    setView('enrollment-information');
  };
  const [isAlienRegistrationComplete, setIsAlienRegistrationComplete] =
    useState(true);
  const [isEnrollmentCertificateComplete, setIsEnrollmentCertificateComplete] =
    useState(false);
  const [isTranscriptComplete, setIsTranscriptComplete] = useState(true);
  const [isTopikComplete, setIsTopikComplete] = useState(true);
  const [documentRegistrationDates, setDocumentRegistrationDates] = useState<
    Partial<Record<StudentDocument['id'], string>>
  >({});

  const handleGuideBack = () => {
    onExit?.();
  };

  const handleGuideStart = () => {
    onGuideStart?.();
    setView('registration');
  };

  const handleRegistrationBack = () => {
    setView('guide');
  };

  const handleDocumentFlowExit = () => {
    if (onDocumentFlowExit) {
      onDocumentFlowExit();
      return;
    }

    setView('registration');
  };

  const handleDocumentComplete = async (documentId: StudentDocument['id']) => {
    if (documentCompletionPending.current) return;
    documentCompletionPending.current = true;
    if (!IS_DEMO_MODE) {
      if (documentId !== 'enrollment-certificate' || !confirmedEnrollment) {
        documentCompletionPending.current = false;
        window.alert('해당 서류의 실제 등록 기능은 아직 준비 중이에요.');
        return;
      }
      try {
        const [completion, badge] = await Promise.all([
          getDocumentCompletion(),
          getStudentBadge(),
        ]);
        setServerCompletion(completion);
        documentCompletionPending.current = false;
        if (initialBadgeActive.current === false && badge.active) {
          setView('badge-issued');
        } else {
          handleDocumentFlowExit();
        }
      } catch (error) {
        documentCompletionPending.current = false;
        window.alert(
          getApiErrorResponse(error)?.message ??
            '등록은 완료되었지만 서류 상태를 확인하지 못했어요. 다시 확인해주세요.',
        );
      }
      return;
    }
    let enrollmentRegistered = isEnrollmentCertificateRegistered;
    if (
      documentId !== 'enrollment-certificate' &&
      enrollmentLookup.status !== 'loaded'
    ) {
      try {
        const document = await getEnrollmentCertificate();
        enrollmentRegistered = true;
        setEnrollmentLookup({ status: 'loaded', document });
      } catch (error) {
        if (getApiErrorStatus(error) === 404) {
          enrollmentRegistered = false;
          setEnrollmentLookup({ status: 'loaded', document: null });
        } else {
          window.alert(
            getApiErrorResponse(error)?.message ??
              '재학증명서 정보를 불러오지 못했어요. 다시 시도해주세요.',
          );
          documentCompletionPending.current = false;
          return;
        }
      }
    }
    const now =
      documentId === 'enrollment-certificate' && confirmedEnrollment
        ? new Date(confirmedEnrollment.registeredAt)
        : new Date();
    const registeredAt = t('my.documents.registeredAt', {
      date: `${String(now.getFullYear()).slice(-2)}.${String(
        now.getMonth() + 1,
      ).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
    });

    if (documentId === 'alien-registration-card') {
      setIsAlienRegistrationComplete(true);
    }

    if (documentId === 'enrollment-certificate') {
      setIsEnrollmentCertificateComplete(true);
    }

    if (documentId === 'transcript') {
      setIsTranscriptComplete(true);
    }

    if (documentId === 'topik-transcript') {
      setIsTopikComplete(true);
    }

    setDocumentRegistrationDates((currentDates) => ({
      ...currentDates,
      [documentId]: registeredAt,
    }));
    onDocumentComplete?.(documentId, registeredAt);

    const nextCompletion = {
      'alien-registration-card': isAlienRegistrationRegistered,
      'enrollment-certificate': enrollmentRegistered,
      transcript: isTranscriptRegistered,
      'topik-transcript': isTopikRegistered,
      [documentId]: true,
    };

    if (Object.values(nextCompletion).every(Boolean)) {
      documentCompletionPending.current = false;
      setView('badge-issued');
      return;
    }

    documentCompletionPending.current = false;
    handleDocumentFlowExit();
  };

  const handleDocumentClick = (document: StudentDocument) => {
    if (
      !IS_DEMO_MODE &&
      ['alien-registration-card', 'transcript', 'topik-transcript'].includes(
        document.id,
      )
    ) {
      window.alert('해당 서류의 실제 등록 기능은 아직 준비 중이에요.');
      return;
    }
    if (onDocumentClick) {
      onDocumentClick(document);
      return;
    }

    if (document.id === 'alien-registration-card') {
      setView('alien-information');
      return;
    }

    if (document.id === 'enrollment-certificate') {
      setView('enrollment-information');
      return;
    }

    if (document.id === 'transcript') {
      setView('transcript-information');
      return;
    }

    if (document.id === 'topik-transcript') {
      setView('topik-information');
      return;
    }
  };

  const isAlienRegistrationRegistered =
    serverCompletion?.registrationIncluded ??
    documentCompletion?.['alien-registration-card'] ??
    isAlienRegistrationComplete;
  const isEnrollmentCertificateRegistered = serverCompletion
    ? serverCompletion.enrollmentIncluded
    : enrollmentLookup.status === 'loaded'
      ? enrollmentLookup.document !== null
      : isEnrollmentCertificateComplete;
  const isTranscriptRegistered =
    serverCompletion?.transcriptIncluded ??
    documentCompletion?.transcript ??
    isTranscriptComplete;
  const isTopikRegistered =
    serverCompletion?.topikIncluded ??
    documentCompletion?.['topik-transcript'] ??
    isTopikComplete;

  if (view === 'badge-issued') {
    return (
      <DocumentBadgeIssued
        onConfirm={onBadgeConfirm ?? (() => setView('registration'))}
      />
    );
  }

  const basicDocuments = STUDENT_BASIC_DOCUMENTS.map((document) => {
    const registeredAt =
      (IS_DEMO_MODE
        ? externalDocumentRegistrationDates?.[document.id]
        : undefined) ??
      documentRegistrationDates[document.id] ??
      (IS_DEMO_MODE ? document.registeredAt : undefined);

    if (document.id === 'alien-registration-card') {
      return {
        ...document,
        status: isAlienRegistrationRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isAlienRegistrationRegistered ? registeredAt : undefined,
      };
    }

    if (document.id === 'enrollment-certificate') {
      const enrollmentDocument = enrollmentLookup.document;
      const registrationDate = enrollmentDocument
        ? new Date(enrollmentDocument.registeredAt)
        : null;
      return {
        ...document,
        status: isEnrollmentCertificateRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: registrationDate
          ? t('my.documents.registeredAt', {
              date: `${String(registrationDate.getFullYear()).slice(-2)}.${String(registrationDate.getMonth() + 1).padStart(2, '0')}.${String(registrationDate.getDate()).padStart(2, '0')}`,
            })
          : undefined,
      };
    }

    if (document.id === 'transcript') {
      return {
        ...document,
        status: isTranscriptRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTranscriptRegistered ? registeredAt : undefined,
      };
    }

    if (document.id === 'topik-transcript') {
      return {
        ...document,
        status: isTopikRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTopikRegistered ? registeredAt : undefined,
      };
    }

    return document;
  });

  if (view === 'guide') {
    return (
      <DocumentManagementGuide
        onBack={handleGuideBack}
        onStart={handleGuideStart}
      />
    );
  }

  if (!IS_DEMO_MODE && view === 'registration' && !serverCompletion) {
    return (
      <main
        className="mx-auto flex min-h-dvh max-w-[390px] flex-col items-center justify-center gap-4 bg-[#F5F5F5] p-6"
        aria-busy={!completionError}
      >
        <p>
          {completionError
            ? '서류 상태를 불러오지 못했어요.'
            : '서류 상태를 불러오는 중이에요.'}
        </p>
        {completionError ? (
          <button
            type="button"
            onClick={() => {
              setCompletionError(false);
              setCompletionAttempt((value) => value + 1);
            }}
          >
            다시 시도
          </button>
        ) : null}
        <button type="button" onClick={handleGuideBack}>
          뒤로
        </button>
      </main>
    );
  }

  if (view === 'alien-information') {
    return (
      <AlienRegistrationInformation
        onBack={handleDocumentFlowExit}
        onRegister={() =>
          IS_DEMO_MODE
            ? setView('alien-camera')
            : window.alert('해당 서류의 실제 등록 기능은 아직 준비 중이에요.')
        }
        progressLabel="1/6"
      />
    );
  }

  if (view === 'alien-camera') {
    return (
      <AlienRegistrationCamera
        onBack={() => setView('alien-information')}
        onCapture={() => setView('alien-front-info')}
      />
    );
  }

  if (view === 'alien-front-info') {
    return (
      <AlienRegistrationFrontInfo
        onBack={() => setView('alien-camera')}
        onConfirm={() => setView('alien-back-guide')}
        onRetry={() => setView('alien-camera')}
        progressLabel="1/6"
        values={ALIEN_REGISTRATION_VALUES}
      />
    );
  }

  if (view === 'alien-back-guide') {
    return (
      <AlienRegistrationBackGuide
        onBack={() => setView('alien-front-info')}
        onConfirm={() => setView('alien-back-camera')}
        progressLabel="1/6"
      />
    );
  }

  if (view === 'alien-back-camera') {
    return (
      <AlienRegistrationBackCamera
        onBack={() => setView('alien-back-guide')}
        onCapture={() => setView('alien-back-info')}
      />
    );
  }

  if (view === 'alien-back-info') {
    return (
      <AlienRegistrationBackInfo
        onBack={() => setView('alien-back-camera')}
        onConfirm={() => setView('alien-complete')}
        onRetry={() => setView('alien-back-camera')}
        progressLabel="1/6"
        values={ALIEN_REGISTRATION_BACK_VALUES}
      />
    );
  }

  if (view === 'alien-complete') {
    return (
      <AlienRegistrationFrontComplete
        onBack={() => setView('alien-back-info')}
        onConfirm={() => handleDocumentComplete('alien-registration-card')}
        showDescription={false}
      />
    );
  }

  if (view === 'enrollment-information') {
    return (
      <EnrollmentCertificateInformation
        onBack={handleDocumentFlowExit}
        onRegister={() => setView('enrollment-camera')}
      />
    );
  }

  if (view === 'enrollment-camera') {
    return (
      <EnrollmentCertificateCamera
        onBack={handleEnrollmentCameraBack}
        onCapture={() => {}}
        onFileUpload={handleEnrollmentUpload}
        isUploading={isEnrollmentUploading}
        errorMessage={enrollmentError}
      />
    );
  }

  if (view === 'enrollment-review' && enrollmentPreview) {
    return (
      <EnrollmentCertificateReview
        preview={
          confirmedEnrollment
            ? { ...enrollmentPreview, ...confirmedEnrollment }
            : enrollmentPreview
        }
        registeredAt={confirmedEnrollment?.registeredAt}
        isConfirming={isEnrollmentConfirming}
        errorMessage={enrollmentConfirmError}
        onBack={() => setView('enrollment-camera')}
        onConfirm={handleEnrollmentConfirm}
        onRetry={() => setView('enrollment-camera')}
      />
    );
  }

  if (view === 'enrollment-complete') {
    return (
      <EnrollmentCertificateComplete
        onBack={() => setView('enrollment-review')}
        onConfirm={() => handleDocumentComplete('enrollment-certificate')}
      />
    );
  }

  if (view === 'transcript-information') {
    return (
      <TranscriptInformation
        onBack={handleDocumentFlowExit}
        onRegister={() =>
          IS_DEMO_MODE
            ? setView('transcript-camera')
            : window.alert('해당 서류의 실제 등록 기능은 아직 준비 중이에요.')
        }
      />
    );
  }

  if (view === 'transcript-camera') {
    return (
      <TranscriptCamera
        onBack={() => setView('transcript-information')}
        onCapture={() => setView('transcript-review')}
      />
    );
  }

  if (view === 'transcript-review') {
    return (
      <TranscriptReview
        onBack={() => setView('transcript-camera')}
        onConfirm={() => setView('transcript-complete')}
        onRetry={() => setView('transcript-camera')}
      />
    );
  }

  if (view === 'transcript-complete') {
    return (
      <TranscriptComplete
        onBack={() => setView('transcript-review')}
        onConfirm={() => handleDocumentComplete('transcript')}
      />
    );
  }

  if (view === 'topik-information') {
    return (
      <TopikInformation
        onBack={handleDocumentFlowExit}
        onRegister={() =>
          IS_DEMO_MODE
            ? setView('topik-camera')
            : window.alert('해당 서류의 실제 등록 기능은 아직 준비 중이에요.')
        }
      />
    );
  }

  if (view === 'topik-camera') {
    return (
      <TopikCamera
        onBack={() => setView('topik-information')}
        onCapture={() => setView('topik-review')}
      />
    );
  }

  if (view === 'topik-review') {
    return (
      <TopikReview
        onBack={() => setView('topik-camera')}
        onConfirm={() => setView('topik-complete')}
        onRetry={() => setView('topik-camera')}
      />
    );
  }

  if (view === 'topik-complete') {
    return (
      <TopikComplete
        onBack={() => setView('topik-review')}
        onConfirm={() => handleDocumentComplete('topik-transcript')}
      />
    );
  }

  return (
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="h-full overflow-y-auto px-6 pt-[61px] pb-[113px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          aria-label={t('common.back')}
          className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={handleRegistrationBack}
        >
          <img alt="" src={backIcon} />
        </button>
        <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
          {t('my.documents.title')}
        </h1>
        <div className="mt-[8px]">
          {serverCompletion ? (
            <p aria-label="서류 등록 완성률">
              서류 등록 완성률 {serverCompletion.completionPercentage}%
            </p>
          ) : null}
          <DocumentRegistrationList
            basicDocuments={basicDocuments}
            enrollmentDocument={enrollmentLookup.document}
            enrollmentLookupStatus={enrollmentLookup.status}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </div>
      <StudentBottomNavigation
        activeTab="my"
        bottomOffset={27}
        onTabChange={onTabChange}
      />
    </main>
  );
}
