

"use strict";

const APP_CONFIG = {
    prototypeUrl: "../Videogame/index.html",
};

const API_BASE = "http://localhost:3000";
const SETTINGS_STORAGE_KEY = "cowardKingSettings";

const appState = {
    currentUser: {
        player_id: null,
        username: "Guest King",
        isGuest: true,
    },
    settings: {
        masterVolume: 80,
        musicVolume: 65,
        sfxVolume: 75,
    },
};

(function restoreSession() {
    try {
        const saved = localStorage.getItem("cowardKingUser");
        if (saved) {
            const user = JSON.parse(saved);
            if (user.player_id && user.username) {
                appState.currentUser = { player_id: user.player_id, username: user.username, isGuest: false };
            }
        }
    } catch {}
})();

(function restoreSettings() {
    try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
            appState.settings = {
                ...appState.settings,
                ...JSON.parse(saved),
            };
        }
    } catch {}
})();


const mockCredits = {
    project: "The Coward King",
    genre: "Tactical Roguelite Turn-Based Board Game",
    course: "TC2005B - VideogamesJS Prototype",
    teamName: "Silent Crown",
    members: [
        "José Abel Domínguez Rish",
        "Leonardo André Flores Mendoza",
        "Nicolás Casillas Larrañaga",
    ],
};

const menuCards = [
    {
        name: "Knight",
        image: "Assets/cards/Knight.png",
        cost: 3,
        hp: 80,
        damage: 30,
        type: "Attack Unit",
        ability: "Melee ally. Attacks adjacent enemies.",
        chant: "The blade that stands where courage fails.",
    },
    {
        name: "Archer",
        image: "Assets/cards/Archer.png",
        cost: 3,
        hp: 50,
        damage: 20,
        type: "Ranged Unit",
        ability: "Stationary ranged ally. Range 3.",
        chant: "An arrow for every shadow in the hall.",
    },
    {
        name: "Mage",
        image: "Assets/cards/Mage.png",
        cost: 4,
        hp: 40,
        damage: 25,
        type: "Attack Unit",
        ability: "AoE cross pattern. Range 2. Fragile but powerful.",
        chant: "When the court runs out of plans, it starts glowing.",
    },
    {
        name: "Pikeman",
        image: "Assets/cards/Pikeman.png",
        cost: 2,
        hp: 60,
        damage: 15,
        type: "Attack Unit",
        ability: "Fast interceptor built to stop quick enemies.",
        chant: "A sharp point between panic and disaster.",
    },
    {
        name: "Wall",
        image: "Assets/cards/Wall.png",
        cost: 3,
        hp: 150,
        damage: 0,
        type: "Defense Unit",
        ability: "Blocks a tile and absorbs attacks.",
        chant: "Stone has more courage than the crown.",
    },
    {
        name: "Squire",
        image: "Assets/cards/Squire.png",
        cost: 2,
        hp: 70,
        damage: 10,
        type: "Defense Unit",
        ability: "Reduces 50% damage to adjacent allies.",
        chant: "Small shield, large amount of royal responsibility.",
    },
    {
        name: "Tower",
        image: "Assets/cards/Tower.png",
        cost: 4,
        hp: 100,
        damage: 35,
        type: "Defense Unit",
        ability: "Stationary ranged defense. Range 4.",
        chant: "The tallest thing in the room, after the King's excuses.",
    },
    {
        name: "Guardian",
        image: "Assets/cards/Guardian.png",
        cost: 3,
        hp: 120,
        damage: 25,
        type: "Defense Unit",
        ability: "Tanky mobile unit. Absorbs heavy damage.",
        chant: "The loyal wall that learned to walk.",
    },
    {
        name: "Royal Guard",
        image: "Assets/cards/Royal Guard.png",
        cost: 2,
        hp: 90,
        damage: 0,
        type: "Defense Unit",
        ability: "Follows the King automatically and absorbs danger near him.",
        chant: "His job description is mostly sighing near the crown.",
    },
    {
        name: "Trench",
        image: "Assets/cards/Trench.png",
        cost: 1,
        hp: 40,
        damage: 0,
        type: "Defense Unit",
        ability: "A humble barricade. Cheap to build, costly to ignore.",
        chant: "Dig first, explain to the King later.",
    },
    {
        name: "Exile",
        image: "Assets/cards/Exile.png",
        cost: 2,
        hp: null,
        damage: null,
        type: "Trap",
        ability: "Stuns an enemy for 2 turns.",
        chant: "Away with the traitor at the gate.",
    },
    {
        name: "Bomb",
        image: "Assets/cards/Bomb.png",
        cost: 4,
        hp: null,
        damage: 40,
        type: "Zone",
        ability: "40 damage to all enemies in a 3x3 area.",
        chant: "A royal answer, loud and final.",
    },
    {
        name: "Peace Treaty",
        image: "Assets/cards/Peace Treaty.png",
        cost: 2,
        hp: null,
        damage: null,
        type: "Zone",
        ability: "3x3 zone. Freezes enemies each turn for 4 turns.",
        chant: "A signed delay before the next scream.",
    },
    {
        name: "Royal Curse",
        image: "Assets/cards/Royal Curse.png",
        cost: 4,
        hp: null,
        damage: null,
        type: "Zone",
        ability: "3x3 zone. Enemies deal 50% less damage for 5 turns.",
        chant: "The royal family finally weaponizes bad luck.",
    },
    {
        name: "Decoy",
        image: "Assets/cards/Decoy.png",
        cost: 1,
        hp: 30,
        damage: 0,
        type: "Political Unit",
        ability: "Enemies prioritize attacking this over the King.",
        chant: "A fake hero with better nerves than the real one.",
    },
];

const mockGlobalRanking = [
    {
        rank: 1,
        player: "RoyalGuard42",
        farthestHorde: "Level 3 - Boss",
        highestLevel: "Brave King's Castle",
        wins: 12,
        losses: 31,
        favoriteCard: "Knight",
    },
    {
        rank: 2,
        player: "WallMaker",
        farthestHorde: "Level 3 - Horde 2",
        highestLevel: "Brave King's Castle",
        wins: 8,
        losses: 27,
        favoriteCard: "Wall",
    },
    {
        rank: 3,
        player: "APKeeper",
        farthestHorde: "Level 2 - Boss",
        highestLevel: "Ogre Dungeon",
        wins: 6,
        losses: 19,
        favoriteCard: "Peace Treaty",
    },
];

const app = document.getElementById("app");

function renderMenu(activeModal) {
    app.innerHTML = "";

    const screen = document.createElement("main");
    screen.className = "screen menu-screen";

    screen.appendChild(createCastleScene());
    screen.appendChild(createLoginButton());

    const content = document.createElement("section");
    content.className = "menu-content";
    content.appendChild(createBrand());
    content.appendChild(createMenuActions());
    screen.appendChild(content);

    if (activeModal) {
        screen.appendChild(activeModal);
    }

    app.appendChild(screen);
}

function createCastleScene() {
    const scene = document.createElement("div");
    scene.className = "castle-scene";
    scene.innerHTML = `
        <div class="stone-wall"></div>
        <div class="hall-arch left"></div>
        <div class="hall-arch right"></div>
        <div class="banner left"></div>
        <div class="banner right"></div>
        <div class="torch one"></div>
        <div class="torch two"></div>
        <div class="throne"></div>
        <div class="floor"></div>
        <div class="fog"></div>
    `;
    return scene;
}

function createLoginButton() {
    const login = document.createElement("div");
    login.className = "menu-login";

    const button = document.createElement("button");
    button.className = "small-button";
    button.innerHTML = appState.currentUser.isGuest ? "♙ LOGIN" : `♙ ${appState.currentUser.username.toUpperCase()}`;
    button.addEventListener("click", () => {
        if (appState.currentUser.isGuest) {
            renderMenu(createLoginModal());
        } else {
            renderMenu(createLoggedInModal());
        }
    });

    login.appendChild(button);
    return login;
}

function createBrand() {
    const brand = document.createElement("div");
    brand.className = "brand-stack";
    return brand;
}

function createMenuActions() {
    const actions = document.createElement("nav");
    actions.className = "menu-actions";
    actions.setAttribute("aria-label", "Main menu");

    actions.appendChild(menuButton("START GAME", "sword", true, () => {
        window.location.href = APP_CONFIG.prototypeUrl;
    }));
    actions.appendChild(menuButton("TUTORIAL", "scroll", false, () => {
        renderMenu(createTutorialModal());
    }));
    actions.appendChild(menuButton("STATISTICS", "chart", false, () => {
        renderMenu(createOverviewModal());
    }));
    actions.appendChild(menuButton("CREDITS", "book", false, () => {
        renderMenu(createCreditsModal());
    }));
    actions.appendChild(menuButton("SETTINGS", "gear", false, () => {
        renderMenu(createSettingsModal());
    }));

    return actions;
}

function menuButton(label, icon, primary, onClick) {
    const icons = {
        sword: "†",
        flag: "⚑",
        chart: "▥",
        book: "▤",
        cards: "▦",
        scroll: "▧",
        gear: "⚙",
    };

    const button = document.createElement("button");
    button.className = primary ? "menu-button primary" : "menu-button";
    button.innerHTML = `<span class="menu-icon">${icons[icon]}</span><span>${label}</span>`;
    button.addEventListener("click", onClick);
    return button;
}


function statRow(icon, label, value) {
    return `
        <div class="stat-row">
            <span>${icon}</span>
            <span>${label}</span>
            <strong class="stat-value">${value}</strong>
        </div>
    `;
}

function detailRow(label, value) {
    return `
        <div class="detail-row">
            <span>◆</span>
            <span>${label}</span>
            <strong class="detail-value">${value}</strong>
        </div>
    `;
}

function createModal(title, content) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const panel = document.createElement("section");
    panel.className = "modal-panel";

    const header = document.createElement("header");
    header.className = "modal-header";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const close = document.createElement("button");
    close.className = "icon-button close-button";
    close.setAttribute("aria-label", "Back");
    close.textContent = "↩";
    close.addEventListener("click", () => renderMenu());

    header.append(heading, close);
    panel.append(header, content);
    backdrop.appendChild(panel);

    return backdrop;
}

function createTutorialModal() {
    const content = document.createElement("div");
    content.className = "tutorial-view";
    content.innerHTML = `
        <article>
            <h3>The story</h3>
            <p>
                The Coward King did not win his crown by courage. He mostly inherited it, polished it, and hid behind very expensive curtains. Now the halls beneath his throne shake with skeletons, ogres, and royal challengers who smell fear in the stone. You are the unseen tactician of the court: the one placing defenders, commands, traps, and last-second orders while the King tries very hard not to scream in front of the servants.
            </p>
        </article>
        <article>
            <h3>Your mission</h3>
            <p>
                The goal of each horde is survival, not glory. The King has no interest in heroic speeches, dramatic last stands, or personally solving anything with a sword. You do not need to kill every enemy; you only need to keep him alive until the encounter turn limit ends. When a horde is cleared, the King escapes through a very secret, very undignified castle passage, and the remaining enemies vanish from the board.
            </p>
        </article>
        <article>
            <h3>Game flow</h3>
            <p>
                The campaign is divided into 3 levels. Each level has 3 escalating hordes followed by a boss fight. The deeper the King runs, the less convincing his royal confidence becomes. Level 1 introduces skeleton pressure in the Catacombs, Level 2 uses tougher ogres in the Ogre Dungeon, and Level 3 raises the tempo with faster elite warriors inside the Brave King's Castle.
            </p>
            <table class="tutorial-table">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Enemy style</th>
                        <th>Main challenge</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Level 1</td>
                        <td>Skeletons</td>
                        <td>Learn the loop and survive basic pressure.</td>
                    </tr>
                    <tr>
                        <td>Level 2</td>
                        <td>Ogres</td>
                        <td>Enemies have more HP and hit harder.</td>
                    </tr>
                    <tr>
                        <td>Level 3</td>
                        <td>Elite Warriors</td>
                        <td>Faster enemies close distance sooner.</td>
                    </tr>
                </tbody>
            </table>
        </article>
        <article>
            <h3>The safe zone</h3>
            <p>
                The King is the center of a 3x3 safe zone: the royal personal space bubble, protected by panic, protocol, and whoever still has a weapon. The King no longer loses just because an enemy touches him. Instead, the defense falls when enemy pressure inside the safe zone reaches 2 or more. A normal enemy counts as 1 pressure; a boss counts as 2, because a boss standing that close is enough to make the King reconsider the entire monarchy.
            </p>
        </article>
        <article>
            <h3>Turn phases</h3>
            <p>
                Each turn starts in the player phase, while the court still has a few seconds to pretend everything is under control. You can select cards, place defenders or effects, move the King, open upgrades, or end the turn. Then the enemy phase resolves combat, movement, effects, defeat checks, new enemy spawns, and AP recovery.
            </p>
            <p>
                Horde 1 is gentler because the enemies are still finding the correct door. Allies attack before enemies. From Horde 2 onward, and during boss fights, enemies act before allies, so positioning becomes more dangerous and the King starts asking whether "strategic retreat" can be a permanent lifestyle.
            </p>
        </article>
        <article>
            <h3>Controls</h3>
            <p>
                Gameplay is controlled with the mouse. Cards and tiles give visual feedback so the player can see valid actions before committing.
            </p>
            <table class="tutorial-table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Input</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Select a card</td>
                        <td>Left click on a card</td>
                    </tr>
                    <tr>
                        <td>Place a unit, trap, or zone effect</td>
                        <td>Left click a valid board tile</td>
                    </tr>
                    <tr>
                        <td>Move the King</td>
                        <td>Click Move King, then click a valid adjacent tile</td>
                    </tr>
                    <tr>
                        <td>Choose a retained card</td>
                        <td>After winning a horde, click 1 card to keep</td>
                    </tr>
                    <tr>
                        <td>Open upgrades</td>
                        <td>Left click the Upgrades button</td>
                    </tr>
                    <tr>
                        <td>End the turn</td>
                        <td>Left click End Turn</td>
                    </tr>
                </tbody>
            </table>
        </article>
        <article>
            <h3>AP and hand management</h3>
            <p>
                You begin each encounter with 5 AP and cannot hold more than 5. AP represents the court's remaining patience, supplies, and ability to follow orders shouted over royal whimpering. Cards are reusable during a horde, but each play spends AP again. If the King does not move during the player turn, AP recovers by 1 at the next turn; if the King moves, no AP is gained because everyone spent the moment dragging, guiding, and emotionally negotiating with him.
            </p>
            <p>
                Level 1 Horde 1 starts with 3 random cards. After that, the hand uses 4 cards: after surviving a horde, choose 1 card from the previous hand to keep, then the game fills the rest of the hand with new random cards. In lore, this is the council arguing over which emergency plan was least embarrassing and keeping it for later.
            </p>
        </article>
        <article>
            <h3>Moving the king</h3>
            <p>
                The King moves like a chess king: one tile in any direction, as long as the destination is inside the board and not occupied. It is less a brave march and more a carefully supervised royal shuffle. Moving the King shifts the 3x3 safe zone with him.
            </p>
            <p>
                Desperation prevents the player from hiding forever. Each turn where the King does not move, his imagination gets worse: every shadow becomes a blade, every footstep becomes a betrayal, and every advisor becomes suspiciously replaceable. Moving the King resets Desperation to 0 because motion convinces him that escape is still possible. At 4 Desperation, the King panics completely, abandons command, and the run is lost.
            </p>
        </article>
        <article>
            <h3>Enemies, spawns, and obstacles</h3>
            <p>
                Enemies spawn from valid board edges as the castle's defenses fail one entrance at a time. Early hordes mainly use the top edge; later hordes add left, right, and bottom edges, because apparently the royal architects believed "many doors" meant "luxury." Enemies do not spawn inside the safe zone or on occupied tiles.
            </p>
            <p>
                Random irremovable obstacles appear in harder hordes: fallen stone, broken furniture, and the consequences of years of unpaid maintenance. They block movement and card placement, but boss fights do not generate obstacles so the 2x2 boss has room to enter and make the King regret being visible.
            </p>
        </article>
        <article>
            <h3>Boss fights</h3>
            <p>
                After surviving the third horde of a level, a 2x2 boss enters the board. Boss fights are not won by waiting out the clock; the boss must be defeated. Bosses count as 2 safe zone pressure because their presence alone ruins the King's breathing technique. They summon stronger enemies on their boss rhythm and advance toward the King instead of standing still forever.
            </p>
        </article>
        <article>
            <h3>Upgrades, gold, and checkpoints</h3>
            <p>
                Upgrades can be opened during the player phase and improve ally cards. Purchased upgrades stay after death because the blacksmith keeps receipts better than the King keeps composure. Unspent gold is lost on defeat, usually because someone "heroically relocated" the treasury during the panic. Completing a full level, meaning 3 hordes plus the boss, is the checkpoint structure prepared for saved progression.
            </p>
        </article>
        <article>
            <h3>Victory and defeat</h3>
            <p>
                A horde is won by surviving its required turns, which the King later describes as a "calculated tactical withdrawal." A boss encounter is won by defeating the boss, preferably before the King starts drafting surrender letters. The player loses if safe zone pressure reaches 2 or more, or if Desperation reaches 4. On defeat, the run returns to Horde 1 of the current level.
            </p>
        </article>
        <section class="tutorial-card-section">
            <h3>The royal hand</h3>
            <p>
                The court survives through cards: soldiers, traps, walls, decrees, and desperate bargains written quickly by people who absolutely did not sign up for this. Each one spends AP, and each one is another order shouted across the throne room before the horde reaches the King.
            </p>
            <div class="menu-card-gallery tutorial-cards">
                ${menuCards.map(card => `
                    <article class="menu-card-entry">
                        <img src="${card.image}" alt="${card.name}">
                        <div>
                            <h3>${card.name}</h3>
                            <p class="card-chant">“${card.chant}”</p>
                            <div class="menu-card-stats">
                                <span>${card.cost} AP</span>
                                <span>${card.type}</span>
                                ${card.hp !== null ? `<span>${card.hp} HP</span>` : ""}
                                ${card.damage !== null ? `<span>${card.damage} DMG</span>` : ""}
                            </div>
                            <p>${card.ability}</p>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `;
    return createModal("Learn The Rules", content);
}

function createOverviewModal() {
    const content = document.createElement("div");
    content.className = "stats-hub";

    if (!appState.currentUser.player_id) {
        content.innerHTML = `
            <section class="detail-list">
                ${statRow("♙", "Player", "Login to see your personal stats")}
                ${statRow("▶", "Runs played", "12")}
                ${statRow("✓", "Wins", "3")}
                ${statRow("☠", "Losses", "9")}
                ${statRow("◆", "Farthest horde", "Level 2 - Horde 3")}
                ${statRow("★", "Highest level", "Ogre Dungeon")}
            </section>
            ${globalRankingHtml()}
        `;
        return createModal("Stats / Overview", content);
    }

    content.innerHTML = statRow("…", "Loading", "fetching stats…");
    fetch(`${API_BASE}/api/stats/${appState.currentUser.player_id}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(s => {
            content.innerHTML =
                `<section class="detail-list">` +
                statRow("▶", "Runs played",      s.total_runs) +
                statRow("☠", "Enemies killed",   s.total_enemies_killed) +
                statRow("★", "Upgrades bought",  s.total_upgrades) +
                statRow("◆", "Gold earned",      s.total_gold_earned) +
                statRow("✓", "Levels completed", s.levels_completed) +
                `</section>` +
                globalRankingHtml();
        })
        .catch(() => { content.innerHTML = statRow("⚠", "Error", "could not load stats") + globalRankingHtml() });

    return createModal("Stats / Overview", content);
}

function globalRankingHtml() {
    return `
        <section class="global-ranking">
            <h3>Global Ranking</h3>
            ${mockGlobalRanking.map(player => `
                <details class="ranking-entry" ${player.rank === 1 ? "open" : ""}>
                    <summary>
                        <span>#${player.rank}</span>
                        <strong>${player.player}</strong>
                        <em>${player.farthestHorde}</em>
                    </summary>
                    <div class="ranking-details">
                        ${detailRow("Highest level", player.highestLevel)}
                        ${detailRow("Wins", player.wins)}
                        ${detailRow("Losses", player.losses)}
                        ${detailRow("Favorite card", player.favoriteCard)}
                    </div>
                </details>
            `).join("")}
        </section>
    `;
}

function createSettingsModal() {
    const content = document.createElement("div");
    content.className = "settings-grid";

    content.appendChild(sliderRow("Master volume", "masterVolume"));
    content.appendChild(sliderRow("Music volume", "musicVolume"));
    content.appendChild(sliderRow("Sound effects", "sfxVolume"));

    return createModal("Settings", content);
}

function sliderRow(label, key) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const title = document.createElement("label");
    title.textContent = label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.value = appState.settings[key];

    const output = document.createElement("output");
    output.textContent = `${appState.settings[key]}%`;

    input.addEventListener("input", event => {
        const nextValue = Number(event.target.value);
        appState.settings[key] = nextValue;
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(appState.settings));
        if (window.cowardKingAudio) {
            window.cowardKingAudio.updateSettings({ [key]: nextValue });
        }
        output.textContent = `${nextValue}%`;
    });

    row.append(title, input, output);
    return row;
}

function createCreditsModal() {
    const content = document.createElement("div");
    content.className = "credits-list";
    content.innerHTML = `
        <p><strong>Project:</strong> ${mockCredits.project}</p>
        <p><strong>Genre:</strong> ${mockCredits.genre}</p>
        <p><strong>Course:</strong> ${mockCredits.course}</p>
        <p><strong>Team:</strong> ${mockCredits.teamName}</p>
        <p><strong>Members:</strong></p>
        ${mockCredits.members.map(member => `<p>${member}</p>`).join("")}
    `;
    return createModal("Credits", content);
}

function createLoggedInModal() {
    const content = document.createElement("div");
    content.className = "detail-list";
    content.innerHTML = `
        <p style="text-align:center; color:#e6c16a; font-size:13px; letter-spacing:1px; text-transform:uppercase;">
            ♙ ${appState.currentUser.username}
        </p>
        <p style="text-align:center; color:#cfc4a7; font-size:11px; margin-top:6px;">
            Session active
        </p>
    `;

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "form-button";
    logoutBtn.style.cssText = "margin-top:18px; width:100%; border-color:rgba(200,60,40,0.5); color:#d4a0a0;";
    logoutBtn.textContent = "Log Out";
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("cowardKingUser");
        appState.currentUser = { player_id: null, username: "Guest King", isGuest: true };
        renderMenu();
    });

    content.appendChild(logoutBtn);
    return createModal(`Logged in`, content);
}

function createLoginModal() {
    const form = document.createElement("form");
    form.className = "login-form";
    form.innerHTML = `
        <label>
            Username
            <input name="username" type="text" placeholder="King Aldric" required>
        </label>
        <label>
            Password
            <input name="password" type="password" placeholder="••••••••" required>
        </label>
        <div class="form-actions">
            <button class="form-button" type="submit" data-action="login">Login</button>
            <button class="form-button" type="submit" data-action="signup">Sign Up</button>
        </div>
        <p class="progress-pill" id="login-msg"></p>
    `;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const action = event.submitter?.dataset.action ?? "login";
        const username = form.elements["username"].value.trim();
        const password = form.elements["password"].value;
        const msg = form.querySelector("#login-msg");

        msg.textContent = "…";

        try {
            let player;
            if (action === "signup") {
                const res = await fetch(`${API_BASE}/api/player`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                if (res.status === 409) { msg.textContent = "Username already taken."; return; }
                if (!res.ok) { msg.textContent = "Sign up failed."; return; }
                player = await res.json();
            } else {
                const res = await fetch(
                    `${API_BASE}/api/player/${encodeURIComponent(username)}?password=${encodeURIComponent(password)}`
                );
                if (res.status === 404) { msg.textContent = "Player not found."; return; }
                if (res.status === 401) { msg.textContent = "Wrong password."; return; }
                if (!res.ok) { msg.textContent = "Login failed."; return; }
                player = await res.json();
            }

            appState.currentUser = {
                player_id: player.player_id,
                username:  player.username,
                isGuest:   false,
            };
            localStorage.setItem("cowardKingUser", JSON.stringify({
                player_id: player.player_id,
                username:  player.username,
            }));
            renderMenu();
        } catch {
            msg.textContent = "Could not reach server.";
        }
    });

    return createModal("Login / Sign Up", form);
}

renderMenu();
if (window.cowardKingAudio) {
    window.cowardKingAudio.init();
    window.cowardKingAudio.setRandomMenuTrack();
}
