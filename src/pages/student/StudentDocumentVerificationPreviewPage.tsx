import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import badgeImage from '../../assets/images/student/documents/verification/badge-issued.png';
import profileImage from '../../assets/images/student/my/profile.png';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';

function VerifiedMyPage() {
  return (
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[62px] pb-[120px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">마이</h1>
      <p className="m-0 mt-[1px] text-[15px] leading-[1.5] text-[#8B95A1]">
        오늘도 좋은 일자리를 찾아볼까요?
      </p>
      <section className="mt-[23px] flex items-center">
        <img
          alt=""
          className="h-[66px] w-[66px] object-contain"
          src={profileImage}
        />
        <div className="ml-6">
          <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
            김숭실
          </h2>
          <p className="m-0 mt-1 text-[13px] leading-[1.5] text-[#8B95A1]">
            D-2-2&nbsp;&nbsp;|&nbsp;&nbsp;TOPIK 4급
          </p>
        </div>
      </section>
      <section className="mt-[27px] rounded-[20px] bg-[#E5E8EB] px-6 py-5">
        <p className="m-0 text-[17px] leading-[1.5] font-bold">
          서류 인증이 완료되었어요
        </p>
        <p className="m-0 mt-1 text-[13px] leading-[1.5] text-[#8B95A1]">
          인증된 정보를 바탕으로 더 정확한 일자리를 추천해드려요.
        </p>
      </section>
      <section className="-mx-6 mt-[29px] border-y border-[#E5E8EB]">
        {['내 정보 관리', '서류 관리', '매칭 조건 관리'].map((title) => (
          <button
            className="flex h-[79px] w-full items-center border-0 border-b border-[#E5E8EB] bg-transparent px-6 text-left last:border-b-0"
            key={title}
            type="button"
          >
            <span className="flex-1">
              <strong className="block text-[15px] leading-[1.5]">
                {title}
              </strong>
              <span className="block text-[13px] leading-[1.5] text-[#8B95A1]">
                인증 완료된 정보를 확인할 수 있어요
              </span>
            </span>
            <span className="text-[26px] text-[#8B95A1]">›</span>
          </button>
        ))}
      </section>
      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="my"
      />
    </main>
  );
}

function BadgeIssuedPage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <main
      className="mx-auto flex w-full max-w-[430px] flex-col bg-[#F5F5F5] px-6 pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      style={{
        background: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        marginInline: 'auto',
        maxWidth: 430,
        minHeight: 'max(100vh, 844px)',
        padding: '61px 24px 0',
        width: '100%',
      }}
    >
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        style={{
          display: 'grid',
          height: 32,
          marginLeft: -10,
          placeItems: 'center',
          width: 32,
        }}
        type="button"
      >
        <img
          alt=""
          className="h-4 w-2"
          src={backIcon}
          style={{ height: 16, width: 8 }}
        />
      </button>
      <section
        className="mt-[166px] flex flex-col items-center"
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 166,
        }}
      >
        <img
          alt=""
          className="h-[123px] w-[121px] object-contain"
          style={{ height: 123, objectFit: 'contain', width: 121 }}
          src={badgeImage}
        />
        <h1
          className="m-0 mt-[23px] text-center text-[26px] leading-[1.5] font-semibold"
          style={{
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.5,
            margin: '23px 0 0',
            textAlign: 'center',
          }}
        >
          뱃지가 발급되었어요!
        </h1>
        <p
          className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]"
          style={{
            color: '#8B95A1',
            fontSize: 13,
            lineHeight: 1.5,
            margin: '6px 0 0',
            textAlign: 'center',
          }}
        >
          이제 더 정확하게 일자리를
          <br />
          추천받을 수 있어요!
        </p>
      </section>
      <button
        className="mt-auto mb-[86px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] font-medium text-[#F5F5F5]"
        style={{
          background: '#00B894',
          borderRadius: 15,
          color: '#F5F5F5',
          fontSize: 20,
          fontWeight: 500,
          height: 57,
          lineHeight: 1.5,
          marginBottom: 86,
          marginTop: 'auto',
          width: '100%',
        }}
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}

export default function StudentDocumentVerificationPreviewPage() {
  const [view, setView] = useState<'badge' | 'my'>('badge');
  return view === 'badge' ? (
    <BadgeIssuedPage onConfirm={() => setView('my')} />
  ) : (
    <VerifiedMyPage />
  );
}
