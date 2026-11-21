import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import scanIcon from '../../../assets/icons/student/documents/alien-registration/review-scan.svg';
import type { AlienRegistrationFormValues } from './AlienRegistrationEdit';

type AlienRegistrationFrontInfoProps = {
  onBack: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  values: AlienRegistrationFormValues;
};

const FRONT_INFORMATION_FIELDS: ReadonlyArray<
  readonly [string, keyof Pick<
    AlienRegistrationFormValues,
    'name' | 'nationality' | 'residenceQualification' | 'registrationNumber' | 'issueDate'
  >]
> = [
  ['이름', 'name'],
  ['국적', 'nationality'],
  ['체류자격', 'residenceQualification'],
  ['등록번호', 'registrationNumber'],
  ['발급일자', 'issueDate'],
];

function InformationProgress() {
  return (
    <>
      <div className="mt-9">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          1/6
        </strong>
        <span className="block text-[15px] leading-[1.5] text-[#909597]">
          정보 확인
        </span>
      </div>
      <div aria-hidden="true" className="mt-[11px] grid grid-cols-2 gap-[5px]">
        {Array.from({ length: 2 }, (_, index) => (
          <span className={index === 0 ? 'h-0.5 bg-[#00B894]' : 'h-0.5 bg-[#B0B8C1]'} key={index} />
        ))}
      </div>
    </>
  );
}

export function AlienRegistrationFrontInfo({
  onBack,
  onConfirm,
  onRetry,
  values,
}: AlienRegistrationFrontInfoProps) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-y-auto bg-[#F5F5F5] px-6 pt-[calc(61px+env(safe-area-inset-top))] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        aria-label="이전 단계로 이동"
        className="-ml-1 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <InformationProgress />

      <section className="mt-[39px]">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          인식된 정보를
          <br />
          확인해주세요.
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          정보가 다르면 다시 촬영해주세요.
        </p>

        <section
          aria-label="인식된 외국인등록증 앞면 정보"
          className="mt-[28px] overflow-hidden rounded-[20px] bg-white/10"
        >
          <div className="flex items-center gap-[9px] rounded-t-[20px] bg-[#B8EBDD]/65 px-[33px] py-[18px]">
            <img alt="" className="size-7" src={scanIcon} />
            <strong className="text-[20px] leading-[1.5] font-semibold text-[#006E59]">
              외국인등록증
            </strong>
          </div>
          <dl className="grid gap-2 px-[33px] py-[17px]">
            {FRONT_INFORMATION_FIELDS.map(([label, field]) => (
              <div className="grid min-h-6 grid-cols-[69px_minmax(0,1fr)] items-center gap-6" key={field}>
                <dt className="text-[13px] leading-[1.5] text-[#909597]">{label}</dt>
                <dd className="m-0 min-w-0 truncate text-[13px] leading-[1.5] font-medium text-[#1D1F20]">
                  {values[field]}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </section>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-10">
        <button
          className="min-h-[57px] rounded-[15px] border-0 bg-[#B8EBDD] px-3 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          onClick={onRetry}
        >
          다시 촬영
        </button>
        <button
          className="min-h-[57px] rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </main>
  );
}
