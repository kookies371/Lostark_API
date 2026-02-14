"""
로스트아크 API 호출 테스트

실행 방법:
    pytest test/test_api_call.py -v
    pytest test/test_api_call.py -v -s  (상세 출력)

테스트 캐릭터 설정:
    .env.local 파일에 TEST_CHARACTER_NAME 환경변수 추가
    예: TEST_CHARACTER_NAME=your_character_name
"""

from core.loaders import CharacterLoader
from core.utils import get_test_character_name


def test_api_call_target_character():
    """테스트 캐릭터 조회 API 호출 테스트"""
    character_name = get_test_character_name()
    loader = CharacterLoader()
    result = loader.load(character_name=character_name)

    # 1. API 응답이 리스트 형식인지 확인
    assert isinstance(result, list), f"응답이 리스트가 아닙니다. 타입: {type(result)}"
    assert len(result) > 0, "조회 결과가 없습니다"

    # 2. 조회된 캐릭터 정보에 필수 필드가 있는지 확인
    required_fields = [
        "CharacterName",
        "CharacterClassName",
        "CharacterLevel",
        "ItemAvgLevel",
        "ServerName",
    ]

    for character in result:
        for field in required_fields:
            assert field in character, (
                f"필수 필드 '{field}'가 없습니다. "
                f"캐릭터: {character.get('CharacterName')}"
            )

    # 3. 조회된 캐릭터 중에 TEST_CHARACTER_NAME가 있는지 확인
    character_found = any(
        char.get("CharacterName") == character_name for char in result
    )
    assert character_found, (
        f"조회 결과에 '{character_name}' 캐릭터가 없습니다. "
        f".env.local에서 TEST_CHARACTER_NAME을 확인하세요. "
        f"조회된 캐릭터: {[char.get('CharacterName') for char in result]}"
    )

