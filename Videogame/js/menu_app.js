

"use strict";

const APP_CONFIG = {
    prototypeUrl: "../Videogame/index.html",
};

const API_BASE = "http://localhost:3000";

const appState = {
    currentUser: {
        player_id: null,
        username: "Guest King",
        isGuest: true,
    },
    settings: {
        masterVolume: 80,
        musicVolume: 65,
        sfxVolume: 75,
    },
};


const mockCredits = {
    project: "The Coward King",
    genre: "Tactical Roguelite Turn-Based Board Game",
    course: "TC2005B - VideogamesJS Prototype",
    teamName: "Silent Crown",
    members: [
        "José Abel Domínguez Rish",
        "Leonardo André Flores Mendoza",
        "Nicolás Casillas Larrañaga",
    ],
};

const app = document.getElementById("app");

function renderMenu(activeModal) {
    app.innerHTML = "";

    const screen = document.createElement("main");
    screen.className = "screen menu-screen";

    screen.appendChild(createCastleScene());
    screen.appendChild(createLoginButton());

    const content = document.createElement("section");
    content.className = "menu-content";
    content.appendChild(createBrand());
    content.appendChild(createMenuActions());
    screen.appendChild(content);

    if (activeModal) {
        screen.appendChild(activeModal);
    }

    app.appendChild(screen);
}

function createCastleScene() {
    const scene = document.createElement("div");
    scene.className = "castle-scene";
    scene.innerHTML = `
        <div class="stone-wall"></div>
        <div class="hall-arch left"></div>
        <div class="hall-arch right"></div>
        <div class="banner left"></div>
        <div class="banner right"></div>
        <div class="torch one"></div>
        <div class="torch two"></div>
        <div class="throne"></div>
        <div class="floor"></div>
        <div class="fog"></div>
    `;
    return scene;
}

function createLoginButton() {
    const login = document.createElement("div");
    login.className = "menu-login";

    const button = document.createElement("button");
    button.className = "small-button";
    button.innerHTML = appState.currentUser.isGuest ? "♙ LOGIN" : `♙ ${appState.currentUser.username.toUpperCase()}`;
    button.addEventListener("click", () => renderMenu(createLoginModal()));

    login.appendChild(button);
    return login;
}

function createBrand() {
    const brand = document.createElement("div");
    brand.className = "brand-stack";
    return brand;
}

function createMenuActions() {
    const actions = document.createElement("nav");
    actions.className = "menu-actions";
    actions.setAttribute("aria-label", "Main menu");

    actions.appendChild(menuButton("START", "sword", true, () => {
        window.location.href = APP_CONFIG.prototypeUrl;
    }));
    actions.appendChild(menuButton("ESTADÍSTICAS", "chart", false, () => {
        renderMenu(createOverviewModal());
    }));
    actions.appendChild(menuButton("CRÉDITOS", "book", false, () => {
        renderMenu(createCreditsModal());
    }));

    const bottomRow = document.createElement("div");
    bottomRow.className = "bottom-icon-row";

    const settings = document.createElement("button");
    settings.className = "icon-button";
    settings.setAttribute("aria-label", "Settings");
    settings.textContent = "⚙";
    settings.addEventListener("click", () => renderMenu(createSettingsModal()));

    bottomRow.appendChild(settings);
    actions.appendChild(bottomRow);

    return actions;
}

function menuButton(label, icon, primary, onClick) {
    const icons = {
        sword: "†",
        flag: "⚑",
        chart: "▥",
        book: "▤",
    };

    const button = document.createElement("button");
    button.className = primary ? "menu-button primary" : "menu-button";
    button.innerHTML = `<span class="menu-icon">${icons[icon]}</span><span>${label}</span>`;
    button.addEventListener("click", onClick);
    return button;
}


function statRow(icon, label, value) {
    return `
        <div class="stat-row">
            <span>${icon}</span>
            <span>${label}</span>
            <strong class="stat-value">${value}</strong>
        </div>
    `;
}

function detailRow(label, value) {
    return `
        <div class="detail-row">
            <span>◆</span>
            <span>${label}</span>
            <strong class="detail-value">${value}</strong>
        </div>
    `;
}

function createModal(title, content) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const panel = document.createElement("section");
    panel.className = "modal-panel";

    const header = document.createElement("header");
    header.className = "modal-header";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const close = document.createElement("button");
    close.className = "icon-button close-button";
    close.setAttribute("aria-label", "Close");
    close.textContent = "×";
    close.addEventListener("click", () => renderMenu());

    header.append(heading, close);
    panel.append(header, content);
    backdrop.appendChild(panel);

    return backdrop;
}

function createOverviewModal() {
    const content = document.createElement("div");
    content.className = "detail-list";

    if (!appState.currentUser.player_id) {
        content.innerHTML = statRow("♙", "Info", "Login to see your stats");
        return createModal("Stats / Overview", content);
    }

    content.innerHTML = statRow("…", "Loading", "fetching stats…");
    fetch(`${API_BASE}/api/stats/${appState.currentUser.player_id}`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(s => {
            content.innerHTML =
                statRow("▶", "Runs played",      s.total_runs) +
                statRow("☠", "Enemies killed",   s.total_enemies_killed) +
                statRow("★", "Upgrades bought",  s.total_upgrades) +
                statRow("◆", "Gold earned",      s.total_gold_earned) +
                statRow("✓", "Levels completed", s.levels_completed);
        })
        .catch(() => { content.innerHTML = statRow("⚠", "Error", "could not load stats") });

    return createModal("Stats / Overview", content);
}

function createSettingsModal() {
    const content = document.createElement("div");
    content.className = "settings-grid";

    content.appendChild(sliderRow("Master volume", "masterVolume"));
    content.appendChild(sliderRow("Music volume", "musicVolume"));
    content.appendChild(sliderRow("Sound effects", "sfxVolume"));

    return createModal("Settings", content);
}

function sliderRow(label, key) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const title = document.createElement("label");
    title.textContent = label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.value = appState.settings[key];

    const output = document.createElement("output");
    output.textContent = `${appState.settings[key]}%`;

    input.addEventListener("input", event => {
        const nextValue = Number(event.target.value);
        appState.settings[key] = nextValue;
        output.textContent = `${nextValue}%`;
    });

    row.append(title, input, output);
    return row;
}

function createCreditsModal() {
    const content = document.createElement("div");
    content.className = "credits-list";
    content.innerHTML = `
        <p><strong>Project:</strong> ${mockCredits.project}</p>
        <p><strong>Genre:</strong> ${mockCredits.genre}</p>
        <p><strong>Course:</strong> ${mockCredits.course}</p>
        <p><strong>Team:</strong> ${mockCredits.teamName}</p>
        <p><strong>Members:</strong></p>
        ${mockCredits.members.map(member => `<p>${member}</p>`).join("")}
    `;
    return createModal("Credits", content);
}

function createLoginModal() {
    const form = document.createElement("form");
    form.className = "login-form";
    form.innerHTML = `
        <label>
            Username
            <input name="username" type="text" placeholder="King Aldric" required>
        </label>
        <label>
            Password
            <input name="password" type="password" placeholder="••••••••" required>
        </label>
        <div class="form-actions">
            <button class="form-button" type="submit" data-action="login">Login</button>
            <button class="form-button" type="submit" data-action="signup">Sign Up</button>
        </div>
        <p class="progress-pill" id="login-msg"></p>
    `;

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const action = event.submitter?.dataset.action ?? "login";
        const username = form.elements["username"].value.trim();
        const password = form.elements["password"].value;
        const msg = form.querySelector("#login-msg");

        msg.textContent = "…";

        try {
            let player;
            if (action === "signup") {
                const res = await fetch(`${API_BASE}/api/player`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                if (res.status === 409) { msg.textContent = "Username already taken."; return; }
                if (!res.ok) { msg.textContent = "Sign up failed."; return; }
                player = await res.json();
            } else {
                const res = await fetch(
                    `${API_BASE}/api/player/${encodeURIComponent(username)}?password=${encodeURIComponent(password)}`
                );
                if (res.status === 404) { msg.textContent = "Player not found."; return; }
                if (res.status === 401) { msg.textContent = "Wrong password."; return; }
                if (!res.ok) { msg.textContent = "Login failed."; return; }
                player = await res.json();
            }

            appState.currentUser = {
                player_id: player.player_id,
                username:  player.username,
                isGuest:   false,
            };
            renderMenu();
        } catch {
            msg.textContent = "Could not reach server.";
        }
    });

    return createModal("Login / Sign Up", form);
}

renderMenu();
