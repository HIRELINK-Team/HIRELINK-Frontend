import completeIcon from '../../../assets/icons/student/documents/topik/complete-check.svg';
import { useTranslation } from 'react-i18next';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type TopikCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function TopikComplete(props: TopikCompleteProps) {
  const { t } = useTranslation();
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={[t('my.documents.registeredInfo'), t('my.documents.topikComplete')]}
      {...props}
    />
  );
}
