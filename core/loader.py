import json
import requests
from abc import *


class Loader(metaclass=ABCMeta):
    def __init__(self, JWT):
        self.JWT = JWT

        self.url = None
        self.headers = None
        self.data = None

    @abstractmethod
    def load(self, url):
        pass

    @abstractmethod
    def preprocess(self, response):
        pass


class AuctionLoader(Loader):
    def __init__(self, JWT):
        super().__init__(JWT)
        self.url = "https://developer-lostark.game.onstove.com/auctions/items"
        self.headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "authorization": f"bearer {self.JWT}",
        }
        self.data_json = json.loads("{}")  # empty json object


class AccessoryLoader(AuctionLoader):
    def __init__(self, JWT):
        super().__init__(JWT)

    def load(self, type):
        # 요기 json 다루는 코드가 좀 길~게 필요할 듯
        pass
