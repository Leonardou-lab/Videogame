"use strict";

const AP_PER_HORDE = 5;

class RunState {
    constructor() {
        this.level    = 1;
        this.horde    = 1;
        this.maxHorde = 3;
        this.turn     = 5;
        this.maxTurn  = 30;
        this.gold     = 10;
        this.maxAp    = AP_PER_HORDE;
        this.ap       = 0;

        this.startHorde();
    }

    startHorde() {
        this.ap = this.maxAp;
        this._syncHud();
    }

    spendAP(cost) {
        if (cost < 0 || this.ap < cost) return false;
        this.ap -= cost;
        this._syncHud();
        return true;
    }

    _syncHud() {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        set('hud-level', this.level);
        set('hud-horde', `${this.horde}/${this.maxHorde}`);
        set('hud-turn',  `${this.turn}/${this.maxTurn}`);
        set('hud-ap',    this.ap);
        set('hud-gold',  this.gold);
    }
}
