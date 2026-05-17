"use strict";

const LIGHT_COLOR  = "#f0d9b5";
const DARK_COLOR   = "#b58863";
const SAFE_ALPHA   = "rgba(144, 238, 144, 0.35)";
const SELECT_COLOR = "rgba(255, 220, 50, 0.55)";
const HINT_COLOR   = "rgba(80, 130, 230, 0.40)";

const CANVAS_W = BOARD_X + BOARD_SIZE * TILE_SIZE + BOARD_X;
const CANVAS_H = BOARD_Y + BOARD_SIZE * TILE_SIZE + BOARD_Y;

// Game objects

const king    = new King(3, 3);
const allies  = [];
const enemies = [new Enemy(0, 2), new Enemy(0, 5)];
const effects = [];

let selected = null;

// Helpers

function isSafeZone(row, col) {
    return Math.abs(row - king.row) <= 1 && Math.abs(col - king.col) <= 1;
}

function validMoves(unit) {
    const moves = [];
    for (let dr = -unit.speed; dr <= unit.speed; dr++) {
        for (let dc = -unit.speed; dc <= unit.speed; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = unit.row + dr, c = unit.col + dc;
            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE)
                moves.push({ row: r, col: c });
        }
    }
    return moves;
}

function tileOccupied(row, col) {
    return enemies.some(e => e.row === row && e.col === col) ||
           allies.some(a  => a.row === row && a.col === col);
}

// Drawing

function drawHighlight(ctx, row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(BOARD_X + col * TILE_SIZE, BOARD_Y + row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawGrid(ctx) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const x = BOARD_X + col * TILE_SIZE;
            const y = BOARD_Y + row * TILE_SIZE;
            ctx.fillStyle = (row + col) % 2 === 0 ? LIGHT_COLOR : DARK_COLOR;
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            if (isSafeZone(row, col)) {
                ctx.fillStyle = SAFE_ALPHA;
                ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// Game loop

function gameLoop(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawGrid(ctx);

    if (selected) {
        drawHighlight(ctx, selected.row, selected.col, SELECT_COLOR);
        validMoves(selected).forEach(({ row, col }) => {
            if (!tileOccupied(row, col)) drawHighlight(ctx, row, col, HINT_COLOR);
        });
    }

    king.draw(ctx);
    allies.forEach(a  => a.draw(ctx));
    enemies.forEach(e => e.draw(ctx));
    effects.forEach(e => e.draw(ctx));

    requestAnimationFrame(() => gameLoop(ctx));
}

// Input

function onCanvasClick(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const tile = positionToTile(e.clientX - rect.left, e.clientY - rect.top);
    if (!tile) { selected = null; return; }

    if (selected) {
        const free = validMoves(selected).filter(m => !tileOccupied(m.row, m.col));
        if (free.some(m => m.row === tile.row && m.col === tile.col)) {
            selected.setTile(tile.row, tile.col);
            selected = null;
        } else if (tile.row === king.row && tile.col === king.col) {
            selected = king;
        } else {
            selected = null;
        }
    } else {
        if (tile.row === king.row && tile.col === king.col) selected = king;
    }
}

// Hand

function buildHand() {
    const cards = [
        { name: 'Knight', apCost: 3, desc: 'Melee. Attacks nearest enemy.' },
        { name: 'Archer', apCost: 2, desc: 'Ranged 3 tiles. Auto-attacks.' },
        { name: 'Exile',  apCost: 2, desc: 'Trap. Paralyzes enemy 2 turns.' },
        { name: 'Wall',   apCost: 3, desc: 'Blocks tile. 150 HP.' },
    ];

    const hand = document.getElementById('hand');
    hand.innerHTML = '';
    cards.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.apCost = c.apCost;
        card.innerHTML = `
            <div class="card-name">${c.name}</div>
            <div class="card-cost">${c.apCost}AP</div>
            <div class="card-desc">${c.desc}</div>
        `;
        card.addEventListener('click', () => runState.spendAP(c.apCost));
        hand.appendChild(card);
    });
}

function highlightAffordableCards() {
    if (!runState) return;
    document.querySelectorAll('#hand .card').forEach(card => {
        card.classList.toggle('card--unavailable',
            parseInt(card.dataset.apCost, 10) > runState.ap);
    });
}

// Init

let runState;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('board-canvas');
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');

    canvas.addEventListener('click', e => onCanvasClick(e, canvas));

    runState = new RunState();
    buildHand();

    const _origSyncHud = runState._syncHud.bind(runState);
    runState._syncHud = () => { _origSyncHud(); highlightAffordableCards(); };
    highlightAffordableCards();

    gameLoop(ctx);
});