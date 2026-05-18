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

class Game {
    constructor() {
        this.hudElement = document.getElementById("hud");
        this.handElement = document.getElementById("hand");
        this.logElement = document.getElementById("log");
        this.createEventListeners();
        this.restart();
    }

    restart() {
        this.turn = 1;
        this.ap = startingAP;
        this.gold = 0;
        this.phase = "player";
        this.selectedCard = undefined;
        this.moveMode = false;
        this.kingMovedThisTurn = false;
        this.status = "playing";
        this.message = "Protect the king for 30 turns.";
        this.king = new King(4, 4);
        this.allies = [];
        this.enemies = [];
        this.effects = [];
        this.hand = this.drawCards(3);
        this.spawnEnemies();
        this.logLines = [];
        this.addLog("Horde started. Choose a card or move the king.");
        this.renderUI();
    }

    drawCards(amount) {
        const cards = [];
        const pool = [...cardPool];
        for (let i = 0; i < amount && pool.length > 0; i++) {
            const index = randomRange(pool.length);
            cards.push(pool.splice(index, 1)[0]);
        }
        return cards;
    }

    createEventListeners() {
        document.getElementById("moveKingButton").addEventListener("click", () => {
            if (this.status != "playing" || this.phase != "player") return;
            this.selectedCard = undefined;
            this.moveMode = true;
            this.addLog("Move mode: click a highlighted tile or use keyboard directions.");
            this.renderUI();
        });

        document.getElementById("endTurnButton").addEventListener("click", () => {
            this.endPlayerTurn();
        });

        document.getElementById("restartButton").addEventListener("click", () => {
            this.restart();
        });

        document.getElementById("canvas").addEventListener("click", event => {
            this.handleCanvasClick(event);
        });

        window.addEventListener("keydown", event => {
            if (this.status != "playing" || this.phase != "player") return;
            if (event.key in keyDirections) {
                this.tryMoveKing(keyDirections[event.key].row, keyDirections[event.key].col);
            }
            if (event.key == " ") {
                this.endPlayerTurn();
            }
            if (event.key == "Escape") {
                this.selectedCard = undefined;
                this.moveMode = false;
                this.renderUI();
            }
        });
    }

    handleCanvasClick(event) {
        if (this.status != "playing" || this.phase != "player") return;

        const rect = event.target.getBoundingClientRect();
        const scaleX = canvasWidth / rect.width;
        const scaleY = canvasHeight / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        const tile = positionToTile(x, y);

        if (!tile) return;

        if (this.moveMode) {
            this.tryMoveKing(tile.row - this.king.row, tile.col - this.king.col);
            return;
        }

        if (this.selectedCard) {
            this.playCard(tile.row, tile.col);
            return;
        }

        if (tile.row == this.king.row && tile.col == this.king.col) {
            this.moveMode = true;
            this.addLog("King selected. Choose a neighboring tile.");
            this.renderUI();
        }
    }

    tryMoveKing(rowDelta, colDelta) {
        if (!this.moveMode) return;
        if (Math.abs(rowDelta) > 1 || Math.abs(colDelta) > 1 || (rowDelta == 0 && colDelta == 0)) return;

        const row = this.king.row + rowDelta;
        const col = this.king.col + colDelta;

        if (!this.isInsideBoard(row, col)) return;
        if (this.getBlockingObject(row, col)) {
            this.addLog("The king cannot move to an occupied tile.");
            return;
        }

        this.king.setTile(row, col);
        this.kingMovedThisTurn = true;
        this.moveMode = false;
        this.addLog("The king runs with dignity.");
        this.endPlayerTurn();
    }

    playCard(row, col) {
        const card = this.selectedCard;
        if (!card) return;
        if (!this.isInsideBoard(row, col)) return;
        if (this.ap < card.cost) {
            this.addLog("Not enough AP.");
            return;
        }
        if (this.getBlockingObject(row, col) || this.getEffect(row, col)) {
            this.addLog("That tile is occupied.");
            return;
        }

        this.ap -= card.cost;

        if (card.type == "ally") {
            this.allies.push(new Ally(row, col, card));
        } else {
            this.effects.push(new BoardEffect(row, col, card));
        }

        this.selectedCard = undefined;
        this.addLog(`${card.name} played.`);
        this.renderUI();
    }

    endPlayerTurn() {
        if (this.status != "playing" || this.phase != "player") return;
        this.selectedCard = undefined;
        this.moveMode = false;
        this.phase = "enemy";
        this.resolveTurn();
    }

    resolveTurn() {
        this.applyZoneEffects();
        this.alliesAttack();
        this.enemiesAttackAndMove();
        this.cleanupObjects();
        this.tickEffects();
        this.checkDefeat();

        if (this.status == "playing") {
            if (this.turn >= maxTurns) {
                this.status = "won";
                this.message = "Horde survived. Prototype victory!";
                this.gold += 10;
                this.addLog("Victory: the king survived 30 turns.");
            } else {
                this.turn++;
                const kingMovedLastTurn = this.kingMovedThisTurn;
                if (!kingMovedLastTurn) {
                    this.ap += 1;
                }
                this.spawnEnemies();
                this.phase = "player";
                this.kingMovedThisTurn = false;
                if (kingMovedLastTurn) {
                    this.addLog(`Turn ${this.turn}. The King moved: no AP gained.`);
                } else {
                    this.addLog(`Turn ${this.turn}. The King held position: AP +1.`);
                }
            }
        }

        this.renderUI();
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