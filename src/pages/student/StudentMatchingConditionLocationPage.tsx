import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import locationIcon from '../../assets/icons/student/location.svg';
import searchIcon from '../../assets/icons/student/search.svg';
import type { WorkLocation } from '../../types/workLocation';

type StudentMatchingConditionLocationPageProps = {
  initialLocation: WorkLocation;
  onBack: () => void;
  onSave: (location: WorkLocation) => void;
};

export default function StudentMatchingConditionLocationPage({
  initialLocation,
  onBack,
  onSave,
}: StudentMatchingConditionLocationPageProps) {
  const [draftAddress, setDraftAddress] = useState(initialLocation.address);

  const handleCurrentLocationClick = () => {
    setDraftAddress('강남역');
  };

  const handleSave = () => {
    onSave({ ...initialLocation, address: draftAddress });
  };

  return (
    <main className="mx-auto h-[844px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-[36px] text-[26px] leading-[1.5] font-normal">
        원하는 근무 희망위치를
        <br />
        입력해주세요.
      </h1>

      <label className="mt-[35px] block">
        <span className="block text-[17px] leading-[1.5]">주소</span>
        <span className="mt-0 flex h-[58px] items-center border-b border-[#D1D6DB]">
          <img alt="" className="size-[22px] shrink-0" src={searchIcon} />
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent pl-[14px] text-[26px] leading-[1.5] font-normal outline-none placeholder:text-[#B0B8C1]"
            placeholder="주소 검색"
            value={draftAddress}
            onChange={(event) => setDraftAddress(event.target.value)}
          />
        </span>
      </label>

      <button
        className="mx-[2px] mt-[15px] flex h-[54px] w-[340px] items-center gap-4 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[23px] text-left text-[17px] leading-[1.5]"
        type="button"
        onClick={handleCurrentLocationClick}
      >
        <img alt="" className="size-[14px]" src={locationIcon} />
        현재 위치로 찾기
      </button>

      <button
        className="mt-[355px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={handleSave}
      >
        수정하기
      </button>
    </main>
  );
}
