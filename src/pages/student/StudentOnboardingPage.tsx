import { useEffect, useMemo, useState } from 'react'

import locationIcon from '../../assets/icons/student/location.svg'
import searchIcon from '../../assets/icons/student/search.svg'
import ageRestrictionImage from '../../assets/images/student/age-restriction.png'
import { OnboardingField } from '../../components/student/onboarding/OnboardingField'
import { OnboardingScaffold } from '../../components/student/onboarding/OnboardingScaffold'
import { SelectionCard } from '../../components/student/onboarding/SelectionCard'

type BasicInfoStep =
  | 'name'
  | 'phone'
  | 'verification'
  | 'birthYear'
  | 'nationality'
  | 'location'
  | 'koreanLevel'

type BasicInfoView = BasicInfoStep | 'ageRestricted'

type KoreanLevel = 'beginner' | 'intermediate' | 'advanced'

type BasicInfo = {
  birthYear: string
  koreanLevel: KoreanLevel
  location: string
  name: string
  nationality: string
  phone: string
  verificationCode: string
}

const COUNTRY_OPTIONS = ['베트남', '중국', '몽골', '우즈베키스탄', '일본', '기타']

const KOREAN_LEVELS: Array<{ description: string; label: string; value: KoreanLevel }> = [
  { value: 'beginner', label: '초급', description: '간단한 인사만 가능해요.' },
  { value: 'intermediate', label: '중급', description: '일상 대화 정도는 할 수 있어요.' },
  { value: 'advanced', label: '고급', description: '업무 대화도 가능해요.' },
]

const STEP_ORDER: BasicInfoStep[] = [
  'name',
  'phone',
  'verification',
  'birthYear',
  'nationality',
  'location',
  'koreanLevel',
]

const BASIC_INFO_PROGRESS: Record<BasicInfoStep, number> = {
  name: 1,
  phone: 2,
  verification: 2,
  birthYear: 3,
  nationality: 4,
  location: 5,
  koreanLevel: 6,
}

const BASIC_INFO_TOTAL_SUB_STEPS = Math.max(...Object.values(BASIC_INFO_PROGRESS))

const INITIAL_INFO: BasicInfo = {
  name: '',
  phone: '',
  verificationCode: '',
  birthYear: '',
  nationality: '베트남',
  location: '',
  koreanLevel: 'beginner',
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function isValidPhone(value: string) {
  return /^01[0-9]-\d{3,4}-\d{4}$/.test(value)
}

export default function StudentOnboardingPage() {
  const [info, setInfo] = useState<BasicInfo>(INITIAL_INFO)
  const [phoneError, setPhoneError] = useState('')
  const [remainingSeconds, setRemainingSeconds] = useState(143)
  const [step, setStep] = useState<BasicInfoView>('name')
  const [verificationError, setVerificationError] = useState('')

  useEffect(() => {
    if (step !== 'verification' || remainingSeconds === 0) return undefined

    const timerId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => Math.max(0, currentSeconds - 1))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [remainingSeconds, step])

  const currentIndex = step === 'ageRestricted' ? -1 : STEP_ORDER.indexOf(step)
  const remainingTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingSeconds])

  const updateInfo = <Key extends keyof BasicInfo>(key: Key, value: BasicInfo[Key]) => {
    setInfo((currentInfo) => ({ ...currentInfo, [key]: value }))
  }

  if (step === 'ageRestricted') {
    return (
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col items-center bg-[#F5F5F5] px-6 pt-[262px] pb-[calc(37px+env(safe-area-inset-bottom))] text-center font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
        <img alt="" className="h-auto w-[106px]" src={ageRestrictionImage} />
        <h1 className="mt-[14px] mb-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold">
          아직은 서비스를{`\n`}이용할 수 없어요
        </h1>
        <p className="mt-[39px] mb-0 whitespace-pre-line text-[13px] leading-[1.5] text-[#8B95A1]">
          하이어링크는 만 18세 이상부터 이용할 수 있어요.{`\n`}
          이용 가능 연령이 되면 다시 찾아주세요!
        </p>
        <button
          className="mt-auto h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={() => {
            updateInfo('birthYear', '')
            setStep('birthYear')
          }}
        >
          확인
        </button>
      </main>
    )
  }

  const handleBack = () => {
    if (currentIndex === 0) return

    setPhoneError('')
    setVerificationError('')
    setStep(STEP_ORDER[currentIndex - 1])
  }

  const handleNext = () => {
    if (step === 'phone') {
      if (!isValidPhone(info.phone)) {
        setPhoneError('다시 입력해주세요.')
        return
      }

      setPhoneError('')
      setRemainingSeconds(143)
      setStep('verification')
      return
    }

    if (step === 'verification') {
      if (info.verificationCode !== '578412') {
        setVerificationError('인증번호가 틀렸어요. 다시 입력해주세요.')
        return
      }

      setVerificationError('')
    }

    if (step === 'birthYear') {
      if (!/^\d{4}$/.test(info.birthYear)) return

      const latestEligibleBirthYear = new Date().getFullYear() - 19
      if (Number(info.birthYear) > latestEligibleBirthYear) {
        setStep('ageRestricted')
        return
      }
    }
    if (step === 'location' && !info.location.trim()) return

    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1])
    }
  }

  const handlePhoneChange = (value: string) => {
    updateInfo('phone', formatPhone(value))
    setPhoneError('')
  }

  const isCtaDisabled =
    (step === 'name' && !info.name.trim()) ||
    (step === 'birthYear' && !/^\d{4}$/.test(info.birthYear)) ||
    (step === 'location' && !info.location.trim())

  const questions: Record<BasicInfoStep, string> = {
    name: '본인의 이름을\n적어주세요.',
    phone: '본인의 전화번호를\n입력해주세요.',
    verification: '인증 번호를\n입력해 주세요.',
    birthYear: '본인의 나이를\n선택해주세요.',
    nationality: '본인의 국적을\n선택해주세요.',
    location: '현재 거주지역을\n입력해주세요.',
    koreanLevel: '한국어 실력은\n어느 정도인가요?',
  }

  const ctaLabel = step === 'phone' ? '인증번호 받기' : '확인'

  return (
    <OnboardingScaffold
      activeSubStep={BASIC_INFO_PROGRESS[step]}
      ctaLabel={ctaLabel}
      currentStage={1}
      isCtaDisabled={isCtaDisabled}
      question={questions[step]}
      onBack={handleBack}
      onCtaClick={handleNext}
      stageLabel="기본정보 입력"
      totalSubSteps={BASIC_INFO_TOTAL_SUB_STEPS}
    >
      {step === 'name' ? (
        <OnboardingField
          label="이름"
          placeholder="이름 입력"
          value={info.name}
          onChange={(event) => updateInfo('name', event.target.value)}
        />
      ) : null}

      {step === 'phone' ? (
        <OnboardingField
          errorMessage={phoneError}
          inputMode="tel"
          label="전화번호"
          placeholder="010-1234-5678"
          value={info.phone}
          onChange={(event) => handlePhoneChange(event.target.value)}
        />
      ) : null}

      {step === 'verification' ? (
        <OnboardingField
          errorMessage={verificationError}
          inputMode="numeric"
          label="인증번호"
          maxLength={6}
          placeholder="인증번호 6자리"
          trailing={
            <span className="flex shrink-0 items-center gap-[7px]">
              <span className="text-[15px] leading-[1.5] font-medium text-[#00B894]">{remainingTime}</span>
              <button
                className="rounded-[44px] border-[0.7px] border-[#B0B8C1] bg-transparent px-2.5 py-1.5 text-[13px] leading-[1.5] text-[#191F28]"
                type="button"
                onClick={() => setRemainingSeconds(143)}
              >
                재요청
              </button>
            </span>
          }
          value={info.verificationCode}
          onChange={(event) => {
            updateInfo('verificationCode', event.target.value.replace(/\D/g, ''))
            setVerificationError('')
          }}
        />
      ) : null}

      {step === 'birthYear' ? (
        <OnboardingField
          inputMode="numeric"
          label="출생년도"
          maxLength={4}
          placeholder="2000"
          value={info.birthYear}
          onChange={(event) => updateInfo('birthYear', event.target.value.replace(/\D/g, ''))}
        />
      ) : null}

      {step === 'nationality' ? (
        <label className="mt-[27px] block">
          <span className="block text-[17px] leading-[1.5] text-[#191F28]">국적</span>
          <select
            className="h-[57px] w-full appearance-auto border-0 border-b border-[#B0B8C1] bg-transparent py-0 pr-0 pl-[37px] text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28] outline-none"
            value={info.nationality}
            onChange={(event) => updateInfo('nationality', event.target.value)}
          >
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
      ) : null}

      {step === 'location' ? (
        <div>
          <OnboardingField
            label="주소"
            placeholder="주소 검색"
            trailing={<img alt="" className="h-[22px] w-[22px] shrink-0" src={searchIcon} />}
            value={info.location}
            onChange={(event) => updateInfo('location', event.target.value)}
          />
          <button
            className="mt-[15px] flex h-[54px] w-full items-center gap-4 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[23px] text-left text-[17px] leading-[1.5] text-[#191F28]"
            type="button"
            onClick={() => updateInfo('location', '서울특별시 동작구 상도동')}
          >
            <img alt="" className="h-[14px] w-[14px]" src={locationIcon} />
            현재 위치로 찾기
          </button>
        </div>
      ) : null}

      {step === 'koreanLevel' ? (
        <div className="mt-[27px] space-y-2.5">
          {KOREAN_LEVELS.map((level) => (
            <SelectionCard
              description={level.description}
              isSelected={info.koreanLevel === level.value}
              key={level.value}
              onClick={() => updateInfo('koreanLevel', level.value)}
            >
              {level.label}
            </SelectionCard>
          ))}
        </div>
      ) : null}
    </OnboardingScaffold>
  )
}
