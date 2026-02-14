from urllib import parse
from core.loaders.base import LostarkLoader


class ArmoryProfileLoader(LostarkLoader):
    """캐릭터 스펙 정보를 조회하는 로더 (장비, 스텟, 각인 등)

    API 필터 목록:
    - profiles: 캐릭터 프로필
    - equipment: 장비
    - avatars: 아바타
    - combat-skills: 전투 스킬
    - engravings: 각인
    - cards: 카드
    - gems: 보석
    - colosseums: 콜로세움
    - collectibles: 수집품
    - arkpassive: 아크 패시브
    - arkgrid: 아크 그리드
    """

    def __init__(self):
        super().__init__()
        self.method = "get"

    def load(self, character_name: str, filters: str | list[str] = "equipment"):
        """
        캐릭터 스펙 정보 조회 (Armory)

        Args:
            character_name: 조회할 캐릭터 이름
            filters: API 필터 (문자열 또는 리스트)
                - 문자열: "equipment" 또는 "equipment+cards"
                - 리스트: ["equipment", "cards"]
                기본값은 "equipment" (장비만 조회)

        Returns:
            캐릭터의 스펙 정보를 포함하는 JSON
        """
        # filters 처리
        filters_str = self._format_filters(filters)

        self.url = f"{self.BASE_URL}/armories/characters/{parse.quote(character_name)}?filters={filters_str}"
        content = self.load_content()
        return content

    def _format_filters(self, filters: str | list[str]) -> str:
        """
        필터를 처리하여 API 쿼리 문자열로 변환

        Args:
            filters: 필터 (문자열 또는 리스트)

        Returns:
            "+"로 join된 소문자 필터 문자열
        """
        if isinstance(filters, str):
            # 문자열인 경우: 쉼표나 공백으로 분리하고 소문자로 변환
            filter_list = [f.strip().lower() for f in filters.replace("+", ",").split(",")]
        elif isinstance(filters, list):
            # 리스트인 경우: 각 항목을 소문자로 변환
            filter_list = [str(f).strip().lower() for f in filters]
        else:
            raise TypeError(f"filters는 str 또는 list 타입이어야 합니다. 받은 타입: {type(filters)}")

        # 빈 문자열 제거 및 "+"로 join
        filter_list = [f for f in filter_list if f]
        return "+".join(filter_list)

    def preprocess(self, response):
        pass