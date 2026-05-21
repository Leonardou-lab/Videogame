"use strict";

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
    constructor(row, col, data = {}) {
        const hp     = data.hp     ?? 50;
        const damage = data.damage ?? 15;
        const speed  = data.speed  ?? 1;
        // primer token del nombre como identificador visual (skeleton, ogre, elite, brave…)
        const visual = (data.name ?? 'Skeleton').toLowerCase().split(' ')[0];
        super(row, col, "#9b2f35", visual, hp, damage, 1, speed);
        this.enemyName = data.name  ?? 'Skeleton';
        this.isBoss    = data.is_boss ?? false;
    }
}

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
