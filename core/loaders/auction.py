from .base import LostarkLoader


class AuctionLoader(LostarkLoader):
    def __init__(
        self,
    ):
        super().__init__()
        self.url = f"{self.BASE_URL}/auctions/items"
        self.headers["Content-Type"] = "application/json"
        self.data = None
        self.method = "post"

    def load(self):
        content = self.load_content()

        return content

    def preprocess(self):
        pass


class GemAuctionLoader(AuctionLoader):
    def __init__(
        self,
        character_class: str = "",
        item_name: str = "",
        item_tier: int = "",  # 얘 0 넣으면 에러 뜸
        item_grade: str = "",
        page_no: int = 0,
    ):
        super().__init__()

        # data
        # if item_tier not in [1, 2, 3]:
        #     raise ValueError("item_tier는 1, 2, 3중 하나이어야 합니다")

        data = {
            "Sort": "BIDSTART_PRICE",  # 경매 시작가로 정렬
            "SortCondition": "ASC",  # 오름차순 정렬
            "CharacterClass": character_class,
            "ItemGrade": item_grade,
            "ItemTier": item_tier,
            "CategoryCode": 210000,
            "PageNo": page_no,
            "ItemName": item_name,
        }
        self.data = str(data)


class AmuletAuctionLoader(AuctionLoader):
    def __init__(
        self,
        character_class: str = "",
        item_name: str = "",
        item_tier: int = "",
        item_grade: str = "",
        page_no: int = 0,
        skill_name: str = "",
        tripod_name: str = "",
    ):
        super().__init__()

        # data
        data = {
            "Sort": "BIDSTART_PRICE",  # 경매 시작가로 정렬
            "SortCondition": "ASC",  # 오름차순 정렬
            # "CharacterClass": character_class,
            "ItemGrade": item_grade,
            "ItemTier": item_tier,
            "CategoryCode": 170300,
            "PageNo": page_no,
            "ItemName": item_name,
            "SkillOptions": [
                {
                    "FirstOption": 38240,
                    "SecondOption": 8,
                    "MinValue": 5,
                },
                {
                    "FirstOption": 38240,
                    # "SecondOption": 8,
                    # "MinValue": 5,
                },
                {
                    "FirstOption": 38240,
                    # "SecondOption": 8,
                    # "MinValue": 5,
                },
                {
                    "FirstOption": 38240,
                    # "SecondOption": 8,
                    # "MinValue": 5,
                },
            ],
        }
        self.data = str(data)
