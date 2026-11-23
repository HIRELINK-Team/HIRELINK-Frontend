import illustration from '../../../assets/images/student/documents/topik/guide-illustration.png';
import levelIcon from '../../../assets/images/student/documents/topik/guide-level.png';
import { DocumentRegistrationInformation } from './DocumentRegistrationInformation';

type TopikInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [{ icon: levelIcon, label: 'TOPIK 등급 확인' }] as const;

export function TopikInformation(props: TopikInformationProps) {
  return (
    <DocumentRegistrationInformation
      compactGuidePosition
      description="TOPIK 등급 확인 위해 필요해요"
      guideItems={GUIDE_ITEMS}
      heading={['TOPIK 성적증명서를', '등록해주세요.']}
      illustration={illustration}
      title="TOPIK 성적증명서 등록"
      {...props}
    />
  );
}
