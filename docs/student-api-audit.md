# 유학생 API 연동 점검

점검 기준: 2026-11-26 조회한 `https://api.hirelink.site/v3/api-docs`와 로컬 `feature/80-student-api-integration`. 아래의 연결 상태는 정적 코드 기준이며 실제 서버 성공을 뜻하지 않는다. 사업주 전용 API와 탈퇴는 구현 범위에서 제외한다.

## 인증 및 가입

| API | 화면/코드 | 현황 |
| --- | --- | --- |
| GET `/api/auth/social/{provider}` | 진입·로그인, `src/api/socialAuth.ts` | 브라우저 이동, role=STUDENT 연결. 리다이렉트·쿠키 실검증 필요 |
| POST `/api/auth/social/result` | `StudentSocialAuthCallback` | CSRF 및 쿠키 사용, LOGIN/SIGNUP_REQUIRED 분기. 기존 계정 결과는 일회성 |
| GET/PUT `/api/auth/social/terms` | `StudentTermsAgreementRoute` | 호출 연결. 표시 본문 버전과 서버 `currentVersion` 비교가 없어 실제 본문 버전 확인 필요 |
| POST `/api/auth/social/registration/front`, `/back`, `/stay-document` | `StudentSocialRegistrationPage` | 파일 업로드 연결. 실제 OCR·만료 분기 검증 필요 |
| POST `/api/auth/social/phone-verifications`, `/verify` | 온보딩 전화번호 인증 | 연결. 실제 SMS·가입 완료 후 상태 검증 필요 |
| PUT `/api/auth/social/birth-date` | 가입 | 종료된 API. 연결 불필요 |
| POST `/api/auth/login`, `/signup`, `/refresh`, `/logout`; GET `/api/auth/csrf` | 로그인·세션 | 코드 연결. 이메일 로그인에 `NOT_APPLICABLE/EXISTING_FLOW` 프로필 조회 분기 추가. 실제 쿠키·만료·갱신 검증 필요 |
| POST `/api/auth/phone-verifications`, `/verify` | 온보딩·프로필 전화 인증 | 호출 연결. 실제 인증 검증 필요 |
| GET `/api/users/me/onboarding`; POST `/api/students/me/onboarding` | 온보딩 분기·완료 | 연결. 실제 모드에서 좌표가 없거나 범위를 벗어나면 제출을 차단하고 안내. 현재 입력은 좌표를 확보하지 못하므로 좌표 획득 방식 확정 전 실제 완료 불가 |

## 프로필·조건·추천

| API | 화면/코드 | 현황 |
| --- | --- | --- |
| GET/POST/PATCH `/api/students/me/profile` | 내 정보·온보딩 | 조회 및 PATCH 연결. POST 함수 존재; 실제 응답과 오류 처리 검증 필요 |
| POST `/api/students/me/careers`, PATCH/DELETE `/api/students/me/careers/{careerId}` | 경력 | Swagger상 개별 쓰기 종료. 프로필 PATCH 사용, 개별 함수는 사용 여부 확인 후 정리 대상 |
| GET/PATCH `/api/students/me/matching-preferences` | 희망 업종·시간·위치·우선순위 | 연결. 프로필 화면에서 주소가 같으면 기존 좌표를 유지해 반경 저장, 좌표 부재 및 서버 실패 시 오류 표시. 변경된 주소의 좌표 획득 방식은 미확정. UI는 오전 6~9시를 표현하지 못함 |
| GET/POST `/api/recommendations`; POST `/api/recommendations/refresh`; GET `/api/recommendations/{id}` | 매칭 목록·상세 | 호출 연결. 목록 `recommendations.items`의 `$ref`가 지원 목록 `Item`을 가리켜 프론트 추천 타입과 불일치; 실제 응답 확인 필요 |
| GET `/api/job-postings/{jobPostingId}` | 추천 공고 상세 | 호출 연결. 실제 데이터 검증 필요 |
| GET `/api/students/me/working-conditions` | 나의 근무 가능 조건 | 근무시간 계산 결과와 오류 표시 연결. 실제 활성 배지 계정 검증 필요; 지원 가능 업종은 API가 제공하지 않아 기존 예시 유지 |

## 지원 및 채용 공통 흐름

| API | 화면/코드 | 현황 |
| --- | --- | --- |
| POST `/api/applications`; GET `/api/applications/me`, `/api/applications/{id}`; PATCH `/api/applications/{applicationId}/withdraw` | 추천·지원 현황·상세 | 호출 연결. 목록의 종료 상태와 nullable 응답 기한, 종료 사유별 화면 상태 및 홈 집계 보완. 실제 응답 및 상태 전이 확인 필요 |
| PATCH `/api/offers/{offerId}/accept`, `/reject` | 채용 제안 | 호출 연결. 실제 계정에서 확인 필요 |
| GET `/api/matches/me`, `/api/matches/{id}` | 채용 완료 | 호출 연결. 실제 계정에서 확인 필요 |
| GET `/api/notifications/popups`; PATCH `/api/notifications/popups/{notificationId}/confirm` | 채용 팝업 | 미연동. 팝업 표시 시점·중복 확인 UX 확인 필요 |

## 서류 및 마이페이지

| API | 화면/코드 | 현황 |
| --- | --- | --- |
| GET `/api/students/me/documents/enrollment`; POST `/api/students/me/documents/enrollment/preview`, `/{draftId}/confirm` | 재학증명서 | 조회·업로드·확정 연결. 실제 파일 및 오류 검증 필요 |
| GET `/api/students/me/documents/{kind}`; POST `/api/students/me/documents/{kind}/preview`, `/{draftId}/confirm` | 성적·TOPIK | 성공 응답 스키마 미명시로 OCR·확정 미연동. 실제 모드에서 모의 등록 차단; 데모는 기존 mock 유지 |
| GET `/api/students/me/documents/completion`, `/api/students/me/badge` | 서류 목록·배지 | 실제 모드 서류 목록의 항목별 상태·완성률 연결. 재학서류 확정 후 두 상태 재조회, 배지 비활성→활성일 때만 발급 화면 표시. 실제 계정 검증 필요 |
| GET `/api/students/me/registration`; POST `/api/students/me/registration-renewals/front`, `/{renewalId}/back`, `/{renewalId}/stay-document`, `/{renewalId}/confirm`; POST `/api/students/me/stay-expiration-notice/claim` | 외국인등록증 갱신·만료 안내 | 미연동. 실제 모드의 모의 등록 차단; 갱신과 가입용 인증은 별도 계약, 화면 단계 및 오류 UX 확인 필요 |
| GET/PUT `/api/users/me/term-agreements`; GET `/api/users/me/term-agreements/location` | 약관·위치 동의 | PUT은 존재하지만 기존 요청에 필수 `version`이 없고 ID 고정. 서버 메타데이터와 실제 표시 본문 버전 확인 필요 |
| POST `/api/developer-inquiries` | 고객센터 | 문의 진입 항목은 있으나 입력·제출 화면 부재. 임의 구현 보류 |

## 확인 사항

- Swagger에 주소 검색·지오코딩 endpoint가 없다. 좌표 획득 수단과 운영 정책을 확인한다.
- 추천 목록의 `Item` 참조 오류와 `applicationId`, `applicationStatus` 실제 제공 여부를 백엔드에 확인한다.
- 약관별 프론트 본문과 서버 버전의 정확한 대응을 확인한다. 서버 버전을 그대로 전송하는 것은 본문 일치 검증이 아니다.
- 테스트 계정으로 소셜 신규·기존 로그인, 쿠키·CSRF, 약관 저장, 전화 인증, 온보딩, 프로필, 조건, 추천, 서류의 성공·실패 경로를 확인한다.
- 데모 모드의 `studentDataSource`는 mock을 사용한다. 실연동 검증은 데모 모드를 꺼서 수행한다.
- 미연동 범위는 API 함수 존재와 실제 화면 연결을 구분한 정적 점검이다. 현재 화면과 명세만으로 UX·정책이 결정되지 않은 항목은 임의 연결하지 않는다.
