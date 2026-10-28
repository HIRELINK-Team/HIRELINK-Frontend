## 1. 기본 개발 환경

| 구분 | 기술 |
| --- | --- |
| Framework | React |
| Language | TypeScript |
| Routing | React Router |
| 다국어 | react-i18next / i18next |
| Code Quality | ESLint |
| Formatter | Prettier |
| Version Control | Git / GitHub |
| Design | Figma |

모든 React Component는 기본적으로 **TypeScript를 사용하여 `.tsx` 파일로 작성**

---

## 2. 파일 및 폴더 네이밍 컨벤션

### 컴포넌트

React 컴포넌트 파일은 PascalCase 사용

```
JobCard.tsx
ApplicantCard.tsx
CountdownTimer.tsx
BottomNavigation.tsx
EmployerDashboard.tsx
```

Component 이름과 파일 이름은 동일하게 작성

```
// JobCard.tsx

function JobCard() {
  return <div>...</div>;
}

export default JobCard;
```

### 일반 TypeScript 파일

일반 `.ts` 파일은 camelCase 사용

```
jobs.ts
applications.ts
formatTime.ts
useCountdown.ts
```

### 폴더

폴더 이름은 기본적으로 소문자 사용

```
components/
pages/
hooks/
types/
api/
utils/
constants/
assets/
locales/
```

기능에 따라 다음과 같이 분리

```
components/
├─ common/
├─ student/
├─ employer/
├─ job/
└─ application/
```

---

## 3. 변수 및 함수 Naming Convention

변수와 함수는 camelCase 사용

```
const jobList = [];
const remainingTime = 3600;
const currentUser = {};
```

함수 이름은 기능을 알 수 있도록 동사로 시작

```
fetchJobs();
getRemainingTime();
calculateMatchRate();
```

사용자 이벤트를 처리하는 함수는 `handle + 행동` 형태 사용

```
handleClick();
handleSubmit();
handleApply();
handleCancel();
handleJobSelect();
handleLanguageChange();
```

Boolean 값은 상태를 명확하게 알 수 있도록 작성

```
isLoading;
isOpen;
isSelected;
isExpired;
isDisabled;
hasApplied;
```

---

## 4. 상수 Naming Convention

고정된 값은 코드에 직접 반복해서 작성하지 않고 상수로 관리

상수 이름은 UPPER_SNAKE_CASE 사용

```
const MAX_RECOMMENDED_JOBS = 3;
const MAX_ACTIVE_APPLICATIONS = 3;
const MAX_REVIEWING_APPLICANTS = 5;
const RESPONSE_TIME_LIMIT_HOURS = 24;
```

---

## 5. TypeScript Convention

가능한 경우 `any` 사용을 피하고 데이터의 타입을 명확하게 정의

공통 데이터 타입은 `types/` 폴더에서 관리

```
types/
├─ user.ts
├─ job.ts
└─ application.ts
```

예:

```
export interface Job {
  id: number;
  businessName: string;
  jobType: JobType;
  wage: number;
  startTime: string;
  endTime: string;
}
```

정해진 값 중 하나만 사용할 수 있는 상태는 **Union Type**으로 관리

```
export type ApplicationStatus =
  | "REVIEWING"
  | "OFFER_WAITING"
  | "HIRED"
  | "REJECTED"
  | "EMPLOYER_EXPIRED"
  | "STUDENT_EXPIRED"
  | "CANCELED";
```

Component Props에도 타입 정의

```
interface JobCardProps {
  job: Job;
  onClick: () => void;
}

function JobCard({ job, onClick }: JobCardProps) {
  return <div onClick={onClick}>...</div>;
}
```

백엔드 API 명세가 확정되면 Request / Response 데이터 구조에 맞춰 타입 정의

---

## 6. Component Convention

컴포넌트는 가능한 한 하나의 역할만 담당하도록 작성

아래처럼 `JobCard` 하나에 모든 로직을 넣기보다 필요한 경우 기능 분리

```
JobCard
├─ MatchRate
├─ MatchReasonList
├─ JobInfo
└─ ApplyButton
```

여러 화면에서 반복적으로 사용되는 UI는 공통 컴포넌트로 분리

```
Button
Modal
CountdownTimer
EmptyState
LoadingSkeleton
```

Page 단위 Component는 이름 뒤에 `Page`를 붙임

```
JobListPage.tsx
JobDetailPage.tsx
ApplicationsPage.tsx
EmployerDashboardPage.tsx
```

---

## 7. API Convention

API 요청 로직은 Page Component 안에 직접 길게 작성하지 않고 `api/` 폴더로 분리

```
api/
├─ jobs.ts
├─ applications.ts
├─ students.ts
└─ employers.ts
```

Page에서는 다음과 같이 사용

```
const jobs = await getRecommendedJobs();
```

백엔드의 API 명세가 확정되면 Endpoint, Request, Response 구조를 백엔드와 동일하게 맞춤

HTTP 통신은 Axios를 기본으로 사용한다.

공통 Axios 설정은 별도의 Client 또는 Instance로 관리한다.

예:

src/api/
├─ client.ts
├─ jobs.ts
├─ applications.ts
├─ students.ts
└─ employers.ts

---

## 8. Import Convention

Import 순서는 다음 순서를 기본으로 함

```
// 1. 외부 라이브러리
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Component
import JobCard from "@/components/job/JobCard";

// 3. hooks / api / utils
import { useCountdown } from "@/hooks/useCountdown";
import { getRecommendedJobs } from "@/api/jobs";

// 4. Type
import type { Job } from "@/types/job";

// 5. Style
import "./JobListPage.css";
```

같은 종류의 Import는 가능한 한 가까이 배치

---

## 9. ESLint/Prettier Convention

ESLint는 코드의 오류와 일관성을 검사하는 용도로 사용

PR 또는 Merge 전에는 가능한 한 ESLint 오류가 없는 상태 유지

Prettier는 코드의 형식을 자동으로 통일하기 위해 사용

들여쓰기, 줄바꿈, 공백, 따옴표, 세미콜론, 코드 정렬 등은 팀원이 직접 스타일을 맞추기보다 Prettier 설정을 따름

---

## 10. Git Branch Convention

기본 Branch 구조는 다음과 같이 사용

```
main
develop
```

기능 개발 및 수정은 별도의 Branch에서 진행

```
feature/기능명
fix/버그명
refactor/대상
```

최종적으로 안정된 버전을 `main`에 Merge

---

## 11. Commit Convention

Commit Message는 다음 Prefix를 기본으로 사용

| Prefix | 의미 | 예시 |
| --- | --- | --- |
| `feat` | 새로운 기능 | `feat: 추천 공고 카드 구현` |
| `fix` | 버그 수정 | `fix: 지원 타이머 오류 수정` |
| `style` | UI 및 스타일 수정 | `style: 하단 네비게이션 간격 수정` |
| `refactor` | 코드 구조 개선 | `refactor: 공고 API 로직 분리` |
| `docs` | 문서 수정 | `docs: README 작성` |
| `chore` | 환경설정 등 | `chore: eslint 설정 추가` |

형식:

```
type: 작업 내용
```

Commit Message 언어는 한국어로 통일

---

## 12. Pull Request Convention

PR에는 최소한 다음 내용을 작성

```
## 작업 내용
- 추천 공고 카드 구현
- 공고 일치율 UI 구현
- 공고 상세 페이지 연결

## 확인 사항
- 모바일 화면 확인
- 카드 클릭 시 상세 페이지 이동 확인
- ESLint 오류 확인

## 관련 화면
- 필요한 경우 Screenshot
```

가능한 경우 다른 Frontend 팀원이 코드를 확인한 후 Merge

---

## 13. Styling Convention

Styling은 Tailwind CSS를 기본으로 사용한다.

Figma의 디자인 시스템을 기준으로 색상, 글꼴, 간격 등을 최대한 공통으로 관리한다.

- 기본적인 Layout 및 Styling은 Tailwind CSS Utility Class 사용
- 동일한 UI가 반복되는 경우 Component로 분리
- 동일한 디자인 값을 페이지마다 반복해서 작성하지 않기
- Figma의 공통 색상, Typography, Spacing은 가능한 한 공통 디자인 값으로 관리
- Tailwind로 표현하기 지나치게 복잡한 Animation 또는 특수 Styling은 별도 CSS 사용 가능
- 새로운 Styling Library는 팀 협의 없이 추가하지 않음

---

## 14. 다국어 Convention

최종 서비스에서 다국어 기능을 제공하기 위해 `react-i18next` 사용

고정된 UI Text는 가능한 한 Component에 직접 작성하지 않고 Translation Key 사용

```
// 지양
<button>지원하기</button>
```

```
// 권장
<button>{t("application.apply")}</button>
```

Translation Key는 기능별로 구분

```
application.apply
application.cancel
application.waiting

job.wage
job.workTime
job.location

common.confirm
common.cancel
```

직무·업종·한국어 수준 등 구조화된 값도 코드값으로 관리한 뒤 i18n으로 표시

```
BARISTA
→ 바리스타
→ Barista
```

사업장명처럼 고유명사에 해당하는 데이터는 원문 유지

---

## 15. AI 활용 Convention

AI가 생성한 코드도 일반 코드와 동일한 품질 기준을 적용

- React + TypeScript를 기준으로 생성
- `.tsx` / `.ts` 파일 사용
- 기존 프로젝트 구조와 Naming Convention 준수
- 불필요한 `any` 사용 지양
- 기존 Component가 있는 경우 재사용
- ESLint 오류를 남기지 않도록 확인
- Prettier Formatting 적용
- 구현 후 실제 화면 및 기능 직접 확인
- 이해하지 못한 코드를 검토 없이 바로 Merge하지 않기

---

규칙이 실제 개발 과정에서 과도하게 복잡하거나 비효율적이라고 판단될 경우 팀원 간 협의를 통해 수정