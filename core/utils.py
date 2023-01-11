import os
import os.path as osp

def get_JWT():
    with open("_secret/JWT.txt") as f:
        JWT = f.read()
    
    return JWT

if __name__ == "__main__":
    print(get_JWT())