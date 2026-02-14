import json
import requests
from abc import *
from typing import Optional

from ..utils import get_JWT


class LostarkLoader(metaclass=ABCMeta):
    BASE_URL = "https://developer-lostark.game.onstove.com"

    def __init__(self):
        self.JWT = get_JWT()

        self.url = None
        self.headers = {
            "accept": "application/json",
            "authorization": f"bearer {self.JWT}",
        }
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
            response = requests.get(url=self.url, headers=self.headers)
        elif self.method == "post":
            response = requests.post(
                url=self.url, headers=self.headers, data=str(self.data).encode()
            )
        else:
            raise ValueError(f"지원하지 않는 HTTP 메서드: {self.method}")

        if (response_code := response.status_code) != 200:
            raise ValueError(f"API response error (error code = {response_code})")

        content = json.loads(response.content)
        return content

    @abstractmethod
    def load(self, *args, **kwargs):
        """
        API에서 데이터를 로드합니다.

        Args:
            *args: 로더별 위치 인자
            **kwargs: 로더별 키워드 인자
        """
        pass

    @abstractmethod
    def preprocess(self, response):
        pass
