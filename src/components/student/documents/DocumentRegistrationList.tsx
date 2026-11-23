import registrationEmploymentIcon from '../../../assets/images/student/documents/registration-employment.png';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const isRegistered = document.status === 'registered';
  const titleKey = { 'alien-registration-card': 'alienTitle', 'enrollment-certificate': 'enrollment', transcript: 'transcript', 'topik-transcript': 'topik' }[document.id as 'alien-registration-card' | 'enrollment-certificate' | 'transcript' | 'topik-transcript'];

  return (
    <button
      className={`flex h-[89px] w-full items-center rounded-[20px] bg-transparent px-[29px] text-left ${
        isRegistered
          ? 'border-[1.5px] border-[#00B894]'
          : 'border-[0.7px] border-[#B3B8B9]'
      }`}
      type="button"
      onClick={() => onClick?.(document)}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <strong className="truncate text-[17px] leading-[1.5] font-semibold text-[#1D1F20]">
          {document.id === 'part-time-work-permit' ? t('my.workPermit') : titleKey ? t(`my.documents.${titleKey}`) : document.title}
        </strong>
        <span
          className={`mt-1 text-[13px] leading-[1.5] ${
            isRegistered ? 'text-[#00B894]' : 'text-[#909597]'
          }`}
        >
          {isRegistered ? (document.registeredAt?.startsWith('등록일 ') ? t('my.documents.registeredAt', { date: document.registeredAt.slice(4) }) : document.registeredAt) : t('my.documents.registrationNeeded')}
        </span>
      </span>
      <span
        className={`flex h-10 w-[75px] shrink-0 items-center justify-center rounded-[10px] text-[12px] leading-[1.5] font-medium ${
          isRegistered
            ? 'bg-[#B8EBDD] text-[#006E59]'
            : 'bg-[#00B894] text-[#F5F5F5]'
        }`}
      >
        {isRegistered ? t('my.documents.reupload') : t('my.documents.register')}
      </span>
    </button>
  );
}

export function DocumentRegistrationList({
  basicDocuments = STUDENT_BASIC_DOCUMENTS,
  onDocumentClick,
}: DocumentRegistrationListProps) {
  const { t } = useTranslation();
  return (
    <section>
      <div className="h-[100px] rounded-[20px] bg-[#E6E8E9] px-6 py-[19px]">
        <div className="flex items-center">
          <img
            alt=""
            className="h-[56px] w-[57px] shrink-0 object-contain"
            src={registrationNoticeIcon}
          />
          <div className="ml-[15px]">
            <h2 className="m-0 text-[15px] leading-[1.5] font-semibold text-[#1D1F20]">
              {t('my.documents.listPrompt')}
            </h2>
            <p className="m-0 mt-1 text-[12px] leading-[1.5] text-[#909597]">
              {t('my.documents.listDescription').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
            </p>
          </div>
        </div>
      </div>

      <h2 className="m-0 mt-[20px] pl-0.5 text-[20px] leading-[1.5] font-semibold">
        {t('my.documents.basic')}
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
        {t('my.documents.employment')}
      </h2>
      <div className="mt-[23px]">
        <DocumentRow
          document={STUDENT_EMPLOYMENT_DOCUMENT}
          onClick={onDocumentClick}
        />
      </div>

      <div className="mt-[10px] flex h-[80px] items-center rounded-[20px] bg-[#E6E8E9] px-[21px]">
        <img
          alt=""
          className="h-[51px] w-[52px] shrink-0 object-contain"
          src={registrationEmploymentIcon}
        />
        <p className="m-0 ml-[14px] text-[13px] leading-[1.5] font-medium text-[#1D1F20]">
          {t('my.documents.employmentDescription').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
        </p>
      </div>
    </section>
  );
}
