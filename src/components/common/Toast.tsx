interface ToastProps {
  message: string;
}

function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-9 left-1/2 z-40 min-w-[334px] -translate-x-1/2 rounded-md bg-[#d8d8d8] px-6 py-2.5 text-center text-sm font-medium text-[#171719] shadow-sm"
    >
      {message}
    </div>
  );
}

export default Toast;
