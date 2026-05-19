"use strict";

Object.assign(Game.prototype, {

    alliesAttack() {
        for (const ally of this.allies) {
            if (ally.damage <= 0) continue;
            const target = this.findNearestEnemy(ally, ally.range);
            if (target) {
                target.takeDamage(ally.damage);
                this.addLog(`${ally.cardName} hits a skeleton for ${ally.damage}.`);
            }
        }
    },

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
    },

    triggerTrap(enemy) {
        const effect = this.getEffect(enemy.row, enemy.col);
        if (effect && effect.name === "Exile") {
            enemy.stunTurns  = effect.duration;
            effect.duration  = 0;
            this.addLog("Exile triggers: skeleton stunned.");
        }
    },

    findNearestEnemy(origin, range) {
        let nearest         = undefined;
        let nearestDistance = Infinity;
        for (const enemy of this.enemies) {
            const distance = tileDistance(origin, enemy);
            if (distance <= range && distance < nearestDistance) {
                nearest         = enemy;
                nearestDistance = distance;
            }
        }
        return nearest;
    },

    findAdjacentAlly(enemy) {
        return this.allies.find(ally => tileDistance(enemy, ally) <= 1);
    },

});
