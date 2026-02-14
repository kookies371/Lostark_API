import requests
import json
import os
import sys
from urllib import parse
from pprint import pprint

# JWT를 utils 모듈에서 로드
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'core'))
from utils import get_JWT

JWT = get_JWT()

class LostarkLoader():
    def __init__(self, JWT: str):
        self.JWT = JWT
        self.url_header = r"https://developer-lostark.game.onstove.com"
    
    def _get_content_from_url(self, url: str):
        response = requests.get(
            url,
            headers = {
                'accept': 'application/json',
                'authorization': f'bearer {self.JWT}'
            }
        )

        # TODO : check response == 200

        content = json.loads(response.content)
        return content
    
    def _check_validity_of_response(self, respose):
        # if respose is 200
        # elif
        pass
    
    def _post_content_from_url(self, url: str):
        pass

    def get_card(self, character_name: str):
        url = self.url_header + f"/armories/characters/{parse.quote(character_name)}/cards"
        content = self._get_content_from_url(url)

        for card in content['Cards']:
            card['Tooltip'] = json.loads(card['Tooltip'])
        
        return content
    
    def get_characters(self, character_name: str):
        url = self.url_header + f"/characters/{parse.quote(character_name)}/siblings"
        content = self._get_content_from_url(url)

        return content

    def get_auctions(self):
        url = self.url_header + f"/auctions/options"
        content = self._get_content_from_url(url)

        return content

    def get_news(self):
        url = self.url_header + f"/news/events"
        content = self._get_content_from_url(url)

        return content
    
    def post_auctions(self):
        url = self.url_header + f"/auctions/items"
        content = self._get_content_from_url(url)

        return content

Loader = LostarkLoader(JWT=JWT)

with open('./test_output.txt', 'w') as f:
    pprint(Loader.get_auctions(), f)
    
