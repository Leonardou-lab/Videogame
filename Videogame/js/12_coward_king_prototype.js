"use strict";

/*
 * The Coward King — Game entry point.
 *
 *   constants.js  - game constants, card pool, key mapping
 *   tileMath.js   - tile math (tileToPosition, positionToTile, tileDistance, clamp)
 *   renderer.js   -pure drawing primitives (drawToken, drawBackground, etc.)
 *   entities.js   - class hierarchy (BoardObject, Unit, King, Ally, Enemy, BoardEffect)
 *   board.js      - board queries + board/highlight rendering (Game.prototype)
 *   movement.js   - king & enemy movement, zone push/slow (Game.prototype)
 *   combat.js     - ally/enemy attacks, traps, targeting (Game.prototype)
 *   turn.js       - turn phases, AP, gold, card draw/play (Game.prototype)
 *   ui.js         - HUD rendering, input events (Game.prototype)
 */

let ctx;
let game;
let oldTime = 0;
// Main game class, containing all game state and the main draw() method.
class Game {
    constructor() {
        this.hudElement  = document.getElementById("hud");
        this.handElement = document.getElementById("hand");
        this.logElement  = document.getElementById("log");
        this.createEventListeners();
        this.currentLevelIndex = 0;
        this.currentHorde      = 1;
        this.isBossFight       = false;
        this.pendingApBonus    = 0;
        this.upgradeRegistry   = {};
        this.restart();
    }

    draw(ctx) {
        drawBackground(ctx);
        this.drawBoard(ctx);
        this.drawHighlights(ctx);

        for (const obstacle of this.obstacles) obstacle.draw(ctx);
        for (const ally   of this.allies)  ally.draw(ctx);
        for (const enemy  of this.enemies) enemy.draw(ctx);
        for (const effect of this.effects) effect.draw(ctx);
        this.king.draw(ctx);

        if (this.status !== "playing") {
            drawEndBanner(ctx, this.message, this.status === "won");
        }
    }
}

async function main() {
    if (typeof loadGameData === "function") {
        await loadGameData(1);
    }

    loadSprites();

    const canvas  = document.getElementById("canvas");
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx  = canvas.getContext("2d");
    game = new Game();
    drawScene(0);
}

function drawScene(newTime) {
    const deltaTime = newTime - oldTime;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    game.draw(ctx, deltaTime);
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
