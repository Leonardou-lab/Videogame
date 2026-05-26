"use strict";

Object.assign(Game.prototype, {

    // returns the config object for the level the player is currently on
    getCurrentLevelConfig() {
        return levelConfigs[this.currentLevelIndex] || levelConfigs[0];
    },

    // returns the config for the current horde within the current level
    getCurrentHordeConfig() {
        const level = this.getCurrentLevelConfig();
        return level.hordes.find(horde => horde.hordeNumber === this.currentHorde) || level.hordes[0];
    },

    // returns how many turns the player needs to survive (boss fights skip the limit)
    getCurrentTurnLimit() {
        return this.isBossFight ? 99 : this.getCurrentHordeConfig().maxTurns;
    },

    // adds AP up to the max, called each turn the king didn't move
    gainAP(amount) {
        this.ap = Math.min(maxActionPoints, this.ap + amount);
    },

    // moves the game forward after a win, either to the next horde, the boss fight, or back to horde 1 if the level is fully cleared
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

    // resets back to horde 1 of the current level after losing
    resetProgressionAfterDefeat() {
        const level = this.getCurrentLevelConfig();
        this.currentHorde = 1;
        this.isBossFight = false;
        this.pendingApBonus = 0;
        this.nextEncounterMessage = `Defeat resets ${level.name} to Horde 1.`;
    },

    // sets up the next encounter after a win or loss, resetting all game state
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
        this.gold              = this.status === "won" ? this.gold : 0;
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

    // picks random cards from the pool and applies any upgrades the player has bought
    drawCards(amount) {
        const cards = [];
        const pool  = [...cardPool];
        for (let i = 0; i < amount && pool.length > 0; i++) {
            const index = randomRange(pool.length);
            cards.push(this.applyUpgradeToCard(pool.splice(index, 1)[0]));
        }
        return cards;
    },

    // checks if the player has upgraded this card and applies the matching stat bonuses
    applyUpgradeToCard(card) {
        if (card.type !== "ally") return { ...card, upgradeLevel: 0 };
        const level = this.upgradeRegistry[card.name] || 0;
        if (level === 0) return { ...card, upgradeLevel: 0 };
        const tier = UPGRADE_TIERS[level];
        return {
            ...card,
            hp:           card.hp     + tier.hp,
            damage:       card.damage + tier.dmg,
            cost:         Math.max(1, card.cost - tier.ap),
            upgradeLevel: level,
        };
    },

    // places the selected card on the board if the player has enough AP and the tile is free
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
            if (card.name === "Royal Decree") {
                const effect = this.effects[this.effects.length - 1];
                for (const enemy of this.enemies) {
                    if (tileDistance(enemy, effect) <= effect.radius) {
                        this.pushEnemyAway(enemy);
                    }
                }
            }
        }

        this.selectedCard = undefined;
        this.addLog(`${card.name} played.`);
        this.renderUI();
    },

    // ends the player phase and triggers all enemy actions
    endPlayerTurn() {
        if (this.status !== "playing" || this.phase !== "player") return;
        this.selectedCard = undefined;
        this.moveMode     = false;
        this.phase        = "enemy";
        this.resolveTurn();
    },

    // handles everything at end of turn: zone effects, combat, win/loss checks, spawning enemies, and AP gain
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
