import backIcon from '../../../assets/icons/student/documents/alien-registration/camera-back.svg';
import { useTranslation } from 'react-i18next';
import { DocumentCaptureActions } from './DocumentCaptureActions';

type DocumentCapturePageProps = {
  cornersIcon: string;
  fileIcon: string;
  scanIcon: string;
  onBack: () => void;
  onCapture: () => void;
};

export function DocumentCapturePage({
  cornersIcon,
  fileIcon,
  scanIcon,
  onBack,
  onCapture,
}: DocumentCapturePageProps) {
  const { t } = useTranslation();
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#3F3F3F] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#F5F5F5]">
      <button
        aria-label={t('common.back')}
        className="absolute top-[61px] left-4 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <p className="absolute top-[112px] right-6 left-6 m-0 text-center text-[15px] leading-[1.4]">
        {t('my.documents.capturePrompt').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
      </p>
      <div className="absolute top-[198px] left-1/2 h-[290px] w-[227px] -translate-x-1/2 rounded-[10px] border border-[#F5F5F5]" />
      <section
        aria-label={t('my.captureGuide')}
        className="absolute top-[536px] right-6 left-6 grid grid-cols-3"
      >
        <div className="flex flex-col items-center">
          <img alt="" className="h-10 w-10" src={cornersIcon} />
          <p className="m-0 mt-[22px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
            {t('my.documents.corners').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img alt="" className="h-[46px] w-[46px]" src={scanIcon} />
          <p className="m-0 mt-[16px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
            {t('my.documents.clearText').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img alt="" className="h-[47px] w-[47px]" src={fileIcon} />
          <p className="m-0 mt-[15px] text-center text-[15px] leading-[1.5] text-[#939393]">
            PDF, JPG, PNG
            <br />
            {t('my.documents.canRegister')}
          </p>
        </div>
      </section>
      <DocumentCaptureActions
        accept="application/pdf,image/*"
        className="absolute top-[694px] right-6 left-6"
        onFileUpload={onCapture}
        onTakePhoto={onCapture}
      />
    </main>
  );
}
