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
    return {
        farthestPlayers: "3 players reached the Brave King",
        progressRanking: "1. RoyalGuard42, 2. WallMaker, 3. APKeeper",
        totalVictories: 128,
        totalDefeats: 914,
        averageHorde: "Level 1 - Horde 3",
    };
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
    renderStats("globalStats", await fetchGlobalStats());
}

document.addEventListener("DOMContentLoaded", () => {
    renderCards();
    renderPlayerStats();
    renderGlobalStats();
});
