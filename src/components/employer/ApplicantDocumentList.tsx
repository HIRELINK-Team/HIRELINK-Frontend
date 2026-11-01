import type { ApplicantDocumentMock } from "../../types/application";

interface ApplicantDocumentListProps {
  documents: ApplicantDocumentMock[];
}

function ApplicantDocumentList({ documents }: ApplicantDocumentListProps) {
  return (
    <ul className="space-y-2">
      {documents.map((document) => {
        const isRegistered = document.isRegistered !== false;

        return (
          <li
            key={document.id}
            className="flex h-[53px] items-center justify-between rounded-xl border border-[rgba(112,115,124,0.16)] px-[18px]"
          >
            <div>
              <p
                className={`text-[15px] font-semibold ${isRegistered ? "text-[#171719]" : "text-[#70737c]"}`}
              >
                {document.name}
              </p>
              <p className="mt-px text-xs font-medium text-[#70737c]">
                {isRegistered
                  ? `제출 ${document.submittedAt}`
                  : "아직 등록되지 않음"}
              </p>
            </div>
            {isRegistered && (
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
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ApplicantDocumentList;
