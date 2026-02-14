from urllib import parse
from .base import LostarkLoader


class ArmoryProfileLoader(LostarkLoader):
    """캐릭터 스펙 정보를 조회하는 로더 (장비, 스텟, 각인 등)"""

    def __init__(self):
        super().__init__()
        self.method = "get"

    def load(self, character_name: str):
        """
        캐릭터 스펙 정보 조회 (Armory)

        Args:
            character_name: 조회할 캐릭터 이름

        Returns:
            캐릭터의 장비, 스텟, 각인 정보 등을 포함하는 JSON
        """
        # API 필터: profiles(프로필), equipment(장비), avatars(아바타),
        # combat-skills(전투스킬), engravings(각인), cards(카드),
        # gems(보석), colosseums(콜로세움), collectibles(수집품),
        # arkpassive(아크패시브), arkgrid(아크그리드)
        # filters = "profiles+equipment+avatars+combat-skills+engravings+cards+gems+colosseums+collectibles+arkpassive+arkgrid"
        filters = "equipment"
        self.url = f"{self.BASE_URL}/armories/characters/{parse.quote(character_name)}?filters={filters}"
        content = self.load_content()
        return content

    def preprocess(self, response):
        pass