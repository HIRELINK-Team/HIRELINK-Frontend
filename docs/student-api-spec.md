# 유학생 및 공통 API 상세 명세

기준: 2026-11-26 조회한 [OpenAPI 원본](https://api.hirelink.site/v3/api-docs), OpenAPI 3.1.0, API 버전 0.0.1-SNAPSHOT. 서버 기본 주소: https://api.hirelink.site.

유학생 기능과 사용하는 공통 API를 대상으로 한다. 사업주 전용 API와 탈퇴 API는 제외한다. 종료된 유학생 API는 명세상 구분을 위해 포함했다. 문서의 JSON 블록은 원본 스키마·예시를 그대로 보존한 것으로, `$ref`는 아래 구성 스키마 절을 참조한다.

인증은 operation에 `security`가 있으면 해당 값을, 없으면 최상위 `security`를 적용한다. `security: []`는 인증 요구 없음이다. 명시된 쿠키·헤더는 별도로 필요하다. 명세상 `required`에 없는 필드는 선택으로 표기하며, required 배열이 생략된 경우 서버가 반드시 생략을 허용한다는 의미로 단정하지 않는다. 요청·응답, 성공 상태 코드, 필드 타입이나 제약이 원본에 없으면 추정하지 않는다.

주소 검색·지오코딩 API는 원본에서 확인되지 않는다. 소셜 약관 버전은 실제 표시한 본문 버전이어야 한다. 추천 목록의 `Item` 참조는 지원 목록 항목으로 정의되어 있어 백엔드 확인이 필요하다.

## API 목록

| 분류 | Method | Endpoint | 요약 |
| --- | --- | --- | --- |
| Term Agreements | GET | `/api/users/me/term-agreements` | 내 약관 동의 기록과 현재 버전 조회 |
| Term Agreements | PUT | `/api/users/me/term-agreements` | 약관 동의 저장 |
| Social Auth | GET | `/api/auth/social/terms` | 소셜 가입 약관 조회 |
| Social Auth | PUT | `/api/auth/social/terms` | 소셜 가입 약관 동의 저장 |
| Social Auth | PUT | `/api/auth/social/birth-date` | 가입 전 생년월일 저장 종료 |
| Student Registration Renewal | POST | `/api/students/me/stay-expiration-notice/claim` | 체류 만료 사전 안내 최초 표시 요청 |
| Student Registration Renewal | POST | `/api/students/me/registration-renewals/{renewalId}/stay-document` | 최신 체류기간 증빙 PDF 추출 |
| Student Registration Renewal | POST | `/api/students/me/registration-renewals/{renewalId}/confirm` | 갱신 결과 최종 확인 |
| Student Registration Renewal | POST | `/api/students/me/registration-renewals/{renewalId}/back` | 갱신 등록증 뒷면 추출 및 진위 확인 |
| Student Registration Renewal | POST | `/api/students/me/registration-renewals/front` | 갱신 등록증 앞면 추출 |
| Student Profiles | GET | `/api/students/me/profile` | 내 유학생 프로필 조회 |
| Student Profiles | POST | `/api/students/me/profile` | 유학생 프로필 등록 |
| Student Profiles | PATCH | `/api/students/me/profile` | 내 정보 최종 일괄 저장 |
| Student Onboarding | POST | `/api/students/me/onboarding` | 유학생 온보딩 일괄 저장 · 완료 |
| Student Academic Documents | POST | `/api/students/me/documents/{kind}/{draftId}/confirm` | 성적·TOPIK 최종 등록 |
| Student Academic Documents | POST | `/api/students/me/documents/{kind}/preview` | 성적·TOPIK OCR 미리보기 |
| Student Enrollment | POST | `/api/students/me/documents/enrollment/{draftId}/confirm` | 확인한 재학증명서 최종 등록 |
| Student Enrollment | POST | `/api/students/me/documents/enrollment/preview` | 재학증명서 업로드 및 추출 결과 확인 |
| Student Careers | POST | `/api/students/me/careers` | 경력 개별 추가 종료 |
| Recommendations | GET | `/api/recommendations` | 추천 목록 조회 |
| Recommendations | POST | `/api/recommendations` | 최초 추천 생성 |
| Recommendations | POST | `/api/recommendations/refresh` | 추천 갱신 |
| Developer Inquiries | POST | `/api/developer-inquiries` | 개발자 문의 접수 |
| Social Auth | POST | `/api/auth/social/result` | 소셜 인증 결과 확인 |
| Social Auth | POST | `/api/auth/social/registration/stay-document` | 유학생 가입 체류기간 PDF 확인 |
| Social Auth | POST | `/api/auth/social/registration/front` | 유학생 가입 등록증 앞면 인식 |
| Social Auth | POST | `/api/auth/social/registration/back` | 유학생 가입 등록증 뒷면 인식 · 진위 확인 |
| Social Auth | POST | `/api/auth/social/phone-verifications` | 소셜 가입 휴대전화 인증번호 요청 |
| Social Auth | POST | `/api/auth/social/phone-verifications/verify` | 소셜 가입 인증번호 확인 및 계정 생성 |
| Auth | POST | `/api/auth/signup` | 개발용 이메일 회원가입 |
| Auth | POST | `/api/auth/refresh` | Access Token 재발급 |
| Phone Verification | POST | `/api/auth/phone-verifications` | 휴대전화 인증번호 요청 |
| Phone Verification | POST | `/api/auth/phone-verifications/verify` | 휴대전화 인증번호 확인 |
| Auth | POST | `/api/auth/logout` | 로그아웃 |
| Auth | POST | `/api/auth/login` | 개발용·지정 QA 계정 이메일 로그인 |
| Applications | POST | `/api/applications` | 지원 생성 |
| Student Matching Preferences | GET | `/api/students/me/matching-preferences` | 내 매칭 조건 조회 |
| Student Matching Preferences | PATCH | `/api/students/me/matching-preferences` | 매칭 조건 저장·수정 |
| Student Careers | DELETE | `/api/students/me/careers/{careerId}` | 경력 개별 삭제 종료 |
| Student Careers | PATCH | `/api/students/me/careers/{careerId}` | 경력 개별 수정 종료 |
| Employment Offers | PATCH | `/api/offers/{offerId}/reject` | 채용 제안 거절 |
| Employment Offers | PATCH | `/api/offers/{offerId}/accept` | 채용 제안 수락 |
| Employment Popup Notifications | PATCH | `/api/notifications/popups/{notificationId}/confirm` | 채용 팝업 확인 |
| Job Postings | GET | `/api/job-postings/{jobPostingId}` | 채용공고 상세 조회 |
| Applications | PATCH | `/api/applications/{applicationId}/withdraw` | 지원 취소 |
| Term Agreements | GET | `/api/users/me/term-agreements/location` | 내 위치 약관 동의 상태 조회 |
| Onboarding Status | GET | `/api/users/me/onboarding` | 내 온보딩 상태 조회 |
| Student Working Conditions | GET | `/api/students/me/working-conditions` | 나의 근무 가능 조건 조회 |
| Student Registration Renewal | GET | `/api/students/me/registration` | 현재 등록증 정보와 서비스 지원 대상 조회 |
| Student Academic Documents | GET | `/api/students/me/documents/{kind}` | 본인의 최종 성적·TOPIK 정보 |
| Student Enrollment | GET | `/api/students/me/documents/enrollment` | 본인의 최종 재학증명서 정보 조회 |
| Student Document Completion | GET | `/api/students/me/documents/completion` | 본인의 서류 등록 완성률 조회 |
| Student Badge | GET | `/api/students/me/badge` | 본인의 인증 배지 상태 조회 |
| Recommendations | GET | `/api/recommendations/{id}` | 추천 상세 조회 |
| Employment Popup Notifications | GET | `/api/notifications/popups` | 미확인 채용 팝업 조회 |
| Employment Matches | GET | `/api/matches/{id}` | 채용 완료 상세 조회 |
| Employment Matches | GET | `/api/matches/me` | 내 채용 완료 목록 조회 |
| Social Auth | GET | `/api/auth/social/{provider}` | 소셜 로그인 시작 |
| Auth | GET | `/api/auth/csrf` | CSRF 확인값 조회 |
| Applications | GET | `/api/applications/{id}` | 유학생용 지원 상세 조회 |
| Applications | GET | `/api/applications/me` | 내 지원 목록 조회 |

## 엔드포인트 상세

### GET `/api/users/me/term-agreements`

- 기능: 내 약관 동의 기록과 현재 버전 조회
- 태그: Term Agreements
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 약관 종류·필수 여부·현재 본문 버전과 본인의 동의 여부·시각·버전을 구분하여 반환한다. 본문은 프론트에서 제공한다. 개정된 본문을 읽어도 기존 동의 기록은 변경하지 않는다. 기존 버전 미기록은 agreedVersion=null이며 미동의라는 뜻이 아니다. 본문 버전 미설정은 currentVersion=null이다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "현재 메타데이터와 기존 동의 기록",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/TermAgreementOverviewResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "terms": [
                {
                  "termTypeId": 4,
                  "termTypeName": "서비스 이용약관",
                  "isRequired": true,
                  "currentVersion": "v1",
                  "isAgreed": true,
                  "agreedAt": "2026-11-01T01:00:00Z",
                  "agreedVersion": "v1"
                }
              ]
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PUT `/api/users/me/term-agreements`

- 기능: 약관 동의 저장
- 태그: Term Agreements
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인 회원의 요청에 포함된 약관만 저장·갱신하고 해당 목록을 요청 순서로 반환한다. 미전송 약관은 유지한다. true를 다시 보내면 기존 동의 시각을 유지하고 false이면 agreedAt=null, false에서 true이면 현재 시각을 기록한다. 빈 목록은 허용한다. 중복 ID는 400, 없는 약관 ID는 404이며 요청 전체가 함께 반영된다. 필수 동의·역할별 제한은 검사하지 않는다. version은 실제 표시한 본문 버전으로 필수이며 현재 버전과 다르면 409 TERM_VERSION_MISMATCH, 현재 버전 미설정은 503 TERM_VERSION_UNAVAILABLE이다. 이미 동의한 기록을 다른 버전으로 덮어쓰거나 기존 미기록 버전에 이름을 붙이면 409 TERM_RECONSENT_NOT_SUPPORTED이다. 위치 약관은 GET /api/users/me/term-agreements/location에서 받은 termTypeId로 저장한다. 온보딩·마이페이지가 같은 기록을 사용하며 GPS 이용 전 동의창 표시와 기기 권한 처리는 프론트가 담당한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/TermAgreementRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/TermAgreementResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "agreements": [
                {
                  "termTypeId": 1,
                  "isAgreed": true,
                  "agreedAt": "2026-11-01T01:00:00Z",
                  "agreedVersion": "v1"
                },
                {
                  "termTypeId": 3,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": "v1"
                }
              ]
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "약관 종류 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TERM_TYPE_NOT_FOUND": {
            "description": "TERM_TYPE_NOT_FOUND",
            "value": {
              "code": "TERM_TYPE_NOT_FOUND",
              "message": "존재하지 않는 약관 유형입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "TERM_VERSION_MISMATCH / TERM_RECONSENT_NOT_SUPPORTED",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TERM_VERSION_MISMATCH": {
            "description": "TERM_VERSION_MISMATCH",
            "value": {
              "code": "TERM_VERSION_MISMATCH",
              "message": "현재 약관 본문을 확인한 후 다시 동의해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "TERM_VERSION_UNAVAILABLE",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TERM_VERSION_UNAVAILABLE": {
            "description": "TERM_VERSION_UNAVAILABLE",
            "value": {
              "code": "TERM_VERSION_UNAVAILABLE",
              "message": "약관 버전이 아직 준비되지 않았습니다."
            }
          }
        }
      }
    }
  }
}
```

### GET `/api/auth/social/terms`

- 기능: 소셜 가입 약관 조회
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 소셜 인증 결과가 SIGNUP_REQUIRED인 사용자의 약관 목록과 임시 동의 상태를 반환한다. socialSignup 쿠키로 식별하며 Bearer 토큰은 사용하지 않는다. 필수 여부는 서버가 제공하고 약관 본문·번역은 프론트에서 표시한다. 등록증 확인 기능 활성화 시 유학생에게만 필수 고유식별정보 수집·이용 항목이 추가되며 일반 약관과 별도로 동의받아야 한다. 사업주와 기능 비활성 상태는 기존 목록을 유지한다. 아직 저장하지 않은 동의는 false, agreedAt은 null이다. 조회해도 가입 진행 정보의 30분 만료 시각은 연장되지 않는다. ID를 고정하지 않고 이 응답의 termTypeId로 동의를 저장한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 후 설정된 HttpOnly 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "약관 ID 오름차순 목록",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SocialSignupTermsResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "terms": [
                {
                  "termTypeId": 4,
                  "termTypeName": "서비스 이용약관",
                  "isRequired": true,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": null,
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 5,
                  "termTypeName": "개인정보 수집·이용",
                  "isRequired": true,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": null,
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 6,
                  "termTypeName": "개인정보 제3자 제공",
                  "isRequired": true,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": null,
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 7,
                  "termTypeName": "마케팅 정보 수신",
                  "isRequired": false,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": null,
                  "currentVersion": "v1"
                }
              ]
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 진행 쿠키 누락·무효·만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "가입한 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "이미 가입된 소셜 계정으로 약관 가입 절차를 요청",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 설정 전",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_LOGIN_UNAVAILABLE": {
            "description": "SOCIAL_LOGIN_UNAVAILABLE",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          }
        }
      }
    }
  }
}
```

### PUT `/api/auth/social/terms`

- 기능: 소셜 가입 약관 동의 저장
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 신규 사용자의 동의 목록 전체를 가입 진행 정보에 임시 저장한다. 실제로 표시한 본문 version을 함께 보내며 현재 버전과 다르면 409 TERM_VERSION_MISMATCH, 버전 미설정이면 503 TERM_VERSION_UNAVAILABLE이다. 필수 약관을 모두 true로 보내야 하며, 선택 약관은 생략하면 false가 된다. 같은 버전의 true를 다시 보내면 동의 시각을 유지하고 false로 바꾸면 null로 지운다. 빈 목록·필수 항목 누락·중복 ID 등 잘못된 입력은 400이다. socialSignup 쿠키와 CSRF 쿠키·헤더가 필요하며 Bearer 토큰은 사용하지 않는다. 회원·JWT·정식 회원 동의 기록은 아직 생성하지 않는다. 가입 진행 정보 만료 시 동의도 사용할 수 없고 정기 정리 시 함께 삭제된다. 저장해도 30분 만료 시각은 연장되지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 후 설정된 HttpOnly 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/SocialSignupTermsRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "저장한 전체 약관 동의 상태",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SocialSignupTermsResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "terms": [
                {
                  "termTypeId": 4,
                  "termTypeName": "서비스 이용약관",
                  "isRequired": true,
                  "isAgreed": true,
                  "agreedAt": "2026-11-16T10:00:00Z",
                  "agreedVersion": "v1",
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 5,
                  "termTypeName": "개인정보 수집·이용",
                  "isRequired": true,
                  "isAgreed": true,
                  "agreedAt": "2026-11-16T10:00:00Z",
                  "agreedVersion": "v1",
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 6,
                  "termTypeName": "개인정보 제3자 제공",
                  "isRequired": true,
                  "isAgreed": true,
                  "agreedAt": "2026-11-16T10:00:00Z",
                  "agreedVersion": "v1",
                  "currentVersion": "v1"
                },
                {
                  "termTypeId": 7,
                  "termTypeName": "마케팅 정보 수신",
                  "isRequired": false,
                  "isAgreed": false,
                  "agreedAt": null,
                  "agreedVersion": null,
                  "currentVersion": "v1"
                }
              ]
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "잘못된 입력 또는 필수 약관 미동의",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "필수 약관에 모두 동의해주세요."
            }
          },
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청에 같은 약관 ID가 중복되어 있습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 진행 쿠키 누락·무효·만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "가입한 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "존재하지 않거나 소셜 가입에서 사용하지 않는 약관 ID",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TERM_TYPE_NOT_FOUND": {
            "description": "TERM_TYPE_NOT_FOUND",
            "value": {
              "code": "TERM_TYPE_NOT_FOUND",
              "message": "존재하지 않는 약관 유형입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "이미 가입된 소셜 계정으로 약관 가입 절차를 요청",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 설정 전",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_LOGIN_UNAVAILABLE": {
            "description": "SOCIAL_LOGIN_UNAVAILABLE",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          }
        }
      }
    }
  }
}
```

### PUT `/api/auth/social/birth-date`

- 기능: 가입 전 생년월일 저장 종료
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 이 경로에서는 생년월일을 저장하지 않는다. 계정 생성 후 온보딩에서 입력하고 POST /api/students/me/onboarding의 마치기 요청으로 제출한다. 유효한 유학생 가입 세션의 요청은 400 INVALID_INPUT을 반환한다. 기존 가입 쿠키와 CSRF 검사는 유지한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 가입 진행 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/SocialSignupBirthDateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "종료된 저장 경로 또는 잘못된 입력",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "INVALID_INPUT",
          "message": "생년월일은 계정 생성 후 온보딩의 마치기에서 제출해주세요."
        }
      }
    }
  },
  "401": {
    "description": "가입 세션 없음·만료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님·CSRF 오류·회원 유형 불일치·탈퇴",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "이미 가입됨",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 또는 등록증 기능 비활성",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/stay-expiration-notice/claim`

- 기능: 체류 만료 사전 안내 최초 표시 요청
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 온보딩 완료 후 화면에 안내를 표시할 준비가 되었을 때 호출한다. 인증된 최종 만료일이 한국 날짜 기준 0~30일 남았고 해당 만료일의 안내 이력이 없으면 show=true와 실제 남은 일수·문구를 반환하며 이력을 저장한다. 당일 문구는 오늘 체류기간이 만료돼요다. 동시 요청 중 하나만 true이며 날짜 변경·재접속·같은 만료일 갱신으로 재표시하지 않는다. 다른 새 만료일에는 다시 한 번 안내한다. show=true를 받으면 화면에 표시하고 기존 등록증 갱신 흐름으로 연결한다. 요청 성공 후 응답 유실 시에도 표시권은 이미 소모되어 재요청은 false다. 배지 회수·추천·지원 제한은 실행하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "최초 표시 여부",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/StudentStayExpirationNoticeResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님·탈퇴·온보딩 미완료 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/registration-renewals/{renewalId}/stay-document`

- 기능: 최신 체류기간 증빙 PDF 추출
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 카드 만료일이 지난 경우 PDF 5MB 이하를 제출한다. 이번 갱신 등록증과 PDF의 등록번호 일치 및 최신 만료일을 확인한다. 진위 API를 다시 호출하지 않는다. 허가일자·신고일은 추출/반환하지 않는다. 성공해도 최종 확인 전 기존 만료일/배지는 유지한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "renewalId",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "description": "최신 체류기간 증빙 PDF"
          }
        },
        "required": [
          "file"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "미확정 PDF 결과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationRenewalVerificationResponse"
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·UUID 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "REGISTRATION_REQUIRED, REGISTRATION_RENEWAL_NOT_FOUND/EXPIRED, REGISTRATION_FRONT/BACK_REQUIRED, STAY_DOCUMENT_NOT_REQUIRED, VALID_STAY_DOCUMENT_REQUIRED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE: 5MB 초과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "OCR 인식 불가·진위 확인 실패·PDF 번호 불일치/만료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "502": {
    "description": "OCR/진위 확인 외부 서비스 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "등록증 확인 기능 또는 암호화 설정 미준비",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/registration-renewals/{renewalId}/confirm`

- 기능: 갱신 결과 최종 확인
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: renewalId만 받으며 수정한 추출값을 받지 않는다. 한국 날짜 기준 만료일 당일까지 유효하다. 성공할 때 이름·국적·체류자격·만료일을 함께 갱신한다. D-10 등 지원 대상이 아니어도 인증된 새 정보를 저장하고 serviceSupported=false로 안내한다. 학업과정은 변경하지 않고 D-2일 때만 기존 과정과 조합한다. 지원 대상이며 이미 최종 등록된 세 서류가 있으면 기존 기준으로 배지를 발급/재발급한다. 세 서류 재제출은 필요 없다. 실패하면 기존 최종 값과 배지를 유지한다. 배지 회수·추천 및 지원 제한 연결은 이 API에서 실행하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "renewalId",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "최종 등록증 정보·서비스 지원 여부·기존 기준의 배지 상태",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationRenewalConfirmationResponse"
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·UUID 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "REGISTRATION_REQUIRED, REGISTRATION_RENEWAL_NOT_FOUND/EXPIRED, REGISTRATION_FRONT/BACK_REQUIRED, STAY_DOCUMENT_NOT_REQUIRED, VALID_STAY_DOCUMENT_REQUIRED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE: 5MB 초과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "OCR 인식 불가·진위 확인 실패·PDF 번호 불일치/만료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "502": {
    "description": "OCR/진위 확인 외부 서비스 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "등록증 확인 기능 또는 암호화 설정 미준비",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/registration-renewals/{renewalId}/back`

- 기능: 갱신 등록증 뒷면 추출 및 진위 확인
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: JPG/PNG 5MB 이하. 만료일과 일련번호만 추출하고 진위 API를 호출한다. 허가일자·신고일은 추출/반환하지 않는다. 만료일이 지났으면 PDF가 필요하다. 아직 최종 반영하지 않는다. 뒷면 확인 후 재촬영하려면 앞면부터 다시 진행한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "renewalId",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "description": "등록증 뒷면 JPG/PNG"
          }
        },
        "required": [
          "file"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "미확정 뒷면 결과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationRenewalVerificationResponse"
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·UUID 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "REGISTRATION_REQUIRED, REGISTRATION_RENEWAL_NOT_FOUND/EXPIRED, REGISTRATION_FRONT/BACK_REQUIRED, STAY_DOCUMENT_NOT_REQUIRED, VALID_STAY_DOCUMENT_REQUIRED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE: 5MB 초과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "OCR 인식 불가·진위 확인 실패·PDF 번호 불일치/만료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "502": {
    "description": "OCR/진위 확인 외부 서비스 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "등록증 확인 기능 또는 암호화 설정 미준비",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/registration-renewals/front`

- 기능: 갱신 등록증 앞면 추출
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: JPG/PNG 5MB 이하. 앞면의 이름·국적·체류자격 원문을 추출한다. D-10 등 지원 대상 밖의 코드도 갱신은 진행하며, D-2 세부 코드는 저장된 학업과정으로 조합한다. 최신 renewalId만 유효하며 30분 이내 완료해야 한다. 가입 당시 등록번호와의 동일인 대조는 제공하지 않는다. 기존 최종 만료일/배지는 유지한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "description": "등록증 앞면 JPG/PNG"
          }
        },
        "required": [
          "file"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "미확정 앞면 결과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationRenewalFrontResponse"
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·UUID 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "REGISTRATION_REQUIRED, REGISTRATION_RENEWAL_NOT_FOUND/EXPIRED, REGISTRATION_FRONT/BACK_REQUIRED, STAY_DOCUMENT_NOT_REQUIRED, VALID_STAY_DOCUMENT_REQUIRED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE: 5MB 초과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "OCR 인식 불가·진위 확인 실패·PDF 번호 불일치/만료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "502": {
    "description": "OCR/진위 확인 외부 서비스 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "등록증 확인 기능 또는 암호화 설정 미준비",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/profile`

- 기능: 내 유학생 프로필 조회
- 태그: Student Profiles
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인한 유학생 본인의 프로필과 경력을 조회한다. 체류자격은 D-2, D-4 상위 코드와 기존 세부 코드를 저장된 값 그대로 반환한다. 학업 상태 등 등록되지 않은 선택 정보는 null이다. 경력은 시작월 내림차순 · 같으면 ID 내림차순이며 없으면 []다. 사진 미등록은 null, 등록된 사진 URL 발급 실패는 500이다. 조회 중 프로필을 만들지 않는다. 이 응답은 온보딩 전체 완료 판정이 아니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentProfileResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "studentId": 1,
              "name": "김하늘",
              "email": "student@example.com",
              "phoneNumber": "010-1234-5678",
              "birthDate": "2000-05-14",
              "nationality": "VN",
              "currentRegion": "서울특별시 성동구",
              "koreanLevel": "INTERMEDIATE",
              "visaCode": null,
              "universityName": null,
              "enrollmentStartDate": null,
              "studyProgramId": null,
              "studyProgram": null,
              "gradeLevel": null,
              "academicState": null,
              "topikLevel": null,
              "stayStartDate": null,
              "stayExpirationDate": null,
              "profileImageUrl": null,
              "hirelinkBadgeIssuedAt": null,
              "careers": []
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "유학생 프로필 미등록",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "STUDENT_PROFILE_NOT_FOUND": {
            "description": "STUDENT_PROFILE_NOT_FOUND",
            "value": {
              "code": "STUDENT_PROFILE_NOT_FOUND",
              "message": "유학생 프로필이 아직 등록되지 않았습니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/students/me/profile`

- 기능: 유학생 프로필 등록
- 태그: Student Profiles
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 휴대전화 인증을 완료한 유학생이 본인 프로필을 최초 등록한다. 이름 · 생년월일 · 국적 · 거주지역 · 한국어 수준이 필수다. 한국 기준 만 18세 이상, 국적은 유효한 두 자리 국가 코드여야 한다. 전화번호는 이미 인증된 회원 정보에서 가져온다. 이름 저장과 프로필 생성은 하나의 트랜잭션이며 요청 성공 시 즉시 저장된다. 임시 저장이나 온보딩 전체 일괄 저장 API가 아니며, 성공 응답은 온보딩 전체 완료를 의미하지 않는다. 체류자격 · 학업 상태는 최초 등록 항목이 아니다. 체류 정보는 등록증 인증과 온보딩에서 반영한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/StudentProfileCreateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentProfileCreateResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "studentId": 1,
              "name": "김하늘",
              "phoneNumber": "010-1234-5678",
              "birthDate": "2000-05-14",
              "nationality": "VN",
              "currentRegion": "서울특별시 성동구",
              "koreanLevel": "INTERMEDIATE"
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "휴대전화 미인증 / 이미 등록된 유학생 프로필",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_NOT_VERIFIED": {
            "description": "PHONE_NOT_VERIFIED",
            "value": {
              "code": "PHONE_NOT_VERIFIED",
              "message": "휴대전화 인증을 먼저 완료해주세요."
            }
          },
          "DUPLICATE_STUDENT_PROFILE": {
            "description": "DUPLICATE_STUDENT_PROFILE",
            "value": {
              "code": "DUPLICATE_STUDENT_PROFILE",
              "message": "이미 유학생 프로필이 존재합니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PATCH `/api/students/me/profile`

- 기능: 내 정보 최종 일괄 저장
- 태그: Student Profiles
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 수정 반영하기에서 한 번 호출한다. 생년월일·전화번호·거주지역·한국어 수준·희망 근무지역·경력 목록을 하나의 트랜잭션으로 저장하며 하나라도 실패하면 전체 롤백한다. 생략한 항목은 유지하고 null·알 수 없는 필드는 거절한다. 경력은 전체 목록 교체이며 []는 전체 삭제다. 전화번호가 달라지면 해당 번호의 인증 성공 후 5분 이내여야 하며 최종 성공 시 인증 결과를 소비한다. 만 18세 이상만 저장할 수 있다. 체류자격·체류 만료일·TOPIK·학업 정보·이름·국적은 직접 수정하지 않는다. 상세 화면의 임시 변경은 이 API를 호출하지 않는다. 희망 근무지역과 경력의 저장 후 조회는 기존 매칭 조건/프로필 조회 API를 사용한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/StudentInformationUpdateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentProfileUpdateResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "studentId": 1,
              "name": "김하늘",
              "email": "student@example.com",
              "phoneNumber": "010-1234-5678",
              "birthDate": "2000-05-14",
              "nationality": "VN",
              "currentRegion": "서울특별시 성동구",
              "koreanLevel": "INTERMEDIATE",
              "visaCode": null,
              "universityName": null,
              "studyProgramId": null,
              "studyProgram": null,
              "gradeLevel": null,
              "academicState": null,
              "topikLevel": null,
              "stayExpirationDate": null,
              "hirelinkBadgeIssuedAt": null
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "유학생 프로필 미등록",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "STUDENT_PROFILE_NOT_FOUND": {
            "description": "STUDENT_PROFILE_NOT_FOUND",
            "value": {
              "code": "STUDENT_PROFILE_NOT_FOUND",
              "message": "유학생 프로필이 아직 등록되지 않았습니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "새 번호 인증 누락·불일치·5분 경과 또는 번호 중복",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_NOT_VERIFIED": {
            "description": "PHONE_NOT_VERIFIED",
            "value": {
              "code": "PHONE_NOT_VERIFIED",
              "message": "휴대전화 인증을 먼저 완료해주세요."
            }
          },
          "DUPLICATE_PHONE_NUMBER": {
            "description": "DUPLICATE_PHONE_NUMBER",
            "value": {
              "code": "DUPLICATE_PHONE_NUMBER",
              "message": "이미 사용 중인 휴대전화 번호입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/students/me/onboarding`

- 기능: 유학생 온보딩 일괄 저장 · 완료
- 태그: Student Onboarding
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 전화번호 인증과 계정 생성 이후 로그인한 유학생이 마지막 마치기에서 호출한다. 회원 연결 등록증 인증 기록이 필수이며 LOCAL 테스트 가입은 기존 개별 API를 사용한다. 기본정보 · 학업과정 · 경력 · 구직조건 · 우선순위를 한 트랜잭션에서 저장하고 최초 완료 시각을 기록한다. 실패하면 모든 변경을 롤백한다. 국적 · 체류 만료일은 서버 인증 기록에서 가져온다. studyProgram은 ASSOCIATE·BACHELOR·MASTER·DOCTORATE·EXCHANGE 중 하나가 필수이며 각각 D-2-1·D-2-2·D-2-3·D-2-4·D-2-6으로 조합한다. 등록증에서는 D-2를 확인하고 세부 코드는 사용자가 선택한 학업과정으로 생성한다. 등록증 체류자격이 D-2가 아니면 400이다. 등록증 원문 코드는 변경하지 않는다. 학교·학년·학적 상태는 요청할 수 없다. 이름은 가입 인증 결과를 사용한다. 생년월일 birthDate는 계정 생성 후 입력하며 마치기에서 반드시 제출한다. 한국 날짜 기준 만 18세 이상이어야 하며 과거 가입 시 저장된 생년월일을 재사용하지 않는다. 가입 이후 체류기간이 만료되어도 온보딩 완료는 허용하지만 만료일 · 인증 시각을 갱신하지 않으며, 완료가 추천 이용 자격을 뜻하지 않는다. 경력 없음은 careers=[]로 전송한다. topikLevel은 null을 포함해 입력할 수 없으며 TOPIK 성적증명서 최종 등록으로만 반영한다. 근무시간은 연속 1시간 이상인 구간을 최소 하나 포함하며 자정을 넘으면 MON 22:00~02:00처럼 시작 요일 하나로 전송한다. 반경은 정수 100~1,000m, 100m 간격으로 제한한다. 미완료 프로필이 있으면 제출 항목을 갱신하고 경력 · 업종 · 시간 · 우선순위 목록을 교체하며, 학교 등 이번 입력 대상이 아닌 기존 정보는 유지한다. 중복 · 동시 완료 요청은 최초 한 건만 성공하고 이후 409다. 화면별 임시 저장 기능이 아니며 중도 이탈하면 항상 생년월일부터 다시 입력한다. 실패 시 생성된 계정·가입 인증정보는 유지하고 온보딩은 미완료로 남는다. 완료 후 수정은 내 정보 일괄 저장 API를 사용한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/StudentOnboardingRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "전체 저장 및 온보딩 완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentOnboardingResponse"
        },
        "example": {
          "studentId": 1,
          "completed": true,
          "completedAt": "2026-11-20T03:00:00Z"
        }
      }
    }
  },
  "400": {
    "description": "필수 입력 누락 · 잘못된 형식 · 경력 기간 · 구직조건 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 · 탈퇴",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "404": {
    "description": "등록되지 않은 업종 · 우선순위 기준",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "전화번호 미인증 · 등록증 인증 기록 없음 · 이미 온보딩 완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_NOT_VERIFIED": {
            "description": "PHONE_NOT_VERIFIED",
            "value": {
              "code": "PHONE_NOT_VERIFIED",
              "message": "휴대전화 인증을 먼저 완료해주세요."
            }
          },
          "REGISTRATION_VERIFICATION_REQUIRED": {
            "description": "REGISTRATION_VERIFICATION_REQUIRED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_REQUIRED",
              "message": "등록증 인증을 거친 가입 정보가 필요합니다."
            }
          },
          "ONBOARDING_ALREADY_COMPLETED": {
            "description": "ONBOARDING_ALREADY_COMPLETED",
            "value": {
              "code": "ONBOARDING_ALREADY_COMPLETED",
              "message": "이미 온보딩을 완료했습니다. 개별 수정 API를 이용해주세요."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/students/me/documents/{kind}/{draftId}/confirm`

- 기능: 성적·TOPIK 최종 등록
- 태그: Student Academic Documents
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 해당 종류의 본인 최신 draftId만 확정하며 추출값 입력은 받지 않는다. 성공 후 해당 프로필 값·원본만 갱신하고 이전 원본을 삭제한다. 실패·중단하면 기존 최종 자료를 유지한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "kind",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "draftId",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "파일 누락·잘못된 요청",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 상태 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필·최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "DOCUMENT_DRAFT_NOT_FOUND",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "UNREADABLE_STUDENT_DOCUMENT. 직전 학기 평균 학점 또는 TOPIK 등급 미인식을 message로 안내한다. 파일·서류 유형 자체를 읽지 못하면 일반 재업로드 안내를 반환한다",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TRANSCRIPT_GPA_UNREADABLE": {
            "description": "TRANSCRIPT_GPA_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "직전 학기 평균 학점을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "TOPIK_LEVEL_UNREADABLE": {
            "description": "TOPIK_LEVEL_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "TOPIK 등급을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "UNREADABLE_STUDENT_DOCUMENT": {
            "description": "UNREADABLE_STUDENT_DOCUMENT",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "서류 정보를 확인하지 못했습니다. 다시 촬영하거나 업로드해주세요."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR·저장소 실패",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/documents/{kind}/preview`

- 기능: 성적·TOPIK OCR 미리보기
- 태그: Student Academic Documents
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 5MB 이하 PDF/JPEG/PNG. transcript는 가장 최근 학기 평균 학점이며 누적·과목별 점수와 만점 기준은 제외한다. topik은 1~6급이다. 최종 자료는 변경하지 않는다. OCR은 진위 확인이 아니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "kind",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary"
          }
        },
        "required": [
          "file"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "파일 누락·잘못된 요청",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 상태 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필·최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "DOCUMENT_DRAFT_NOT_FOUND",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "UNREADABLE_STUDENT_DOCUMENT. 직전 학기 평균 학점 또는 TOPIK 등급 미인식을 message로 안내한다. 파일·서류 유형 자체를 읽지 못하면 일반 재업로드 안내를 반환한다",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TRANSCRIPT_GPA_UNREADABLE": {
            "description": "TRANSCRIPT_GPA_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "직전 학기 평균 학점을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "TOPIK_LEVEL_UNREADABLE": {
            "description": "TOPIK_LEVEL_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "TOPIK 등급을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "UNREADABLE_STUDENT_DOCUMENT": {
            "description": "UNREADABLE_STUDENT_DOCUMENT",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "서류 정보를 확인하지 못했습니다. 다시 촬영하거나 업로드해주세요."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR·저장소 실패",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/documents/enrollment/{draftId}/confirm`

- 기능: 확인한 재학증명서 최종 등록
- 태그: Student Enrollment
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 본인의 최신 draftId만 전달한다. 사용자 수정 추출값은 받지 않으며 서버 보관 결과를 다시 범위 검사한다. 원본 연결·프로필 학교/학년을 같은 트랜잭션으로 갱신하고 성공 후 이전 원본을 삭제한다. 실패하면 기존 최종 자료를 유지한다. 학교의 캠퍼스는 서류 정보에 함께 저장한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "draftId",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string",
      "format": "uuid"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "최종 등록 완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/EnrollmentDocumentResponse"
        }
      }
    }
  },
  "400": {
    "description": "draftId 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "유효한 계정 인증 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 또는 최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "ENROLLMENT_DRAFT_NOT_FOUND: 다른 회원·이전·이미 확인한 결과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "UNSUPPORTED_GRADE_LEVEL 또는 UNREADABLE_ENROLLMENT. 누락된 대학교·학년/학기 수를 message로 안내하며 여러 항목이면 함께 안내한다",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNIVERSITY_UNREADABLE": {
            "description": "UNIVERSITY_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "대학교명을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "GRADE_UNREADABLE": {
            "description": "GRADE_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "학년 또는 학기 수를 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "UNIVERSITY_AND_GRADE_UNREADABLE": {
            "description": "UNIVERSITY_AND_GRADE_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "대학교명과 학년 또는 학기 수를 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/students/me/documents/enrollment/preview`

- 기능: 재학증명서 업로드 및 추출 결과 확인
- 태그: Student Enrollment
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: PDF/JPG/PNG, 5MB 이하. 명시된 학년을 우선하고 없으면 개인의 현재·이수 학기 수/2를 올림한다. 다음 학기를 더하지 않고 학사 일정은 제외한다. 1~4학년만 허용한다. 성공해도 최종 등록 자료·프로필은 변경하지 않는다. 재업로드 성공 시 이전 미확정 결과를 교체한다. 인식 실패·범위 초과 시 기존 최종 원본과 추출값을 유지한다. OCR은 서류 진위 확인이 아니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "file": {
            "type": "string",
            "format": "binary",
            "description": "재학증명서 원본"
          }
        },
        "required": [
          "file"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "미확정 추출 결과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/EnrollmentPreviewResponse"
        }
      }
    }
  },
  "400": {
    "description": "파일 누락 또는 multipart 형식 오류",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "유효한 계정 인증 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 또는 최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "인식 불가 또는 학년 범위 초과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_GRADE_LEVEL": {
            "description": "UNSUPPORTED_GRADE_LEVEL",
            "value": {
              "code": "UNSUPPORTED_GRADE_LEVEL",
              "message": "지원하는 학년 범위를 벗어났습니다"
            }
          },
          "UNREADABLE_ENROLLMENT": {
            "description": "UNREADABLE_ENROLLMENT",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "재학증명서 정보를 확인하지 못했습니다. 다시 촬영하거나 업로드해주세요."
            }
          },
          "UNIVERSITY_UNREADABLE": {
            "description": "UNIVERSITY_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "대학교명을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "GRADE_UNREADABLE": {
            "description": "GRADE_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "학년 또는 학기 수를 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "UNIVERSITY_AND_GRADE_UNREADABLE": {
            "description": "UNIVERSITY_AND_GRADE_UNREADABLE",
            "value": {
              "code": "UNREADABLE_ENROLLMENT",
              "message": "대학교명과 학년 또는 학기 수를 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "ENROLLMENT_OCR_FAILED 또는 STUDENT_DOCUMENT_STORAGE_FAILED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/students/me/careers`

- 기능: 경력 개별 추가 종료
- 태그: Student Careers
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: DB를 변경하지 않는다. 경력 임시 변경은 프로필 PATCH 최종 일괄 저장에 전체 목록으로 전달한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "INVALID_INPUT: 일괄 저장 API 사용 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "경력은 내 정보의 수정 반영하기에서 전체 목록으로 저장해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "인증 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### GET `/api/recommendations`

- 기능: 추천 목록 조회
- 태그: Recommendations
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 자신의 최신 추천 목록을 조회합니다. 생성 후 24시간이 지나면 최신 조건으로 자동 갱신될 수 있습니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "추천 목록 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RecommendationListResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "추천 배치를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "자동 갱신에 필요한 프로필 또는 매칭 조건이 미완성",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/recommendations`

- 기능: 최초 추천 생성
- 태그: Recommendations
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 프로필·매칭 조건·우선순위를 기준으로 최초 추천 배치를 생성합니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "최초 추천 생성 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RecommendationCreateResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "최초 추천이 이미 존재하거나 추천 필수 정보가 미완성",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/recommendations/refresh`

- 기능: 추천 갱신
- 태그: Recommendations
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생의 최신 매칭 조건으로 추천을 다시 계산합니다. 갱신이 불필요하면 기존 배치를 반환합니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "추천 갱신 처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RecommendationRefreshResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "기존 추천 배치를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "추천 재계산에 필요한 프로필 또는 매칭 조건이 미완성",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/developer-inquiries`

- 기능: 개발자 문의 접수
- 태그: Developer Inquiries
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인한 유학생 또는 사업주가 문의를 접수합니다. 작성자·회원 유형은 현재 인증된 계정에서 가져오고, 답변 이메일은 요청으로 받습니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/DeveloperInquiryCreateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "문의 접수 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/DeveloperInquiryCreateResponse"
        },
        "example": {
          "inquiryId": 101,
          "submittedAt": "2026-11-24T03:00:00Z"
        }
      }
    }
  },
  "400": {
    "description": "답변 이메일·문의 유형·제목·내용이 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### POST `/api/auth/social/result`

- 기능: 소셜 인증 결과 확인
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 본문 없음. 소셜 인증 콜백이 설정한 socialSignup 쿠키와 GET /api/auth/csrf에서 받은 확인값을 사용한다. 신규 사용자는 SIGNUP_REQUIRED이며 회원 생성·JWT 발급 없이 30분 가입 진행 정보만 유지한다. 조회해도 만료 시각은 연장되지 않는다. 약관 동의 후 등록증 기능이 활성화된 유학생은 카드·필요한 PDF 확인을 완료하고 가입용 phone-verifications/verify에서 휴대전화 인증 후 계정을 생성한다. 생성된 계정은 다시 가입하지 않고 LOGIN과 기존 로그인 형식의 login 객체, refreshToken 쿠키를 받으며 가입 진행 쿠키는 삭제된다. LOGIN은 온보딩 완료를 뜻하지 않는다. LOGIN 후 액세스 토큰으로 GET /api/users/me/onboarding을 호출하여 온보딩 상태와 nextStep을 확인한다. REQUIRED/BASIC_INFORMATION은 항상 생년월일부터 다시 입력한다. COMPLETED는 추가 온보딩 없음, NOT_APPLICABLE은 기존 유형별 흐름을 뜻한다. 화면별 초안은 복구하지 않는다. 기존 회원 결과는 한 번만 교환할 수 있다. 회원 조회는 provider+고유 ID 기준이며 이메일로 연결하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 후 설정된 HttpOnly 쿠키. 직접 입력하지 않음",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "소셜 인증 결과",
    "headers": {
      "Set-Cookie": {
        "description": "기존 회원: refreshToken(HttpOnly, Secure, SameSite=Lax, Path=/api/auth, 14일) 설정 및 socialSignup 삭제. 신규 사용자는 기존 socialSignup 유지",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SocialAuthResponse"
        },
        "examples": {
          "신규 사용자": {
            "description": "신규 사용자",
            "value": {
              "status": "SIGNUP_REQUIRED",
              "role": "STUDENT",
              "email": null,
              "signupExpiresAt": "2026-11-16T10:30:00Z",
              "login": null
            }
          },
          "기존 회원": {
            "description": "기존 회원",
            "value": {
              "status": "LOGIN",
              "role": "EMPLOYER",
              "email": "member@example.com",
              "signupExpiresAt": null,
              "login": {
                "userId": 1,
                "role": "EMPLOYER",
                "accessToken": "access-token-example",
                "tokenType": "Bearer",
                "expiresIn": 3600
              }
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 진행 쿠키 누락·무효·만료·이미 교환한 결과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "CSRF 오류, 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 설정 전",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/social/registration/stay-document`

- 기능: 유학생 가입 체류기간 PDF 확인
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 앞면·뒷면 APICK 확인을 완료했고 카드 체류기간이 한국 날짜 기준 지난 경우 외국인등록 사실증명 PDF를 제출한다. stayDocument 파일 한 개, 5MB 이하·최대 3쪽이며 추가 폼 필드를 허용하지 않는다. 대상자 등록번호가 앞면과 같고 현재 체류기간 만료일이 오늘 이후인 경우만 성공한다. 기간 표기는 종료일을 사용하며 주소·체류자격 변경 이력의 날짜는 사용하지 않는다. 모호한 열·페이지·가림 번호는 422로 거절한다. 실패 시 화면의 ‘다시 촬영’은 PDF 재선택·업로드를 뜻한다. 공통 응답의 serialNumber는 앞선 카드 뒷면 값을 사용하고 stayExpiresOn은 PDF로 확인한 만료일이다. cardVerified=true, stayDocumentVerified=true, requiresStayDocument=false다. 허가일자·신고일은 반환하지 않는다. PDF 실패 시 카드 일련번호를 유지하여 PDF만 재시도할 수 있다. 일련번호를 저장하지 않은 이전 버전의 PDF 대기 세션은 REGISTRATION_FRONT_REQUIRED로 앞면부터 다시 진행한다. 원본 PDF는 보관하지 않으며 성공 후 등록번호·발급일자·일련번호를 제거한다. 성공 후 재확인은 앞면부터 진행한다. 기존 30분 세션은 연장하지 않는다. 문서 진위·전자서명·발급기관 조회 검증이 아니며 APICK을 다시 호출하지 않는다. 활성화된 유학생 휴대전화 가입에서 이 결과와 체류기간을 재검사하며 이 응답 자체로 계정·온보딩을 완료하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "HttpOnly 가입 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "stayDocument": {
            "type": "string",
            "format": "binary",
            "description": "외국인등록 사실증명 PDF 한 개, 최대 5MB · 3쪽"
          }
        },
        "required": [
          "stayDocument"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "동일 등록번호 · 유효한 체류기간 확인. 카드 일련번호와 PDF 만료일을 공통 형식으로 반환",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationVerificationResponse"
        },
        "examples": {
          "pdfVerified": {
            "description": "pdfVerified",
            "value": {
              "serialNumber": "00000000001",
              "stayExpiresOn": "2027-07-27",
              "cardVerified": true,
              "stayDocumentVerified": true,
              "requiresStayDocument": false,
              "signupExpiresAt": "2026-11-20T10:30:00Z"
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·추가 폼·빈 이미지 또는 필수 약관 미동의",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "등록증 이미지 또는 체류기간 증빙 파일 하나만 첨부해주세요."
            }
          },
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "고유식별정보 동의를 포함한 필수 약관에 모두 동의해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 쿠키 누락·무효·만료 (외부 처리 중 만료 포함)",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님, CSRF 오류, 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "유학생 가입 중에만 등록증을 확인할 수 있습니다."
            }
          },
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "선행 인증 미완료 · PDF 불필요 · 확인 완료 후 재촬영 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_BACK_REQUIRED": {
            "description": "REGISTRATION_BACK_REQUIRED",
            "value": {
              "code": "REGISTRATION_BACK_REQUIRED",
              "message": "등록증 앞면과 뒷면의 진위 확인을 먼저 완료해주세요."
            }
          },
          "STAY_DOCUMENT_NOT_REQUIRED": {
            "description": "STAY_DOCUMENT_NOT_REQUIRED",
            "value": {
              "code": "STAY_DOCUMENT_NOT_REQUIRED",
              "message": "카드의 체류기간이 유효하여 PDF 제출이 필요하지 않습니다."
            }
          },
          "REGISTRATION_FRONT_REQUIRED": {
            "description": "REGISTRATION_FRONT_REQUIRED",
            "value": {
              "code": "REGISTRATION_FRONT_REQUIRED",
              "message": "등록증 앞면부터 다시 촬영해주세요."
            }
          },
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "413": {
    "description": "파일 5MB 또는 전체 요청 6MB 초과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FILE_TOO_LARGE": {
            "description": "FILE_TOO_LARGE",
            "value": {
              "code": "FILE_TOO_LARGE",
              "message": "등록증 이미지 또는 체류기간 증빙 파일은 5MB 이하여야 합니다."
            }
          }
        }
      }
    }
  },
  "415": {
    "description": "PDF 이외 형식 또는 파일 시그니처 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "UNSUPPORTED_FILE_TYPE",
          "message": "체류기간 증빙은 PDF만 사용할 수 있습니다."
        }
      }
    }
  },
  "422": {
    "description": "인식 불가 · 등록번호 불일치 · 체류기간 만료. PDF 재선택",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_VISA": {
            "description": "UNSUPPORTED_VISA",
            "value": {
              "code": "UNSUPPORTED_VISA",
              "message": "등록증에서 확인한 체류자격이 D-2여야 합니다."
            }
          },
          "UNREADABLE_STAY_DOCUMENT": {
            "description": "UNREADABLE_STAY_DOCUMENT",
            "value": {
              "code": "UNREADABLE_STAY_DOCUMENT",
              "message": "체류기간 증빙을 읽을 수 없습니다. 외국인등록 사실증명 PDF를 다시 선택해주세요."
            }
          },
          "STAY_DOCUMENT_MISMATCH": {
            "description": "STAY_DOCUMENT_MISMATCH",
            "value": {
              "code": "STAY_DOCUMENT_MISMATCH",
              "message": "등록증과 증빙서류의 등록번호가 일치하지 않습니다. 본인의 PDF를 다시 선택해주세요."
            }
          },
          "STAY_DOCUMENT_EXPIRED": {
            "description": "STAY_DOCUMENT_EXPIRED",
            "value": {
              "code": "STAY_DOCUMENT_EXPIRED",
              "message": "증빙서류의 체류기간이 지났습니다. 유효한 PDF를 다시 선택해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR 또는 APICK 연결·응답·판정 실패",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_OCR_FAILED": {
            "description": "REGISTRATION_OCR_FAILED",
            "value": {
              "code": "REGISTRATION_OCR_FAILED",
              "message": "등록증 인식 서비스를 이용할 수 없습니다."
            }
          },
          "REGISTRATION_VERIFICATION_FAILED": {
            "description": "REGISTRATION_VERIFICATION_FAILED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_FAILED",
              "message": "등록증 진위 확인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "기능 비활성 또는 암호화 키·APICK 키·별도 동의 설정 미비",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_VERIFICATION_UNAVAILABLE": {
            "description": "REGISTRATION_VERIFICATION_UNAVAILABLE",
            "value": {
              "code": "REGISTRATION_VERIFICATION_UNAVAILABLE",
              "message": "등록증 확인 서비스를 이용할 수 없습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/social/registration/front`

- 기능: 유학생 가입 등록증 앞면 인식
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 유학생 소셜 가입 세션과 별도 고유식별정보 동의를 포함한 필수 약관 동의가 필요하다. 카메라 촬영 또는 앨범에서 선택한 이미지를 같은 API의 registrationFile에 JPG·PNG 한 개(5MB 이하)로 보낸다. 추가 파일·폼 필드와 OCR 값 직접 수정은 허용하지 않는다. 서버는 파일의 실제 촬영 출처를 증명하지 않는다. 정상 형식의 이미지로 인식을 시작하면 이전 앞면·뒷면·진위·PDF 결과를 먼저 무효화하며 인식 실패에도 이전 결과는 복구하지 않는다. 성공 응답의 registrationNumber에 숫자 6자리-7자리 형식의 등록번호 전체를 반환한다. 기존 maskedRegistrationNumber 키는 제거한다. 응답은 no-store이며 프론트는 확인용 원문을 화면 이탈·인증 완료 시 정리한다. 추출값은 암호화 임시 저장하며 원본 이미지는 보관하지 않는다. 가입 세션 30분 만료는 연장되지 않고, 만료 시 사용 불가·정기 정리 시 삭제된다. 회원·JWT·프로필은 생성하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 후 설정한 HttpOnly 가입 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "registrationFile": {
            "type": "string",
            "format": "binary",
            "description": "촬영 또는 앨범에서 선택한 등록증 앞면 JPG·PNG 한 개, 최대 5MB"
          }
        },
        "required": [
          "registrationFile"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "앞면 인식 성공. 등록번호 전체 확인 후 뒷면 촬영",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationFrontResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "name": "TEST STUDENT",
              "nationalityCode": "VN",
              "visaCode": "D-2",
              "registrationNumber": "000101-5000000",
              "issueDate": "2020-01-01",
              "signupExpiresAt": "2026-11-20T10:30:00Z"
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·추가 폼·빈 이미지 또는 필수 약관 미동의",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "등록증 이미지 또는 체류기간 증빙 파일 하나만 첨부해주세요."
            }
          },
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "고유식별정보 동의를 포함한 필수 약관에 모두 동의해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 쿠키 누락·무효·만료 (외부 처리 중 만료 포함)",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님, CSRF 오류, 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "유학생 가입 중에만 등록증을 확인할 수 있습니다."
            }
          },
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "앞면 재촬영 필요 또는 이미 가입된 소셜 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_FRONT_REQUIRED": {
            "description": "REGISTRATION_FRONT_REQUIRED",
            "value": {
              "code": "REGISTRATION_FRONT_REQUIRED",
              "message": "등록증 앞면을 먼저 촬영해주세요. 확인 완료 후 재촬영도 앞면부터 진행해주세요."
            }
          },
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "413": {
    "description": "파일 5MB 또는 전체 요청 6MB 초과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FILE_TOO_LARGE": {
            "description": "FILE_TOO_LARGE",
            "value": {
              "code": "FILE_TOO_LARGE",
              "message": "등록증 이미지 또는 체류기간 증빙 파일은 5MB 이하여야 합니다."
            }
          }
        }
      }
    }
  },
  "415": {
    "description": "JPG·PNG 이외 형식 또는 파일 시그니처 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_FILE_TYPE": {
            "description": "UNSUPPORTED_FILE_TYPE",
            "value": {
              "code": "UNSUPPORTED_FILE_TYPE",
              "message": "등록증 촬영 이미지는 JPG, PNG만 사용할 수 있습니다."
            }
          }
        }
      }
    }
  },
  "422": {
    "description": "필수 필드 인식 실패·지원하지 않는 체류자격 또는 기재 정보 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_VISA": {
            "description": "UNSUPPORTED_VISA",
            "value": {
              "code": "UNSUPPORTED_VISA",
              "message": "등록증에서 확인한 체류자격이 D-2여야 합니다."
            }
          },
          "UNREADABLE_REGISTRATION": {
            "description": "UNREADABLE_REGISTRATION",
            "value": {
              "code": "UNREADABLE_REGISTRATION",
              "message": "등록증 정보를 확인하지 못했습니다. 선명하게 다시 촬영해주세요."
            }
          },
          "REGISTRATION_NOT_VERIFIED": {
            "description": "REGISTRATION_NOT_VERIFIED",
            "value": {
              "code": "REGISTRATION_NOT_VERIFIED",
              "message": "등록증 정보가 일치하지 않습니다. 등록증을 다시 촬영해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR 또는 APICK 연결·응답·판정 실패",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_OCR_FAILED": {
            "description": "REGISTRATION_OCR_FAILED",
            "value": {
              "code": "REGISTRATION_OCR_FAILED",
              "message": "등록증 인식 서비스를 이용할 수 없습니다."
            }
          },
          "REGISTRATION_VERIFICATION_FAILED": {
            "description": "REGISTRATION_VERIFICATION_FAILED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_FAILED",
              "message": "등록증 진위 확인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "기능 비활성 또는 암호화 키·APICK 키·별도 동의 설정 미비",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_VERIFICATION_UNAVAILABLE": {
            "description": "REGISTRATION_VERIFICATION_UNAVAILABLE",
            "value": {
              "code": "REGISTRATION_VERIFICATION_UNAVAILABLE",
              "message": "등록증 확인 서비스를 이용할 수 없습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/social/registration/back`

- 기능: 유학생 가입 등록증 뒷면 인식 · 진위 확인
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 앞면 인식 후 카메라로 촬영하거나 앨범에서 선택한 뒷면 JPG·PNG 한 개를 registrationFile로 보낸다. 추가 파일·폼 필드는 허용하지 않는다. 정상 형식의 이미지로 처리를 시작하면 이전 뒷면·진위 결과를 무효화한다. 최신 체류 만료일과 일련번호를 읽고 서버에 보관한 앞면 값으로 APICK을 호출한다. 2011-01-01 이전 발급 카드만 일련번호 생략이 가능하다. APICK data.result=1만 통과시키며 과금·HTTP 성공만으로 통과시키지 않는다. 기재 정보 일치 확인이며 얼굴 대조·실물 위변조·최신 체류자격 확인을 보장하지 않는다. 한국 날짜 기준 만료일 당일까지 유효하고 지난 경우 requiresStayDocument=true다. 진위 확인 성공 시 발급일자를 제거하고, PDF 확인이 필요하지 않으면 등록번호도 즉시 제거한다. 진위 확인 성공 후 뒷면 재촬영은 앞면부터 한다. 공통 응답의 serialNumber는 카드에서 읽은 11자리 문자열이며 일련번호 없는 구형 카드는 null이다. 허가일자·신고일은 반환하지 않는다. PDF 필요 시 등록번호와 카드 일련번호를 기존 세션 만료까지 암호화 보관하고, PDF가 필요하지 않으면 일련번호는 저장하지 않는다. PDF 필요 시 stay-document API로 확인한다. 활성화된 유학생 휴대전화 가입에서 이 결과와 체류기간을 재검사한다. 이 응답 자체로 계정·온보딩을 완료하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 후 설정한 HttpOnly 가입 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "multipart/form-data": {
      "schema": {
        "type": "object",
        "properties": {
          "registrationFile": {
            "type": "string",
            "format": "binary",
            "description": "촬영 또는 앨범에서 선택한 등록증 뒷면 JPG·PNG 한 개, 최대 5MB"
          }
        },
        "required": [
          "registrationFile"
        ]
      }
    }
  }
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "기재 정보 일치 확인 성공. 공통 응답의 requiresStayDocument로 PDF 필요 여부 판단",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationVerificationResponse"
        },
        "examples": {
          "cardValid": {
            "description": "cardValid",
            "value": {
              "serialNumber": "00000000001",
              "stayExpiresOn": "2027-07-27",
              "cardVerified": true,
              "stayDocumentVerified": false,
              "requiresStayDocument": false,
              "signupExpiresAt": "2026-11-20T10:30:00Z"
            }
          },
          "requiresPdf": {
            "description": "requiresPdf",
            "value": {
              "serialNumber": "00000000001",
              "stayExpiresOn": "2026-11-19",
              "cardVerified": true,
              "stayDocumentVerified": false,
              "requiresStayDocument": true,
              "signupExpiresAt": "2026-11-20T10:30:00Z"
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "파일 누락·추가 폼·빈 이미지 또는 필수 약관 미동의",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "등록증 이미지 또는 체류기간 증빙 파일 하나만 첨부해주세요."
            }
          },
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "고유식별정보 동의를 포함한 필수 약관에 모두 동의해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 쿠키 누락·무효·만료 (외부 처리 중 만료 포함)",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님, CSRF 오류, 회원 유형 불일치 또는 탈퇴 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "유학생 가입 중에만 등록증을 확인할 수 있습니다."
            }
          },
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "앞면 재촬영 필요 또는 이미 가입된 소셜 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_FRONT_REQUIRED": {
            "description": "REGISTRATION_FRONT_REQUIRED",
            "value": {
              "code": "REGISTRATION_FRONT_REQUIRED",
              "message": "등록증 앞면을 먼저 촬영해주세요. 확인 완료 후 재촬영도 앞면부터 진행해주세요."
            }
          },
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "413": {
    "description": "파일 5MB 또는 전체 요청 6MB 초과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FILE_TOO_LARGE": {
            "description": "FILE_TOO_LARGE",
            "value": {
              "code": "FILE_TOO_LARGE",
              "message": "등록증 이미지 또는 체류기간 증빙 파일은 5MB 이하여야 합니다."
            }
          }
        }
      }
    }
  },
  "415": {
    "description": "JPG·PNG 이외 형식 또는 파일 시그니처 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_FILE_TYPE": {
            "description": "UNSUPPORTED_FILE_TYPE",
            "value": {
              "code": "UNSUPPORTED_FILE_TYPE",
              "message": "등록증 촬영 이미지는 JPG, PNG만 사용할 수 있습니다."
            }
          }
        }
      }
    }
  },
  "422": {
    "description": "필수 필드 인식 실패·지원하지 않는 체류자격 또는 기재 정보 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_VISA": {
            "description": "UNSUPPORTED_VISA",
            "value": {
              "code": "UNSUPPORTED_VISA",
              "message": "등록증에서 확인한 체류자격이 D-2여야 합니다."
            }
          },
          "UNREADABLE_REGISTRATION": {
            "description": "UNREADABLE_REGISTRATION",
            "value": {
              "code": "UNREADABLE_REGISTRATION",
              "message": "등록증 정보를 확인하지 못했습니다. 선명하게 다시 촬영해주세요."
            }
          },
          "REGISTRATION_NOT_VERIFIED": {
            "description": "REGISTRATION_NOT_VERIFIED",
            "value": {
              "code": "REGISTRATION_NOT_VERIFIED",
              "message": "등록증 정보가 일치하지 않습니다. 등록증을 다시 촬영해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR 또는 APICK 연결·응답·판정 실패",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_OCR_FAILED": {
            "description": "REGISTRATION_OCR_FAILED",
            "value": {
              "code": "REGISTRATION_OCR_FAILED",
              "message": "등록증 인식 서비스를 이용할 수 없습니다."
            }
          },
          "REGISTRATION_VERIFICATION_FAILED": {
            "description": "REGISTRATION_VERIFICATION_FAILED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_FAILED",
              "message": "등록증 진위 확인을 완료하지 못했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "기능 비활성 또는 암호화 키·APICK 키·별도 동의 설정 미비",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_VERIFICATION_UNAVAILABLE": {
            "description": "REGISTRATION_VERIFICATION_UNAVAILABLE",
            "value": {
              "code": "REGISTRATION_VERIFICATION_UNAVAILABLE",
              "message": "등록증 확인 서비스를 이용할 수 없습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/social/phone-verifications`

- 기능: 소셜 가입 휴대전화 인증번호 요청
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 계정 생성 전 API. socialSignup 및 CSRF 쿠키·헤더가 필요하며 Bearer 토큰은 사용하지 않는다. 필수 약관 동의를 검사한다. 등록증 기능이 활성화된 유학생은 카드 진위 확인과 필요한 PDF 확인을 완료해야 하며 현재 한국 날짜 기준 체류기간이 유효해야 한다. 재촬영으로 무효화된 결과는 허용하지 않으며 직접 요청도 동일하게 검사한다. 사업주와 기능 비활성 상태의 기존 소셜 가입은 유지한다. 국내 010 번호에 6자리 인증번호를 발송한다. 번호 유효시간 300초, 소셜 사용자·전화번호별 60초 재전송 간격 및 최근 1시간 최대 5회. 번호별 제한은 기존 회원 인증과 공유하며 가입 재시작·완료로 초기화하지 않는다. 발송 실패도 요청 횟수에 포함하고 인증번호를 무효화한다. 성공 재전송은 이전 번호를 무효화하지만 유효한 인증의 실패 횟수는 유지한다. 5회 오입력 후 해당 인증의 만료까지 재전송을 차단한다. 가입 진행 정보는 소셜 인증부터 30분이며 요청으로 연장되지 않는다. 브라우저를 닫아도 즉시 삭제되지 않고 만료 시 사용 불가, 정리 작업은 최초 60초 후 이전 작업 종료부터 60초 간격으로 수행한다. 가입을 다시 시작할 때는 소셜 인증부터 진행한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 콜백에서 받은 HttpOnly 가입 진행 쿠키. 30분 유효",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/PhoneVerificationRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "인증번호 발송 접수",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/PhoneVerificationRequestResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "expiresIn": 300,
              "message": "인증번호가 전송되었습니다."
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "잘못된 입력 또는 필수 약관 미동의",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "010으로 시작하는 휴대전화 번호를 입력해주세요."
            }
          },
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "필수 약관에 모두 동의해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 진행 쿠키 누락·무효·만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "CSRF 오류, 기존 소셜 계정의 유형 불일치 또는 탈퇴",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "등록증 · PDF 선행 확인 필요 또는 이미 가입된 소셜 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_VERIFICATION_REQUIRED": {
            "description": "REGISTRATION_VERIFICATION_REQUIRED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_REQUIRED",
              "message": "등록증 앞면부터 진위 확인을 완료해주세요."
            }
          },
          "STAY_DOCUMENT_REQUIRED": {
            "description": "STAY_DOCUMENT_REQUIRED",
            "value": {
              "code": "STAY_DOCUMENT_REQUIRED",
              "message": "체류기간 증빙 PDF 확인을 먼저 완료해주세요."
            }
          },
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "422": {
    "description": "PDF 체류기간 만료 · 미지원 체류자격",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_VISA": {
            "description": "UNSUPPORTED_VISA",
            "value": {
              "code": "UNSUPPORTED_VISA",
              "message": "등록증에서 확인한 체류자격이 D-2여야 합니다."
            }
          },
          "STAY_DOCUMENT_EXPIRED": {
            "description": "STAY_DOCUMENT_EXPIRED",
            "value": {
              "code": "STAY_DOCUMENT_EXPIRED",
              "message": "증빙서류의 체류기간이 지났습니다. 등록증 앞면부터 다시 확인해주세요."
            }
          }
        }
      }
    }
  },
  "429": {
    "description": "발송 제한 또는 유효한 인증의 5회 오입력 차단",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_VERIFICATION_RATE_LIMIT": {
            "description": "PHONE_VERIFICATION_RATE_LIMIT",
            "value": {
              "code": "PHONE_VERIFICATION_RATE_LIMIT",
              "message": "인증 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "문자 발송 실패 또는 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SMS_DELIVERY_FAILED": {
            "description": "SMS_DELIVERY_FAILED",
            "value": {
              "code": "SMS_DELIVERY_FAILED",
              "message": "문자를 발송하지 못했습니다."
            }
          },
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 비활성화 또는 등록증 암호화 설정 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_LOGIN_UNAVAILABLE": {
            "description": "SOCIAL_LOGIN_UNAVAILABLE",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          },
          "REGISTRATION_VERIFICATION_UNAVAILABLE": {
            "description": "REGISTRATION_VERIFICATION_UNAVAILABLE",
            "value": {
              "code": "REGISTRATION_VERIFICATION_UNAVAILABLE",
              "message": "등록증 확인 서비스를 이용할 수 없습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/social/phone-verifications/verify`

- 기능: 소셜 가입 인증번호 확인 및 계정 생성
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 가입 진행 쿠키·CSRF로 인증한다. 30분 가입 정보, 필수 약관, 요청한 전화번호와 300초 인증번호를 다시 검증한다. 등록증 기능이 활성화된 유학생은 카드·PDF 확인과 체류기간을 재검사한다. 생년월일 입력과 만 18세 검사는 계정 생성 후 온보딩 최종 저장에서 처리한다. 전화번호 잠금 대기 후 가입 세션·인증번호 만료도 다시 검사한다. 인증 성공 후 유학생·사업주·LOCAL·소셜 전체 회원에서 전화번호 중복을 검사한다. 중복이면 새 계정 없이 이번 가입 정보·인증번호·임시 약관·등록증·PDF 결과와 socialSignup 쿠키만 정리하고 409로 기존 계정 로그인을 안내한다. 기존 회원·소셜 연결·로그인 토큰·refreshToken 쿠키는 변경하지 않으며 외부 Google/Kakao 연결도 해제하지 않는다. 중복이 없으면 선택했던 유형·계정·소셜 인증정보·휴대전화 인증·약관 동의를 함께 저장한다. 등록증 기능이 활성화된 유학생은 인증된 이름을 회원에, 국적·체류자격·유효 만료일·카드/PDF 확인 시각을 회원 연결 인증 정보에 함께 저장한다. 등록번호·발급일자·일련번호·원본 파일은 이전하지 않는다. 계정 생성 시 생년월일을 저장하지 않고 프로필도 만들지 않는다. 생년월일을 포함한 온보딩 입력은 마치기 요청에서만 저장한다. 이전 실패는 계정·토큰·동의 저장도 함께 롤백한다. agreedAt은 임시 동의 시각 그대로, 미동의는 false/null로 저장한다. 성공 시 가입 정보와 인증번호를 소모한다. 201은 계정 생성이며 온보딩 완료가 아니다. onboardingRequired=true를 보고 필수 온보딩으로 이동한다. 생성 후 재로그인은 기존 회원 로그인으로 처리한다. GET /api/users/me/onboarding의 REQUIRED/BASIC_INFORMATION은 항상 생년월일부터 다시 입력한다. COMPLETED는 추가 온보딩 없음, NOT_APPLICABLE은 기존 유형별 흐름을 뜻한다. 미완료 회원의 프로필·서류·매칭 조건 등 유학생 정보 API 접근은 제한한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "소셜 인증 콜백에서 받은 HttpOnly 가입 진행 쿠키. 30분 유효",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "같은 브라우저의 CSRF 쿠키",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/PhoneVerificationConfirmRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "계정 생성, 필수 온보딩 필요",
    "headers": {
      "Set-Cookie": {
        "description": "socialSignup 삭제 및 refreshToken 설정(HttpOnly, Secure, SameSite=Lax, Path=/api/auth, 14일)",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SocialSignupResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "userId": 1,
              "role": "STUDENT",
              "accessToken": "access-token-example",
              "tokenType": "Bearer",
              "expiresIn": 3600,
              "onboardingRequired": true
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력·필수 동의 오류 또는 인증번호 누락·불일치·만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "6자리 인증번호를 입력해주세요."
            }
          },
          "REQUIRED_TERMS_NOT_AGREED": {
            "description": "REQUIRED_TERMS_NOT_AGREED",
            "value": {
              "code": "REQUIRED_TERMS_NOT_AGREED",
              "message": "필수 약관에 모두 동의해주세요."
            }
          },
          "INVALID_VERIFICATION_CODE": {
            "description": "INVALID_VERIFICATION_CODE",
            "value": {
              "code": "INVALID_VERIFICATION_CODE",
              "message": "인증번호가 일치하지 않거나 만료되었습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "가입 진행 쿠키 누락·무효·만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_SOCIAL_SESSION": {
            "description": "INVALID_SOCIAL_SESSION",
            "value": {
              "code": "INVALID_SOCIAL_SESSION",
              "message": "소셜 인증을 다시 진행해주세요."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "CSRF 오류, 기존 소셜 계정의 유형 불일치 또는 탈퇴",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "SOCIAL_ROLE_MISMATCH": {
            "description": "SOCIAL_ROLE_MISMATCH",
            "value": {
              "code": "SOCIAL_ROLE_MISMATCH",
              "message": "가입한 회원 유형으로 로그인해주세요."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "등록증 · PDF 선행 확인 필요, 전화번호 중복 또는 이미 가입된 소셜 계정",
    "headers": {
      "Set-Cookie": {
        "description": "DUPLICATE_PHONE_NUMBER일 때 socialSignup만 Max-Age=0으로 삭제. 기존 refreshToken 유지",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "REGISTRATION_VERIFICATION_REQUIRED": {
            "description": "REGISTRATION_VERIFICATION_REQUIRED",
            "value": {
              "code": "REGISTRATION_VERIFICATION_REQUIRED",
              "message": "등록증 앞면부터 진위 확인을 완료해주세요."
            }
          },
          "STAY_DOCUMENT_REQUIRED": {
            "description": "STAY_DOCUMENT_REQUIRED",
            "value": {
              "code": "STAY_DOCUMENT_REQUIRED",
              "message": "체류기간 증빙 PDF 확인을 먼저 완료해주세요."
            }
          },
          "DUPLICATE_PHONE_NUMBER": {
            "description": "DUPLICATE_PHONE_NUMBER",
            "value": {
              "code": "DUPLICATE_PHONE_NUMBER",
              "message": "이미 사용 중인 휴대전화 번호입니다. 기존 계정으로 로그인해주세요."
            }
          },
          "SOCIAL_ACCOUNT_ALREADY_REGISTERED": {
            "description": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
            "value": {
              "code": "SOCIAL_ACCOUNT_ALREADY_REGISTERED",
              "message": "이미 가입한 소셜 계정입니다. 다시 로그인해주세요."
            }
          }
        }
      }
    }
  },
  "422": {
    "description": "PDF 체류기간 만료 · 미지원 체류자격",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNSUPPORTED_VISA": {
            "description": "UNSUPPORTED_VISA",
            "value": {
              "code": "UNSUPPORTED_VISA",
              "message": "등록증에서 확인한 체류자격이 D-2여야 합니다."
            }
          },
          "STAY_DOCUMENT_EXPIRED": {
            "description": "STAY_DOCUMENT_EXPIRED",
            "value": {
              "code": "STAY_DOCUMENT_EXPIRED",
              "message": "증빙서류의 체류기간이 지났습니다. 등록증 앞면부터 다시 확인해주세요."
            }
          }
        }
      }
    }
  },
  "429": {
    "description": "발송 제한 또는 유효한 인증의 5회 오입력 차단",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_VERIFICATION_RATE_LIMIT": {
            "description": "PHONE_VERIFICATION_RATE_LIMIT",
            "value": {
              "code": "PHONE_VERIFICATION_RATE_LIMIT",
              "message": "인증 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류. 계정·인증정보·동의 저장 전체 롤백",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 비활성화 또는 등록증 암호화 설정 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SOCIAL_LOGIN_UNAVAILABLE": {
            "description": "SOCIAL_LOGIN_UNAVAILABLE",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          },
          "REGISTRATION_VERIFICATION_UNAVAILABLE": {
            "description": "REGISTRATION_VERIFICATION_UNAVAILABLE",
            "value": {
              "code": "REGISTRATION_VERIFICATION_UNAVAILABLE",
              "message": "등록증 확인 서비스를 이용할 수 없습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/signup`

- 기능: 개발용 이메일 회원가입
- 태그: Auth
- 인증: OpenAPI security 요구 없음
- 설명: 개발 환경에서 LOCAL_LOGIN_ENABLED=true로 설정한 경우에만 사용할 수 있다(기본값 false). 실제 서비스는 Google/Kakao 로그인을 사용한다. 비활성화 시 유효한 요청은 403 FORBIDDEN이며 계정이나 토큰을 생성하지 않는다. 요청 형식 검증 오류는 400이다. LOCAL 이메일로 가입하고 토큰을 발급한다. 이메일은 trim·lowercase 정규화, 비밀번호는 8자 이상·영문·숫자 포함, 회원 유형은 STUDENT 또는 EMPLOYER이다. 성공 시 refreshToken을 HttpOnly 쿠키로 설정한다. Domain 미설정, Path=/api/auth, SameSite=Lax, Max-Age=1209600초(14일), Secure는 서버 설정에 따른다. Access Token 유효시간은 3600초이며 보호 API에는 Authorization: Bearer 헤더로 보낸다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/SignupRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "처리 성공",
    "headers": {
      "Set-Cookie": {
        "description": "refreshToken 쿠키 설정 (HttpOnly, Path=/api/auth, SameSite=Lax, 14일)",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/SignupResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "userId": 1,
              "email": "student@example.com",
              "role": "STUDENT",
              "accessToken": "access-token-example",
              "tokenType": "Bearer",
              "expiresIn": 3600
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류 / 비밀번호 처리 실패",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          },
          "INVALID_PASSWORD": {
            "description": "INVALID_PASSWORD",
            "value": {
              "code": "INVALID_PASSWORD",
              "message": "비밀번호를 처리할 수 없습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "개발용 LOCAL 인증 비활성화",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "이미 사용 중인 이메일",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "DUPLICATE_EMAIL": {
            "description": "DUPLICATE_EMAIL",
            "value": {
              "code": "DUPLICATE_EMAIL",
              "message": "이미 사용 중인 이메일입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/refresh`

- 기능: Access Token 재발급
- 태그: Auth
- 인증: OpenAPI security 요구 없음
- 설명: 기존 로그인 식별값(sid)을 유지한다. 새 접근 토큰의 유효시간은 최대 3600초이며 로그인 기록의 남은 기간보다 길지 않다. GET /api/auth/csrf에서 받은 token을 X-XSRF-TOKEN 헤더에 넣고, 같은 브라우저의 XSRF-TOKEN 쿠키와 함께 요청한다. Access Token은 필요 없으며 요청 본문은 없다. refreshToken 쿠키가 필수다. Access Token만 새로 발급하고 Refresh Token과 14일 만료 시각은 갱신하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "refreshToken",
    "in": "cookie",
    "description": "로그인·가입 시 받은 HttpOnly 쿠키. 재발급에 필수",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "CSRF 조회 시 설정된 쿠키. 브라우저가 자동 전송",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RefreshResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "accessToken": "access-token-example",
              "tokenType": "Bearer",
              "expiresIn": 3600
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "Refresh Token 누락·만료·무효",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_REFRESH_TOKEN": {
            "description": "INVALID_REFRESH_TOKEN",
            "value": {
              "code": "INVALID_REFRESH_TOKEN",
              "message": "유효한 Refresh Token이 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "CSRF 확인값 누락 또는 불일치 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/phone-verifications`

- 기능: 휴대전화 인증번호 요청
- 태그: Phone Verification
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인한 유학생·사업주 모두 사용한다. 국내 010 번호로 6자리 인증번호를 발송하며 유효시간은 300초다. 계정별·번호별로 재전송 간격 60초, 최근 1시간 최대 5회이며 발송 실패도 요청 횟수에 포함한다. 5회 오입력으로 차단된 계정은 남은 유효시간 동안 재요청할 수 없다. 성공적으로 재발송하면 이전 번호는 무효화된다. 인증번호는 응답에 포함하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/PhoneVerificationRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/PhoneVerificationRequestResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "expiresIn": 300,
              "message": "인증번호가 전송되었습니다."
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "429": {
    "description": "인증 요청 또는 확인 횟수 제한",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_VERIFICATION_RATE_LIMIT": {
            "description": "PHONE_VERIFICATION_RATE_LIMIT",
            "value": {
              "code": "PHONE_VERIFICATION_RATE_LIMIT",
              "message": "인증 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "인증 문자 발송 실패 / 예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "SMS_DELIVERY_FAILED": {
            "description": "SMS_DELIVERY_FAILED",
            "value": {
              "code": "SMS_DELIVERY_FAILED",
              "message": "문자를 발송하지 못했습니다."
            }
          },
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/phone-verifications/verify`

- 기능: 휴대전화 인증번호 확인
- 태그: Phone Verification
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인 회원이 요청한 번호와 인증번호를 확인한다. 유학생 프로필이 있는 회원은 인증 성공 결과만 보관하고 실제 번호는 변경하지 않는다. 인증 성공 후 5분 이내 프로필 PATCH 일괄 저장에서 번호를 변경한다. 재발송 시 이전 확인 결과는 폐기한다. 프로필이 없는 가입 단계와 사업주는 기존처럼 번호와 인증 시각을 저장한다. 틀린 번호·만료·미요청은 400, 코드 5회 오입력 시 남은 유효시간 동안 429다. 다른 계정이 이미 사용하는 번호는 이 확인 단계에서 409로 처리한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/PhoneVerificationConfirmRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/PhoneVerificationConfirmResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "phoneNumber": "010-1234-5678",
              "verifiedAt": "2026-11-01T01:00:00Z",
              "message": "휴대전화 인증이 완료되었습니다."
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류 / 인증번호 불일치 또는 만료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          },
          "INVALID_VERIFICATION_CODE": {
            "description": "INVALID_VERIFICATION_CODE",
            "value": {
              "code": "INVALID_VERIFICATION_CODE",
              "message": "인증번호가 일치하지 않거나 만료되었습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "409": {
    "description": "이미 등록된 전화번호",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "DUPLICATE_PHONE_NUMBER": {
            "description": "DUPLICATE_PHONE_NUMBER",
            "value": {
              "code": "DUPLICATE_PHONE_NUMBER",
              "message": "이미 사용 중인 휴대전화 번호입니다."
            }
          }
        }
      }
    }
  },
  "429": {
    "description": "인증 요청 또는 확인 횟수 제한",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "PHONE_VERIFICATION_RATE_LIMIT": {
            "description": "PHONE_VERIFICATION_RATE_LIMIT",
            "value": {
              "code": "PHONE_VERIFICATION_RATE_LIMIT",
              "message": "인증 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/logout`

- 기능: 로그아웃
- 태그: Auth
- 인증: OpenAPI security 요구 없음
- 설명: GET /api/auth/csrf에서 받은 token을 X-XSRF-TOKEN 헤더에 넣고, 같은 브라우저의 XSRF-TOKEN 쿠키와 함께 요청한다. Access Token은 필요 없으며 요청 본문은 없다. 현재 refreshToken을 무효화하고 해당 쿠키를 Max-Age=0으로 지운다. CSRF 검사를 통과하면 Refresh Token이 없거나 이미 무효여도 200이다. 삭제한 로그인 식별값(sid)에서 발급·재발급된 모든 Access Token은 이후 요청부터 즉시 차단한다. 다른 로그인 세션과 계정·서류·소셜 연결은 유지한다. 프론트는 성공 후 보관한 Access Token을 삭제하고 로그인 화면으로 이동한다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "refreshToken",
    "in": "cookie",
    "description": "로그인·가입 시 받은 HttpOnly 쿠키. 재발급에는 필수, 로그아웃에는 선택",
    "required": false,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "X-XSRF-TOKEN",
    "in": "header",
    "description": "GET /api/auth/csrf 응답의 token",
    "required": true,
    "schema": {
      "type": "string"
    }
  },
  {
    "name": "XSRF-TOKEN",
    "in": "cookie",
    "description": "CSRF 조회 시 설정된 쿠키. 브라우저가 자동 전송",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "headers": {
      "Set-Cookie": {
        "description": "refreshToken 삭제 (Max-Age=0)",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/LogoutResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "message": "로그아웃되었습니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "CSRF 확인값 누락 또는 불일치",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CSRF_TOKEN": {
            "description": "INVALID_CSRF_TOKEN",
            "value": {
              "code": "INVALID_CSRF_TOKEN",
              "message": "CSRF 보안 확인값이 없거나 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/auth/login`

- 기능: 개발용·지정 QA 계정 이메일 로그인
- 태그: Auth
- 인증: OpenAPI security 요구 없음
- 설명: 개발 환경에서 LOCAL_LOGIN_ENABLED=true로 활성화한다(기본값 false). 비활성화 상태에서도 QA_LOGIN_ALLOWED_EMAILS에 지정한 기존 LOCAL 계정은 QA 목적으로 로그인할 수 있다. 허용 목록의 기본값은 비어 있으며 쉼표로 구분한 이메일을 trim·lowercase 정규화하여 정확히 일치하는 경우만 허용한다. 일반 회원은 Google/Kakao 로그인을 사용한다. LOCAL 인증이 비활성화되고 QA 허용 목록에도 없으면 기존 계정 유무·비밀번호와 관계없이 403 FORBIDDEN이다. 요청 형식 검증 오류는 400이다. QA 계정도 LOCAL 이메일과 비밀번호, 탈퇴 여부를 검사한다. QA 설정은 회원가입이나 회원 유형별 권한을 변경하지 않는다. 성공 시 refreshToken을 HttpOnly 쿠키로 설정한다. Domain 미설정, Path=/api/auth, SameSite=Lax, Max-Age=1209600초(14일), Secure는 서버 설정에 따른다. Access Token 유효시간은 3600초이며 보호 API에는 Authorization: Bearer 헤더로 보낸다. 토큰 재발급·현재 기기 로그아웃은 기존 로그인 세션 규칙을 따른다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/LoginRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "headers": {
      "Set-Cookie": {
        "description": "refreshToken 쿠키 설정 (HttpOnly, Path=/api/auth, SameSite=Lax, 14일)",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/LoginResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "userId": 1,
              "role": "STUDENT",
              "accessToken": "access-token-example",
              "tokenType": "Bearer",
              "expiresIn": 3600
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "이메일 또는 비밀번호 불일치 / 유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_CREDENTIALS": {
            "description": "INVALID_CREDENTIALS",
            "value": {
              "code": "INVALID_CREDENTIALS",
              "message": "이메일 또는 비밀번호가 일치하지 않습니다."
            }
          },
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "LOCAL 인증 비활성화 및 QA 허용 목록에 없는 계정 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### POST `/api/applications`

- 기능: 지원 생성
- 태그: Applications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 유효한 추천을 선택해 채용공고에 지원합니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/ApplicationCreateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "201": {
    "description": "지원 생성 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ApplicationCreateResponse"
        }
      }
    }
  },
  "400": {
    "description": "요청 필드가 누락되었거나 희망 근무 시작일이 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 추천이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "추천 또는 채용공고를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "추천·공고 상태가 유효하지 않거나 중복 지원 또는 진행 가능 인원 초과",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/matching-preferences`

- 기능: 내 매칭 조건 조회
- 태그: Student Matching Preferences
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 프로필이 등록된 유학생 본인의 조건을 조회한다. 조건 미입력 시 businessTypeFlexible=false, 목록=[], preferredLocation=null을 반환하며 조회로 데이터를 생성하지 않는다. 업종은 ID 순, 시간은 월~일·시작 시간 순, 우선순위는 1순위부터 반환한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentMatchingPreferenceResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "businessTypeFlexible": false,
              "preferredJobs": [
                {
                  "businessTypeId": 1,
                  "businessTypeName": "FOOD_CAFE",
                  "otherJobName": null
                }
              ],
              "preferredWorkTimes": [
                {
                  "dayOfWeek": "MON",
                  "startTime": "09:00",
                  "endTime": "13:00"
                }
              ],
              "preferredLocation": {
                "locationName": "서울특별시 성동구",
                "latitude": 37.5665,
                "longitude": 126.978,
                "radiusM": 500
              },
              "priorities": [
                {
                  "criterionId": 1,
                  "criterionName": "WORK_TIME",
                  "priorityOrder": 1
                },
                {
                  "criterionId": 2,
                  "criterionName": "WAGE",
                  "priorityOrder": 2
                },
                {
                  "criterionId": 3,
                  "criterionName": "DISTANCE",
                  "priorityOrder": 3
                },
                {
                  "criterionId": 4,
                  "criterionName": "BUSINESS_TYPE",
                  "priorityOrder": 4
                }
              ]
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "유학생 프로필 미등록",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "STUDENT_PROFILE_NOT_FOUND": {
            "description": "STUDENT_PROFILE_NOT_FOUND",
            "value": {
              "code": "STUDENT_PROFILE_NOT_FOUND",
              "message": "유학생 프로필이 아직 등록되지 않았습니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PATCH `/api/students/me/matching-preferences`

- 기능: 매칭 조건 저장·수정
- 태그: Student Matching Preferences
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 수정 반영하기에서 호출하며 상세 화면의 수정은 클라이언트에 임시 보관한다. 보내지 않은 필드는 유지한다. 빈 요청과 수정 대상이 아닌 필드는 400이다. 목록을 보내면 해당 목록 전체를 교체한다. businessTypeFlexible과 preferredJobs는 함께 보낸다. true이면 업종은 [], false이면 1개 이상이고 OTHER는 이름이 필수다. 근무시간 빈 목록은 저장할 수 없다. 최소 희망 시급은 null을 포함해 입력받지 않고 조회에도 포함하지 않는다. 기존 DB 시급 값은 보존한다. 지역은 null로 삭제할 수 없다. 반경은 정수 100~1,000m, 100m 간격으로 제한한다. 위치를 생략하면 기존 반경을 그대로 유지한다. 우선순위는 네 기준·1~4순위를 중복 없이 모두 전송한다. 근무시간은 30분 단위이며 연속 1시간 이상인 구간이 최소 하나 필요하다. 인접한 30분 구간은 연속으로 판단하지만 떨어진 30분 구간의 합계만으로는 허용하지 않는다. 조건 충족 시 별도 30분 구간도 추가할 수 있다. 시작과 종료가 같거나 실제 시간이 겹치면 400이다. 종료가 시작보다 이르면 다음 날 종료이며 시작 요일 하나로 저장·조회한다. 일요일 밤과 월요일 새벽의 겹침도 검사한다. 실패하면 이번 변경 전체를 취소한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

```json
{
  "content": {
    "application/json": {
      "schema": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequest"
      }
    }
  },
  "required": true
}
```

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentMatchingPreferenceResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "businessTypeFlexible": false,
              "preferredJobs": [
                {
                  "businessTypeId": 1,
                  "businessTypeName": "FOOD_CAFE",
                  "otherJobName": null
                }
              ],
              "preferredWorkTimes": [
                {
                  "dayOfWeek": "MON",
                  "startTime": "09:00",
                  "endTime": "13:00"
                }
              ],
              "preferredLocation": {
                "locationName": "서울특별시 성동구",
                "latitude": 37.5665,
                "longitude": 126.978,
                "radiusM": 500
              },
              "priorities": [
                {
                  "criterionId": 1,
                  "criterionName": "WORK_TIME",
                  "priorityOrder": 1
                },
                {
                  "criterionId": 2,
                  "criterionName": "WAGE",
                  "priorityOrder": 2
                },
                {
                  "criterionId": 3,
                  "criterionName": "DISTANCE",
                  "priorityOrder": 3
                },
                {
                  "criterionId": 4,
                  "criterionName": "BUSINESS_TYPE",
                  "priorityOrder": 4
                }
              ]
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "유학생 프로필 미등록 / 업종 또는 우선순위 기준 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "STUDENT_PROFILE_NOT_FOUND": {
            "description": "STUDENT_PROFILE_NOT_FOUND",
            "value": {
              "code": "STUDENT_PROFILE_NOT_FOUND",
              "message": "유학생 프로필이 아직 등록되지 않았습니다."
            }
          },
          "MATCHING_REFERENCE_NOT_FOUND": {
            "description": "MATCHING_REFERENCE_NOT_FOUND",
            "value": {
              "code": "MATCHING_REFERENCE_NOT_FOUND",
              "message": "존재하지 않는 업종 또는 우선순위 기준입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### DELETE `/api/students/me/careers/{careerId}`

- 기능: 경력 개별 삭제 종료
- 태그: Student Careers
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: DB를 변경하지 않는다. 경력 임시 변경은 프로필 PATCH 최종 일괄 저장에 전체 목록으로 전달한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "INVALID_INPUT: 일괄 저장 API 사용 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "경력은 내 정보의 수정 반영하기에서 전체 목록으로 저장해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "인증 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PATCH `/api/students/me/careers/{careerId}`

- 기능: 경력 개별 수정 종료
- 태그: Student Careers
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: DB를 변경하지 않는다. 경력 임시 변경은 프로필 PATCH 최종 일괄 저장에 전체 목록으로 전달한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "INVALID_INPUT: 일괄 저장 API 사용 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "경력은 내 정보의 수정 반영하기에서 전체 목록으로 저장해주세요."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "인증 필요",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PATCH `/api/offers/{offerId}/reject`

- 기능: 채용 제안 거절
- 태그: Employment Offers
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 응답 기한 내 채용 제안을 거절하고 지원을 종료합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "offerId",
    "in": "path",
    "description": "거절할 채용 제안 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 401
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "채용 제안 거절 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentOfferRejectResponse"
        }
      }
    }
  },
  "400": {
    "description": "채용 제안 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 제안이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "채용 제안 또는 연결된 지원을 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "응답 기한이 지났거나 거절 가능한 제안·지원 상태가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### PATCH `/api/offers/{offerId}/accept`

- 기능: 채용 제안 수락
- 태그: Employment Offers
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 응답 기한 내 채용 제안을 수락하고 채용 완료 정보를 생성합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "offerId",
    "in": "path",
    "description": "수락할 채용 제안 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 401
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "채용 제안 수락 및 채용 완료 생성 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentOfferAcceptResponse"
        }
      }
    }
  },
  "400": {
    "description": "채용 제안 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 제안이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "채용 제안 또는 연결된 지원을 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "응답 기한이 지났거나 수락 가능한 제안·지원 상태가 아니거나 이미 채용 완료됨",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### PATCH `/api/notifications/popups/{notificationId}/confirm`

- 기능: 채용 팝업 확인
- 태그: Employment Popup Notifications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인 계정 소유의 팝업을 확인 처리합니다. 이미 확인한 팝업은 최초 확인 시각을 그대로 반환합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "notificationId",
    "in": "path",
    "description": "확인할 팝업 알림 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 401
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "팝업 확인 성공 또는 이미 확인한 팝업 재확인",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentPopupNotificationConfirmResponse"
        },
        "example": {
          "notificationId": 401,
          "confirmedAt": "2026-11-20T05:05:00Z"
        }
      }
    }
  },
  "400": {
    "description": "알림 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "다른 회원의 알림이거나 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "404": {
    "description": "팝업 알림을 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/job-postings/{jobPostingId}`

- 기능: 채용공고 상세 조회
- 태그: Job Postings
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 사업주는 본인 공고의 모든 상태를, 유학생은 RECRUITING 공고만 조회할 수 있다. 임시저장 미입력은 null, 근무시간은 []다. 업종은 공고에서 선택한 값이며 사업장 업종으로 자동 대체하지 않는다. 시간 목록은 월~일·시작 시간 순으로 반환한다. 저장된 제목을 반환하며 조회 중 자동 마감하지 않는다. convertedHourlyWage는 저장된 급여·근무시간으로 계산한 원 단위 반올림 시급이며, 계산에 필요한 값이 없는 임시저장은 null이다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "jobPostingId",
    "in": "path",
    "description": "채용공고 ID (Long 정수)",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64"
    },
    "example": 1
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/JobPostingDetailResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "jobPostingId": 1,
              "workplaceId": 1,
              "workplaceName": "예시카페",
              "title": "예시카페 바리스타 모집",
              "businessTypeId": 1,
              "businessTypeName": "FOOD_CAFE",
              "jobRole": "바리스타",
              "recruitmentCount": 2,
              "wageType": "HOURLY",
              "wageAmount": 13000,
              "convertedHourlyWage": 13000,
              "workStartDate": "2027-03-01",
              "requiredKoreanLevel": "INTERMEDIATE",
              "preferredExperience": "NONE",
              "applicationDeadlineDate": "2027-03-14",
              "workTimeNegotiable": false,
              "status": "RECRUITING",
              "workTimes": [
                {
                  "dayOfWeek": "MON",
                  "startTime": "09:00",
                  "endTime": "13:00"
                }
              ],
              "workplaceAddress": "서울특별시 성동구 예시로 10",
              "latitude": 37.5665,
              "longitude": 126.978
            }
          }
        }
      }
    }
  },
  "400": {
    "description": "입력 형식 또는 값 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INVALID_INPUT": {
            "description": "INVALID_INPUT",
            "value": {
              "code": "INVALID_INPUT",
              "message": "요청 형식이 올바르지 않습니다."
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 인증 정보 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "UNAUTHORIZED": {
            "description": "UNAUTHORIZED",
            "value": {
              "code": "UNAUTHORIZED",
              "message": "유효한 인증 정보가 필요합니다."
            }
          }
        }
      }
    }
  },
  "403": {
    "description": "접근 권한 없음 / 탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "FORBIDDEN": {
            "description": "FORBIDDEN",
            "value": {
              "code": "FORBIDDEN",
              "message": "접근 권한이 없습니다."
            }
          },
          "WITHDRAWN_ACCOUNT": {
            "description": "WITHDRAWN_ACCOUNT",
            "value": {
              "code": "WITHDRAWN_ACCOUNT",
              "message": "탈퇴한 계정입니다."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "채용공고 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "JOB_POSTING_NOT_FOUND": {
            "description": "JOB_POSTING_NOT_FOUND",
            "value": {
              "code": "JOB_POSTING_NOT_FOUND",
              "message": "채용공고를 찾을 수 없습니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### PATCH `/api/applications/{applicationId}/withdraw`

- 기능: 지원 취소
- 태그: Applications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 사업주 응답 대기 중인 지원을 취소합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "applicationId",
    "in": "path",
    "description": "취소할 지원 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64"
    },
    "example": 201
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "지원 취소 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ApplicationWithdrawResponse"
        }
      }
    }
  },
  "400": {
    "description": "지원 ID 형식이 올바르지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 지원이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "지원을 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "사업주 응답 대기 상태가 아니어서 취소할 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/users/me/term-agreements/location`

- 기능: 내 위치 약관 동의 상태 조회
- 태그: Term Agreements
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 계정 생성 후 온보딩과 마이페이지에서 같은 로그인 회원의 동의를 조회한다. GPS를 사용하려 할 때 isAgreed=false이면 프론트가 위치 약관 동의를 받고, 반환된 termTypeId와 실제 표시한 본문 version 및 isAgreed=true를 기존 PUT /api/users/me/term-agreements에 보낸다. true이면 약관 동의창을 반복 표시하지 않는다. 주소 직접 입력은 동의 없이 진행하며 위치 약관은 계정 생성 전 필수 가입 약관 목록에 포함되지 않는다. 미저장은 false/agreedAt=null이며 조회로 동의 기록을 생성하거나 시각을 변경하지 않는다. 약관 본문·번역·기기 위치 권한·GPS 실행은 프론트에서 처리하며 이 API는 좌표를 받거나 저장하지 않는다. 유학생·사업주·LOCAL 회원이 본인의 동의만 조회하며 온보딩 완료나 등록증 인증을 요구하지 않는다. 가입 진행 쿠키만으로는 호출할 수 없다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "본인의 위치 약관 동의 상태",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/LocationConsentResponse"
        },
        "examples": {
          "notAgreed": {
            "description": "notAgreed",
            "value": {
              "termTypeId": 9,
              "termTypeName": "위치기반 서비스 이용약관",
              "isAgreed": false,
              "agreedAt": null,
              "agreedVersion": null,
              "currentVersion": "v1"
            }
          },
          "agreed": {
            "description": "agreed",
            "value": {
              "termTypeId": 9,
              "termTypeName": "위치기반 서비스 이용약관",
              "isAgreed": true,
              "agreedAt": "2026-11-20T05:00:00Z",
              "agreedVersion": "v1",
              "currentVersion": "v1"
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 로그인 없음 또는 회원 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "UNAUTHORIZED",
          "message": "유효한 인증 정보가 필요합니다."
        }
      }
    }
  },
  "403": {
    "description": "탈퇴한 회원",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "WITHDRAWN_ACCOUNT",
          "message": "탈퇴한 계정입니다."
        }
      }
    }
  },
  "404": {
    "description": "위치 약관 항목 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "TERM_TYPE_NOT_FOUND",
          "message": "존재하지 않는 약관 유형입니다."
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/users/me/onboarding`

- 기능: 내 온보딩 상태 조회
- 태그: Onboarding Status
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 계정 생성 이후 로그인 액세스 토큰으로 호출한다. 가입 진행 쿠키만으로는 조회할 수 없다. 서버 회원 유형과 회원 연결 등록증 인증 기록으로 새 유학생 온보딩 적용 여부를 판단한다. 대상 회원의 완료 시각이 없으면 REQUIRED를 반환한다. 과거에 생년월일이나 일부 프로필이 저장되어 있어도 BASIC_INFORMATION으로 항상 생년월일부터 다시 입력한다. 임시 입력값과 마지막 작성 단계는 복원하지 않는다. 프로필이나 일부 입력이 있어도 완료로 추정하지 않는다. 최초 완료 시각이 있으면 COMPLETED와 NONE을 반환한다. 등록증 인증 기록이 없는 LOCAL · 기존 가입 회원과 사업주는 NOT_APPLICABLE과 EXISTING_FLOW로 기존 흐름을 사용하며, 이를 기존 온보딩 완료나 서비스 이용 허가로 해석하지 않는다. 체류기간이 만료되어도 입력 완료 상태는 유지하며 추천 이용 자격은 별도다. 조회는 계정 · 프로필 · 인증 결과 · 완료 시각을 생성하거나 수정하지 않으며 외부 인증을 재호출하지 않는다. 로그인 · 가입 응답과 별도로 이 상태를 확인한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "본인 온보딩 상태",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/OnboardingStatusResponse"
        },
        "examples": {
          "required": {
            "description": "required",
            "value": {
              "userId": 1,
              "role": "STUDENT",
              "status": "REQUIRED",
              "nextStep": "BASIC_INFORMATION",
              "completedAt": null
            }
          },
          "completed": {
            "description": "completed",
            "value": {
              "userId": 1,
              "role": "STUDENT",
              "status": "COMPLETED",
              "nextStep": "NONE",
              "completedAt": "2026-11-20T03:00:00Z"
            }
          },
          "existingFlow": {
            "description": "existingFlow",
            "value": {
              "userId": 2,
              "role": "EMPLOYER",
              "status": "NOT_APPLICABLE",
              "nextStep": "EXISTING_FLOW",
              "completedAt": null
            }
          }
        }
      }
    }
  },
  "401": {
    "description": "유효한 로그인 없음 · 계정 생성 전 가입 상태",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "UNAUTHORIZED",
          "message": "유효한 인증 정보가 필요합니다."
        }
      }
    }
  },
  "403": {
    "description": "탈퇴한 계정",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "example": {
          "code": "WITHDRAWN_ACCOUNT",
          "message": "탈퇴한 계정입니다."
        }
      }
    }
  }
}
```

### GET `/api/students/me/working-conditions`

- 기능: 나의 근무 가능 조건 조회
- 태그: Student Working Conditions
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 현재 유효한 배지가 있어야 조회한다. 배지 발급 시 프로필에 저장한 근무 가능 조건을 제공하며, 조회 시 최종 등록 서류와 적용일이 도래한 최신 인증대학 기준으로 계산·저장한다. 미확정 OCR 값은 사용하지 않는다. TOPIK 기본요건 미충족자의 한도는 주말·공휴일·방학을 포함한 공통 주당 한도이며 별도로 더하지 않는다. 충족자는 학기 중 주중 25/30시간에 우대 최대5시간을 더하고 주말·공휴일·방학은 시간 상한 없음으로 제공한다. 학적 상태·KIIP·학교별 학사일정은 사용하지 않으며 실제 허가 완료를 뜻하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "예상 근무시간 기준",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/StudentWorkingConditionsResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님, 탈퇴 계정 또는 ACTIVE_BADGE_REQUIRED / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "WORKING_CONDITIONS_DATA_INCOMPLETE: 과정/세부 비자 불일치 또는 최종 서류값 누락/지원 범위 초과",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "503": {
    "description": "ACCREDITED_UNIVERSITY_LIST_UNAVAILABLE: 적용 목록 없음/불완전",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/registration`

- 기능: 현재 등록증 정보와 서비스 지원 대상 조회
- 태그: Student Registration Renewal
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 최종 확인된 이름·국적·원문 체류자격·세부 코드·만료일을 조회한다. 진행 중인 갱신 값은 반영하지 않는다. D-2만 저장된 학업과정으로 조합하며 D-10 등은 원문을 유지한다. 서비스 지원 여부는 배지 회수·추천·지원 제한을 실행하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "최종 등록증 정보",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/RegistrationRenewalConfirmationResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님·탈퇴·온보딩 미완료 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "REGISTRATION_REQUIRED",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/documents/{kind}`

- 기능: 본인의 최종 성적·TOPIK 정보
- 태그: Student Academic Documents
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 최종 추출값과 등록 시각을 반환하며 미확정 값·원본 키·만료일은 반환하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "kind",
    "in": "path",
    "required": true,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "400": {
    "description": "파일 누락·잘못된 요청",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 아님 또는 탈퇴 상태 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필·최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "DOCUMENT_DRAFT_NOT_FOUND",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "413": {
    "description": "FILE_TOO_LARGE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "415": {
    "description": "UNSUPPORTED_FILE_TYPE",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "422": {
    "description": "UNREADABLE_STUDENT_DOCUMENT. 직전 학기 평균 학점 또는 TOPIK 등급 미인식을 message로 안내한다. 파일·서류 유형 자체를 읽지 못하면 일반 재업로드 안내를 반환한다",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "TRANSCRIPT_GPA_UNREADABLE": {
            "description": "TRANSCRIPT_GPA_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "직전 학기 평균 학점을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "TOPIK_LEVEL_UNREADABLE": {
            "description": "TOPIK_LEVEL_UNREADABLE",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "TOPIK 등급을 확인하지 못했습니다. 해당 정보가 선명하게 보이도록 다시 촬영하거나 파일을 올려주세요."
            }
          },
          "UNREADABLE_STUDENT_DOCUMENT": {
            "description": "UNREADABLE_STUDENT_DOCUMENT",
            "value": {
              "code": "UNREADABLE_STUDENT_DOCUMENT",
              "message": "서류 정보를 확인하지 못했습니다. 다시 촬영하거나 업로드해주세요."
            }
          }
        }
      }
    }
  },
  "502": {
    "description": "OCR·저장소 실패",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/documents/enrollment`

- 기능: 본인의 최종 재학증명서 정보 조회
- 태그: Student Enrollment
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 미확정 추출값·원본 경로는 제공하지 않는다. 최종 등록된 대학교·캠퍼스·학년·등록 시각을 반환한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "최종 등록 정보",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/EnrollmentDocumentResponse"
        }
      }
    }
  },
  "401": {
    "description": "유효한 계정 인증 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 또는 최종 등록 서류 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/documents/completion`

- 기능: 본인의 서류 등록 완성률 조회
- 태그: Student Document Completion
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 등록증 인증 완료 및 유효한 최종 체류 만료일, 재학·성적·TOPIK 최종 등록을 각각 25% 반영한다. 합계는 0·25·50·75·100이다. 한국 날짜로 만료일 당일까지 등록증 25%를 유지하고 다음 날 제외한다. 갱신 최종 성공 시에만 유효한 만료일을 반영한다. 갱신 실패·중단·OCR 추출만 완료된 상태는 기존 확정 정보를 바꾸지 않는다. 조회는 DB 정보를 변경하거나 배지를 회수하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "완성률과 네 항목 반영 여부",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/StudentDocumentCompletionResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/students/me/badge`

- 기능: 본인의 인증 배지 상태 조회
- 태그: Student Badge
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 최종 등록된 등록증·재학·성적·TOPIK 및 한국 날짜의 체류 만료일로 현재 유효 여부를 판단한다. 조회는 발급/회수 처리를 하지 않는다. issuedAt만으로 유효 여부를 판단하지 않는다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "현재 상태",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/StudentBadgeResponse"
        }
      }
    }
  },
  "401": {
    "description": "로그인 필요",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생이 아님 또는 탈퇴 계정 / 온보딩 미완료",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      },
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "프로필 없음",
    "content": {
      "*/*": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/recommendations/{id}`

- 기능: 추천 상세 조회
- 태그: Recommendations
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 자신의 최신 추천 배치에 포함된 추천 상세를 조회합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "id",
    "in": "path",
    "description": "추천 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 101
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "추천 상세 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/RecommendationDetailResponse"
        }
      }
    }
  },
  "400": {
    "description": "추천 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 추천이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "추천 또는 최신 추천 배치를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "409": {
    "description": "이전 배치의 추천이거나 현재 조건에 맞게 추천 갱신이 필요함",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/notifications/popups`

- 기능: 미확인 채용 팝업 조회
- 태그: Employment Popup Notifications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 로그인 계정의 미확인 채용 팝업을 오래된 순서로 모두 조회합니다. 확인된 팝업은 다른 기기에서도 다시 반환하지 않습니다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "미확인 팝업 조회 성공. 없으면 notifications는 빈 배열",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentPopupNotificationListResponse"
        },
        "example": {
          "notifications": [
            {
              "notificationId": 401,
              "type": "OFFER_CREATED",
              "message": "새로운 채용 제안이 도착했습니다. 서비스에서 응답해 주세요.",
              "applicationId": 201,
              "employmentOfferId": 301,
              "createdAt": "2026-11-20T05:00:00Z"
            }
          ]
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "탈퇴한 계정",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/matches/{id}`

- 기능: 채용 완료 상세 조회
- 태그: Employment Matches
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 채용 완료 당사자인 유학생 또는 사업주가 근무 정보와 상대방 연락처를 조회합니다. 사업주 조회에서 탈퇴 신청 30일 경계부터 studentDataMasked=true이고 유학생 연락처·프로필·희망 시작일은 null입니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "id",
    "in": "path",
    "description": "채용 완료 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 501
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "채용 완료 상세 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentMatchDetailResponse"
        }
      }
    }
  },
  "400": {
    "description": "채용 완료 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "채용 완료 당사자가 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "채용 완료 정보를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/matches/me`

- 기능: 내 채용 완료 목록 조회
- 태그: Employment Matches
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생은 본인의 전체 채용 완료 목록을, 사업주는 본인 공고의 목록을 조회합니다. 채용공고 필터는 사업주만 사용할 수 있습니다. 사업주 조회에서 탈퇴 신청 30일 경계부터 해당 항목의 studentDataMasked=true이고 유학생 정보·희망 시작일은 null입니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "jobPostingId",
    "in": "query",
    "description": "사업주용 채용공고 ID 필터. 유학생은 사용할 수 없습니다.",
    "required": false,
    "schema": {
      "type": "integer",
      "format": "int64"
    },
    "example": 301
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "내 채용 완료 목록 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/EmploymentMatchListResponse"
        }
      }
    }
  },
  "400": {
    "description": "유학생이 공고 필터를 사용했거나 공고 ID가 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "지원되지 않는 역할이거나 본인 소유 공고가 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "필터로 지정한 채용공고를 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/auth/social/{provider}`

- 기능: 소셜 로그인 시작
- 태그: Social Auth
- 인증: OpenAPI security 요구 없음
- 설명: 브라우저 전체 페이지 이동으로 호출한다(fetch 호출 아님). provider와 회원 유형을 선택하면 소셜 로그인 화면으로 이동한다. 가입을 중단한 뒤 재시작할 때도 이 API부터 호출한다. 기존 socialSignup 쿠키에 해당하는 가입 정보·임시 약관·인증번호를 폐기하고 쿠키를 지운다. 브라우저 종료만으로 즉시 삭제되지는 않는다. 새 소셜 인증은 새 30분 가입 정보를 만들고 같은 미가입 소셜 사용자의 이전 가입 정보도 대체한다. 기존 회원·소셜 연결·로그인 상태는 변경하지 않는다. 인증 완료 후 서버 설정의 프론트 주소로 돌아오며, 같은 브라우저에서 CSRF 조회 후 POST /api/auth/social/result를 호출한다. 인증 실패 시 프론트 주소의 error 쿼리에 SOCIAL_AUTH_FAILED, SOCIAL_ROLE_MISMATCH 또는 WITHDRAWN_ACCOUNT가 전달된다. 토큰은 URL에 포함하지 않는다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "provider",
    "in": "path",
    "description": "로그인 제공자",
    "required": true,
    "schema": {
      "type": "string",
      "enum": [
        "google",
        "kakao"
      ]
    }
  },
  {
    "name": "role",
    "in": "query",
    "description": "랜딩 페이지에서 선택한 회원 유형",
    "required": true,
    "schema": {
      "type": "string",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ]
    }
  },
  {
    "name": "socialSignup",
    "in": "cookie",
    "description": "이전 가입 진행 쿠키. 있으면 이번 가입 시작 시 폐기",
    "required": false,
    "schema": {
      "type": "string"
    }
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

원본에 2xx 성공 응답 코드와 성공 응답 스키마가 명시되지 않음.

```json
{
  "302": {
    "description": "소셜 인증 화면으로 이동",
    "headers": {
      "Location": {
        "description": "서버의 소셜 인증 시작 주소",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    }
  },
  "400": {
    "description": "지원하지 않는 provider, 회원 유형 누락 또는 잘못된 유형",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "INVALID_INPUT",
              "message": "지원하지 않는 소셜 로그인입니다."
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  },
  "503": {
    "description": "소셜 로그인 설정 전",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "error": {
            "description": "error",
            "value": {
              "code": "SOCIAL_LOGIN_UNAVAILABLE",
              "message": "소셜 로그인 준비 중입니다."
            }
          }
        }
      }
    }
  }
}
```

### GET `/api/auth/csrf`

- 기능: CSRF 확인값 조회
- 태그: Auth
- 인증: OpenAPI security 요구 없음
- 설명: 인증 없이 호출할 수 있다. 응답의 headerName과 token을 사용해 재발급·로그아웃 요청을 보낸다. XSRF-TOKEN 쿠키는 브라우저가 저장·전송하며, JavaScript는 쿠키 대신 응답 본문의 token을 읽는다. 쿠키가 유지되도록 fetch credentials 또는 Axios withCredentials를 설정한다.

**Path/query/header/cookie 파라미터**

원본에 명시된 파라미터 없음.

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "처리 성공",
    "headers": {
      "Set-Cookie": {
        "description": "XSRF-TOKEN 쿠키 설정",
        "style": "simple",
        "schema": {
          "type": "string"
        }
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/CsrfResponse"
        },
        "examples": {
          "success": {
            "description": "success",
            "value": {
              "headerName": "X-XSRF-TOKEN",
              "token": "csrf-token-example"
            }
          }
        }
      }
    }
  },
  "500": {
    "description": "예상하지 못한 서버 오류",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "INTERNAL_SERVER_ERROR": {
            "description": "INTERNAL_SERVER_ERROR",
            "value": {
              "code": "INTERNAL_SERVER_ERROR",
              "message": "서버 오류가 발생했습니다."
            }
          }
        }
      }
    }
  }
}
```

### GET `/api/applications/{id}`

- 기능: 유학생용 지원 상세 조회
- 태그: Applications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 지원 진행 상태와 채용공고·채용 제안·채용 완료 연결 정보를 조회합니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "id",
    "in": "path",
    "description": "조회할 지원 ID",
    "required": true,
    "schema": {
      "type": "integer",
      "format": "int64",
      "exclusiveMinimum": 0
    },
    "example": 201
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "지원 상세 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentApplicationDetailResponse"
        }
      }
    }
  },
  "400": {
    "description": "지원 ID가 양수가 아님",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 본인의 지원이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  },
  "404": {
    "description": "지원을 찾을 수 없음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  }
}
```

### GET `/api/applications/me`

- 기능: 내 지원 목록 조회
- 태그: Applications
- 인증: `[ { "bearerAuth": [] } ]`
- 설명: 유학생이 본인의 지원 목록을 조회합니다. 상태를 생략하면 종료된 지원은 제외됩니다.

**Path/query/header/cookie 파라미터**

```json
[
  {
    "name": "status",
    "in": "query",
    "description": "지원 상태 필터: WAITING_RESPONSE(응답 대기), OFFERED(제안 발송), COMPLETED(채용 완료), ENDED(종료)",
    "required": false,
    "schema": {
      "type": "string",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ]
    },
    "example": "OFFERED"
  }
]
```

**요청 본문**

원본에 요청 본문 명세 없음.

**상태 코드 및 응답**

```json
{
  "200": {
    "description": "내 지원 목록 조회 성공",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/StudentApplicationListResponse"
        }
      }
    }
  },
  "400": {
    "description": "지원 상태 필터가 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "401": {
    "description": "Access Token이 없거나 유효하지 않음",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        }
      }
    }
  },
  "403": {
    "description": "유학생 계정이 아니거나 탈퇴한 계정 / 온보딩 미완료",
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/ErrorResponse"
        },
        "examples": {
          "ONBOARDING_REQUIRED": {
            "value": {
              "code": "ONBOARDING_REQUIRED",
              "message": "생년월일부터 온보딩을 완료해주세요."
            }
          }
        }
      }
    }
  }
}
```

## 구성 스키마

다음은 위 요청·응답에서 재귀적으로 참조한 원본 스키마다. `properties`는 필드와 타입·제약을, `required`는 필수 필드를, `enum`은 허용 값을 나타낸다. `nullable` 또는 `type` 배열은 null 허용 여부를 그대로 표시한다. 중첩 `$ref`도 이 절에서 찾을 수 있다.

### `#/components/schemas/ApplicationCreateRequest`

```json
{
  "type": "object",
  "description": "지원 생성 요청",
  "properties": {
    "recommendationId": {
      "type": "integer",
      "format": "int64",
      "description": "본인 최신 추천 배치의 추천 ID",
      "example": 101,
      "exclusiveMinimum": 0
    },
    "desiredStartDate": {
      "type": "string",
      "format": "date",
      "description": "희망 근무 시작일. 요청일 이후이며 공고 근무 시작일보다 빠를 수 없습니다.",
      "example": "2026-12-01"
    }
  },
  "required": [
    "desiredStartDate",
    "recommendationId"
  ]
}
```

### `#/components/schemas/ApplicationCreateResponse`

```json
{
  "type": "object",
  "description": "지원 생성 결과",
  "properties": {
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "recommendationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원에 사용한 추천 ID",
      "example": 101
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "desiredStartDate": {
      "type": "string",
      "format": "date",
      "description": "희망 근무 시작일",
      "example": "2026-12-01"
    },
    "status": {
      "type": "string",
      "description": "지원 상태: WAITING_RESPONSE(사업주 응답 대기), OFFERED(채용 제안 발송), COMPLETED(채용 완료), ENDED(지원 종료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "WAITING_RESPONSE"
    },
    "employerResponseDeadline": {
      "type": "string",
      "format": "date-time",
      "description": "사업주 응답 기한",
      "example": "2026-11-15T03:00:00Z"
    },
    "appliedAt": {
      "type": "string",
      "format": "date-time",
      "description": "지원 시각",
      "example": "2026-11-14T03:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "appliedAt",
    "desiredStartDate",
    "employerResponseDeadline",
    "jobPostingId",
    "recommendationId",
    "status"
  ]
}
```

### `#/components/schemas/ApplicationWithdrawResponse`

```json
{
  "type": "object",
  "description": "유학생 지원 취소 결과",
  "properties": {
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "status": {
      "type": "string",
      "description": "변경된 지원 상태: ENDED(지원 종료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "ENDED"
    },
    "endReason": {
      "type": "string",
      "description": "종료 사유",
      "enum": [
        "EMPLOYER_REJECTED",
        "WITHDRAWN",
        "EMPLOYER_RESPONSE_EXPIRED",
        "STUDENT_REJECTED",
        "STUDENT_RESPONSE_EXPIRED",
        "JOB_POSTING_CLOSED"
      ],
      "example": "WITHDRAWN"
    },
    "endedAt": {
      "type": "string",
      "format": "date-time",
      "description": "지원 종료 시각",
      "example": "2026-11-14T04:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "endReason",
    "endedAt",
    "status"
  ]
}
```

### `#/components/schemas/BasicInformation`

```json
{
  "type": "object",
  "properties": {
    "visaCode": {
      "type": "string"
    },
    "studyProgram": {
      "type": "string",
      "enum": [
        "ASSOCIATE",
        "BACHELOR",
        "MASTER",
        "DOCTORATE",
        "EXCHANGE"
      ]
    },
    "gradeLevel": {
      "type": "integer",
      "format": "int32"
    },
    "universityName": {
      "type": "string"
    },
    "campusName": {
      "type": [
        "string",
        "null"
      ]
    },
    "topikLevel": {
      "type": "integer",
      "format": "int32"
    },
    "previousSemesterGpa": {
      "type": "number",
      "description": "최종 성적증명서의 가장 최근 학기 평균 학점"
    }
  }
}
```

### `#/components/schemas/Contact`

```json
{
  "type": "object",
  "description": "채용 완료 상대방 연락처",
  "properties": {
    "name": {
      "type": "string",
      "description": "상대방 이름",
      "example": "김하이어"
    },
    "phoneNumber": {
      "type": "string",
      "description": "상대방 전화번호",
      "example": "010-0000-0000"
    }
  },
  "required": [
    "name",
    "phoneNumber"
  ]
}
```

### `#/components/schemas/CsrfResponse`

```json
{
  "type": "object",
  "description": "CSRF 확인값",
  "properties": {
    "headerName": {
      "type": "string",
      "description": "재발급·로그아웃 요청에 사용할 CSRF 헤더 이름",
      "example": "X-XSRF-TOKEN"
    },
    "token": {
      "type": "string",
      "description": "CSRF 확인값. 쿠키를 유지한 상태에서 headerName 헤더에 그대로 전송",
      "example": "csrf-token-example"
    }
  },
  "required": [
    "headerName",
    "token"
  ]
}
```

### `#/components/schemas/DeveloperInquiryCreateRequest`

```json
{
  "type": "object",
  "description": "개발자 문의 접수 요청",
  "properties": {
    "replyEmail": {
      "type": "string",
      "format": "email",
      "description": "답변을 받을 이메일",
      "example": "reply@example.com",
      "maxLength": 255,
      "minLength": 0
    },
    "inquiryType": {
      "type": "string",
      "description": "문의 유형. 전체 선택지는 미확정이며 현재 확인된 화면 표시값은 '사용 방법'",
      "example": "사용 방법",
      "maxLength": 50,
      "minLength": 0
    },
    "title": {
      "type": "string",
      "description": "문의 제목",
      "example": "채용 제안 확인 방법을 알고 싶어요",
      "maxLength": 200,
      "minLength": 0
    },
    "content": {
      "type": "string",
      "description": "문의 내용",
      "example": "받은 채용 제안은 어디에서 확인할 수 있나요?",
      "maxLength": 5000,
      "minLength": 0
    }
  },
  "required": [
    "content",
    "inquiryType",
    "replyEmail",
    "title"
  ]
}
```

### `#/components/schemas/DeveloperInquiryCreateResponse`

```json
{
  "type": "object",
  "description": "개발자 문의 접수 결과",
  "properties": {
    "inquiryId": {
      "type": "integer",
      "format": "int64",
      "description": "접수된 문의 ID",
      "example": 101
    },
    "submittedAt": {
      "type": "string",
      "format": "date-time",
      "description": "문의 접수 시각",
      "example": "2026-11-24T03:00:00Z"
    }
  },
  "required": [
    "inquiryId",
    "submittedAt"
  ]
}
```

### `#/components/schemas/EmploymentMatchDetailResponse`

```json
{
  "type": "object",
  "description": "채용 완료 상세 정보",
  "properties": {
    "matchId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 완료 ID",
      "example": 501
    },
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "offerId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 제안 ID",
      "example": 401
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "jobTitle": {
      "type": "string",
      "description": "채용공고 제목",
      "example": "카페 주말 스태프"
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장 이름",
      "example": "하이어링크 카페"
    },
    "workplaceAddress": {
      "type": "string",
      "description": "사업장 주소",
      "example": "서울특별시 중구 세종대로 1"
    },
    "wageType": {
      "type": "string",
      "description": "급여 유형",
      "example": "HOURLY"
    },
    "wageAmount": {
      "type": "integer",
      "format": "int32",
      "description": "급여 금액(원)",
      "example": 12000
    },
    "workTimes": {
      "type": "array",
      "description": "근무시간 목록",
      "items": {
        "$ref": "#/components/schemas/WorkTime"
      }
    },
    "desiredStartDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "희망 근무 시작일. 사업주 조회에서 studentDataMasked=true이면 null",
      "example": "2026-12-01"
    },
    "matchedAt": {
      "type": "string",
      "format": "date-time",
      "description": "채용 완료 시각",
      "example": "2026-11-14T05:00:00Z"
    },
    "studentDataMasked": {
      "type": "boolean",
      "description": "탈퇴 유학생 개인정보 마스킹 여부. 유학생 본인 조회는 false",
      "example": false
    },
    "contact": {
      "type": "null",
      "$ref": "#/components/schemas/Contact",
      "description": "조회자 상대방의 연락처. 사업주 조회에서 studentDataMasked=true이면 null"
    },
    "student": {
      "type": "null",
      "$ref": "#/components/schemas/Student",
      "description": "유학생 정보. 유학생 본인 조회 또는 studentDataMasked=true이면 null"
    }
  },
  "required": [
    "applicationId",
    "jobPostingId",
    "jobTitle",
    "matchId",
    "matchedAt",
    "offerId",
    "studentDataMasked",
    "wageAmount",
    "wageType",
    "workTimes",
    "workplaceAddress",
    "workplaceName"
  ]
}
```

### `#/components/schemas/EmploymentMatchItem`

```json
{
  "type": "object",
  "description": "채용 완료 목록 항목",
  "properties": {
    "matchId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 완료 ID",
      "example": 501
    },
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "offerId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 제안 ID",
      "example": 401
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "jobTitle": {
      "type": "string",
      "description": "채용공고 제목",
      "example": "카페 주말 스태프"
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장 이름",
      "example": "하이어링크 카페"
    },
    "wageType": {
      "type": "string",
      "description": "급여 유형",
      "example": "HOURLY"
    },
    "wageAmount": {
      "type": "integer",
      "format": "int32",
      "description": "급여 금액(원)",
      "example": 12000
    },
    "desiredStartDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "희망 근무 시작일. studentDataMasked=true이면 null",
      "example": "2026-12-01"
    },
    "matchedAt": {
      "type": "string",
      "format": "date-time",
      "description": "채용 완료 시각",
      "example": "2026-11-14T05:00:00Z"
    },
    "studentDataMasked": {
      "type": "boolean",
      "description": "탈퇴 유학생 개인정보 마스킹 여부. 유학생 본인 조회는 false",
      "example": false
    },
    "student": {
      "type": "null",
      "$ref": "#/components/schemas/Student",
      "description": "유학생 정보. 유학생 본인 조회 또는 studentDataMasked=true이면 null"
    }
  },
  "required": [
    "applicationId",
    "jobPostingId",
    "jobTitle",
    "matchId",
    "matchedAt",
    "offerId",
    "studentDataMasked",
    "wageAmount",
    "wageType",
    "workplaceName"
  ]
}
```

### `#/components/schemas/EmploymentMatchListResponse`

```json
{
  "type": "object",
  "description": "본인 채용 완료 목록",
  "properties": {
    "matches": {
      "type": "array",
      "description": "최신순 채용 완료 목록",
      "items": {
        "$ref": "#/components/schemas/EmploymentMatchItem"
      }
    }
  },
  "required": [
    "matches"
  ]
}
```

### `#/components/schemas/EmploymentOfferAcceptResponse`

```json
{
  "type": "object",
  "description": "채용 제안 수락 결과",
  "properties": {
    "offerId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 제안 ID",
      "example": 401
    },
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "employmentMatchId": {
      "type": "integer",
      "format": "int64",
      "description": "생성된 채용 완료 ID",
      "example": 501
    },
    "offerStatus": {
      "type": "string",
      "description": "변경된 채용 제안 상태: ACCEPTED(수락)",
      "enum": [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED"
      ],
      "example": "ACCEPTED"
    },
    "applicationStatus": {
      "type": "string",
      "description": "변경된 지원 상태: COMPLETED(채용 완료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "COMPLETED"
    },
    "respondedAt": {
      "type": "string",
      "format": "date-time",
      "description": "제안 응답 시각",
      "example": "2026-11-14T05:00:00Z"
    },
    "completedAt": {
      "type": "string",
      "format": "date-time",
      "description": "채용 완료 시각",
      "example": "2026-11-14T05:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "applicationStatus",
    "completedAt",
    "employmentMatchId",
    "offerId",
    "offerStatus",
    "respondedAt"
  ]
}
```

### `#/components/schemas/EmploymentOfferRejectResponse`

```json
{
  "type": "object",
  "description": "채용 제안 거절 결과",
  "properties": {
    "offerId": {
      "type": "integer",
      "format": "int64",
      "description": "채용 제안 ID",
      "example": 401
    },
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "offerStatus": {
      "type": "string",
      "description": "변경된 채용 제안 상태: REJECTED(거절)",
      "enum": [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED"
      ],
      "example": "REJECTED"
    },
    "applicationStatus": {
      "type": "string",
      "description": "변경된 지원 상태: ENDED(지원 종료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "ENDED"
    },
    "endReason": {
      "type": "string",
      "description": "지원 종료 사유",
      "enum": [
        "EMPLOYER_REJECTED",
        "WITHDRAWN",
        "EMPLOYER_RESPONSE_EXPIRED",
        "STUDENT_REJECTED",
        "STUDENT_RESPONSE_EXPIRED",
        "JOB_POSTING_CLOSED"
      ],
      "example": "STUDENT_REJECTED"
    },
    "respondedAt": {
      "type": "string",
      "format": "date-time",
      "description": "제안 응답 시각",
      "example": "2026-11-14T05:00:00Z"
    },
    "endedAt": {
      "type": "string",
      "format": "date-time",
      "description": "제안 및 지원 종료 시각",
      "example": "2026-11-14T05:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "applicationStatus",
    "endReason",
    "endedAt",
    "offerId",
    "offerStatus",
    "respondedAt"
  ]
}
```

### `#/components/schemas/EmploymentPopupNotificationConfirmResponse`

```json
{
  "type": "object",
  "properties": {
    "notificationId": {
      "type": "integer",
      "format": "int64",
      "description": "확인한 팝업 알림 ID",
      "example": 401
    },
    "confirmedAt": {
      "type": "string",
      "format": "date-time",
      "description": "최초 확인 시각",
      "example": "2026-11-20T05:05:00Z"
    }
  }
}
```

### `#/components/schemas/EmploymentPopupNotificationItemResponse`

```json
{
  "type": "object",
  "properties": {
    "notificationId": {
      "type": "integer",
      "format": "int64",
      "description": "팝업 알림 ID",
      "example": 401
    },
    "type": {
      "type": "string",
      "description": "채용 팝업 알림 유형",
      "enum": [
        "APPLICATION_CREATED",
        "APPLICATION_REJECTED",
        "OFFER_CREATED",
        "OFFER_ACCEPTED",
        "OFFER_REJECTED"
      ],
      "example": "OFFER_CREATED"
    },
    "message": {
      "type": "string",
      "description": "팝업 표시 문구",
      "example": "새로운 채용 제안이 도착했습니다. 서비스에서 응답해 주세요."
    },
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "관련 지원 ID",
      "example": 201
    },
    "employmentOfferId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "관련 채용 제안 ID. 지원 생성·거절 알림은 null",
      "example": 301
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "알림 생성 시각",
      "example": "2026-11-20T05:00:00Z"
    }
  }
}
```

### `#/components/schemas/EmploymentPopupNotificationListResponse`

```json
{
  "type": "object",
  "properties": {
    "notifications": {
      "type": "array",
      "description": "오래된 순서의 미확인 채용 팝업 알림. 없으면 빈 배열",
      "items": {
        "$ref": "#/components/schemas/EmploymentPopupNotificationItemResponse"
      }
    }
  }
}
```

### `#/components/schemas/EnrollmentDocumentResponse`

```json
{
  "type": "object",
  "properties": {
    "universityName": {
      "type": "string"
    },
    "campusName": {
      "type": [
        "string",
        "null"
      ]
    },
    "gradeLevel": {
      "type": "integer",
      "format": "int32",
      "maximum": 4,
      "minimum": 1
    },
    "registeredAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "campusName",
    "gradeLevel",
    "registeredAt",
    "universityName"
  ]
}
```

### `#/components/schemas/EnrollmentExtraction`

```json
{
  "type": "object",
  "properties": {
    "universityName": {
      "type": "string"
    },
    "campusName": {
      "type": [
        "string",
        "null"
      ]
    },
    "gradeLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "서류에 명시된 학년. 없으면 null이며 semesterCount를 환산"
    },
    "semesterCount": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "학년이 없을 때 개인의 현재·이수 학기 수. 학사 일정 제외"
    }
  },
  "required": [
    "campusName",
    "gradeLevel",
    "semesterCount",
    "universityName"
  ]
}
```

### `#/components/schemas/EnrollmentPreviewResponse`

```json
{
  "type": "object",
  "properties": {
    "draftId": {
      "type": "string",
      "format": "uuid",
      "description": "본인 최신 추출 결과의 최종 확인 ID"
    },
    "universityName": {
      "type": "string"
    },
    "campusName": {
      "type": [
        "string",
        "null"
      ]
    },
    "gradeLevel": {
      "type": "integer",
      "format": "int32",
      "description": "학년 우선, 없으면 개인 학기 수/2 올림",
      "maximum": 4,
      "minimum": 1
    },
    "extracted": {
      "$ref": "#/components/schemas/EnrollmentExtraction",
      "description": "서버가 보관한 원본 추출값. 사용자가 수정할 수 없음"
    }
  },
  "required": [
    "campusName",
    "draftId",
    "extracted",
    "gradeLevel",
    "universityName"
  ]
}
```

### `#/components/schemas/ErrorResponse`

```json
{
  "type": "object",
  "properties": {
    "code": {
      "type": "string"
    },
    "message": {
      "type": "string"
    }
  }
}
```

### `#/components/schemas/Item`

```json
{
  "type": "object",
  "description": "유학생 지원 목록 항목",
  "properties": {
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "status": {
      "type": "string",
      "description": "지원 상태: WAITING_RESPONSE(사업주 응답 대기), OFFERED(채용 제안 발송), COMPLETED(채용 완료), ENDED(지원 종료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "OFFERED"
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "jobTitle": {
      "type": "string",
      "description": "채용공고 제목",
      "example": "카페 주말 스태프"
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장 이름",
      "example": "하이어링크 카페"
    },
    "wageType": {
      "type": "string",
      "description": "급여 유형",
      "example": "HOURLY"
    },
    "wageAmount": {
      "type": "integer",
      "format": "int32",
      "description": "급여 금액(원)",
      "example": 12000
    },
    "recommendationReasons": {
      "type": "array",
      "description": "지원 당시 추천 이유",
      "example": [
        "희망 근무시간 일치",
        "희망 거리 충족"
      ],
      "items": {
        "type": "string"
      }
    },
    "desiredStartDate": {
      "type": "string",
      "format": "date",
      "description": "희망 근무 시작일",
      "example": "2026-12-01"
    },
    "appliedAt": {
      "type": "string",
      "format": "date-time",
      "description": "지원 시각",
      "example": "2026-11-14T03:00:00Z"
    },
    "employerResponseDeadline": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "사업주 응답 기한. 응답 단계 종료 후 null",
      "example": "2026-11-15T03:00:00Z"
    },
    "offerId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "채용 제안 ID. 제안이 없으면 null",
      "example": 401
    },
    "offerStatus": {
      "type": [
        "string",
        "null"
      ],
      "description": "채용 제안 상태: PENDING(응답 대기), ACCEPTED(수락), REJECTED(거절), EXPIRED(응답 만료). 제안이 없으면 null",
      "enum": [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED"
      ],
      "example": "PENDING"
    },
    "offeredAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "채용 제안 시각. 제안이 없으면 null",
      "example": "2026-11-15T03:00:00Z"
    },
    "studentResponseDeadline": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "유학생 응답 기한. 제안이 없으면 null",
      "example": "2026-11-16T03:00:00Z"
    },
    "matchId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "채용 완료 ID. 완료되지 않았으면 null",
      "example": 501
    },
    "endReason": {
      "type": [
        "string",
        "null"
      ],
      "description": "지원 종료 사유: EMPLOYER_REJECTED(사업주 거절), WITHDRAWN(유학생 취소), EMPLOYER_RESPONSE_EXPIRED(사업주 응답 만료), STUDENT_REJECTED(유학생 제안 거절), STUDENT_RESPONSE_EXPIRED(유학생 응답 만료), JOB_POSTING_CLOSED(공고 마감). ENDED 상태가 아니면 null",
      "enum": [
        "EMPLOYER_REJECTED",
        "WITHDRAWN",
        "EMPLOYER_RESPONSE_EXPIRED",
        "STUDENT_REJECTED",
        "STUDENT_RESPONSE_EXPIRED",
        "JOB_POSTING_CLOSED"
      ],
      "example": "STUDENT_REJECTED"
    },
    "endedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "지원 종료 시각. ENDED 상태가 아니면 null",
      "example": "2026-11-15T05:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "appliedAt",
    "desiredStartDate",
    "jobPostingId",
    "jobTitle",
    "recommendationReasons",
    "status",
    "wageAmount",
    "wageType",
    "workplaceName"
  ]
}
```

### `#/components/schemas/JobPostingDetailResponse`

```json
{
  "type": "object",
  "description": "채용공고 상세 정보",
  "properties": {
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 1
    },
    "title": {
      "type": [
        "string",
        "null"
      ],
      "description": "자동 생성 제목: 사업장명 + 직무 + 모집. 최대 200자, 넘으면 끝을 …로 축약. 임시저장 중 미입력은 null",
      "example": "예시카페 바리스타 모집",
      "maxLength": 200
    },
    "status": {
      "type": "string",
      "description": "공고 상태",
      "enum": [
        "DRAFT",
        "RECRUITING",
        "CLOSED"
      ],
      "example": "RECRUITING"
    },
    "workplaceId": {
      "type": "integer",
      "format": "int64",
      "description": "사업장 ID",
      "example": 1
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장명. 빈 문자열·공백만 입력 불가",
      "example": "예시카페",
      "maxLength": 150
    },
    "workplaceAddress": {
      "type": "string",
      "description": "사업장 주소",
      "example": "서울특별시 성동구 예시로 10",
      "maxLength": 500
    },
    "latitude": {
      "type": "number",
      "description": "위도. 소수점 이하 최대 7자리",
      "example": 37.5665,
      "maximum": 90,
      "minimum": -90
    },
    "longitude": {
      "type": "number",
      "description": "경도. 소수점 이하 최대 7자리",
      "example": 126.978,
      "maximum": 180,
      "minimum": -180
    },
    "businessTypeId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "업종 ID: 1 음식점·카페, 2 매장·판매, 3 사무·행사·관광, 4 통·번역, 5 면세점, 6 전공·학업, 7 인턴십, 8 기타. 임시저장 중 미입력은 null",
      "example": 1
    },
    "businessTypeName": {
      "type": [
        "string",
        "null"
      ],
      "description": "업종 코드 (한글 표시명이 아님). 임시저장 중 미입력은 null",
      "example": "FOOD_CAFE"
    },
    "jobRole": {
      "type": [
        "string",
        "null"
      ],
      "description": "직무. 빈 문자열·공백만 입력 불가. 임시저장 중 미입력은 null",
      "example": "바리스타",
      "maxLength": 100
    },
    "wageType": {
      "type": [
        "string",
        "null"
      ],
      "description": "급여 유형. 임시저장 중 미입력은 null. 값: HOURLY / MONTHLY",
      "example": "HOURLY",
      "pattern": "^(HOURLY|MONTHLY)$"
    },
    "wageAmount": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "급여 금액 (원), 1 이상의 정수. 임시저장 중 미입력은 null",
      "example": 13000,
      "minimum": 1
    },
    "recruitmentCount": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "채용 인원. 임시저장 중 미입력은 null",
      "example": 2,
      "maximum": 32767,
      "minimum": 1
    },
    "workStartDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "근무 시작일 (YYYY-MM-DD). 임시저장 중 미입력은 null",
      "example": "2027-03-01"
    },
    "requiredKoreanLevel": {
      "type": [
        "string",
        "null"
      ],
      "description": "요구 한국어 수준. 임시저장 중 미입력은 null. 값: BEGINNER / INTERMEDIATE / ADVANCED / NONE(무관)",
      "example": "INTERMEDIATE",
      "pattern": "^(BEGINNER|INTERMEDIATE|ADVANCED|NONE)$"
    },
    "preferredExperience": {
      "type": [
        "string",
        "null"
      ],
      "description": "우대 경력. 임시저장 중 미입력은 null. 값: NONE / SIX_MONTHS_OR_MORE / ONE_YEAR_OR_MORE",
      "example": "NONE",
      "pattern": "^(NONE|SIX_MONTHS_OR_MORE|ONE_YEAR_OR_MORE)$"
    },
    "workTimeNegotiable": {
      "type": [
        "boolean",
        "null"
      ],
      "description": "근무시간 협의 가능 여부. 임시저장 중 미입력은 null",
      "example": false
    },
    "applicationDeadlineDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "모집 마감일 (YYYY-MM-DD). 근무 시작일과의 선후 관계 제한 없음. 임시저장 중 미입력은 null",
      "example": "2027-03-14"
    },
    "workTimes": {
      "type": "array",
      "description": "근무시간 목록. 월~일, 시작 시간 오름차순. 없으면 []",
      "items": {
        "$ref": "#/components/schemas/JobPostingWorkTimeResponse"
      }
    },
    "convertedHourlyWage": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "표시용 환산 시급(원). 월급 / (주간 근무시간 × 4.345)를 원 단위 반올림. 시급은 입력 금액 그대로. 계산할 정보가 부족한 임시저장은 null",
      "example": 12786
    }
  },
  "required": [
    "applicationDeadlineDate",
    "businessTypeId",
    "businessTypeName",
    "convertedHourlyWage",
    "jobPostingId",
    "jobRole",
    "latitude",
    "longitude",
    "preferredExperience",
    "recruitmentCount",
    "requiredKoreanLevel",
    "status",
    "title",
    "wageAmount",
    "wageType",
    "workStartDate",
    "workTimeNegotiable",
    "workTimes",
    "workplaceAddress",
    "workplaceId",
    "workplaceName"
  ]
}
```

### `#/components/schemas/JobPostingWorkTimeResponse`

```json
{
  "type": "object",
  "description": "채용공고 근무시간",
  "properties": {
    "dayOfWeek": {
      "type": "string",
      "description": "요일",
      "enum": [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
      ],
      "example": "MON"
    },
    "startTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "시작 시간 (HH:mm), 30분 단위",
      "example": "09:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    },
    "endTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "종료 시간 (HH:mm), 30분 단위. 00:00은 해당 요일의 끝인 자정. 시작과 같을 수 없음",
      "example": "13:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    }
  },
  "required": [
    "dayOfWeek",
    "endTime",
    "startTime"
  ]
}
```

### `#/components/schemas/LocationConsentResponse`

```json
{
  "type": "object",
  "description": "로그인 회원의 위치 약관 동의 상태. 미저장은 false/null이며 조회만으로 동의 기록을 만들지 않는다.",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "위치 약관 ID. 기존 PUT /api/users/me/term-agreements로 저장할 때 이 값을 사용하며 고정 ID를 가정하지 않는다"
    },
    "termTypeName": {
      "type": "string",
      "description": "위치 약관 이름. 본문·번역은 프론트에서 제공",
      "example": "위치기반 서비스 이용약관"
    },
    "isAgreed": {
      "type": "boolean",
      "description": "현재 동의 여부. true이면 위치 약관 동의창을 반복 표시하지 않는다. 기기의 GPS 접근 권한과는 별개"
    },
    "agreedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "현재 동의 시각. 미동의는 null, true 반복 저장은 기존 시각 유지, 철회 후 재동의하면 새 시각"
    },
    "currentVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "현재 위치 약관 본문 버전. 미설정이면 null"
    },
    "agreedVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "동의 당시 버전. 기존 버전 미기록은 null"
    }
  },
  "required": [
    "agreedAt",
    "agreedVersion",
    "currentVersion",
    "isAgreed",
    "termTypeId",
    "termTypeName"
  ]
}
```

### `#/components/schemas/LoginRequest`

```json
{
  "type": "object",
  "description": "LOCAL 이메일 로그인. 가입 때의 이메일과 비밀번호를 입력한다.",
  "example": {
    "email": "student@example.com",
    "password": "Example123!"
  },
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "이메일. 요청에서는 앞뒤 공백 제거 후 소문자로 정규화",
      "example": "student@example.com",
      "maxLength": 255,
      "minLength": 0
    },
    "password": {
      "type": "string",
      "description": "비밀번호",
      "example": "Example123!",
      "minLength": 1
    }
  },
  "required": [
    "email",
    "password"
  ]
}
```

### `#/components/schemas/LoginResponse`

```json
{
  "type": "object",
  "description": "로그인 결과",
  "properties": {
    "userId": {
      "type": "integer",
      "format": "int64",
      "description": "회원 ID",
      "example": 1
    },
    "role": {
      "type": "string",
      "description": "회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ],
      "example": "STUDENT"
    },
    "accessToken": {
      "type": "string",
      "description": "Access Token. 보호된 API의 Authorization: Bearer 헤더에 사용",
      "example": "access-token-example"
    },
    "tokenType": {
      "type": "string",
      "description": "인증 토큰 유형",
      "enum": [
        "Bearer"
      ],
      "example": "Bearer"
    },
    "expiresIn": {
      "type": "integer",
      "format": "int64",
      "description": "유효시간 (초)",
      "example": 3600
    }
  },
  "required": [
    "accessToken",
    "expiresIn",
    "role",
    "tokenType",
    "userId"
  ]
}
```

### `#/components/schemas/LogoutResponse`

```json
{
  "type": "object",
  "description": "로그아웃 결과",
  "properties": {
    "message": {
      "type": "string",
      "description": "처리 결과 메시지",
      "example": "처리가 완료되었습니다."
    }
  },
  "required": [
    "message"
  ]
}
```

### `#/components/schemas/OnboardingStatusResponse`

```json
{
  "type": "object",
  "description": "회원의 새 유학생 온보딩 상태. NOT_APPLICABLE은 기존 흐름을 사용한다는 뜻이며 기존 온보딩 완료 또는 서비스 이용 허가를 의미하지 않는다.",
  "properties": {
    "userId": {
      "type": "integer",
      "format": "int64",
      "description": "로그인 회원 ID",
      "example": 1
    },
    "role": {
      "type": "string",
      "description": "서버에 저장된 회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ]
    },
    "status": {
      "type": "string",
      "description": "REQUIRED: 새 유학생 온보딩 미완료, COMPLETED: 완료, NOT_APPLICABLE: 새 온보딩 적용 대상 아님",
      "enum": [
        "REQUIRED",
        "COMPLETED",
        "NOT_APPLICABLE"
      ]
    },
    "nextStep": {
      "type": "string",
      "description": "BASIC_INFORMATION: 미완료 회원은 항상 생년월일부터 다시 입력, NONE: 추가 온보딩 없음, EXISTING_FLOW: 기존 가입 유형별 흐름 사용",
      "enum": [
        "BASIC_INFORMATION",
        "NONE",
        "EXISTING_FLOW"
      ]
    },
    "completedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "저장된 최초 온보딩 완료 시각. 미완료 또는 적용 대상이 아니면 null"
    }
  },
  "required": [
    "completedAt",
    "nextStep",
    "role",
    "status",
    "userId"
  ]
}
```

### `#/components/schemas/PeriodLimit`

```json
{
  "type": "object",
  "properties": {
    "type": {
      "type": "string",
      "description": "WEEKDAY_LIMIT: 학기 중 주중 한도, SHARED_WEEKLY_LIMIT: combinedWeeklyLimitHours를 함께 사용하며 별도 가산 불가, NO_TIME_CAP: 서비스 기준 시간 상한 없음",
      "enum": [
        "WEEKDAY_LIMIT",
        "SHARED_WEEKLY_LIMIT",
        "NO_TIME_CAP"
      ]
    },
    "hours": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "WEEKDAY_LIMIT일 때만 시간 값. 공통 주당 한도와 상한 없음은 null"
    }
  }
}
```

### `#/components/schemas/PhoneVerificationConfirmRequest`

```json
{
  "type": "object",
  "description": "휴대전화 인증번호 확인. 요청했던 전화번호와 문자 인증번호를 함께 입력한다.",
  "properties": {
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678",
      "minLength": 1,
      "pattern": "010(?:[0-9]{8}|-[0-9]{4}-[0-9]{4})"
    },
    "code": {
      "type": "string",
      "description": "문자로 전송된 6자리 인증번호. 앞자리 0을 유지하는 문자열",
      "example": "012345",
      "minLength": 1,
      "pattern": "[0-9]{6}"
    }
  },
  "required": [
    "code",
    "phoneNumber"
  ]
}
```

### `#/components/schemas/PhoneVerificationConfirmResponse`

```json
{
  "type": "object",
  "description": "휴대전화 인증 완료 결과",
  "properties": {
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678"
    },
    "verifiedAt": {
      "type": "string",
      "format": "date-time",
      "description": "휴대전화 인증 완료 시각 (ISO-8601)",
      "example": "2026-11-01T01:00:00Z"
    },
    "message": {
      "type": "string",
      "description": "처리 결과 메시지",
      "example": "처리가 완료되었습니다."
    }
  },
  "required": [
    "message",
    "phoneNumber",
    "verifiedAt"
  ]
}
```

### `#/components/schemas/PhoneVerificationRequest`

```json
{
  "type": "object",
  "description": "휴대전화 인증번호 요청. 국내 010 번호만 지원한다.",
  "properties": {
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678",
      "minLength": 1,
      "pattern": "010(?:[0-9]{8}|-[0-9]{4}-[0-9]{4})"
    }
  },
  "required": [
    "phoneNumber"
  ]
}
```

### `#/components/schemas/PhoneVerificationRequestResponse`

```json
{
  "type": "object",
  "description": "인증번호 발송 결과",
  "properties": {
    "expiresIn": {
      "type": "integer",
      "format": "int64",
      "description": "인증번호 유효시간 (초), 300초",
      "example": 300
    },
    "message": {
      "type": "string",
      "description": "처리 결과 메시지",
      "example": "처리가 완료되었습니다."
    }
  },
  "required": [
    "expiresIn",
    "message"
  ]
}
```

### `#/components/schemas/RecommendationCreateResponse`

```json
{
  "type": "object",
  "description": "최초 추천 생성 결과",
  "properties": {
    "batchId": {
      "type": "integer",
      "format": "int64",
      "description": "생성된 추천 배치 ID",
      "example": 11
    },
    "generatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "추천 생성 시각",
      "example": "2026-11-14T03:00:00Z"
    },
    "recommendationCount": {
      "type": "integer",
      "format": "int32",
      "description": "생성된 추천 수",
      "example": 5
    }
  },
  "required": [
    "batchId",
    "generatedAt",
    "recommendationCount"
  ]
}
```

### `#/components/schemas/RecommendationDetailResponse`

```json
{
  "type": "object",
  "description": "추천 상세 정보",
  "properties": {
    "recommendationId": {
      "type": "integer",
      "format": "int64",
      "description": "추천 ID",
      "example": 101
    },
    "batchId": {
      "type": "integer",
      "format": "int64",
      "description": "추천 배치 ID",
      "example": 11
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "rank": {
      "type": "integer",
      "format": "int32",
      "description": "배치 내 추천 순위",
      "example": 1
    },
    "generatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "추천 생성 시각",
      "example": "2026-11-14T03:00:00Z"
    },
    "jobTitle": {
      "type": "string",
      "description": "채용공고 제목",
      "example": "카페 주말 스태프"
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장 이름",
      "example": "하이어링크 카페"
    },
    "workplaceAddress": {
      "type": "string",
      "description": "사업장 주소",
      "example": "서울특별시 중구 세종대로 1"
    },
    "wageType": {
      "type": "string",
      "description": "급여 유형",
      "example": "HOURLY"
    },
    "wageAmount": {
      "type": "integer",
      "format": "int32",
      "description": "급여 금액(원)",
      "example": 12000
    },
    "workTimes": {
      "type": "array",
      "description": "근무시간 목록",
      "items": {
        "$ref": "#/components/schemas/RecommendationWorkTimeResponse"
      }
    },
    "matchScore": {
      "type": "number",
      "description": "추천 매칭 점수",
      "example": 92.5
    },
    "recommendationReasons": {
      "type": "array",
      "description": "추천 이유 목록",
      "example": [
        "희망 근무시간 일치",
        "희망 거리 충족"
      ],
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "batchId",
    "generatedAt",
    "jobPostingId",
    "jobTitle",
    "matchScore",
    "rank",
    "recommendationId",
    "recommendationReasons",
    "wageAmount",
    "wageType",
    "workTimes",
    "workplaceAddress",
    "workplaceName"
  ]
}
```

### `#/components/schemas/RecommendationListResponse`

```json
{
  "type": "object",
  "description": "최신 추천 목록",
  "properties": {
    "batchId": {
      "type": "integer",
      "format": "int64",
      "description": "최신 추천 배치 ID",
      "example": 11
    },
    "generatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "추천 생성 시각",
      "example": "2026-11-14T03:00:00Z"
    },
    "refreshRequired": {
      "type": "boolean",
      "description": "현재 조건에 맞는 수동 갱신 필요 여부",
      "example": false
    },
    "recommendations": {
      "type": "array",
      "description": "순위순 추천 목록",
      "items": {
        "$ref": "#/components/schemas/Item"
      }
    }
  },
  "required": [
    "batchId",
    "generatedAt",
    "recommendations",
    "refreshRequired"
  ]
}
```

### `#/components/schemas/RecommendationRefreshResponse`

```json
{
  "type": "object",
  "description": "추천 갱신 결과",
  "properties": {
    "batchId": {
      "type": "integer",
      "format": "int64",
      "description": "현재 추천 배치 ID",
      "example": 12
    },
    "generatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "현재 추천 생성 시각",
      "example": "2026-11-14T03:10:00Z"
    },
    "recommendationCount": {
      "type": "integer",
      "format": "int32",
      "description": "현재 추천 수",
      "example": 5
    },
    "refreshed": {
      "type": "boolean",
      "description": "새 추천 배치 생성 여부",
      "example": true
    }
  },
  "required": [
    "batchId",
    "generatedAt",
    "recommendationCount",
    "refreshed"
  ]
}
```

### `#/components/schemas/RecommendationWorkTimeResponse`

```json
{
  "type": "object",
  "description": "추천 채용공고 근무시간",
  "properties": {
    "dayOfWeek": {
      "type": "string",
      "description": "요일",
      "enum": [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
      ],
      "example": "MON"
    },
    "startTime": {
      "type": "string",
      "format": "time",
      "description": "근무 시작 시각",
      "example": "09:00:00"
    },
    "endTime": {
      "type": "string",
      "format": "time",
      "description": "근무 종료 시각",
      "example": "18:00:00"
    }
  },
  "required": [
    "dayOfWeek",
    "endTime",
    "startTime"
  ]
}
```

### `#/components/schemas/RefreshResponse`

```json
{
  "type": "object",
  "description": "Access Token 재발급 결과",
  "properties": {
    "accessToken": {
      "type": "string",
      "description": "Access Token. 보호된 API의 Authorization: Bearer 헤더에 사용",
      "example": "access-token-example"
    },
    "tokenType": {
      "type": "string",
      "description": "인증 토큰 유형",
      "enum": [
        "Bearer"
      ],
      "example": "Bearer"
    },
    "expiresIn": {
      "type": "integer",
      "format": "int64",
      "description": "유효시간 (초). 최대 3600초이며 해당 로그인 기록의 만료 시각을 넘지 않는다",
      "example": 3600
    }
  },
  "required": [
    "accessToken",
    "expiresIn",
    "tokenType"
  ]
}
```

### `#/components/schemas/RegistrationFrontResponse`

```json
{
  "type": "object",
  "description": "등록증 앞면 인식 결과. 확인용 등록번호 전체를 반환한다. 직접 수정할 수 없으며 오류가 있으면 앞면을 재촬영한다. 화면 이탈·인증 완료 시 프론트에서 확인용 원문 상태를 정리한다.",
  "properties": {
    "name": {
      "type": "string",
      "description": "인식한 이름",
      "example": "TEST STUDENT"
    },
    "nationalityCode": {
      "type": "string",
      "description": "ISO 국가 코드",
      "example": "VN"
    },
    "visaCode": {
      "type": "string",
      "description": "등록증에서 인식한 체류자격 D-2. 세부 코드는 등록증에서 추출하지 않고 온보딩 학업과정 선택으로 생성",
      "example": "D-2"
    },
    "registrationNumber": {
      "type": "string",
      "description": "인식한 외국인등록번호 전체. 숫자 6자리-7자리, 확인 화면에서만 사용",
      "example": "000101-5000000",
      "maxLength": 14,
      "minLength": 14,
      "pattern": "^[0-9]{6}-[5-8][0-9]{6}$"
    },
    "issueDate": {
      "type": "string",
      "format": "date",
      "description": "발급일"
    },
    "signupExpiresAt": {
      "type": "string",
      "format": "date-time",
      "description": "기존 가입 세션 만료 시각. 요청으로 연장되지 않음"
    }
  },
  "required": [
    "issueDate",
    "name",
    "nationalityCode",
    "registrationNumber",
    "signupExpiresAt",
    "visaCode"
  ]
}
```

### `#/components/schemas/RegistrationRenewalConfirmationResponse`

```json
{
  "type": "object",
  "description": "최종 확인된 등록증 정보와 현재 서비스 지원 여부. 지원 여부는 진위 확인 결과와 구분한다",
  "properties": {
    "name": {
      "type": "string"
    },
    "nationalityCode": {
      "type": "string",
      "description": "ISO 국가 코드"
    },
    "registrationVisaCode": {
      "type": "string",
      "description": "등록증에서 확인한 원문 체류자격. 예: D-2, D-10"
    },
    "visaCode": {
      "type": "string",
      "description": "D-2이면 저장된 학업과정과 조합한 코드, 그 외에는 등록증 원문 코드"
    },
    "studyProgram": {
      "type": "string",
      "description": "기존에 저장된 학업과정. 갱신으로 변경하지 않으며 기존 미입력은 null",
      "enum": [
        "ASSOCIATE",
        "BACHELOR",
        "MASTER",
        "DOCTORATE",
        "EXCHANGE"
      ]
    },
    "stayExpirationDate": {
      "type": "string",
      "format": "date"
    },
    "serviceSupported": {
      "type": "boolean",
      "description": "등록증 D-2와 지원 학업과정 조합 여부. 취업 허가·추천·지원 가능 여부를 의미하지 않는다"
    },
    "supportMessage": {
      "type": "string",
      "description": "지원 대상이 아니면 안내 문구, 지원 대상이면 null"
    },
    "active": {
      "type": "boolean",
      "description": "기존 배지 조회 기준으로 판단한 현재 상태"
    },
    "issuedAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

### `#/components/schemas/RegistrationRenewalFrontResponse`

```json
{
  "type": "object",
  "properties": {
    "renewalId": {
      "type": "string",
      "format": "uuid",
      "description": "회원별 최신 갱신 식별자. 재촬영하면 이전 값은 무효"
    },
    "name": {
      "type": "string"
    },
    "nationalityCode": {
      "type": "string"
    },
    "visaCode": {
      "type": "string",
      "description": "등록증 원문 체류자격. D-10 등도 갱신 가능하며 D-2 세부 코드는 학업과정으로 조합한다"
    },
    "registrationNumber": {
      "type": "string"
    },
    "issueDate": {
      "type": "string",
      "format": "date"
    },
    "renewalExpiresAt": {
      "type": "string",
      "format": "date-time",
      "description": "갱신 완료 제한 시각. 시작 후 30분"
    }
  }
}
```

### `#/components/schemas/RegistrationRenewalVerificationResponse`

```json
{
  "type": "object",
  "properties": {
    "renewalId": {
      "type": "string",
      "format": "uuid"
    },
    "serialNumber": {
      "type": "string"
    },
    "stayExpiresOn": {
      "type": "string",
      "format": "date",
      "description": "아직 최종 반영하지 않은 만료일"
    },
    "cardVerified": {
      "type": "boolean"
    },
    "documentVerified": {
      "type": "boolean"
    },
    "requiresStayDocument": {
      "type": "boolean"
    },
    "renewalExpiresAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

### `#/components/schemas/RegistrationVerificationResponse`

```json
{
  "type": "object",
  "description": "카드 뒷면·체류기간 PDF 확인 공통 결과. 일련번호는 항상 카드 뒷면에서 읽은 값이며 허가일자·신고일은 반환하지 않는다. 계정 생성·온보딩 완료를 의미하지 않는다.",
  "properties": {
    "serialNumber": {
      "type": [
        "string",
        "null"
      ],
      "description": "카드 뒷면 일련번호. 선행 0을 유지하는 11자리 문자열. 2011-01-01 이전 발급 카드에서 일련번호가 없으면 null",
      "example": "00000000001",
      "maxLength": 11,
      "minLength": 11,
      "pattern": "^[0-9]{11}$"
    },
    "stayExpiresOn": {
      "type": "string",
      "format": "date",
      "description": "뒷면 응답은 카드의 최신 체류 만료일, PDF 응답은 PDF로 확인한 유효한 만료일. requiresStayDocument=true이면 PDF 확인이 아직 필요하다",
      "example": "2027-07-27"
    },
    "cardVerified": {
      "type": "boolean",
      "description": "APICK 카드 기재 정보 일치 확인 완료. 두 API의 성공 응답에서 true",
      "example": true
    },
    "stayDocumentVerified": {
      "type": "boolean",
      "description": "PDF의 등록번호 일치·체류기간 확인 완료. 뒷면 응답은 false, PDF 성공 응답은 true. 문서 진위 인증은 아님",
      "example": false
    },
    "requiresStayDocument": {
      "type": "boolean",
      "description": "추가 PDF 확인 필요 여부. 뒷면 만료일이 한국 날짜 기준 지났으면 true, 만료 당일과 PDF 성공 응답은 false",
      "example": false
    },
    "signupExpiresAt": {
      "type": "string",
      "format": "date-time",
      "description": "기존 가입 세션 만료 시각. 뒷면·PDF 요청으로 연장하지 않음"
    }
  },
  "required": [
    "cardVerified",
    "requiresStayDocument",
    "serialNumber",
    "signupExpiresAt",
    "stayDocumentVerified",
    "stayExpiresOn"
  ]
}
```

### `#/components/schemas/SignupRequest`

```json
{
  "type": "object",
  "description": "LOCAL 이메일 회원가입. 이메일·비밀번호·회원 유형 필수.",
  "example": {
    "email": "student@example.com",
    "password": "Example123!",
    "role": "STUDENT"
  },
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "이메일. 요청에서는 앞뒤 공백 제거 후 소문자로 정규화",
      "example": "student@example.com",
      "maxLength": 255,
      "minLength": 0
    },
    "password": {
      "type": "string",
      "description": "비밀번호. 8자 이상, 영문과 숫자 포함",
      "example": "Example123!",
      "maxLength": 2147483647,
      "minLength": 8,
      "pattern": "(?s)^(?=.*[a-zA-Z])(?=.*[0-9]).*$"
    },
    "role": {
      "type": "string",
      "description": "회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ],
      "example": "STUDENT",
      "minLength": 1,
      "pattern": "STUDENT|EMPLOYER"
    }
  },
  "required": [
    "email",
    "password",
    "role"
  ]
}
```

### `#/components/schemas/SignupResponse`

```json
{
  "type": "object",
  "description": "이메일 회원가입 결과",
  "properties": {
    "userId": {
      "type": "integer",
      "format": "int64",
      "description": "회원 ID",
      "example": 1
    },
    "email": {
      "type": "string",
      "description": "회원 이메일",
      "example": "student@example.com",
      "maxLength": 255
    },
    "role": {
      "type": "string",
      "description": "회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ],
      "example": "STUDENT"
    },
    "accessToken": {
      "type": "string",
      "description": "Access Token. 보호된 API의 Authorization: Bearer 헤더에 사용",
      "example": "access-token-example"
    },
    "tokenType": {
      "type": "string",
      "description": "인증 토큰 유형",
      "enum": [
        "Bearer"
      ],
      "example": "Bearer"
    },
    "expiresIn": {
      "type": "integer",
      "format": "int64",
      "description": "유효시간 (초)",
      "example": 3600
    }
  },
  "required": [
    "accessToken",
    "email",
    "expiresIn",
    "role",
    "tokenType",
    "userId"
  ]
}
```

### `#/components/schemas/SocialAuthResponse`

```json
{
  "type": "object",
  "description": "소셜 인증 결과. 신규 사용자는 가입 진행 정보만 받으며 아직 회원이 아니다",
  "properties": {
    "status": {
      "type": "string",
      "description": "LOGIN: 기존 회원 로그인, SIGNUP_REQUIRED: 약관·전화번호 인증 필요",
      "enum": [
        "LOGIN",
        "SIGNUP_REQUIRED"
      ]
    },
    "role": {
      "type": "string",
      "description": "회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ]
    },
    "email": {
      "type": [
        "string",
        "null"
      ],
      "description": "소셜 제공자가 확인한 이메일. 제공되지 않으면 null. 계정 연결에 사용하지 않음",
      "example": "member@example.com"
    },
    "signupExpiresAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "가입 진행 정보 만료 시각(UTC). 신규 사용자만 반환, 기존 회원은 null",
      "example": "2026-11-16T10:30:00Z"
    },
    "login": {
      "type": "null",
      "$ref": "#/components/schemas/LoginResponse",
      "description": "기존 회원 로그인 결과. 신규 사용자는 null이며 Access Token을 발급하지 않음"
    }
  },
  "required": [
    "email",
    "login",
    "role",
    "signupExpiresAt",
    "status"
  ]
}
```

### `#/components/schemas/SocialSignupBirthDateRequest`

```json
{
  "type": "object",
  "properties": {
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "직접 입력한 생년월일. 한국 날짜 기준 만 18세 이상",
      "example": "2000-05-14"
    }
  },
  "required": [
    "birthDate"
  ]
}
```

### `#/components/schemas/SocialSignupResponse`

```json
{
  "type": "object",
  "description": "소셜 계정 생성 결과. 온보딩 완료를 의미하지 않는다. 계정 생성 후 GET /api/users/me/onboarding으로 새 유학생 온보딩 적용 여부와 다음 단계를 조회한다. NOT_APPLICABLE은 기존 유형별 흐름을 사용한다.",
  "properties": {
    "userId": {
      "type": "integer",
      "format": "int64",
      "description": "생성한 회원 ID",
      "example": 1
    },
    "role": {
      "type": "string",
      "description": "소셜 인증 전에 선택한 회원 유형",
      "enum": [
        "STUDENT",
        "EMPLOYER"
      ]
    },
    "accessToken": {
      "type": "string",
      "description": "보호된 API에 사용할 Access Token",
      "example": "access-token-example"
    },
    "tokenType": {
      "type": "string",
      "description": "토큰 유형",
      "enum": [
        "Bearer"
      ]
    },
    "expiresIn": {
      "type": "integer",
      "format": "int64",
      "description": "Access Token 유효시간(초)",
      "example": 3600
    },
    "onboardingRequired": {
      "type": "boolean",
      "description": "새 계정은 필수 온보딩이 필요하므로 true. 메인 화면으로 바로 이동하지 않는다",
      "example": true
    }
  },
  "required": [
    "accessToken",
    "expiresIn",
    "onboardingRequired",
    "role",
    "tokenType",
    "userId"
  ]
}
```

### `#/components/schemas/SocialSignupTerm`

```json
{
  "type": "object",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "약관 종류 ID",
      "example": 4
    },
    "termTypeName": {
      "type": "string",
      "description": "약관 이름",
      "example": "서비스 이용약관"
    },
    "isRequired": {
      "type": "boolean",
      "description": "가입 시 반드시 동의해야 하는 약관인지",
      "example": true
    },
    "isAgreed": {
      "type": "boolean",
      "description": "현재 동의 여부. 아직 저장하지 않았다면 false",
      "example": false
    },
    "agreedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "동의 시각(ISO-8601). 미동의는 null. 같은 동의를 다시 저장하면 기존 시각 유지",
      "example": "2026-11-16T10:00:00Z"
    },
    "currentVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "현재 본문의 버전. 프론트와 일치하는 값이 설정되지 않았으면 null"
    },
    "agreedVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "저장된 동의의 본문 버전. 기존 버전 미기록 또는 선택 항목 생략은 null"
    }
  },
  "required": [
    "agreedAt",
    "agreedVersion",
    "currentVersion",
    "isAgreed",
    "isRequired",
    "termTypeId",
    "termTypeName"
  ]
}
```

### `#/components/schemas/SocialSignupTermsRequest`

```json
{
  "type": "object",
  "description": "소셜 가입 중 약관 동의 저장. GET /api/auth/social/terms에서 받은 ID를 사용한다.",
  "example": {
    "agreements": [
      {
        "termTypeId": 4,
        "version": "v1",
        "isAgreed": true
      },
      {
        "termTypeId": 5,
        "version": "v1",
        "isAgreed": true
      },
      {
        "termTypeId": 6,
        "version": "v1",
        "isAgreed": true
      },
      {
        "termTypeId": 7,
        "version": "v1",
        "isAgreed": false
      }
    ]
  },
  "properties": {
    "agreements": {
      "type": "array",
      "description": "필수 약관은 모두 true여야 한다. 생략한 선택 약관은 false로 저장한다. 중복 ID 불가",
      "items": {
        "$ref": "#/components/schemas/SocialSignupTermsRequestAgreement"
      },
      "minItems": 1
    }
  },
  "required": [
    "agreements"
  ]
}
```

### `#/components/schemas/SocialSignupTermsRequestAgreement`

```json
{
  "type": "object",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "소셜 가입 약관 조회에서 받은 ID",
      "example": 4,
      "exclusiveMinimum": 0
    },
    "isAgreed": {
      "type": "boolean",
      "description": "해당 약관 동의 여부",
      "example": true
    },
    "version": {
      "type": "string",
      "description": "프론트가 실제 표시한 본문의 버전. 현재 버전과 정확히 일치해야 하며 서버가 자동으로 채우지 않는다",
      "example": "v1",
      "minLength": 1,
      "pattern": "[A-Za-z0-9][A-Za-z0-9._-]{0,63}"
    }
  },
  "required": [
    "isAgreed",
    "termTypeId",
    "version"
  ]
}
```

### `#/components/schemas/SocialSignupTermsResponse`

```json
{
  "type": "object",
  "description": "소셜 가입 약관 목록과 현재 가입 진행 정보에 저장된 동의 상태. 약관 ID 오름차순",
  "properties": {
    "terms": {
      "type": "array",
      "description": "소셜 가입에서 사용하는 약관. 긴 본문과 번역은 프론트에서 표시한다.",
      "items": {
        "$ref": "#/components/schemas/SocialSignupTerm"
      }
    }
  },
  "required": [
    "terms"
  ]
}
```

### `#/components/schemas/Student`

```json
{
  "type": "object",
  "description": "사업주에게 제공되는 유학생 요약",
  "properties": {
    "name": {
      "type": "string",
      "description": "유학생 이름",
      "example": "김하이어"
    },
    "profileImageUrl": {
      "type": [
        "string",
        "null"
      ],
      "description": "프로필 이미지 임시 URL. 이미지가 없으면 null",
      "example": "https://example.invalid/profile/sample.png"
    },
    "nationality": {
      "type": "string",
      "description": "국적",
      "example": "VIETNAM"
    },
    "visaType": {
      "type": "string",
      "description": "체류 자격 코드",
      "example": "D-2"
    },
    "topikLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "TOPIK 등급. 미입력 시 null",
      "example": 4
    }
  },
  "required": [
    "name",
    "nationality",
    "visaType"
  ]
}
```

### `#/components/schemas/StudentApplicationDetailResponse`

```json
{
  "type": "object",
  "description": "유학생용 지원 상세 정보",
  "properties": {
    "applicationId": {
      "type": "integer",
      "format": "int64",
      "description": "지원 ID",
      "example": 201
    },
    "status": {
      "type": "string",
      "description": "지원 상태: WAITING_RESPONSE(사업주 응답 대기), OFFERED(채용 제안 발송), COMPLETED(채용 완료), ENDED(지원 종료)",
      "enum": [
        "WAITING_RESPONSE",
        "OFFERED",
        "COMPLETED",
        "ENDED"
      ],
      "example": "OFFERED"
    },
    "jobPostingId": {
      "type": "integer",
      "format": "int64",
      "description": "채용공고 ID",
      "example": 301
    },
    "jobTitle": {
      "type": "string",
      "description": "채용공고 제목",
      "example": "카페 주말 스태프"
    },
    "workplaceName": {
      "type": "string",
      "description": "사업장 이름",
      "example": "하이어링크 카페"
    },
    "workplaceAddress": {
      "type": "string",
      "description": "사업장 주소",
      "example": "서울특별시 중구 세종대로 1"
    },
    "wageType": {
      "type": "string",
      "description": "급여 유형",
      "example": "HOURLY"
    },
    "wageAmount": {
      "type": "integer",
      "format": "int32",
      "description": "급여 금액(원)",
      "example": 12000
    },
    "workTimes": {
      "type": "array",
      "description": "근무시간 목록",
      "items": {
        "$ref": "#/components/schemas/WorkTime"
      }
    },
    "desiredStartDate": {
      "type": "string",
      "format": "date",
      "description": "희망 근무 시작일",
      "example": "2026-12-01"
    },
    "appliedAt": {
      "type": "string",
      "format": "date-time",
      "description": "지원 시각",
      "example": "2026-11-14T03:00:00Z"
    },
    "employerResponseDeadline": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "사업주 응답 기한. 응답 단계 종료 후 null",
      "example": "2026-11-15T03:00:00Z"
    },
    "offerId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "채용 제안 ID. 제안이 없으면 null",
      "example": 401
    },
    "offerStatus": {
      "type": [
        "string",
        "null"
      ],
      "description": "채용 제안 상태: PENDING(응답 대기), ACCEPTED(수락), REJECTED(거절), EXPIRED(응답 만료). 제안이 없으면 null",
      "enum": [
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED"
      ],
      "example": "PENDING"
    },
    "offeredAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "채용 제안 시각. 제안이 없으면 null",
      "example": "2026-11-15T03:00:00Z"
    },
    "studentResponseDeadline": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "유학생 응답 기한. 제안이 없으면 null",
      "example": "2026-11-16T03:00:00Z"
    },
    "respondedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "제안 응답 시각. 아직 응답하지 않았으면 null",
      "example": "2026-11-15T05:00:00Z"
    },
    "matchId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "채용 완료 ID. 완료되지 않았으면 null",
      "example": 501
    },
    "endReason": {
      "type": [
        "string",
        "null"
      ],
      "description": "지원 종료 사유: EMPLOYER_REJECTED(사업주 거절), WITHDRAWN(유학생 취소), EMPLOYER_RESPONSE_EXPIRED(사업주 응답 만료), STUDENT_REJECTED(유학생 제안 거절), STUDENT_RESPONSE_EXPIRED(유학생 응답 만료), JOB_POSTING_CLOSED(공고 마감). ENDED 상태가 아니면 null",
      "enum": [
        "EMPLOYER_REJECTED",
        "WITHDRAWN",
        "EMPLOYER_RESPONSE_EXPIRED",
        "STUDENT_REJECTED",
        "STUDENT_RESPONSE_EXPIRED",
        "JOB_POSTING_CLOSED"
      ],
      "example": "STUDENT_REJECTED"
    },
    "endedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "지원 종료 시각. ENDED 상태가 아니면 null",
      "example": "2026-11-15T05:00:00Z"
    }
  },
  "required": [
    "applicationId",
    "appliedAt",
    "desiredStartDate",
    "jobPostingId",
    "jobTitle",
    "status",
    "wageAmount",
    "wageType",
    "workTimes",
    "workplaceAddress",
    "workplaceName"
  ]
}
```

### `#/components/schemas/StudentApplicationListResponse`

```json
{
  "type": "object",
  "description": "유학생 본인 지원 목록",
  "properties": {
    "applications": {
      "type": "array",
      "description": "최신순 지원 목록",
      "items": {
        "$ref": "#/components/schemas/Item"
      }
    }
  },
  "required": [
    "applications"
  ]
}
```

### `#/components/schemas/StudentBadgeResponse`

```json
{
  "type": "object",
  "properties": {
    "active": {
      "type": "boolean",
      "description": "현재 유효 여부. 한국 날짜로 만료일 당일까지 true이며 조회 시 DB 회수 처리는 하지 않는다"
    },
    "issuedAt": {
      "type": "string",
      "format": "date-time",
      "description": "마지막 발급 시각. 값이 있어도 현재 유효함을 뜻하지 않는다"
    },
    "stayExpirationDate": {
      "type": "string",
      "format": "date",
      "description": "최종 인증된 체류 만료일. 미확정 갱신 결과는 제외"
    }
  }
}
```

### `#/components/schemas/StudentCareerCreateRequest`

```json
{
  "type": "object",
  "description": "경력 추가. 경력명 · 시작월 · 종료월 · 근무 내용 모두 필수.",
  "properties": {
    "careerName": {
      "type": "string",
      "description": "경력명. 빈 문자열·공백만 입력 불가",
      "example": "카페 아르바이트",
      "maxLength": 150,
      "minLength": 0
    },
    "startMonth": {
      "type": "string",
      "description": "근무 시작월 (YYYY-MM). 한국 기준 이번 달까지 허용",
      "example": "2026-01",
      "pattern": "[0-9]{4}-(0[1-9]|1[0-2])"
    },
    "endMonth": {
      "type": "string",
      "description": "근무 종료월 (YYYY-MM). 시작월 이상, 한국 기준 이번 달까지 허용",
      "example": "2026-06",
      "pattern": "[0-9]{4}-(0[1-9]|1[0-2])"
    },
    "description": {
      "type": "string",
      "description": "필수 근무 내용. 생략 · null · 빈 문자열 · 공백만 입력 불가",
      "example": "음료 제조 및 고객 응대",
      "minLength": 1
    }
  },
  "required": [
    "careerName",
    "description",
    "endMonth",
    "startMonth"
  ]
}
```

### `#/components/schemas/StudentDocumentCompletionResponse`

```json
{
  "type": "object",
  "description": "최종 등록된 서류별 반영 여부와 완성률. 미확정 추출 결과는 포함하지 않는다",
  "properties": {
    "completionPercentage": {
      "type": "integer",
      "format": "int32",
      "description": "각 항목당 25%의 합계",
      "enum": [
        "0",
        "25",
        "50",
        "75",
        "100"
      ],
      "example": 75
    },
    "registrationIncluded": {
      "type": "boolean",
      "description": "등록증 인증 완료 및 한국 날짜 기준 최종 체류 만료일 당일까지 true"
    },
    "enrollmentIncluded": {
      "type": "boolean",
      "description": "재학증명서 최종 등록 완료 시 true"
    },
    "transcriptIncluded": {
      "type": "boolean",
      "description": "성적증명서 최종 등록 완료 시 true"
    },
    "topikIncluded": {
      "type": "boolean",
      "description": "TOPIK 성적증명서 최종 등록 완료 시 true"
    }
  }
}
```

### `#/components/schemas/StudentInformationUpdateRequest`

```json
{
  "type": "object",
  "description": "내 정보 최종 일괄 저장. 생략한 항목은 유지하며 null과 알 수 없는 필드는 거절한다. 서류 인증 정보는 직접 수정할 수 없다.",
  "properties": {
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "한국 날짜 기준 만 18세 이상",
      "example": "2000-03-14"
    },
    "phoneNumber": {
      "type": "string",
      "description": "인증한 새 번호. 인증 성공 후 5분 이내 저장. 기존 번호와 같으면 재인증 불필요",
      "example": "010-1234-5678",
      "pattern": "010(?:[0-9]{8}|-[0-9]{4}-[0-9]{4})"
    },
    "currentRegion": {
      "type": "string",
      "example": "서울 마포구",
      "maxLength": 150,
      "minLength": 0,
      "pattern": "(?s).*\\S.*"
    },
    "koreanLevel": {
      "type": "string",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "pattern": "BEGINNER|INTERMEDIATE|ADVANCED"
    },
    "preferredLocation": {
      "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredLocation",
      "description": "매칭 조건 관리와 공유하는 희망 근무지역"
    },
    "careers": {
      "type": "array",
      "description": "경력 전체 목록. 생략하면 유지하고 빈 배열이면 전체 삭제한다. 저장 후 경력 ID는 새로 부여한다.",
      "items": {
        "$ref": "#/components/schemas/StudentCareerCreateRequest"
      }
    }
  }
}
```

### `#/components/schemas/StudentMatchingPreferenceResponse`

```json
{
  "type": "object",
  "description": "유학생 매칭 조건",
  "properties": {
    "businessTypeFlexible": {
      "type": "boolean",
      "description": "업종 상관없음 여부. 미설정 시 false",
      "example": false
    },
    "preferredJobs": {
      "type": "array",
      "description": "희망 업종 목록. 업종 ID 오름차순, 미설정이면 []",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceResponsePreferredJob"
      }
    },
    "preferredWorkTimes": {
      "type": "array",
      "description": "희망 근무시간 목록. 월~일·시작 시간 오름차순, 미설정이면 []",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceResponsePreferredWorkTime"
      }
    },
    "preferredLocation": {
      "type": [
        "object",
        "null"
      ],
      "description": "희망 근무지역. 미설정이면 null",
      "properties": {
        "locationName": {
          "type": "string",
          "description": "희망 지역명. 빈 문자열·공백만 입력 불가",
          "example": "서울특별시 성동구",
          "maxLength": 150
        },
        "latitude": {
          "type": "number",
          "description": "위도. 소수점 이하 최대 7자리",
          "example": 37.5665,
          "maximum": 90,
          "minimum": -90
        },
        "longitude": {
          "type": "number",
          "description": "경도. 소수점 이하 최대 7자리",
          "example": 126.978,
          "maximum": 180,
          "minimum": -180
        },
        "radiusM": {
          "type": "integer",
          "format": "int32",
          "description": "저장된 희망 근무 반경 (미터). 새 입력은 100~1,000m의 100m 간격이며 기존 저장값은 그대로 반환한다",
          "example": 500,
          "minimum": 1
        }
      },
      "required": [
        "latitude",
        "locationName",
        "longitude",
        "radiusM"
      ]
    },
    "priorities": {
      "type": "array",
      "description": "우선순위 목록. 1순위부터 반환, 미설정이면 []",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceResponsePriority"
      }
    }
  },
  "required": [
    "businessTypeFlexible",
    "preferredJobs",
    "preferredLocation",
    "preferredWorkTimes",
    "priorities"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceResponsePreferredJob`

```json
{
  "type": "object",
  "properties": {
    "businessTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "업종 ID: 1 음식점·카페, 2 매장·판매, 3 사무·행사·관광, 4 통·번역, 5 면세점, 6 전공·학업, 7 인턴십, 8 기타",
      "example": 1
    },
    "businessTypeName": {
      "type": "string",
      "description": "업종 코드 (한글 표시명이 아님)",
      "example": "FOOD_CAFE"
    },
    "otherJobName": {
      "type": [
        "string",
        "null"
      ],
      "description": "OTHER 업종의 기타 업종명. 다른 업종에서는 null",
      "example": "영화관",
      "maxLength": 100
    }
  },
  "required": [
    "businessTypeId",
    "businessTypeName",
    "otherJobName"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceResponsePreferredWorkTime`

```json
{
  "type": "object",
  "properties": {
    "dayOfWeek": {
      "type": "string",
      "description": "요일",
      "enum": [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
      ],
      "example": "MON"
    },
    "startTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "시작 시간 (HH:mm), 30분 단위",
      "example": "09:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    },
    "endTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "종료 시간 (HH:mm), 30분 단위. 시작보다 이르면 다음 날 종료이며 시작 요일로 표시한다. 시작과 같을 수 없음",
      "example": "13:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    }
  },
  "required": [
    "dayOfWeek",
    "endTime",
    "startTime"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceResponsePriority`

```json
{
  "type": "object",
  "properties": {
    "criterionId": {
      "type": "integer",
      "format": "int64",
      "description": "우선순위 기준 ID: 1 근무시간, 2 시급, 3 거리, 4 업종",
      "example": 1
    },
    "criterionName": {
      "type": "string",
      "description": "우선순위 기준 코드",
      "enum": [
        "WORK_TIME",
        "WAGE",
        "DISTANCE",
        "BUSINESS_TYPE"
      ],
      "example": "WORK_TIME"
    },
    "priorityOrder": {
      "type": "integer",
      "format": "int32",
      "description": "순위. 1~4를 각각 한 번 사용",
      "example": 1,
      "maximum": 4,
      "minimum": 1
    }
  },
  "required": [
    "criterionId",
    "criterionName",
    "priorityOrder"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceUpdateRequest`

```json
{
  "type": "object",
  "description": "보낸 항목만 수정한다. 목록은 전체 교체. businessTypeFlexible과 preferredJobs는 함께 전송한다. null은 허용하지 않는다. 최소 희망 시급은 입력받지 않는다.",
  "example": {
    "businessTypeFlexible": false,
    "preferredJobs": [
      {
        "businessTypeId": 1
      }
    ],
    "preferredWorkTimes": [
      {
        "dayOfWeek": "MON",
        "startTime": "09:00",
        "endTime": "13:00"
      }
    ],
    "preferredLocation": {
      "locationName": "서울특별시 성동구",
      "latitude": 37.5636,
      "longitude": 127.0365,
      "radiusM": 500
    },
    "priorities": [
      {
        "criterionId": 1,
        "priorityOrder": 1
      },
      {
        "criterionId": 2,
        "priorityOrder": 2
      },
      {
        "criterionId": 3,
        "priorityOrder": 3
      },
      {
        "criterionId": 4,
        "priorityOrder": 4
      }
    ]
  },
  "properties": {
    "businessTypeFlexible": {
      "type": "boolean",
      "description": "업종 상관없음 여부. 미설정 시 false. 생략하면 기존 값 유지, null 불가",
      "example": false
    },
    "preferredJobs": {
      "type": "array",
      "description": "희망 업종 목록. 전체 교체. businessTypeFlexible=true이면 [], false이면 1개 이상. 생략하면 기존 값 유지, null 불가",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredJob"
      }
    },
    "preferredWorkTimes": {
      "type": "array",
      "description": "희망 근무시간 전체 목록. 빈 목록은 불가하며 연속 1시간 이상인 구간이 최소 하나 필요하다. 인접 구간은 연속으로 판단한다. 생략하면 기존 값 유지, null 불가",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredWorkTime"
      }
    },
    "preferredLocation": {
      "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredLocation",
      "description": "희망 근무지역. 전송하면 지역명·위도·경도·반경 모두 필수. 생략하면 기존 값 유지, null 불가"
    },
    "priorities": {
      "type": "array",
      "description": "우선순위 목록. 네 기준 모두를 중복 없이 전송하여 전체 교체. 생략하면 기존 값 유지, null 불가",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPriority"
      },
      "maxItems": 4,
      "minItems": 4
    }
  }
}
```

### `#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredJob`

```json
{
  "type": "object",
  "properties": {
    "businessTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "업종 ID: 1 음식점·카페, 2 매장·판매, 3 사무·행사·관광, 4 통·번역, 5 면세점, 6 전공·학업, 7 인턴십, 8 기타",
      "example": 1,
      "exclusiveMinimum": 0
    },
    "otherJobName": {
      "type": [
        "string",
        "null"
      ],
      "description": "OTHER 업종이면 필수인 기타 업종명. 다른 업종에서는 null 또는 생략",
      "example": "영화관",
      "maxLength": 100,
      "minLength": 0
    }
  },
  "required": [
    "businessTypeId"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredLocation`

```json
{
  "type": "object",
  "properties": {
    "locationName": {
      "type": "string",
      "description": "희망 지역명. 빈 문자열·공백만 입력 불가",
      "example": "서울특별시 성동구",
      "maxLength": 150,
      "minLength": 0
    },
    "latitude": {
      "type": "number",
      "description": "위도. 소수점 이하 최대 7자리",
      "example": 37.5665,
      "maximum": 90,
      "minimum": -90
    },
    "longitude": {
      "type": "number",
      "description": "경도. 소수점 이하 최대 7자리",
      "example": 126.978,
      "maximum": 180,
      "minimum": -180
    },
    "radiusM": {
      "type": "integer",
      "format": "int32",
      "description": "희망 근무 반경 (미터). 100~1,000 사이의 정수, 100m 간격",
      "example": 500,
      "maximum": 1000,
      "minimum": 100,
      "multipleOf": 100
    }
  },
  "required": [
    "latitude",
    "locationName",
    "longitude",
    "radiusM"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredWorkTime`

```json
{
  "type": "object",
  "properties": {
    "dayOfWeek": {
      "type": "string",
      "description": "요일",
      "enum": [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
      ],
      "example": "MON",
      "pattern": "MON|TUE|WED|THU|FRI|SAT|SUN"
    },
    "startTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "시작 시간 (HH:mm), 30분 단위",
      "example": "09:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    },
    "endTime": {
      "type": "string",
      "format": "HH:mm",
      "description": "종료 시간 (HH:mm), 30분 단위. 시작보다 이르면 다음 날 종료이며 시작 요일로 저장한다. 시작과 같을 수 없음",
      "example": "13:00",
      "pattern": "([01][0-9]|2[0-3]):(00|30)"
    }
  },
  "required": [
    "dayOfWeek",
    "endTime",
    "startTime"
  ]
}
```

### `#/components/schemas/StudentMatchingPreferenceUpdateRequestPriority`

```json
{
  "type": "object",
  "properties": {
    "criterionId": {
      "type": "integer",
      "format": "int64",
      "description": "우선순위 기준 ID: 1 근무시간, 2 시급, 3 거리, 4 업종",
      "example": 1,
      "exclusiveMinimum": 0
    },
    "priorityOrder": {
      "type": "integer",
      "format": "int32",
      "description": "순위. 1~4를 각각 한 번 사용",
      "example": 1,
      "maximum": 4,
      "minimum": 1
    }
  },
  "required": [
    "criterionId",
    "priorityOrder"
  ]
}
```

### `#/components/schemas/StudentOnboardingMatchingPreferenceRequest`

```json
{
  "type": "object",
  "description": "온보딩에서 제출하는 구직조건 전체. 기존 부분 수정 요청의 형식과 검증을 사용하되 필수 항목을 모두 제출한다.",
  "properties": {
    "businessTypeFlexible": {
      "type": "boolean",
      "description": "업종 상관없음 여부. 미설정 시 false. 생략하면 기존 값 유지, null 불가",
      "example": false
    },
    "preferredJobs": {
      "type": "array",
      "description": "희망 업종 목록. 전체 교체. businessTypeFlexible=true이면 [], false이면 1개 이상. 생략하면 기존 값 유지, null 불가",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredJob"
      }
    },
    "preferredWorkTimes": {
      "type": "array",
      "description": "연속 1시간 이상인 구간을 최소 하나 포함한다. 자정을 넘는 구간도 시작 요일 하나로 전송한다",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredWorkTime"
      },
      "maxItems": 2147483647,
      "minItems": 1
    },
    "preferredLocation": {
      "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPreferredLocation",
      "description": "희망 근무지역. 전송하면 지역명·위도·경도·반경 모두 필수. 생략하면 기존 값 유지, null 불가"
    },
    "priorities": {
      "type": "array",
      "description": "우선순위 목록. 네 기준 모두를 중복 없이 전송하여 전체 교체. 생략하면 기존 값 유지, null 불가",
      "items": {
        "$ref": "#/components/schemas/StudentMatchingPreferenceUpdateRequestPriority"
      },
      "maxItems": 4,
      "minItems": 4
    }
  },
  "required": [
    "businessTypeFlexible",
    "preferredJobs",
    "preferredLocation",
    "preferredWorkTimes",
    "priorities"
  ]
}
```

### `#/components/schemas/StudentOnboardingRequest`

```json
{
  "type": "object",
  "description": "온보딩 마지막 마치기에서 전체 정보를 한 번에 제출한다. 경력 없음은 careers=[], TOPIK은 입력받지 않고 OCR 최종 등록으로만 반영한다. 학업과정 studyProgram은 필수다. 체류자격은 서버의 등록증 코드와 선택한 학업과정으로 결정한다. 이름 · 국적 · 체류 만료일은 가입 인증 결과를 사용한다. 학교·학년·학적 상태는 입력받지 않는다.",
  "properties": {
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "계정 생성 후 온보딩에서 입력한 생년월일. 마치기에서 필수 제출하며 한국 날짜 기준 만 18세 이상이어야 한다. 이전 입력값을 복원하지 않는다",
      "example": "2000-05-14"
    },
    "currentRegion": {
      "type": "string",
      "description": "현재 거주지역",
      "example": "서울특별시 마포구",
      "maxLength": 150,
      "minLength": 0
    },
    "koreanLevel": {
      "type": "string",
      "description": "한국어 수준",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "minLength": 1,
      "pattern": "BEGINNER|INTERMEDIATE|ADVANCED"
    },
    "studyProgram": {
      "type": "string",
      "description": "학업과정. 전문학사·학사·석사·박사·교환학생 순서. 등록증에서 확인한 D-2와 사용자가 선택한 학업과정을 조합하여 세부 코드를 생성한다",
      "enum": [
        "ASSOCIATE",
        "BACHELOR",
        "MASTER",
        "DOCTORATE",
        "EXCHANGE"
      ],
      "example": "BACHELOR",
      "minLength": 1,
      "pattern": "ASSOCIATE|BACHELOR|MASTER|DOCTORATE|EXCHANGE"
    },
    "careers": {
      "type": "array",
      "description": "경력 목록. 경력 없음은 빈 목록을 명시한다",
      "items": {
        "$ref": "#/components/schemas/StudentCareerCreateRequest"
      }
    },
    "matchingPreferences": {
      "$ref": "#/components/schemas/StudentOnboardingMatchingPreferenceRequest",
      "description": "구직조건 전체. 업종 상관없음 여부 · 업종 목록 · 연속 1시간 이상을 포함한 근무시간 · 위치와 반경 · 4개 우선순위가 모두 필수. 최소 희망 시급은 입력받지 않는다."
    }
  },
  "required": [
    "birthDate",
    "careers",
    "currentRegion",
    "koreanLevel",
    "matchingPreferences",
    "studyProgram"
  ]
}
```

### `#/components/schemas/StudentOnboardingResponse`

```json
{
  "type": "object",
  "properties": {
    "studentId": {
      "type": "integer",
      "format": "int64",
      "description": "유학생 회원 ID"
    },
    "completed": {
      "type": "boolean",
      "description": "온보딩 완료 여부. 추천 이용 자격이나 현재 체류기간 유효 여부를 뜻하지 않는다",
      "example": true
    },
    "completedAt": {
      "type": "string",
      "format": "date-time",
      "description": "전체 저장과 함께 기록한 최초 완료 시각"
    }
  },
  "required": [
    "completed",
    "completedAt",
    "studentId"
  ]
}
```

### `#/components/schemas/StudentProfileCreateRequest`

```json
{
  "type": "object",
  "description": "휴대전화 인증 후 최초 유학생 프로필 등록.",
  "properties": {
    "name": {
      "type": "string",
      "description": "회원 이름",
      "example": "김하늘",
      "maxLength": 100,
      "minLength": 0
    },
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "생년월일 (YYYY-MM-DD). 한국 기준 만 18세 이상",
      "example": "2000-05-14"
    },
    "nationality": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 국가 코드 (영문 대문자 2자리)",
      "example": "VN",
      "minLength": 1,
      "pattern": "[A-Z]{2}"
    },
    "currentRegion": {
      "type": "string",
      "description": "현재 거주지역. 빈 문자열·공백만 입력 불가",
      "example": "서울특별시 성동구",
      "maxLength": 150,
      "minLength": 0
    },
    "koreanLevel": {
      "type": "string",
      "description": "한국어 수준. 화면에서는 초급·중급·고급으로 변환 가능",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "example": "INTERMEDIATE",
      "minLength": 1,
      "pattern": "BEGINNER|INTERMEDIATE|ADVANCED"
    }
  },
  "required": [
    "birthDate",
    "currentRegion",
    "koreanLevel",
    "name",
    "nationality"
  ]
}
```

### `#/components/schemas/StudentProfileCreateResponse`

```json
{
  "type": "object",
  "description": "유학생 프로필 등록 결과",
  "properties": {
    "studentId": {
      "type": "integer",
      "format": "int64",
      "description": "유학생 회원 ID",
      "example": 1
    },
    "name": {
      "type": "string",
      "description": "회원 이름",
      "example": "김하늘",
      "maxLength": 100
    },
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678"
    },
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "생년월일 (YYYY-MM-DD). 한국 기준 만 18세 이상",
      "example": "2000-05-14"
    },
    "nationality": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 국가 코드 (영문 대문자 2자리)",
      "example": "VN",
      "pattern": "[A-Z]{2}"
    },
    "currentRegion": {
      "type": "string",
      "description": "현재 거주지역. 빈 문자열·공백만 입력 불가",
      "example": "서울특별시 성동구",
      "maxLength": 150
    },
    "koreanLevel": {
      "type": "string",
      "description": "한국어 수준. 화면에서는 초급·중급·고급으로 변환 가능",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "example": "INTERMEDIATE"
    }
  },
  "required": [
    "birthDate",
    "currentRegion",
    "koreanLevel",
    "name",
    "nationality",
    "phoneNumber",
    "studentId"
  ]
}
```

### `#/components/schemas/StudentProfileResponse`

```json
{
  "type": "object",
  "description": "유학생 프로필 상세 정보",
  "properties": {
    "studentId": {
      "type": "integer",
      "format": "int64",
      "description": "유학생 회원 ID",
      "example": 1
    },
    "name": {
      "type": "string",
      "description": "회원 이름",
      "example": "김하늘",
      "maxLength": 100
    },
    "email": {
      "type": [
        "string",
        "null"
      ],
      "description": "회원 이메일. 소셜 가입 시 제공되지 않으면 null",
      "example": "student@example.com",
      "maxLength": 255
    },
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678"
    },
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "생년월일 (YYYY-MM-DD). 한국 기준 만 18세 이상",
      "example": "2000-05-14"
    },
    "nationality": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 국가 코드 (영문 대문자 2자리)",
      "example": "VN",
      "pattern": "[A-Z]{2}"
    },
    "currentRegion": {
      "type": "string",
      "description": "현재 거주지역. 빈 문자열·공백만 입력 불가",
      "example": "서울특별시 성동구",
      "maxLength": 150
    },
    "koreanLevel": {
      "type": "string",
      "description": "한국어 수준. 화면에서는 초급·중급·고급으로 변환 가능",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "example": "INTERMEDIATE"
    },
    "visaCode": {
      "type": [
        "string",
        "null"
      ],
      "description": "D-2는 저장된 학업과정으로 결정한 세부 코드. 갱신 시 D-10 등 지원 대상 밖의 체류자격도 원문으로 저장·조회한다",
      "example": "D-2",
      "maxLength": 20
    },
    "universityName": {
      "type": [
        "string",
        "null"
      ],
      "description": "재학증명서 OCR로 확보하는 학교명. 직접 입력 불가, 기존 값 보존",
      "example": "예시대학교",
      "maxLength": 150
    },
    "enrollmentStartDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "학업 시작일 (YYYY-MM-DD)",
      "example": "2025-03-01"
    },
    "studyProgramId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "학업과정 ID",
      "example": 1
    },
    "studyProgram": {
      "type": [
        "string",
        "null"
      ],
      "description": "온보딩에서 선택한 학업과정. 기존 미입력 또는 지원 과정에 대응하지 않는 기존 데이터는 null",
      "enum": [
        "ASSOCIATE",
        "BACHELOR",
        "MASTER",
        "DOCTORATE",
        "EXCHANGE"
      ],
      "example": "BACHELOR"
    },
    "gradeLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "재학증명서 OCR로 확보하는 학년. 직접 입력 불가, 기존 값 보존",
      "example": 2
    },
    "academicState": {
      "type": [
        "string",
        "null"
      ],
      "description": "과거에 저장된 학적 상태. 신규 입력·수정은 받지 않으며 기존 값만 보존한다. 미입력은 null",
      "example": "ENROLLED",
      "pattern": "^(ENROLLED|ON_LEAVE|COMPLETED|GRADUATED|IN_PROGRESS|DISCONTINUED|ON_LEAVE_OR_DISCONTINUED)$"
    },
    "topikLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "TOPIK 급수. 미등록은 null",
      "example": 4,
      "maximum": 6,
      "minimum": 1
    },
    "stayStartDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "체류 시작일 (YYYY-MM-DD)",
      "example": "2025-03-01"
    },
    "stayExpirationDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "체류 만료일 (YYYY-MM-DD). 과거 날짜 허용, 기존 체류 시작일보다 앞설 수 없음",
      "example": "2027-03-01"
    },
    "profileImageUrl": {
      "type": [
        "string",
        "null"
      ],
      "description": "프로필 사진 임시 URL. 사진 미등록 시 null",
      "example": "https://example.com/profile.jpg"
    },
    "hirelinkBadgeIssuedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "배지 발급 시각 (ISO-8601). 미발급 시 null",
      "example": "2026-11-01T01:00:00Z"
    },
    "careers": {
      "type": "array",
      "description": "경력 목록. 시작월 내림차순, 같은 시작월은 ID 내림차순. 없으면 []",
      "items": {
        "$ref": "#/components/schemas/StudentProfileResponseCareer"
      }
    }
  },
  "required": [
    "academicState",
    "birthDate",
    "careers",
    "currentRegion",
    "email",
    "enrollmentStartDate",
    "gradeLevel",
    "hirelinkBadgeIssuedAt",
    "koreanLevel",
    "name",
    "nationality",
    "phoneNumber",
    "profileImageUrl",
    "stayExpirationDate",
    "stayStartDate",
    "studentId",
    "studyProgram",
    "studyProgramId",
    "topikLevel",
    "universityName",
    "visaCode"
  ]
}
```

### `#/components/schemas/StudentProfileResponseCareer`

```json
{
  "type": "object",
  "properties": {
    "careerId": {
      "type": "integer",
      "format": "int64",
      "description": "경력 ID",
      "example": 1
    },
    "careerName": {
      "type": "string",
      "description": "경력명. 빈 문자열·공백만 입력 불가",
      "example": "카페 아르바이트",
      "maxLength": 150
    },
    "startMonth": {
      "type": "string",
      "description": "근무 시작월 (YYYY-MM). 한국 기준 이번 달까지 허용",
      "example": "2026-01",
      "pattern": "[0-9]{4}-(0[1-9]|1[0-2])"
    },
    "endMonth": {
      "type": "string",
      "description": "근무 종료월 (YYYY-MM). 시작월 이상, 한국 기준 이번 달까지 허용",
      "example": "2026-06",
      "pattern": "[0-9]{4}-(0[1-9]|1[0-2])"
    },
    "description": {
      "type": [
        "string",
        "null"
      ],
      "description": "저장된 근무 내용. 기존 경력에는 null 또는 빈 값이 남아 있을 수 있다. 경력 추가 · 수정 시에는 필수",
      "example": "음료 제조 및 고객 응대"
    }
  },
  "required": [
    "careerId",
    "careerName",
    "description",
    "endMonth",
    "startMonth"
  ]
}
```

### `#/components/schemas/StudentProfileUpdateResponse`

```json
{
  "type": "object",
  "description": "유학생 프로필 수정 결과",
  "properties": {
    "studentId": {
      "type": "integer",
      "format": "int64",
      "description": "유학생 회원 ID",
      "example": 1
    },
    "name": {
      "type": "string",
      "description": "회원 이름",
      "example": "김하늘",
      "maxLength": 100
    },
    "email": {
      "type": [
        "string",
        "null"
      ],
      "description": "회원 이메일. 소셜 가입 시 제공되지 않으면 null",
      "example": "student@example.com",
      "maxLength": 255
    },
    "phoneNumber": {
      "type": "string",
      "description": "국내 010 휴대전화 번호. 입력 시 하이픈 생략 가능, 응답은 하이픈 포함",
      "example": "010-1234-5678"
    },
    "birthDate": {
      "type": "string",
      "format": "date",
      "description": "생년월일 (YYYY-MM-DD). 한국 기준 만 18세 이상",
      "example": "2000-05-14"
    },
    "nationality": {
      "type": "string",
      "description": "ISO 3166-1 alpha-2 국가 코드 (영문 대문자 2자리)",
      "example": "VN",
      "pattern": "[A-Z]{2}"
    },
    "currentRegion": {
      "type": "string",
      "description": "현재 거주지역. 빈 문자열·공백만 입력 불가",
      "example": "서울특별시 성동구",
      "maxLength": 150
    },
    "koreanLevel": {
      "type": "string",
      "description": "한국어 수준. 화면에서는 초급·중급·고급으로 변환 가능",
      "enum": [
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
      ],
      "example": "INTERMEDIATE"
    },
    "visaCode": {
      "type": [
        "string",
        "null"
      ],
      "description": "D-2는 저장된 학업과정으로 결정한 세부 코드. 갱신 시 D-10 등 지원 대상 밖의 체류자격도 원문으로 저장·조회한다",
      "example": "D-2",
      "maxLength": 20
    },
    "universityName": {
      "type": [
        "string",
        "null"
      ],
      "description": "재학증명서 OCR로 확보하는 학교명. 직접 입력 불가, 기존 값 보존",
      "example": "예시대학교",
      "maxLength": 150
    },
    "studyProgramId": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int64",
      "description": "학업과정 ID",
      "example": 1
    },
    "studyProgram": {
      "type": [
        "string",
        "null"
      ],
      "description": "온보딩에서 선택한 학업과정. 기존 미입력 또는 지원 과정에 대응하지 않는 기존 데이터는 null",
      "enum": [
        "ASSOCIATE",
        "BACHELOR",
        "MASTER",
        "DOCTORATE",
        "EXCHANGE"
      ],
      "example": "BACHELOR"
    },
    "gradeLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "재학증명서 OCR로 확보하는 학년. 직접 입력 불가, 기존 값 보존",
      "example": 2
    },
    "academicState": {
      "type": [
        "string",
        "null"
      ],
      "description": "과거에 저장된 학적 상태. 신규 입력·수정은 받지 않으며 기존 값만 보존한다. 미입력은 null",
      "example": "ENROLLED",
      "pattern": "^(ENROLLED|ON_LEAVE|COMPLETED|GRADUATED|IN_PROGRESS|DISCONTINUED|ON_LEAVE_OR_DISCONTINUED)$"
    },
    "topikLevel": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "TOPIK 급수. 미등록은 null",
      "example": 4,
      "maximum": 6,
      "minimum": 1
    },
    "stayExpirationDate": {
      "type": [
        "string",
        "null"
      ],
      "format": "date",
      "description": "체류 만료일 (YYYY-MM-DD). 과거 날짜 허용, 기존 체류 시작일보다 앞설 수 없음",
      "example": "2027-03-01"
    },
    "hirelinkBadgeIssuedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "배지 발급 시각 (ISO-8601). 미발급 시 null",
      "example": "2026-11-01T01:00:00Z"
    }
  },
  "required": [
    "academicState",
    "birthDate",
    "currentRegion",
    "email",
    "gradeLevel",
    "hirelinkBadgeIssuedAt",
    "koreanLevel",
    "name",
    "nationality",
    "phoneNumber",
    "stayExpirationDate",
    "studentId",
    "studyProgram",
    "studyProgramId",
    "topikLevel",
    "universityName",
    "visaCode"
  ]
}
```

### `#/components/schemas/StudentStayExpirationNoticeResponse`

```json
{
  "type": "object",
  "description": "만료일별 사전 안내 표시권 획득 결과. show=true인 응답에서만 화면을 표시한다",
  "properties": {
    "show": {
      "type": "boolean",
      "description": "이번 요청에서 최초 안내 대상으로 기록되었는지 여부"
    },
    "stayExpirationDate": {
      "type": "string",
      "format": "date",
      "description": "현재 최종 확인된 만료일. 인증 정보가 없으면 null"
    },
    "remainingDays": {
      "type": "integer",
      "format": "int64",
      "description": "한국 날짜 기준 이번 요청 시점의 남은 일수. 인증 정보가 없으면 null"
    },
    "message": {
      "type": "string",
      "description": "show=true일 때 안내 문구. 그 외에는 null"
    }
  }
}
```

### `#/components/schemas/StudentWorkingConditionsResponse`

```json
{
  "type": "object",
  "properties": {
    "basicInformation": {
      "$ref": "#/components/schemas/BasicInformation"
    },
    "calculatedOn": {
      "type": "string",
      "format": "date",
      "description": "저장된 근무 가능 조건을 계산한 한국 날짜"
    },
    "accreditationEffectiveFrom": {
      "type": "string",
      "format": "date",
      "description": "이번 판정에 적용한 인증대학 목록의 시작일"
    },
    "estimate": {
      "$ref": "#/components/schemas/WorkingTimeEstimate"
    },
    "notice": {
      "type": "string",
      "description": "예상 기준과 실제 허가를 구분하는 안내"
    }
  }
}
```

### `#/components/schemas/TermAgreementOverviewResponse`

```json
{
  "type": "object",
  "description": "현재 약관 메타데이터와 본인의 기존 동의 기록. 본문은 포함하지 않고 조회로 기록을 변경하지 않는다",
  "properties": {
    "terms": {
      "type": "array",
      "description": "약관 ID 오름차순 목록",
      "items": {
        "$ref": "#/components/schemas/TermAgreementOverviewTerm"
      }
    }
  },
  "required": [
    "terms"
  ]
}
```

### `#/components/schemas/TermAgreementOverviewTerm`

```json
{
  "type": "object",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "약관 종류 ID"
    },
    "termTypeName": {
      "type": "string",
      "description": "약관 이름"
    },
    "isRequired": {
      "type": "boolean",
      "description": "필수 동의 항목 여부"
    },
    "currentVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "현재 본문 버전. 미설정이면 null"
    },
    "isAgreed": {
      "type": "boolean",
      "description": "본인의 동의 여부"
    },
    "agreedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "동의 시각. 미동의이면 null"
    },
    "agreedVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "기존 동의 버전. 과거 버전 미기록이면 null"
    }
  },
  "required": [
    "agreedAt",
    "agreedVersion",
    "currentVersion",
    "isAgreed",
    "isRequired",
    "termTypeId",
    "termTypeName"
  ]
}
```

### `#/components/schemas/TermAgreementRequest`

```json
{
  "type": "object",
  "description": "로그인 회원의 약관별 동의 상태 저장. userId는 요청에 포함하지 않는다.",
  "example": {
    "agreements": [
      {
        "termTypeId": 1,
        "version": "v1",
        "isAgreed": true
      },
      {
        "termTypeId": 3,
        "version": "v1",
        "isAgreed": false
      }
    ]
  },
  "properties": {
    "agreements": {
      "type": "array",
      "description": "이번 요청에서 저장할 약관 목록. 빈 목록 허용, 같은 약관 ID 중복 불가",
      "items": {
        "$ref": "#/components/schemas/TermAgreementRequestAgreement"
      }
    }
  },
  "required": [
    "agreements"
  ]
}
```

### `#/components/schemas/TermAgreementRequestAgreement`

```json
{
  "type": "object",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "약관 종류 ID",
      "example": 1,
      "exclusiveMinimum": 0
    },
    "isAgreed": {
      "type": "boolean",
      "description": "해당 약관 동의 여부",
      "example": true
    },
    "version": {
      "type": "string",
      "description": "프론트가 실제 표시한 본문의 버전. 현재 버전과 정확히 일치해야 하며 서버가 자동으로 채우지 않는다",
      "example": "v1",
      "minLength": 1,
      "pattern": "[A-Za-z0-9][A-Za-z0-9._-]{0,63}"
    }
  },
  "required": [
    "isAgreed",
    "termTypeId",
    "version"
  ]
}
```

### `#/components/schemas/TermAgreementResponse`

```json
{
  "type": "object",
  "description": "저장한 약관 동의 상태",
  "properties": {
    "agreements": {
      "type": "array",
      "description": "이번 요청에서 저장한 약관 목록. 요청 순서로 반환",
      "items": {
        "$ref": "#/components/schemas/TermAgreementResponseAgreement"
      }
    }
  },
  "required": [
    "agreements"
  ]
}
```

### `#/components/schemas/TermAgreementResponseAgreement`

```json
{
  "type": "object",
  "properties": {
    "termTypeId": {
      "type": "integer",
      "format": "int64",
      "description": "약관 종류 ID",
      "example": 1
    },
    "isAgreed": {
      "type": "boolean",
      "description": "해당 약관 동의 여부",
      "example": true
    },
    "agreedAt": {
      "type": [
        "string",
        "null"
      ],
      "format": "date-time",
      "description": "동의 시각 (ISO-8601). false이면 null, true를 반복 전송하면 기존 동의 시각 유지",
      "example": "2026-11-01T01:00:00Z"
    },
    "agreedVersion": {
      "type": [
        "string",
        "null"
      ],
      "description": "해당 동의 기록의 본문 버전. 버전을 기록하지 않은 기존 데이터는 null"
    }
  },
  "required": [
    "agreedAt",
    "agreedVersion",
    "isAgreed",
    "termTypeId"
  ]
}
```

### `#/components/schemas/WorkTime`

```json
{
  "type": "object",
  "description": "요일별 근무시간",
  "properties": {
    "dayOfWeek": {
      "type": "string",
      "description": "요일",
      "enum": [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
      ],
      "example": "SAT"
    },
    "startTime": {
      "type": "string",
      "description": "근무 시작 시각",
      "example": "10:00"
    },
    "endTime": {
      "type": "string",
      "description": "근무 종료 시각",
      "example": "18:00"
    }
  },
  "required": [
    "dayOfWeek",
    "endTime",
    "startTime"
  ]
}
```

### `#/components/schemas/WorkingTimeEstimate`

```json
{
  "type": "object",
  "description": "서비스의 예상 근무시간 기준이며 시간제취업 허가 완료를 뜻하지 않는다",
  "properties": {
    "requiredTopikLevel": {
      "type": "integer",
      "format": "int32"
    },
    "topikRequirementMet": {
      "type": "boolean"
    },
    "accreditedUniversity": {
      "type": "boolean"
    },
    "excellentGrades": {
      "type": "boolean",
      "description": "직전 학기 평균 평점 자체가 4.0 이상. 만점 환산 없음"
    },
    "excellentKorean": {
      "type": "boolean",
      "description": "TOPIK 5급 이상"
    },
    "additionalWeekdayHours": {
      "type": "integer",
      "format": "int32",
      "description": "기본요건을 충족하고 우대조건이 하나 이상이면 5, 그 외 0",
      "enum": [
        "0",
        "5"
      ]
    },
    "combinedWeeklyLimitHours": {
      "type": [
        "integer",
        "null"
      ],
      "format": "int32",
      "description": "TOPIK 미충족 시 주중·주말·공휴일·방학을 포함한 공통 주당 한도. 충족 시 null"
    },
    "termWeekdays": {
      "$ref": "#/components/schemas/PeriodLimit"
    },
    "weekendsAndHolidays": {
      "$ref": "#/components/schemas/PeriodLimit"
    },
    "vacations": {
      "$ref": "#/components/schemas/PeriodLimit"
    }
  }
}
```

## 인증 스키마

```json
{
  "bearerAuth": {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT"
  }
}
```
