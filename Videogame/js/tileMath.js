"use strict";

// Utility functions for converting between tile coordinates and pixel positions, calculating distances, and clamping values
function tileToPosition(row, col) {
    return new Vector(
        boardX + col * tileSize + tileSize / 2,
        boardY + row * tileSize + tileSize / 2
    );
}

// Converts pixel coordinates to tile coordinates, returning undefined if outside the board
function positionToTile(x, y) {
    if (x < boardX || y < boardY) return undefined;
    const col = Math.floor((x - boardX) / tileSize);
    const row = Math.floor((y - boardY) / tileSize);
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return undefined;
    return { row, col };
}
// Calculates the distance between two tiles using Chebyshev distance, which is appropriate for grid movement that allows diagonal steps
function tileDistance(a, b) {
    return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}
// Clamps a value between a minimum and maximum
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value)); 
}
