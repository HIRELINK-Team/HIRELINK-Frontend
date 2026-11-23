import backIcon from '../../../assets/icons/student/documents/back.svg';
import { useTranslation } from 'react-i18next';

type DocumentRegistrationCompleteProps = {
  completeIcon: string;
  description: readonly [string, string];
  onBack: () => void;
  onConfirm: () => void;
};

export function DocumentRegistrationComplete({
  completeIcon,
  description,
  onBack,
  onConfirm,
}: DocumentRegistrationCompleteProps) {
  const { t } = useTranslation();
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label={t('common.back')}
        className="absolute top-[61px] left-4 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <img
        alt=""
        className="absolute top-[332px] left-1/2 h-[65px] w-[65px] -translate-x-1/2"
        src={completeIcon}
      />
      <h1 className="absolute top-[425px] right-6 left-6 m-0 text-center text-[22px] leading-[1.5] font-semibold">
        {t('my.documents.complete')}
      </h1>
      <p className="absolute top-[470px] right-6 left-6 m-0 text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        {description[0]}
        <br />
        {description[1]}
      </p>
      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </button>
    </main>
  );
}
