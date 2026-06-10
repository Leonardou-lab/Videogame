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

    getCurrentHandSize() {
        const isIntroHorde = this.currentLevelIndex === 0 && !this.isBossFight && this.currentHorde === 1;
        return isIntroHorde ? introHandSize : maxHandSize;
    },

    canChooseKeepCard() {
        if (this.status !== "won" || !this.hand || this.hand.length === 0) return false;
        if (!this.isBossFight) return true;
        return this.currentLevelIndex + 1 < levelConfigs.length;
    },

    chooseCardToKeep(card) {
        if (!this.canChooseKeepCard()) return;
        this.keptCardName = card.name;
        this.addLog(`${card.name} will stay in the next hand.`);
        this.renderUI();
    },

    // adds AP up to the max, called each turn the king didn't move
    gainAP(amount) {
        this.ap = Math.min(maxActionPoints, this.ap + amount);
    },

    applyLevelBackground() {
        const level = this.getCurrentLevelConfig();
        if (!level.backgroundImage) return;
        document.body.style.setProperty("--level-background", `url("../${level.backgroundImage}")`);
        if (window.cowardKingAudio) {
            window.cowardKingAudio.setLevel(level);
        }
    },

    updateDesperation(kingMovedLastTurn) {
        if (kingMovedLastTurn) {
            this.desperation = 0;
            if (window.cowardKingAudio) {
                window.cowardKingAudio.stopLoopSfx("desperationCritical");
            }
            return;
        }

        this.desperation = Math.min(maxDesperation, this.desperation + 1);
        if (this.desperation >= maxDesperation - 1 && window.cowardKingAudio) {
            window.cowardKingAudio.startLoopSfx("desperationCritical");
        }
        if (this.desperation >= maxDesperation) {
            this.status = "lost";
            this.message = "Defeat: the King surrendered to desperation.";
            this.addLog(this.message);
            if (window.cowardKingAudio) {
                window.cowardKingAudio.stopLoopSfx("desperationCritical");
                window.cowardKingAudio.playSfx("desperationDeath");
            }
        }
    },

    // moves the game forward after a win, either to the next horde, the boss fight, or the next level
    advanceProgressionAfterVictory() {
        const level = this.getCurrentLevelConfig();

        if (this.isBossFight) {
            const nextLevelIndex = this.currentLevelIndex + 1;
            this.currentHorde = 1;
            this.isBossFight = false;
            this.pendingApBonus = 0;
            if (nextLevelIndex < levelConfigs.length) {
                this.currentLevelIndex = nextLevelIndex;
                const nextLevel = this.getCurrentLevelConfig();
                this.nextEncounterMessage = `${level.name} cleared. Entering Level ${nextLevel.levelNumber} - ${nextLevel.name}.`;
            } else {
                this.currentLevelIndex = 0;
                this.nextEncounterMessage = `${level.name} cleared. The Coward King prototype is complete. Restarting from Level 1.`;
            }
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

    // resets back to the start of the full game after losing
    resetProgressionAfterDefeat() {
        const level = this.getCurrentLevelConfig();
        this.currentLevelIndex = 0;
        this.currentHorde = 1;
        this.isBossFight = false;
        this.pendingApBonus = 0;
        this.keptCardName = undefined;
        this.upgradeRegistry = {};
        this.nextEncounterMessage = `Defeat in ${level.name}. The run restarts from Level 1 - Horde 1.`;
    },

    showFinalVictoryScreen() {
        document.getElementById("winOverlay").classList.add("open");
    },

    // sets up the next encounter after a win or loss, resetting all game state
    restart() {
        if (window.cowardKingAudio) {
            window.cowardKingAudio.stopLoopSfx("desperationCritical");
        }
        const needsNewRun = this.status !== "won";

        if (this.status === "won") {
            if (this.isBossFight && this.currentLevelIndex + 1 >= levelConfigs.length) {
                this.showFinalVictoryScreen();
                return;
            }
            this.advanceProgressionAfterVictory();
        } else if (this.status === "lost") {
            this.resetProgressionAfterDefeat();
        }

        const level            = this.getCurrentLevelConfig();
        this.applyLevelBackground();
        this.turn              = 1;
        this.ap                = Math.min(startingAP, maxActionPoints);
        this.pendingApBonus    = 0;
        this.gold              = this.status === "won" ? this.gold : 0;
        this.phase             = "player";
        this.selectedCard      = undefined;
        this.moveMode          = false;
        this.kingMovedThisTurn = false;
        this.desperation       = 0;
        this.status            = "playing";
        this.message           = `Protect the king through Level ${level.levelNumber}.`;
        this.king              = new King(4, 4);
        this.allies            = [];
        this.enemies           = [];
        this.effects           = [];
        this.obstacles         = [];
        this.hand              = this.drawCards(this.getCurrentHandSize());
        this.keptCardName      = undefined;
        this.logLines          = [];
        this.encounterKills    = 0;
        this.encounterUpgrades = 0;
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

        if (needsNewRun) startRun();

        this.renderUI();
    },

    // picks random cards from the pool and applies any upgrades the player has bought
    drawCards(amount) {
        const cards = [];
        const pool  = [...cardPool];

        if (this.keptCardName) {
            const keptIndex = pool.findIndex(card => card.name === this.keptCardName);
            if (keptIndex !== -1) {
                cards.push(this.applyUpgradeToCard(pool.splice(keptIndex, 1)[0]));
            }
        }

        while (cards.length < amount && pool.length > 0) {
            const index = randomRange(pool.length);
            cards.push(this.applyUpgradeToCard(pool.splice(index, 1)[0]));
        }
        return cards.slice(0, amount);
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

    getPlacementLimitForCard(card) {
        const level = card.upgradeLevel || 0;
        if (level >= 3) return 3;
        if (level >= 2) return 5;
        return Infinity;
    },

    countPlacedCardsByName(cardName) {
        const allies = this.allies.filter(ally => ally.cardName === cardName && ally.hp > 0).length;
        const effects = this.effects.filter(effect => effect.name === cardName && effect.duration > 0).length;
        return allies + effects;
    },

    hasReachedPlacementLimit(card) {
        const limit = this.getPlacementLimitForCard(card);
        if (!Number.isFinite(limit)) return false;
        return this.countPlacedCardsByName(card.name) >= limit;
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
        if (this.hasReachedPlacementLimit(card)) {
            const limit = this.getPlacementLimitForCard(card);
            this.addLog(`${card.name} placement limit reached: max ${limit} on the board at upgrade level ${card.upgradeLevel}.`);
            this.renderUI();
            return;
        }

        this.ap -= card.cost;

        if (card.type === "ally") {
            this.allies.push(new Ally(row, col, card));
        } else if (card.name === "Bomb") {
            const blast = new BoardEffect(row, col, card);
            const dmg   = card.damage ?? 40;
            let hits    = 0;
            for (const enemy of this.enemies) {
                if (tileDistance(enemy, blast) <= blast.radius) {
                    enemy.takeDamage(dmg);
                    hits++;
                }
            }
            this.addLog(`Bomb explodes! ${hits} enem${hits === 1 ? "y" : "ies"} hit for ${dmg} damage.`);
        } else {
            this.effects.push(new BoardEffect(row, col, card));
        }

        this.selectedCard = undefined;
        this.addLog(`${card.name} played.`);
        if (window.cowardKingAudio) {
            window.cowardKingAudio.playCardSfx(card.name);
        }
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
        const wasPlaying        = this.status === "playing";
        const kingMovedLastTurn = this.kingMovedThisTurn;

        this.applyZoneEffects();
        if (this.currentHorde >= 2 || this.isBossFight) {
            this.enemiesAttackAndMove();
            this.alliesAttack();
        } else {
            this.alliesAttack();
            this.enemiesAttackAndMove();
        }
        this.cleanupObjects();
        this.tickEffects();
        this.checkDefeat();

        if (this.status === "playing") {
            this.updateDesperation(kingMovedLastTurn);
        }

        if (this.status === "playing") {
            const bossDefeated = this.isBossFight && !this.enemies.some(enemy => enemy.isBoss);
            if (bossDefeated) {
                this.status         = "won";
                this.message        = `${this.getCurrentLevelConfig().boss.name} defeated. Level cleared!`;
                this.gold          += 25;
                this.pendingApBonus = 0;
                this.addLog(`Victory: ${this.getCurrentLevelConfig().boss.name} has fallen.`);
            } else if (!this.isBossFight && this.turn >= this.getCurrentTurnLimit()) {
                this.status         = "won";
                this.message        = `Horde ${this.currentHorde} survived.`;
                this.gold          += 10;
                this.pendingApBonus = 0;
                this.addLog(`Victory: Level ${this.getCurrentLevelConfig().levelNumber} Horde ${this.currentHorde} cleared. The King escaped.`);
            } else {
                this.turn++;
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

        if (wasPlaying && this.status !== "playing") {
            if (window.cowardKingAudio) {
                window.cowardKingAudio.stopLoopSfx("desperationCritical");
                if (this.status === "won") {
                    window.cowardKingAudio.playSfx("victory");
                } else if (this.message !== "Defeat: the King surrendered to desperation.") {
                    window.cowardKingAudio.playSfx("defeat");
                }
            }
            const goldEarned = this.status === "won" ? (this.isBossFight ? 25 : 10) : 0;
            saveStats({
                kills:    this.encounterKills,
                gold:     goldEarned,
                upgrades: this.encounterUpgrades,
                runs:     1,
                levels:   this.status === "won" && this.isBossFight ? 1 : 0,
            });
            if (this.status === "lost") {
                recordDeath();
            } else if (this.status === "won" && !this.isBossFight) {
                const hordeId = this.currentLevelIndex * 3 + this.currentHorde;
                completeHorde(hordeId, this.turn, this.encounterKills);
            } else if (this.status === "won" && this.isBossFight) {
                const nextLevelIndex = this.currentLevelIndex + 1;
                advanceRunLevel(nextLevelIndex < levelConfigs.length ? nextLevelIndex + 1 : levelConfigs.length);
            }
            this.encounterKills    = 0;
            this.encounterUpgrades = 0;
        }

        this.renderUI();
    },

});
