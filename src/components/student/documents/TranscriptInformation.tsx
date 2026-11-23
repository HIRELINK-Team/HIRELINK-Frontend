import illustration from '../../../assets/images/student/documents/transcript/guide-illustration.png';
import scoreIcon from '../../../assets/images/student/documents/transcript/guide-score.png';
import { DocumentRegistrationInformation } from './DocumentRegistrationInformation';

type TranscriptInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [{ icon: scoreIcon, label: '직전학기 평균 학점' }] as const;

export function TranscriptInformation(props: TranscriptInformationProps) {
  return (
    <DocumentRegistrationInformation
      description="직전학기 평균 학점을 위해 필요해요"
      guideItems={GUIDE_ITEMS}
      heading={['본인의 성적증명서를', '등록해주세요.']}
      illustration={illustration}
      title="성적증명서 등록"
      {...props}
    />
  );
}
