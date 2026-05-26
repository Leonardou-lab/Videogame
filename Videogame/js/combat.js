"use strict";

// Combat logic: ally and enemy attacks traps
Object.assign(Game.prototype, {

    alliesAttack() {
        for (const ally of this.allies) {
            if (ally.hp <= 0) continue;
            if (ally.damage <= 0) continue;
const target = this.findNearestEnemy(ally, ally.range);
            if (target) {
                target.takeDamage(ally.damage);
                if (ally.type === "archer" || ally.type === "mage") triggerUnitAnim(ally);
                this.addLog(`${ally.cardName} hits a skeleton for ${ally.damage}.`); 
            }
        }
    },
// Boss-specific logic for summoning minions
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
                adjacentAlly.takeDamage(enemy.damage);
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

    // Boss-specific logic for summoning minions
    triggerTrap(enemy) {
        const effect = this.getEffect(enemy.row, enemy.col);
        if (effect && effect.name === "Exile") {
            enemy.stunTurns  = effect.duration;
            effect.duration  = 0;
            this.addLog(`Exile triggers: ${enemy.name} stunned.`);
        }
    },

    // Finds the nearest enemy within a given range
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

    // Finds an adjacent ally to the given enemy
    findAdjacentAlly(enemy) {
        return this.allies.find(ally => ally.hp > 0 && this.areObjectsAdjacent(enemy, ally));
    },

    // Calculates the distance between two objects on the board
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

    areObjectsAdjacent(first, second) {
        return this.getObjectDistance(first, second) <= 1;
    },

});
