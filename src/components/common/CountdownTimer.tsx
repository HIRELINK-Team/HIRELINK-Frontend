import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: string;
  urgentThresholdHours?: number;
  sizeClassName?: string;
  className?: string;
}

function formatRemainingTime(expiresAt: string, now: number) {
  const remainingSeconds = Math.max(
    0,
    Math.floor((new Date(expiresAt).getTime() - now) / 1000),
  );
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    label: [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":"),
    remainingSeconds,
  };
}

function CountdownTimer({
  expiresAt,
  urgentThresholdHours = 2,
  sizeClassName = "text-xl",
  className = "",
}: CountdownTimerProps) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const { label, remainingSeconds } = formatRemainingTime(expiresAt, now);
  const isUrgent = remainingSeconds <= urgentThresholdHours * 3600;

  return (
    <span
      className={`${sizeClassName} leading-normal font-medium tabular-nums ${
        isUrgent ? "text-[#ff4242]" : "text-[#171719]"
      } ${className}`}
      aria-label={`${label} 남음`}
    >
      {label}
    </span>
  );
}

export default CountdownTimer;
