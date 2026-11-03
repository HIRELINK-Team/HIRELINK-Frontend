import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import hirelinkBigLogo from "../../assets/hirelink-biglogo.svg";
import hirelinkTextLogo from "../../assets/hirelink-text.svg";

interface EmployerAuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

function EmployerAuthLayout({
  title,
  description,
  children,
}: EmployerAuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center">
        <Link
          to="/"
          aria-label="HIRELINK 로그인 선택 화면으로 이동"
          className="flex flex-col items-center"
        >
          <img
            src={hirelinkBigLogo}
            alt=""
            className="h-[118px] w-[124px] object-contain"
          />
          <img
            src={hirelinkTextLogo}
            alt="HIRELINK"
            className="mt-4 h-[42px] w-[236px] object-contain"
          />
        </Link>

        <header className="mt-12 w-full text-center">
          <h1 className="text-[28px] leading-9 font-semibold tracking-[-0.28px] text-[#171719]">
            {title}
          </h1>
          <p className="mt-2 text-base leading-6 text-[#6d7683]">
            {description}
          </p>
        </header>

        <div className="mt-10 w-full">{children}</div>
      </div>
    </main>
  );
}

export default EmployerAuthLayout;
