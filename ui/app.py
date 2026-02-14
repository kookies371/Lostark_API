"""
Streamlit 웹 UI - 로스트아크 캐릭터 정보 조회

사용자가 캐릭터 이름을 입력하면 FastAPI 백엔드에서
장비 정보를 조회하여 표시합니다.
"""

import streamlit as st
import requests

st.set_page_config(
    page_title="로스트아크 캐릭터 정보 조회",
    page_icon="⚔️",
    layout="wide",
)

st.title("⚔️ 로스트아크 캐릭터 정보 조회")

# FastAPI 백엔드 URL (로컬 개발용)
API_URL = "http://localhost:8000"

# 사이드바에 안내 메시지
with st.sidebar:
    st.markdown("## 📖 사용 방법")
    st.markdown("""
    1. 캐릭터 이름을 입력하세요
    2. 검색 버튼을 클릭하세요
    3. 캐릭터의 장비 정보를 확인하세요
    """)

# 검색 폼
col1, col2 = st.columns([3, 1])

with col1:
    character_name = st.text_input("캐릭터 이름을 입력하세요")

with col2:
    search_button = st.button("🔍 검색")

# 검색 로직
if search_button and character_name:
    try:
        response = requests.get(f"{API_URL}/api/character/{character_name}")
        response.raise_for_status()

        equipment_data = response.json()

        st.success(f"✅ {character_name} 정보를 조회했습니다!")
        st.json(equipment_data)

    except requests.exceptions.ConnectionError:
        st.error("❌ 백엔드 서버에 연결할 수 없습니다. FastAPI가 실행 중인지 확인해주세요.")
    except requests.exceptions.HTTPError as e:
        st.error(f"❌ API 오류: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        st.error(f"❌ 오류 발생: {str(e)}")

elif search_button:
    st.warning("⚠️ 캐릭터 이름을 입력해주세요.")
