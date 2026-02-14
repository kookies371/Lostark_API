# 로스트아크 Armories API 구조

## 엔드포인트 목록

기본 URL: `https://developer-lostark.game.onstove.com`

| HTTP | 엔드포인트 | 응답 키 | 설명 |
|------|-----------|---------|------|
| GET | `/armories/characters/{name}` | 전체 통합 | 아래 모든 항목을 한번에 반환 |
| GET | `/armories/characters/{name}/profiles` | `ArmoryProfile` | 기본 스텟, 성향, 전투력 |
| GET | `/armories/characters/{name}/equipment` | `ArmoryEquipment` | 장비 (무기, 방어구, 악세서리) |
| GET | `/armories/characters/{name}/avatars` | `ArmoryAvatars` | 아바타 |
| GET | `/armories/characters/{name}/combat-skills` | `ArmorySkills` | 전투 스킬, 트라이포드, 룬 |
| GET | `/armories/characters/{name}/engravings` | `ArmoryEngraving` | 각인 |
| GET | `/armories/characters/{name}/cards` | `ArmoryCard` | 카드 세팅 |
| GET | `/armories/characters/{name}/gems` | `ArmoryGem` | 보석 |
| GET | `/armories/characters/{name}/colosseums` | `ColosseumInfo` | 증명의 전장 |
| GET | `/armories/characters/{name}/collectibles` | `Collectible[]` | 수집품 |
| GET | `/armories/characters/{name}/arkpassive` | `ArkPassive` | 아크 패시브 |
| GET | `/armories/characters/{name}/arkgrid` | `ArkGrid` | 아크 그리드 |

## 모델 계층 구조

```
ArmoryProfile
├── Stat[]              (치명, 특화, 신속 등)
├── Tendency[]          (지성, 담력, 매력, 친절)
└── Decoration          (칭호 장식)

ArmoryEquipment[]
└── Tooltip (JSON 문자열 → 파싱 필요)

ArmorySkill[]
├── SkillTripod[]
└── SkillRune

ArmoryEngraving
├── Engraving[]
├── EngravingEffect[]
└── ArkPassiveEffect[]

ArmoryCard
├── Card[]
└── CardEffect[]
    └── Effect[]

ArmoryGem
├── Gem[]
└── ArmoryGemEffect[]
    └── GemEffect[]

ColosseumInfo
└── Colosseum[]
    ├── AggregationTeamDeathMatchRank
    ├── AggregationTeamDeathMatch
    ├── AggregationElimination
    ├── Aggregation
    └── AggregationOneDeathmatch

Collectible[]
└── CollectiblePoint[]

ArkPassive
├── ArkPassivePoint[]
└── ArkPassiveEffectSkill[]

ArkGrid
└── ArkGridSlot[]
    ├── ArkGridGem
    └── ArkGridEffect[]
```

## 인증

모든 요청에 다음 헤더 필요:
```
Accept: application/json
Authorization: bearer {JWT}
```

## 참고사항

- 통합 엔드포인트(`/armories/characters/{name}`)를 호출하면 개별 호출 없이 전체 데이터를 한번에 받아올 수 있음
- `filters` 쿼리 파라미터로 원하는 항목만 선택 가능 (예: `?filters=profiles+equipment+cards`)
- 캐릭터 이름은 URL 인코딩 필요 (`urllib.parse.quote()`)
- 장비/보석 등의 `Tooltip` 필드는 JSON 문자열이므로 추가 파싱 필요
