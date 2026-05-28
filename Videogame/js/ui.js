"use strict";

// UI-related logic: event listeners, rendering the HUD and hand of cards, and logging messages
Object.assign(Game.prototype, {

    getCardImagePath(card) {
        const explicitNames = {
            "Royal Decree": "Royal_Decree",
            "Peace Treaty": "Peace_Treaty",
            "Royal Guard": "Royal_Guard",
            "Royal Curse": "Royal_Curse",
        };
        const fileName = explicitNames[card.name] || card.name.replace(/\s+/g, "_");
        return `Assets/cards/${fileName}.png`;
    },

    createEventListeners() {
        document.getElementById("moveKingButton").addEventListener("click", () => {
            if (this.status !== "playing" || this.phase !== "player") return;
            this.selectedCard = undefined;
            this.moveMode     = true;
            this.addLog("Move mode: click a highlighted tile or use keyboard directions.");
            this.renderUI();
        });

        document.getElementById("endTurnButton").addEventListener("click", () => {
            this.endPlayerTurn();
        });

        document.getElementById("restartButton").addEventListener("click", () => {
            if (this.canChooseKeepCard() && !this.keptCardName) {
                this.addLog("Choose one card to keep before continuing.");
                this.renderUI();
                return;
            }
            this.restart();
        });

        document.getElementById("upgradesButton").addEventListener("click", () => {
            this.openUpgradeOverlay();
        });

        document.getElementById("closeUpgradesButton").addEventListener("click", () => {
            this.closeUpgradeOverlay();
        });

        document.getElementById("canvas").addEventListener("click", event => {
            this.handleCanvasClick(event);
        });

        window.addEventListener("keydown", event => {
            if (this.status !== "playing" || this.phase !== "player") return;
            if (event.key in keyDirections) {
                this.tryMoveKing(keyDirections[event.key].row, keyDirections[event.key].col);
            }
            if (event.key === " ")      this.endPlayerTurn();
            if (event.key === "Escape") {
                this.selectedCard = undefined;
                this.moveMode     = false;
                this.renderUI();
            }
        });
    },

    handleCanvasClick(event) {
        if (this.status !== "playing" || this.phase !== "player") return;

        const rect   = event.target.getBoundingClientRect();
        const scaleX = canvasWidth  / rect.width;
        const scaleY = canvasHeight / rect.height;
        const x      = (event.clientX - rect.left) * scaleX;
        const y      = (event.clientY - rect.top)  * scaleY;
        const tile   = positionToTile(x, y);

        if (!tile) return;

        if (this.moveMode) {
            this.tryMoveKing(tile.row - this.king.row, tile.col - this.king.col);
            return;
        }

        if (this.selectedCard) {
            this.playCard(tile.row, tile.col);
            return;
        }

        if (tile.row === this.king.row && tile.col === this.king.col) {
            this.moveMode = true;
            this.addLog("King selected. Choose a neighboring tile.");
            this.renderUI();
        }
    },

    renderUI() {
        const level = this.getCurrentLevelConfig();
        const encounter = this.isBossFight ? "Boss" : `Horde ${this.currentHorde}`;
        const turnLimit = this.isBossFight ? "Boss" : this.getCurrentTurnLimit();
        const enemyLimit = this.isBossFight ? "Boss" : this.getCurrentHordeConfig().maxEnemiesOnBoard;
        const keepMode = this.canChooseKeepCard();

        this.hudElement.innerHTML = `
            <div>Level: ${level.levelNumber} - ${level.name}</div>
            <div>Encounter: ${encounter}</div>
            <div>Turn: ${this.turn}/${turnLimit}</div>
            <div>Phase: ${this.phase}</div>
            <div>AP: ${this.ap}/${maxActionPoints}</div>
            <div>Gold: ${this.gold}</div>
            <div>Enemies: ${this.enemies.length}/${enemyLimit}</div>
            <div>Status: ${this.status}</div>
        `;

        const handPanel = document.getElementById("handPanel");
        if (handPanel) {
            const handTitle = handPanel.querySelector("h2");
            handPanel.classList.toggle("keep-mode", keepMode);
            if (handTitle) {
                handTitle.dataset.keepHint = keepMode
                    ? this.keptCardName
                        ? `Keeping: ${this.keptCardName}`
                        : "Choose 1 card to keep"
                    : "";
            }
        }

        const restartButton = document.getElementById("restartButton");
        if (restartButton) {
            restartButton.textContent = keepMode && !this.keptCardName
                ? "Choose Card"
                : this.status === "won"
                    ? "Continue"
                    : this.status === "lost"
                        ? "Retry Level"
                        : "Restart";
            restartButton.disabled = keepMode && !this.keptCardName;
        }

        this.handElement.innerHTML = "";
        for (const card of this.hand) {
            const lvl = card.upgradeLevel || 0;
            const button = document.createElement("button");
            button.className = "cardButton" + (lvl > 0 ? ` lvl${lvl}` : "");
            if (this.selectedCard === card) button.classList.add("selected");
            if (this.keptCardName === card.name) button.classList.add("kept");
            button.disabled = keepMode
                ? false
                : this.status !== "playing" || this.phase !== "player" || this.ap < card.cost;
            const statsLine = card.type === "ally"
                ? `<span class="card-stats">HP:${card.hp} DMG:${card.damage}</span>`
                : "";
            const lvlTag = lvl > 0
                ? `<span class="card-lvl-tag lvl${lvl}">◆ LVL ${lvl}</span>`
                : "";
            button.innerHTML = `
                <div class="card-art">
                    <img src="${this.getCardImagePath(card)}" alt="${card.name}">
                </div>
                <div class="card-details">
                    ${statsLine}
                    <span>${card.text}</span>
                    ${lvlTag}
                </div>
            `;
            button.addEventListener("click", () => {
                if (keepMode) {
                    this.chooseCardToKeep(card);
                    return;
                }
                this.selectedCard = card;
                this.moveMode     = false;
                this.renderUI();
            });
            this.handElement.appendChild(button);
        }

        this.logElement.innerHTML = this.logLines
            .map(line => `<div class="logLine">${line}</div>`)
            .join("");

        this.renderDesperationPanel();
    },

    renderDesperationPanel() {
        let panel = document.getElementById("desperationPanel");
        if (!panel) {
            panel = document.createElement("aside");
            panel.id = "desperationPanel";
            document.getElementById("app").appendChild(panel);
        }

        const value = Math.min(maxDesperation, this.desperation || 0);
        const isCritical = value >= maxDesperation - 1;
        panel.classList.toggle("critical", isCritical);
        document.body.classList.toggle("desperation-critical", isCritical);
        panel.innerHTML = `
            <h2>Desperation</h2>
            <img src="Assets/images/Cara${value}.png" alt="Desperation level ${value}">
            <div class="desperation-meter" aria-label="Desperation ${value} of ${maxDesperation}">
                ${Array.from({ length: maxDesperation }, (_, index) => `
                    <span class="${index < value ? "filled" : ""}"></span>
                `).join("")}
            </div>
            <strong>${value}/${maxDesperation}</strong>
        `;
    },

    addLog(text) {
        if (!this.logLines) this.logLines = [];
        this.logLines.unshift(text);
        this.logLines = this.logLines.slice(0, 8);
    },

    openUpgradeOverlay() {
        this.renderUpgradeOverlay();
        document.getElementById("upgradeOverlay").classList.add("open");
    },

    closeUpgradeOverlay() {
        document.getElementById("upgradeOverlay").classList.remove("open");
    },

    renderUpgradeOverlay() {
        const LEVEL_LABELS = ["Base", "Lvl 1", "Lvl 2", "Lvl 3"];

        document.getElementById("upgradeGoldDisplay").textContent = `Gold: ${this.gold}`;

        const list = document.getElementById("upgradeCardList");
        list.innerHTML = "";

        const upgradeable = cardPool.filter(c => c.type === "ally");

        for (const base of upgradeable) {
            const level   = this.upgradeRegistry[base.name] || 0;
            const tier    = level > 0 ? UPGRADE_TIERS[level] : null;
            const curHp   = base.hp     + (tier ? tier.hp  : 0);
            const curDmg  = base.damage + (tier ? tier.dmg : 0);
            const curAp   = Math.max(1, base.cost - (tier ? tier.ap : 0));

            const nextLevel = level + 1;
            const nextTier  = nextLevel <= 3 ? UPGRADE_TIERS[nextLevel] : null;
            const canAfford = nextTier !== null && this.gold >= nextTier.cost;

            const lvlClass = level > 0 ? ` lvl${level}` : "";
            const row = document.createElement("div");
            row.className = `upgrade-card-row${lvlClass}`;

            let nextStatsHtml = "";
            if (nextTier) {
                const nxHp  = base.hp     + nextTier.hp;
                const nxDmg = base.damage + nextTier.dmg;
                const nxAp  = Math.max(1, base.cost - nextTier.ap);
                nextStatsHtml = `<div class="upgrade-next-stats">Next: HP ${nxHp} / DMG ${nxDmg} / ${nxAp} AP</div>`;
            }

            const actionsHtml = level >= 3
                ? `<span class="upgrade-max">&#9733; MAX</span>`
                : `<div class="upgrade-cost">${nextTier.cost} Gold</div>
                   <button class="upgrade-btn" ${canAfford ? "" : "disabled"} data-card="${base.name}">Upgrade</button>`;

            row.innerHTML = `
                <div class="upgrade-card-info">
                    <span class="upgrade-card-name">${base.name}
                        <span class="upgrade-level-tag tag-${level}">${LEVEL_LABELS[level]}</span>
                    </span>
                    <div class="upgrade-card-stats">HP: ${curHp} &nbsp;|&nbsp; DMG: ${curDmg} &nbsp;|&nbsp; ${curAp} AP</div>
                    ${nextStatsHtml}
                </div>
                <div class="upgrade-actions">${actionsHtml}</div>
            `;

            list.appendChild(row);
        }

        list.querySelectorAll(".upgrade-btn").forEach(btn => {
            btn.addEventListener("click", () => this.purchaseUpgrade(btn.dataset.card));
        });
    },

    purchaseUpgrade(cardName) {
        const level = this.upgradeRegistry[cardName] || 0;
        if (level >= 3) return;
        const nextTier = UPGRADE_TIERS[level + 1];
        if (this.gold < nextTier.cost) return;

        this.gold -= nextTier.cost;
        this.upgradeRegistry[cardName] = level + 1;

        const baseCard = cardPool.find(c => c.name === cardName);
        if (baseCard) {
            const newLevel = level + 1;
            const tier = UPGRADE_TIERS[newLevel];
            for (const card of this.hand) {
                if (card.name === cardName && card.type === "ally") {
                    card.hp           = baseCard.hp     + tier.hp;
                    card.damage       = baseCard.damage + tier.dmg;
                    card.cost         = Math.max(1, baseCard.cost - tier.ap);
                    card.upgradeLevel = newLevel;
                }
            }
        }

        this.addLog(`${cardName} upgraded to Level ${level + 1}.`);
        this.renderUpgradeOverlay();
        this.renderUI();
    },

});
