import emptyStateIllustration from '../../../assets/images/student/applications/applications-empty-illustration-2.png';

export function StudentApplicationsEmptyState() {
  return (
    <section
      className="flex flex-col items-center pt-[159px]"
      aria-labelledby="applications-empty-title"
    >
      <img
        alt=""
        className="h-[104px] w-[87px] object-contain"
        src={emptyStateIllustration}
      />
      <h2
        className="mt-[15px] m-0 text-center text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]"
        id="applications-empty-title"
      >
        지원 내역이 없습니다.
      </h2>
    </section>
  );
}
