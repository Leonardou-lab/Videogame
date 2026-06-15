const API = "http://localhost:3000/api";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


async function renderMenu(day) {
  const label = document.getElementById("menuDayLabel");
  const grid  = document.getElementById("menuGrid");

  try {
    const res  = await fetch(`${API}/menu/${day}`);
    const data = await res.json();

    label.textContent = "Menu for " + DAY_NAMES[data.dia];
    grid.innerHTML = "";

    data.items.forEach(item => {
      const card = document.createElement("div");
      card.className = "menu-card";

      card.innerHTML = `
        <div class="menu-img">
          <img src="${item.image_url}" alt="${item.name}">
        </div>
        <div class="menu-label">
          <h3>${item.name}</h3>
          <div class="menu-footer">
            <span>$${parseFloat(item.price).toFixed(0)}</span>
            <small>${item.category}</small>
          </div>
        </div>
        <div class="menu-overlay">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="menu-footer">
            <span>$${parseFloat(item.price).toFixed(0)}</span>
            <small>${item.category}</small>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Error loading the menu.</p>";
    console.error(err);
  }
}

async function renderCats() {
  const grid = document.querySelector(".cats-grid");

  try {
    const res  = await fetch(`${API}/gatos`);
    const cats = await res.json();

    cats.forEach(cat => {
      const card = document.createElement("div");
      card.className = "cat-card";

      card.innerHTML = `
        <img src="${cat.image_url}" alt="${cat.name}">
        <h3>${cat.name}</h3>
        <p><strong>Age:</strong> ${cat.age}</p>
        <p><strong>Personality:</strong> ${cat.personality}</p>
        <p>${cat.description}</p>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    grid.innerHTML = "<p>Error loading the cats.</p>";
    console.error(err);
  }
}

function initDayButtons() {
  const buttons = document.querySelectorAll(".day-btn");
  const today   = new Date().getDay();

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(button.dataset.day);
    });
  });

  const todayBtn = document.querySelector(`.day-btn[data-day="${today}"]`);
  if (todayBtn) todayBtn.classList.add("active");
  renderMenu(today);
}

document.addEventListener("DOMContentLoaded", () => {
  initDayButtons();
  renderCats();
});
