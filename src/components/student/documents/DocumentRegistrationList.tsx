import chevronRightIcon from '../../../assets/icons/student/documents/chevron-right.svg';
import registrationEmploymentIcon from '../../../assets/images/student/documents/registration-employment.png';
import registrationNoticeIcon from '../../../assets/images/student/documents/registration-notice.png';
import {
  STUDENT_BASIC_DOCUMENTS,
  STUDENT_EMPLOYMENT_DOCUMENT,
} from '../../../mocks/studentDocuments';
import type { StudentDocument } from '../../../types/studentDocument';

type DocumentRegistrationListProps = {
  basicDocuments?: readonly StudentDocument[];
  onDocumentClick?: (document: StudentDocument) => void;
};

function DocumentRow({
  document,
  onClick,
}: {
  document: StudentDocument;
  onClick?: (document: StudentDocument) => void;
}) {
  const isRegistered = document.status === 'registered';

  return (
    <button
      className={`flex h-[89px] w-full items-center rounded-[20px] bg-transparent px-[29px] text-left ${
        isRegistered
          ? 'border-[1.5px] border-[#00B894]'
          : 'border-[0.7px] border-[#B0B8C1]'
      }`}
      type="button"
      onClick={() => onClick?.(document)}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <strong className="text-[17px] leading-[1.5] font-bold">
          {document.title}
        </strong>
        <span
          className={`text-[15px] leading-[1.5] ${
            isRegistered ? 'text-[#00B894]' : 'text-[#8B95A1]'
          }`}
        >
          {isRegistered ? '등록 완료' : '등록 필요'}
        </span>
      </span>
      {isRegistered ? (
        <span className="flex shrink-0 items-center gap-2 text-[13px] leading-[1.5] text-[#8B95A1]">
          {document.registeredAt}
          <span className="flex h-[12px] w-[6px] -scale-x-100 items-center">
            <img alt="" src={chevronRightIcon} />
          </span>
        </span>
      ) : (
        <span className="rounded-[10px] bg-[#E5E8EB] px-[10px] py-[10px] text-[12px] leading-[1.5] font-medium text-[#191F28]">
          등록하기
        </span>
      )}
    </button>
  );
}

export function DocumentRegistrationList({
  basicDocuments = STUDENT_BASIC_DOCUMENTS,
  onDocumentClick,
}: DocumentRegistrationListProps) {
  return (
    <section>
      <div className="rounded-[20px] bg-[#E5E8EB] px-6 py-[22px]">
        <div className="flex items-center">
          <img
            alt=""
            className="h-[56px] w-[57px] shrink-0 object-contain"
            src={registrationNoticeIcon}
          />
          <div className="ml-[15px]">
            <h2 className="m-0 text-[15px] leading-[1.5] font-bold">
              필요한 서류를 등록해주세요.
            </h2>
            <p className="m-0 mt-1 text-[12px] leading-[1.5] text-[#8B95A1]">
              서류를 등록하면 근무 가능 조건을
              <br />더 정확하게 확인할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      <h2 className="m-0 mt-[20px] pl-0.5 text-[20px] leading-[1.5] font-semibold">
        기본 서류
      </h2>
      <div className="mt-[17px] space-y-[10px]">
        {basicDocuments.map((document) => (
          <DocumentRow
            document={document}
            key={document.id}
            onClick={onDocumentClick}
          />
        ))}
      </div>

      <h2 className="m-0 mt-[23px] pl-0.5 text-[20px] leading-[1.5] font-semibold">
        취업허가 관련 (채용 후 준비)
      </h2>
      <div className="mt-[23px]">
        <DocumentRow
          document={STUDENT_EMPLOYMENT_DOCUMENT}
          onClick={onDocumentClick}
        />
      </div>

      <div className="mt-[10px] flex h-[80px] items-center rounded-[20px] bg-[#E5E8EB] px-[21px]">
        <img
          alt=""
          className="h-[51px] w-[52px] shrink-0 object-contain"
          src={registrationEmploymentIcon}
        />
        <p className="m-0 ml-[14px] text-[13px] leading-[1.5] font-medium text-[#191F28]">
          근로계약서, 사업자 등록증 등은
          <br />
          일자리가 정해진 후에 등록하시면 돼요.
        </p>
      </div>
    </section>
  );
}
