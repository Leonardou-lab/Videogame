# The Coward King - Music Tracks

Place the level music files in this folder using these exact names:

| Level | File | Theme direction |
| --- | --- | --- |
| Level 1 - Catacombs | `level1-skeletons.mp3` | Medieval catacomb ambience, bones, low drums, skeletal march. |
| Level 2 - Ogre Dungeon | `level2-ogres.mp3` | Heavy medieval percussion, deep dungeon rhythm, brutish ogre pressure. |
| Level 3 - Brave King's Castle | `level3-royal.mp3` | Royal medieval tension, court instruments, final castle/boss feeling. |

The game reads these files from `js/audio.js` and switches tracks automatically when the current level changes.

Recommended format:

- `.mp3` for easiest browser compatibility.
- Loop-friendly tracks, ideally without a hard ending.
- Similar loudness across all 3 tracks.
