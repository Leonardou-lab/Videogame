"use strict";

// maps each entity type to its sprite sheet and how many frames the animation has
const SPRITE_DEFS = {
    king:          { src: "Assets/sprites/King.png",          cols: 3, rows: 2 },
    skeleton:      { src: "Assets/sprites/Skeleton.png",      cols: 3, rows: 1 },
    boss:          { src: "Assets/sprites/Skeleton King.png", cols: 1, rows: 1 },
    knight:        { src: "Assets/sprites/Knight.png",        cols: 2, rows: 2 },
    archer:        { src: "Assets/sprites/Archer.png",        cols: 3, rows: 2 },
    wall:          { src: "Assets/sprites/Wall.png",          cols: 3, rows: 1 },
    mage:          { src: "Assets/sprites/Mage.png",          cols: 3, rows: 2 },
    guardian:      { src: "Assets/sprites/Guardian.png",      cols: 3, rows: 2 },
    ogre:          { src: "Assets/sprites/Ogre.png",          cols: 2, rows: 2 },
    ogreboss:      { src: "Assets/sprites/Ogre Boss.png",     cols: 1, rows: 1 },
    elitewarrior:  { src: "Assets/sprites/Elite Warrior.png", cols: 2, rows: 2 },
    squire:        { src: "Assets/sprites/Squire.png",        cols: 2, rows: 2 },
    pikeman:       { src: "Assets/sprites/Pikeman.png",       cols: 3, rows: 1 },
    royalguard:    { src: "Assets/sprites/Royal Guard.png",   cols: 1, rows: 1 },
    braveking:     { src: "Assets/sprites/Brave King.png",    cols: 1, rows: 1 },
    tower:         { src: "Assets/sprites/Tower.png",         cols: 1, rows: 1 },
    decoy:         { src: "Assets/sprites/Decoy.png",         cols: 1, rows: 1 },
    trench:        { src: "Assets/sprites/Trench.png",        cols: 1, rows: 1 }, 
};

const spriteImages = {};

function loadSprites() {
    for (const [key, def] of Object.entries(SPRITE_DEFS)) {
        const img = new Image();
        img.src = def.src;
        spriteImages[key] = img;
    }
}

// WeakMap so units get garbage collected normally when they leave the board
const unitAnims = new WeakMap();
const ANIM_MS = 200; // ms per frame

// starts a one-shot animation for a unit, optionally freezing on the last frame
function triggerUnitAnim(unit, keepLastFrame = false) {
    unitAnims.set(unit, { startMs: performance.now(), keepLastFrame });
}

// figures out which animation frame to show right now based on how much time has passed
function getUnitFrame(unit, totalFrames) {
    const state = unitAnims.get(unit);
    if (!state) return 0; // no animation running, stay on frame 0

    const frameIndex = Math.floor((performance.now() - state.startMs) / ANIM_MS);
    if (frameIndex >= totalFrames) {
        if (state.keepLastFrame) return totalFrames - 1;
        unitAnims.delete(unit); // done, back to idle
        return 0;
    }
    return frameIndex;
}

// converts a unit type string into a valid SPRITE_DEFS key
function spriteKey(type) {
    return type ? type.replace(/\s+/g, "").toLowerCase() : "";
}

// returns which column frame to show for the wall based on current HP
function wallFrame(unit) {
    const pct = unit.maxHp > 0 ? unit.hp / unit.maxHp : 0;
    if (pct > 0.5)  return 0;
    if (pct > 0.01) return 1;
    return 2;
}

// draws the correct animation frame for a unit
function drawSprite(ctx, unit) {
    const key = spriteKey(unit.type);
    const def = SPRITE_DEFS[key];
    const img = spriteImages[key];
    if (!def || !img || !img.complete || img.naturalWidth === 0) return false;

    const span     = unit.tileSpan || 1;
    const drawSize = tileSize * span - 6;
    const cx       = boardX + unit.col * tileSize + (tileSize * span) / 2;
    const cy       = boardY + unit.row * tileSize + (tileSize * span) / 2;

    const totalFrames = def.cols * def.rows;
    const frame       = key === "wall" ? wallFrame(unit) : getUnitFrame(unit, totalFrames);
    const frameCol    = frame % def.cols;
    const frameRow    = Math.floor(frame / def.cols);
    const frameW      = img.naturalWidth  / def.cols;
    const frameH      = img.naturalHeight / def.rows;

    ctx.save();
    ctx.drawImage(
        img,
        frameCol * frameW, frameRow * frameH, frameW, frameH,
        Math.round(cx - drawSize / 2), Math.round(cy - drawSize / 2),
        drawSize, drawSize
    );
    ctx.restore();
    return true;
}

// draws a small HP bar under the unit sprite, color shifts from green to red as HP drops
function drawHpBar(ctx, unit) {
    if (unit.type === "king" || unit.maxHp == null) return;

    const span  = unit.tileSpan || 1;
    const barW  = tileSize * span - 8;
    const barH  = 5;
    const cx    = boardX + unit.col * tileSize + (tileSize * span) / 2;
    const barY  = boardY + (unit.row + span) * tileSize - barH - 2;
    const pct   = Math.max(0, unit.hp / unit.maxHp);
    const fill  = pct > 0.5 ? "#4caf50" : pct > 0.25 ? "#ff9800" : "#f44336";

    ctx.save();
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(cx - barW / 2, barY, barW, barH);
    ctx.fillStyle = fill;
    ctx.fillRect(cx - barW / 2, barY, Math.round(barW * pct), barH);
    ctx.restore();
}
