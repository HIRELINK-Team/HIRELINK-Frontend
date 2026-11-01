import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matchCheckIcon from "../../assets/employer/match-check.svg";
import matchNegotiableIcon from "../../assets/employer/match-negotiable.svg";
import CountdownTimer from "../../components/common/CountdownTimer";
import Toast from "../../components/common/Toast";
import ApplicantActionModal, {
  type ApplicantAction,
} from "../../components/employer/ApplicantActionModal";
import { APPLICANT_JOB_MOCKS } from "../../data/employerApplicantsData";
import { useEmployerApplicants } from "../../hooks/useEmployerApplicants";

function DetailActionButton({
  children,
  variant = "secondary",
  onClick,
}: {
  children: string;
  variant?: "primary" | "secondary";
  onClick: () => void;
}) {
  const variantClassName =
    variant === "primary"
      ? "bg-[#00b894] text-white hover:bg-[#00a886] active:bg-[#00997a]"
      : "border border-[rgba(112,115,124,0.32)] bg-white text-[#171719] hover:bg-[#f4f4f5] active:bg-[#e8eaed]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors ${variantClassName}`}
    >
      {children}
    </button>
  );
}

function EmployerApplicantDetailPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { applicants, offerApplicant, rejectApplicant } =
    useEmployerApplicants();
  const applicant = applicants.find(
    (candidate) => candidate.id === applicationId,
  );
  const [pendingAction, setPendingAction] = useState<ApplicantAction | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;

    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  if (!applicant) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#171719]">
          지원자 정보를 찾을 수 없어요.
        </h1>
        <p className="mt-2 text-base text-[#70737c]">
          지원자 목록에서 다시 확인해 주세요.
        </p>
        <button
          type="button"
          onClick={() => navigate("/employer/applicants")}
          className="mt-6 h-10 rounded-lg bg-[#00b894] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
        >
          지원자 목록으로
        </button>
      </div>
    );
  }

  const selectedJob = APPLICANT_JOB_MOCKS.find(
    (job) => job.id === applicant.jobId,
  );
  const matchedCount = applicant.matchItems.filter(
    (item) => item.result === "MATCH",
  ).length;
  const isReviewing = applicant.status === "REVIEWING";

  const handleConfirmAction = () => {
    if (!pendingAction) return;

    if (pendingAction === "OFFER") {
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

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
            지원자 상세
          </h1>
          <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
            공고 조건과 지원자 조건을 비교하고 채용을 제안하세요
          </p>
        </div>

        {isReviewing && (
          <div className="flex shrink-0 items-center gap-2">
            <DetailActionButton onClick={() => setPendingAction("REJECT")}>
              채용 거절
            </DetailActionButton>
            <DetailActionButton
              variant="primary"
              onClick={() => setPendingAction("OFFER")}
            >
              채용 제안
            </DetailActionButton>
          </div>
        )}
      </header>

      <section className="mt-7 grid min-h-[183px] grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
        <div aria-hidden="true" className="size-24 rounded-full bg-[#e1e2e4]" />

        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-[#171719]">
            {applicant.name}
          </h2>
          <dl className="mt-4 flex flex-wrap gap-x-7 gap-y-3 text-sm">
            <div>
              <dt className="text-[#8b95a1]">국적</dt>
              <dd className="mt-0.5 text-[#171719]">{applicant.nationality}</dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">비자</dt>
              <dd className="mt-0.5 text-[#171719]">{applicant.visa}</dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">TOPIK</dt>
              <dd className="mt-0.5 text-[#171719]">{applicant.topikLevel}</dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">생년월일</dt>
              <dd className="mt-0.5 text-[#171719]">
                {applicant.birthDate} (만 {applicant.age}세)
              </dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">근무 시작 가능 날짜</dt>
              <dd className="mt-0.5 text-[#171719]">
                {applicant.availableStartDate}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex min-h-8 max-w-[459px] items-center gap-3 rounded-lg bg-[#e8f7f3] px-4 py-2 text-sm">
            <span className="shrink-0 text-[#70737c]">지원 공고</span>
            <span className="truncate text-[#006e59]">
              {selectedJob?.label ?? "공고 정보 없음"}
            </span>
          </div>
        </div>

        {applicant.expiresAt && (
          <div className="min-w-[150px] text-center">
            <p className="text-base font-medium text-[#70737c]">
              응답까지 남은 시간
            </p>
            <CountdownTimer
              expiresAt={applicant.expiresAt}
              urgentThresholdHours={24}
              sizeClassName="text-[32px]"
              className="font-semibold"
            />
          </div>
        )}
      </section>

      <div className="mt-9 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-[#171719]">
              증빙 서류 상태
            </h2>
            <span className="text-base font-medium text-[#70737c]">
              {applicant.documents.length}개 중 {applicant.documents.length}개
              등록
            </span>
          </div>
          <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <ul className="space-y-3">
              {applicant.documents.map((document) => (
                <li
                  key={document.id}
                  className="flex h-[53px] items-center justify-between rounded-xl border border-[rgba(112,115,124,0.16)] px-[22px]"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#171719]">
                      {document.name}
                    </p>
                    <p className="mt-px text-xs font-medium text-[#70737c]">
                      제출 {document.submittedAt}
                    </p>
                  </div>
                  <div className="min-w-[82px]">
                    <p className="text-[10px] text-[#70737c]">만료일</p>
                    <p
                      className={`mt-px text-[13px] font-semibold ${
                        document.hasExpiryWarning
                          ? "text-[#e05260]"
                          : "text-[#171719]"
                      }`}
                    >
                      {document.expiresAt}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-[#171719]">
              공고 일치율
            </h2>
            <span className="text-sm font-medium text-[#70737c]">
              {matchedCount}/{applicant.matchItems.length} 일치
            </span>
          </div>
          <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-7 shadow-[0_2px_8px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <div className="flex items-center gap-4">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#f2f3f5]">
                <div
                  className="h-full rounded-full bg-[#00b894]"
                  style={{ width: `${applicant.matchRate}%` }}
                />
              </div>
              <strong className="text-[28px] font-semibold text-[#007a63]">
                {applicant.matchRate}%
              </strong>
            </div>

            <ul className="mt-5">
              {applicant.matchItems.map((item) => {
                const isNegotiable = item.result === "NEGOTIABLE";

                return (
                  <li
                    key={item.id}
                    className="grid min-h-[46px] grid-cols-[20px_74px_78px_24px_minmax(0,1fr)] items-center border-b border-[#f2f3f5] last:border-b-0"
                  >
                    <img
                      src={isNegotiable ? matchNegotiableIcon : matchCheckIcon}
                      alt=""
                    />
                    <strong className="ml-2 text-base font-bold text-[#171719]">
                      {item.label}
                    </strong>
                    <span className="text-base text-[#70737c]">
                      {item.applicantValue}
                    </span>
                    <span className="text-base text-[#b0b5bd]">→</span>
                    <div className="flex min-w-0 items-center justify-between gap-2">
                      <span className="truncate text-base font-medium text-[#171719]">
                        {item.jobValue}
                      </span>
                      {isNegotiable && (
                        <span className="shrink-0 rounded-lg bg-[#fff3e0] px-2.5 py-1 text-sm font-medium text-[#c26a00]">
                          협의 가능
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      {pendingAction && (
        <ApplicantActionModal
          action={pendingAction}
          applicant={applicant}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerApplicantDetailPage;
