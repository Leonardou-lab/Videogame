"use strict";

const AUDIO_SETTINGS_STORAGE_KEY = "cowardKingSettings";

const LEVEL_MUSIC_TRACKS = {
    1: {
        src: "Assets/audio/level1-skeletons.mp3",
        label: "Catacombs - Skeleton March",
    },
    2: {
        src: "Assets/audio/level2-ogres.mp3",
        label: "Ogre Dungeon - Heavy Drums",
    },
    3: {
        src: "Assets/audio/level3-royal.mp3",
        label: "Royal Castle - Final Court",
    },
};

const MENU_MUSIC_TRACKS = Object.values(LEVEL_MUSIC_TRACKS);

const SFX_TRACKS = {
    button: "Assets/audio/sfx/button-click.mp3",
    movementKing: "Assets/audio/sfx/button-click.mp3",
    victory: "Assets/audio/sfx/victory.m4a",
    defeat: "Assets/audio/sfx/defeat.m4a",
    desperationCritical: "Assets/audio/sfx/desperation-critical.mp3",
    desperationDeath: "Assets/audio/sfx/desperation-death.mp3",
};

const CARD_SFX_TRACKS = {
    Knight: "Assets/audio/sfx/cards/knight.mp3",
    Archer: "Assets/audio/sfx/cards/archer.mp3",
    Mage: "Assets/audio/sfx/cards/mage.mp3",
    Pikeman: "Assets/audio/sfx/cards/pikeman.mp3",
    Wall: "Assets/audio/sfx/cards/wall.mp3",
    Squire: "Assets/audio/sfx/cards/squire.mp3",
    Tower: "Assets/audio/sfx/cards/tower.mp3",
    Guardian: "Assets/audio/sfx/cards/guardian.mp3",
    "Royal Guard": "Assets/audio/sfx/cards/royal-guard.mp3",
    Trench: "Assets/audio/sfx/cards/trench.mp3",
    Exile: "Assets/audio/sfx/cards/exile.mp3",
    Bomb: "Assets/audio/sfx/cards/bomb.mp3",
    "Peace Treaty": "Assets/audio/sfx/cards/peace-treaty.mp3",
    "Royal Curse": "Assets/audio/sfx/cards/royal-curse.mp3",
    Decoy: "Assets/audio/sfx/cards/decoy.mp3",
};

function readAudioSettings() {
    const fallback = {
        masterVolume: 80,
        musicVolume: 65,
        sfxVolume: 75,
    };

    try {
        const saved = localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
        if (!saved) return fallback;
        return { ...fallback, ...JSON.parse(saved) };
    } catch {
        return fallback;
    }
}

function clampVolume(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
}

function createTrackAudio(trackInfo) {
    const audio = new Audio(trackInfo.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.dataset.trackLabel = trackInfo.label;
    audio.load();
    audio.addEventListener("error", () => {
        console.warn(`Missing music file: ${trackInfo.src}`);
    });
    return audio;
}

const cowardKingAudio = {
    settings: readAudioSettings(),
    currentLevelNumber: null,
    currentTrack: null,
    trackCache: {},
    sfxCache: {},
    loopSfx: {},
    unlocked: false,
    unlockHandler: null,

    init() {
        this.preloadTracks();
        this.preloadSfx();
        this.applyVolume();
        this.unlockOnFirstInput();
        this.bindButtonSounds();
    },

    preloadTracks() {
        for (const track of MENU_MUSIC_TRACKS) {
            if (!this.trackCache[track.src]) {
                this.trackCache[track.src] = createTrackAudio(track);
            }
        }
    },

    preloadSfx() {
        const allSfx = [
            ...Object.values(SFX_TRACKS),
            ...Object.values(CARD_SFX_TRACKS),
        ];
        for (const src of allSfx) {
            if (this.sfxCache[src]) continue;
            const audio = new Audio(src);
            audio.preload = "auto";
            audio.load();
            audio.addEventListener("error", () => {
                console.warn(`Missing SFX file: ${src}`);
            });
            this.sfxCache[src] = audio;
        }
    },

    bindButtonSounds() {
        if (this.buttonSoundsBound) return;
        this.buttonSoundsBound = true;
        document.addEventListener("click", event => {
            const button = event.target.closest("button");
            if (!button || button.disabled) return;
            this.playSfx("button");
        });
    },

    unlockOnFirstInput() {
        if (this.unlockHandler) return;

        const unlock = () => {
            this.unlocked = true;
            this.playCurrentTrack().then(started => {
                if (!started) return;
                window.removeEventListener("pointerdown", unlock, true);
                window.removeEventListener("click", unlock, true);
                window.removeEventListener("touchstart", unlock, true);
                window.removeEventListener("keydown", unlock, true);
                this.unlockHandler = null;
            });
        };

        this.unlockHandler = unlock;
        window.addEventListener("pointerdown", unlock, true);
        window.addEventListener("click", unlock, true);
        window.addEventListener("touchstart", unlock, true);
        window.addEventListener("keydown", unlock, true);
    },

    setLevel(levelConfig) {
        if (!levelConfig) return;
        const levelNumber = levelConfig.levelNumber || 1;
        if (this.currentLevelNumber === levelNumber) return;

        this.currentLevelNumber = levelNumber;
        this.switchTrack(LEVEL_MUSIC_TRACKS[levelNumber]);
    },

    setRandomMenuTrack() {
        if (this.currentTrack) return;
        const randomIndex = Math.floor(Math.random() * MENU_MUSIC_TRACKS.length);
        const track = MENU_MUSIC_TRACKS[randomIndex];
        this.currentLevelNumber = null;
        this.switchTrack({
            ...track,
            label: `Menu - ${track.label}`,
        });
    },

    switchTrack(trackInfo) {
        if (!trackInfo) return;

        if (this.currentTrack) {
            this.currentTrack.pause();
        }

        const audio = this.trackCache[trackInfo.src] || createTrackAudio(trackInfo);
        this.trackCache[trackInfo.src] = audio;
        audio.currentTime = 0;
        audio.dataset.trackLabel = trackInfo.label;

        this.currentTrack = audio;
        this.applyVolume();
        this.playCurrentTrack();
    },

    playCurrentTrack() {
        if (!this.unlocked || !this.currentTrack) return Promise.resolve(false);
        return this.currentTrack.play().then(() => true).catch(() => {
            console.warn("Music will start after the next player interaction.");
            return false;
        });
    },

    updateSettings(nextSettings) {
        this.settings = {
            ...this.settings,
            ...nextSettings,
        };
        localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
        this.applyVolume();
    },

    getSfxVolume() {
        const master = clampVolume(this.settings.masterVolume) / 100;
        const sfx    = clampVolume(this.settings.sfxVolume) / 100;
        return master * sfx;
    },

    playSfx(key) {
        const src = SFX_TRACKS[key];
        if (!src || !this.unlocked) return;
        const base = this.sfxCache[src] || new Audio(src);
        this.sfxCache[src] = base;

        const sound = base.cloneNode();
        sound.volume = this.getSfxVolume();
        sound.play().catch(() => {});
    },

    playCardSfx(cardName) {
        const src = CARD_SFX_TRACKS[cardName];
        if (!src || !this.unlocked) return;
        const base = this.sfxCache[src] || new Audio(src);
        this.sfxCache[src] = base;

        const sound = base.cloneNode();
        sound.volume = this.getSfxVolume();
        sound.play().catch(() => {});
    },

    startLoopSfx(key) {
        const src = SFX_TRACKS[key];
        if (!src || !this.unlocked) return;
        if (this.loopSfx[key] && !this.loopSfx[key].paused) return;

        const loop = this.sfxCache[src] || new Audio(src);
        this.sfxCache[src] = loop;
        loop.loop = true;
        loop.volume = this.getSfxVolume();
        loop.currentTime = 0;
        this.loopSfx[key] = loop;
        loop.play().catch(() => {});
    },

    stopLoopSfx(key) {
        const loop = this.loopSfx[key];
        if (!loop) return;
        loop.pause();
        loop.currentTime = 0;
    },

    applyVolume() {
        for (const loop of Object.values(this.loopSfx)) {
            loop.volume = this.getSfxVolume();
        }
        if (!this.currentTrack) return;
        const master = clampVolume(this.settings.masterVolume) / 100;
        const music  = clampVolume(this.settings.musicVolume) / 100;
        this.currentTrack.volume = master * music;
    },
};

window.cowardKingAudio = cowardKingAudio;
