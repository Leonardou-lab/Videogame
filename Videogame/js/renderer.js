"use strict";

function labelForType(type) {
    const labels = {
        king:     "K",
        skeleton: "S",
        boss:     "B",
        knight:   "k",
        archer:   "->",
        wall:     "W",
        trap:     "T",
        zone:     "Z",
    };
    return labels[type] || "?";
}

function drawToken(ctx, unit) {
    if (drawSprite(ctx, unit)) {
        drawHpBar(ctx, unit);
    }
}

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

function drawBackground(ctx) {
    ctx.fillStyle = "rgba(13, 11, 10, 0.72)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawTileOverlay(ctx, row, col, color) {
    ctx.fillStyle = color;
    ctx.fillRect(boardX + col * tileSize, boardY + row * tileSize, tileSize, tileSize);
}

function drawCenteredText(ctx, text, x, y, font, color) {
    ctx.font          = font;
    ctx.fillStyle     = color;
    ctx.textAlign     = "center";
    ctx.textBaseline  = "middle";
    ctx.fillText(text, x, y);
    ctx.textAlign     = "left";
    ctx.textBaseline  = "alphabetic";
}

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
