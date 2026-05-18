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

    cleanupObjects() {
        const defeated = this.enemies.filter(enemy => enemy.hp <= 0).length;
        if (defeated > 0) {
            this.addLog(`${defeated} skeleton defeated.`);
        }
        this.enemies = this.enemies.filter(enemy => enemy.hp > 0);
        this.allies = this.allies.filter(ally => ally.hp > 0);
        this.effects = this.effects.filter(effect => effect.duration > 0);
    }

    applyZoneEffects() {
        for (const enemy of this.enemies) {
            enemy.slowedThisTurn = false;
            for (const effect of this.effects) {
                const distance = tileDistance(enemy, effect);
                if (effect.name == "Royal Decree" && distance <= effect.radius) {
                    this.pushEnemyAway(enemy);
                }
                if (effect.name == "Peace Treaty" && distance <= effect.radius && this.turn % 2 == 0) {
                    enemy.slowedThisTurn = true;
                }
            }
        }
    }

    pushEnemyAway(enemy) {
        const rowStep = Math.sign(enemy.row - this.king.row);
        const colStep = Math.sign(enemy.col - this.king.col);
        const row = enemy.row + rowStep;
        const col = enemy.col + colStep;

        if (this.isInsideBoard(row, col) && !this.getBlockingObject(row, col)) {
            enemy.setTile(row, col);
        }
    }

    tickEffects() {
        for (const effect of this.effects) {
            if (effect.effectType == "zone") {
                effect.duration--;
            }
        }
    }

    alliesAttack() {
        for (const ally of this.allies) {
            if (ally.damage <= 0) continue;
            const target = this.findNearestEnemy(ally, ally.range);
            if (target) {
                target.takeDamage(ally.damage);
                this.addLog(`${ally.cardName} hits a skeleton for ${ally.damage}.`);
            }
        }
    }

    findNearestEnemy(origin, range) {
        let nearest = undefined;
        let nearestDistance = Infinity;
        for (const enemy of this.enemies) {
            const distance = tileDistance(origin, enemy);
            if (distance <= range && distance < nearestDistance) {
                nearest = enemy;
                nearestDistance = distance;
            }
        }
        return nearest;
    }

    enemiesAttackAndMove() {
        for (const enemy of this.enemies) {
            if (enemy.hp <= 0) continue;
            if (enemy.stunTurns > 0) {
                enemy.stunTurns--;
                continue;
            }
            if (enemy.slowedThisTurn) continue;

            const adjacentAlly = this.findAdjacentAlly(enemy);
            if (adjacentAlly) {
                adjacentAlly.takeDamage(enemy.damage);
                this.addLog("A skeleton attacks a defender.");
                continue;
            }

            this.moveEnemyTowardKing(enemy);
            this.triggerTrap(enemy);
        }
    }

    moveEnemyTowardKing(enemy) {
        const rowStep = Math.sign(this.king.row - enemy.row);
        const colStep = Math.sign(this.king.col - enemy.col);
        const options = [
            { row: enemy.row + rowStep, col: enemy.col + colStep },
            { row: enemy.row + rowStep, col: enemy.col },
            { row: enemy.row, col: enemy.col + colStep },
        ];

        for (const option of options) {
            if (!this.isInsideBoard(option.row, option.col)) continue;
            if (option.row == this.king.row && option.col == this.king.col) continue;
            const blocker = this.getBlockingObject(option.row, option.col);
            if (!blocker || blocker.type == "skeleton") {
                enemy.setTile(option.row, option.col);
                return;
            }
        }
    }

    findAdjacentAlly(enemy) {
        for (const ally of this.allies) {
            if (tileDistance(enemy, ally) <= 1) return ally;
        }
        return undefined;
    }

    triggerTrap(enemy) {
        const effect = this.getEffect(enemy.row, enemy.col);
        if (effect && effect.name == "Exile") {
            enemy.stunTurns = effect.duration;
            effect.duration = 0;
            this.addLog("Exile triggers: skeleton stunned.");
        }
    }

    spawnEnemies() {
        const occupiedCols = [];
        for (let i = 0; i < enemiesPerTurn; i++) {
            let col = randomRange(boardSize);
            let attempts = 0;
            while ((occupiedCols.includes(col) || this.getBlockingObject(0, col)) && attempts < 20) {
                col = randomRange(boardSize);
                attempts++;
            }
            if (!this.getBlockingObject(0, col)) {
                occupiedCols.push(col);
                this.enemies.push(new Enemy(0, col));
            }
        }
    }

    checkDefeat() {
        if (this.status != "playing") return;
        const enemiesInSafeZone = this.enemies.filter(enemy => this.isInSafeZone(enemy.row, enemy.col)).length;
        if (enemiesInSafeZone >= 2) {
            this.status = "lost";
            this.message = "Defeat: 2 enemies entered the safe zone.";
            this.addLog(this.message);
        }
    }

    isInSafeZone(row, col) {
        return Math.abs(row - this.king.row) <= 1 && Math.abs(col - this.king.col) <= 1;
    }

    isInsideBoard(row, col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    }

    getBlockingObject(row, col) {
        const objects = [this.king, ...this.allies, ...this.enemies];
        return objects.find(object => object.row == row && object.col == col);
    }

    getEffect(row, col) {
        return this.effects.find(effect => effect.row == row && effect.col == col);
    }

    draw(ctx) {
        drawBackground(ctx);
        this.drawBoard(ctx);
        this.drawHighlights(ctx);

        for (const effect of this.effects) effect.draw(ctx);
        for (const ally of this.allies) ally.draw(ctx);
        for (const enemy of this.enemies) enemy.draw(ctx);
        this.king.draw(ctx);

        if (this.status != "playing") {
            drawEndBanner(ctx, this.message, this.status == "won");
        }
    }

    drawBoard(ctx) {
        const boardWidth = boardSize * tileSize;
        const boardHeight = boardSize * tileSize;

        ctx.save();
        ctx.fillStyle = "#130f0d";
        ctx.fillRect(boardX - 12, boardY - 12, boardWidth + 24, boardHeight + 24);
        ctx.strokeStyle = "#8b6a2e";
        ctx.lineWidth = 5;
        ctx.strokeRect(boardX - 10, boardY - 10, boardWidth + 20, boardHeight + 20);
        ctx.strokeStyle = "#2a1a0f";
        ctx.lineWidth = 3;
        ctx.strokeRect(boardX - 3, boardY - 3, boardWidth + 6, boardHeight + 6);
        ctx.restore();

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = boardX + col * tileSize;
                const y = boardY + row * tileSize;
                ctx.fillStyle = (row + col) % 2 == 0 ? "#3f4652" : "#252c35";
                ctx.fillRect(x, y, tileSize, tileSize);

                if (this.isInSafeZone(row, col)) {
                    ctx.fillStyle = "rgba(230, 193, 106, 0.34)";
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.strokeStyle = "rgba(230, 193, 106, 0.42)";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
                }

                ctx.strokeStyle = "#11161d";
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, tileSize, tileSize);

                ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
                ctx.fillRect(x + 4, y + 4, tileSize - 8, 4);
            }
        }
    }

    drawHighlights(ctx) {
        if (this.moveMode) {
            for (let row = this.king.row - 1; row <= this.king.row + 1; row++) {
                for (let col = this.king.col - 1; col <= this.king.col + 1; col++) {
                    if (!this.isInsideBoard(row, col)) continue;
                    if (row == this.king.row && col == this.king.col) continue;
                    if (this.getBlockingObject(row, col)) continue;
                    drawTileOverlay(ctx, row, col, "rgba(102, 196, 255, 0.42)");
                }
            }
        }

        if (this.selectedCard) {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    if (!this.getBlockingObject(row, col) && !this.getEffect(row, col)) {
                        drawTileOverlay(ctx, row, col, "rgba(112, 219, 143, 0.25)");
                    }
                }
            }
        }
    }

    renderUI() {
        this.hudElement.innerHTML = `
            <div>Turn: ${this.turn}/${maxTurns}</div>
            <div>Phase: ${this.phase}</div>
            <div>AP: ${this.ap}</div>
            <div>Gold: ${this.gold}</div>
            <div>Enemies: ${this.enemies.length}</div>
            <div>Status: ${this.status}</div>
        `;

        this.handElement.innerHTML = "";
        for (const card of this.hand) {
            const button = document.createElement("button");
            button.className = "cardButton";
            if (this.selectedCard == card) {
                button.classList.add("selected");
            }
            button.disabled = this.status != "playing" || this.phase != "player" || this.ap < card.cost;
            button.innerHTML = `
                <div class="cardTop">
                    <strong>${card.name}</strong>
                    <em>${card.cost} AP</em>
                </div>
                <span>${card.text}</span>
            `;
            button.addEventListener("click", () => {
                this.selectedCard = card;
                this.moveMode = false;
                this.renderUI();
            });
            this.handElement.appendChild(button);
        }

        this.logElement.innerHTML = this.logLines.map(line => `<div class="logLine">${line}</div>`).join("");
    }

    addLog(text) {
        if (!this.logLines) this.logLines = [];
        this.logLines.unshift(text);
        this.logLines = this.logLines.slice(0, 8);
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

function tileToPosition(row, col) {
    return new Vector(
        boardX + col * tileSize + tileSize / 2,
        boardY + row * tileSize + tileSize / 2
    );
}

function positionToTile(x, y) {
    if (x < boardX || y < boardY) return undefined;
    const col = Math.floor((x - boardX) / tileSize);
    const row = Math.floor((y - boardY) / tileSize);
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return undefined;
    return { row, col };
}

function tileDistance(a, b) {
    return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function labelForType(type) {
    const labels = {
        king: "♔",
        skeleton: "☠",
        knight: "⚔",
        archer: "➶",
        wall: "▪",
        trap: "✦",
        zone: "◇",
    };
    return labels[type] || "?";
}

function tokenStyle(type) {
    const styles = {
        king: { fill: "#d9aa3b", border: "#f5d77c", shadow: "#5a320e", text: "#231407" },
        skeleton: { fill: "#4b1515", border: "#c05b4c", shadow: "#160808", text: "#f5dfba" },
        knight: { fill: "#253f6b", border: "#8fb1df", shadow: "#0a1729", text: "#f4ecd8" },
        archer: { fill: "#275238", border: "#9ad091", shadow: "#0b1b10", text: "#f4ecd8" },
        wall: { fill: "#4e4b47", border: "#b5a888", shadow: "#151311", text: "#f4ecd8" },
    };
    return styles[type] || { fill: "#4b1d63", border: "#c995d8", shadow: "#18091f", text: "#f4ecd8" };
}

function drawToken(ctx, unit) {
    const style = tokenStyle(unit.type);
    const x = unit.position.x;
    const y = unit.position.y;
    const radius = 22;

    ctx.save();
    ctx.fillStyle = style.shadow;
    ctx.fillRect(x - radius + 4, y - radius + 6, radius * 2, radius * 2);
    ctx.fillStyle = style.fill;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = style.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - radius + 5, y - radius + 5, radius * 2 - 10, radius * 2 - 10);
    drawCenteredText(ctx, labelForType(unit.type), x, y - 3, "28px Georgia", style.text);
    if (unit.type != "king") {
        drawCenteredText(ctx, unit.hp, x, y + 17, "11px Courier New", style.text);
    }
    ctx.restore();
}

function drawEffectToken(ctx, effect) {
    const x = effect.position.x;
    const y = effect.position.y;
    const radius = 20;

    ctx.save();
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = effect.effectType == "zone" ? "#4b1d63" : "#2b2036";
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = effect.effectType == "zone" ? "#c995d8" : "#e6c16a";
    ctx.lineWidth = 3;
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
    drawCenteredText(ctx, labelForType(effect.effectType), x, y + 1, "24px Georgia", "#f4ecd8");
    ctx.restore();
}

function drawBackground(ctx) {
    ctx.fillStyle = "rgba(13, 11, 10, 0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawTileOverlay(ctx, row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(boardX + col * tileSize, boardY + row * tileSize, tileSize, tileSize);
}

function drawCenteredText(ctx, text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
}

function drawEndBanner(ctx, text, won) {
    ctx.fillStyle = "rgba(10, 10, 12, 0.78)";
    ctx.fillRect(70, 220, 660, 132);
    ctx.strokeStyle = won ? "#77d879" : "#d85c5c";
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 220, 660, 132);
    drawCenteredText(ctx, won ? "VICTORY" : "DEFEAT", canvasWidth / 2, 262, "42px Arial", won ? "#77d879" : "#d85c5c");
    drawCenteredText(ctx, text, canvasWidth / 2, 312, "20px Arial", "#fff");
}