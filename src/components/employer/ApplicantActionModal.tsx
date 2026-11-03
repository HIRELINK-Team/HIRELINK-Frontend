import ConfirmModal from "../common/ConfirmModal";
import type { EmployerApplicantMock } from "../../types/application";

export type ApplicantAction = "OFFER" | "REJECT";

interface ApplicantActionModalProps {
  action: ApplicantAction;
  applicant: EmployerApplicantMock;
  onCancel: () => void;
  onConfirm: () => void;
}

function ApplicantActionModal({
  action,
  applicant,
  onCancel,
  onConfirm,
}: ApplicantActionModalProps) {
  const isOffer = action === "OFFER";

  return (
    <ConfirmModal
      title={isOffer ? "채용제안을 보낼까요?" : "채용을 거절할까요?"}
      cancelLabel="취소"
      confirmLabel={isOffer ? "채용 제안하기" : "채용 거절"}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      {isOffer ? (
        <div className="mt-4 text-base leading-[22px] text-[#70737c]">
          <p>{applicant.name}님에게 채용제안을 보내요.</p>
          <p>제안한 뒤에는 개별로 철회할 수 없어요.</p>
          <p>유학생이 24시간 안에 응답하지 않으면 제안이 종료돼요.</p>
        </div>
      ) : (
        <div className="mt-4 text-base leading-[22px] text-[#70737c]">
          <p>{applicant.name}님의 지원이 종료되고 검토 중 목록에서 사라져요.</p>
          <p>거절한 지원자는 되돌릴 수 없어요.</p>
        </div>
      )}
    </ConfirmModal>
  );
}

export default ApplicantActionModal;
