"use strict";

const GRID_SIZE = 8;

// King position (0-indexed)
const KING_COL = 3;
const KING_ROW = 3;

// Safe zone: 3x3 centered on the King
const SAFE_ZONE_TILES = new Set();
for (let r = KING_ROW - 1; r <= KING_ROW + 1; r++) {
    for (let c = KING_COL - 1; c <= KING_COL + 1; c++) {
        SAFE_ZONE_TILES.add(`${r},${c}`);
    }
}

// Static units: { row, col, type, label }
const UNITS = [
    { row: 3, col: 3, type: 'king',  label: '♔' },
    { row: 1, col: 0, type: 'enemy', label: '☠' },
    { row: 5, col: 0, type: 'enemy', label: '☠' },
    { row: 3, col: 2, type: 'ally',  label: '⚔' },
    { row: 1, col: 3, type: 'wall',  label: '▪' },
];

// Build a lookup: "row,col" → unit
const unitMap = {};
UNITS.forEach(u => { unitMap[`${u.row},${u.col}`] = u; });

function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const tile = document.createElement('div');

            const isLight = (row + col) % 2 === 0;
            tile.className = `tile ${isLight ? 'light' : 'dark'}`;

            if (SAFE_ZONE_TILES.has(`${row},${col}`)) {
                tile.classList.add('safe');
            }

            const unit = unitMap[`${row},${col}`];
            if (unit) {
                const token = document.createElement('div');
                token.className = `token ${unit.type}`;
                token.textContent = unit.label;
                tile.appendChild(token);
            }

            board.appendChild(tile);
        }
    }
}

function buildHand() {
    const cards = [
        { name: 'Knight', cost: '3AP', desc: 'Melee. Attacks nearest enemy.' },
        { name: 'Archer', cost: '2AP', desc: 'Ranged 3 tiles. Auto-attacks.' },
        { name: 'Exile',  cost: '2AP', desc: 'Trap. Paralyzes enemy 2 turns.' },
        { name: 'Wall',   cost: '3AP', desc: 'Blocks tile. 150 HP.' },
    ];

    const hand = document.getElementById('hand');
    hand.innerHTML = '';

    cards.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-name">${c.name}</div>
            <div class="card-cost">${c.cost}</div>
            <div class="card-desc">${c.desc}</div>
        `;
        hand.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buildBoard();
    buildHand();
});
