import completeIcon from '../../../assets/icons/student/documents/topik/complete-check.svg';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type TopikCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function TopikComplete(props: TopikCompleteProps) {
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={['등록된 정보를 바탕으로', '한국어능력이 확인되었어요.']}
      {...props}
    />
  );
}
