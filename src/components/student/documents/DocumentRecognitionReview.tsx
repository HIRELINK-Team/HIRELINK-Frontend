import backIcon from '../../../assets/icons/student/documents/back.svg';

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
};

export function DocumentRecognitionReview({
  documentTitle,
  fields,
  scanIcon,
  onBack,
  onRetry,
  onConfirm,
}: DocumentRecognitionReviewProps) {
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="absolute top-[61px] left-4 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="absolute top-[210px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        인식된 정보를
        <br />
        확인해주세요.
      </h1>
      <p className="absolute top-[299px] left-6 m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
        정보가 다르면 다시 촬영해주세요.
      </p>
      <section className="absolute top-[342px] right-6 left-6 overflow-hidden rounded-[20px] bg-white">
        <div className="flex h-[65px] items-center gap-3 bg-[#00B894]/10 px-6 text-[#006E59]">
          <img alt="" className="h-7 w-7" src={scanIcon} />
          <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
            {documentTitle}
          </h2>
        </div>
        <dl
          className={`m-0 flex flex-col justify-center px-6 ${
            fields.length > 1 ? 'min-h-[100px] gap-3' : 'min-h-[62px]'
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
              <dd className="m-0 text-[15px] leading-[1.5] text-[#1D1F20]">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="absolute right-6 bottom-[37px] left-6 flex gap-3">
        <button
          className="h-[57px] flex-1 rounded-[15px] border-0 bg-[#CCF1EA] p-0 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          onClick={onRetry}
        >
          다시 촬영
        </button>
        <button
          className="h-[57px] flex-1 rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </main>
  );
}
