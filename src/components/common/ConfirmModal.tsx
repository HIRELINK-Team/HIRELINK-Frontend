import type { ReactNode } from 'react';

interface ConfirmModalProps {
  title: string;
  children: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isCancelDisabled?: boolean;
  isConfirmDisabled?: boolean;
}

function ConfirmModal({
  title,
  children,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  isCancelDisabled = false,
  isConfirmDisabled = false,
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-[480px] rounded-2xl bg-white px-8 py-8 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
        <h2
          id="confirm-modal-title"
          className="text-[22px] leading-normal font-semibold text-[#171719]"
        >
          {title}
        </h2>
        {children}
        <div
          className={`mt-6 grid gap-3 ${cancelLabel ? 'grid-cols-2' : 'grid-cols-1'}`}
        >
          {cancelLabel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isCancelDisabled}
              className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-[rgba(112,115,124,0.32)] bg-white px-6 text-lg font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed] disabled:cursor-not-allowed disabled:text-[#8b95a1]"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#00b894] px-6 text-lg font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a] disabled:cursor-not-allowed disabled:bg-[#c7cbd1]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
