import { useState } from 'react';

import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';

export type ResidencePeriodMethod = 'cardBack' | 'onlineExtension';

type AlienRegistrationResidencePeriodProps = {
  onBack: () => void;
  onConfirm: (method: ResidencePeriodMethod) => void;
};

const OPTIONS: ReadonlyArray<{
  description: string;
  id: ResidencePeriodMethod;
  title: string;
}> = [
  {
    id: 'cardBack',
    title: 'A. 카드 뒷면에 최신 날짜가 있어요.',
    description: '뒷면을 촬영해 인증해요.',
  },
  {
    id: 'onlineExtension',
    title: 'B. 온라인으로 연장했어요.',
    description: '최신 전자문서 PDF로 인증해요.',
  },
];

export function AlienRegistrationResidencePeriod({
  onBack,
  onConfirm,
}: AlienRegistrationResidencePeriodProps) {
  const [method, setMethod] = useState<ResidencePeriodMethod | null>(null);

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

      <div className="mt-9">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">1/6</strong>
        <span className="block text-[15px] leading-[1.5] text-[#909597]">정보 확인</span>
      </div>
      <div aria-hidden="true" className="mt-[11px] grid grid-cols-6 gap-[5px]">
        {Array.from({ length: 6 }, (_, index) => (
          <span className={index === 0 ? 'h-0.5 bg-[#00B894]' : 'h-0.5 bg-[#B0B8C1]'} key={index} />
        ))}
      </div>

      <section className="mt-[39px]">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          체류기간 만료일을
          <br />
          어떻게 확인할까요?
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          최근 온라인으로 체류기간을 연장하셨나요?
        </p>

        <div className="mt-[42px] space-y-[10px]">
          {OPTIONS.map((option) => {
            const isSelected = method === option.id;

            return (
              <button
                aria-pressed={isSelected}
                className={`min-h-[89px] w-full rounded-[20px] px-[22px] py-4 text-left ${
                  isSelected
                    ? 'border-[1.5px] border-[#00B894] bg-[#E5F8F3]'
                    : 'border-[0.7px] border-[#B3B8B9] bg-transparent'
                }`}
                key={option.id}
                type="button"
                onClick={() => setMethod(option.id)}
              >
                <strong className="block text-[17px] leading-[1.5] font-semibold">
                  {option.title}
                </strong>
                <span className="mt-0.5 block text-[13px] leading-[1.5] text-[#909597]">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-auto pt-10">
        <button
          className="min-h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5] disabled:bg-[#B0B8C1]"
          disabled={!method}
          type="button"
          onClick={() => {
            if (method) onConfirm(method);
          }}
        >
          확인
        </button>
      </div>
    </main>
  );
}
