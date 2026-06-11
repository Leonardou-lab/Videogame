"use strict";

// This file controls all the audio in the game.
// It handles background music for each level, sound effects for cards and buttons,
// and lets the player adjust volume through the settings menu.
// Everything goes through the cowardKingAudio object at the bottom.

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
    victory: "Assets/audio/sfx/victory.mp3",
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

// Reads the saved volume settings from local storage, or uses defaults if there are none.
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

// Makes sure a volume number stays between 0 and 100.
function clampVolume(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
}

// Creates an Audio object for a music track and sets it to loop automatically.
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

    // Sets everything up when the game loads.
    init() {
        this.preloadTracks();
        this.preloadSfx();
        this.applyVolume();
        this.unlockOnFirstInput();
        this.bindButtonSounds();
    },

    // Loads all the music tracks into memory so they are ready to play.
    preloadTracks() {
        for (const track of MENU_MUSIC_TRACKS) {
            if (!this.trackCache[track.src]) {
                this.trackCache[track.src] = createTrackAudio(track);
            }
        }
    },

    // Loads all sound effects into memory so there is no delay when they play.
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

    // Plays a click sound whenever the player clicks any button on the page.
    bindButtonSounds() {
        if (this.buttonSoundsBound) return;
        this.buttonSoundsBound = true;
        document.addEventListener("click", event => {
            const button = event.target.closest("button");
            if (!button || button.disabled) return;
            this.playSfx("button");
        });
    },

    // Waits for the first player interaction before trying to play audio,
    // since browsers block autoplay until the user does something.
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

    // Switches the music to the track that matches the current level.
    setLevel(levelConfig) {
        if (!levelConfig) return;
        const levelNumber = levelConfig.levelNumber || 1;
        if (this.currentLevelNumber === levelNumber) return;

        this.currentLevelNumber = levelNumber;
        this.switchTrack(LEVEL_MUSIC_TRACKS[levelNumber]);
    },

    // Picks a random track to play on the menu if nothing is playing yet.
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

    // Stops the current track and starts playing a new one from the beginning.
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

    // Plays the current track if the browser is already unlocked.
    playCurrentTrack() {
        if (!this.unlocked || !this.currentTrack) return Promise.resolve(false);
        return this.currentTrack.play().then(() => true).catch(() => {
            console.warn("Music will start after the next player interaction.");
            return false;
        });
    },

    // Saves new volume settings and updates everything that is currently playing.
    updateSettings(nextSettings) {
        this.settings = {
            ...this.settings,
            ...nextSettings,
        };
        localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
        this.applyVolume();
    },

    // Calculates the final volume for sound effects using master and sfx sliders.
    getSfxVolume() {
        const master = clampVolume(this.settings.masterVolume) / 100;
        const sfx    = clampVolume(this.settings.sfxVolume) / 100;
        return master * sfx;
    },

    // Plays a one shot sound effect by its key name.
    playSfx(key) {
        const src = SFX_TRACKS[key];
        if (!src || !this.unlocked) return;
        const base = this.sfxCache[src] || new Audio(src);
        this.sfxCache[src] = base;

        const sound = base.cloneNode();
        sound.volume = this.getSfxVolume();
        sound.play().catch(() => {});
    },

    // Plays the sound effect for a specific card when it is used.
    playCardSfx(cardName) {
        const src = CARD_SFX_TRACKS[cardName];
        if (!src || !this.unlocked) return;
        const base = this.sfxCache[src] || new Audio(src);
        this.sfxCache[src] = base;

        const sound = base.cloneNode();
        sound.volume = this.getSfxVolume();
        sound.play().catch(() => {});
    },

    // Starts playing a sound effect on a loop until stopLoopSfx is called.
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

    // Stops a looping sound effect and resets it to the beginning.
    stopLoopSfx(key) {
        const loop = this.loopSfx[key];
        if (!loop) return;
        loop.pause();
        loop.currentTime = 0;
    },

    // Updates the volume on everything that is currently playing to match the settings.
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
