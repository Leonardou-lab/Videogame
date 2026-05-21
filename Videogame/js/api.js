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
