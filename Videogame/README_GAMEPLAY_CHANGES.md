# The Coward King - Gameplay Changes

## Current Gameplay Flow

The prototype now uses a Level 1 structure with three escalating hordes followed by a boss fight.

- Level 1: Catacombs
- Horde 1: survive 18 turns
- Horde 2: survive 24 turns
- Horde 3: survive 30 turns
- Boss Fight: defeat the Skeleton King

The main goal of each horde is survival. The player does not need to defeat every enemy. When the turn limit is reached, the King escapes and remaining enemies disappear before the next encounter starts.

## Hordes

Each horde has its own difficulty settings:

| Encounter | Turns | Enemies Per Spawn | Max Enemies | Spawn Edges | Obstacles |
| --- | ---: | ---: | ---: | --- | ---: |
| Horde 1 | 18 | 1 | 8 | Top | 0 |
| Horde 2 | 24 | 1 | 10 | Top, Left, Right | 2 |
| Horde 3 | 30 | 2 | 12 | Top, Left, Right, Bottom | 4 |
| Boss | Until boss dies | Boss only | Boss | Top | 0 |

## Victory And Defeat

Horde victory happens when the player survives the required number of turns.

Boss victory happens when the Skeleton King is defeated.

Defeat still uses the safe zone rule:

- Normal enemy inside the 3x3 safe zone counts as 1 pressure.
- Boss inside the safe zone counts as 2 pressure.
- If safe zone pressure reaches 2 or more, the player loses.

## Boss

The Level 1 boss is the Skeleton King.

Current boss stats:

- HP: 200
- Damage: 30
- Speed: 1
- Size: 2x2 tiles
- Movement: advances toward the King every 3 turns
- Summon: creates one Skeleton Vanguard every 3 turns
- Safe zone pressure: 2

The boss uses the same basic attack logic as enemies, but it is larger and only advances every third turn. If any part of its 2x2 body enters the safe zone, it counts as 2 pressure and immediately overloads the safe zone.

The boss summon is the Skeleton Vanguard:

- HP: 80
- Damage: 22
- Speed: 1

## Action Points

The prototype now uses a strict AP cap.

- Starting AP: 7
- Max AP: 7
- If the King does not move, the player gains 1 AP at the next turn.
- AP cannot go above 7.
- If the King moves, no AP is gained that turn.

## Hand Management

The current hand size is fixed at 3 cards.

Cards remain reusable during the horde. This keeps the prototype simple while still forcing AP-based decisions.

## Enemy Spawns

Enemy spawn locations now scale with horde difficulty.

- Early horde: enemies spawn only from the top.
- Mid horde: enemies can spawn from top, left, and right.
- Late horde: enemies can spawn from any board edge.

Enemies do not spawn inside the safe zone or on occupied tiles.

## Procedural Obstacles

Each horde generates random irremovable obstacles. Boss fights do not generate obstacles so the 2x2 boss has enough room to enter and move.

Obstacles:

- Block movement.
- Block card placement.
- Cannot be damaged or destroyed.
- Do not appear inside the safe zone.
- Do not appear on board edges, so spawn lanes stay open.

This gives each horde a slightly different tactical layout.

## Files Updated

- `js/constants.js`
- `js/entities.js`
- `js/board.js`
- `js/turn.js`
- `js/ui.js`
- `js/renderer.js`
- `js/12_coward_king_prototype.js`
