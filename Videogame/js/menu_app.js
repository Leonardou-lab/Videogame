

"use strict";

const APP_CONFIG = {
    prototypeUrl: "../Videogame/index.html",
};

const appState = {
    currentUser: {
        id: "guest-player",
        username: "Guest King",
        isGuest: true,
    },
    settings: {
        masterVolume: 80,
        musicVolume: 65,
        sfxVolume: 75,
    },
};

const mockStats = {
    warning: "no stats are able",
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
    button.innerHTML = appState.currentUser.isGuest ? "♙ LOGIN" : `♙ ${appState.currentUser.username}`;
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
    content.innerHTML = `
        <div class="detail-list">
            ${statRow("-", "Warning", mockStats.warning)}
    `;
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
            <input name="username" type="text" placeholder="King Aldric">
        </label>
        <label>
            Password
            <input name="password" type="password" placeholder="Temporary prototype only">
        </label>
        <div class="form-actions">
            <button class="form-button" type="submit" data-action="login">Login</button>
            <button class="form-button" type="submit" data-action="signup">Sign Up</button>
        </div>
        <p class="progress-pill">Prototype mode: login is visual only for now.</p>
    `;

    form.addEventListener("submit", event => {
        event.preventDefault();
        const formData = new FormData(form);
        const username = formData.get("username");
        appState.currentUser = {
            id: "mock-user",
            username: username || "Guest King",
            isGuest: false,
        };
        renderMenu();
    });

    return createModal("Login / Sign Up", form);
}

renderMenu();
