"use strict";

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
        this.kingMovedThisTurn = true;
        this.moveMode          = false;
        this.addLog("The king runs with dignity.");
        this.endPlayerTurn();
    },

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

    unitWouldCoverKing(unit, row, col) {
        const span = unit.tileSpan || 1;
        return this.king.row >= row &&
            this.king.row < row + span &&
            this.king.col >= col &&
            this.king.col < col + span;
    },

    pushEnemyAway(enemy) {
        const rowStep = Math.sign(enemy.row - this.king.row);
        const colStep = Math.sign(enemy.col - this.king.col);
        const row     = enemy.row + rowStep;
        const col     = enemy.col + colStep;

        if (this.canUnitOccupyTiles(enemy, row, col)) {
            enemy.setTile(row, col);
        }
    },

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
