import type { ApplicantDocumentMock } from "../../types/application";
import { isDocumentExpiryWarning } from "../../utils/documentExpiry";

interface ApplicantDocumentListProps {
  documents: ApplicantDocumentMock[];
  compact?: boolean;
}

function ApplicantDocumentList({
  documents,
  compact = false,
}: ApplicantDocumentListProps) {
  return (
    <ul className={compact ? "space-y-[7px]" : "space-y-2"}>
      {documents.map((document) => {
        const isRegistered = document.isRegistered !== false;
        const hasExpiryWarning = isDocumentExpiryWarning(document);

        return (
          <li
            key={document.id}
            className={`flex items-center justify-between rounded-xl border border-[rgba(112,115,124,0.16)] px-[18px] ${
              compact ? "h-12" : "h-[53px]"
            }`}
          >
            <div>
              <p
                className={`text-[15px] leading-5 font-semibold ${isRegistered ? "text-[#171719]" : "text-[#70737c]"}`}
              >
                {document.name}
              </p>
              <p className="mt-0.5 text-xs leading-4 font-medium text-[#70737c]">
                {isRegistered
                  ? `제출 ${document.submittedAt}`
                  : "아직 등록되지 않음"}
              </p>
            </div>
            {isRegistered && (
              <div className="min-w-[82px]">
                <p className="text-[10px] leading-3 text-[#70737c]">만료일</p>
                <p
                  className={`mt-0.5 text-[13px] leading-4 font-semibold ${
                    hasExpiryWarning ? "text-[#e05260]" : "text-[#171719]"
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
