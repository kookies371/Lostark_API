# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 사용할 지침을 제공합니다.

## 📋 문서 작성 언어

이 프로젝트의 모든 문서(README, 주석, 문서 파일 등)는 **한글**로 작성합니다.

## 🔒 Git 정책

**⚠️ 중요: git commit 및 push는 사용자가 명시적으로 요청할 때만 수행합니다.**

- 코드 작성이나 파일 수정 후 자동으로 커밋하지 않음
- 사용자가 "커밋해줘", "푸시해줘" 등의 명시적 요청이 있을 때만 수행
- 커밋 메시지는 한글로 작성
- 불가피하게 git 작업이 필요한 경우, 항상 먼저 사용자의 승인을 받을 것

## 🎯 프로젝트 목표

**로스트아크 캐릭터 정보 조회 웹사이트** 구축

사용자가 캐릭터 이름을 입력하면 로스트아크 공식 API를 통해 다음 정보를 웹사이트에서 조회할 수 있게 하는 것이 목표입니다:
- ✅ 캐릭터의 기본 정보 (레벨, 아이템 레벨)
- ✅ 장비 정보 (악세서리, 각인, 스텟)
- ✅ 카드 정보
- ✅ 동일 계정 캐릭터 조회

**추가 목표**: 기본적인 프로그래밍 방법론과 소프트웨어 설계 원칙 학습

---

## 🏗️ 프로젝트 구조

### 디렉토리 구조

```
Lostark_API/
├── core/                          # 로스트아크 API 통신, 데이터 모델
│   ├── loaders/                   # API 로더 (템플릿 메서드 패턴)
│   │   ├── __init__.py
│   │   ├── base.py                # LostarkLoader (추상 클래스)
│   │   ├── auction.py             # AuctionLoader, GemAuctionLoader, AmuletAuctionLoader
│   │   └── character.py           # CharacterLoader, CardLoader
│   │
│   ├── entities/                  # 게임 데이터 모델
│   │   ├── __init__.py
│   │   ├── accessories.py         # Accessory, AccessorySetting
│   │   └── enums/
│   │       ├── __init__.py
│   │       ├── engrave.py         # Engrave 열거형
│   │       └── status.py          # Status 열거형
│   │
│   ├── __init__.py                # 공개 API
│   └── utils.py                   # JWT 토큰 관리 (.env.local)
│
├── app/                           # FastAPI 백엔드 (미구현)
│   ├── main.py                    # FastAPI 엔드포인트
│   ├── database.py                # SQLite 캐싱 로직
│   └── services/
│       └── character.py           # 비즈니스 로직
│
├── ui/                            # Streamlit 프론트엔드 (미구현)
│   ├── app.py                     # 메인 앱
│   └── pages/
│       ├── character_search.py    # 검색 페이지
│       └── equipment_view.py      # 상세 페이지
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

### 구현 상태

- ✅ **core/loaders**: CharacterLoader, CardLoader, AmuletAuctionLoader 등
- ✅ **core/entities**: Accessory, AccessorySetting, Engrave, Status
- ✅ **test/test_api_call.py**: pytest 기반 API 호출 테스트
- 🔄 **app/**: FastAPI 백엔드 (기초 구현 필요)
- 🔄 **ui/**: Streamlit 프론트엔드 (미구현)

---

## 🏛️ 아키텍처

### 계층 구조

```
UI 계층 (ui/)
  ↓ (HTTP 요청)
백엔드 계층 (app/)
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

**백엔드 계층** (`app/`)
- FastAPI로 REST API 제공
- 비즈니스 로직 구현
- SQLite를 통한 데이터 캐싱
- 웹 요청 검증 및 에러 처리

**UI 계층** (`ui/`)
- Streamlit으로 사용자 인터페이스 제공
- 백엔드에서 데이터를 받아 시각화
- 사용자 입력 처리

---

## 🔧 Core 계층 상세

### API 로더 패턴 (core/loaders/)

**템플릿 메서드 패턴** 활용:

```
LostarkLoader (base.py) - 추상 기본 클래스
├── BASE_URL: 공통 API 엔드포인트
├── headers: 공통 JWT 인증 헤더
├── load_content(): GET/POST 요청 통일 처리
└── load(*args, **kwargs): 추상 메서드
    ├── CharacterLoader: load(character_name)
    ├── CardLoader: load(character_name)
    └── AuctionLoader: load()
        ├── GemAuctionLoader
        └── AmuletAuctionLoader
```

**특징:**
- JWT 인증을 자동으로 처리
- 공통 코드 중복 제거
- 새로운 로더 추가 시 `load()` 메서드만 구현

### 게임 데이터 모델 (core/entities/)

- **Accessory**: 스텟과 각인을 포함하는 단일 악세서리
- **AccessorySetting**: 5개 악세서리 (목걸이 1개, 귀걸이 2개, 반지 2개) 집계
- **Status / Engrave**: 게임 고유의 스텟 및 각인 열거형
- **Python Counter**: 다중 속성 추적
- **검증**: 품질(0-100), 설정 구조(정확히 5개 아이템)

---

## ⚙️ 설정 및 실행

### 환경 설정 (.env.local)

**프로젝트 루트에 `.env.local` 파일 생성:**
```bash
LOSTARK_JWT=your_jwt_token_here
TEST_CHARACTER_NAME=your_character_name
```

**필수 설정:**
- `LOSTARK_JWT`: 로스트아크 공식 개발자 포털에서 발급받은 JWT 토큰
- `TEST_CHARACTER_NAME`: 테스트에 사용할 캐릭터 이름 (API 테스트 시 조회됨)

**구현:**
- `core/utils.py`의 `get_JWT()` 함수가 `.env.local`에서 JWT 토큰 로드
- `config.py`의 `TEST_CHARACTER_NAME`이 테스트에 사용되는 캐릭터 이름 로드
- `core/loaders/base.py`의 `LostarkLoader.__init__()`에서 JWT 자동 로드
- 모든 로더는 JWT를 자동으로 HTTP 헤더에 포함

**보안:**
- `.env.local` 파일은 `.gitignore`에 제외 (git 업로드 안 됨)
- `.claudeignore`에도 제외 (Claude Code 조회 안 됨)
- 토큰이나 캐릭터 정보가 노출되지 않도록 주의하세요

### 백엔드 실행

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API 문서: http://localhost:8000/docs
- 상태 확인: http://localhost:8000/health

### 프론트엔드 실행

```bash
streamlit run ui/app.py
```

- 웹 UI: http://localhost:8501

---

## 📝 사용 예제

### 캐릭터 정보 조회

```python
from core import CharacterLoader

loader = CharacterLoader()
result = loader.load(character_name="your_character_name")

for char in result:
    print(f"{char['CharacterName']}: {char['CharacterClassName']}")
```

### 카드 정보 조회

```python
from core import CardLoader

loader = CardLoader()
cards = loader.load(character_name="your_character_name")
print(cards['Cards'])      # 카드 정보
print(cards['Effects'])    # 세트 효과
```

### 아뮬렛 경매 조회

```python
from core import AmuletAuctionLoader

loader = AmuletAuctionLoader(character_class="your_class_name")
result = loader.load()
print(result['Items'])  # 경매 아뮬렛 목록
```

---

## 🧪 테스트

### API 호출 테스트 (pytest)

```bash
# 단일 테스트 실행
pytest test/test_api_call.py::test_api_call_target_character -v

# 모든 테스트 실행
pytest test/test_api_call.py -v

# 상세 출력 포함
pytest test/test_api_call.py -v -s
```

**테스트 내용:**
- ✅ API 응답이 리스트 형식
- ✅ TEST_CHARACTER_NAME 캐릭터가 조회 결과에 있음
- ✅ 필수 필드 모두 존재

**테스트 캐릭터 설정:**
`.env.local` 파일에 다음과 같이 추가하세요:
```
TEST_CHARACTER_NAME=your_character_name
```

---

## 📚 주요 의존성

| 패키지 | 용도 |
|--------|------|
| `fastapi` | REST API 프레임워크 |
| `uvicorn` | ASGI 서버 |
| `streamlit` | 웹 UI |
| `requests` | HTTP 클라이언트 |
| `sqlalchemy` | ORM |
| `python-dotenv` | 환경변수 관리 |
| `pytest` | 테스트 프레임워크 |

---

## 🚀 다음 단계

### Phase 1: 백엔드 기초 ⏳ (현재)

1. **FastAPI 백엔드** (`app/main.py`)
   - [x] 프로젝트 구조 설계 및 재정렬
   - [x] Core 로더 기본 구현
   - [x] pytest 기반 API 테스트
   - [ ] `GET /api/character/{character_name}` 엔드포인트
   - [ ] `GET /api/card/{character_name}` 엔드포인트
   - [ ] `GET /health` 헬스 체크
   - [ ] CORS 설정 및 에러 핸들링

2. **비즈니스 로직** (`app/services/character.py`)
   - [ ] 캐릭터 조회 및 구조화
   - [ ] API 응답을 `core.entities` 모델로 변환
   - [ ] 웹 응답용 DTO 정의

3. **SQLite 캐싱** (`app/database.py`)
   - [ ] SQLAlchemy 모델 정의
   - [ ] 캐싱 로직
   - [ ] 캐시 만료 설정

### Phase 2: 프론트엔드 UI 🔄

4. **Streamlit UI** (`ui/app.py`, `ui/pages/`)
   - [ ] 메인 페이지 구성
   - [ ] `character_search.py`: 검색 & 정보 표시
   - [ ] `equipment_view.py`: 상세 정보
   - [ ] 백엔드 통신

5. **고급 기능**
   - [ ] 여러 캐릭터 비교
   - [ ] 조회 히스토리
   - [ ] 캐시 갱신 옵션

---

## 💡 일반적인 개발 작업

### Core 계층

- **새로운 로더 추가**: `LostarkLoader` 확장, `load()` 메서드만 구현
- **게임 열거형 추가**: `core/entities/enums/` 파일 수정
- **데이터 모델 수정**: `core/entities/accessories.py` 수정

### 백엔드 계층

- **엔드포인트 추가**: `app/main.py`에서 라우트 정의
- **비즈니스 로직 추가**: `app/services/character.py`에 함수 추가
- **데이터베이스 모델 추가**: `app/database.py`에 테이블 정의

### UI 계층

- **새 페이지 추가**: `ui/pages/`에 `.py` 파일 생성
- **UI 컴포넌트**: Streamlit의 `st.` API 사용
- **데이터 시각화**: Streamlit 차트 및 테이블 활용

---

## 🛠️ 개발 환경

### 필수

- Python 3.8+
- `pip install -r requirements.txt`
- JWT 토큰 (로스트아크 개발자 포털)

### 추천

- `venv` 또는 `conda` (가상환경)
- VS Code, PyCharm (IDE)
- Jupyter Notebook (개발/테스트)
