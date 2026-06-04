"use strict";

const websiteCards = [
    {
        name: "Knight",
        image: "Assets/cards/Knight.png",
        cost: 3,
        hp: 80,
        damage: 30,
        type: "Attack Unit",
        description: "Melee ally. Attacks adjacent enemies and holds the closest line around the king.",
    },
    {
        name: "Archer",
        image: "Assets/cards/Archer.png",
        cost: 2,
        hp: 50,
        damage: 20,
        type: "Ranged Unit",
        description: "Stationary ranged ally. Attacks enemies up to 3 tiles away.",
    },
    {
        name: "Wall",
        image: "Assets/cards/Wall.png",
        cost: 3,
        hp: 150,
        damage: 0,
        type: "Defense Unit",
        description: "Blocks a tile and absorbs attacks so the king has time to escape.",
    },
    {
        name: "Exile",
        image: "Assets/cards/Exile.png",
        cost: 2,
        hp: null,
        damage: null,
        type: "Trap",
        description: "Trap. Stuns an enemy for 2 turns when triggered.",
    },
    {
        name: "Bomb",
        image: "Assets/cards/Bomb.png",
        cost: 4,
        hp: null,
        damage: 40,
        type: "Zone",
        description: "Explodes on placement. Deals 40 damage to all enemies in a 3x3 area.",
    },
    {
        name: "Peace Treaty",
        image: "Assets/cards/Peace_Treaty.png",
        cost: 2,
        hp: null,
        damage: null,
        type: "Zone",
        description: "3x3 zone. Slows enemies every other turn.",
    },
];

async function fetchPlayerStats() {
    // Future API hook:
    // return fetch("/api/player/stats").then(response => response.json());
    return {
        runsPlayed: 12,
        wins: 3,
        losses: 9,
        farthestHorde: "Level 2 - Horde 3",
        highestLevel: "Ogre Dungeon",
        mostUsedCards: "Knight, Archer, Wall",
    };
}

async function fetchGlobalStats() {
    // Future API hook:
    // return fetch("/api/global/stats").then(response => response.json());
    return [
        {
            rank: 1,
            playerName: "RoyalGuard42",
            farthestHorde: "Level 3 - Boss",
            highestLevel: "Brave King's Castle",
            wins: 12,
            losses: 31,
            averageHorde: "Level 2 - Horde 3",
            favoriteCard: "Knight",
        },
        {
            rank: 2,
            playerName: "WallMaker",
            farthestHorde: "Level 3 - Horde 2",
            highestLevel: "Brave King's Castle",
            wins: 8,
            losses: 27,
            averageHorde: "Level 2 - Horde 2",
            favoriteCard: "Wall",
        },
        {
            rank: 3,
            playerName: "APKeeper",
            farthestHorde: "Level 2 - Boss",
            highestLevel: "Ogre Dungeon",
            wins: 6,
            losses: 19,
            averageHorde: "Level 2 - Horde 1",
            favoriteCard: "Peace Treaty",
        },
        {
            rank: 4,
            playerName: "ExileScribe",
            farthestHorde: "Level 2 - Horde 3",
            highestLevel: "Ogre Dungeon",
            wins: 4,
            losses: 22,
            averageHorde: "Level 1 - Boss",
            favoriteCard: "Exile",
        },
    ];
}

function cardStatLine(card) {
    const stats = [`${card.cost} AP`, card.type];
    if (card.hp !== null) stats.push(`${card.hp} HP`);
    if (card.damage !== null) stats.push(`${card.damage} DMG`);
    return stats;
}

function renderCards() {
    const gallery = document.getElementById("cardGallery");
    if (!gallery) return;

    gallery.innerHTML = websiteCards.map(card => `
        <article class="site-card">
            <img src="${card.image}" alt="${card.name} card">
            <div class="site-card-copy">
                <h3>${card.name}</h3>
                <div class="site-card-stats">
                    ${cardStatLine(card).map(stat => `<span>${stat}</span>`).join("")}
                </div>
                <p>${card.description}</p>
            </div>
        </article>
    `).join("");
}

function renderStats(containerId, stats) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = Object.entries(stats).map(([key, value]) => `
        <div class="stat-row">
            <span>${formatStatLabel(key)}</span>
            <strong>${value}</strong>
        </div>
    `).join("");
}

function formatStatLabel(key) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, letter => letter.toUpperCase());
}

async function renderPlayerStats() {
    renderStats("playerStats", await fetchPlayerStats());
}

async function renderGlobalStats() {
    renderGlobalRanking(await fetchGlobalStats());
}

function renderGlobalRanking(players) {
    const container = document.getElementById("globalStats");
    if (!container) return;

    container.innerHTML = players.map(player => `
        <details class="ranking-card" ${player.rank === 1 ? "open" : ""}>
            <summary>
                <span class="ranking-place">#${player.rank}</span>
                <span class="ranking-name">${player.playerName}</span>
                <span class="ranking-progress">${player.farthestHorde}</span>
            </summary>
            <div class="ranking-details">
                <div><span>Highest Level:</span> ${player.highestLevel}</div>
                <div><span>Wins:</span> ${player.wins}</div>
                <div><span>Losses:</span> ${player.losses}</div>
                <div><span>Average Horde:</span> ${player.averageHorde}</div>
                <div><span>Favorite Card:</span> ${player.favoriteCard}</div>
            </div>
        </details>
    `).join("");
}

function showScreen(screenId) {
    const targetId = screenId || "play";
    document.querySelectorAll("[data-screen]").forEach(screen => {
        screen.classList.toggle("active-screen", screen.dataset.screen === targetId);
    });
    document.querySelectorAll("[data-screen-link]").forEach(link => {
        link.classList.toggle("active-nav", link.dataset.screenLink === targetId);
    });
}

function setupScreenNavigation() {
    document.querySelectorAll("[data-screen-link]").forEach(link => {
        link.addEventListener("click", event => {
            const screenId = link.dataset.screenLink;
            if (!screenId) return;
            event.preventDefault();
            history.pushState(null, "", `#${screenId}`);
            showScreen(screenId);
        });
    });

    window.addEventListener("popstate", () => {
        showScreen(location.hash.replace("#", "") || "play");
    });

    showScreen(location.hash.replace("#", "") || "play");
}

document.addEventListener("DOMContentLoaded", () => {
    setupScreenNavigation();
    renderCards();
    renderPlayerStats();
    renderGlobalStats();
});
