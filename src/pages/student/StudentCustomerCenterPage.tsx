import backIcon from '../../assets/icons/student/customer-center-back.svg';
import chevronIcon from '../../assets/icons/student/customer-center-chevron.svg';
import emergencyIcon from '../../assets/images/student/customer-center/emergency-icon.png';
import supportNoticeImage from '../../assets/images/student/customer-center/support-notice.png';

type CustomerCenterItemId = 'chat' | 'faq' | 'inquiry' | 'phone';

type CustomerCenterItem = {
  description: string;
  id: CustomerCenterItemId;
  title: string;
};

const CUSTOMER_CENTER_ITEMS: readonly CustomerCenterItem[] = [
  {
    id: 'inquiry',
    title: '1:1 문의하기',
    description: '문의 내용을 남겨주시면 답변드려요.',
  },
  {
    id: 'faq',
    title: '자주 묻는 질문 (FAQ)',
    description: '궁금해하시는 내용을 확인할 수 있어요.',
  },
  {
    id: 'phone',
    title: '전화문의',
    description: '평일 9:00 - 18:00 (주말·공휴일 휴무)',
  },
  {
    id: 'chat',
    title: '채팅상담',
    description: '실시간으로 상담이 필요하신가요?',
  },
];

type StudentCustomerCenterPageProps = {
  onBack: () => void;
  onSupportItemClick?: (itemId: CustomerCenterItemId) => void;
};

export default function StudentCustomerCenterPage({
  onBack,
  onSupportItemClick,
}: StudentCustomerCenterPageProps) {
  return (
    <main className="mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] pt-10 font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="px-6">
        <button
          aria-label="뒤로가기"
          className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>

        <h1 className="m-0 mt-2.5 text-[26px] leading-[1.5] font-semibold">
          고객센터
        </h1>

        <section className="relative mt-2 h-[74px] overflow-hidden rounded-[20px] bg-[#E5E8EB] pl-[68px] pr-4">
          <img
            alt=""
            className="absolute top-3 left-5 size-[50px] object-cover"
            src={supportNoticeImage}
          />
          <div className="flex h-full flex-col justify-center gap-1">
            <p className="m-0 text-[15px] leading-[1.5] font-bold">
              궁금한 점이 있으신가요?
            </p>
            <p className="m-0 text-[12px] leading-[1.5] text-[#8B95A1]">
              언제든지 문의주세요. 빠르게 도와드려요!
            </p>
          </div>
        </section>

        <h2 className="m-0 mt-3 text-[20px] leading-[1.5] font-semibold">
          문의 관련 서비스
        </h2>

        <section className="mt-1.5 flex flex-col gap-2">
          {CUSTOMER_CENTER_ITEMS.map((item) => (
            <button
              className="relative h-[72px] w-full rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-transparent px-5 text-left"
              key={item.id}
              type="button"
              onClick={() => onSupportItemClick?.(item.id)}
            >
              <span className="block text-[16px] leading-[1.5] font-bold">
                {item.title}
              </span>
              <span className="block pr-5 text-[13px] leading-[1.5] text-[#8B95A1]">
                {item.description}
              </span>
              <img
                alt=""
                className="absolute top-[29px] right-5 h-[14px] w-[7px] rotate-180"
                src={chevronIcon}
              />
            </button>
          ))}
        </section>

        <section className="relative mt-4 h-[82px] overflow-hidden rounded-[20px] bg-[#E5E8EB] px-5 pt-3.5">
          <img
            alt=""
            className="absolute top-4 left-5 h-[19px] w-[25px] object-cover"
            src={emergencyIcon}
          />
          <p className="m-0 ml-[31px] text-[14px] leading-[1.5] font-bold">
            긴급 문의가 필요하신가요?
          </p>
          <p className="m-0 mt-0.5 text-[11px] leading-[1.5] text-[#8B95A1]">
            계정 접근 문제, 개인정보 관련 긴급 문의는help@hirelink.kr 메일을
            보내주세요. (제목에 [긴급]을 포함해주세요.)
          </p>
        </section>

        <section className="mt-1.5 h-[76px] rounded-[20px] bg-[#E5E8EB] px-5 py-3">
          <p className="m-0 text-[14px] leading-[1.5] font-bold">운영시간</p>
          <p className="m-0 mt-0.5 text-[11px] leading-[1.5] text-[#8B95A1]">
            평일 09:00 - 18:00 (점심시간 12:00 - 13:00)
            <br />
            주말 및 공휴일은 휴무입니다.
          </p>
        </section>
      </div>
    </main>
  );
}
