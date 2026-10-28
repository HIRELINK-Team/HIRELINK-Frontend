# 1. 개발 일정 및 범위

| 구분 | 일정 | 목표 |
| --- | --- | --- |
| **Beta MVP** | ~ 11월 7일 | 핵심 사용자 플로우 구현, 베타 데모 |
| **Final** | 11월 8일 ~ 12월 16일 | 기능명세서 전체 기능 구현, 서비스 고도화 |

### Beta MVP

유학생의 핵심 플로우는 다음 기능 우선 구현

`프로필·구직조건 입력 → 우선순위 설정 → 일자리 추천 → 공고 상세 → 지원 → 24시간 응답 확인 → 채용제안 수락·거절 → 채용완료`

사업주의 핵심 플로우는 다음 기능 우선 구현

`사업주·사업장 정보 입력 → 공고 등록 → 지원자 확인 → 24시간 내 채용제안·거절 → 제안 결과 확인 → 채용완료 유학생 관리`

### Final

소셜로그인, 알림, 언어 설정, 비자·자격 만료 관련 기능, 고객지원 및 계정관리 등 추가

---

# 2. 프론트엔드 구현 목표

학생과 사업주의 주요 사용환경이 다르기 때문에 **사용자 역할별로 다른 UX를 제공하는 것**을 목표로 함.

### 유학생 - Mobile Web App

유학생 서비스는 모바일 사용 중심으로 구현

- 단계형 온보딩을 통해 복잡한 조건을 쉽게 입력
- 카드 중심의 일자리 추천 UI
- 터치 기반 근무시간 입력 (Whentomeet 서비스 참고)
- Drag & Drop을 활용한 조건 우선순위 설정
- Bottom Navigation 기반 이동
- 지원 상태와 남은 응답시간을 한눈에 확인
- 모바일 앱과 유사한 인터랙션 제공

### 사업주 - Desktop Web

사업주 서비스는 PC 사용 중심으로 구현.

- Dashboard 중심의 채용 현황 제공
- Side Navigation 사용
- 공고 등록·수정 Form
- 지원자 List 및 상세 비교
- 한 화면에서 여러 공고와 지원자 확인
- Desktop의 넓은 화면을 활용한 정보 밀도 높은 UI

---

# 3. 기술 스택

| 구분 | 기술 | 사용 목적 |
| --- | --- | --- |
| Frontend | React | 컴포넌트 기반 UI 개발 |
| Language | TypeScript | 데이터 구조와 상태 타입 정의 및 오류 방지 |
| Routing | React Router | 유학생·사업주 페이지 라우팅 |
| Styling | Tailwind CSS | Figma 기반 UI 구현 |
| HTTP | Axios | Backend REST API 통신 |
| i18n | `react-i18next`, `i18next` | 최종 다국어 기능 구현 |
| Collaboration | Git / GitHub | 버전 관리 및 협업 |
| Design | Figma | UI 구현 기준 |

---

# 4. 사용자 역할

```
type UserRole = "STUDENT" | "EMPLOYER";
```

### STUDENT

외국인 유학생

`프로필 입력 → 구직조건 설정 → 공고 추천 → 지원 → 지원현황 → 채용제안 응답 → 채용완료`

### EMPLOYER

사업주

`사업장 등록 → 공고 등록 → 공고 관리 → 지원자 검토 → 채용제안·거절 → 제안 응답 대기 → 채용완료`

---

# 5. 페이지 및 라우팅 구조

## 유학생 Mobile Web App

| Page | Route 예시 | 주요 기능 |
| --- | --- | --- |
| 온보딩 | `/student/onboarding` | 기본정보·구직조건·체류정보 입력 |
| 우선순위 | `/student/priority` | 거리·급여·시간·업종 우선순위 설정 |
| 추천 공고 | `/student/jobs` | 최대 3개 추천 공고 확인 |
| 공고 상세 | `/student/jobs/:jobId` | 상세정보 및 조건 비교 |
| 지원 확인 | `/student/jobs/:jobId/apply` | 전달 정보 및 시작일 확인 후 지원 |
| 지원 현황 | `/student/applications` | 지원·채용제안 진행상태 확인 |
| 채용 완료 | `/student/hired` | 수락한 공고 및 사업주 연락처 확인 |
| 마이페이지 | `/student/mypage` | 프로필·조건·체류정보 수정 |

## 사업주 Desktop Web

| Page | Route 예시 | 주요 기능 |
| --- | --- | --- |
| 대시보드 | `/employer/dashboard` | 공고·지원자·제안 현황 |
| 공고 목록 | `/employer/jobs` | 등록 공고 관리 |
| 공고 등록 | `/employer/jobs/new` | 신규 공고 작성 |
| 공고 상세 | `/employer/jobs/:jobId` | 공고 정보 및 지원 현황 |
| 지원자 목록 | `/employer/jobs/:jobId/applicants` | 상태별 지원자 확인 |
| 지원자 상세 | `/employer/applicants/:applicationId` | 프로필·조건 비교 |
| 채용 유학생 | `/employer/hired` | 채용완료 유학생 확인 |
| 마이페이지 | `/employer/mypage` | 사업주·사업장 관리 |

실제 Route는 개발 과정에서 변경될 수 있음

---

# 6. 핵심 지원 Flow

```
        추천 공고 확인
              ↓
        공고 상세 확인
              ↓
           지원하기
              ↓
           지원 접수
              ↓
      사업주 응답 24시간
              ↓
┌─────────────┬─────────────┐
채용제안    채용거절      무응답
 ↓            ↓             ↓
유학생       종료      자동 만료
24시간 응답
 ↓
┌──────────┬──────────┐
수락      거절     무응답
 ↓         ↓          ↓
채용완료  종료   자동 만료
 ↓
양측 연락처 공개
```

지원 접수 즉시 사업주 응답 타이머가 시작되고, 사업주가 `채용제안`을 보내면 유학생의 새로운 24시간 타이머가 시작됨.

유학생이 수락하면 서비스상 `채용완료` 상태로 전환되고 연락처가 공개됨.

사업주 측에서도 `채용제안` 이후 지원자를 `검토 중`에서 `수락 대기`로 이동시키고, 유학생 응답 여부에 따라 `채용완료`·`거절`·`만료`로 상태를 변경함.

---

# 7. 핵심 상태 설계

```
type ApplicationStatus =
  | "REVIEWING"
  | "OFFER_WAITING"
  | "HIRED"
  | "REJECTED"
  | "EMPLOYER_EXPIRED"
  | "STUDENT_EXPIRED"
  | "CANCELED";
```

| 상태 | 유학생 화면 | 사업주 화면 |
| --- | --- | --- |
| `REVIEWING` | 사업주 응답 대기 | 검토 중 |
| `OFFER_WAITING` | 채용제안 수락·거절 | 유학생 응답 대기 |
| `HIRED` | 채용완료 | 채용완료 |
| `REJECTED` | 지원 종료 | 채용거절 |
| `EMPLOYER_EXPIRED` | 사업주 응답기한 만료 | 검토 종료 |
| `STUDENT_EXPIRED` | 제안 응답기한 만료 | 제안 종료 |
| `CANCELED` | 지원 취소 | 검토 목록 제거 |

실제 Enum 이름은 Backend API 명세 확정 후 통일할 예정

---

# 8. 24시간 Countdown 설계

### 사업주 응답

유학생이 지원한 순간부터 24시간 타이머가 시작됩니다.

```
지원
→ 사업주 REVIEWING
→ 24시간 Countdown
→ 채용제안 / 거절 / 만료
```

### 유학생 응답

사업주가 채용제안을 보낸 순간 새로운 24시간 타이머가 시작됩니다.

```
채용제안
→ OFFER_WAITING
→ 24시간 Countdown
→ 수락 / 거절 / 만료
```

두 단계 모두 24시간 미응답 시 자동 종료되도록 함.

프론트에서는 서버에서 다음과 같은 정보를 전달받는 구조로 예상

```
interface ResponseTimer {
  startedAt: string;
  expiresAt: string;
}
```

화면에서는 `expiresAt - 현재 시간`을 계산하여 다음과 같이 표시

```
23시간 18분 남음
```

실제 지원 만료 여부는 브라우저 시간을 기준으로 프론트가 임의로 결정하지 않고 백엔드 상태를 최종 기준으로 처리할 예정

---

# 9. 추천 공고 설계

유학생에게 한 번에 최대 3개의 공고를 제공

추천 Flow는 다음과 같이 구성

```
  유학생 프로필
        +
  근무 가능 조건
        +
  체류·근로 조건
        ↓
 조건 기반 필터링
        ↓
거리·급여·근무시간·업종
   우선순위 반영
        ↓
 최대 3개 공고 노출
```

마감된 공고, 지원 정원이 찬 공고, 지원 중인 공고 등은 추천 대상에서 제외

공고 카드에 표시되는 정보는 다음과 같음

```
86% 적합

도보 n분, 시급 n원
시간, 거리 모두 일치
```

조건 일치율뿐 아니라 어떤 조건 때문에 해당 공고가 추천되었는지도 함께 제공

---

# 10. 주요 Component 설계

| Component | 역할 |
| --- | --- |
| `Header` | 공통 상단 영역 |
| `BottomNavigation` | 유학생 Mobile Web App 하단 Navigation |
| `SideNavigation` | 사업주 PC Web Navigation |
| `JobCard` | 추천 공고 정보 |
| `MatchRate` | 공고 일치율 표시 |
| `MatchReasonList` | 조건별 일치 여부 |
| `WorkTimeGrid` | 요일별 30분 단위 근무시간 입력·비교 |
| `PriorityList` | 우선순위 Drag & Drop |
| `ApplicationCard` | 학생 지원내역 표시 |
| `CountdownTimer` | 24시간 응답기한 표시 |
| `ApplicantCard` | 사업주 지원자 카드 |
| `JobForm` | 사업주 공고 등록·수정 Form |
| `ConfirmModal` | 지원·취소·제안·거절·마감 확인 |
| `LoadingSkeleton` | API Loading 상태 |
| `EmptyState` | 데이터 없음 상태 |

특히 `WorkTimeGrid`는 학생의 근무 가능시간 입력과 사업주의 필요 근무시간 입력에서 공통으로 활용할 수 있도록 재사용 가능한 Component로 구성합니다.

---

# 11. 상태 관리 방식

프론트 상태는 크게 세 종류로 구분함

### Local State

현재 Component 내부에서만 필요한 상태

```
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDay, setSelectedDay] = useState<string>();
```

- Modal 열림 여부, 입력 중인 값, 선택한 탭, Drag 상태 등

### Global State

여러 페이지에서 공통으로 필요한 상태

- 사용자 역할, 사용자 프로필, 온보딩에서 입력한 조건, 선택 언어 등

→ 필요한 경우 React Context 또는 Zustand 사용 예정

### Server State

Backend가 실제 원본을 관리하는 데이터

- 공고, 추천 결과, 지원, 채용제안, 지원 상태, 응답기한 등

→ Server State는 API를 통해 조회하며 Backend 데이터를 기준으로 사용

---

# 12. API 연동 설계

현재 Backend에서 ERD 설계가 진행되었으며, API 명세는 이후 확정될 예정

→ 프론트 설계 단계에서는 각 화면에서 어떤 데이터가 필요한지만 우선 정의

| 기능 | 프론트에서 필요한 데이터 |
| --- | --- |
| 유학생 프로필 | 이름, 국적, 지역, 한국어 수준, 경력 |
| 구직 조건 | 직종, 근무 가능 요일·시간, 지역 |
| 체류 조건 | 체류자격, TOPIK, 학업상태, 체류만료일 |
| 추천 공고 | 공고 ID, 업체명, 직무, 급여, 시간, 일치율 |
| 공고 상세 | 공고 전체정보 및 조건별 일치 여부 |
| 지원 | 공고 ID, 근무 시작 희망일 |
| 지원현황 | 지원 ID, 상태, 응답기한 |
| 지원자 조회 | 프로필, 근무가능시간, 경력, 일치율 |
| 채용제안 | 지원 ID, 제안상태 |
| 공고 등록 | 직무, 위치, 근무시간, 급여, 경력 등 |

DB 내부 구조 및 Entity 관계는 Backend에서 작성한 ERD를 기준으로 함

실제 Endpoint 및 Request/Response 형식은 Backend API 명세 작성 이후 업데이트

---

# 13. 다국어 처리 설계

다국어 기능은 Beta MVP 이후 Final 단계에서 구현 예정

추후 적용을 쉽게 하기 위해 초기 개발 단계부터 UI 문자열과 데이터값을 분리하는 구조 사용

고정 UI 문자열은 `react-i18next`와 `i18next`를 활용합니다.

```
src/
└─ locales/
   ├─ ko.json
   ├─ en.json
   ├─ vi.json
   └─ ...
```

```
<button>{t("application.apply")}</button>
```

```
한국어 → 지원하기
English → Apply
```

직무, 업종, 경력, 한국어 수준처럼 반복되는 값은 실제 문자열 대신 코드값으로 저장하는 구조 사용

```
type JobType =
  | "BARISTA"
  | "HALL_SERVING"
  | "KITCHEN_ASSISTANT"
  | "SALES";
```

프론트에서는 다음과 같이 사용자 언어에 맞는 텍스트 표시

```
t(`jobType.${job.jobType}`)
```

```
BARISTA

한국어 → 바리스타
English → Barista
Tiếng Việt → Nhân viên pha chế
```

사업장명처럼 고유명사인 데이터는 원문 유지

향후 사용자가 직접 입력하는 자유 텍스트가 필요한 부분에 대한 별도의 번역 API 적용 여부는 백엔드와 논의 예정

---

# 14. 디바이스별 UI 구현 전략

## Student

**Mobile Web App**

```
Target Width
약 390~430px

Navigation
Bottom Navigation

Layout
Single Column

Interaction
Touch / Swipe / Drag
```

학생 화면은 모바일 앱처럼 사용할 수 있도록 Bottom Navigation과 Touch Interaction 활용

## Employer

**Desktop Web**

```
Target Width
약 1280~1440px

Navigation
Side Navigation

Layout
Multi Column

Interaction
Mouse / Keyboard
```

사업주는 많은 정보를 동시에 확인해야 하므로 PC 화면으로 구현

각 서비스는 주요 Target Device에 최적화하되 다른 화면 크기에서도 Layout이 무너지지 않도록 최소한의 반응형 처리를 적용할 예정

---

# 15. 인증 및 사용자 권한

회원가입과 로그인은 Beta MVP 이후 Final 단계에서 구현

### Beta

테스트 사용자 또는 역할 선택 방식 등을 활용하여 Student / Employer 화면을 구분

### Final

실제 인증 기능을 구현하고 사용자 Role을 기반으로 접근 가능한 Route를 제한

```
type UserRole = "STUDENT" | "EMPLOYER";
```

```
STUDENT
→ /student/*

EMPLOYER
→ /employer/*
```

권한이 없는 사용자가 다른 역할의 페이지에 접근할 경우 적절한 페이지로 리디렉트함

---

# 16. Loading / Error / Empty State

API 연동 시 정상 데이터뿐 아니라 다양한 화면 상태도 별도 구현

| State | 예시 |
| --- | --- |
| Loading | 추천 공고를 불러오는 중 |
| Error | 서버 요청 실패 |
| Empty | 조건에 맞는 공고 없음 |
| Expired | 24시간 응답기한 만료 |
| Disabled | 지원 가능 개수 또는 지원자 정원 초과 |

추천 결과가 없다면:

> 현재 조건에 맞는 새로운 공고가 없어요.
> 

지원 내역이 없다면:

> 아직 지원한 공고가 없어요.
> 

API 요청에 실패했다면:

> 정보를 불러오지 못했어요.
> 
> 
> 잠시 후 다시 시도해주세요.
> 

와 같은 피드백 제공

---

# 17. 예상 Frontend 폴더 구조

```
src/
├─ api/
│  ├─ jobs.ts
│  ├─ applications.ts
│  ├─ employers.ts
│  └─ students.ts
│
├─ components/
│  ├─ common/
│  ├─ student/
│  ├─ employer/
│  ├─ job/
│  └─ application/
│
├─ pages/
│  ├─ student/
│  └─ employer/
│
├─ hooks/
│  ├─ useCountdown.ts
│  └─ useResponsive.ts
│
├─ types/
│  ├─ user.ts
│  ├─ job.ts
│  └─ application.ts
│
├─ constants/
├─ utils/
├─ locales/
├─ assets/
│
├─ App.tsx
└─ main.tsx
```

학생과 사업주의 화면은 분리하되, `Button`, `Modal`, `CountdownTimer`, `Loading` 등 공통으로 사용할 수 있는 Component는 `common`에 배치하여 중복 구현을 줄이고자 함