import backIcon from '../../assets/icons/student/back.svg';
import { MatchingEmptyState } from '../../components/student/matching/MatchingEmptyState';

type StudentMatchingEmptyPageProps = {
  onBack?: () => void;
  onConfirm?: () => void;
};

export default function StudentMatchingEmptyPage({
  onBack,
  onConfirm,
}: StudentMatchingEmptyPageProps) {
  const handleBack = () => {
    onBack?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em]">
      <button
        aria-label="이전 화면으로 이동"
        className="absolute top-[67px] left-6 z-10 flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>
      <MatchingEmptyState onConfirm={handleConfirm} />
    </main>
  );
}
