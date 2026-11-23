import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

type DocumentCaptureActionsProps = {
  accept: string;
  className?: string;
  isTakePhotoDisabled?: boolean;
  isFileUploadDisabled?: boolean;
  captureFile?: boolean;
  onFileUpload: (file: File) => void;
  onTakePhoto: () => void;
};

const ACTION_TYPOGRAPHY =
  "text-[19px] leading-[1.5] font-normal [font-family:'Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif]";

const ACTION_LABEL = `block ${ACTION_TYPOGRAPHY}`;

export function DocumentCaptureActions({
  accept,
  className = '',
  isTakePhotoDisabled = false,
  isFileUploadDisabled = false,
  captureFile = false,
  onFileUpload,
  onTakePhoto,
}: DocumentCaptureActionsProps) {
  const { t } = useTranslation();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={`grid grid-cols-[165fr_169fr] gap-[7px] ${className}`.trim()}
    >
      <label className="flex h-[57px] cursor-pointer items-center justify-center rounded-[15px] bg-white/15 text-[#F5F5F5]">
        <span className={ACTION_LABEL}>{t('my.documents.upload')}</span>
        <input
          accept={accept}
          disabled={isFileUploadDisabled}
          className="sr-only"
          type="file"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) onFileUpload(file);
          }}
        />
      </label>
      <button
        className="h-[58px] rounded-[15px] border-0 bg-[#F5F5F5] p-0 text-[#1D1F20] [font:inherit]"
        disabled={isTakePhotoDisabled}
        type="button"
        onClick={
          captureFile ? () => cameraInputRef.current?.click() : onTakePhoto
        }
      >
        <span className={ACTION_LABEL}>{t('my.documents.camera')}</span>
      </button>
      {captureFile && (
        <input
          ref={cameraInputRef}
          accept="image/jpeg,image/png"
          capture="environment"
          className="sr-only"
          type="file"
          disabled={isTakePhotoDisabled}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) onFileUpload(file);
          }}
        />
      )}
    </div>
  );
}
