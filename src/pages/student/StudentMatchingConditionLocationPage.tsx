import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { WorkLocationRadiusMap } from '../../components/student/onboarding/WorkLocationRadiusMap';
import locationIcon from '../../assets/icons/student/location.svg';
import searchIcon from '../../assets/icons/student/search.svg';
import type { WorkLocation } from '../../types/workLocation';

type StudentMatchingConditionLocationPageProps = {
  initialLocation: WorkLocation;
  onBack: () => void;
  onSave: (location: WorkLocation) => boolean | Promise<boolean | void> | void;
};

export default function StudentMatchingConditionLocationPage({
  initialLocation,
  onBack,
  onSave,
}: StudentMatchingConditionLocationPageProps) {
  const [draftAddress, setDraftAddress] = useState(initialLocation.address);
  const [draftRadius, setDraftRadius] = useState(initialLocation.radius);
  const [isRadiusMapOpen, setIsRadiusMapOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCurrentLocationClick = () => {
    setDraftAddress('강남역');
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await onSave({
        ...initialLocation,
        address: draftAddress,
        radius: draftRadius,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isRadiusMapOpen) {
    return (
      <WorkLocationRadiusMap
        address={draftAddress}
        radius={draftRadius}
        radiusOptions={[100, 500, 1000]}
        onBack={() => setIsRadiusMapOpen(false)}
        onConfirm={() => void handleSave()}
        onRadiusChange={setDraftRadius}
      />
    );
  }

  return (
    <main className="relative mx-auto h-[100dvh] max-h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-5 font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-[clamp(24px,4.27dvh,36px)] text-[clamp(22px,3.08dvh,26px)] leading-[1.5] font-semibold">
        원하는 근무 희망위치를
        <br />
        입력해 주세요.
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
        className="absolute right-6 bottom-[clamp(20px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        disabled={isSaving || !draftAddress.trim()}
        onClick={() => setIsRadiusMapOpen(true)}
      >
        수정하기
      </button>
    </main>
  );
}
