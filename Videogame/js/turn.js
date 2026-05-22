"use strict";

// Turn and progression management: advancing turns, tracking hordes and boss fights, handling victory and defeat conditions, and managing the player's hand of cards (Game.prototype).
Object.assign(Game.prototype, {

    // Retrieves the current level configuration based on the player's progression.
    getCurrentLevelConfig() {
        return levelConfigs[this.currentLevelIndex] || levelConfigs[0];
    },
// Retrieves the current horde configuration based on the player's progression within the current level.
    getCurrentHordeConfig() {
        const level = this.getCurrentLevelConfig();
        return level.hordes.find(horde => horde.hordeNumber === this.currentHorde) || level.hordes[0];
    },
// Retrieves the turn limit for the current encounter, which is used to determine victory conditions for surviving hordes (boss fights have no turn limit).
    getCurrentTurnLimit() {
        return this.isBossFight ? 99 : this.getCurrentHordeConfig().maxTurns;
    },
// Increases the player's AP by a given amount, up to the maximum allowed. The player gains 1 AP at the start of each turn if they did not move the king on the previous turn, which encourages strategic movement decisions.
    gainAP(amount) {
        this.ap = Math.min(maxActionPoints, this.ap + amount);
    },
// Advances the game to the next turn, handling all end-of-turn logic including applying zone effects, resolving combat, checking victory/defeat conditions, and preparing for the next turn. If the player wins by surviving a horde or defeating a boss, progression is advanced for the next encounter. If the player loses, progression is reset.
    advanceProgressionAfterVictory() {
        const level = this.getCurrentLevelConfig();

        if (this.isBossFight) {
            this.currentHorde = 1;
            this.isBossFight = false;
            this.pendingApBonus = 0;
            this.nextEncounterMessage = `${level.name} cleared. Level 1 prototype complete. Restarting Level 1.`;
            return;
        }

        if (this.currentHorde < level.hordes.length) {
            this.currentHorde++;
            this.nextEncounterMessage = `The King escaped. Remaining enemies vanish. Prepare for Level ${level.levelNumber} - Horde ${this.currentHorde}.`;
            return;
        }

        this.isBossFight = true;
        this.nextEncounterMessage = `The King escaped the final horde. Boss fight unlocked: ${level.boss.name}.`;
    },
// Resets progression to the first horde of the current level after a defeat, which encourages players to learn from their mistakes and try different strategies to survive longer in the earlier hordes before facing the boss.
    resetProgressionAfterDefeat() {
        const level = this.getCurrentLevelConfig();
        this.currentHorde = 1;
        this.isBossFight = false;
        this.pendingApBonus = 0;
        this.nextEncounterMessage = `Defeat resets ${level.name} to Horde 1.`;
    },
// Restarts the current encounter, which is called after a victory or defeat to set up the next encounter based on the player's progression. This method initializes all game state for the new encounter, including the king's position, allies, enemies, effects, obstacles, player's hand of cards, and logs an appropriate message about the new encounter.
    restart() {
        if (this.status === "won") {
            this.advanceProgressionAfterVictory();
        } else if (this.status === "lost") {
            this.resetProgressionAfterDefeat();
        }

        const level            = this.getCurrentLevelConfig();
        this.turn              = 1;
        this.ap                = Math.min(startingAP, maxActionPoints);
        this.pendingApBonus    = 0;
        this.gold              = 0;
        this.phase             = "player";
        this.selectedCard      = undefined;
        this.moveMode          = false;
        this.kingMovedThisTurn = false;
        this.status            = "playing";
        this.message           = "Protect the king for 30 turns.";
        this.king              = new King(4, 4);
        this.allies            = [];
        this.enemies           = [];
        this.effects           = [];
        this.obstacles         = [];
        this.hand              = this.drawCards(maxHandSize);
        this.logLines          = [];
        this.generateObstacles();
        if (this.isBossFight) {
            this.spawnBoss();
        } else {
            this.spawnEnemies();
        }

        if (this.nextEncounterMessage) {
            this.addLog(this.nextEncounterMessage);
            this.nextEncounterMessage = "";
        }
        if (this.isBossFight) {
            this.addLog(`${level.boss.name} must be defeated to clear Level ${level.levelNumber}.`);
        } else {
            this.addLog(`Level ${level.levelNumber} - Horde ${this.currentHorde} started.`);
        }
        this.renderUI();
    },

    // Moves the king to a new tile if it's a valid move, which is called when the player clicks on a tile while in move mode. Moving the king costs the player their movement for the turn, so they cannot move again or play cards after moving. This encourages players to carefully consider when and where to move the king, as it can be a powerful defensive maneuver but also limits their options for that turn.
    drawCards(amount) {
        const cards = [];
        const pool  = [...cardPool];
        for (let i = 0; i < amount && pool.length > 0; i++) {
            const index = randomRange(pool.length);
            cards.push(pool.splice(index, 1)[0]);
        }
        return cards;
    },

    // Spawns enemies for the current horde based on the level configuration, which is called at the start of each turn during enemy phase. Enemies spawn on the edge of the board and will try to move toward the king, so players must be prepared to defend against new threats each turn while also managing existing enemies.
    playCard(row, col) {
        const card = this.selectedCard;
        if (!card) return;
        if (!this.isInsideBoard(row, col)) return;
        if (this.ap < card.cost) {
            this.addLog("Not enough AP.");
            return;
        }
        if (this.getBlockingObject(row, col) || this.getEffect(row, col)) {
            this.addLog("That tile is occupied.");
            return; 
        }

        this.ap -= card.cost;

        if (card.type === "ally") {
            this.allies.push(new Ally(row, col, card));
        } else {
            this.effects.push(new BoardEffect(row, col, card));
        }

        this.selectedCard = undefined;
        this.addLog(`${card.name} played.`);
        this.renderUI();
    },

    // Ends the player's turn and advances to the enemy phase, which is called when the player clicks the "End Turn" button or moves the king. This method checks if the player has already ended their turn or if it's not currently the player's phase, and if not, it transitions to the enemy phase and calls resolveTurn() to handle all enemy actions and end-of-turn logic.
    endPlayerTurn() {
        if (this.status !== "playing" || this.phase !== "player") return;
        this.selectedCard = undefined;
        this.moveMode     = false;
        this.phase        = "enemy";
        this.resolveTurn();
    },

    // Resolves all enemy actions and end-of-turn logic, which is called at the end of the player's turn. This method applies zone effects, resolves combat for allies and enemies, checks victory and defeat conditions, and prepares for the next turn by incrementing the turn counter, granting AP if the king did not move, and spawning new enemies if it's not a boss fight. This method is central to the game's turn-based mechanics and ensures that all game state is updated correctly at the end of each turn.
    resolveTurn() {
        this.applyZoneEffects();
        this.alliesAttack();
        this.enemiesAttackAndMove();
        this.cleanupObjects();
        this.tickEffects();
        this.checkDefeat();

        if (this.status === "playing") {
            const bossDefeated = this.isBossFight && !this.enemies.some(enemy => enemy.isBoss);
            if (bossDefeated) {
                this.status         = "won";
                this.message        = "Boss defeated. Level cleared!";
                this.gold          += 25;
                this.pendingApBonus = 0;
                this.addLog("Victory: the Skeleton King has fallen.");
            } else if (!this.isBossFight && this.turn >= this.getCurrentTurnLimit()) {
                this.status         = "won";
                this.message        = `Horde ${this.currentHorde} survived.`;
                this.gold          += 10;
                this.pendingApBonus = 0;
                this.addLog(`Victory: Level ${this.getCurrentLevelConfig().levelNumber} Horde ${this.currentHorde} cleared. The King escaped.`);
            } else {
                this.turn++;
                const kingMovedLastTurn = this.kingMovedThisTurn;
                if (!kingMovedLastTurn) this.gainAP(1);
                if (!this.isBossFight) {
                    this.spawnEnemies();
                }
                this.phase             = "player";
                this.kingMovedThisTurn = false;
                if (kingMovedLastTurn) {
                    this.addLog(`Turn ${this.turn}. The King moved: no AP gained.`);
                } else {
                    this.addLog(`Turn ${this.turn}. The King held position: AP +1, capped at ${maxActionPoints}.`);
                }
            }
        }

        this.renderUI();
    },

});
