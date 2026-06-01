"use strict";

Object.assign(Game.prototype, {

    isInSafeZone(row, col) {
        return Math.abs(row - this.king.row) <= 1 && Math.abs(col - this.king.col) <= 1;
    },

    isInsideBoard(row, col) {
        return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
    },

    getBlockingObject(row, col) {
        return [this.king, ...this.obstacles, ...this.allies, ...this.enemies]
            .find(obj => this.objectOccupiesTile(obj, row, col));
    },

    objectOccupiesTile(object, row, col) {
        const span = object.tileSpan || 1;
        return row >= object.row &&
            row < object.row + span &&
            col >= object.col &&
            col < object.col + span;
    },

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

   // Checks if a unit is currently standing in the safe zone
    unitOccupiesSafeZone(unit) {
        const span = unit.tileSpan || 1;
        for (let row = unit.row; row < unit.row + span; row++) {
            for (let col = unit.col; col < unit.col + span; col++) {
                if (this.isInSafeZone(row, col)) return true;
            }
        }
        return false;
    },

    getEffect(row, col) {
        return this.effects.find(e => e.row === row && e.col === col);
    },

    // Distance between centers of two objects 
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

    // Enemy behavior: attack adjacent ally or move toward king
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

    // Spawns the boss at the center of the board
    spawnBoss() {
        const bossStats = this.getCurrentLevelConfig().boss;
        const spawnCol = Math.floor((boardSize - (bossStats.tileSpan || 2)) / 2);
        this.enemies.push(new Boss(0, spawnCol, bossStats));
        this.addLog(`${bossStats.name} enters the throne room.`);
    },

    // Summons a minion for the boss
    summonBossMinion() {
        const level = this.getCurrentLevelConfig();
        const spawnTile = this.getRandomSpawnTile(["top", "left", "right"]);
        if (!spawnTile) return;
        this.enemies.push(new Enemy(spawnTile.row, spawnTile.col, level.bossSummon));
        this.addLog(`${level.boss.name} summons a ${level.bossSummon.name}.`);
    },

    // Generates obstacles on the board
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

    // Checks if a tile is on the edge of the board where enemies can spawn
    isSpawnEdgeTile(row, col) {
        return row === 0 || row === boardSize - 1 || col === 0 || col === boardSize - 1;
    },

    // Cleans up defeated objects from the board
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

    // Updates the duration of active effects
    tickEffects() {
        for (const effect of this.effects) {
            if (effect.effectType === "zone") effect.duration--;
        }
    },

    // Checks if the player has lost the game
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

    // Draws the game board
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

    // Draws highlight overlays on the board
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
