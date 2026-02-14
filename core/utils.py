import os
import os.path as osp

def get_JWT():
    """
    JWT 토큰을 다음 순서로 로드합니다:
    1. 환경변수 LOSTARK_JWT
    2. .env 파일의 LOSTARK_JWT
    3. _secret/JWT.txt 파일

    Returns:
        str: JWT 토큰

    Raises:
        FileNotFoundError: JWT를 찾을 수 없을 때 발생
        ValueError: JWT가 비어있을 때 발생
    """
    # 1. 환경변수에서 확인
    jwt = os.getenv('LOSTARK_JWT')
    if jwt:
        return jwt.strip()

    # 2. .env 파일에서 로드
    env_path = osp.join(osp.dirname(__file__), '..', '.env')
    if osp.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith('LOSTARK_JWT='):
                    jwt = line.split('=', 1)[1].strip()
                    if jwt:
                        return jwt

    # 3. _secret/JWT.txt에서 로드 (레거시 지원)
    secret_path = osp.join(osp.dirname(__file__), '..', '_secret', 'JWT.txt')
    if osp.exists(secret_path):
        with open(secret_path) as f:
            jwt = f.read().strip()
            if jwt:
                return jwt

    raise FileNotFoundError(
        "JWT 토큰을 찾을 수 없습니다. "
        "다음 중 하나를 설정하세요:\n"
        "1. LOSTARK_JWT 환경변수\n"
        "2. .env 파일에 LOSTARK_JWT=<token> 작성\n"
        "3. _secret/JWT.txt 파일에 토큰 저장"
    )

if __name__ == "__main__":
    print(get_JWT())