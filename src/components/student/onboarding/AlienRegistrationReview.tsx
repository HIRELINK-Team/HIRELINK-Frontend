import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import editIcon from '../../../assets/icons/student/documents/alien-registration/review-edit.svg';
import errorIcon from '../../../assets/icons/student/documents/alien-registration/review-error.svg';
import type { AlienRegistrationFormValues } from './AlienRegistrationEdit';

type AlienRegistrationReviewProps = {
  notice?: string;
  onBack: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  onRetry: () => void;
  values: AlienRegistrationFormValues;
};

const recognizedInformation = (values: AlienRegistrationFormValues) => [
  ['이름', values.name],
  ['국적', values.nationality],
  ['체류자격', values.residenceQualification],
  ['등록번호', values.registrationNumber],
  ['발급일자', values.issueDate],
  ['일련번호', values.serialNumber],
  ['만료일', values.expiryDate],
] as const;

export function AlienRegistrationReview({
  notice,
  onBack,
  onConfirm,
  onEdit,
  onRetry,
  values,
}: AlienRegistrationReviewProps) {
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
        <p className="m-0 text-[17px] leading-[1.5] font-semibold text-[#00B894]">2/6</p>
        <p className="m-0 text-[15px] leading-[1.5] text-[#8B95A1]">신원 확인</p>
      </div>

      <div aria-label="온보딩 진행 단계" className="absolute top-[162px] left-6 flex w-[342px] gap-[5px]">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            className={`h-0.5 flex-1 ${index < 2 ? 'bg-[#00B894]' : 'bg-[#B0B8C1]'}`}
            key={index}
          />
        ))}
      </div>

      <h1 className="absolute top-[210px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        인식된 정보를
        <br />
        확인해주세요.
      </h1>
      <p className="absolute top-[299px] left-6 m-0 text-[15px] leading-[1.5] text-[#939393]">
        정보가 다르면 다시 촬영해주세요.
      </p>

      <button
        className="absolute top-[342px] left-1/2 flex h-[54px] w-[340px] -translate-x-1/2 items-center gap-2 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent pl-[30px] text-[17px] leading-[1.5]"
        type="button"
        onClick={onEdit}
      >
        <img alt="" src={editIcon} />
        직접 수정하기
      </button>

      <section
        aria-label="인식된 외국인등록증 정보"
        className="absolute top-[406px] left-1/2 h-[254px] w-[341px] -translate-x-1/2 rounded-[20px] bg-[#E5E8EB] px-[33px] pt-[18px]"
      >
        {recognizedInformation(values).map(([label, value]) => (
          <div className="grid h-8 grid-cols-[69px_1fr] items-center" key={label}>
            <span className="text-[13px] leading-[1.5] text-[#8B95A1]">{label}</span>
            <span className={label === '등록번호' ? 'text-[17px] leading-[1.5]' : 'truncate text-[13px] leading-[1.5]'}>
              {value}
            </span>
          </div>
        ))}
      </section>

      {notice ? (
        <p className="absolute top-[671px] left-6 m-0 flex items-center gap-2 text-[15px] leading-[1.5] text-[#E05260]">
          <img alt="" className="size-[12px]" src={errorIcon} />
          {notice}
        </p>
      ) : null}

      <div className="absolute top-[750px] left-6 flex gap-3">
        <button
          className="h-[57px] w-[165px] rounded-[15px] border-0 bg-[#B8EBDD] p-0 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          onClick={onRetry}
        >
          다시 촬영
        </button>
        <button
          className="h-[57px] w-[165px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </main>
  );
}
