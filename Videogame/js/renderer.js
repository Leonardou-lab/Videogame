"use strict";

// This file contains all the drawing functions used to paint things on the canvas.
// Units, obstacles, effects, highlights, and the end screen banner are all drawn here.

// Returns a short text label for a unit type, used as a fallback when no sprite is available.
function labelForType(type) {
    const labels = {
        king:     "K",
        skeleton: "S",
        boss:     "B",
        ogre:     "O",
        ogreboss: "OB",
        elitewarrior: "E",
        braveking: "BK",
        knight:   "k",
        archer:   "->",
        wall:     "W",
        trap:     "T",
        zone:     "Z",
    };
    return labels[type] || "?";
}

// Draws a unit on the board. If the unit is slowed or cursed it draws a color tint over the sprite.
function drawToken(ctx, unit) {
    if (drawSprite(ctx, unit)) {
        if (unit.slowedThisTurn || unit.cursedThisTurn) {
            const span     = unit.tileSpan || 1;
            const drawSize = tileSize * span - 6;
            const cx       = boardX + unit.col * tileSize + (tileSize * span) / 2;
            const cy       = boardY + unit.row * tileSize + (tileSize * span) / 2;
            ctx.save();
            if (unit.slowedThisTurn) {
                ctx.fillStyle = "rgba(180, 230, 255, 0.38)";
                ctx.fillRect(Math.round(cx - drawSize / 2), Math.round(cy - drawSize / 2), drawSize, drawSize);
            }
            if (unit.cursedThisTurn) {
                ctx.fillStyle = "rgba(192, 57, 43, 0.35)";
                ctx.fillRect(Math.round(cx - drawSize / 2), Math.round(cy - drawSize / 2), drawSize, drawSize);
            }
            ctx.restore();
        }
        drawHpBar(ctx, unit);
    }
}

// Draws a card effect token on the board, like an Exile trap or a Peace Treaty zone.
function drawEffectToken(ctx, effect) {
    const x      = effect.position.x;
    const y      = effect.position.y;
    const radius = 20;

    ctx.save();
    ctx.globalAlpha  = 0.86;
    ctx.fillStyle    = effect.effectType === "zone" ? "#4b1d63" : "#2b2036";
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle  = effect.effectType === "zone" ? "#c995d8" : "#e6c16a";
    ctx.lineWidth    = 3;
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);
    drawCenteredText(ctx, labelForType(effect.effectType), x, y + 1, "24px Georgia", "#f4ecd8");
    ctx.restore();
}

// Draws a rubble obstacle token with a stone texture look.
function drawObstacleToken(ctx, obstacle) {
    const x = obstacle.position.x;
    const y = obstacle.position.y;
    const radius = 24;

    ctx.save();
    ctx.fillStyle = "#171412";
    ctx.fillRect(x - radius + 4, y - radius + 5, radius * 2, radius * 2);

    ctx.fillStyle = "#2d2926";
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = "#6d6253";
    ctx.lineWidth = 4;
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);

    ctx.fillStyle = "#463d35";
    ctx.fillRect(x - 16, y - 12, 15, 13);
    ctx.fillRect(x + 1, y - 18, 17, 15);
    ctx.fillRect(x - 10, y + 3, 24, 16);
    ctx.strokeStyle = "rgba(230, 193, 106, 0.22)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - radius + 6, y - radius + 6, radius * 2 - 12, radius * 2 - 12);
    ctx.restore();
}

// Fills the canvas background with a dark overlay each frame before drawing anything else.
function drawBackground(ctx) {
    ctx.fillStyle = "rgba(13, 11, 10, 0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Draws a colored overlay on a single tile, used for move and placement highlights.
function drawTileOverlay(ctx, row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(boardX + col * tileSize, boardY + row * tileSize, tileSize, tileSize);
}

// Draws text centered on a given point with a specified font and color.
function drawCenteredText(ctx, text, x, y, font, color) {
    ctx.font          = font;
    ctx.fillStyle     = color;
    ctx.textAlign     = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(text, x, y);
    ctx.textAlign     = "left";
    ctx.textBaseline  = "alphabetic";
}

// Draws the victory or game over banner in the center of the screen.
function drawEndBanner(ctx, text, won) {
    const boxW = 520;
    const boxH = 132;
    const boxX = (canvasWidth  - boxW) / 2;
    const boxY = (canvasHeight - boxH) / 2;

    ctx.fillStyle = "rgba(10, 10, 12, 0.78)";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = won ? "#77d879" : "#d85c5c";
    ctx.lineWidth   = 4;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    drawCenteredText(ctx, won ? "VICTORY" : "GAME OVER", canvasWidth / 2, boxY + 42, "42px Arial", won ? "#77d879" : "#d85c5c");
    drawCenteredText(ctx, text, canvasWidth / 2, boxY + 90, "20px Arial", "#fff");
}
