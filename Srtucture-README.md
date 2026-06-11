# Videogame

## Repository Structure

```
Videogame/
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── custom-issue.md
├── .gitignore
├── README.md
├── TheCowardKing-GDD.md
├── TheCowardKing-GDD-Updated.md
│
├── BaseDeDatos/                          # Database design docs & schema (ESTEBAN)
│   ├── Copia de Videogame.drawio.png
│   ├── CowardKing_Database_Design_&_Justification.pdf
│   └── coward_king.sql
│
├── Catcafe/                              # Prototype / reference web app (JOSÉ ANGEL - EXAMEN)
│   ├── api.js
│   ├── index (1).html
│   ├── nekocafe.sql
│   ├── script.js
│   ├── style.css
│   ├── package.json
│   ├── package-lock.json
│   ├── screenshot-1.png
│   ├── screenshot-2.png
│   └── screenshot-3.png
│
├── CowardKing/                           # Design documents & UML 
│   ├── 1. Software Requirements Specification (1).md
│   ├── 1. Software Requirements Specification.pdf
│   ├── COWARD KING.pdf
│   ├── TheCowardKing-GDD (2).pdf
│   ├── TheCowardKing-GDD.docx.md
│   ├── TheCowardKing-GDD.md
│   ├── UML1.jpg
│   ├── UML2.jpg
│   └── UML3.jpg
│
├── DesarrolloWeb/                        # Web dev activities (ACTIVITIE 4)
│   └── Actividad4/
│       ├── index.html
│       ├── script.js
│       ├── style.css
│       └── Screenshot 2026-05-21 *.png  (3 screenshots)
│
└── Videogame/                            # Main game source
    ├── index.html                        # Game entry point
    ├── indexMenu.html                    # Main menu page
    ├── website.html                      # Website/leaderboard page
    ├── README_GAMEPLAY_CHANGES.md
    │
    ├── css/
    │   ├── base.css
    │   ├── menu.css
    │   ├── the_coward_king.css
    │   └── website.css
    │
    ├── js/
    │   ├── api.js                        # API calls to backend
    │   ├── audio.js                      # Audio/music manager
    │   ├── board.js                      # Board state & logic
    │   ├── combat.js                     # Combat resolution
    │   ├── constants.js                  # Game-wide constants
    │   ├── entities.js                   # Entity definitions (units, cards)
    │   ├── menu_app.js                   # Menu application logic
    │   ├── movement.js                   # Unit movement logic
    │   ├── renderer.js                   # Canvas rendering
    │   ├── sprites.js                    # Sprite management
    │   ├── tileMath.js                   # Hex/tile math utilities
    │   ├── turn.js                       # Turn management
    │   ├── ui.js                         # UI components
    │   ├── website.js                    # Website/leaderboard logic
    │   ├── 12_coward_king_prototype.js   # Early prototype script
    │   └── libs/
    │       ├── GameObject.js
    │       ├── Rect.js
    │       ├── TextLabel.js
    │       ├── Vector.js
    │       └── game_functions.js
    │
    ├── Database/                         # Backend server
    │   ├── server.js                     # Express API server
    │   ├── database.js                   # DB connection & queries
    │   ├── coward_king.sql               # Database schema
    │   ├── package.json
    │   └── package-lock.json
    │
    └── Assets/
        ├── Level1.png                    # Level tilemap images
        ├── Level2.png
        ├── Level3.png
        │
        ├── audio/
        │   ├── level1-skeletons.mp3      # Background music per level
        │   ├── level2-ogres.mp3
        │   ├── level3-royal.mp3
        │   └── sfx/
        │       ├── button-click.mp3
        │       ├── defeat.m4a
        │       ├── desperation-critical.mp3
        │       ├── desperation-death.mp3
        │       ├── victory.mp3 / victory.m4a
        │       └── cards/                # Per-card sound effects
        │           ├── archer.mp3
        │           ├── bomb.mp3
        │           ├── decoy.mp3
        │           ├── exile.mp3
        │           ├── guardian.mp3
        │           ├── knight.mp3
        │           ├── mage.mp3
        │           ├── peace-treaty.mp3
        │           ├── pikeman.mp3
        │           ├── royal-curse.mp3
        │           ├── royal-guard.mp3
        │           ├── squire.mp3
        │           ├── tower.mp3
        │           ├── trench.mp3
        │           └── wall.mp3
        │
        ├── cards/                        # Card artwork (base + per-level)
        │   ├── Archer.png
        │   ├── Bomb.png
        │   ├── Decoy.png
        │   ├── Exile.png
        │   ├── Guardian.png
        │   ├── Knight.png
        │   ├── Mage.png
        │   ├── Peace Treaty.png
        │   ├── Pikeman.png
        │   ├── Royal Curse.png
        │   ├── Royal Decree.png
        │   ├── Royal Guard.png
        │   ├── Squire.png
        │   ├── Tower.png
        │   ├── Trench.png
        │   ├── Wall.png
        │   ├── lvl1/                     # Level 1 card variants
        │   │   ├── ArcherLvl1.png
        │   │   ├── GuardianLvl1.png
        │   │   ├── KnightLvl1.png
        │   │   ├── MageLvl1.png
        │   │   ├── PikemanLvl1.png
        │   │   ├── Royal GuardLvl1.png
        │   │   ├── SquireLvl1.png
        │   │   ├── TowerLvl1.png
        │   │   ├── TrenchLvl1.png
        │   │   └── WallLvl1.png
        │   ├── lvl2/                     # Level 2 card variants
        │   │   └── (same 10 cards as lvl1)
        │   └── lvl3/                     # Level 3 card variants
        │       └── (same 10 cards as lvl1)
        │
        ├── images/                       # UI & menu images
        │   ├── Cara0.png – Cara4.png     # King face expressions
        │   ├── Win.jpg
        │   ├── menu-background.png
        │   └── title-logo.png
        │
        ├── sprites/                      # In-game unit sprites
        │   ├── Archer.png
        │   ├── Bomb.png
        │   ├── Brave King.png
        │   ├── Decoy.png
        │   ├── Elite Warrior.png
        │   ├── Guardian.png
        │   ├── King.png
        │   ├── Knight.png
        │   ├── Mage.png
        │   ├── Ogre Boss.png
        │   ├── Ogre.png
        │   ├── Pikeman.png
        │   ├── Royal Guard.png
        │   ├── Skeleton King.png
        │   ├── Skeleton.png
        │   ├── Squire.png
        │   ├── Tower.png
        │   ├── Trench.png
        │   └── Wall.png
        │
        └── videos/
            └── tutorial.mp4
```
