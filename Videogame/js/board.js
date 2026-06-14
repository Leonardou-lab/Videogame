"use strict";

// This file handles everything related to the game board.
// It checks if tiles are valid, spawns enemies and obstacles,
// draws the board and highlights, and decides if the player has lost.

Object.assign(Game.prototype, {

    // Returns true if the tile is inside the safe zone around the king.
    isInSafeZone(row, col) {
        return Math.abs(row - this.king.row) <= 1 && Math.abs(col - this.king.col) <= 1;
    },

    // Returns true if the tile is within the board boundaries.
    isInsideBoard(row, col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    },

    // Returns whatever unit or obstacle is sitting on a tile, or undefined if it is empty.
    getBlockingObject(row, col) {
        return [this.king, ...this.obstacles, ...this.allies, ...this.enemies]
            .find(obj => this.objectOccupiesTile(obj, row, col));
    },

    // Checks if an object covers a specific tile, accounting for units that take up more than one tile.
    objectOccupiesTile(object, row, col) {
        const span = object.tileSpan || 1;
        return row >= object.row &&
            row < object.row + span &&
            col >= object.col &&
            col < object.col + span;
    },

    // Returns true if a unit can be placed at the given position without going out of bounds or overlapping anything.
    canUnitOccupyTiles(unit, row, col) {
        const span = unit.tileSpan || 1;
        if (row < 0 || col < 0 || row + span > boardSize || col + span > boardSize) return false;

        for (let r = row; r < row + span; r++) {
            for (let c = col; c < col + span; c++) {
                const blocker = this.getBlockingObject(r, c);
                if (blocker && blocker !== unit) return false;
            }
        }

        return true;
    },

    // Returns true if any part of the unit is standing inside the safe zone.
    unitOccupiesSafeZone(unit) {
        const span = unit.tileSpan || 1;
        for (let row = unit.row; row < unit.row + span; row++) {
            for (let col = unit.col; col < unit.col + span; col++) {
                if (this.isInSafeZone(row, col)) return true;
            }
        }
        return false;
    },

    // Returns the active effect on a tile if there is one.
    getEffect(row, col) {
        return this.effects.find(e => e.row === row && e.col === col);
    },

    // Spawns a few enemies at the edges of the board based on the current horde settings.
    spawnEnemies() {
        if (this.isBossFight) return;

        const config = this.getCurrentHordeConfig();
        const spawnAmount = Math.min(
            config.enemiesPerTurn,
            Math.max(0, config.maxEnemiesOnBoard - this.enemies.length)
        );

        for (let i = 0; i < spawnAmount; i++) {
            const spawnTile = this.getRandomSpawnTile(config.spawnEdges);
            if (spawnTile) {
                this.enemies.push(new Enemy(spawnTile.row, spawnTile.col, this.getCurrentLevelConfig().normalEnemy));
            }
        }
    },

    // Finds a random empty tile on the edge of the board to spawn an enemy on.
    getRandomSpawnTile(edges) {
        const availableEdges = edges && edges.length > 0 ? edges : ["top"];

        for (let attempts = 0; attempts < 40; attempts++) {
            const edge = availableEdges[randomRange(availableEdges.length)];
            let row = 0;
            let col = 0;

            if (edge === "top") {
                row = 0;
                col = randomRange(boardSize);
            } else if (edge === "bottom") {
                row = boardSize - 1;
                col = randomRange(boardSize);
            } else if (edge === "left") {
                row = randomRange(boardSize);
                col = 0;
            } else if (edge === "right") {
                row = randomRange(boardSize);
                col = boardSize - 1;
            }

            if (!this.getBlockingObject(row, col) && !this.getEffect(row, col) && !this.isInSafeZone(row, col)) {
                return { row, col };
            }
        }

        return undefined;
    },

    // Spawns the boss at the top center of the board.
    spawnBoss() {
        const bossStats = this.getCurrentLevelConfig().boss;
        const spawnCol = Math.floor((boardSize - (bossStats.tileSpan || 2)) / 2);
        this.enemies.push(new Boss(0, spawnCol, bossStats));
        this.addLog(`${bossStats.name} enters the throne room.`);
    },

    // Spawns a regular enemy as a minion summoned by the boss.
    summonBossMinion() {
        const level = this.getCurrentLevelConfig();
        const spawnTile = this.getRandomSpawnTile(["top", "left", "right"]);
        if (!spawnTile) return;
        this.enemies.push(new Enemy(spawnTile.row, spawnTile.col, level.bossSummon));
        this.addLog(`${level.boss.name} summons a ${level.bossSummon.name}.`);
    },

    // Places random obstacles on the board avoiding the safe zone and spawn edges.
    generateObstacles() {
        this.obstacles = [];
        const config = this.isBossFight
            ? this.getCurrentLevelConfig().bossEncounter
            : this.getCurrentHordeConfig();
        const targetCount = config.obstacleCount || 0;

        for (let attempts = 0; this.obstacles.length < targetCount && attempts < 80; attempts++) {
            const row = randomRange(boardSize);
            const col = randomRange(boardSize);

            if (this.isInSafeZone(row, col)) continue;
            if (this.isSpawnEdgeTile(row, col)) continue;
            if (this.getBlockingObject(row, col) || this.getEffect(row, col)) continue;

            this.obstacles.push(new Obstacle(row, col));
        }
    },

    // Returns true if the tile is on the outer edge of the board.
    isSpawnEdgeTile(row, col) {
        return row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1;
    },

    // Removes dead enemies, dead allies, and expired effects from the board.
    cleanupObjects() {
        const defeated = this.enemies.filter(e => e.hp <= 0).length;
        if (defeated > 0) {
            this.addLog(`${defeated} enemy defeated.`);
            this.encounterKills += defeated;
        }
        this.enemies = this.enemies.filter(e => e.hp > 0);
        this.allies  = this.allies.filter(a => a.hp > 0);
        this.effects = this.effects.filter(e => e.duration > 0);
    },

    // Counts down the duration of all active zone effects by one turn.
    tickEffects() {
        for (const effect of this.effects) {
            if (effect.effectType === "zone") effect.duration--;
        }
    },

    // Checks if enemies have overrun the safe zone and ends the game if they have.
    checkDefeat() {
        if (this.status !== "playing") return;
        const pressure = this.enemies
            .filter(e => this.unitOccupiesSafeZone(e))
            .reduce((total, enemy) => total + (enemy.safeZoneWeight || 1), 0);

        if (pressure >= 2) {
            this.status  = "lost";
            this.message = "Defeat: the safe zone was overrun.";
            this.addLog(this.message);
            triggerUnitAnim(this.king, true);
        }
    },

    // Draws the board tiles, the safe zone highlight, and any active zone effects.
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

                for (const effect of this.effects) {
                    if (effect.name === "Peace Treaty" &&
                        Math.abs(row - effect.row) <= effect.radius &&
                        Math.abs(col - effect.col) <= effect.radius) {
                        ctx.fillStyle   = "rgba(255, 255, 255, 0.18)";
                        ctx.fillRect(x, y, tileSize, tileSize);
                        ctx.strokeStyle = "rgba(200, 200, 200, 0.35)";
                        ctx.lineWidth   = 2;
                        ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
                    }
                    if (effect.name === "Royal Curse" &&
                        Math.abs(row - effect.row) <= effect.radius &&
                        Math.abs(col - effect.col) <= effect.radius) {
                        ctx.fillStyle   = "rgba(192, 57, 43, 0.18)";
                        ctx.fillRect(x, y, tileSize, tileSize);
                        ctx.strokeStyle = "rgba(192, 57, 43, 0.35)";
                        ctx.lineWidth   = 2;
                        ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);
                    }
                }

                ctx.strokeStyle = "#11161d";
                ctx.lineWidth   = 2;
                ctx.strokeRect(x, y, tileSize, tileSize);

                ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
                ctx.fillRect(x + 4, y + 4, tileSize - 8, 4);
            }
        }
    },

    // Shows blue tiles when the king can move and green tiles when a card is selected.
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
