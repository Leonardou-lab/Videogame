"use strict";

const canvasWidth    = 620;
const canvasHeight   = 620;
const boardSize      = 8;
const tileSize       = 70;
const boardX         = 30;
const boardY         = 30;
const startingAP     = 7;
const maxActionPoints = 7;
const maxHandSize     = 3;

const levelConfigs = [
    {
        levelNumber: 1,
        name: "Catacombs",
        normalEnemy: {
            name: "Skeleton",
            type: "skeleton",
            color: "#9b2f35",
            hp: 50,
            damage: 15,
            range: 1,
            speed: 1,
            safeZoneWeight: 1,
        },
        boss: {
            name: "Skeleton King",
            type: "boss",
            color: "#6f1d2b",
            hp: 200,
            damage: 30,
            range: 1,
            speed: 1,
            safeZoneWeight: 2,
            tileSpan: 2,
            summonEveryTurns: 3,
        },
        bossSummon: {
            name: "Skeleton Vanguard",
            type: "skeleton",
            color: "#7f2430",
            hp: 80,
            damage: 22,
            range: 1,
            speed: 1,
            safeZoneWeight: 1,
        },
        hordes: [
            {
                hordeNumber: 1,
                maxTurns: 18,
                enemiesPerTurn: 1,
                maxEnemiesOnBoard: 8,
                obstacleCount: 0,
                spawnEdges: ["top"],
            },
            {
                hordeNumber: 2,
                maxTurns: 24,
                enemiesPerTurn: 1,
                maxEnemiesOnBoard: 10,
                obstacleCount: 2,
                spawnEdges: ["top", "left", "right"],
            },
            {
                hordeNumber: 3,
                maxTurns: 30,
                enemiesPerTurn: 2,
                maxEnemiesOnBoard: 12,
                obstacleCount: 4,
                spawnEdges: ["top", "left", "right", "bottom"],
            },
        ],
        bossEncounter: {
            obstacleCount: 0,
        },
    },
];

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

const cardPool = [
    {
        name:   "Knight",
        type:   "ally",
        cost:   3,
        hp:     80,
        damage: 30,
        range:  1,
        color:  "#4677c8", 
        text:   "Melee ally. Attacks adjacent enemies.",
    },
    {
        name:   "Archer",
        type:   "ally",
        cost:   2,
        hp:     50,
        damage: 20,
        range:  3,
        color:  "#4b9d69",
        text:   "Stationary ranged ally. Range 3.",
    },
    {
        name:   "Wall",
        type:   "ally",
        cost:   3,
        hp:     150,
        damage: 0,
        range:  0,
        color:  "#7c7d82",
        text:   "Blocks a tile and absorbs attacks.",
    },
    {
        name:     "Exile",
        type:     "trap",
        cost:     2,
        duration: 2,
        color:    "#9b59b6",
        text:     "Trap. Stuns an enemy for 2 turns.",
    },
    {
        name:     "Royal Decree",
        type:     "zone",
        cost:     3,
        duration: 3,
        color:    "#d6a632",
        text:     "3x3 zone. Pushes enemies 1 tile away.",
    },
    {
        name:     "Peace Treaty",
        type:     "zone",
        cost:     2,
        duration: 4,
        color:    "#55b7b3",
        text:     "3x3 zone. Slows enemies every other turn.",
    },
];
