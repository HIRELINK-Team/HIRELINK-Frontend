import backIcon from '../../../assets/icons/student/back.svg';

type LocationServiceTermsPageProps = {
  onBack: () => void;
};

const TERM_SECTIONS = [
  {
    title: 'Hirelink 위치기반서비스 이용약관',
    paragraphs: [],
  },
  {
    title: '제1조 (목적)',
    paragraphs: [
      '본 약관은 Hirelink 운영팀(이하 "운영팀")이 제공하는 Hirelink(이하 "서비스")의 위치기반서비스 이용과 관련하여 운영팀과 이용자 간의 권리, 의무 및 책임사항, 개인위치정보의 이용과 보호에 관한 사항을 규정함을 목적으로 합니다.',
      '본 약관은 「위치정보의 보호 및 이용 등에 관한 법률」(이하 "위치정보법") 및 관계 법령을 준수합니다.',
    ],
  },
  {
    title: '제2조 (용어의 정의)',
    paragraphs: [
      '① "위치기반서비스"란 이용자의 현재 위치를 활용하여 주변 일자리를 검색하고 추천하는 서비스를 의미합니다.',
      '② "개인위치정보"란 특정 개인의 위치를 알 수 있는 정보로서, 다른 정보와 쉽게 결합하여 특정 개인의 위치를 알 수 있는 정보를 포함합니다.',
      '③ "이용자"란 본 약관에 동의하고 Hirelink의 위치기반서비스를 이용하는 회원을 의미합니다.',
      '④ "위치정보 이용·제공사실 확인자료"란 개인위치정보의 이용 및 제공과 관련하여 그 사실을 확인하기 위해 기록하는 자료를 의미합니다.',
    ],
  },
  {
    title: '제3조 (위치기반서비스의 내용)',
    paragraphs: [
      '① 운영팀은 이용자의 현재 위치를 기준으로 다음과 같은 위치기반서비스를 제공합니다.',
    ],
    items: [
      '1. 현재 위치를 기준으로 한 주변 일자리 검색',
      '2. 현재 위치와 일자리 근무장소 간 거리 계산',
      '3. 위치를 고려한 일자리 추천 및 검색 결과 제공',
      '4. 기타 주변 일자리 검색에 직접 필요한 기능',
    ],
    trailing: [
      '② 운영팀은 이용자가 위치정보 이용에 동의하고 단말기 또는 브라우저의 위치 접근 권한을 허용한 경우에 한하여 해당 기능을 제공합니다.',
      '③ 위치정보는 이용자가 현재 위치 기반 검색 기능을 직접 실행하는 경우에 이용하며, 이용자의 동의 없이 지속적으로 위치를 추적하지 않습니다.',
      '④ 위치기반서비스에서 제공하는 거리 및 위치 정보는 GPS 신호, 단말기 설정, 통신 환경 등에 따라 실제 위치와 차이가 발생할 수 있습니다.',
      '⑤ 이용자는 위치기반서비스를 이용하지 않고도 지역을 직접 선택하여 일자리 정보를 검색할 수 있습니다.',
    ],
  },
  {
    title: '제4조 (서비스 이용요금)',
    paragraphs: [
      '① Hirelink의 위치기반서비스는 무료로 제공됩니다.',
      '② 운영팀은 위치기반서비스 이용을 이유로 별도의 이용요금을 청구하지 않습니다.',
      '③ 다만 이동통신망 이용에 따른 데이터 통신 요금 등은 이용자가 가입한 통신사의 요금제에 따라 발생할 수 있습니다.',
    ],
  },
  {
    title: '제5조 (개인위치정보의 수집 및 이용)',
    paragraphs: [
      '① 운영팀은 이용자의 사전 동의에 따라 위치기반서비스 제공에 필요한 개인위치정보를 처리합니다.',
      '② 수집·이용하는 위치정보의 항목은 다음과 같습니다.',
    ],
    items: ['• 이용자 단말기에서 확인한 현재 위치의 위도 및 경도 좌표'],
    trailing: [
      '③ 위치정보는 이용자가 브라우저 또는 단말기의 위치 접근 권한을 허용한 후, 현재 위치 기반 일자리 검색 기능을 실행할 때 확인됩니다.',
      '④ 확인된 위도 및 경도 좌표는 주변 일자리 검색을 위해 Hirelink 서버로 전송되어 이용됩니다.',
      '⑤ 운영팀은 수집한 위치정보를 현재 위치 확인, 근무장소 간 거리 계산, 주변 일자리 검색 및 추천 결과 제공 목적으로만 이용합니다.',
      '⑥ 운영팀은 위 목적과 무관한 광고, 마케팅 또는 이용자의 이동 경로 추적을 위해 개인위치정보를 이용하지 않습니다.',
    ],
  },
] as const;

/** Location-agreement detail shown from the student onboarding consent sheet. */
export function LocationServiceTermsPage({
  onBack,
}: LocationServiceTermsPageProps) {
  return (
    <main className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] px-6 pt-[65px] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]">
      <button
        aria-label="이전 화면으로 이동"
        className="absolute top-[65px] left-5 flex size-6 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>
      <h1 className="mt-[47px] text-[26px] leading-[1.5] font-semibold">
        위치기반 서비스 이용약관
      </h1>
      <section className="mt-6 h-[min(562px,calc(100dvh-282px))] overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TERM_SECTIONS.map((section, index) => (
          <article className={index === 0 ? '' : 'pt-4'} key={section.title}>
            <h2
              className={
                index === 0
                  ? 'm-0 text-[20px] leading-[1.5] font-semibold'
                  : 'm-0 text-[17px] leading-[1.5] font-medium'
              }
            >
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                className="mt-2 mb-0 text-[15px] leading-[1.5] text-[#55595B]"
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
            {'items' in section ? (
              <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-4 py-3 text-[13px] leading-[1.5] text-[#707577]">
                {section.items.map((item) => (
                  <p className="m-0" key={item}>
                    {item}
                  </p>
                ))}
              </div>
            ) : null}
            {'trailing' in section
              ? section.trailing.map((paragraph) => (
                  <p
                    className="mt-2 mb-0 text-[15px] leading-[1.5] text-[#55595B]"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))
              : null}
          </article>
        ))}
      </section>
      <button
        className="absolute right-6 bottom-[calc(37px+env(safe-area-inset-bottom))] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onBack}
      >
        확인
      </button>
    </main>
  );
}
