"use strict";

const API_BASE = 'http://localhost:3000';

let enemyPool = [];

async function loadGameData(levelId = 1) {
    try {
        const [cardsRes, enemiesRes] = await Promise.all([
            fetch(`${API_BASE}/api/cards`),
            fetch(`${API_BASE}/api/enemies/${levelId}`),
        ]);

        if (cardsRes.ok) {
            const cards = await cardsRes.json();
            cardPool.length = 0;
            cards.forEach(c => cardPool.push(c));
        }

        if (enemiesRes.ok) {
            const enemies = await enemiesRes.json();
            enemyPool = enemies.filter(e => !e.is_boss);
        }
    } catch {
        console.warn('API fail');
    }
}

async function saveStats({ kills = 0, gold = 0, upgrades = 0, runs = 0, levels = 0 }) {
    try {
        const saved = localStorage.getItem("cowardKingUser");
        if (!saved) return;
        const { player_id } = JSON.parse(saved);
        if (!player_id) return;
        await fetch(`${API_BASE}/api/stats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id,
                total_runs:           runs,
                total_enemies_killed: kills,
                total_upgrades:       upgrades,
                total_gold_earned:    gold,
                levels_completed:     levels,
            }),
        });
    } catch {
        console.warn('Stats save fail');
    }
}
