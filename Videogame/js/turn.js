"use strict";

Object.assign(Game.prototype, {

    restart() {
        const bonus            = this.pendingApBonus || 0;
        this.turn              = 1;
        this.ap                = startingAP + bonus;
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
        this.hand              = this.drawCards(3);
        this.logLines          = [];
        this.spawnEnemies();
        if (bonus > 0) {
            this.addLog(`Horde started with victory bonus: AP +${bonus}!`);
        } else {
            this.addLog("Horde started. Choose a card or move the king.");
        }
        this.renderUI();
    },

    drawCards(amount) {
        const cards = [];
        const pool  = [...cardPool];
        for (let i = 0; i < amount && pool.length > 0; i++) {
            const index = randomRange(pool.length);
            cards.push(pool.splice(index, 1)[0]);
        }
        return cards;
    },

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

    endPlayerTurn() {
        if (this.status !== "playing" || this.phase !== "player") return;
        this.selectedCard = undefined;
        this.moveMode     = false;
        this.phase        = "enemy";
        this.resolveTurn();
    },

    resolveTurn() {
        this.applyZoneEffects();
        this.alliesAttack();
        this.enemiesAttackAndMove();
        this.cleanupObjects();
        this.tickEffects();
        this.checkDefeat();

        if (this.status === "playing") {
            if (this.turn >= maxTurns) {
                this.status         = "won";
                this.message        = "Horde survived. Prototype victory!";
                this.gold          += 10;
                this.pendingApBonus = 5;
                this.addLog("Victory: the king survived 30 turns. Next horde starts with +5 AP.");
            } else {
                this.turn++;
                const kingMovedLastTurn = this.kingMovedThisTurn;
                if (!kingMovedLastTurn) this.ap += 1;
                this.spawnEnemies();
                this.phase             = "player";
                this.kingMovedThisTurn = false;
                if (kingMovedLastTurn) {
                    this.addLog(`Turn ${this.turn}. The King moved: no AP gained.`);
                } else {
                    this.addLog(`Turn ${this.turn}. The King held position: AP +1.`);
                }
            }
        }

        this.renderUI();
    },

});
