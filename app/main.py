"""
FastAPI 백엔드 - 로스트아크 캐릭터 정보 조회 API

메인 진입점 및 REST API 엔드포인트를 정의합니다.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="로스트아크 캐릭터 정보 API",
    description="로스트아크 캐릭터의 장비 정보를 조회하는 REST API",
    version="0.1.0",
)

# CORS 설정 (Streamlit 프론트엔드에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "ok"}


@app.get("/api/character/{character_name}")
async def get_character_equipment(character_name: str):
    """
    캐릭터 장비 정보 조회

    Args:
        character_name: 조회할 캐릭터 이름

    Returns:
        캐릭터의 장비 정보 (구조화된 JSON)
    """
    # TODO: 구현 예정
    return {
        "character_name": character_name,
        "status": "구현 예정",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
