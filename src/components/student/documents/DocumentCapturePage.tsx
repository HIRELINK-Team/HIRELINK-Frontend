import backIcon from '../../../assets/icons/student/documents/alien-registration/camera-back.svg';
import { useTranslation } from 'react-i18next';
import { DocumentCaptureActions } from './DocumentCaptureActions';

type DocumentCapturePageProps = {
  cornersIcon: string;
  fileIcon: string;
  scanIcon: string;
  onBack: () => void;
  onCapture: () => void;
  onFileUpload?: (file: File) => void;
  captureFile?: boolean;
  isUploading?: boolean;
  errorMessage?: string | null;
};

export function DocumentCapturePage({
  cornersIcon,
  fileIcon,
  scanIcon,
  onBack,
  onCapture,
  onFileUpload,
  captureFile = false,
  isUploading = false,
  errorMessage,
}: DocumentCapturePageProps) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#3F3F3F] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#F5F5F5]">
      <div className="flex h-full min-h-0 flex-col px-6 pt-[clamp(8px,7.23dvh,61px)] pb-[clamp(8px,11dvh,93px)]">
        <button
          aria-label={t('common.back')}
          className="-ml-2 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" src={backIcon} />
        </button>
        <p className="m-0 mt-[clamp(4px,2.25dvh,19px)] shrink-0 text-center text-[15px] leading-[1.4]">
          {t('my.documents.capturePrompt')
            .split('\n')
            .map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
        </p>
        <div className="mx-auto mt-[clamp(8px,5.25dvh,44px)] aspect-[227/290] min-h-0 max-h-[290px] w-auto max-w-full flex-1 rounded-[10px] border border-[#F5F5F5]" />
        <section
          aria-label={t('my.captureGuide')}
          className="mt-[clamp(8px,5.7dvh,48px)] grid shrink-0 grid-cols-3"
        >
          <div className="flex flex-col items-center">
            <img alt="" className="h-10 w-10" src={cornersIcon} />
            <p className="m-0 mt-[22px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
              {t('my.documents.corners')
                .split('\n')
                .map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img alt="" className="h-[46px] w-[46px]" src={scanIcon} />
            <p className="m-0 mt-[16px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
              {t('my.documents.clearText')
                .split('\n')
                .map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
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
        {errorMessage && (
          <p
            role="alert"
            className="m-0 mt-1 shrink-0 text-center text-sm text-[#FFB4B4]"
          >
            {errorMessage}
          </p>
        )}
        <DocumentCaptureActions
          accept={
            captureFile
              ? 'application/pdf,image/jpeg,image/png'
              : 'application/pdf,image/*'
          }
          captureFile={captureFile}
          isFileUploadDisabled={isUploading}
          isTakePhotoDisabled={isUploading}
          className="mt-[clamp(8px,4dvh,34px)] shrink-0"
          onFileUpload={onFileUpload ?? onCapture}
          onTakePhoto={onCapture}
        />
      </div>
    </main>
  );
}
