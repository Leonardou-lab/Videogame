"use strict";

const API_BASE = 'http://localhost:3000';

let enemyPool = [];
let currentRunId = null;
let pendingUpgradeRegistry = {};

async function loadGameData(levelId = 1) {
    try {
        const saved = localStorage.getItem("cowardKingUser");
        const player_id = saved ? JSON.parse(saved).player_id : null;

        const requests = [
            fetch(`${API_BASE}/api/cards`),
            fetch(`${API_BASE}/api/enemies/${levelId}`),
        ];
        if (player_id) {
            requests.push(fetch(`${API_BASE}/api/player/${player_id}/upgrades`));
        }

        const [cardsRes, enemiesRes, upgradesRes] = await Promise.all(requests);

        if (cardsRes.ok) {
            const cards = await cardsRes.json();
            cardPool.length = 0;
            cards.forEach(c => cardPool.push(c));
        }

        if (enemiesRes.ok) {
            const enemies = await enemiesRes.json();
            enemyPool = enemies.filter(e => !e.is_boss);
        }

        pendingUpgradeRegistry = {};
        if (upgradesRes?.ok) {
            const upgrades = await upgradesRes.json();
            for (const u of upgrades) {
                if (u.card_name && u.upgrade_level > 0) {
                    pendingUpgradeRegistry[u.card_name] = u.upgrade_level;
                }
            }
        }
    } catch {
        console.warn('API fail');
    }
}

async function saveUpgrade({ card_id, level = 1, ap_cost_bonus = 0, hp_bonus = 0, damage_bonus = 0, gold_spent = 0 }) {
    try {
        const saved = localStorage.getItem("cowardKingUser");
        if (!saved) return;
        const { player_id } = JSON.parse(saved);
        if (!player_id) return;
        await fetch(`${API_BASE}/api/upgrade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id, card_id, level, ap_cost_bonus, hp_bonus, damage_bonus, gold_spent }),
        });
    } catch {
        console.warn('Upgrade save fail');
    }
}

async function startRun() {
    try {
        const saved = localStorage.getItem("cowardKingUser");
        if (!saved) return;
        const { player_id } = JSON.parse(saved);
        if (!player_id) return;
        const res = await fetch(`${API_BASE}/api/run/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player_id }),
        });
        if (!res.ok) return;
        const data = await res.json();
        currentRunId = data.run_id;
    } catch {
        console.warn('Run start fail');
    }
}

async function completeHorde(horde_id, turns, kills) {
    try {
        if (!currentRunId) return;
        await fetch(`${API_BASE}/api/run/${currentRunId}/complete-horde`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ horde_id, turns, kills }),
        });
    } catch {
        console.warn('Complete horde fail');
    }
}

async function recordDeath() {
    try {
        if (!currentRunId) return;
        await fetch(`${API_BASE}/api/run/${currentRunId}/death`, { method: "POST" });
        currentRunId = null;
    } catch {
        console.warn('Record death fail');
    }
}

async function advanceRunLevel(level_id) {
    try {
        if (!currentRunId) return;
        await fetch(`${API_BASE}/api/run/${currentRunId}/level`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level_id }),
        });
    } catch {
        console.warn('Level advance fail');
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
