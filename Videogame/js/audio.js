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

const cowardKingAudio = {
    settings: readAudioSettings(),
    currentLevelNumber: null,
    currentTrack: null,
    unlocked: false,
    unlockHandler: null,

    init() {
        this.applyVolume();
        this.unlockOnFirstInput();
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

        const audio = new Audio(trackInfo.src);
        audio.loop = true;
        audio.preload = "auto";
        audio.dataset.trackLabel = trackInfo.label;
        audio.load();
        audio.addEventListener("error", () => {
            console.warn(`Missing music file: ${trackInfo.src}`);
        });

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

    applyVolume() {
        if (!this.currentTrack) return;
        const master = clampVolume(this.settings.masterVolume) / 100;
        const music  = clampVolume(this.settings.musicVolume) / 100;
        this.currentTrack.volume = master * music;
    },
};

window.cowardKingAudio = cowardKingAudio;
