"use strict";

// This file runs the game's promotional website.
// It handles the navigation between screens, renders the card gallery,
// and shows player and global stats. The stat data is placeholder for now.

// Placeholder function that returns fake personal stats until the real API is connected.
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

// Placeholder function that returns a fake leaderboard until the real API is connected.
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

// Returns an array of stat strings for a card like cost, type, hp, and damage.
function cardStatLine(card) {
    const stats = [`${card.cost} AP`, card.type];
    if (card.hp !== null) stats.push(`${card.hp} HP`);
    if (card.damage !== null) stats.push(`${card.damage} DMG`);
    return stats;
}

// Renders the card gallery section with each card's image, stats, and description.
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

// Renders a stats object into a container as a list of label and value rows.
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

// Converts a camelCase key into a readable label like "runsPlayed" to "Runs Played".
function formatStatLabel(key) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, letter => letter.toUpperCase());
}

// Fetches and renders the personal stats section.
async function renderPlayerStats() {
    renderStats("playerStats", await fetchPlayerStats());
}

// Fetches and renders the global leaderboard section.
async function renderGlobalStats() {
    renderGlobalRanking(await fetchGlobalStats());
}

// Renders the global leaderboard as a list of expandable player entries.
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

// Shows the target screen and hides the rest, also updates the active nav link.
function showScreen(screenId) {
    const targetId = screenId || "play";
    document.querySelectorAll("[data-screen]").forEach(screen => {
        screen.classList.toggle("active-screen", screen.dataset.screen === targetId);
    });
    document.querySelectorAll("[data-screen-link]").forEach(link => {
        link.classList.toggle("active-nav", link.dataset.screenLink === targetId);
    });
}

// Wires up the nav links so clicking them switches screens and updates the URL hash.
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
