# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 사용할 지침을 제공합니다.

## 문서 작성 언어

이 프로젝트의 모든 문서(README, 주석, 문서 파일 등)는 **한글**로 작성합니다.

## Git 정책

**⚠️ 중요: git commit 및 push는 사용자가 명시적으로 요청할 때만 수행합니다.**

- 코드 작성이나 파일 수정 후 자동으로 커밋하지 않음
- 사용자가 "커밋해줘", "푸시해줘" 등의 명시적 요청이 있을 때만 수행
- 커밋 메시지는 한글로 작성
- 불가피하게 git 작업이 필요한 경우, 항상 먼저 사용자의 승인을 받을 것

## 프로젝트 목표

**로스트아크 캐릭터 정보 조회 웹사이트** 구축

사용자가 캐릭터 이름을 입력하면 로스트아크 공식 API를 통해 다음 정보를 웹사이트에서 조회할 수 있게 하는 것이 목표입니다:
- 캐릭터의 기본 정보 (레벨, 아이템 레벨, 진화 단계 등)
- 장비 정보 (악세서리, 각인, 스텟)
- 카드 정보
- 다른 캐릭터 조회 (동일 계정 캐릭터)

**추가 목표**: 기본적인 프로그래밍 방법론과 소프트웨어 설계 원칙 학습

## 프로젝트 현황

### 현재 구조

```
Lostark_API/
├── core/                          # 로스트아크 API 통신, 데이터 모델
│   ├── loader.py                  # API 로더 (추상 클래스, 경매 로더 등)
│   ├── accessory.py               # 악세서리 데이터 모델 (Accessory, AccessorySetting)
│   ├── engrave.py                 # 각인 열거형
│   ├── status.py                  # 스텟 속성 열거형
│   └── utils.py                   # JWT 토큰 관리 등 유틸리티
│
├── app/                           # FastAPI 백엔드
│   ├── main.py                    # FastAPI 앱 진입점, REST API 엔드포인트
│   ├── database.py                # SQLite 캐싱 로직
│   └── services/
│       └── character.py           # 캐릭터 조회 및 구조화 비즈니스 로직
│
├── ui/                            # Streamlit 프론트엔드
│   ├── app.py                     # Streamlit 메인 앱
│   └── pages/                     # 멀티페이지 컴포넌트
│       ├── character_search.py    # 캐릭터 검색 페이지
│       └── equipment_view.py      # 장비 정보 상세 페이지
│
├── test/                          # 테스트 및 프로토타입
│   ├── LostarkLoader.py           # API 사용 예제
│   ├── CardEffects.py             # 스텁
│   └── test.ipynb                 # Jupyter 노트북 테스트
│
├── docs/                          # 문서
│   └── API_STRUCTURE.md           # API 구조 설명 (WIP)
│
└── .streamlit/                    # Streamlit 설정
    └── config.toml
```

### 구현 완료
- **core/**: 로스트아크 API 통신 레이어, 데이터 모델 (Accessory, AccessorySetting 등)

### 구현 진행 중
- **app/**: FastAPI 백엔드, SQLite 캐싱, 비즈니스 로직
- **ui/**: Streamlit 프론트엔드, UI 페이지들

## 아키텍처 주요 내용

### API 로더 패턴 (core/loader.py)
- 템플릿 메서드 패턴을 사용하는 추상 기본 클래스 `LostarkLoader` 활용
- `AuctionLoader`는 경매 API 엔드포인트용으로 LostarkLoader 확장
- 특정 로더 (GemAuctionLoader, AmuletAuctionLoader)는 AuctionLoader 확장, 쿼리별 데이터 포함
- JWT 인증을 사용한 HTTP POST 요청으로 컨텐츠 로드
- 파싱된 JSON 응답 반환

### 게임 데이터 모델 (core/accessory.py)
- `Accessory`: 스텟과 각인을 포함하는 단일 악세서리 표현
- `AccessorySetting`: 5개 악세서리 (목걸이 1개, 귀걸이 2개, 반지 2개) 집계 및 계산된 합계 포함
- Python의 `Counter` 타입으로 여러 스텟 및 각인 추적
- 악세서리 품질 검증 (0-100) 및 설정 구조 검증 (정확히 5개 아이템)
- 각인 활성화 임계값 (레벨당 5포인트 필요, 최소 3레벨)

## 웹서비스 아키텍처

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

### 데이터 흐름

```
사용자가 Streamlit UI에서 캐릭터 이름 입력
    ↓
Streamlit이 FastAPI에 GET /api/character/{name} 요청
    ↓
FastAPI가 SQLite 데이터베이스에 캐시 확인
    ↓
캐시 없으면:
  1. core/loader.py로 로스트아크 공식 API 호출
  2. 데이터를 core 모델로 구조화 (accessory.py)
  3. app/services/character.py에서 웹 응답 형식으로 변환
  4. SQLite에 캐싱
    ↓
캐시된 데이터 또는 새 데이터를 JSON으로 반환
    ↓
Streamlit이 결과를 웹페이지에 시각화
```

### 각 계층의 책임

**Core 계층** (`core/`)
- 로스트아크 API와의 직접 통신
- 게임 데이터 모델 정의 (Accessory, AccessorySetting 등)
- 다른 계층과 독립적으로 재사용 가능

**백엔드 계층** (`app/`)
- FastAPI로 REST API 제공
- 비즈니스 로직 구현 (조회, 구조화, 데이터 변환)
- SQLite를 통한 데이터 캐싱
- 웹 요청 검증 및 에러 처리

**UI 계층** (`ui/`)
- Streamlit으로 사용자 인터페이스 제공
- 백엔드에서 데이터를 받아 시각화
- 사용자 입력 처리 및 폼 관리

## 주요 의존성

- `fastapi`: REST API 프레임워크
- `uvicorn`: ASGI 서버 (FastAPI 실행용)
- `streamlit`: 웹 UI 프레임워크
- `requests`: HTTP 클라이언트 (API 호출)
- `sqlalchemy`: ORM (데이터베이스 관리)
- `python-dotenv`: 환경변수 관리 (.env 파일)
- `json`, `enum`, `typing`: 내장 모듈 (파싱, 타입 힌트 등)

## 코드 실행

### JWT 토큰 설정 (필수)

로스트아크 공식 개발자 포털(https://developer.game.onstove.com/)에서 발급받은 JWT 토큰을 다음 중 **하나** 이상의 방법으로 설정하세요:

#### 방법 1: `.env` 파일 (권장 - 로컬 개발용)
```bash
# 프로젝트 루트에 .env 파일 생성
echo "LOSTARK_JWT=your_jwt_token_here" > .env
```

#### 방법 2: 환경변수 (권장 - 서버 배포용)
```bash
export LOSTARK_JWT=your_jwt_token_here
```

#### 방법 3: `_secret/JWT.txt` 파일 (레거시, 하위호환성)
```bash
mkdir -p _secret
echo "your_jwt_token_here" > _secret/JWT.txt
```

**⚠️ 보안 주의사항:**
- JWT 토큰은 **절대 git에 커밋하면 안 됩니다**
- `.env` 파일은 이미 `.gitignore`에 제외됨
- `_secret/` 디렉토리도 이미 `.gitignore`에 제외됨
- 노출된 토큰은 로스트아크 개발자 포털에서 즉시 무효화하세요

### 사용 예제
```python
# 경매 로더 테스트
from core.loader import AmuletAuctionLoader
loader = AmuletAuctionLoader(character_class="건슬링어")
result = loader.load()

# test/LostarkLoader.py에서 - 캐릭터 데이터, 카드, 뉴스 조회 예제 제공
```

### 테스트 실행
프로젝트는 Jupyter 노트북을 테스트에 사용합니다:
```bash
jupyter notebook test/test.ipynb
```

직접 Python 스크립트 실행:
```bash
python core/loader.py  # 아뮬렛 경매 로더 예제 실행
python test/LostarkLoader.py  # 캐릭터/카드 조회 예제 실행
```

## 다음 단계 (우선순위)

1. **FastAPI 백엔드 기초 구현** (`app/main.py`)
   - 간단한 테스트 엔드포인트부터 시작
   - `GET /api/character/{character_name}` 엔드포인트 구현
   - `GET /api/health` 헬스 체크 엔드포인트

2. **비즈니스 로직 구현** (`app/services/character.py`)
   - `core/loader.py`의 로더를 사용해 데이터 조회
   - 로스트아크 API 응답을 `Accessory`, `AccessorySetting` 모델로 변환
   - 웹 응답용 dict/JSON 형식으로 구조화

3. **SQLite 캐싱** (`app/database.py`)
   - SQLAlchemy를 사용한 데이터베이스 모델 정의
   - 조회 결과를 DB에 저장하는 로직
   - 재조회 시 캐시 우선 사용 (성능 개선)

4. **Streamlit UI 구축** (`ui/app.py`, `ui/pages/`)
   - `character_search.py`: 캐릭터 검색 페이지
   - `equipment_view.py`: 장비 정보 상세 페이지
   - FastAPI 백엔드와 통신하여 결과 표시

5. **고급 기능들**
   - 여러 캐릭터 비교
   - 조회 히스토리 및 통계
   - 캐시 갱신 옵션

## 일반적인 개발 작업

### Core 계층 작업
- **새로운 API 로더 추가**: `LostarkLoader` 확장, 해당 엔드포인트와 데이터 포맷 정의
- **게임 열거형 추가**: `engrave.py` 또는 `status.py` 열거형에 항목 추가
- **악세서리 로직 수정**: `core/accessory.py`의 `Accessory` 또는 `AccessorySetting` 클래스 업데이트

### 백엔드 작업
- **새로운 FastAPI 엔드포인트 추가**: `app/main.py`에서 라우트 정의
- **비즈니스 로직 추가**: `app/services/character.py`에 새로운 함수 추가
- **데이터베이스 모델 추가**: `app/database.py`에 새로운 테이블 정의

### UI 작업
- **새로운 페이지 추가**: `ui/pages/`에 새로운 `.py` 파일 생성
- **UI 컴포넌트 추가**: Streamlit의 `st.` API 사용하여 UI 구성
- **데이터 시각화**: Streamlit의 차트 및 테이블 기능 활용

## 코드 실행

### 백엔드 실행
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API 문서: http://localhost:8000/docs

### 프론트엔드 실행
```bash
streamlit run ui/app.py
```
웹 UI: http://localhost:8501

## 개발 환경 설정

### 필수
- Python 3.8+
- 모든 의존성: `pip install -r requirements.txt`
- 로스트아크 공식 API JWT 토큰 (`.env` 파일)

### 추천
- Jupyter Notebook (개발/테스트용)
- `venv` 또는 `conda` (가상환경)
- IDE: VS Code, PyCharm 등
