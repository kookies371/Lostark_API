# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 따라야 할 개발 원칙과 아키텍처 정보를 담고 있습니다.

---

## 📋 문서 작성 언어

이 프로젝트의 모든 문서(README, 주석, 문서 파일 등)는 **한글**로 작성합니다.

---

## 🔒 Git 정책

**⚠️ 중요: git commit 및 push는 사용자가 명시적으로 요청할 때만 수행합니다.**

- 코드 작성이나 파일 수정 후 자동으로 커밋하지 않음
- 사용자가 "커밋해줘", "푸시해줘" 등의 명시적 요청이 있을 때만 수행
- 커밋 메시지는 한글로 작성
- 불가피하게 git 작업이 필요한 경우, 항상 먼저 사용자의 승인을 받을 것

---

## 🎯 프로젝트 목표

**로스트아크 캐릭터 정보 조회 웹사이트 구축**

사용자가 캐릭터 이름을 입력하면 로스트아크 공식 API를 통해 다음 정보를 웹사이트에서 조회할 수 있게 하는 것이 목표입니다:
- ✅ 캐릭터의 기본 정보 (레벨, 아이템 레벨)
- ✅ 장비 정보 (악세서리, 등급)
- ✅ 카드 정보 (카드 이미지, 각성도, 세트 효과)
- ✅ 동일 계정 캐릭터 조회

**추가 목표**: 기본적인 프로그래밍 방법론과 소프트웨어 설계 원칙 학습

---

## 🏗️ 프로젝트 구조

```
Lostark_API/
├── core/                          # 로스트아크 API 통신, 데이터 모델
│   ├── loaders/                   # API 로더 (템플릿 메서드 패턴)
│   │   ├── base.py                # LostarkLoader (추상 클래스)
│   │   ├── character.py           # CharacterLoader, CardLoader
│   │   └── armories.py            # ArmoryProfileLoader
│   │
│   ├── entities/                  # 게임 데이터 모델
│   │   ├── accessories.py         # Accessory, AccessorySetting
│   │   └── enums/                 # Status, Engrave 열거형
│   │
│   ├── __init__.py                # 공개 API
│   └── utils.py                   # JWT 토큰 관리 (.env.local)
│
├── app/                           # FastAPI 백엔드
│   ├── main.py                    # FastAPI 엔드포인트
│   ├── database.py                # SQLite 캐싱 로직
│   ├── static/                    # 정적 파일 (HTML, CSS, JS)
│   │   ├── index.html
│   │   ├── style.css
│   │   └── js/
│   │       ├── common.js          # 탭 전환, 공통 UI 함수
│   │       ├── expedition.js      # 원정대 정보 조회
│   │       └── spec.js            # 스펙 정보 조회 (장비 + 카드)
│   └── services/
│       └── character.py           # 비즈니스 로직
│
├── test/                          # 테스트
│   ├── __init__.py
│   └── test_api_call.py           # pytest 기반 API 테스트
│
├── config.py                      # 프로젝트 전역 설정
├── requirements.txt               # Python 의존성
├── .env.local                     # JWT 토큰 (git 미추적)
├── .claudeignore                  # Claude Code 제외 설정
├── .gitignore                     # git 제외 설정
├── README.md                      # 사용자용 문서
└── CLAUDE.md                      # 개발자용 문서 (이 파일)
```

---

## 🏛️ 아키텍처

### 계층 구조

```
웹 브라우저 (HTML + CSS + JavaScript)
  ↓ (HTTP 요청/응답)
백엔드 계층 (FastAPI - app/)
  ↓ (Python 호출)
코어 계층 (core/)
  ↓ (HTTP 요청)
로스트아크 공식 API
```

### 각 계층의 책임

**Core 계층** (`core/`)
- 로스트아크 API와의 직접 통신
- 게임 데이터 모델 정의
- 다른 계층과 독립적으로 재사용 가능
- 원칙: 순수 Python 의존성, UI 무관

**백엔드 계층** (`app/`)
- FastAPI로 REST API 제공
- 비즈니스 로직 구현
- SQLite를 통한 데이터 캐싱
- 웹 요청 검증 및 에러 처리
- 정적 파일 서빙 (HTML, CSS, JS)

**프론트엔드 계층** (`app/static/`)
- 순수 HTML + CSS + JavaScript (외부 프레임워크 미사용)
- 백엔드 API 호출 및 데이터 시각화
- 탭 기능, 검색 폼, 결과 렌더링

---

## 🔧 주요 설계 원칙

### Core 계층

**1. 템플릿 메서드 패턴 (API 로더)**

- `LostarkLoader`: 모든 로더의 추상 기본 클래스
- 공통: `BASE_URL`, `headers` (JWT 인증), `load_content()`
- 각 로더는 `load()` 메서드만 구현
- 새로운 API 엔드포인트 추가 시 로더 클래스 확장

**2. 데이터 모델 설계**

- 게임 엔티티별로 클래스 정의 (Accessory, AccessorySetting 등)
- 강타입 지정으로 실수 방지
- 열거형(Enum)으로 고정값 관리 (등급, 스텟명 등)

**3. JWT 토큰 관리**

- `.env.local` 파일에서 안전하게 로드
- `core/utils.py`에서 중앙화
- 모든 로더에 자동으로 주입

### 백엔드 계층

**1. 엔드포인트 설계**

- `GET /api/expedition/{character_name}` - 원정대 정보 (캐릭터 목록)
- `GET /api/character/{character_name}` - 스펙 정보 (장비 + 카드)
- `GET /health` - 헬스 체크

**2. CORS 설정**

- 모든 오리진에서 접근 가능 (개발/테스트 목적)
- 필요시 특정 도메인으로 제한 가능

**3. 에러 처리**

- 잘못된 캐릭터명: HTTP 400 (Bad Request)
- API 호출 실패: HTTP 400 with 상세 메시지
- 프론트엔드에서 사용자 친화적 메시지로 표시

### 프론트엔드 계층

**1. 모듈화된 JavaScript**

- `common.js`: 탭 전환, 로딩/에러 상태 관리 (범용 함수)
- `expedition.js`: 원정대 정보 조회 (서버별 그룹화, 정렬)
- `spec.js`: 스펙 정보 조회 (장비 리스트, 카드 그리드, 세트 효과)

**2. 데이터 구조 처리**

- 응답 구조 확인 후 적절한 렌더링 함수 호출
- 장비: 수직 리스트 (equipment-list)
- 카드: 그리드 레이아웃 (card-list, 130px×130px)
- 세트 효과: 별도 섹션 (card-effects-section)

**3. 스타일링**

- 등급별 색상: 황금색(전설), 보라색(영웅), 파란색(희귀), 초록색(고급), 회색(일반)
- 호버 효과: 카드 상승, 그림자 강화
- 반응형: 모바일부터 데스크톱까지 지원

---

## 🔐 보안 원칙

1. **토큰 보안**
   - `.env.local`은 절대 git에 커밋하지 않음
   - 토큰 노출 시 개발자 포털에서 즉시 재발급
   - Claude Code에도 `.claudeignore`로 제외

2. **입력 검증**
   - 캐릭터 이름: URL 인코딩 (encodeURIComponent)
   - 백엔드: FastAPI 기본 유효성 검사

3. **데이터 처리**
   - 사용자 입력으로 API 요청 생성
   - 응답 데이터는 신뢰할 수 있는 소스 (공식 API)

---

## 💡 개발 가이드라인

**코드 작성 시:**
- 불필요한 추상화 피하기 (YAGNI 원칙)
- 명확하고 간단한 구현 우선
- 주석은 "왜"를 설명 (어떻게가 아님)
- 한글로 작성 (README, 주석, 커밋 메시지)

**새로운 기능 추가 시:**
- Core 계층: 로더 클래스 확장 또는 새 클래스 추가
- 백엔드 계층: `app/main.py`에 새 엔드포인트 추가
- 프론트엔드: 새 탭이나 섹션은 HTML/CSS/JS 추가

**테스트:**
- API 호출 테스트: `pytest test/test_api_call.py`
- 캐릭터명 변경 시 `.env.local`의 `TEST_CHARACTER_NAME` 업데이트

---

## 🔌 API 응답 구조

### 1. `/api/expedition/{character_name}`

같은 계정의 모든 캐릭터 조회

```
[ 캐릭터 객체, ... ]

캐릭터 객체:
{
  "CharacterName": string      # 캐릭터 이름
  "CharacterClassName": string # 직업명
  "CharacterLevel": number     # 캐릭터 레벨
  "ItemAvgLevel": string       # 아이템 레벨 (쉼표 포함: "1,500.50")
  "ServerName": string         # 서버명
}
```

---

### 2. `/api/character/{character_name}`

캐릭터의 장비 및 카드 정보 조회

```
{
  "ArmoryEquipment": [
    {
      "Type": string      # 부위 ("목걸이", "귀걸이" 등)
      "Name": string      # 아이템 이름
      "Icon": string      # 아이콘 URL
      "Grade": string     # 등급 ("전설", "영웅", "희귀", "고급", "일반")
    },
    ...
  ],

  "ArmoryCard": {
    "Cards": [
      {
        "Slot": number        # 슬롯 번호 (0~5)
        "Name": string        # 카드 이름
        "Icon": string        # 카드 이미지 URL
        "Grade": string       # 카드 등급
        "AwakeCount": number  # 현재 각성 수
        "AwakeTotal": number  # 최대 각성 수
        "Tooltip": string     # 카드 상세 정보 (HTML 문자열)
      },
      ...
    ],

    "Effects": [
      {
        "Index": number       # 세트 인덱스
        "CardSlots": [number] # 활성화 슬롯 배열
        "Items": [
          {
            "Name": string        # 세트 효과 이름
            "Description": string # 효과 설명
          },
          ...
        ]
      }
    ]
  }
}
```

---

## 🔄 최근 변경사항 (참고용)

**2024년 12월 - 카드 정보 웹 시각화**
- `spec.js` 완전 재작성: `ArmoryCard.Cards`와 `Effects` 구조 정확 인식
- `style.css` 재설계: 카드 그리드 레이아웃, 세트 효과 섹션 분리
- 등급별 색상 구분, hover 효과 추가

---

## 📚 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [로스트아크 공식 API](https://developer.game.onstove.com/)
- 프로젝트 코드의 주석과 docstring 참고