import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectField from "../../components/common/SelectField";
import Toast from "../../components/common/Toast";
import ApplicantActionModal, {
  type ApplicantAction,
} from "../../components/employer/ApplicantActionModal";
import ApplicantStatusTabs, {
  type ApplicantStatusFilter,
} from "../../components/employer/ApplicantStatusTabs";
import EmployerApplicantRow, {
  APPLICANT_ROW_GRID,
  HIRED_APPLICANT_ROW_GRID,
} from "../../components/employer/EmployerApplicantRow";
import { APPLICANT_JOB_MOCKS } from "../../data/employerApplicantsData";
import { useEmployerApplicants } from "../../hooks/useEmployerApplicants";
import type {
  ApplicationStatus,
  EmployerApplicantMock,
} from "../../types/application";

const MAX_REVIEWING_APPLICANTS = 5;
const VISIBLE_STATUSES: ApplicationStatus[] = [
  "REVIEWING",
  "OFFER_WAITING",
  "HIRED",
];

interface PendingAction {
  type: ApplicantAction;
  applicant: EmployerApplicantMock;
}

function ApplicantTableHeader({ isHired }: { isHired: boolean }) {
  const labels = isHired
    ? ["", "이름", "국적", "비자", "채용완료일", "전화번호", "관리"]
    : ["", "이름", "국적", "비자", "공고 일치율", "남은 시간", "관리"];

  return (
    <div
      className={`grid h-8 w-full items-center rounded-lg bg-[#f7f7f8] px-[23px] text-center text-sm font-semibold text-[#171719] ${isHired ? HIRED_APPLICANT_ROW_GRID : APPLICANT_ROW_GRID}`}
      role="row"
    >
      {labels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className={index === labels.length - 1 ? "pl-6 text-left" : ""}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function EmployerApplicantsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { applicants, offerApplicant, rejectApplicant } =
    useEmployerApplicants();
  const initialJobId = APPLICANT_JOB_MOCKS.some((job) => job.id === jobId)
    ? jobId!
    : APPLICANT_JOB_MOCKS[0].id;
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [selectedFilter, setSelectedFilter] =
    useState<ApplicantStatusFilter>("REVIEWING");
  const [isJobSelectOpen, setIsJobSelectOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const activeApplicants = useMemo(
    () =>
      applicants.filter(
        (applicant) =>
          applicant.jobId === selectedJobId &&
          VISIBLE_STATUSES.includes(applicant.status),
      ),
    [applicants, selectedJobId],
  );
  const counts = useMemo<Record<ApplicantStatusFilter, number>>(
    () => ({
      ALL: activeApplicants.length,
      REVIEWING: activeApplicants.filter(
        (applicant) => applicant.status === "REVIEWING",
      ).length,
      OFFER_WAITING: activeApplicants.filter(
        (applicant) => applicant.status === "OFFER_WAITING",
      ).length,
      HIRED: activeApplicants.filter(
        (applicant) => applicant.status === "HIRED",
      ).length,
    }),
    [activeApplicants],
  );
  const filteredApplicants = useMemo(
    () =>
      selectedFilter === "ALL"
        ? activeApplicants
        : activeApplicants.filter(
            (applicant) => applicant.status === selectedFilter,
          ),
    [activeApplicants, selectedFilter],
  );
  const isReviewCapacityVisible =
    selectedFilter === "ALL" || selectedFilter === "REVIEWING";
  const isReviewCapacityFull = counts.REVIEWING >= MAX_REVIEWING_APPLICANTS;

  const handleJobChange = (nextJobId: string) => {
    setSelectedJobId(nextJobId);
    setSelectedFilter("REVIEWING");
    setIsJobSelectOpen(false);
    navigate(`/employer/jobs/${nextJobId}/applicants`, { replace: true });
  };

  const handleViewDetails = (applicant: EmployerApplicantMock) => {
    navigate(`/employer/applicants/${applicant.id}`);
  };

  const handleOffer = (applicant: EmployerApplicantMock) => {
    setPendingAction({ type: "OFFER", applicant });
  };

  const handleReject = (applicant: EmployerApplicantMock) => {
    setPendingAction({ type: "REJECT", applicant });
  };

  const handleConfirmAction = () => {
    if (!pendingAction) {
      return;
    }

    const { applicant, type } = pendingAction;

    if (type === "OFFER") {
      offerApplicant(applicant.id);
      setToastMessage(
        `${applicant.name}님에게 채용제안을 보냈어요. 24시간 안에 응답을 기다려요`,
      );
    } else {
      rejectApplicant(applicant.id);
      setToastMessage(`${applicant.name}님을 채용거절했어요.`);
    }

    setPendingAction(null);
  };

  const selectedJob = APPLICANT_JOB_MOCKS.find(
    (job) => job.id === selectedJobId,
  );
  const showHiredHeader = selectedFilter === "HIRED";

  return (
    <div className="w-full max-w-[970px] pb-12 pt-10">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          지원자 관리
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          우리 공고와 지원자의 조건을 함께 살펴보세요
        </p>
      </header>

      <div className="relative mt-7 w-[360px] max-w-full">
        <SelectField
          value={selectedJobId}
          options={APPLICANT_JOB_MOCKS.map((job) => ({
            value: job.id,
            label: job.label,
          }))}
          placeholder="공고를 선택해 주세요"
          ariaLabel="관리할 채용공고"
          isOpen={isJobSelectOpen}
          onOpenChange={setIsJobSelectOpen}
          onChange={handleJobChange}
          variant="compact"
        />
      </div>

      <div className="mt-6 flex w-full items-end justify-between gap-6">
        <ApplicantStatusTabs
          selectedFilter={selectedFilter}
          counts={counts}
          onChange={setSelectedFilter}
        />
        {isReviewCapacityVisible && (
          <div className="flex shrink-0 items-end gap-3 whitespace-nowrap">
            <span className="text-sm text-[#70737c]">검토 정원</span>
            <strong
              className={`text-base font-medium ${isReviewCapacityFull ? "text-[#ff4242]" : "text-[#171719]"}`}
            >
              {counts.REVIEWING}/{MAX_REVIEWING_APPLICANTS}
            </strong>
          </div>
        )}
      </div>

      {isReviewCapacityVisible && isReviewCapacityFull && (
        <p className="mt-3 flex items-center gap-1 text-sm font-medium text-[#e11e1e]">
          <span
            aria-hidden="true"
            className="flex size-3.5 items-center justify-center rounded-full border border-current text-[10px] leading-none"
          >
            !
          </span>
          검토 중 지원자가 5명이에요. 응답해서 자리를 비우면 새 지원자를 다시
          추천받아요.
        </p>
      )}

      <section
        className={`w-full ${
          isReviewCapacityFull && isReviewCapacityVisible ? "mt-3" : "mt-4"
        }`}
        aria-label={`${selectedJob?.label ?? "선택 공고"} 지원자 목록`}
      >
        {selectedFilter !== "ALL" && (
          <ApplicantTableHeader isHired={showHiredHeader} />
        )}

        <div className={`${selectedFilter === "ALL" ? "" : "mt-4"} space-y-3`}>
          {filteredApplicants.map((applicant) => (
            <EmployerApplicantRow
              key={applicant.id}
              applicant={applicant}
              onViewDetails={handleViewDetails}
              onReject={handleReject}
              onOffer={handleOffer}
            />
          ))}
        </div>

        {filteredApplicants.length === 0 && (
          <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#c7cbd1] text-sm text-[#70737c]">
            해당 상태의 지원자가 없어요.
          </div>
        )}
      </section>

      {selectedFilter === "OFFER_WAITING" && (
        <p className="mt-4 text-xs leading-[18px] text-[#8b95a1]">
          채용제안은 개별로 철회할 수 없어요. 유학생이 24시간 안에 응답하지
          않으면 제안이 종료돼요.
        </p>
      )}
      {selectedFilter === "HIRED" && (
        <p className="mt-4 text-xs leading-[18px] text-[#8b95a1]">
          채용완료는 실제 고용 확정과 별개예요. 공개된 연락처로 직접 연락해 면접
          일정을 정해보세요.
        </p>
      )}

      {pendingAction && (
        <ApplicantActionModal
          action={pendingAction.type}
          applicant={pendingAction.applicant}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerApplicantsPage;
