/*
 * The Coward King - playable prototype
 *
 * Built from the same structure used in Pong and Breakout:
 * global canvas setup, Game class, event listeners, update, draw, drawScene.
 */
 
"use strict";
 
const canvasWidth = 620;
const canvasHeight = 620;
const boardSize = 8;
const tileSize = 70;
const boardX = 30;
const boardY = 30;
const maxTurns = 30;
const startingAP = 7;
const enemiesPerTurn = 3;
 
let ctx;
let game;
let oldTime = 0;
 
function main() {
    const canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
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
 