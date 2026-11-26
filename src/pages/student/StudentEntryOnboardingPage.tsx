import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import backIcon from '../../assets/icons/student/terms-privacy-back.svg';
import socialLoginIllustration from '../../assets/images/student/entry/figma-social-background.png';
import googleIcon from '../../assets/images/student/entry/figma-social-google.png';
import kakaoIcon from '../../assets/images/student/entry/figma-social-kakao.png';
import socialLoginSymbol from '../../assets/images/student/entry/figma-social-symbol.png';
import socialLoginWordmark from '../../assets/images/student/entry/figma-social-wordmark.png';
import hirelinkWordmark from '../../assets/images/student/entry/hirelink-wordmark.svg';
import languageEnglishFlag from '../../assets/images/student/entry/language-english.png';
import languageKoreanFlag from '../../assets/images/student/entry/language-korean.png';
import { EmployerEntryNotice } from '../../components/student/onboarding/EmployerEntryNotice';

type EntryStep = 'start' | 'language' | 'socialLogin';
type Language = 'en' | 'ko';

type StudentEntryOnboardingPageProps = {
  onEmailLogin?: () => void;
  onStart?: () => void;
};

/** Renders the Student onboarding entry, language selection, and social login flow. */
export default function StudentEntryOnboardingPage({
  onEmailLogin,
  onStart,
}: StudentEntryOnboardingPageProps) {
  const { i18n, t } = useTranslation();
  const [entryStep, setEntryStep] = useState<EntryStep>('start');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    i18n.resolvedLanguage === 'en' ? 'en' : 'ko',
  );
  const [isEmployerNoticeOpen, setIsEmployerNoticeOpen] = useState(false);

  const handleStart = () => {
    setEntryStep('language');
  };

  const handleLanguageConfirm = () => {
    void i18n.changeLanguage(selectedLanguage);
    setEntryStep('socialLogin');
  };

  if (entryStep === 'start') {
    return (
      <main
        className="mx-auto flex h-dvh w-full max-w-[430px] items-center justify-center overflow-hidden bg-[#F5F5F5] px-6 pb-[7.5dvh] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif]"
        onClick={handleStart}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleStart();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <button
          aria-label="온보딩 시작"
          className="border-0 bg-transparent p-4"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleStart();
          }}
        >
          <img
            alt="HIRELINK"
            className="h-6 w-[183px] max-w-full filter-[brightness(0)_saturate(100%)_invert(48%)_sepia(86%)_saturate(576%)_hue-rotate(120deg)_brightness(93%)_contrast(101%)]"
            src={hirelinkWordmark}
          />
        </button>
      </main>
    );
  }

  if (entryStep === 'language') {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]">
        <button
          aria-label="이전 화면으로"
          className="absolute top-[max(0.5rem,calc(env(safe-area-inset-top)+0.25rem),min(3.5rem,6.64dvh))] left-[17px] z-10 grid size-8 place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={() => setEntryStep('start')}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>
        <section className="flex min-h-0 flex-1 flex-col px-[19px] pt-[max(calc(env(safe-area-inset-top)+2.75rem),min(124px,14.7dvh))] pb-[max(env(safe-area-inset-bottom),min(32px,3.8dvh))]">
          <div>
            <h1 className="m-0 text-[26px] leading-[1.5] font-semibold tracking-[-0.02em]">
              본인의 언어를
              <br />
              선택해주세요.
            </h1>
            <p className="mt-[min(33px,3.9dvh)] mb-0 text-[17px] leading-[1.5] font-normal">
              언어선택
            </p>
            <div className="mt-[min(13px,1.54dvh)] grid gap-[min(10px,1.2dvh)]">
              <button
                aria-pressed={selectedLanguage === 'ko'}
                className={`flex h-[57px] items-center justify-center gap-[6px] rounded-[15px] border-[1.5px] text-[17px] leading-[1.5] font-medium transition-colors ${
                  selectedLanguage === 'ko'
                    ? 'border-[#00B894] bg-[#E5F8F3] text-[#009376]'
                    : 'border-[#B3B8B9] bg-[#F5F5F5] text-[#1D1F20]'
                }`}
                type="button"
                onClick={() => setSelectedLanguage('ko')}
              >
                <img
                  alt=""
                  className="size-[22px] object-contain"
                  src={languageKoreanFlag}
                />
                한국어
              </button>
              <button
                aria-pressed={selectedLanguage === 'en'}
                className={`flex h-[57px] items-center justify-center gap-[6px] rounded-[15px] border-[1.5px] text-[17px] leading-[1.5] font-medium transition-colors ${
                  selectedLanguage === 'en'
                    ? 'border-[#00B894] bg-[#E5F8F3] text-[#009376]'
                    : 'border-[#B3B8B9] bg-[#F5F5F5] text-[#1D1F20]'
                }`}
                type="button"
                onClick={() => setSelectedLanguage('en')}
              >
                <img
                  alt=""
                  className="size-[22px] object-contain"
                  src={languageEnglishFlag}
                />
                ENGLISH
              </button>
            </div>
          </div>
          <div className="mt-auto pt-[min(40px,4dvh)]">
            <button
              className="h-[57px] w-full rounded-[15px] bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
              type="button"
              onClick={handleLanguageConfirm}
            >
              확인
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full max-w-none"
        src={socialLoginIllustration}
      />

      <img
        alt=""
        className="pointer-events-none absolute top-[clamp(110px,19.55dvh,165px)] left-[calc(50%-103px)] z-10 size-[42px]"
        src={socialLoginSymbol}
      />
      <img
        alt="HIRELINK"
        className="pointer-events-none absolute top-[clamp(104px,18.84dvh,159px)] left-[calc(50%-61px)] z-10 h-[55px] w-[163px]"
        src={socialLoginWordmark}
      />

      <section className="absolute right-0 bottom-0 left-0 z-10 h-[298px] overflow-hidden rounded-t-[30px] bg-[#F5F5F5] px-6 pt-6 shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
        <button
          className="mx-auto block border-0 bg-transparent p-0 text-[15px] leading-normal underline"
          type="button"
          onClick={() => setIsEmployerNoticeOpen(true)}
        >
          {t('entry.employer')}
        </button>

        <div className="mt-5 grid gap-[14px]">
          <button
            className="relative h-[57px] overflow-hidden rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
            type="button"
            onClick={onStart}
          >
            <span className="absolute top-[15.3px] left-[54.33%] -translate-x-1/2 whitespace-nowrap">
              {t('entry.google')}
            </span>
            <span className="pointer-events-none absolute top-[19.3px] left-[29.91%] size-[19px] overflow-hidden">
              <img
                alt=""
                className="absolute -top-[25.12%] -left-[25.11%] size-[150.23%] max-w-none"
                src={googleIcon}
              />
            </span>
          </button>
          <button
            className="relative h-[57px] overflow-hidden rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
            type="button"
            onClick={onStart}
          >
            <span className="absolute top-[15.3px] left-[54.91%] -translate-x-1/2 whitespace-nowrap">
              {t('entry.kakao')}
            </span>
            <img
              alt=""
              className="pointer-events-none absolute top-[18.3px] left-[27.28%] size-[21px]"
              src={kakaoIcon}
            />
          </button>
          <button
            className="h-[57px] rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
            type="button"
            onClick={onEmailLogin}
          >
            {t('entry.email')}
          </button>
        </div>
      </section>

      {isEmployerNoticeOpen ? (
        <EmployerEntryNotice onClose={() => setIsEmployerNoticeOpen(false)} />
      ) : null}
    </main>
  );
}
