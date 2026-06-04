# The Coward King - Gameplay Changes

## Current Gameplay Flow

The prototype now uses a three-level structure. Each level has three escalating hordes followed by a boss fight.

- Level 1: Catacombs - Skeletons and Skeleton King
- Level 2: Ogre Dungeon - Ogres and Ogre Boss
- Level 3: Brave King's Castle - Elite Warriors and Brave King

The main goal of each horde is survival. The player does not need to defeat every enemy. When the turn limit is reached, the King escapes and remaining enemies disappear before the next encounter starts.

## Level 1 Hordes

Level 1 introduces the core loop with slower skeleton enemies.

| Encounter | Turns | Enemies Per Spawn | Max Enemies | Spawn Edges | Obstacles |
| --- | ---: | ---: | ---: | --- | ---: |
| Horde 1 | 18 | 1 | 8 | Top | 0 |
| Horde 2 | 24 | 1 | 10 | Top, Left, Right | 2 |
| Horde 3 | 30 | 2 | 12 | Top, Left, Right, Bottom | 4 |
| Boss | Until boss dies | Boss only | Boss | Top | 0 |

## Level 2 Hordes

Level 2 raises difficulty with tankier ogres. The challenge is not speed, but how long enemies survive and how much damage they deal.

| Encounter | Turns | Enemies Per Spawn | Max Enemies | Spawn Edges | Obstacles |
| --- | ---: | ---: | ---: | --- | ---: |
| Horde 1 | 20 | 1 | 7 | Top, Left | 2 |
| Horde 2 | 26 | 1 | 9 | Top, Left, Right | 4 |
| Horde 3 | 32 | 2 | 10 | Top, Left, Right, Bottom | 6 |
| Boss | Until boss dies | Boss + summons | Boss | Top, Left, Right | 0 |

## Level 3 Hordes

Level 3 raises difficulty with faster Elite Warriors. These enemies have speed 2, so they can move up to two tiles in one enemy phase if their path is open.

| Encounter | Turns | Enemies Per Spawn | Max Enemies | Spawn Edges | Obstacles |
| --- | ---: | ---: | ---: | --- | ---: |
| Horde 1 | 20 | 1 | 8 | Top, Left, Right | 2 |
| Horde 2 | 28 | 2 | 10 | Top, Left, Right, Bottom | 3 |
| Horde 3 | 34 | 2 | 12 | Top, Left, Right, Bottom | 4 |
| Boss | Until boss dies | Boss + summons | Boss | Top, Left, Right | 0 |

## Victory And Defeat

Horde victory happens when the player survives the required number of turns.

Boss victory happens when the current level boss is defeated. After a boss victory, the next Continue starts the next level. After Level 3 is cleared, the prototype restarts from Level 1.

Defeat still uses the safe zone rule:

- Normal enemy inside the 3x3 safe zone counts as 1 pressure.
- Boss inside the safe zone counts as 2 pressure.
- If safe zone pressure reaches 2 or more, the player loses.

The player also loses immediately if the Desperation meter reaches 4.

## Bosses

Each boss occupies 2x2 tiles, counts as 2 safe zone pressure, summons a stronger enemy every 2 turns, and advances toward the King every 2 turns.

Level 1 boss: Skeleton King

- HP: 500
- Damage: 30
- Speed: 1
- Summon: Skeleton Vanguard

Level 2 boss: Ogre Boss

- HP: 350
- Damage: 40
- Speed: 1
- Summon: Ogre Brute

Level 3 boss: Brave King

- HP: 500
- Damage: 50
- Speed: 1
- Summon: Royal Elite

The boss uses the same basic attack logic as enemies, but it is larger and only advances every second turn. If any part of its 2x2 body enters the safe zone, it counts as 2 pressure and immediately overloads the safe zone.

## Action Points

The prototype now uses a strict AP cap.

- Starting AP: 5
- Max AP: 5
- If the King does not move, the player gains 1 AP at the next turn.
- AP cannot go above 5.
- If the King moves, no AP is gained that turn.

## Desperation

The Desperation meter forces the player to move the King instead of hiding permanently behind allies.

- Desperation starts at 0.
- Each player turn where the King does not move increases Desperation by 1.
- Moving the King resets Desperation to 0.
- At 4 Desperation, the player loses immediately.
- The right side of the screen shows the current Desperation face using `Cara0.png` through `Cara4.png`.

## Horde Attack Order

Horde 1 keeps the easier tutorial-like resolution order:

1. Allies attack.
2. Enemies attack and move.

Starting in Horde 2, and during boss fights, enemies act first:

1. Enemies attack and move.
2. Allies attack.

## Hand Management

Level 1 Horde 1 starts with 3 random cards.

After the first horde, the hand size becomes 4 cards. When the player wins a horde, they must choose 1 card from the previous hand to keep before the next encounter starts. The rest of the hand is filled with new random cards.

Cards remain reusable during the horde. Playing a card does not remove it from the hand, but every use still costs AP. A card is only disabled when the player does not have enough AP, the game is not in the player phase, or the encounter is not actively playing.

## Active Card Pool

The current prototype card pool was reduced to the cards below. These are the cards used by the fallback `cardPool` in `js/constants.js` and shown in the main menu tutorial.

| Card | Type | AP | HP | Damage | Image | Current behavior |
| --- | --- | ---: | ---: | ---: | --- | --- |
| Knight | Ally / Attack | 3 | 80 | 30 | `Assets/cards/Knight.png` | Melee ally. Attacks adjacent enemies. |
| Archer | Ally / Ranged | 2 | 50 | 20 | `Assets/cards/Archer.png` | Stationary ranged ally. Range 3. |
| Wall | Ally / Defense | 3 | 150 | 0 | `Assets/cards/Wall.png` | Blocks a tile and absorbs attacks. |
| Decoy | Ally / Defense | 2 | 80 | 0 | `Assets/cards/Decoy.png` | Draws enemies toward it. No attack. |
| Exile | Trap | 2 | - | - | `Assets/cards/Exile.png` | Stuns an enemy for 2 turns. |
| Bomb | Zone | 4 | - | 40 | `Assets/cards/Bomb.png` | Explodes on placement. Deals damage to enemies in a 3x3 area. |
| Peace Treaty | Zone | 2 | - | - | `Assets/cards/Peace Treaty.png` | 3x3 zone. Freezes enemies each turn for 4 turns. |
| Royal Curse | Zone | 3 | - | - | `Assets/cards/Royal Curse.png` | 3x3 zone. Reduces enemy damage to allies by 50% for 5 turns. |

The SQL files still contain the broader historical/GDD card list, including cards such as Mage, Pikeman, Squire, Tower, Guardian, Royal Guard, and Trench. Those cards are not part of the reduced prototype fallback pool right now. The SQL was reviewed for reference only and was not modified in this update.

## Enemy Spawns

Enemy spawn locations now scale with horde difficulty.

- Early horde: enemies spawn only from the top.
- Mid horde: enemies can spawn from top, left, and right.
- Late horde: enemies can spawn from any board edge.

Enemies do not spawn inside the safe zone or on occupied tiles.

## Level Differences

Level 1 is the tutorial-style pressure curve. Skeletons are weaker and slower, and Horde 1 lets allies attack before enemies.

Level 2 focuses on durability. Ogres have more HP and damage, so the player must commit more AP and card placements to stop each threat.

Level 3 focuses on tempo. Elite Warriors have speed 2, forcing the player to move the King and react earlier because enemies can close distance much faster.

The background image changes per level:

- Level 1: `Assets/Level1.png`
- Level 2: `Assets/Level2.png`
- Level 3: `Assets/Level3.png`

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
