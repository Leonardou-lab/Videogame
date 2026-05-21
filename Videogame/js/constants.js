"use strict";

const canvasWidth    = 620;
const canvasHeight   = 620;
const boardSize      = 8;
const tileSize       = 70;
const boardX         = 30;
const boardY         = 30;
const maxTurns       = 30;
const startingAP     = 7;
const enemiesPerTurn = 1;

const keyDirections = {
    ArrowUp:    { row: -1, col:  0 },
    ArrowDown:  { row:  1, col:  0 },
    ArrowLeft:  { row:  0, col: -1 },
    ArrowRight: { row:  0, col:  1 },
    w: { row: -1, col:  0 },
    s: { row:  1, col:  0 },
    a: { row:  0, col: -1 },
    d: { row:  0, col:  1 },
    q: { row: -1, col: -1 },
    e: { row: -1, col:  1 },
    z: { row:  1, col: -1 },
    c: { row:  1, col:  1 },
};

const cardPool = [];
