from config import ENV_LOCAL_PATH


def get_JWT():
    """
    .env.local 파일에서 JWT 토큰을 로드합니다.

    Returns:
        str: JWT 토큰

    Raises:
        FileNotFoundError: .env.local 파일을 찾을 수 없을 때 발생
        ValueError: JWT가 비어있을 때 발생
    """
    env_local_path = ENV_LOCAL_PATH

    if not env_local_path.exists():
        raise FileNotFoundError(
            f".env.local 파일을 찾을 수 없습니다. "
            f"경로: {env_local_path}\n"
            f"프로젝트 루트에 .env.local 파일을 생성하고 "
            f"LOSTARK_JWT=<token> 형식으로 작성하세요."
        )

    with open(env_local_path) as f:
        for line in f:
            if line.startswith('LOSTARK_JWT='):
                jwt = line.split('=', 1)[1].strip()
                if jwt:
                    return jwt

    raise ValueError(
        ".env.local 파일에서 LOSTARK_JWT를 찾을 수 없습니다. "
        "LOSTARK_JWT=<token> 형식으로 작성하세요."
    )


def get_test_character_name():
    """
    .env.local 파일에서 TEST_CHARACTER_NAME을 로드합니다.

    Returns:
        str: 테스트에 사용할 캐릭터 이름

    Raises:
        FileNotFoundError: .env.local 파일을 찾을 수 없을 때 발생
        ValueError: TEST_CHARACTER_NAME이 없을 때 발생
    """
    env_local_path = ENV_LOCAL_PATH

    if not env_local_path.exists():
        raise FileNotFoundError(
            f".env.local 파일을 찾을 수 없습니다. "
            f"경로: {env_local_path}\n"
            f"프로젝트 루트에 .env.local 파일을 생성하고 "
            f"TEST_CHARACTER_NAME=<character_name> 형식으로 작성하세요."
        )

    with open(env_local_path) as f:
        for line in f:
            if line.startswith('TEST_CHARACTER_NAME='):
                test_char = line.split('=', 1)[1].strip()
                if test_char:
                    return test_char

    raise ValueError(
        ".env.local 파일에서 TEST_CHARACTER_NAME을 찾을 수 없습니다. "
        "TEST_CHARACTER_NAME=<character_name> 형식으로 작성하세요."
    )