import { useTranslation } from 'react-i18next';
import scanIcon from '../../../assets/icons/student/documents/enrollment-certificate/camera-scan.svg';
import type { EnrollmentPreviewResponse } from '../../../types/studentDocument';
import { DocumentRecognitionReview } from './DocumentRecognitionReview';

type EnrollmentCertificateReviewProps = {
  preview: EnrollmentPreviewResponse;
  registeredAt?: string;
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  errorMessage?: string | null;
};

export function EnrollmentCertificateReview({
  preview,
  registeredAt,
  ...props
}: EnrollmentCertificateReviewProps) {
  const { t } = useTranslation();
  return (
    <DocumentRecognitionReview
      documentTitle={t('my.documents.enrollment')}
      fields={[
        { label: t('my.documentFlow.school'), value: preview.universityName },
        { label: '캠퍼스', value: preview.campusName ?? '-' },
        {
          label: t('my.documentFlow.year'),
          value: `${preview.gradeLevel}학년`,
        },
        { label: '확인 ID', value: preview.draftId },
        ...(registeredAt
          ? [
              {
                label: '등록일',
                value: new Date(registeredAt).toLocaleDateString('ko-KR'),
              },
            ]
          : []),
      ]}
      scanIcon={scanIcon}
      {...props}
    />
  );
}
