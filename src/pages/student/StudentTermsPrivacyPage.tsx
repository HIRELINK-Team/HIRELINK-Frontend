import backIcon from '../../assets/icons/student/terms-privacy-back.svg';
import chevronIcon from '../../assets/icons/student/terms-privacy-chevron.svg';
import accountIcon from '../../assets/images/student/terms-privacy/account.png';
import locationIcon from '../../assets/images/student/terms-privacy/location.png';
import marketingIcon from '../../assets/images/student/terms-privacy/marketing.png';
import noticeImage from '../../assets/images/student/terms-privacy/notice.png';
import privacyIcon from '../../assets/images/student/terms-privacy/privacy.png';
import termsIcon from '../../assets/images/student/terms-privacy/terms.png';
import thirdPartyIcon from '../../assets/images/student/terms-privacy/third-party.png';
import withdrawalIcon from '../../assets/images/student/terms-privacy/withdrawal.png';

type TermsItemId =
  | 'account'
  | 'location'
  | 'marketing'
  | 'privacy'
  | 'terms'
  | 'third-party'
  | 'withdrawal';

type TermsItem = {
  iconHeight: number;
  iconImage: string;
  iconLeft: number;
  iconWidth: number;
  id: TermsItemId;
  title: string;
};

const TERMS_ITEMS: readonly TermsItem[] = [
  {
    id: 'terms',
    title: '이용약관',
    iconImage: termsIcon,
    iconLeft: 19,
    iconWidth: 41,
    iconHeight: 41,
  },
  {
    id: 'privacy',
    title: '개인정보 처리방침',
    iconImage: privacyIcon,
    iconLeft: 19,
    iconWidth: 41,
    iconHeight: 41,
  },
  {
    id: 'location',
    title: '위치기반 서비스 이용약관',
    iconImage: locationIcon,
    iconLeft: 19,
    iconWidth: 41,
    iconHeight: 40.842,
  },
  {
    id: 'marketing',
    title: '마케팅 정보 수신 동의',
    iconImage: marketingIcon,
    iconLeft: 24,
    iconWidth: 31.12,
    iconHeight: 31,
  },
  {
    id: 'third-party',
    title: '제3자 제공 동의',
    iconImage: thirdPartyIcon,
    iconLeft: 24,
    iconWidth: 31.12,
    iconHeight: 31,
  },
];

const ACCOUNT_ITEMS: readonly TermsItem[] = [
  {
    id: 'account',
    title: '계정 관리',
    iconImage: accountIcon,
    iconLeft: 23,
    iconWidth: 34,
    iconHeight: 33.869,
  },
  {
    id: 'withdrawal',
    title: '회원 탈퇴',
    iconImage: withdrawalIcon,
    iconLeft: 23,
    iconWidth: 34,
    iconHeight: 34,
  },
];

function TermsRows({
  items,
  onItemClick,
}: {
  items: readonly TermsItem[];
  onItemClick?: (itemId: TermsItemId) => void;
}) {
  return (
    <section className="-mx-6 border-y border-[#E5E8EB]">
      {items.map((item) => (
        <button
          className="relative block h-[66px] w-full border-0 border-b border-[#E5E8EB] bg-transparent p-0 text-left last:border-b-0"
          key={item.id}
          type="button"
          onClick={() => onItemClick?.(item.id)}
        >
          <img
            alt=""
            className="absolute top-1/2 -translate-y-1/2 object-cover"
            src={item.iconImage}
            style={{
              height: item.iconHeight,
              left: item.iconLeft,
              width: item.iconWidth,
            }}
          />
          <span className="absolute top-[19px] left-[74px] text-[15px] leading-[1.5] font-bold">
            {item.title}
          </span>
          <img
            alt=""
            className="absolute top-[19px] left-[340px] size-[26px] rotate-180"
            src={chevronIcon}
          />
        </button>
      ))}
    </section>
  );
}

type StudentTermsPrivacyPageProps = {
  onBack: () => void;
  onTermsItemClick?: (itemId: TermsItemId) => void;
};

export default function StudentTermsPrivacyPage({
  onBack,
  onTermsItemClick,
}: StudentTermsPrivacyPageProps) {
  return (
    <main className="mx-auto h-[1053px] w-full max-w-[390px] bg-[#F5F5F5] pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="px-6">
        <button
          aria-label="뒤로가기"
          className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>

        <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
          약관 및 개인정보
        </h1>

        <section className="relative mt-3 h-[82px] overflow-hidden rounded-[20px] bg-[#E5E8EB] pl-24 pr-[26px]">
          <img
            alt=""
            className="absolute top-[13px] left-[23px] h-[55.475px] w-[55.475px] object-cover"
            src={noticeImage}
          />
          <p className="m-0 pt-[18px] text-[15px] leading-[1.5] font-bold">
            회원님의 소중한 정보,
            <br />
            안전하게 보호하고 있어요!
          </p>
        </section>

        <p className="m-0 mt-[6px] text-[12px] leading-[1.5] text-[#8B95A1]">
          Hirelink 는 관련 법령에 따라 개인정보를 안전하게 관리하고 있어요.
        </p>

        <div className="mt-[30px]">
          <TermsRows items={TERMS_ITEMS} onItemClick={onTermsItemClick} />
        </div>

        <section className="relative mt-5 h-[118px] overflow-hidden rounded-[20px] bg-[#E5E8EB] px-[25px] pt-[18px]">
          <img
            alt=""
            className="absolute top-5 left-6 h-[19px] w-[25px] object-cover"
            src={accountIcon}
          />
          <p className="m-0 ml-[33px] text-[15px] leading-[1.5] font-bold">
            개인정보 보호 안내
          </p>
          <p className="m-0 mt-[4px] text-[12px] leading-[1.5] text-[#8B95A1]">
            회원님의 개인정보는 일자리 매칭 및 서비스 제공을
            <br />
            위해서만 사용되며, 관련 법령에 따라 안전하게 관리됩니다.
            <br />
            자세한 내용은 개인정보 처리방침을 확인해주세요.
          </p>
        </section>

        <div className="mt-[22px]">
          <TermsRows items={ACCOUNT_ITEMS} onItemClick={onTermsItemClick} />
        </div>
      </div>
    </main>
  );
}
