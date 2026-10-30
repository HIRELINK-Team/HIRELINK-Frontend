import backIcon from '../../assets/icons/student/documents/back.svg';
import workConditionSummaryImage from '../../assets/images/student/my/work-condition-summary.png';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';

type StudentWorkConditionPageProps = {
  onBack?: () => void;
};

const ELIGIBLE_FIELDS = [
  { label: '음식점·카페 보조', status: 'approved' },
  { label: '통역·번역 보조', status: 'approved' },
  { label: '매장·판매 보조', status: 'approved' },
  { label: '제조업 (별도 심사 필요)', status: 'review' },
  { label: '배달대행', status: 'restricted' },
] as const;

export default function StudentWorkConditionPage({
  onBack,
}: StudentWorkConditionPageProps) {
  return (
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] px-6 pt-[61px] pb-[98px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        나의 근무 가능 조건
      </h1>

      <section className="relative mt-[17px] h-[82px] overflow-hidden rounded-[20px] bg-[#E5E8EB]">
        <img
          alt=""
          className="absolute top-[7px] left-[18px] h-[68px] w-[69px] object-contain"
          src={workConditionSummaryImage}
        />
        <p className="absolute top-[18px] left-24 m-0 text-[15px] leading-[1.5] font-bold">
          등록한 정보를 기준으로
          <br />
          현재 근무 조건을 확인했어요.
        </p>
      </section>
      <p className="m-0 mt-[6px] text-[12px] leading-[1.5] text-[#8B95A1]">
        실제 허가 여부는 출입국 심사 결과에 따라 달라질 수 있어요.
      </p>

      <section className="mt-[28px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px]">
        <CardHeader title="기본 정보" />
        <InfoRow label="체류자격" value="D-2-2 (학사)" />
        <InfoRow label="학적상태" value="재학 중" />
        <InfoRow label="한국어 능력" value="TOPIK 4급 (기준 충족)" />
      </section>

      <section className="mt-[10px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px] pb-[17px]">
        <CardHeader title="근무시간 기준 (예상)" />
        <InfoRow label="학기 중" value="주중 최대 25시간 기준" />
        <InfoRow label="방학 중" value="별도 기준 적용 가능" />
        <InfoRow label="주말·공휴일" value="별도 기준 적용 가능" />
        <p className="m-0 mt-[10px] text-[12px] leading-[1.5] text-[#8B95A1]">
          *실제 허용 시간은 출입국의 허가 결과를 확인해야 합니다.
        </p>
      </section>

      <section className="mt-[10px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px] pb-5">
        <CardHeader title="지원 가능 분야" />
        <ul className="m-0 mt-[12px] space-y-[7px] p-0">
          {ELIGIBLE_FIELDS.map((field) => (
            <li
              className="flex items-center gap-4 text-[13px] leading-[1.5]"
              key={field.label}
            >
              <span
                aria-hidden="true"
                className={`grid size-[16px] place-items-center rounded-full text-[11px] font-bold text-white ${
                  field.status === 'approved'
                    ? 'bg-[#20C997]'
                    : field.status === 'review'
                      ? 'bg-[#F4B740]'
                      : 'bg-[#FF5A5F]'
                }`}
              >
                {field.status === 'approved'
                  ? '✓'
                  : field.status === 'review'
                    ? '!'
                    : '×'}
              </span>
              {field.label}
            </li>
          ))}
        </ul>
      </section>

      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="my"
        bottomOffsetClassName="bottom-[23px]"
      />
    </main>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="m-0 text-[15px] leading-[1.5] font-bold">{title}</h2>
      <button
        className="h-[27px] rounded-[30px] border border-[#B0B8C1] px-[13px] text-[13px] leading-[1.5] text-[#4E5968]"
        type="button"
      >
        수정하기
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[4px] grid grid-cols-[69px_1fr] text-[13px] leading-[1.5]">
      <span className="text-[#8B95A1]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
