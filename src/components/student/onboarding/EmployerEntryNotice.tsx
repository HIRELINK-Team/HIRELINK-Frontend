import employerDesktopIcon from '../../../assets/images/student/entry/employer-desktop.svg';

type EmployerEntryNoticeProps = {
  onClose: () => void;
};

/** Shows the student-app notice for users who identify as employers. */
export function EmployerEntryNotice({ onClose }: EmployerEntryNoticeProps) {
  return (
    <div className="absolute inset-0 z-20 bg-black/50" role="presentation">
      <section
        aria-labelledby="employer-entry-notice-title"
        aria-modal="true"
        className="absolute bottom-0 h-[368px] w-full rounded-t-[30px] bg-[#F5F5F5] px-7 pt-[37px] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]"
        role="dialog"
      >
        <h2
          className="m-0 text-center text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]"
          id="employer-entry-notice-title"
        >
          사장님 이신가요?
        </h2>
        <p className="mt-[10px] mb-0 whitespace-pre-line text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
          앱은 외국인 유학생 전용으로 운영하고 있어요.{`\n`}
          데스크탑에서 사장님용 페이지를 이용해 주세요.
        </p>
        <img
          alt=""
          className="absolute top-[161px] left-1/2 h-[83px] w-[83px] -translate-x-1/2"
          src={employerDesktopIcon}
        />
        <button
          className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium tracking-[-0.02em] text-[#F5F5F5]"
          type="button"
          onClick={onClose}
        >
          확인
        </button>
      </section>
    </div>
  );
}
