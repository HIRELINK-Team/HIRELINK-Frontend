import completeIcon from '../../../assets/icons/student/documents/enrollment-certificate/complete-check.svg';
import { useTranslation } from 'react-i18next';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type EnrollmentCertificateCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function EnrollmentCertificateComplete(
  props: EnrollmentCertificateCompleteProps,
) {
  const { t } = useTranslation();
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={[t('my.documents.registeredInfo'), t('my.documents.enrollmentComplete')]}
      {...props}
    />
  );
}
