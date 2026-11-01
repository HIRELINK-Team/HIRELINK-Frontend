import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import EmployerHiredStudentRow from "../../components/employer/EmployerHiredStudentRow";
import { APPLICANT_JOB_MOCKS } from "../../data/employerApplicantsData";
import { useEmployerApplicants } from "../../hooks/useEmployerApplicants";

type DeleteTarget = "ALL" | "SELECTED";

function EmployerHiredStudentsPage() {
  const navigate = useNavigate();
  const { applicants, removeHiredApplicants } = useEmployerApplicants();
  const [selectedJobId, setSelectedJobId] = useState(APPLICANT_JOB_MOCKS[0].id);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<
    Set<string>
  >(new Set());
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const hiredStudents = useMemo(
    () =>
      applicants.filter(
        (applicant) =>
          applicant.status === "HIRED" && applicant.jobId === selectedJobId,
      ),
    [applicants, selectedJobId],
  );
  const selectedJob = APPLICANT_JOB_MOCKS.find(
    (job) => job.id === selectedJobId,
  );
  const selectedCount = selectedApplicationIds.size;
  const isAllSelected =
    hiredStudents.length > 0 && selectedCount === hiredStudents.length;
  const deleteCount =
    deleteTarget === "ALL" ? hiredStudents.length : selectedCount;

  const handleJobChange = (nextJobId: string) => {
    setSelectedJobId(nextJobId);
    setIsSelectionMode(false);
    setSelectedApplicationIds(new Set());
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode((currentValue) => !currentValue);
    setSelectedApplicationIds(new Set());
  };

  const handleSelect = (applicationId: string) => {
    setSelectedApplicationIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(applicationId)) nextIds.delete(applicationId);
      else nextIds.add(applicationId);
      return nextIds;
    });
  };

  const handleSelectAll = () => {
    setSelectedApplicationIds(
      isAllSelected
        ? new Set()
        : new Set(hiredStudents.map((student) => student.id)),
    );
  };

  const handleConfirmDelete = () => {
    const applicationIds =
      deleteTarget === "ALL"
        ? hiredStudents.map((student) => student.id)
        : [...selectedApplicationIds];

    removeHiredApplicants(applicationIds);
    setDeleteTarget(null);
    setSelectedApplicationIds(new Set());
    setIsSelectionMode(false);
    setToastMessage(`${applicationIds.length}명을 삭제했어요.`);
  };

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          채용 유학생
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          최종 매칭된 유학생과 자격 만료일을 확인합니다
        </p>
      </header>

      <div className="mt-7 flex w-full items-end justify-between gap-6">
        <div className="relative w-[360px] max-w-full">
          <select
            aria-label="채용 공고 선택"
            value={selectedJobId}
            onChange={(event) => handleJobChange(event.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-[rgba(112,115,124,0.32)] bg-white px-4 pr-11 text-base font-semibold text-[#171719] outline-none transition-colors hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10"
          >
            {APPLICANT_JOB_MOCKS.map((job) => (
              <option key={job.id} value={job.id}>
                {job.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 8"
            className="pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2 text-[#171719]"
            fill="none"
          >
            <path
              d="m1 1 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isSelectionMode ? (
            <>
              <button
                type="button"
                onClick={handleSelectAll}
                disabled={hiredStudents.length === 0}
                className="h-8 min-w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3 text-sm font-medium text-[#171719] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#aeb4bc]"
              >
                {isAllSelected ? "전체 해제" : "전체 선택"}
              </button>
              <button
                type="button"
                onClick={handleToggleSelectionMode}
                className="h-8 w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] hover:bg-[#f4f4f5]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget("SELECTED")}
                disabled={selectedCount === 0}
                className="h-8 min-w-[140px] cursor-pointer rounded-lg bg-[#008f73] px-4 text-sm font-semibold text-white hover:bg-[#007d65] disabled:cursor-not-allowed disabled:bg-[#c7cbd1]"
              >
                선택 삭제 ({selectedCount})
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleToggleSelectionMode}
                disabled={hiredStudents.length === 0}
                className="h-8 w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#aeb4bc]"
              >
                선택
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget("ALL")}
                disabled={hiredStudents.length === 0}
                className="h-8 w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#aeb4bc]"
              >
                모두 삭제
              </button>
            </>
          )}
        </div>
      </div>

      <section className="mt-4 space-y-3" aria-label="채용 유학생 목록">
        {hiredStudents.map((student) => (
          <EmployerHiredStudentRow
            key={student.id}
            applicant={student}
            jobSummary={selectedJob?.hiredSummary ?? "공고 정보 없음"}
            isSelectionMode={isSelectionMode}
            isSelected={selectedApplicationIds.has(student.id)}
            onSelect={handleSelect}
            onViewDetails={(applicationId) =>
              navigate(`/employer/hired/${applicationId}`)
            }
          />
        ))}

        {hiredStudents.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#c7cbd1] text-sm text-[#70737c]">
            이 공고로 채용된 유학생이 없어요.
          </div>
        )}
      </section>

      {deleteTarget && (
        <ConfirmModal
          title={
            deleteTarget === "ALL"
              ? "채용 유학생을 모두 삭제할까요?"
              : `채용 유학생 ${deleteCount}명을 삭제할까요?`
          }
          cancelLabel="취소"
          confirmLabel={deleteTarget === "ALL" ? "모두 삭제" : "삭제"}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        >
          <p className="mt-4 text-base leading-6 text-[#70737c]">
            목록에서 사라지고, 유학생 연락처도 함께 사라져요.
            <br />
            삭제하면 서류 만료 알림도 받을 수 없으며 다시 되돌릴 수 없어요.
          </p>
        </ConfirmModal>
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerHiredStudentsPage;
