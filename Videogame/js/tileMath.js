"use strict";

function tileToPosition(row, col) {
    return new Vector(
        boardX + col * tileSize + tileSize / 2,
        boardY + row * tileSize + tileSize / 2
    );
}

function positionToTile(x, y) {
    if (x < boardX || y < boardY) return undefined;
    const col = Math.floor((x - boardX) / tileSize);
    const row = Math.floor((y - boardY) / tileSize);
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return undefined;
    return { row, col };
}

function tileDistance(a, b) {
    return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value)); 
}
