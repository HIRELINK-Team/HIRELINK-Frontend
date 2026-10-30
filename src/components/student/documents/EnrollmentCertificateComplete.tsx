import backIcon from '../../../assets/icons/student/documents/back.svg';
import completeCheckIcon from '../../../assets/icons/student/documents/enrollment-certificate/complete-check.svg';
import { STUDENT_ENROLLMENT_CERTIFICATE_DETAILS } from '../../../mocks/studentDocuments';

type EnrollmentCertificateCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function EnrollmentCertificateComplete({
  onBack,
  onConfirm,
}: EnrollmentCertificateCompleteProps) {
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
      <img
        alt=""
        className="mx-auto mt-[140px] h-[85px] w-[85px]"
        src={completeCheckIcon}
      />
      <h1 className="m-0 mt-[19px] text-center text-[26px] leading-[1.5] font-semibold">
        등록이 완료되었어요!
      </h1>
      <p className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        등록된 정보를 바탕으로
        <br />
        학업 정보가 확인되었어요.
      </p>
      <section
        aria-label="등록된 재학증명서 정보"
        className="mt-[48px] space-y-[10px]"
      >
        {STUDENT_ENROLLMENT_CERTIFICATE_DETAILS.map((detail) => (
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
