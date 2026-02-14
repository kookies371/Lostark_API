# 로스트아크 캐릭터 정보 조회 웹서비스

로스트아크 게임에서 **캐릭터 이름을 입력하면 캐릭터의 기본 정보, 장비, 카드 정보를 웹에서 간편하게 조회**할 수 있는 서비스입니다.

## 🚀 빠른 시작

### 1단계: 설치

```bash
# 저장소 클론 또는 압축 해제
cd Lostark_API

# 의존성 설치
pip install -r requirements.txt
```

### 2단계: JWT 토큰 설정

로스트아크 공식 개발자 포털(https://developer.game.onstove.com/)에서 JWT 토큰을 발급받고 다음과 같이 설정하세요:

**프로젝트 루트에 `.env.local` 파일 생성:**
```
LOSTARK_JWT=your_jwt_token_here
```

**⚠️ 주의:** `.env.local` 파일은 git에 업로드되지 않으므로 안전합니다. 토큰이 노출되면 개발자 포털에서 즉시 무효화하세요.

### 3단계: 실행

**백엔드 (FastAPI) 실행:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API 문서: http://localhost:8000/docs
- API 주소: http://localhost:8000

**프론트엔드 (Streamlit) 실행 (별도 터미널):**
```bash
streamlit run ui/app.py
```
- 웹 UI: http://localhost:8501

## 📖 사용 방법

1. Streamlit UI (http://localhost:8501)에서 캐릭터 이름 입력
2. "검색" 버튼 클릭
3. 캐릭터의 다음 정보를 확인:
   - ✅ 기본 정보 (이름, 클래스, 레벨, 아이템 레벨)
   - ✅ 장비 정보 (악세서리, 각인, 스텟)
   - ✅ 카드 정보
   - ✅ 동일 계정의 다른 캐릭터 목록

## 🧪 테스트 실행

API가 정상 작동하는지 테스트하려면:

```bash
# pytest 설치 확인
pip install pytest

# 테스트 실행
pytest test/test_api_call.py -v
```

## 🛠️ 기술 스택

| 계층 | 기술 | 설명 |
|------|------|------|
| **백엔드** | FastAPI | REST API 서버 |
| **프론트엔드** | Streamlit | 웹 UI |
| **API 통신** | requests | HTTP 클라이언트 |
| **데이터 캐싱** | SQLite | 조회 결과 캐싱 |
| **ORM** | SQLAlchemy | 데이터베이스 관리 |

## 🐛 문제 해결

**Q: "JWT 토큰을 찾을 수 없습니다" 에러가 발생합니다**
- A: `.env.local` 파일이 프로젝트 루트에 있고 `LOSTARK_JWT=your_token_here` 형식으로 작성되었는지 확인하세요

**Q: Streamlit에서 "연결할 수 없습니다" 에러가 발생합니다**
- A: FastAPI 백엔드가 실행 중인지 확인하세요 (http://localhost:8000/docs 접속 가능한지 확인)

**Q: API 응답이 너무 느립니다**
- A: 첫 조회는 느릴 수 있습니다. 이후 조회는 SQLite 캐시에서 빠르게 로드됩니다.

## 📚 개발자 문서

개발 환경 설정, 아키텍처, 구조화된 개발 지침은 [CLAUDE.md](CLAUDE.md)를 참고하세요.

## 📄 라이선스

학습 목적으로 작성되었습니다.
