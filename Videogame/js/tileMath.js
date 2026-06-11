"use strict";

// Small utility file with math helpers used all over the game.
// Converts between tile coordinates and pixel positions, measures distances, and clamps numbers.

// Converts a tile position to the pixel coordinates of its center on the canvas.
function tileToPosition(row, col) {
    return new Vector(
        boardX + col * tileSize + tileSize / 2,
        boardY + row * tileSize + tileSize / 2
    );
}

// Converts pixel coordinates back to a tile. Returns undefined if the point is outside the board.
function positionToTile(x, y) {
    if (x < boardX || y < boardY) return undefined;
    const col = Math.floor((x - boardX) / tileSize);
    const row = Math.floor((y - boardY) / tileSize);
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return undefined;
    return { row, col };
}

// Returns the distance between two tiles, counting diagonal steps as 1 just like a chess king moves.
function tileDistance(a, b) {
    return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

// Keeps a number within a given range by cutting it off at the min or max.
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
