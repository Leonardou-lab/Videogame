const menuData = {
  0: {
    label: "Domingo",
    items: [
      { name: "Café de olla", desc: "Café con canela y piloncillo.", price: "$55", tag: "Bebida", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
      { name: "Hot cakes", desc: "Servidos con miel y fruta.", price: "$85", tag: "Comida", img: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&q=80" },
      { name: "Matcha latte", desc: "Bebida caliente con leche.", price: "$70", tag: "Bebida", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80" }
    ]
  },
  1: {
    label: "Lunes",
    items: [
      { name: "Americano", desc: "Café sencillo y fuerte.", price: "$50", tag: "Bebida", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
      { name: "Avocado toast", desc: "Pan tostado con aguacate.", price: "$90", tag: "Comida", img: "https://images.unsplash.com/photo-1603046891744-1f45a4a8e1ba?w=400&q=80" },
      { name: "Smoothie verde", desc: "Manzana, espinaca y limón.", price: "$65", tag: "Bebida", img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&q=80" }
    ]
  },
  2: {
    label: "Martes",
    items: [
      { name: "Cold brew", desc: "Café frío de sabor suave.", price: "$65", tag: "Bebida", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
      { name: "Quiche", desc: "Tarta salada de espinaca y queso.", price: "$85", tag: "Comida", img: "https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=400&q=80" },
      { name: "Chai latte", desc: "Té con especias y leche.", price: "$70", tag: "Bebida", img: "https://images.unsplash.com/photo-1570701950098-8fd90568b553?w=400&q=80" }
    ]
  },
  3: {
    label: "Miércoles",
    items: [
      { name: "Cappuccino", desc: "Espresso con leche y espuma.", price: "$60", tag: "Bebida", img: "https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=400&q=80" },
      { name: "Waffle", desc: "Waffle con fruta y chocolate.", price: "$95", tag: "Postre", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80" },
      { name: "Pasta pesto", desc: "Pasta con salsa de albahaca.", price: "$110", tag: "Comida", img: "https://images.unsplash.com/photo-1551183053-bf91798d9f55?w=400&q=80" }
    ]
  },
  4: {
    label: "Jueves",
    items: [
      { name: "Espresso", desc: "Shot de café intenso.", price: "$45", tag: "Bebida", img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80" },
      { name: "Brownie", desc: "Brownie de chocolate.", price: "$70", tag: "Postre", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
      { name: "Sándwich club", desc: "Pollo, lechuga, tomate y tocino.", price: "$100", tag: "Comida", img: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=400&q=80" }
    ]
  },
  5: {
    label: "Viernes",
    items: [
      { name: "Frappé", desc: "Café frío con crema.", price: "$85", tag: "Bebida", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" },
      { name: "Cheesecake", desc: "Pastel de queso con frutos rojos.", price: "$90", tag: "Postre", img: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=400&q=80" },
      { name: "Pizza margarita", desc: "Pizza con queso, tomate y albahaca.", price: "$130", tag: "Comida", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" }
    ]
  },
  6: {
    label: "Sábado",
    items: [
      { name: "Bubble tea", desc: "Té con leche y tapioca.", price: "$80", tag: "Bebida", img: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&q=80" },
      { name: "Crepas dulces", desc: "Crepas con Nutella y fruta.", price: "$95", tag: "Postre", img: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=80" },
      { name: "Eggs benedict", desc: "Huevos con salsa holandesa.", price: "$115", tag: "Comida", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=80" }
    ]
  }
};

const catsData = [
  {
    name: "Mochi",
    age: "2 años",
    character: "Juguetón",
    desc: "Le gusta correr por el café y jugar con pelotas.",
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80"
  },
  {
    name: "Sora",
    age: "5 años",
    character: "Tranquilo",
    desc: "Pasa mucho tiempo dormido junto a la ventana.",
    img: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=300&q=80"
  },
  {
    name: "Hana",
    age: "3 años",
    character: "Tímida",
    desc: "Al principio se esconde, pero después se acerca.",
    img: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=300&q=80"
  },
  {
    name: "Kumo",
    age: "4 años",
    character: "Cariñoso",
    desc: "Le gusta sentarse cerca de los visitantes.",
    img: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=300&q=80"
  },
  {
    name: "Luna",
    age: "6 años",
    character: "Serena",
    desc: "Es tranquila y le gusta observar todo desde su cama.",
    img: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=300&q=80"
  }
];

function renderMenu(day) {
  const menu = menuData[day];
  const label = document.getElementById("menuDayLabel");
  const grid = document.getElementById("menuGrid");

  label.textContent = "Menú de " + menu.label;
  grid.innerHTML = "";

  menu.items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-img">
        <img src="${item.img}" alt="${item.name}">
      </div>

      <div class="menu-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-footer">
          <span>${item.price}</span>
          <small>${item.tag}</small>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderCats() {
  const grid = document.querySelector(".cats-grid");

  catsData.forEach(cat => {
    const card = document.createElement("div");
    card.className = "cat-card";

    card.innerHTML = `
      <img src="${cat.img}" alt="${cat.name}">
      <h3>${cat.name}</h3>
      <p><strong>Edad:</strong> ${cat.age}</p>
      <p><strong>Carácter:</strong> ${cat.character}</p>
      <p>${cat.desc}</p>
    `;

    grid.appendChild(card);
  });
}

function initDayButtons() {
  const buttons = document.querySelectorAll(".day-btn");
  const today = new Date().getDay();

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const day = button.dataset.day;
      renderMenu(day);
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