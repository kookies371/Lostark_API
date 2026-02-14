from urllib import parse
from core.loaders.base import LostarkLoader


class CharacterLoader(LostarkLoader):
    """캐릭터 기본 정보를 조회하는 로더"""

    def __init__(self):
        super().__init__()
        self.method = "get"

    def load(self, character_name: str):
        """
        캐릭터 정보 조회

        Args:
            character_name: 조회할 캐릭터 이름
        """
        self.url = f"{self.BASE_URL}/characters/{parse.quote(character_name)}/siblings"
        content = self.load_content()
        return content

    def preprocess(self, response):
        pass


class CardLoader(LostarkLoader):
    """캐릭터 카드 정보를 조회하는 로더"""

    def __init__(self):
        super().__init__()
        self.method = "get"

    def load(self, character_name: str):
        """
        카드 정보 조회

        Args:
            character_name: 조회할 캐릭터 이름
        """
        import json

        self.url = f"{self.BASE_URL}/armories/characters/{parse.quote(character_name)}/cards"
        content = self.load_content()

        # Tooltip을 JSON으로 파싱
        for card in content.get("Cards", []):
            if "Tooltip" in card:
                card["Tooltip"] = json.loads(card["Tooltip"])

        return content

    def preprocess(self, response):
        pass
