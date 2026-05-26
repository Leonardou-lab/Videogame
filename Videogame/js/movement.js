"use strict";
// King and enemy movement, zone push
Object.assign(Game.prototype, {

    tryMoveKing(rowDelta, colDelta) {
        if (!this.moveMode) return;
        if (Math.abs(rowDelta) > 1 || Math.abs(colDelta) > 1 || (rowDelta === 0 && colDelta === 0)) return;

        const row = this.king.row + rowDelta;
        const col = this.king.col + colDelta;

        if (!this.isInsideBoard(row, col)) return;
        if (this.getBlockingObject(row, col)) {
            this.addLog("The king cannot move to an occupied tile.");
            return;
        }

        this.king.setTile(row, col);

        for (const ally of this.allies) {
            if (ally.cardName !== "Royal Guard" || ally.hp <= 0) continue;
            const guardRow = ally.row + rowDelta;
            const guardCol = ally.col + colDelta;
            if (this.isInsideBoard(guardRow, guardCol) && !this.getBlockingObject(guardRow, guardCol)) {
                ally.setTile(guardRow, guardCol);
            }
        }

        this.kingMovedThisTurn = true;
        this.desperation = 0;
        this.moveMode          = false;
        this.addLog("The king runs with dignity.");
        this.endPlayerTurn();
    },
// Enemy movement toward the king, with simple pathfinding that tries to move diagonally when possible
// Enemies will never move into the safe zone around the king, but they can move around it
    moveEnemyTowardKing(enemy) {
        if (enemy.isBoss && this.turn % enemy.summonEveryTurns !== 0) return;

        const rowStep = Math.sign(this.king.row - enemy.row);
        const colStep = Math.sign(this.king.col - enemy.col);
        const options = [
            { row: enemy.row + rowStep, col: enemy.col + colStep },
            { row: enemy.row + rowStep, col: enemy.col },
            { row: enemy.row,           col: enemy.col + colStep },
        ];

        for (const option of options) {
            if (!this.canUnitOccupyTiles(enemy, option.row, option.col)) continue;
            if (this.objectOccupiesTile(enemy, this.king.row, this.king.col)) continue;
            if (this.unitWouldCoverKing(enemy, option.row, option.col)) continue;
            {
                enemy.setTile(option.row, option.col);
                if (enemy.isBoss) this.addLog(`${enemy.name} lurches closer to the King.`);
                return;
            }
        }
    },
// Checks if moving a unit to a given tile would partially or fully cover the king, which is not allowed
    unitWouldCoverKing(unit, row, col) {
        const span = unit.tileSpan || 1;
        return this.king.row >= row &&
            this.king.row < row + span &&
            this.king.col >= col &&
            this.king.col < col + span;
    },
// Pushes an enemy one tile away from the king if it's within a zone effect that has a push component 
    pushEnemyAway(enemy) {
        const rowStep = Math.sign(enemy.row - this.king.row);
        const colStep = Math.sign(enemy.col - this.king.col);
        const row     = enemy.row + rowStep;
        const col     = enemy.col + colStep;

        if (this.canUnitOccupyTiles(enemy, row, col)) {
            enemy.setTile(row, col);
        }
    },
// Checks if a tile is within the safe zone around the king
    applyZoneEffects() {
        for (const enemy of this.enemies) {
            enemy.slowedThisTurn = false;
            for (const effect of this.effects) {
                const distance = tileDistance(enemy, effect);
                if (effect.name === "Royal Decree" && distance <= effect.radius) {
                    this.pushEnemyAway(enemy);
                }
                if (effect.name === "Peace Treaty" && distance <= effect.radius && this.turn % 2 === 0) {
                    enemy.slowedThisTurn = true;
                }
            }
        }
    },

});
