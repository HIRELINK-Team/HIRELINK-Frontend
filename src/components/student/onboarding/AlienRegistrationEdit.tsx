import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import errorIcon from '../../../assets/icons/student/documents/alien-registration/review-error.svg';

export type AlienRegistrationFormValues = {
  expiryDate: string;
  issueDate: string;
  name: string;
  nationality: string;
  registrationNumber: string;
  residenceQualification: string;
  serialNumber: string;
};

export type AlienRegistrationField = keyof AlienRegistrationFormValues;

type AlienRegistrationEditProps = {
  errors?: Partial<Record<AlienRegistrationField, string>>;
  onBack: () => void;
  onChange: (field: AlienRegistrationField, value: string) => void;
  onSubmit: () => void;
  values: AlienRegistrationFormValues;
};

const FORM_FIELDS: ReadonlyArray<{ field: AlienRegistrationField; label: string }> = [
  { field: 'name', label: '성명' },
  { field: 'nationality', label: '국적' },
  { field: 'residenceQualification', label: '체류자격' },
  { field: 'registrationNumber', label: '외국인등록번호' },
  { field: 'issueDate', label: '발급일자' },
  { field: 'serialNumber', label: '뒷면 일련번호' },
  { field: 'expiryDate', label: '체류기간 만료일' },
];

export function AlienRegistrationEdit({ errors, onBack, onChange, onSubmit, values }: AlienRegistrationEditProps) {
  return (
    <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-y-auto bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative min-h-[1048px] pb-[36px]">
        <button
          aria-label="뒤로가기"
          className="absolute top-[61px] left-[18px] grid size-8 place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>

        <h1 className="absolute top-[112px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">정보 수정하기</h1>

        <form
          className="absolute top-[190px] left-6 w-[342px]"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {FORM_FIELDS.map(({ field, label }) => {
            const error = errors?.[field];

            return (
              <label className="mb-5 block last:mb-0" key={field}>
                <span className="mb-[9px] block text-[15px] leading-[1.5]">{label}</span>
                <input
                  className={`h-14 w-full rounded-[15px] bg-[#E5E8EB] px-[25px] text-[17px] leading-[1.5] outline-none ${error ? 'border-[1.5px] border-[#E05260]' : 'border border-transparent'}`}
                  type="text"
                  value={values[field]}
                  onChange={(event) => onChange(field, event.target.value)}
                />
                {error ? (
                  <span className="mt-2 flex items-center gap-2 text-[15px] leading-[1.5] text-[#E05260]">
                    <img alt="" className="size-[12px]" src={errorIcon} />
                    {error}
                  </span>
                ) : null}
              </label>
            );
          })}

          <button className="mt-6 h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]" type="submit">
            확인
          </button>
        </form>
      </div>
    </main>
  );
}
