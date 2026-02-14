"""
프로젝트 전역 설정 및 경로 관리
"""
from pathlib import Path

# 프로젝트 루트 디렉토리
PROJECT_ROOT = Path(__file__).resolve().parent

# 주요 디렉토리
CORE_DIR = PROJECT_ROOT / 'core'
APP_DIR = PROJECT_ROOT / 'app'
UI_DIR = PROJECT_ROOT / 'ui'
TEST_DIR = PROJECT_ROOT / 'test'
DOCS_DIR = PROJECT_ROOT / 'docs'

# 환경 설정
ENV_LOCAL_PATH = PROJECT_ROOT / '.env.local'
