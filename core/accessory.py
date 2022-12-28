from enum import Enum
from typing import Optional, List
from collections import Counter

from status import Status
from engrave import Engrave


class AccessoryType(Enum):
    NECKLACE = 1
    EARRINGS = 2
    RING = 3


class Accessory:
    def __init__(
        self,
        name: str,
        type: AccessoryType,
        quality: int,
        stats: Counter[Status, int],
        buff_engraves: Counter[Engrave, int],
        nerf_engraves: Counter[Engrave, int],
    ):
        # value check
        if not (0 <= quality <= 100):
            raise ValueError("품질은 0 이상 100 이하이어야 합니다")

        # run
        self.name: str = name
        self.type: AccessoryType = type
        self.quality: int = quality
        self.stats: Counter[Status, int] = stats
        self.buff_engraves: Counter[Engrave, int] = buff_engraves
        self.nerf_engraves: Counter[Engrave, int] = nerf_engraves
    
    def __str__(self):
        pass
    

class AccessorySetting:
    def __init__(self, accessories: List[Optional[Accessory]]):
        # value check
        if len(accessories) != 5:
            raise ValueError("악세 세팅의 크기는 5개이어야 합니다")

        # run
        self.accessories = accessories
        self.necklace: List[Optional[Accessory]] = accessories[0]
        self.earrings: List[Optional[Accessory]] = accessories[1:3]
        self.rings: List[Optional[Accessory]] = accessories[3:5]

        # total informations
        self.total_stats: Counter[Status, int] = sum(
            [acc.stats for acc in accessories], start=Counter()
        )
        self.total_buff_engraves: Counter[Engrave, int] = sum(
            [acc.buff_engraves for acc in accessories], start=Counter()
        )
        self.total_nerf_engraves: Counter[Engrave, int] = sum(
            [acc.nerf_engraves for acc in accessories], start=Counter()
        )

        self.activated_buff_engraves: Counter[Engrave, int] = Counter(
            {
                engrave: max(3, val // 5)
                for engrave, val in self.total_buff_engraves.items()
            }
        )
        self.activated_nerf_engraves: Counter[Engrave, int] = Counter(
            {
                engrave: max(3, val // 5)
                for engrave, val in self.total_nerf_engraves.items()
            }
        )
