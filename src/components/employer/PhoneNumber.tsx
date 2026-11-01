interface PhoneNumberProps {
  value: string;
  className?: string;
}

function PhoneNumber({ value, className = "" }: PhoneNumberProps) {
  const handleCopy = () => {
    void navigator.clipboard?.writeText(value);
  };

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap ${className}`}
    >
      <span>{value}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${value} 복사`}
        className="relative size-[16px] shrink-0 cursor-pointer"
      >
        <span className="absolute top-0 left-0 size-3 border border-[#70737c] bg-white" />
        <span className="absolute top-1 left-1 size-3 border border-[#70737c] bg-[#e1e2e4]" />
      </button>
    </span>
  );
}

export default PhoneNumber;
