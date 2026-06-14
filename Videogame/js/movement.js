"use strict";

// This file handles all movement on the board.
// The king moves when the player clicks a tile, enemies move toward the king each turn,
// and zone effects like Peace Treaty or Royal Curse are applied here too.

Object.assign(Game.prototype, {

    // Moves the king one tile in the given direction if the destination is free.
    // The Royal Guard follows along automatically, and desperation resets on a successful move.
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
        if (window.cowardKingAudio) {
            window.cowardKingAudio.stopLoopSfx("desperationCritical");
            window.cowardKingAudio.playSfx("movementKing");
        }
        this.moveMode          = false;
        this.addLog("The king runs with dignity.");
        this.endPlayerTurn();
    },

    // Moves an enemy one step closer to the king, or toward a Decoy if one is on the board.
    // Tries diagonal first, then straight. Never steps on the king's tile.
    moveEnemyTowardKing(enemy) {
        if (enemy.isBoss && enemy.moveEveryTurns > 0 && this.turn % enemy.moveEveryTurns !== 0) return;
        const decoy  = this.allies.find(a => a.cardName === "Decoy" && a.hp > 0);
        const target = decoy || this.king;

        const rowStep = Math.sign(target.row - enemy.row);
        const colStep = Math.sign(target.col - enemy.col);
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

    // Returns true if placing a unit at the given tile would overlap the king's position.
    unitWouldCoverKing(unit, row, col) {
        const span = unit.tileSpan || 1;
        return this.king.row >= row &&
            this.king.row < row + span &&
            this.king.col >= col &&
            this.king.col < col + span;
    },

    // Pushes an enemy one tile away from the king, used when a zone effect knocks them back.
    pushEnemyAway(enemy) {
        const rowStep = Math.sign(enemy.row - this.king.row);
        const colStep = Math.sign(enemy.col - this.king.col);
        const row     = enemy.row + rowStep;
        const col     = enemy.col + colStep;

        if (this.canUnitOccupyTiles(enemy, row, col)) {
            enemy.setTile(row, col);
        }
    },

    // Checks every enemy against active zone effects and marks them as slowed or cursed for this turn.
    applyZoneEffects() {
        for (const enemy of this.enemies) {
            enemy.slowedThisTurn = false;
            enemy.cursedThisTurn = false;
            for (const effect of this.effects) {
                const distance = tileDistance(enemy, effect);
                if (effect.name === "Peace Treaty" && distance <= effect.radius) {
                    enemy.slowedThisTurn = true;
                }
                if (effect.name === "Royal Curse" && distance <= effect.radius) {
                    enemy.cursedThisTurn = true;
                }
            }
        }
    },

});
