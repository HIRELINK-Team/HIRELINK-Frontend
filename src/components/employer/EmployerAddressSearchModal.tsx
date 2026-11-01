import { useEffect, useMemo, useState } from "react";
import type { EmployerAddressMock } from "../../types/employerProfile";

interface EmployerAddressSearchModalProps {
  addresses: EmployerAddressMock[];
  onClose: () => void;
  onSelect: (address: EmployerAddressMock) => void;
}

function EmployerAddressSearchModal({
  addresses,
  onClose,
  onSelect,
}: EmployerAddressSearchModalProps) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const filteredAddresses = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) return addresses;

    return addresses.filter((address) =>
      `${address.roadAddress} ${address.lotAddress} ${address.postalCode}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [addresses, searchTerm]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(query);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="address-search-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[640px] rounded-2xl bg-white px-8 pt-8 pb-7 shadow-[0_8px_24px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between">
          <h2
            id="address-search-title"
            className="text-[22px] font-semibold text-[#171719]"
          >
            주소 검색
          </h2>
          <button
            type="button"
            aria-label="주소 검색 닫기"
            onClick={onClose}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#70737c] transition-colors hover:bg-[#f4f4f5] hover:text-[#171719]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
              <path
                d="m6 6 12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-1.5 text-sm leading-6 text-[#70737c]">
          도로명, 건물명 또는 지번으로 검색해 주세요.
        </p>

        <form className="mt-6 flex gap-2" onSubmit={handleSearch}>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예) 월드컵북로, 상도로 369"
            aria-label="주소 검색어"
            className="h-[58px] min-w-0 flex-1 rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10"
          />
          <button
            type="submit"
            className="h-[58px] w-24 shrink-0 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
          >
            검색
          </button>
        </form>

        <div className="mt-5 min-h-[254px] border-t border-[#e1e2e4]">
          {filteredAddresses.length > 0 ? (
            <ul>
              {filteredAddresses.map((address) => (
                <li
                  key={address.id}
                  className="flex items-center gap-5 border-b border-[#e8eaed] py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#007a63]">
                      {address.postalCode}
                    </p>
                    <p className="mt-1 text-[15px] font-medium text-[#171719]">
                      {address.roadAddress}
                    </p>
                    <p className="mt-1 text-sm text-[#70737c]">
                      {address.lotAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelect(address)}
                    className="h-9 w-20 shrink-0 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
                  >
                    선택
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-sm text-[#70737c]">
              검색 결과가 없어요.
            </div>
          )}
        </div>

        <nav
          aria-label="주소 검색 결과 페이지"
          className="mt-5 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            disabled
            aria-label="이전 페이지"
            className="flex size-8 items-center justify-center rounded-lg text-[#c7cbd1]"
          >
            ‹
          </button>
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#e5f8f4] text-sm font-semibold text-[#007a63]">
            1
          </span>
          <button
            type="button"
            disabled
            aria-label="다음 페이지"
            className="flex size-8 items-center justify-center rounded-lg text-[#c7cbd1]"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}

export default EmployerAddressSearchModal;
