import backIcon from '../../../assets/icons/student/documents/back.svg';
import { useTranslation } from 'react-i18next';

type ReviewField = {
  label: string;
  value: string;
};

type DocumentRecognitionReviewProps = {
  documentTitle: string;
  fields: readonly ReviewField[];
  scanIcon: string;
  onBack: () => void;
  onRetry: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
  errorMessage?: string | null;
};

export function DocumentRecognitionReview({
  documentTitle,
  fields,
  scanIcon,
  onBack,
  onRetry,
  onConfirm,
  isConfirming = false,
  errorMessage,
}: DocumentRecognitionReviewProps) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(12px,7.23dvh,61px)] pb-[clamp(12px,4.38dvh,37px)] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label={t('common.back')}
        className="-ml-2 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        disabled={isConfirming}
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="m-0 mt-[clamp(8px,calc(31.7dvh-150px),117px)] shrink-0 text-[26px] leading-[1.5] font-semibold">
        {t('my.documents.reviewTitle')
          .split('\n')
          .map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
      </h1>
      <p className="m-0 mt-[clamp(2px,0.85dvh,7px)] shrink-0 text-[15px] leading-[1.5] text-[#8B95A1]">
        {t('my.documents.reviewDescription')}
      </p>
      <section className="mt-[clamp(8px,2.4dvh,20px)] flex min-h-0 shrink flex-col overflow-hidden rounded-[20px] bg-white">
        <div className="flex h-[clamp(40px,7.7dvh,65px)] shrink-0 items-center gap-3 bg-[#00B894]/10 px-6 text-[#006E59]">
          <img alt="" className="h-7 w-7" src={scanIcon} />
          <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
            {documentTitle}
          </h2>
        </div>
        <dl
          className={`m-0 flex min-h-0 flex-col overflow-y-auto px-6 ${
            fields.length > 2
              ? 'gap-[clamp(4px,1.42dvh,12px)] py-[clamp(6px,1.9dvh,16px)]'
              : fields.length > 1
                ? 'gap-[clamp(4px,1.42dvh,12px)] py-[clamp(6px,1.9dvh,16px)]'
                : 'py-[clamp(6px,2.3dvh,19px)]'
          }`}
        >
          {fields.map((field) => (
            <div
              className="grid grid-cols-[100px_1fr] items-center"
              key={field.label}
            >
              <dt className="text-[15px] leading-[1.5] text-[#909597]">
                {field.label}
              </dt>
              <dd className="m-0 break-all text-[15px] leading-[1.5] text-[#1D1F20]">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      {errorMessage && (
        <p
          role="alert"
          className="m-0 mt-2 shrink-0 text-center text-sm text-[#D33]"
        >
          {errorMessage}
        </p>
      )}
      <div className="mt-auto flex shrink-0 gap-3 pt-[clamp(8px,1.4dvh,12px)]">
        <button
          className="h-[57px] flex-1 rounded-[15px] border-0 bg-[#CCF1EA] p-0 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          disabled={isConfirming}
          onClick={onRetry}
        >
          {t('my.documents.retake')}
        </button>
        <button
          className="h-[57px] flex-1 rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {t('common.confirm')}
        </button>
      </div>
    </main>
  );
}
