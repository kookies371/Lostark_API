import requests
import json
from urllib import parse
from pprint import pprint


JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDEwNTcifQ.qS72PJC-K_pjvzEvF52Tf_cFe-z5Y45LlAUNOnNxQS7oM5gg7UQeOBONK7qheYRpD5I-xPy_vd53ZbnkVBQ_p7TJiqaPVNxbMKA_tiCOl2i6hGv7wBhPz02ZGOo3xjxYWYTBReG05pYtLS3RUEJmTLI2dzcSWUPHmHHhc8jPIe2K7JNsR8zxb4JO2QW6Y0uFgC_EgXm77X4MC28idTdEZTv_3Kh66knd4hV6w1O59SfajTMyOyDkZyheEJTIt-OAOHYBPxA1D3OLwlTBIapwz1Zmt3_Qwl_0munJEWWF8yaAazKhA6juOnlm_FxL1QoP2Hw9dbjVCabn5wUJNxq7eQ'

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
    
