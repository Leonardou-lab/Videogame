"use strict";

function labelForType(type) {
    const labels = {
        king:     "K",
        skeleton: "S",
        knight:   "k",
        archer:   "->",
        wall:     "W",
        trap:     "T",
        zone:     "Z",
    };
    return labels[type] || "?";
}

function tokenStyle(type) {
    const styles = {
        king:     { fill: "#d9aa3b", border: "#f5d77c", shadow: "#5a320e", text: "#231407" },
        skeleton: { fill: "#4b1515", border: "#c05b4c", shadow: "#160808", text: "#f5dfba" },
        knight:   { fill: "#253f6b", border: "#8fb1df", shadow: "#0a1729", text: "#f4ecd8" },
        archer:   { fill: "#275238", border: "#9ad091", shadow: "#0b1b10", text: "#f4ecd8" },
        wall:     { fill: "#4e4b47", border: "#b5a888", shadow: "#151311", text: "#f4ecd8" },
    };
    return styles[type] || { fill: "#4b1d63", border: "#c995d8", shadow: "#18091f", text: "#f4ecd8" };
}

function drawToken(ctx, unit) {
    const style  = tokenStyle(unit.type);
    const x      = unit.position.x;
    const y      = unit.position.y;
    const radius = 22;

    ctx.save();
    ctx.fillStyle = style.shadow;
    ctx.fillRect(x - radius + 4, y - radius + 6, radius * 2, radius * 2);

    ctx.fillStyle = style.fill;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    ctx.strokeStyle = style.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(x - radius, y - radius, radius * 2, radius * 2);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - radius + 5, y - radius + 5, radius * 2 - 10, radius * 2 - 10);

    drawCenteredText(ctx, labelForType(unit.type), x, y - 3, "28px Georgia", style.text);
    if (unit.type !== "king") {
        drawCenteredText(ctx, unit.hp, x, y + 17, "11px Courier New", style.text);
    }
    ctx.restore();
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
    ctx.fillStyle = "rgba(10, 10, 12, 0.78)";
    ctx.fillRect(70, 220, 660, 132);
    ctx.strokeStyle = won ? "#77d879" : "#d85c5c";
    ctx.lineWidth   = 4;
    ctx.strokeRect(70, 220, 660, 132);
    drawCenteredText(ctx, won ? "VICTORY" : "DEFEAT", canvasWidth / 2, 262, "42px Arial", won ? "#77d879" : "#d85c5c");
    drawCenteredText(ctx, text, canvasWidth / 2, 312, "20px Arial", "#fff");
}
