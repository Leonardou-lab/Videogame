

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
        isAdmin: false,
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
                appState.currentUser = { player_id: user.player_id, username: user.username, isGuest: false, isAdmin: user.isAdmin === true };
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


const app = document.getElementById("app");

let chartRunPerf = null;
let chartCardUpg = null;
let chartDeathDist = null;
let chartDeathRates = null;
let chartHordeComp = null;
let chartUpgPop = null;

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
        <section class="tutorial-video-section">
            <h3>Tutorial video</h3>
            <p>
                Watch the court's official survival briefing before placing the King's life in the hands of suspiciously underpaid defenders.
            </p>
            <video class="tutorial-video" controls preload="metadata">
                <source src="Assets/videos/tutorial.mp4" type="video/mp4">
                Your browser does not support the tutorial video.
            </video>
        </section>
    `;
    return createModal("Learn The Rules", content);
}

function createOverviewModal() {
    const wrapper = document.createElement("div");

    const tabBar = document.createElement("div");
    tabBar.className = "stats-tab-bar";

    const myStatsBtn = document.createElement("button");
    myStatsBtn.className = "tab-button active";
    myStatsBtn.textContent = "MY STATS";

    tabBar.append(myStatsBtn);

    const myStatsPanel = document.createElement("div");
    myStatsPanel.className = "tab-panel";

    let adminBtn = null;
    let adminPanel = null;

    if (appState.currentUser.isAdmin) {
        adminBtn = document.createElement("button");
        adminBtn.className = "tab-button";
        adminBtn.textContent = "ADMIN";
        tabBar.append(adminBtn);

        adminPanel = document.createElement("div");
        adminPanel.className = "tab-panel hidden";

        adminBtn.addEventListener("click", () => {
            adminBtn.classList.add("active");
            myStatsBtn.classList.remove("active");
            adminPanel.classList.remove("hidden");
            myStatsPanel.classList.add("hidden");
            if (!adminPanel.dataset.loaded) {
                adminPanel.dataset.loaded = "1";
                loadAdminPanel(adminPanel);
            }
        });
    }

    myStatsBtn.addEventListener("click", () => {
        myStatsBtn.classList.add("active");
        if (adminBtn) adminBtn.classList.remove("active");
        myStatsPanel.classList.remove("hidden");
        if (adminPanel) adminPanel.classList.add("hidden");
    });

    loadMyStatsPanel(myStatsPanel);

    wrapper.append(tabBar, myStatsPanel);
    if (adminPanel) wrapper.append(adminPanel);
    return createModal("Statistics", wrapper);
}

function loadMyStatsPanel(container) {
    if (!appState.currentUser.player_id) {
        container.innerHTML = `
            <div class="stats-box" style="text-align:center; padding:28px;">
                <p style="color:#e6c16a; font-size:16px; font-weight:900; text-transform:uppercase; margin:0 0 10px;">♙ Guest King</p>
                <p style="color:#b89b67; font-size:13px; margin:0;">Log in to see your personal stats, upgrade history, and run records.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `<p style="color:#b89b67; font-size:13px;">Loading stats…</p>`;

    fetch(`${API_BASE}/api/player/${appState.currentUser.player_id}/dashboard`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => renderMyStats(container, data))
        .catch(() => {
            container.innerHTML = `<p style="color:#d4a0a0;">Could not load stats. Is the server running?</p>`;
        });
}

function renderMyStats(container, { overview, best_run, upgrades, run_history }) {
    const overviewBoxes = `
        <div class="stats-overview-boxes">
            <div class="overview-box">
                <strong>${overview?.total_runs ?? "—"}</strong>
                <span>Runs</span>
            </div>
            <div class="overview-box">
                <strong>${overview?.total_enemies_killed ?? "—"}</strong>
                <span>Kills</span>
            </div>
            <div class="overview-box">
                <strong>${overview?.total_gold_earned ?? "—"}</strong>
                <span>Gold</span>
            </div>
            <div class="overview-box">
                <strong>${overview?.levels_completed ?? "—"}</strong>
                <span>Levels</span>
            </div>
        </div>
    `;

    const runChartHtml = run_history?.length
        ? `<div class="chart-container">
            <h3 class="chart-title">Run Performance</h3>
            <div class="chart-canvas-wrap"><canvas id="chartRunPerformance"></canvas></div>
        </div>`
        : `<div class="chart-container">
            <h3 class="chart-title">Run Performance</h3>
            <p class="chart-empty-msg">No run data yet.</p>
        </div>`;

    const upgradesChartHtml = upgrades?.length
        ? `<div class="chart-container">
            <h3 class="chart-title">Card Upgrades</h3>
            <div class="chart-canvas-wrap"><canvas id="chartCardUpgrades"></canvas></div>
            <div class="upgrade-badges">
                ${upgrades.map(u => `<span class="upgrade-badge">${u.card_name} <em>T${u.upgrade_level}</em></span>`).join("")}
            </div>
        </div>`
        : `<div class="chart-container">
            <h3 class="chart-title">Card Upgrades</h3>
            <p class="chart-empty-msg">No upgrades yet.</p>
        </div>`;

    const topGrid = `
        <div class="stats-top-grid">
            <div class="stats-box">
                <p class="stats-section-title">Overview</p>
                <div class="detail-list">
                    ${detailRow("Runs played",      overview?.total_runs           ?? "—")}
                    ${detailRow("Enemies killed",   overview?.total_enemies_killed ?? "—")}
                    ${detailRow("Gold earned",      overview?.total_gold_earned    ?? "—")}
                    ${detailRow("Upgrades bought",  overview?.total_upgrades       ?? "—")}
                    ${detailRow("Levels completed", overview?.levels_completed     ?? "—")}
                </div>
            </div>
            <div class="stats-box">
                <p class="stats-section-title">Best Run</p>
                <div class="detail-list">
                    ${detailRow("Deepest level", best_run?.deepest_level_reached      ?? "—")}
                    ${detailRow("Most gold",     best_run?.highest_gold_in_single_run ?? "—")}
                    ${detailRow("Total kills",   best_run?.total_kills_across_runs    ?? "—")}
                    ${detailRow("Total turns",   best_run?.total_turns_survived       ?? "—")}
                </div>
            </div>
        </div>
    `;

    const upgradesHtml = upgrades?.length
        ? `<div class="stats-section">
            <p class="stats-section-title">Card Upgrades</p>
            <table class="tutorial-table">
                <thead>
                    <tr><th>Card</th><th>Type</th><th>Tier</th><th>HP+</th><th>DMG+</th><th>AP</th><th>Gold</th></tr>
                </thead>
                <tbody>
                    ${upgrades.map(u => `
                        <tr>
                            <td>${u.card_name}</td>
                            <td>${u.card_type}</td>
                            <td><span class="tier-pill">Tier ${u.upgrade_level}</span></td>
                            <td>${u.hp_bonus     > 0 ? `+${u.hp_bonus}`     : "—"}</td>
                            <td>${u.damage_bonus > 0 ? `+${u.damage_bonus}` : "—"}</td>
                            <td>${u.ap_cost_bonus < 0 ? u.ap_cost_bonus     : "—"}</td>
                            <td>${u.gold_spent} ◆</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>`
        : `<div class="stats-section">
            <p class="stats-section-title">Card Upgrades</p>
            <p style="color:#b89b67; font-size:13px;">No upgrades purchased yet.</p>
        </div>`;

    const historyHtml = run_history?.length
        ? `<div class="stats-section">
            <p class="stats-section-title">Last 10 Runs</p>
            <table class="tutorial-table">
                <thead>
                    <tr><th>Result</th><th>Level</th><th>Horde</th><th>Gold</th><th>Duration</th><th>Date</th></tr>
                </thead>
                <tbody>
                    ${run_history.map(r => `
                        <tr>
                            <td><span class="result-badge ${r.result}">${r.result}</span></td>
                            <td>${r.level_name ?? "—"}</td>
                            <td>${r.current_horde ?? "—"}</td>
                            <td>${r.total_gold_earned} ◆</td>
                            <td>${r.duration_minutes != null ? `${r.duration_minutes} min` : "—"}</td>
                            <td>${new Date(r.started_at).toLocaleDateString()}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>`
        : `<div class="stats-section">
            <p class="stats-section-title">Last 10 Runs</p>
            <p style="color:#b89b67; font-size:13px;">No runs recorded yet.</p>
        </div>`;

    container.innerHTML = overviewBoxes + runChartHtml + upgradesChartHtml + topGrid + upgradesHtml + historyHtml;

    if (typeof Chart === "undefined") return;

    if (run_history?.length) {
        if (chartRunPerf) { chartRunPerf.destroy(); chartRunPerf = null; }
        const cvs = document.getElementById("chartRunPerformance");
        if (cvs) {
            const labels = run_history.map((r, i) => {
                const d = new Date(r.started_at);
                return isNaN(d.getTime()) ? `Run #${i + 1}` : `${d.getMonth() + 1}/${d.getDate()}`;
            });
            chartRunPerf = new Chart(cvs, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Enemies Killed",
                            data: run_history.map(r => r.enemies_killed ?? 0),
                            backgroundColor: "rgba(39,174,96,0.65)",
                            borderColor: run_history.map(r => r.result === "defeat" ? "rgba(200,60,40,1)" : "rgba(39,174,96,1)"),
                            borderWidth: 2,
                        },
                        {
                            label: "Gold Earned",
                            data: run_history.map(r => r.total_gold_earned ?? 0),
                            backgroundColor: "rgba(230,193,106,0.65)",
                            borderColor: run_history.map(r => r.result === "defeat" ? "rgba(200,60,40,1)" : "rgba(200,170,80,1)"),
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: "#c8b06b" } },
                    },
                    scales: {
                        x: {
                            ticks: { color: "#aaa" },
                            grid: { color: "rgba(255,255,255,0.07)" },
                            title: { display: true, text: "Date (MM/DD)", color: "#7a6a50", font: { size: 11 } },
                        },
                        y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.07)" } },
                    },
                },
            });
        }
    }

    if (upgrades?.length) {
        if (chartCardUpg) { chartCardUpg.destroy(); chartCardUpg = null; }
        const cvs = document.getElementById("chartCardUpgrades");
        if (cvs) {
            chartCardUpg = new Chart(cvs, {
                type: "radar",
                data: {
                    labels: upgrades.map(u => u.card_name),
                    datasets: [{
                        label: "Upgrade Level",
                        data: upgrades.map(u => u.upgrade_level),
                        backgroundColor: "rgba(155,89,182,0.3)",
                        borderColor: "rgba(155,89,182,0.9)",
                        pointBackgroundColor: "rgba(155,89,182,1)",
                        borderWidth: 2,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: "#c8b06b" } },
                    },
                    scales: {
                        r: {
                            min: 0,
                            max: 3,
                            ticks: { color: "#aaa", stepSize: 1, backdropColor: "transparent" },
                            grid: { color: "rgba(255,255,255,0.1)" },
                            pointLabels: { color: "#c8b06b" },
                        },
                    },
                },
            });
        }
    }
}

function loadAdminPanel(container) {
    container.innerHTML = `<p style="color:#b89b67; font-size:13px;">Loading…</p>`;

    Promise.all([
        fetch(`${API_BASE}/api/admin/leaderboard`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/admin/death-distribution`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/admin/horde-difficulty`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/admin/most-upgraded-cards`).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/admin/death-rates`).then(r => r.ok ? r.json() : []),
    ])
        .then(([leaderboard, deaths, hordes, cards, deathRates]) => renderAdminPanel(container, leaderboard, deaths, hordes, cards, deathRates))
        .catch(() => {
            container.innerHTML = `<p style="color:#d4a0a0;">Could not load admin data. Is the server running?</p>`;
        });
}

function renderAdminPanel(container, leaderboard, deaths, hordes, cards, deathRates) {
    const leaderboardHtml = `
        <div class="stats-section">
            <p class="stats-section-title">Global Leaderboard</p>
            <section class="global-ranking">
                ${leaderboard.length
                    ? leaderboard.map(p => `
                        <details class="ranking-entry" ${p.leaderboard_rank === 1 ? "open" : ""}>
                            <summary>
                                <span>#${p.leaderboard_rank}</span>
                                <strong>${p.username}</strong>
                                <em>${p.levels_completed} levels</em>
                            </summary>
                            <div class="ranking-details">
                                ${detailRow("Runs played",    p.total_runs)}
                                ${detailRow("Enemies killed", p.total_enemies_killed)}
                                ${detailRow("Gold earned",    p.total_gold_earned)}
                                ${detailRow("Upgrades",       p.total_upgrades)}
                            </div>
                        </details>
                    `).join("")
                    : `<p style="color:#b89b67; font-size:13px;">No players registered yet.</p>`
                }
            </section>
        </div>
    `;

    const deathChartHtml = `
        <div class="chart-container">
            <h3 class="chart-title">Where Players Die Most</h3>
            ${deathRates?.length
                ? `<div class="chart-canvas-wrap"><canvas id="chartDeathDist"></canvas></div>`
                : `<p class="chart-empty-msg">No death data yet.</p>`
            }
        </div>
    `;

    const hordeChartHtml = `
        <div class="chart-container">
            <h3 class="chart-title">Horde Completion Rates</h3>
            ${hordes.length
                ? `<div class="chart-canvas-wrap"><canvas id="chartHordeCompletion"></canvas></div>`
                : `<p class="chart-empty-msg">No horde data yet.</p>`
            }
        </div>
    `;

    const validCards = cards.filter(c => c.total_upgrade_purchases > 0);
    const upgradePopHtml = `
        <div class="chart-container">
            <h3 class="chart-title">Card Upgrade Popularity</h3>
            ${validCards.length
                ? `<div class="chart-canvas-wrap chart-canvas-wrap--doughnut"><canvas id="chartUpgradePopularity"></canvas></div>`
                : `<p class="chart-empty-msg">No upgrades data yet.</p>`
            }
        </div>
    `;

    const deathHtml = `
        <div class="stats-box">
            <p class="stats-section-title">Death Distribution</p>
            <table class="tutorial-table">
                <thead><tr><th>Level</th><th>Horde</th><th>Deaths</th></tr></thead>
                <tbody>
                    ${deaths.length
                        ? deaths.map(d => `
                            <tr>
                                <td>${d.level_name}</td>
                                <td>Horde ${d.current_horde}</td>
                                <td>${d.total_deaths}</td>
                            </tr>
                        `).join("")
                        : `<tr><td colspan="3" style="color:#b89b67;">No data yet</td></tr>`
                    }
                </tbody>
            </table>
        </div>
    `;

    const hordeHtml = `
        <div class="stats-box">
            <p class="stats-section-title">Horde Difficulty</p>
            <table class="tutorial-table">
                <thead><tr><th>Level</th><th>Horde</th><th>Completion %</th><th>Avg Turns</th></tr></thead>
                <tbody>
                    ${hordes.length
                        ? hordes.map(h => `
                            <tr>
                                <td>${h.level_name}</td>
                                <td>Horde ${h.horde_number}</td>
                                <td>${h.completion_rate_percent}%</td>
                                <td>${h.avg_turns_survived ?? "—"}</td>
                            </tr>
                        `).join("")
                        : `<tr><td colspan="4" style="color:#b89b67;">No data yet</td></tr>`
                    }
                </tbody>
            </table>
        </div>
    `;

    const topCardsHtml = `
        <div class="stats-section">
            <p class="stats-section-title">Most Upgraded Cards</p>
            <table class="tutorial-table">
                <thead><tr><th>Card</th><th>Type</th><th>Upgrades</th><th>Avg Tier</th><th>Max Tier</th><th>Gold</th></tr></thead>
                <tbody>
                    ${cards.filter(c => c.total_upgrade_purchases > 0).length
                        ? cards.filter(c => c.total_upgrade_purchases > 0).map(c => `
                            <tr>
                                <td>${c.card_name}</td>
                                <td>${c.card_type}</td>
                                <td>${c.total_upgrade_purchases}</td>
                                <td>${c.avg_upgrade_level}</td>
                                <td><span class="tier-pill">Tier ${c.max_upgrade_level}</span></td>
                                <td>${c.total_gold_spent} ◆</td>
                            </tr>
                        `).join("")
                        : `<tr><td colspan="6" style="color:#b89b67;">No upgrades yet</td></tr>`
                    }
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = leaderboardHtml
        + deathChartHtml
        + hordeChartHtml
        + upgradePopHtml
        + `<div class="admin-grid">${deathHtml}${hordeHtml}</div>`
        + topCardsHtml;

    if (typeof Chart === "undefined") return;

    if (deathRates?.length) {
        if (chartDeathDist) { chartDeathDist.destroy(); chartDeathDist = null; }
        const cvs = document.getElementById("chartDeathDist");
        if (cvs) {
            chartDeathDist = new Chart(cvs, {
                type: "bar",
                data: {
                    labels: deathRates.map(r => r.label),
                    datasets: [
                        {
                            label: "Partidas jugadas",
                            data: deathRates.map(r => r.runs_played),
                            backgroundColor: "rgba(230,193,106,0.65)",
                            borderColor: "rgba(230,193,106,1)",
                            borderWidth: 1,
                        },
                        {
                            label: "Muertes",
                            data: deathRates.map(r => r.total_deaths),
                            backgroundColor: "rgba(192,57,43,0.75)",
                            borderColor: "rgba(192,57,43,1)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: "#c8b06b" } },
                    },
                    scales: {
                        x: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.07)" } },
                        y: {
                            beginAtZero: true,
                            ticks: { color: "#aaa", stepSize: 1 },
                            grid: { color: "rgba(255,255,255,0.07)" },
                        },
                    },
                },
            });
        }
    }

    if (hordes.length) {
        if (chartHordeComp) { chartHordeComp.destroy(); chartHordeComp = null; }
        const cvs = document.getElementById("chartHordeCompletion");
        if (cvs) {
            chartHordeComp = new Chart(cvs, {
                type: "bar",
                data: {
                    labels: hordes.map(h => `${h.level_name} H${h.horde_number}`),
                    datasets: [{
                        label: "Completion %",
                        data: hordes.map(h => parseFloat(h.completion_rate_percent) || 0),
                        backgroundColor: hordes.map(h => {
                            const pct = Math.min(1, Math.max(0, parseFloat(h.completion_rate_percent || 0) / 100));
                            const r = Math.round(192 * (1 - pct) + 39 * pct);
                            const g = Math.round(57 * (1 - pct) + 174 * pct);
                            const b = Math.round(43 * (1 - pct) + 96 * pct);
                            return `rgba(${r},${g},${b},0.8)`;
                        }),
                        borderColor: "rgba(255,255,255,0.15)",
                        borderWidth: 1,
                    }],
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: "#c8b06b" } },
                    },
                    scales: {
                        x: {
                            min: 0,
                            max: 100,
                            ticks: { color: "#aaa", callback: v => `${v}%` },
                            grid: { color: "rgba(255,255,255,0.07)" },
                        },
                        y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.07)" } },
                    },
                },
            });
        }
    }

    if (validCards.length) {
        if (chartUpgPop) { chartUpgPop.destroy(); chartUpgPop = null; }
        const cvs = document.getElementById("chartUpgradePopularity");
        if (cvs) {
            const MEDIEVAL_PALETTE = [
                "rgba(108,128,160,0.85)",
                "rgba(52,115,68,0.85)",
                "rgba(155,89,182,0.85)",
                "rgba(230,193,106,0.85)",
                "rgba(192,57,43,0.85)",
                "rgba(41,128,185,0.85)",
                "rgba(140,100,60,0.85)",
                "rgba(180,120,60,0.85)",
            ];
            const total = validCards.reduce((s, c) => s + (c.total_upgrade_purchases || 0), 0);
            const centerTextPlugin = {
                id: "centerText",
                afterDraw(chart) {
                    const { ctx: c, chartArea: { top, left, width, height } } = chart;
                    const cx = left + width / 2;
                    const cy = top + height / 2;
                    c.save();
                    c.font = "bold 22px \"Courier New\", monospace";
                    c.fillStyle = "#e6c16a";
                    c.textAlign = "center";
                    c.textBaseline = "middle";
                    c.fillText(String(total), cx, cy - 9);
                    c.font = "11px \"Courier New\", monospace";
                    c.fillStyle = "#b89b67";
                    c.fillText("UPGRADES", cx, cy + 10);
                    c.restore();
                },
            };
            chartUpgPop = new Chart(cvs, {
                type: "doughnut",
                data: {
                    labels: validCards.map(c => c.card_name),
                    datasets: [{
                        data: validCards.map(c => c.total_upgrade_purchases),
                        backgroundColor: validCards.map((_, i) => MEDIEVAL_PALETTE[i % MEDIEVAL_PALETTE.length]),
                        borderColor: "rgba(18,16,14,0.8)",
                        borderWidth: 2,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: {
                        legend: { labels: { color: "#c8b06b" } },
                    },
                },
                plugins: [centerTextPlugin],
            });
        }
    }
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
        appState.currentUser = { player_id: null, username: "Guest King", isGuest: true, isAdmin: false };
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
        <label class="admin-check-label" title="Only applies when creating a new account">
            <input type="checkbox" name="is_admin">
            Register as Administrator <em>(sign up only)</em>
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
        const is_admin = form.elements["is_admin"].checked;
        const msg = form.querySelector("#login-msg");

        msg.textContent = "…";

        try {
            let player;
            if (action === "signup") {
                const res = await fetch(`${API_BASE}/api/player`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, is_admin }),
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
                isAdmin:   player.is_admin === true,
            };
            localStorage.setItem("cowardKingUser", JSON.stringify({
                player_id: player.player_id,
                username:  player.username,
                isAdmin:   player.is_admin === true,
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
