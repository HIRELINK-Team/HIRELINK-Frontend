import backIcon from '../../../assets/icons/student/back.svg';
import mapPinIcon from '../../../assets/icons/student/matching/detail-map-pin.svg';
import locationIcon from '../../../assets/icons/student/location.svg';
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
  100: 112,
  500: 196,
  1000: 278,
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
  const selectedRadiusIndex = radiusOptions.indexOf(radius);
  const circleSize = RADIUS_CIRCLE_SIZE_BY_METERS[radius] ?? 196;

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="absolute top-0 left-1/2 h-full w-[620px] max-w-none -translate-x-1/2 object-cover"
        src={detailMapImage}
      />
      <div className="absolute inset-0 bg-[#F5F5F5]/20" />

      <header className="absolute top-0 right-0 left-0 z-10 flex items-center gap-3 px-6 pt-[calc(28px+env(safe-area-inset-top))]">
        <button
          aria-label="희망 근무 위치 입력으로 돌아가기"
          className="grid size-10 shrink-0 place-items-center rounded-full border-0 bg-white p-0 shadow-[0_1px_4px_rgba(25,31,40,0.18)]"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>
        <span className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 text-[14px] leading-[1.5] font-medium shadow-[0_1px_4px_rgba(25,31,40,0.18)]">
          <img alt="" className="size-[14px] shrink-0" src={locationIcon} />
          <span className="truncate">{address}</span>
        </span>
      </header>

      <div className="absolute top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 rounded-full border-2 border-[#00B894] bg-[#00B894]/20 -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200"
          style={{ height: circleSize, width: circleSize }}
        />
        <span className="relative grid size-[46px] place-items-center rounded-full border-4 border-white bg-[#00B894] shadow-[0_2px_7px_rgba(25,31,40,0.32)]">
          <img
            alt=""
            className="size-[22px] brightness-0 invert"
            src={mapPinIcon}
          />
        </span>
      </div>

      <section className="absolute right-0 bottom-0 left-0 z-10 rounded-t-[28px] bg-[#F5F5F5] px-6 pt-6 pb-[calc(28px+env(safe-area-inset-bottom))] shadow-[0_-4px_18px_rgba(25,31,40,0.18)]">
        <h1 className="m-0 text-[22px] leading-[1.5] font-semibold">
          이동 가능 반경을 선택해주세요.
        </h1>
        <p className="m-0 mt-1 text-[14px] leading-[1.5] text-[#6B7684]">
          선택한 위치를 중심으로 일할 곳을 추천해드려요.
        </p>

        <input
          aria-label="이동 가능 반경"
          className="mt-7 h-1.5 w-full cursor-pointer accent-[#00B894]"
          max={radiusOptions.length - 1}
          min="0"
          step="1"
          type="range"
          value={selectedRadiusIndex < 0 ? 0 : selectedRadiusIndex}
          onChange={(event) =>
            onRadiusChange(radiusOptions[Number(event.target.value)])
          }
        />
        <div className="mt-3 flex justify-between text-[14px] leading-[1.5] text-[#6B7684]">
          {radiusOptions.map((option) => (
            <span
              className={
                option === radius ? 'font-semibold text-[#00B894]' : ''
              }
              key={option}
            >
              {option >= 1000 ? `${option / 1000}km` : `${option}m`}
            </span>
          ))}
        </div>

        {errorMessage ? (
          <p aria-live="polite" className="mt-4 text-[14px] text-[#E05260]">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="mt-6 h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
          disabled={isConfirming}
          type="button"
          onClick={onConfirm}
        >
          확인
        </button>
      </section>
    </main>
  );
}
