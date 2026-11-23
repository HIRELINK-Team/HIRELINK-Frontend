import warningIcon from '../../../assets/icons/student/documents/alien-registration/verification-warning.svg';

type AlienRegistrationValidationModalProps = {
  onUploadPdf?: () => void;
  expirationDate?: string;
  type: 'expired' | 'invalid';
  onRetry: () => void;
};

export function AlienRegistrationValidationModal({
  onUploadPdf,
  expirationDate = '2026.08.31',
  type,
  onRetry,
}: AlienRegistrationValidationModalProps) {
  const isExpired = type === 'expired';

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-6"
      role="dialog"
      aria-modal="true"
    >
      <section
        className={`w-full max-w-[313px] rounded-[20px] bg-[#F5F5F5] px-[19px] text-center ${isExpired ? 'py-[42px]' : 'py-6'}`}
      >
        <img alt="" className="mx-auto size-[38px]" src={warningIcon} />
        <h2 className="mt-6 whitespace-pre-line text-[20px] leading-[1.5] font-semibold text-[#1D1F20]">
          {isExpired
            ? '만료일을 다시 확인해주세요.'
            : '유효하지 않은\n외국인 등록증입니다'}
        </h2>
        {isExpired ? (
          <p className="mt-2 text-[15px] leading-[1.5] text-[#909597]">
            카드에 적힌 만료일
            <br />
            {expirationDate}이 지났어요.
            <br />
            온라인으로 연장하셨나요?
          </p>
        ) : null}
        {isExpired ? (
          <button
            className="mt-6 h-[46px] w-full rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
            type="button"
            onClick={onUploadPdf}
          >
            PDF로 인증하기
          </button>
        ) : null}
        <button
          className={`h-[46px] w-full rounded-[15px] border-0 bg-[#B8EBDD] text-[17px] leading-[1.5] font-medium text-[#006E59] ${isExpired ? 'mt-2' : 'mt-6 bg-[#00B894] text-[#F5F5F5]'}`}
          type="button"
          onClick={onRetry}
        >
          {isExpired ? '다시 촬영' : '다시 업로드 하기'}
        </button>
      </section>
    </div>
  );
}
