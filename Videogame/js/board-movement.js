"use strict";

const BOARD_SIZE = 8;
const TILE_SIZE  = 64;
const BOARD_X    = 32;
const BOARD_Y    = 48;

// Tile math

function tileToPosition(row, col) {
    return new Vector(
        BOARD_X + col * TILE_SIZE + TILE_SIZE / 2,
        BOARD_Y + row * TILE_SIZE + TILE_SIZE / 2
    );
}

function positionToTile(x, y) {
    if (x < BOARD_X || y < BOARD_Y) return undefined;
    const col = Math.floor((x - BOARD_X) / TILE_SIZE);
    const row = Math.floor((y - BOARD_Y) / TILE_SIZE);
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return undefined;
    return { row, col };
}

function tileDistance(a, b) {
    return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function labelForType(type) {
    const labels = { king: "K", skeleton: "S", knight: "N", archer: "A", wall: "W" };
    return labels[type] || "?";
}

// BoardObject

class BoardObject extends GameObject {
    constructor(row, col, width, height, color, type) {
        super(tileToPosition(row, col), width, height, color, type);
        this.row = row;
        this.col = col;
    }

    setTile(row, col) {
        this.row = clamp(row, 0, BOARD_SIZE - 1);
        this.col = clamp(col, 0, BOARD_SIZE - 1);
        this.position = tileToPosition(this.row, this.col);
        if (typeof this.updateCollider === "function") this.updateCollider();
    }
}

// Unit

class Unit extends BoardObject {
    constructor(row, col, color, type, hp, damage, range, speed) {
        super(row, col, TILE_SIZE - 12, TILE_SIZE - 12, color, type);
        this.maxHp      = hp;
        this.hp         = hp;
        this.damage     = damage;
        this.range      = range;
        this.speed      = speed;
        this.stunTurns  = 0;
        this.slowedThisTurn = false;
    }

    takeDamage(amount) {
        this.hp -= amount;
    }

    draw(ctx) {
        super.draw(ctx);
        // label centered on tile
        ctx.font = "24px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labelForType(this.type), this.position.x, this.position.y - 4);
        // hp counter
        ctx.font = "12px Arial";
        ctx.fillText(this.hp, this.position.x, this.position.y + 20);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }
}

// Derived units

class King extends Unit {
    constructor(row, col) {
        super(row, col, "#d8bc57", "king", 1, 0, 0, 1);
    }
}

class Ally extends Unit {
    constructor(row, col, card) {
        super(row, col, card.color, card.name.toLowerCase(),
              card.hp, card.damage, card.range, 0);
        this.cardName = card.name;
    }
}

class Enemy extends Unit {
    constructor(row, col) {
        super(row, col, "#9b2f35", "skeleton", 50, 15, 1, 1);
    }
}

// BoardEffect

class BoardEffect extends BoardObject {
    constructor(row, col, card) {
        super(row, col, TILE_SIZE - 18, TILE_SIZE - 18, card.color, card.type);
        this.name       = card.name;
        this.effectType = card.type;
        this.duration   = card.duration;
        this.radius     = card.type === "zone" ? 1 : 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.65;
        super.draw(ctx);
        ctx.restore();
        ctx.font = "22px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name[0], this.position.x, this.position.y + 6);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }
}