import { NavLink, Outlet, useLocation } from "react-router-dom";
import hirelinkLogo from "../../assets/hirelink-logo.svg";
import applicantsActiveIcon from "../../assets/employer/applicants-active.svg";
import applicantsIcon from "../../assets/employer/applicants.svg";
import bellIcon from "../../assets/employer/bell.svg";
import dashboardActiveIcon from "../../assets/employer/dashboard-active.svg";
import dashboardIcon from "../../assets/employer/dashboard.svg";
import hiredStudentsActiveIcon from "../../assets/employer/hired-students-active.svg";
import hiredStudentsIcon from "../../assets/employer/hired-students.svg";
import jobsActiveIcon from "../../assets/employer/jobs-active.svg";
import jobsIcon from "../../assets/employer/jobs.svg";
import mypageActiveIcon from "../../assets/employer/mypage-active.svg";
import mypageIcon from "../../assets/employer/mypage.svg";
import settingsIcon from "../../assets/employer/settings.svg";

const NAVIGATION_ITEMS = [
  {
    label: "대시보드",
    to: "/employer/dashboard",
    icon: dashboardIcon,
    activeIcon: dashboardActiveIcon,
  },
  {
    label: "채용 공고",
    to: "/employer/jobs",
    icon: jobsIcon,
    activeIcon: jobsActiveIcon,
  },
  {
    label: "지원자",
    to: "/employer/applicants",
    icon: applicantsIcon,
    activeIcon: applicantsActiveIcon,
  },
  {
    label: "채용 유학생",
    to: "/employer/hired",
    icon: hiredStudentsIcon,
    activeIcon: hiredStudentsActiveIcon,
  },
  {
    label: "마이페이지",
    to: "/employer/mypage",
    icon: mypageIcon,
    activeIcon: mypageActiveIcon,
  },
] as const;

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-between border-b border-[#e1e2e4] bg-white px-6">
      <NavLink
        to="/employer/dashboard"
        aria-label="HIRELINK 사업주 대시보드"
        className="flex items-center"
      >
        <img
          src={hirelinkLogo}
          alt=""
          width={183}
          height={27}
          className="block"
        />
      </NavLink>

      <div className="flex items-center gap-2">
        <NavLink
          to="/employer/notifications"
          aria-label="알림"
          className={({ isActive }) =>
            `flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed] ${isActive ? "bg-[#f2f3f5]" : ""}`
          }
        >
          <img src={bellIcon} alt="" width={24} height={24} />
        </NavLink>
        <NavLink
          to="/employer/settings"
          aria-label="설정"
          className={({ isActive }) =>
            `flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed] ${isActive ? "bg-[#f2f3f5]" : ""}`
          }
        >
          <img src={settingsIcon} alt="" width={24} height={24} />
        </NavLink>
      </div>
    </header>
  );
}

function Sidebar() {
  const location = useLocation();
  const isApplicantsRoute =
    location.pathname.startsWith("/employer/applicants") ||
    (/^\/employer\/jobs\/[^/]+\/applicants$/.test(location.pathname) ?? false);

  const isNavigationItemActive = (itemPath: string) => {
    if (itemPath === "/employer/applicants") return isApplicantsRoute;

    if (itemPath === "/employer/jobs") {
      return (
        location.pathname.startsWith("/employer/jobs") && !isApplicantsRoute
      );
    }

    return (
      location.pathname === itemPath ||
      location.pathname.startsWith(`${itemPath}/`)
    );
  };

  return (
    <aside className="fixed top-16 bottom-0 left-0 z-10 w-[230px] border-r border-[#e1e2e4] bg-white px-3 pt-10">
      <nav aria-label="사업주 메뉴">
        <ul className="flex flex-col gap-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isCurrent = isNavigationItemActive(item.to);

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/employer/dashboard"}
                  className={() => {
                    return `flex h-11 items-center gap-3 rounded-lg px-5 text-sm transition-colors ${
                      isCurrent
                        ? "bg-[#e8f7f3] font-semibold text-[#2e6c5a]"
                        : "font-medium text-[#6d7683] hover:bg-[#f4f4f5] hover:text-[#4e5259] active:bg-[#eceef0]"
                    }`;
                  }}
                >
                  {() => (
                    <>
                      <img
                        src={isCurrent ? item.activeIcon : item.icon}
                        alt=""
                        width={24}
                        height={24}
                        className="block shrink-0"
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function EmployerLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Sidebar />
      <main className="min-h-screen pl-[230px] pt-16">
        <div className="mx-auto w-full max-w-[1050px] px-6 xl:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default EmployerLayout;
