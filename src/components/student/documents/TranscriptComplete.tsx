import completeIcon from '../../../assets/icons/student/documents/transcript/complete-check.svg';
import { DocumentRegistrationComplete } from './DocumentRegistrationComplete';

type TranscriptCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function TranscriptComplete(props: TranscriptCompleteProps) {
  return (
    <DocumentRegistrationComplete
      completeIcon={completeIcon}
      description={['등록된 정보를 바탕으로', '성적 정보가 확인되었어요.']}
      {...props}
    />
  );
}
