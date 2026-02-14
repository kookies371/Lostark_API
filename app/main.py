"""
FastAPI 백엔드 - 로스트아크 캐릭터 정보 조회 API

메인 진입점 및 REST API 엔드포인트를 정의합니다.
"""

from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from core import CharacterLoader, ArmoryProfileLoader

app = FastAPI(
    title="로스트아크 캐릭터 정보 API",
    description="로스트아크 캐릭터의 장비 정보를 조회하는 REST API",
    version="0.1.0",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static 파일 서빙
static_dir = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
async def root():
    """캐릭터 검색 웹 인터페이스"""
    return FileResponse(static_dir / "index.html")


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok"}


@app.get("/api/expedition/{character_name}")
async def get_character_expedition(character_name: str):
    """
    캐릭터 원정대 정보 조회

    Args:
        character_name: 조회할 캐릭터 이름

    Returns:
        캐릭터의 원정대 정보 (JSON)
    """
    try:
        loader = CharacterLoader()
        result = loader.load(character_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/character/{character_name}")
async def get_character_spec(character_name: str):
    """
    캐릭터 스펙 정보 조회 (장비, 스텟, 각인 등)

    Args:
        character_name: 조회할 캐릭터 이름

    Returns:
        캐릭터의 스펙 정보 (JSON)
    """
    try:
        loader = ArmoryProfileLoader()
        result = loader.load(character_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

