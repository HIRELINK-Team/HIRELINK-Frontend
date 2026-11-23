import backIcon from '../../../assets/icons/student/documents/back.svg';
import { useTranslation } from 'react-i18next';
import guideIllustration from '../../../assets/images/student/documents/guide-illustration.png';
import { STUDENT_DOCUMENT_GUIDE_ITEMS } from '../../../mocks/studentDocuments';

type DocumentManagementGuideProps = {
  onBack: () => void;
  onStart: () => void;
};

export function DocumentManagementGuide({
  onBack,
  onStart,
}: DocumentManagementGuideProps) {
  const { t } = useTranslation();
  return (
    <main className="relative mx-auto h-[100dvh] max-h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-5 font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]">
      <button
        aria-label={t('common.back')}
        className="-ml-2 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <img
        alt=""
        className="student-3d-illustration mx-auto mt-1 h-[clamp(67px,11.5dvh,97px)] w-[clamp(59px,10.1dvh,85px)] object-contain"
        src={guideIllustration}
      />
      <h1 className="m-0 mt-[clamp(4px,1.1dvh,9px)] text-center text-[clamp(18px,2.37dvh,20px)] leading-[1.5] font-semibold">
        {t('my.documents.guideTitle').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
      </h1>
      <p className="m-0 mt-[clamp(2px,0.83dvh,7px)] text-center text-[clamp(11px,1.54dvh,13px)] leading-[1.5] text-[#909597]">
        {t('my.documents.guideDescription').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
      </p>

      <section
        aria-label={t('my.registrationGuide')}
        className="mt-[clamp(12px,3.55dvh,30px)] space-y-[clamp(10px,1.9dvh,16px)]"
      >
        {STUDENT_DOCUMENT_GUIDE_ITEMS.slice(0, 3).map((item, index) => (
          <article
            className="flex h-[clamp(64px,9.83dvh,83px)] items-center rounded-[20px] bg-[#E6E8E9] px-[clamp(18px,3dvh,25px)]"
            key={item.title}
          >
            <img
              alt=""
              className="h-[clamp(30px,5dvh,42px)] w-[clamp(31px,5.1dvh,43px)] shrink-0 object-contain"
              src={item.icon}
            />
            <div className="ml-[clamp(11px,2dvh,17px)] min-w-0">
              <h2 className="m-0 text-[clamp(13px,1.78dvh,15px)] leading-[1.5] font-semibold">
                {t(`my.documentBenefits.${index}.title`)}
              </h2>
              <p className="m-0 mt-[clamp(0px,0.48dvh,4px)] text-[clamp(10px,1.42dvh,12px)] leading-normal text-[#909597]">
                {t(`my.documentBenefits.${index}.description`)}
              </p>
            </div>
          </article>
        ))}
      </section>

      <button
        className="absolute right-6 bottom-[clamp(20px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] p-0 text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onStart}
      >
        {t('my.documents.guideAction')}
      </button>
    </main>
  );
}
