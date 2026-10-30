import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import registrationIllustration from '../../../assets/images/student/documents/alien-registration/registration-illustration.png';
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
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
        외국인등록증 등록
      </h1>

      <img
        alt=""
        className="mx-auto mt-[45px] h-[81px] w-[83px] object-contain"
        src={registrationIllustration}
      />
      <h2 className="m-0 mt-[9px] text-center text-[22px] leading-[1.5] font-semibold">
        외국인 등록증을
        <br />
        등록해주세요.
      </h2>
      <p className="m-0 mt-[8px] text-center text-[15px] leading-[1.5] text-[#8B95A1]">
        본인 확인과 체류자격, 체류기간을
        <br />
        확인하기 위해 필요해요.
      </p>

      <section
        aria-label="외국인등록증 확인 항목"
        className="mt-[40px] space-y-[9px]"
      >
        {STUDENT_ALIEN_REGISTRATION_GUIDE_ITEMS.map((item) => (
          <article
            className="flex h-[65px] items-center rounded-[20px] bg-[#E5E8EB] px-[25px]"
            key={item.title}
          >
            <img
              alt=""
              className="h-[47px] w-[48px] shrink-0 object-contain"
              src={item.icon}
            />
            <p className="m-0 ml-[23px] text-[15px] leading-[1.5] font-medium">
              {item.title}
            </p>
          </article>
        ))}
      </section>

      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        등록하기
      </button>
    </main>
  );
}
