import json
import requests
from abc import *
from typing import Optional
from pprint import pprint

from utils import *


class LostarkLoader(metaclass=ABCMeta):
    def __init__(self):
        self.JWT = get_JWT()

        self.url = None
        self.headers = None
        self.data = None  # dict
        self.method = None

    def load_content(self):
        """
        only load content from self.url

        Retuns:
            python object from 'reponse.content'

        Raises:
            raise error when reponse != 200
        """
        if self.method == "get":
            pass
        elif self.method == "post":
            response = requests.post(
                url=self.url, headers=self.headers, data=str(self.data).encode()
            )

        if response.status_code != 200:
            # TODO : value error
            raise ValueError("일단 어떤 에러를 띄우는게 맞는지 모르니 ValueError")

        content = json.loads(response.content)
        return content

    @abstractmethod
    def load(self, url):
        pass

    @abstractmethod
    def preprocess(self, response):
        pass


class AuctionLoader(LostarkLoader):
    def __init__(
        self,
    ):
        super().__init__()
        self.url = "https://developer-lostark.game.onstove.com/auctions/items"
        self.headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "authorization": f"bearer {self.JWT}",
        }
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
        item_tier: int = "",
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

    ):
        super().__init__()

        # data
        pass


class AccessoryLoader(AuctionLoader):
    def __init__(self, JWT):
        super().__init__(JWT)

    def load(self, type):
        # 요기 json 다루는 코드가 좀 길~게 필요할 듯
        pass


if __name__ == "__main__":
    gem_loader = GemAuctionLoader(item_tier="")
    pprint(gem_loader.load())
