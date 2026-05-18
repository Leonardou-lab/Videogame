/*
 * The Coward King - playable prototype
 *
 * Built from the same structure used in Pong and Breakout:
 * global canvas setup, Game class, event listeners, update, draw, drawScene.
 */

"use strict";

const canvasWidth = 620;
const canvasHeight = 620;
const boardSize = 8;
const tileSize = 70;
const boardX = 30;
const boardY = 30;
const maxTurns = 30;
const startingAP = 7;
const enemiesPerTurn = 3;

let ctx;
let game;
let oldTime = 0;

const keyDirections = {
    ArrowUp: { row: -1, col: 0 },
    ArrowDown: { row: 1, col: 0 },
    ArrowLeft: { row: 0, col: -1 },
    ArrowRight: { row: 0, col: 1 },
    w: { row: -1, col: 0 },
    s: { row: 1, col: 0 },
    a: { row: 0, col: -1 },
    d: { row: 0, col: 1 },
    q: { row: -1, col: -1 },
    e: { row: -1, col: 1 },
    z: { row: 1, col: -1 },
    c: { row: 1, col: 1 },
};

const cardPool = [
    {
        name: "Knight",
        type: "ally",
        cost: 3,
        hp: 80,
        damage: 30,
        range: 1,
        color: "#4677c8",
        text: "Melee ally. Attacks adjacent enemies.",
    },
    {
        name: "Archer",
        type: "ally",
        cost: 2,
        hp: 50,
        damage: 20,
        range: 3,
        color: "#4b9d69",
        text: "Stationary ranged ally. Range 3.",
    },
    {
        name: "Wall",
        type: "ally",
        cost: 3,
        hp: 150,
        damage: 0,
        range: 0,
        color: "#7c7d82",
        text: "Blocks a tile and absorbs attacks.",
    },
    {
        name: "Exile",
        type: "trap",
        cost: 2,
        duration: 2,
        color: "#9b59b6",
        text: "Trap. Stuns an enemy for 2 turns.",
    },
    {
        name: "Royal Decree",
        type: "zone",
        cost: 3,
        duration: 3,
        color: "#d6a632",
        text: "3x3 zone. Pushes enemies 1 tile away.",
    },
    {
        name: "Peace Treaty",
        type: "zone",
        cost: 2,
        duration: 4,
        color: "#55b7b3",
        text: "3x3 zone. Slows enemies every other turn.",
    },
];

class BoardObject extends GameObject {
    constructor(row, col, width, height, color, type) {
        super(tileToPosition(row, col), width, height, color, type);
        this.row = row;
        this.col = col;
    }

    setTile(row, col) {
        this.row = clamp(row, 0, boardSize - 1);
        this.col = clamp(col, 0, boardSize - 1);
        this.position = tileToPosition(this.row, this.col);
        this.updateCollider();
    }
}

class Unit extends BoardObject {
    constructor(row, col, color, type, hp, damage, range, speed) {
        super(row, col, tileSize - 12, tileSize - 12, color, type);
        this.maxHp = hp;
        this.hp = hp;
        this.damage = damage;
        this.range = range;
        this.speed = speed;
        this.stunTurns = 0;
        this.slowedThisTurn = false;
    }

    takeDamage(amount) {
        this.hp -= amount;
    }

    draw(ctx) {
        drawToken(ctx, this);
    }
}

class King extends Unit {
    constructor(row, col) {
        super(row, col, "#d8bc57", "king", 0, 0, 0, 1);
    }
}

class Ally extends Unit {
    constructor(row, col, card) {
        super(row, col, card.color, card.name.toLowerCase(), card.hp, card.damage, card.range, 0);
        this.cardName = card.name;
    }
}

class Enemy extends Unit {
    constructor(row, col) {
        super(row, col, "#9b2f35", "skeleton", 50, 15, 1, 1);
    }
}

class BoardEffect extends BoardObject {
    constructor(row, col, card) {
        super(row, col, tileSize - 18, tileSize - 18, card.color, card.type);
        this.name = card.name;
        this.effectType = card.type;
        this.duration = card.duration;
        this.radius = card.type == "zone" ? 1 : 0;
    }

    draw(ctx) {
        drawEffectToken(ctx, this);
    }
}

function main() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    game = new Game();
    drawScene(0);
}

function drawScene(newTime) {
    const deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.draw(ctx, deltaTime);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}