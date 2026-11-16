import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import { STUDENT_ALIEN_REGISTRATION_GUIDE_ITEMS } from '../../../mocks/studentDocuments';

type AlienRegistrationInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

export function AlienRegistrationInformation({
  onBack,
  onRegister,
}: AlienRegistrationInformationProps) {
  return (
    <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="absolute top-[61px] left-[18px] grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <div className="absolute top-[102px] left-6">
        <p className="m-0 text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          1/6
        </p>
        <p className="m-0 text-[15px] leading-[1.5] text-[#8B95A1]">신원 확인</p>
      </div>

      <div
        aria-label="온보딩 진행 단계"
        className="absolute top-[162px] left-6 flex w-[342px] gap-[5px]"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <span
            className={`h-0.5 flex-1 ${index === 0 ? 'bg-[#00B894]' : 'bg-[#B0B8C1]'}`}
            key={index}
          />
        ))}
      </div>

      <h1 className="absolute top-[210px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        외국인 등록증
        <br />
        앞면을 촬영해주세요.
      </h1>
      <p className="absolute top-[299px] left-6 m-0 text-[15px] leading-[1.5] text-[#939393]">
        이름과 체류자격을 확인해요.
      </p>

      <section
        aria-label="외국인등록증 확인 항목"
        className="absolute top-[360px] left-6 w-[342px] space-y-[9px]"
      >
        {STUDENT_ALIEN_REGISTRATION_GUIDE_ITEMS.map((item) => (
          <article
            className="flex h-[65px] items-center rounded-[20px] bg-[#E5E8EB] px-[25px]"
            key={item.title}
          >
            <img
              alt=""
              className="h-[47px] w-[47px] shrink-0 object-contain"
              src={item.icon}
            />
            <p className="m-0 ml-[24px] text-[15px] leading-[1.5] font-medium">
              {item.title}
            </p>
          </article>
        ))}
      </section>

      <button
        className="absolute top-[750px] left-6 h-[57px] w-[342px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        확인
      </button>
    </main>
  );
}
