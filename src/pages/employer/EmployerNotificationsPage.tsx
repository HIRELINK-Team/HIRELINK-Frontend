import { useMemo, useState } from "react";
import { EMPLOYER_NOTIFICATION_MOCKS } from "../../data/employerNotificationsData";
import type { EmployerNotificationCategory } from "../../types/employerNotification";

type NotificationFilter = "ALL" | EmployerNotificationCategory;

const FILTERS: Array<{ value: NotificationFilter; label: string }> = [
  { value: "ALL", label: "전체" },
  { value: "NEW_APPLICANT", label: "신규 지원자" },
  { value: "OFFER_ACCEPTED", label: "채용 제안 수락" },
  { value: "VISA", label: "유학생 비자" },
];

function EmployerNotificationsPage() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("ALL");

  const notifications = useMemo(
    () =>
      selectedFilter === "ALL"
        ? EMPLOYER_NOTIFICATION_MOCKS
        : EMPLOYER_NOTIFICATION_MOCKS.filter(
            (notification) => notification.category === selectedFilter,
          ),
    [selectedFilter],
  );

  return (
    <div className="w-full pt-[45px] pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          알림
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          새로운 소식과 채용 진행 상황을 확인하세요
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.value;
          const count =
            filter.value === "ALL"
              ? EMPLOYER_NOTIFICATION_MOCKS.length
              : EMPLOYER_NOTIFICATION_MOCKS.filter(
                  (notification) => notification.category === filter.value,
                ).length;

          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedFilter(filter.value)}
              className={`h-8 cursor-pointer rounded-full px-5 text-[15px] transition-colors ${
                isSelected
                  ? "border border-[#006e59] bg-[#e5f8f3] text-[#006e59] shadow-[0_2px_3px_rgba(46,108,90,0.1)]"
                  : "bg-white text-[#242424] shadow-[0_2px_3px_rgba(0,0,0,0.1)] hover:bg-[#f7f7f8]"
              }`}
            >
              {filter.label}
              {filter.value === "ALL" && (
                <span className="ml-1 font-semibold">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {notifications.map((notification) => (
          <article
            key={notification.id}
            className={`relative flex h-[85px] items-center rounded-xl border border-[rgba(112,115,124,0.16)] px-6 ${
              notification.isRead
                ? "bg-[#f2f3f5]"
                : "bg-white shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]"
            }`}
          >
            <div className="size-10 shrink-0 rounded-full bg-[#e1e2e4]" />
            <div className="ml-[13px] min-w-0">
              <p className="truncate text-base font-semibold text-[#171719]">
                {notification.message}
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-[#70737c]">
                {notification.occurredAt} ·{" "}
                {notification.isRead ? "읽음" : "안읽음"}
              </p>
            </div>
            {!notification.isRead && (
              <span
                aria-label="안 읽음"
                className="ml-auto size-2 shrink-0 rounded-full bg-[#00b894]"
              />
            )}
          </article>
        ))}

        {notifications.length === 0 && (
          <div className="rounded-xl border border-[rgba(112,115,124,0.16)] py-14 text-center text-sm text-[#70737c]">
            표시할 알림이 없어요
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerNotificationsPage;
