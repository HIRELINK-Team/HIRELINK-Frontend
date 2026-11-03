import type { EmployerMockAccount } from "../types/employerAuth";

const MOCK_ACCOUNT_STORAGE_KEY = "hirelink-employer-mock-account";

export function getMockEmployerAccount(): EmployerMockAccount | null {
  const storedAccount = window.sessionStorage.getItem(MOCK_ACCOUNT_STORAGE_KEY);
  if (!storedAccount) {
    return null;
  }

  try {
    return JSON.parse(storedAccount) as EmployerMockAccount;
  } catch {
    return null;
  }
}

export function createMockEmployerAccount(account: EmployerMockAccount) {
  window.sessionStorage.setItem(
    MOCK_ACCOUNT_STORAGE_KEY,
    JSON.stringify(account),
  );
}

export function isMockEmployerAccountValid(account: EmployerMockAccount) {
  const storedAccount = getMockEmployerAccount();

  return (
    storedAccount?.email === account.email &&
    storedAccount.password === account.password
  );
}
