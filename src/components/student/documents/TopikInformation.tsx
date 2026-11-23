import illustration from '../../../assets/images/student/documents/topik/guide-illustration.png';
import levelIcon from '../../../assets/images/student/documents/topik/guide-level.png';
import { useTranslation } from 'react-i18next';
import { DocumentRegistrationInformation } from './DocumentRegistrationInformation';

type TopikInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [{ icon: levelIcon, label: 'TOPIK 등급 확인' }] as const;

export function TopikInformation(props: TopikInformationProps) {
  const { t } = useTranslation();
  return (
    <DocumentRegistrationInformation
      compactGuidePosition
      description={t('my.documentFlow.topikDescription')}
      guideItems={GUIDE_ITEMS.map((item) => ({ ...item, label: t('my.documentFlow.topikCheck') }))}
      heading={[t('my.documentFlow.topikHeading1'), t('my.documentFlow.registerPrompt')]}
      illustration={illustration}
      title={t('my.documentFlow.topikTitle')}
      {...props}
    />
  );
}
