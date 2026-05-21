"use strict";

Object.assign(Game.prototype, {

    isInSafeZone(row, col) {
        return Math.abs(row - this.king.row) <= 1 && Math.abs(col - this.king.col) <= 1;
    },

    isInsideBoard(row, col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    },

    getBlockingObject(row, col) {
        return [this.king, ...this.allies, ...this.enemies]
            .find(obj => obj.row === row && obj.col === col);
    },

    getEffect(row, col) {
        return this.effects.find(e => e.row === row && e.col === col);
    },

    spawnEnemies() {
        const occupiedCols = [];
        for (let i = 0; i < enemiesPerTurn; i++) {
            let col      = randomRange(boardSize);
            let attempts = 0;
            while ((occupiedCols.includes(col) || this.getBlockingObject(0, col)) && attempts < 20) {
                col = randomRange(boardSize);
                attempts++;
            }
            if (!this.getBlockingObject(0, col)) {
                occupiedCols.push(col);
                const data = enemyPool.length > 0
                    ? enemyPool[Math.floor(Math.random() * enemyPool.length)]
                    : {};
                this.enemies.push(new Enemy(0, col, data));
            }
        }
    },

    cleanupObjects() {
        const defeated = this.enemies.filter(e => e.hp <= 0).length;
        if (defeated > 0) this.addLog(`${defeated} skeleton defeated.`);
        this.enemies = this.enemies.filter(e => e.hp > 0);
        this.allies  = this.allies.filter(a => a.hp > 0);
        this.effects = this.effects.filter(e => e.duration > 0);
    },

    tickEffects() {
        for (const effect of this.effects) {
            if (effect.effectType === "zone") effect.duration--;
        }
    },

    checkDefeat() {
        if (this.status !== "playing") return;
        const count = this.enemies.filter(e => this.isInSafeZone(e.row, e.col)).length;
        if (count >= 2) {
            this.status  = "lost";
            this.message = "Defeat: 2 enemies entered the safe zone.";
            this.addLog(this.message);
        }
    },

    drawBoard(ctx) {
        const boardWidth  = boardSize * tileSize;
        const boardHeight = boardSize * tileSize;

        ctx.save();
        ctx.fillStyle   = "#130f0d";
        ctx.fillRect(boardX - 12, boardY - 12, boardWidth + 24, boardHeight + 24);
        ctx.strokeStyle = "#8b6a2e";
        ctx.lineWidth   = 5;
        ctx.strokeRect(boardX - 10, boardY - 10, boardWidth + 20, boardHeight + 20);
        ctx.strokeStyle = "#2a1a0f";
        ctx.lineWidth   = 3;
        ctx.strokeRect(boardX - 3, boardY - 3, boardWidth + 6, boardHeight + 6);
        ctx.restore();

        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = boardX + col * tileSize;
                const y = boardY + row * tileSize;

                ctx.fillStyle = (row + col) % 2 === 0 ? "#3f4652" : "#252c35";
                ctx.fillRect(x, y, tileSize, tileSize);

                if (this.isInSafeZone(row, col)) {
                    ctx.fillStyle   = "rgba(230, 193, 106, 0.34)";
                    ctx.fillRect(x, y, tileSize, tileSize);
                    ctx.strokeStyle = "rgba(230, 193, 106, 0.42)";
                    ctx.lineWidth   = 2;
                    ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
                }

                ctx.strokeStyle = "#11161d";
                ctx.lineWidth   = 2;
                ctx.strokeRect(x, y, tileSize, tileSize);

                ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
                ctx.fillRect(x + 4, y + 4, tileSize - 8, 4);
            }
        }
    },

    drawHighlights(ctx) {
        if (this.moveMode) {
            for (let row = this.king.row - 1; row <= this.king.row + 1; row++) {
                for (let col = this.king.col - 1; col <= this.king.col + 1; col++) {
                    if (!this.isInsideBoard(row, col)) continue;
                    if (row === this.king.row && col === this.king.col) continue;
                    if (this.getBlockingObject(row, col)) continue;
                    drawTileOverlay(ctx, row, col, "rgba(102, 196, 255, 0.42)");
                }
            }
        }

        if (this.selectedCard) {
            for (let row = 0; row < boardSize; row++) {
                for (let col = 0; col < boardSize; col++) {
                    if (!this.getBlockingObject(row, col) && !this.getEffect(row, col)) {
                        drawTileOverlay(ctx, row, col, "rgba(112, 219, 143, 0.25)");
                    }
                }
            }
        }
    },

});
