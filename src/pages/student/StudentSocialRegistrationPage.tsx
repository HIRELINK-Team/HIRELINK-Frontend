import { useEffect, useRef, useState } from 'react';

import { getApiErrorResponse } from '../../api/errors';
import {
  verifySocialRegistrationBack,
  verifySocialRegistrationFront,
  verifySocialStayDocument,
} from '../../api/socialAuth';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import { AlienRegistrationBackCamera } from '../../components/student/onboarding/AlienRegistrationBackCamera';
import { AlienRegistrationBackGuide } from '../../components/student/onboarding/AlienRegistrationBackGuide';
import { AlienRegistrationBackInfo } from '../../components/student/onboarding/AlienRegistrationBackInfo';
import { AlienRegistrationBUpload } from '../../components/student/onboarding/AlienRegistrationBUpload';
import { AlienRegistrationBUploadComplete } from '../../components/student/onboarding/AlienRegistrationBUploadComplete';
import { AlienRegistrationFrontComplete } from '../../components/student/onboarding/AlienRegistrationFrontComplete';
import { AlienRegistrationFrontInfo } from '../../components/student/onboarding/AlienRegistrationFrontInfo';
import { AlienRegistrationResidenceComplete } from '../../components/student/onboarding/AlienRegistrationResidenceComplete';
import { AlienRegistrationValidationModal } from '../../components/student/onboarding/AlienRegistrationValidationModal';
import type {
  SocialRegistrationFrontResponse,
  SocialRegistrationVerificationResponse,
} from '../../types/socialRegistration';

type Step =
  | 'guide'
  | 'frontCamera'
  | 'frontInfo'
  | 'backGuide'
  | 'backCamera'
  | 'backInfo'
  | 'invalid'
  | 'expired'
  | 'pdf'
  | 'pdfComplete'
  | 'residenceComplete'
  | 'complete'
  | 'loading';

export default function StudentSocialRegistrationPage({
  onBack,
  onComplete,
  onSessionExpired,
}: {
  onBack: () => void;
  onComplete: () => void;
  onSessionExpired: () => void;
}) {
  const [step, setStep] = useState<Step>('guide');
  const [front, setFront] = useState<SocialRegistrationFrontResponse | null>(
    null,
  );
  const [back, setBack] =
    useState<SocialRegistrationVerificationResponse | null>(null);
  const isActive = useRef(false);
  const isPending = useRef(false);

  useEffect(() => {
    isActive.current = true;
    return () => {
      isActive.current = false;
    };
  }, []);

  const handleFile = async (file: File, side: 'front' | 'back' | 'pdf') => {
    if (isPending.current) return;
    if (
      file.size > 5 * 1024 * 1024 ||
      (side === 'pdf'
        ? file.type !== 'application/pdf'
        : !['image/jpeg', 'image/png'].includes(file.type))
    ) {
      window.alert(
        side === 'pdf'
          ? '5MB 이하의 PDF 파일을 선택해 주세요.'
          : '5MB 이하의 JPG 또는 PNG 파일을 선택해 주세요.',
      );
      return;
    }
    isPending.current = true;
    if (side === 'front') {
      setFront(null);
      setBack(null);
    }
    setStep('loading');
    try {
      if (side === 'front') {
        const response = await verifySocialRegistrationFront(file);
        if (!isActive.current) return;
        setFront(response);
        setStep('frontInfo');
      } else if (side === 'back') {
        const response = await verifySocialRegistrationBack(file);
        if (!isActive.current) return;
        if (!response.cardVerified)
          throw new Error('Invalid registration verification');
        setBack(response);
        setStep('backInfo');
      } else {
        const response = await verifySocialStayDocument(file);
        if (!isActive.current) return;
        if (
          !response.cardVerified ||
          !response.stayDocumentVerified ||
          response.requiresStayDocument
        )
          throw new Error('Invalid stay document verification');
        setBack(response);
        setStep('pdfComplete');
      }
    } catch (error) {
      if (!isActive.current) return;
      const apiError = getApiErrorResponse(error);
      if (
        [
          'INVALID_SOCIAL_SESSION',
          'SOCIAL_ACCOUNT_ALREADY_REGISTERED',
        ].includes(apiError?.code ?? '')
      ) {
        window.alert(
          apiError?.message ??
            '가입 정보를 확인할 수 없어요. 다시 로그인해 주세요.',
        );
        onSessionExpired();
      } else if (apiError?.code === 'REGISTRATION_FRONT_REQUIRED') {
        setFront(null);
        setBack(null);
        window.alert(apiError.message);
        setStep('frontCamera');
      } else if (apiError?.code === 'REGISTRATION_BACK_REQUIRED') {
        setBack(null);
        window.alert(apiError.message);
        setStep('backCamera');
      } else if (
        side === 'back' &&
        apiError?.code === 'REGISTRATION_NOT_VERIFIED'
      ) {
        setStep('invalid');
      } else {
        window.alert(
          apiError?.message ?? '인증에 실패했어요. 다시 시도해 주세요.',
        );
        setStep(
          side === 'front'
            ? 'frontCamera'
            : side === 'back'
              ? 'backCamera'
              : 'pdf',
        );
      }
    } finally {
      isPending.current = false;
    }
  };

  const restartFront = () => {
    setFront(null);
    setBack(null);
    setStep('frontCamera');
  };
  const backValues = {
    permissionDate: '-',
    reportDate: '-',
    expirationDate: back?.stayExpiresOn.replaceAll('-', '.') ?? '-',
    serialNumber: back?.serialNumber ?? '-',
  };
  if (step === 'loading')
    return (
      <main
        aria-busy="true"
        className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center justify-center bg-[#F5F5F5]"
      >
        인증 정보를 확인하고 있어요.
      </main>
    );
  if (step === 'guide')
    return (
      <AlienRegistrationInformation
        onBack={onBack}
        onRegister={() => setStep('frontCamera')}
      />
    );
  if (step === 'frontCamera')
    return (
      <AlienRegistrationCamera
        onBack={() => setStep('guide')}
        onCapture={(file) => void handleFile(file, 'front')}
      />
    );
  if (step === 'frontInfo' && front)
    return (
      <AlienRegistrationFrontInfo
        onBack={restartFront}
        onRetry={restartFront}
        onConfirm={() => {
          setFront(null);
          setStep('backGuide');
        }}
        values={{
          name: front.name,
          nationality: front.nationalityCode,
          residenceQualification: front.visaCode,
          registrationNumber: front.registrationNumber,
          issueDate: front.issueDate,
          expiryDate: '-',
          serialNumber: '-',
        }}
      />
    );
  if (step === 'backGuide')
    return (
      <AlienRegistrationBackGuide
        onBack={restartFront}
        onConfirm={() => setStep('backCamera')}
      />
    );
  if (step === 'backCamera')
    return (
      <AlienRegistrationBackCamera
        onBack={() => setStep('backGuide')}
        onCapture={(file) => void handleFile(file, 'back')}
      />
    );
  if (step === 'backInfo' && back)
    return (
      <AlienRegistrationBackInfo
        values={backValues}
        onBack={restartFront}
        onRetry={restartFront}
        onConfirm={() =>
          setStep(back.requiresStayDocument ? 'expired' : 'complete')
        }
      />
    );
  if (step === 'invalid' || step === 'expired')
    return (
      <>
        <AlienRegistrationBackInfo
          values={backValues}
          onBack={restartFront}
          onRetry={restartFront}
          onConfirm={() => undefined}
        />
        <AlienRegistrationValidationModal
          type={step === 'expired' ? 'expired' : 'invalid'}
          expirationDate={backValues.expirationDate}
          onRetry={restartFront}
          onUploadPdf={() => setStep('pdf')}
        />
      </>
    );
  if (step === 'pdf')
    return (
      <AlienRegistrationBUpload
        onBack={() => setStep('expired')}
        onUpload={(file) => void handleFile(file, 'pdf')}
      />
    );
  if (step === 'pdfComplete')
    return (
      <AlienRegistrationBUploadComplete
        onBack={() => setStep('residenceComplete')}
        onConfirm={() => setStep('residenceComplete')}
      />
    );
  if (step === 'residenceComplete')
    return (
      <AlienRegistrationResidenceComplete
        onBack={() => setStep('pdfComplete')}
        onConfirm={onComplete}
      />
    );
  if (step === 'complete')
    return (
      <AlienRegistrationFrontComplete
        onBack={restartFront}
        onConfirm={onComplete}
      />
    );
  return null;
}
