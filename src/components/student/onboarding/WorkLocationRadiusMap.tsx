import backIcon from '../../../assets/icons/student/back.svg';
import { useTranslation } from 'react-i18next';
import detailMapImage from '../../../assets/images/student/matching/detail-map.png';
import type { WorkLocationRadius } from '../../../types/workLocation';

type WorkLocationRadiusMapProps = {
  address: string;
  errorMessage?: string;
  isConfirming?: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onRadiusChange: (radius: WorkLocationRadius) => void;
  radius: WorkLocationRadius;
  radiusOptions: readonly WorkLocationRadius[];
};

const RADIUS_CIRCLE_SIZE_BY_METERS: Record<number, number> = {
  100: 276,
  500: 196,
  1000: 276,
};

const RADIUS_SLIDER_POSITION_BY_METERS: Record<number, number> = {
  100: 17,
  500: 50,
  1000: 100,
};

export function WorkLocationRadiusMap({
  address,
  errorMessage,
  isConfirming = false,
  onBack,
  onConfirm,
  onRadiusChange,
  radius,
  radiusOptions,
}: WorkLocationRadiusMapProps) {
  const { t } = useTranslation();
  const selectedRadiusIndex = radiusOptions.indexOf(radius);
  const circleSize = RADIUS_CIRCLE_SIZE_BY_METERS[radius] ?? 196;
  const sliderPosition = RADIUS_SLIDER_POSITION_BY_METERS[radius] ?? 50;

  return (
    <main className="relative mx-auto h-[100dvh] min-h-0 w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="absolute top-0 left-[-22.56%] h-[103.55%] w-[142.82%] max-w-none object-cover"
        src={detailMapImage}
      />
      <header className="absolute top-0 right-0 left-0 z-10 h-[241px] overflow-hidden rounded-b-[20px] bg-[#F5F5F5] shadow-[2px_2px_5px_rgba(0,0,0,0.14)]">
        <button
          aria-label={t('my.experience.radiusBack')}
          className="absolute top-[60px] left-[13px] grid size-[34px] place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>

        <span className="absolute top-[57px] left-[15.64%] flex h-[41px] w-[43.33%] items-center gap-[5px] rounded-[50px] bg-[#E6E8E9] px-5 text-[15px] leading-[1.5] text-[#1D1F28]">
          <svg
            aria-hidden="true"
            className="size-[18px] shrink-0"
            fill="none"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1.5C5.69175 1.5 3 4.19175 3 7.49625C2.97825 12.33 8.772 16.338 9 16.5C9 16.5 15.02175 12.33 15 7.5C15 4.19175 12.30825 1.5 9 1.5ZM9 10.5C7.3425 10.5 6 9.1575 6 7.5C6 5.8425 7.3425 4.5 9 4.5C10.6575 4.5 12 5.8425 12 7.5C12 9.1575 10.6575 10.5 9 10.5Z"
              fill="#1D1F20"
            />
          </svg>
          <span className="truncate">{address}</span>
        </span>

        <section className="absolute top-[125px] right-[6.41%] left-[5.9%]">
          <h1 className="m-0 text-[17px] leading-[1.5] font-medium">
            {t('my.experience.selectRadius')}
          </h1>
          <div className="relative mt-[25px] h-[19px] w-full">
            <span
              aria-hidden="true"
              className="absolute top-[9px] right-0 left-0 h-[3px] bg-[#D3D6D7]"
            />
            <span
              aria-hidden="true"
              className="absolute top-[9px] left-0 h-[3px] bg-[#00B894]"
              style={{ width: `${sliderPosition}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute top-0 size-[19px] rounded-full border border-[#B0B8C1] bg-[#F5F5F5] shadow-[0_1px_2px_rgba(0,0,0,0.16)]"
              style={{ left: `calc(${sliderPosition}% - 9.5px)` }}
            />
            <input
              aria-label={t('my.experience.radius')}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              max={radiusOptions.length - 1}
              min="0"
              step="1"
              type="range"
              value={selectedRadiusIndex < 0 ? 0 : selectedRadiusIndex}
              onChange={(event) =>
                onRadiusChange(radiusOptions[Number(event.target.value)])
              }
            />
          </div>
          <div className="mt-[2px] flex justify-between text-[15px] leading-[1.5] font-medium text-[#909597]">
            {radiusOptions.map((option) => (
              <span key={option}>
                {option >= 1000 ? `${option / 1000}km` : `${option}m`}
              </span>
            ))}
          </div>
        </section>
      </header>

      <div className="absolute top-[58.18%] left-[44.36%] -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 rounded-full border-2 border-[#00B894] bg-[#00B894]/20 -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200"
          style={{ height: circleSize, width: circleSize }}
        />
      </div>

      {errorMessage ? (
        <p aria-live="polite" className="absolute right-6 bottom-[106px] left-6 z-10 m-0 text-[14px] text-[#E05260]">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="absolute right-6 bottom-[calc(37px+env(safe-area-inset-bottom))] left-6 z-10 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] shadow-[2px_2px_5px_rgba(0,0,0,0.14)] active:bg-[#009376]"
        disabled={isConfirming}
        type="button"
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </button>
    </main>
  );
}
