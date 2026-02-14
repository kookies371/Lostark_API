# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 사용할 지침을 제공합니다.

## 문서 작성 언어

이 프로젝트의 모든 문서(README, 주석, 문서 파일 등)는 **한글**로 작성합니다.

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

- **core/**: 백엔드 데이터 모델 및 API 통신 레이어 (개발 중)
  - `loader.py`: 로스트아크 API 호출을 위한 기본 추상 클래스 및 구현체
    - `LostarkLoader`: 추상 기본 클래스
    - `AuctionLoader`: 경매 API 로더
    - `GemAuctionLoader`, `AmuletAuctionLoader`: 특정 아이템 경매 조회용 로더
  - `accessory.py`: 악세서리 데이터 모델 (Accessory, AccessorySetting) - 스텟 및 각인 포함
  - `engrave.py`: 게임 내 모든 각인의 열거형
  - `status.py`: 캐릭터 스텟 속성 열거형
  - `utils.py`: JWT 토큰 관리 등 유틸리티 함수

- **test/**: 테스트 및 프로토타입 코드 (개발 중)
  - `LostarkLoader.py`: API 사용 예제 (캐릭터, 카드, 경매 정보 조회)
  - `CardEffects.py`: 스텁
  - `test.ipynb`: Jupyter 노트북으로 API 테스트

### 아직 구현되지 않은 부분
- **웹 프론트엔드**: HTML, CSS, JavaScript
- **웹 백엔드 프레임워크**: Flask, Django 등의 웹 서버
- **캐릭터 정보 파싱 로직**: API 응답에서 필요한 정보 추출 및 정리
- **데이터베이스**: 캐시 또는 사용자 데이터 저장 (선택사항)

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

## 주요 의존성

- `requests`: API 호출용 HTTP 클라이언트
- `json`: JSON 파싱
- `enum`, `typing`: 타입 힌트 및 열거형

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

1. **캐릭터 정보 조회 로더 구현** (`core/loader.py`)
   - 현재는 경매 API만 있음
   - `CharacterLoader` 클래스 추가: 캐릭터 기본정보, 장비, 카드 정보 조회

2. **웹 백엔드 프레임워크 선택 및 구축**
   - Flask (간단, 학습용) 또는 Django (풀 스택, 구조화된) 추천
   - API 엔드포인트: `/api/character/<name>`, `/api/cards/<name>` 등

3. **웹 프론트엔드 개발**
   - HTML/CSS/JavaScript로 간단한 UI 구현
   - 캐릭터 이름 입력 폼, 정보 표시 페이지

4. **에러 처리 및 검증 강화**
   - 현재 에러 처리 부족
   - 존재하지 않는 캐릭터, API 실패 등에 대한 처리

## 일반적인 개발 작업

- **새로운 API 로더 추가**: `LostarkLoader` 확장, 해당 엔드포인트와 데이터 포맷 정의
- **게임 열거형 추가**: `engrave.py` 또는 `status.py` 열거형에 항목 추가
- **API 응답 테스트**: `test/LostarkLoader.py`에 예제 추가 또는 `test.ipynb` 사용
- **악세서리 로직 수정**: `core/accessory.py`의 `Accessory` 또는 `AccessorySetting` 클래스 업데이트

## 개발 환경 설정

### 필수
- Python 3.8+
- `requests` 라이브러리
- 로스트아크 공식 API JWT 토큰 (`_secret/JWT.txt`)

### 추천
- `Flask` 또는 `Django` (웹 백엔드)
- Jupyter Notebook (개발/테스트)
- `venv` 또는 `conda` (가상환경)
