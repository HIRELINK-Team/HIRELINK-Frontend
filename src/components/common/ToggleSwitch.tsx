interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}

function ToggleSwitch({ checked, onChange, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-[#00b894]" : "bg-[#d5d9df]"
      }`}
    >
      <span
        className={`absolute top-[3px] size-[18px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

export default ToggleSwitch;
