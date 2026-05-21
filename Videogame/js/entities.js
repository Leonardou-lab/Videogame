"use strict";

// Class hierarchy for all board objects: the king, allies, enemies, obstacles, and effects (BoardObject, Unit, King, Ally, Enemy, Boss, Obstacle, BoardEffect).
class BoardObject extends GameObject {
    constructor(row, col, width, height, color, type) {
        super(tileToPosition(row, col), width, height, color, type);
        this.row = row;
        this.col = col;
    }

    setTile(row, col) {
        this.row      = clamp(row, 0, boardSize - 1);
        this.col      = clamp(col, 0, boardSize - 1);
        this.position = tileToPosition(this.row, this.col);
        this.updateCollider();
    }
}
// Units are board objects that can move and attack (king, allies, enemies).
class Unit extends BoardObject {
    constructor(row, col, color, type, hp, damage, range, speed) {
        super(row, col, tileSize - 12, tileSize - 12, color, type);
        this.maxHp          = hp;
        this.hp             = hp;
        this.damage         = damage;
        this.range          = range;
        this.speed          = speed;
        this.stunTurns      = 0;
        this.slowedThisTurn = false;
    }

    takeDamage(amount) {
        this.hp -= amount;
    }

    draw(ctx) {
        drawToken(ctx, this);
    }
}

// The king is a special unit that the player must protect.
class King extends Unit {
    constructor(row, col) {
        super(row, col, "#d8bc57", "king", 0, 0, 0, 1);
    }
}

// Allies are units summoned by the player to defend the king and attack enemies.
class Ally extends Unit {
    constructor(row, col, card) {
        super(row, col, card.color, card.name.toLowerCase(), card.hp, card.damage, card.range, 0);
        this.cardName = card.name;
    }
}
// Enemies are units that attack the king and allies. Bosses are a special type of enemy with unique mechanics.
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
    }
}
// Bosses are a special type of enemy with unique mechanics.
class Boss extends Enemy {
    constructor(row, col, stats) {
        super(row, col, { ...stats, isBoss: true });
        this.isBoss = true;
        this.tileSpan = stats.tileSpan || 2;
    }
}
// Obstacles are immobile objects that block movement and line of sight.
class Obstacle extends BoardObject {
    constructor(row, col) {
        super(row, col, tileSize - 10, tileSize - 10, "#2d2926", "obstacle");
        this.name = "Irremovable rubble";
    }

    draw(ctx) {
        drawObstacleToken(ctx, this);
    }
}
// Board effects are temporary objects created by cards that can affect units standing on them (e.g. traps or zones).
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
