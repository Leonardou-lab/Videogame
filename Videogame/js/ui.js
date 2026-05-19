"use strict";

Object.assign(Game.prototype, {

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
            this.restart();
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
        this.hudElement.innerHTML = `
            <div>Turn: ${this.turn}/${maxTurns}</div>
            <div>Phase: ${this.phase}</div>
            <div>AP: ${this.ap}</div>
            <div>Gold: ${this.gold}</div>
            <div>Enemies: ${this.enemies.length}</div>
            <div>Status: ${this.status}</div>
        `;

        this.handElement.innerHTML = "";
        for (const card of this.hand) {
            const button = document.createElement("button");
            button.className = "cardButton";
            if (this.selectedCard === card) button.classList.add("selected");
            button.disabled = this.status !== "playing" || this.phase !== "player" || this.ap < card.cost;
            button.innerHTML = `
                <div class="cardTop">
                    <strong>${card.name}</strong>
                    <em>${card.cost} AP</em>
                </div>
                <span>${card.text}</span>
            `;
            button.addEventListener("click", () => {
                this.selectedCard = card;
                this.moveMode     = false;
                this.renderUI();
            });
            this.handElement.appendChild(button);
        }

        this.logElement.innerHTML = this.logLines
            .map(line => `<div class="logLine">${line}</div>`)
            .join("");
    },

    addLog(text) {
        if (!this.logLines) this.logLines = [];
        this.logLines.unshift(text);
        this.logLines = this.logLines.slice(0, 8);
    },

});
