"use strict";

// This file defines all the objects that can exist on the board.
// Every unit, enemy, obstacle, and card effect is a class that lives here.
// They all inherit from BoardObject so they share basic position and tile logic.

// Base class for anything that sits on the board. Handles position and tile coordinates.
class BoardObject extends GameObject {
    constructor(row, col, width, height, color, type) {
        super(tileToPosition(row, col), width, height, color, type);
        this.row = row;
        this.col = col;
    }

    // Moves the object to a new tile and updates its position on screen.
    setTile(row, col) {
        this.row      = clamp(row, 0, boardSize - 1);
        this.col      = clamp(col, 0, boardSize - 1);
        this.position = tileToPosition(this.row, this.col);
        this.updateCollider();
    }
}

// Base class for anything that can move and take damage, like the king, allies, and enemies.
class Unit extends BoardObject {
    constructor(row, col, color, type, hp, damage, range, speed) {
        super(row, col, tileSize - 12, tileSize - 12, color, type);
        this.maxHp          = hp;
        this.hp             = hp;
        this.damage         = damage;
        this.range          = range;
        this.speed          = speed;
        this.stunTurns       = 0;
        this.slowedThisTurn  = false;
        this.cursedThisTurn  = false;
    }

    // Reduces this unit's hp by the given amount.
    takeDamage(amount) {
        this.hp -= amount;
    }

    draw(ctx) {
        drawToken(ctx, this);
    }
}

// The king. The player has to keep him alive.
class King extends Unit {
    constructor(row, col) {
        super(row, col, "#d8bc57", "king", 0, 0, 0, 1);
    }
}

// An ally unit placed by the player using a card.
class Ally extends Unit {
    constructor(row, col, card) {
        super(row, col, card.color, card.name.toLowerCase(), card.hp, card.damage, card.range, 0);
        this.cardName = card.name;
    }
}

// A regular enemy that spawns each turn and tries to reach the king.
class Enemy extends Unit {
    constructor(row, col, stats) {
        const enemyStats = stats || levelConfigs[0].normalEnemy;
        super(
            row,
            col,
            enemyStats.color,
            enemyStats.type,
            enemyStats.hp,
            enemyStats.damage,
            enemyStats.range,
            enemyStats.speed
        );
        this.name = enemyStats.name;
        this.isBoss = Boolean(enemyStats.isBoss);
        this.safeZoneWeight = enemyStats.safeZoneWeight || 1;
        this.tileSpan = enemyStats.tileSpan || 1;
        this.summonEveryTurns = enemyStats.summonEveryTurns || 0;
        this.moveEveryTurns   = enemyStats.moveEveryTurns   || 0;
    }
}

// The boss enemy. Bigger, takes up more tiles, and can summon minions.
class Boss extends Enemy {
    constructor(row, col, stats) {
        super(row, col, { ...stats, isBoss: true });
        this.isBoss = true;
        this.tileSpan = stats.tileSpan || 2;
    }
}

// An obstacle tile that blocks movement and cannot be removed.
class Obstacle extends BoardObject {
    constructor(row, col) {
        super(row, col, tileSize - 10, tileSize - 10, "#2d2926", "obstacle");
        this.name = "Irremovable rubble";
    }

    draw(ctx) {
        drawObstacleToken(ctx, this);
    }
}

// A temporary effect placed on the board by a card, like a trap or a zone.
class BoardEffect extends BoardObject {
    constructor(row, col, card) {
        super(row, col, tileSize - 18, tileSize - 18, card.color, card.type);
        this.name       = card.name;
        this.effectType = card.type;
        this.duration   = card.duration;
        this.radius     = card.type === "zone" ? 1 : 0;
    }

    draw(ctx) {
        drawEffectToken(ctx, this);
    }
}
