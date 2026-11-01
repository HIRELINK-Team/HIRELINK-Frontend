import hirelinkLogoIcon from '../../assets/images/student/entry/hirelink-logo.svg';
import hirelinkWordmark from '../../assets/images/student/entry/hirelink-wordmark.svg';

/** Renders the student app splash screen before entry onboarding. */
export default function StudentSplashPage() {
  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#0FC9A2]">
      <div className="absolute top-[42.18%] left-1/2 h-[35.666px] w-[226px] -translate-x-[113px] text-[#F5F5F5]">
        <img
          alt=""
          className="absolute top-0 left-0 h-[35.666px] w-[37.442px]"
          src={hirelinkLogoIcon}
        />
        <img
          alt="HIRELINK"
          className="absolute top-[3.93px] left-[45.82px] h-8 w-[181px]"
          src={hirelinkWordmark}
        />
      </div>
    </main>
  );
}
