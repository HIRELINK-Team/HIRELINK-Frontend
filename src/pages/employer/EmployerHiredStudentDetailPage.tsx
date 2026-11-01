import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import ApplicantDocumentList from "../../components/employer/ApplicantDocumentList";
import PhoneNumber from "../../components/employer/PhoneNumber";
import { APPLICANT_JOB_MOCKS } from "../../data/employerApplicantsData";
import { useEmployerApplicants } from "../../hooks/useEmployerApplicants";
import { getExpiryWarningDocuments } from "../../utils/documentExpiry";

type HiredStudentDetailTab = "QUALIFICATION" | "ANALYSIS";

interface EligibilityAnalysisLockIconProps {
  isUnlocked: boolean;
}

function EligibilityAnalysisLockIcon({
  isUnlocked,
}: EligibilityAnalysisLockIconProps) {
  return isUnlocked ? (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[18px]">
      <path
        d="M12.5 8V6.25a3.75 3.75 0 0 0-6.42-2.65L4.75 4.92M4 8h10v7H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="size-[18px]">
      <path
        d="M5.25 8V6.25a3.75 3.75 0 0 1 7.5 0V8M4 8h10v7H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmployerHiredStudentDetailPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { applicants } = useEmployerApplicants();
  const [selectedTab, setSelectedTab] =
    useState<HiredStudentDetailTab>("QUALIFICATION");
  const [isMissingDocumentsModalOpen, setIsMissingDocumentsModalOpen] =
    useState(false);

  const applicant = applicants.find(
    (candidate) =>
      candidate.id === applicationId && candidate.status === "HIRED",
  );

  if (!applicant || !applicant.hiredDetails) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#171719]">
          채용 유학생 정보를 찾을 수 없어요.
        </h1>
        <p className="mt-2 text-base text-[#70737c]">
          채용 유학생 목록에서 다시 확인해 주세요.
        </p>
        <button
          type="button"
          onClick={() => navigate("/employer/hired")}
          className="mt-6 h-10 rounded-lg bg-[#00b894] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
        >
          채용 유학생 목록으로
        </button>
      </div>
    );
  }

  const selectedJob = APPLICANT_JOB_MOCKS.find(
    (job) => job.id === applicant.jobId,
  );
  const details = applicant.hiredDetails;
  const canViewEligibilityAnalysis = details.analysisStatus === "READY";
  const expiryWarningDocuments = getExpiryWarningDocuments(applicant.documents);
  const registeredDocumentCount = applicant.documents.filter(
    (document) => document.isRegistered !== false,
  ).length;
  const workHoursRatio = Math.min(
    100,
    Math.round((details.jobWeeklyHours / details.maxWeeklyHours) * 100),
  );

  const handleAnalysisTabClick = () => {
    if (!canViewEligibilityAnalysis) {
      setIsMissingDocumentsModalOpen(true);
      return;
    }

    setSelectedTab("ANALYSIS");
  };

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          채용 유학생 상세
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          {applicant.name}의 근무 시간과 서류 유효기간을 확인합니다
        </p>
      </header>

      <section className="mt-7 grid min-h-[146px] grid-cols-[75px_minmax(0,1fr)_220px] items-center gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
        <div
          aria-hidden="true"
          className="size-[75px] rounded-full bg-[#f2f3f5]"
        />

        <div className="min-w-0">
          <h2 className="text-[26px] font-semibold text-[#171719]">
            {applicant.name}
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-medium text-[#4e5968]">
            <span>
              {applicant.nationality} · {applicant.visa} · TOPIK{" "}
              {applicant.topikLevel}
            </span>
            <span aria-hidden="true" className="h-3.5 w-px bg-[#d1d6db]" />
            <span>
              {applicant.birthDate} (만 {applicant.age}세)
            </span>
          </div>
          <div className="mt-2 inline-flex max-w-full items-center gap-2.5 rounded-lg bg-[#e8f7f3] px-3 py-1.5 text-[15px] font-medium">
            <span className="shrink-0 text-[#2e6c5a]">지원 공고</span>
            <span className="truncate text-base text-[#171719]">
              {selectedJob?.label ?? "공고 정보 없음"}
            </span>
          </div>
        </div>

        <div className="justify-self-end">
          <p className="text-base text-[#70737c]">전화번호</p>
          <PhoneNumber
            value={applicant.phoneNumber ?? "-"}
            className="mt-1 text-[21px] font-semibold text-[#171719]"
          />
        </div>
      </section>

      <div className="mt-10 flex h-8 items-end gap-4 border-b border-[#e1e2e4]">
        <button
          type="button"
          onClick={() => setSelectedTab("QUALIFICATION")}
          className={`h-8 min-w-[88px] cursor-pointer border-b-2 px-2 text-lg transition-colors ${
            selectedTab === "QUALIFICATION"
              ? "border-[#00b894] font-semibold text-[#171719]"
              : "border-transparent font-normal text-[#aeb4bc]"
          }`}
        >
          자격 정보
        </button>
        <button
          type="button"
          onClick={handleAnalysisTabClick}
          className={`flex h-8 min-w-[154px] cursor-pointer items-center justify-center gap-1 border-b-2 px-2 text-lg transition-colors ${
            selectedTab === "ANALYSIS"
              ? "border-[#00b894] font-semibold text-[#171719]"
              : "border-transparent font-normal text-[#aeb4bc]"
          }`}
        >
          근로자격 확인 분석
          <EligibilityAnalysisLockIcon
            isUnlocked={canViewEligibilityAnalysis}
          />
        </button>
      </div>

      {selectedTab === "QUALIFICATION" ? (
        <div className="mt-7 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
          <section>
            <h3 className="text-xl font-semibold text-[#171719]">자격 정보</h3>
            <div className="mt-2 h-[271px] rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
              <dl className="divide-y divide-[#e1e2e4]">
                {[
                  ["자격 만료일", details.qualificationExpiresAt],
                  ["비자 유형", details.visaTypeLabel],
                  ["한국어", `TOPIK ${applicant.topikLevel}`],
                  ["우대 경력", details.preferredExperience],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid min-h-[42px] grid-cols-[92px_minmax(0,1fr)] items-center gap-2"
                  >
                    <dt className="whitespace-nowrap text-sm font-medium text-[#70737c]">
                      {label}
                    </dt>
                    <dd className="text-base font-medium whitespace-nowrap text-[#171719]">
                      {value}
                    </dd>
                  </div>
                ))}
                <div className="grid min-h-[71px] grid-cols-[92px_minmax(0,1fr)] items-start gap-2 pt-3">
                  <dt className="pt-1 whitespace-nowrap text-sm font-medium text-[#70737c]">
                    근무 가능 시간
                  </dt>
                  <dd>
                    <p className="text-base font-medium whitespace-nowrap text-[#171719]">
                      {details.workAvailabilitySummary}
                    </p>
                    <button
                      type="button"
                      onClick={handleAnalysisTabClick}
                      className="mt-1 cursor-pointer text-[13px] font-medium text-[#2e6c5a] underline underline-offset-2"
                    >
                      분석 보기 &gt;
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-[#171719]">
                증빙 서류 상태
              </h3>
              <span className="text-base font-medium text-[#70737c]">
                {applicant.documents.length}개 중 {registeredDocumentCount}개
                등록
              </span>
            </div>
            <div className="mt-2 h-[271px] rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
              {expiryWarningDocuments.length > 0 && (
                <div
                  className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#c13c2d]"
                  role="status"
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    ⓘ
                  </span>
                  <div className="space-y-1">
                    {expiryWarningDocuments.map(
                      ({ document, remainingDays }) => (
                        <p key={document.id}>
                          {document.name} 만료가 {remainingDays}일 남았어요.
                          재발급이 필요해요.
                        </p>
                      ),
                    )}
                  </div>
                </div>
              )}
              <div
                className={expiryWarningDocuments.length > 0 ? "mt-1.5" : ""}
              >
                <ApplicantDocumentList
                  documents={applicant.documents}
                  compact={expiryWarningDocuments.length > 0}
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_388px]">
          <div className="flex flex-col gap-4">
            <section>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-[#171719]">
                  근무 가능 시간
                </h3>
                <p className="text-xs text-[#70737c]">
                  실제 허용 시간은 시간제취업 허가서를 확인해야 해요
                </p>
              </div>
              <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
                <ul className="space-y-2">
                  {details.analysisStandards.map((standard) => (
                    <li
                      key={standard.id}
                      className="grid h-9 grid-cols-[96px_minmax(0,1fr)] items-center rounded-xl border border-[rgba(112,115,124,0.16)] px-4 text-[13px] font-medium text-[#171719]"
                    >
                      <span>{standard.label}</span>
                      <span>{standard.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="flex flex-1 flex-col">
              <h3 className="text-xl font-semibold text-[#171719]">
                공고와 비교
              </h3>
              <div className="mt-2 flex flex-1 flex-col justify-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-5 py-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
                <div className="h-5 overflow-hidden rounded-md bg-[#e5e8eb]">
                  <div
                    className="h-full rounded-md bg-[#52b596]"
                    style={{ width: `${workHoursRatio}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[13px] font-medium">
                  <span className="text-[#171719]">
                    {details.jobScheduleLabel}
                  </span>
                  <span className="text-[#171719]">
                    {details.jobWeeklyHours}시간
                  </span>
                  <span className="text-[#bababa]">
                    {details.maxWeeklyHours}시간
                  </span>
                </div>
              </div>
            </section>
          </div>

          <section>
            <h3 className="text-xl font-semibold text-[#171719]">
              분석에 쓰인 서류
            </h3>
            <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
              <ul className="space-y-2">
                {details.analysisDocuments.map((document) => (
                  <li
                    key={document.id}
                    className="flex h-[53px] items-center justify-between rounded-xl border border-[rgba(112,115,124,0.16)] px-5"
                  >
                    <div>
                      <p className="text-[15px] font-semibold text-[#171719]">
                        {document.name}
                      </p>
                      <p className="mt-px text-xs font-medium text-[#70737c]">
                        {document.value}
                      </p>
                    </div>
                    <span className="flex size-[18px] items-center justify-center rounded-full border border-[#171719] text-xs text-[#171719]">
                      ✓
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-medium text-[#171719]">
                  기준: {details.analysisSource}
                </span>
                <span className="text-[#70737c]">
                  최종 확인일: {details.analysisCheckedAt}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {isMissingDocumentsModalOpen && (
        <ConfirmModal
          title="서류를 모두 등록한 유학생만 볼 수 있어요"
          confirmLabel="확인"
          onCancel={() => setIsMissingDocumentsModalOpen(false)}
          onConfirm={() => setIsMissingDocumentsModalOpen(false)}
        >
          <p className="mt-3 text-base text-[#70737c]">
            {applicant.documents.length}개 중 {registeredDocumentCount}개가
            입력된 상태예요
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}

export default EmployerHiredStudentDetailPage;
