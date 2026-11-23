import illustration from '../../../assets/images/student/documents/transcript/guide-illustration.png';
import scoreIcon from '../../../assets/images/student/documents/transcript/guide-score.png';
import { useTranslation } from 'react-i18next';
import { DocumentRegistrationInformation } from './DocumentRegistrationInformation';

type TranscriptInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [{ icon: scoreIcon, label: '직전학기 평균 학점' }] as const;

export function TranscriptInformation(props: TranscriptInformationProps) {
  const { t } = useTranslation();
  return (
    <DocumentRegistrationInformation
      description={t('my.documentFlow.transcriptDescription')}
      guideItems={GUIDE_ITEMS.map((item) => ({ ...item, label: t('my.documentFlow.gradeCheck') }))}
      heading={[t('my.documentFlow.transcriptHeading1'), t('my.documentFlow.registerPrompt')]}
      illustration={illustration}
      title={t('my.documentFlow.transcriptTitle')}
      {...props}
    />
  );
}
