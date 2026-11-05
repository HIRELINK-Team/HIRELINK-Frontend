import backIcon from '../../../assets/icons/student/documents/back.svg';
import completeCheckIcon from '../../../assets/icons/student/documents/topik/complete-check.svg';
import { STUDENT_TOPIK_DETAILS } from '../../../mocks/studentDocuments';

type TopikCompleteProps = { onBack: () => void; onConfirm: () => void };

export function TopikComplete({ onBack, onConfirm }: TopikCompleteProps) {
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <img
        alt=""
        className="mx-auto mt-[90px] h-[70px] w-[70px]"
        src={completeCheckIcon}
      />
      <h1 className="m-0 mt-3 text-center text-[22px] leading-[1.5] font-semibold">
        등록이 완료되었어요!
      </h1>
      <p className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        등록된 정보를 바탕으로
        <br />
        한국어능력이 확인되었어요.
      </p>
      <section
        aria-label="등록된 TOPIK 성적증명서 정보"
        className="mt-6 space-y-2"
      >
        {STUDENT_TOPIK_DETAILS.map((detail) => (
          <div className="flex items-center gap-[15px]" key={detail.label}>
            <span className="flex h-8 w-[73px] shrink-0 items-center justify-center rounded-[20px] bg-[#E5E8EB] px-2.5 text-center text-[13px] leading-[1.5] font-medium">
              {detail.label}
            </span>
            <span className="text-[13px] leading-[1.5]">{detail.value}</span>
          </div>
        ))}
      </section>
      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}
