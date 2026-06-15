# Videogame

## Repository Structure

```
Videogame/
Activities/
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

## Installation Process

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/) and npm.
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) or another MySQL client.
- A modern web browser such as Google Chrome, Microsoft Edge, or Firefox.
- Python 3 or the Visual Studio Code Live Server extension to serve the frontend locally.

### 1. Clone the repository

```bash
git clone https://github.com/Leonardou-lab/Videogame.git
cd Videogame
```

### 2. Create the MySQL database

1. Start MySQL Server and open MySQL Workbench.
2. Open `Videogame/Database/coward_king.sql`.
3. Execute the complete SQL script.

The script creates the `coward_king` database, its tables, initial game data, views, triggers, and stored procedures.

> Warning: the script begins with `DROP DATABASE IF EXISTS coward_king`. Running it again deletes and recreates any existing database with that name.

### 3. Configure the database connection

Open `Videogame/Database/server.js` and update the MySQL connection values for the local computer:

```javascript
const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "YOUR_MYSQL_PASSWORD",
    database: "coward_king",
}).promise();
```

Use the MySQL username and password configured during the MySQL installation. These credentials are only for the local database and are different from the accounts created inside the game.

### 4. Install and start the backend API

Open a terminal from the repository root and run:

```bash
cd Videogame/Database
npm install
npm start
```

Keep this terminal open. A successful startup displays:

```text
API corriendo en http://localhost:3000
```

### 5. Start the frontend

Open a second terminal at the repository root and run:

```bash
python3 -m http.server 5500
```

Then open the following address in the browser:

```text
http://localhost:5500/Videogame/indexMenu.html
```

Alternatively, use the Visual Studio Code Live Server extension to open `Videogame/indexMenu.html`.

### 6. Create a game account

1. Select **Login** in the main menu.
2. Enter a new username and password.
3. Select **Sign Up** to create the account.
4. Use the same credentials to log in later.

Do not use the MySQL root credentials as the game username and password.

### 7. Verify the installation

- The menu should load with music after the first browser interaction.
- **Start Game** should open the game board.
- The Cards endpoint should return JSON at `http://localhost:3000/api/cards`.
- Login, statistics, upgrades, and run data require both MySQL Server and the backend API to remain active.

### Troubleshooting

- **Could not reach server:** confirm that `npm start` is still running in `Videogame/Database`.
- **Access denied for user:** verify the MySQL username and password in `server.js`.
- **Unknown database `coward_king`:** execute `coward_king.sql` in MySQL Workbench.
- **Player not found:** create the game account with **Sign Up** before attempting to log in.
- **Music does not start immediately:** click anywhere on the page; browsers block automatic audio until the first user interaction.
