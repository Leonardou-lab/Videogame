"use strict";

// This file handles all the combat that happens each turn.
// Allies attack enemies, enemies attack allies or move toward the king,
// traps trigger when an enemy steps on them, and damage is calculated here.

Object.assign(Game.prototype, {

    // Makes every ally on the board attack the closest enemy in range.
    alliesAttack() {
        for (const ally of this.allies) {
            if (ally.hp <= 0) continue;
            if (ally.damage <= 0) continue;
            const target = this.findNearestEnemy(ally, ally.range);
            if (target) {
                target.takeDamage(ally.damage);
                if (["archer", "mage", "knight", "pikeman", "guardian"].includes(ally.type)) triggerUnitAnim(ally);
                this.addLog(`${ally.cardName} hits a skeleton for ${ally.damage}.`);
            }
        }
    },

    // Moves each enemy toward the king or attacks a nearby ally if one is adjacent.
    // Bosses also summon minions on certain turns and enemies can be stunned or slowed.
    enemiesAttackAndMove() {
        for (const enemy of [...this.enemies]) {
            if (enemy.hp <= 0) continue;
            if (enemy.isBoss && enemy.summonEveryTurns > 0 && this.turn % enemy.summonEveryTurns === 0) {
                this.summonBossMinion();
            }
            if (enemy.stunTurns > 0) {
                enemy.stunTurns--;
                continue;
            }
            if (enemy.slowedThisTurn) continue;

            const adjacentAlly = this.findAdjacentAlly(enemy);
            if (adjacentAlly) {
                let dmg = enemy.cursedThisTurn ? Math.floor(enemy.damage * 0.5) : enemy.damage;
                if (this.isProtectedBySquire(adjacentAlly)) dmg = Math.floor(dmg * 0.5);
                adjacentAlly.takeDamage(dmg);
                triggerUnitAnim(enemy);
                this.addLog(`${enemy.name} attacks a defender.`);
                continue;
            }

            const moveSteps = Math.max(1, enemy.speed || 1);
            for (let step = 0; step < moveSteps; step++) {
                const previousRow = enemy.row;
                const previousCol = enemy.col;
                this.moveEnemyTowardKing(enemy);
                this.triggerTrap(enemy);
                if (enemy.stunTurns > 0) break;
                if (enemy.row === previousRow && enemy.col === previousCol) break;
            }
        }
    },

    // Checks if an enemy stepped on an Exile trap and stuns them if so.
    triggerTrap(enemy) {
        const effect = this.getEffect(enemy.row, enemy.col);
        if (effect && effect.name === "Exile") {
            enemy.stunTurns  = effect.duration;
            effect.duration  = 0;
            this.addLog(`Exile triggers: ${enemy.name} stunned.`);
        }
    },

    // Returns the closest enemy to a unit within a given attack range.
    findNearestEnemy(origin, range) {
        let nearest         = undefined;
        let nearestDistance = Infinity;
        for (const enemy of this.enemies) {
            if (enemy.hp <= 0) continue;
            const distance = this.getObjectDistance(origin, enemy);
            if (distance <= range && distance < nearestDistance) {
                nearest         = enemy;
                nearestDistance = distance;
            }
        }
        return nearest;
    },

    // Returns an ally that is right next to the given enemy, or undefined if there is none.
    findAdjacentAlly(enemy) {
        return this.allies.find(ally => ally.hp > 0 && this.areObjectsAdjacent(enemy, ally));
    },

    // Calculates the tile distance between two units, accounting for units that span multiple tiles.
    getObjectDistance(first, second) {
        const firstSpan = first.tileSpan || 1;
        const secondSpan = second.tileSpan || 1;
        const firstMinRow = first.row;
        const firstMaxRow = first.row + firstSpan - 1;
        const firstMinCol = first.col;
        const firstMaxCol = first.col + firstSpan - 1;
        const secondMinRow = second.row;
        const secondMaxRow = second.row + secondSpan - 1;
        const secondMinCol = second.col;
        const secondMaxCol = second.col + secondSpan - 1;

        const rowDistance = Math.max(0, secondMinRow - firstMaxRow, firstMinRow - secondMaxRow);
        const colDistance = Math.max(0, secondMinCol - firstMaxCol, firstMinCol - secondMaxCol);
        return Math.max(rowDistance, colDistance);
    },

    // Returns true if two units are touching or diagonal to each other.
    areObjectsAdjacent(first, second) {
        return this.getObjectDistance(first, second) <= 1;
    },

    // Returns true if a Squire is close enough to protect the given ally from full damage.
    isProtectedBySquire(ally) {
        return this.allies.some(a => a.cardName === "Squire" && a.hp > 0 && this.getObjectDistance(ally, a) <= 1);
    },

});
