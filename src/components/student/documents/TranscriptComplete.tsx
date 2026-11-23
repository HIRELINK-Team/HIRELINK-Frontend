import completeIcon from '../../../assets/icons/student/documents/transcript/complete-check.svg';
import { useTranslation } from 'react-i18next';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type TranscriptCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function TranscriptComplete(props: TranscriptCompleteProps) {
  const { t } = useTranslation();
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={[t('my.documents.registeredInfo'), t('my.documents.transcriptComplete')]}
      {...props}
    />
  );
}
