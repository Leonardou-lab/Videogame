// ── DATOS: GATOS ─────────────────────────────────────────────
var gatos = [
    {
        nombre: "Mochi",
        edad: "2 años",
        caracter: "Juguetón y travieso",
        imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=860&q=80"
    },
    {
        nombre: "Sora",
        edad: "5 años",
        caracter: "Tranquilo, ama las siestas",
        imagen: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=860&q=80"
    },
    {
        nombre: "Hana",
        edad: "3 años",
        caracter: "Tímida pero muy cariñosa",
        imagen: "https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?w=860&q=80"
    },
    {
        nombre: "Kumo",
        edad: "4 años",
        caracter: "Cariñoso, siempre busca un regazo",
        imagen: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=860&q=80"
    },
    {
        nombre: "Riku",
        edad: "1 año",
        caracter: "Curioso, explora cada rincón",
        imagen: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=860&q=80"
    },
    {
        nombre: "Luna",
        edad: "6 años",
        caracter: "Elegante y serena, la reina del café",
        imagen: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=860&q=80"
    }
];

// ── DATOS: MENÚ POR DÍA ──────────────────────────────────────
var menusPorDia = {
    "Lunes": [
        {
            nombre: "Café de Olla",
            emoji: "☕",
            categoria: "Bebidas",
            descripcion: "Café tradicional mexicano preparado con canela y piloncillo. Reconfortante y aromático.",
            precio: "$55",
            imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80"
        },
        {
            nombre: "Smoothie Verde",
            emoji: "🥤",
            categoria: "Bebidas",
            descripcion: "Mezcla de espinaca, manzana verde y jengibre. Fresco y energizante.",
            precio: "$70",
            imagen: "https://danzadefogones.com/wp-content/uploads/2020/03/Smoothie-Verde-2.jpg"
        },
        {
            nombre: "Avocado Toast",
            emoji: "🥑",
            categoria: "Comida",
            descripcion: "Pan de masa madre tostado con aguacate, semillas y huevo pochado.",
            precio: "$90",
            imagen: "https://cookieandkate.com/images/2012/04/avocado-toast-recipe-3.jpg"
        },
        {
            nombre: "Granola Bowl",
            emoji: "🍓",
            categoria: "Comida",
            descripcion: "Granola artesanal con yogurt griego natural y frutos rojos frescos.",
            precio: "$82",
            imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80"
        },
        {
            nombre: "Brownie de Chocolate",
            emoji: "🍫",
            categoria: "Postres",
            descripcion: "Brownie húmedo de chocolate oscuro con nuez, recién horneado.",
            precio: "$65",
            imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"
        }
    ],
    "Martes": [
        {
            nombre: "Cold Brew",
            emoji: "🧊",
            categoria: "Bebidas",
            descripcion: "Café de infusión lenta en frío durante 12 horas. Suave y concentrado.",
            precio: "$65",
            imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"
        },
        {
            nombre: "Chai Latte",
            emoji: "🍂",
            categoria: "Bebidas",
            descripcion: "Té negro con especias indias y leche de almendra vaporizada.",
            precio: "$72",
            imagen: "https://cdn.loveandlemons.com/wp-content/uploads/2025/01/chai-latte-recipe-580x617.jpg"
        },
        {
            nombre: "Quiche del Día",
            emoji: "🥧",
            categoria: "Comida",
            descripcion: "Quiche de espinaca y queso gruyère horneado fresco cada mañana.",
            precio: "$85",
            imagen: "https://images.unsplash.com/photo-1619894991209-9f9694be045a?w=600&q=80"
        },
        {
            nombre: "Sopa de Tomate",
            emoji: "🍅",
            categoria: "Comida",
            descripcion: "Tomate asado con albahaca fresca y crutones de ajo.",
            precio: "$78",
            imagen: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80"
        },
        {
            nombre: "Pay de Limón",
            emoji: "🍋",
            categoria: "Postres",
            descripcion: "Cremoso pay de limón con base de galleta y merengue.",
            precio: "$68",
            imagen: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80"
        }
    ],
    "Miercoles": [
        {
            nombre: "Cappuccino",
            emoji: "☕",
            categoria: "Bebidas",
            descripcion: "Espresso doble con leche vaporizada y espuma cremosa.",
            precio: "$62",
            imagen: "https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=600&q=80"
        },
        {
            nombre: "Limonada Menta",
            emoji: "🍋",
            categoria: "Bebidas",
            descripcion: "Limonada fresca con menta, pepino y hielo picado.",
            precio: "$58",
            imagen: "https://yuka.io/wp-content/uploads/Recette-yuka-citronnade-menthe-1024x512.jpg"
        },
        {
            nombre: "Pasta Pesto",
            emoji: "🍝",
            categoria: "Comida",
            descripcion: "Pasta fresca con pesto de albahaca, ajo y nuez de pino.",
            precio: "$110",
            imagen: "https://images.unsplash.com/photo-1551183053-bf91798d9f55?w=600&q=80"
        },
        {
            nombre: "Sándwich Club",
            emoji: "🥖",
            categoria: "Comida",
            descripcion: "Pollo a la plancha, tocino crujiente, lechuga y tomate en baguette.",
            precio: "$105",
            imagen: "https://recetasdecocina.elmundo.es/wp-content/uploads/2024/10/sandwich-club-1-1024x683.jpg"
        },
        {
            nombre: "Waffle con Helado",
            emoji: "🧇",
            categoria: "Postres",
            descripcion: "Waffle crujiente acompañado de helado de vainilla y caramelo salado.",
            precio: "$98",
            imagen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80"
        }
    ],
    "Jueves": [
        {
            nombre: "Espresso Doble",
            emoji: "☕",
            categoria: "Bebidas",
            descripcion: "Shot doble de nuestro blend exclusivo de la casa. Intenso y balanceado.",
            precio: "$48",
            imagen: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80"
        },
        {
            nombre: "Horchata Latte",
            emoji: "🥛",
            categoria: "Bebidas",
            descripcion: "Horchata cremosa de arroz combinada con espresso. Fusión mexicana.",
            precio: "$78",
            imagen: "https://images.unsplash.com/photo-1570701950098-8fd90568b553?w=600&q=80"
        },
        {
            nombre: "Enchiladas Verdes",
            emoji: "🌮",
            categoria: "Comida",
            descripcion: "Enchiladas bañadas en salsa verde con queso y crema fresca.",
            precio: "$115",
            imagen: "https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=600&q=80"
        },
        {
            nombre: "Sándwich Caprese",
            emoji: "🧀",
            categoria: "Comida",
            descripcion: "Jitomate fresco, mozzarella y pesto en pan artesanal.",
            precio: "$95",
            imagen: "https://cdn.loveandlemons.com/wp-content/uploads/2020/06/caprese-sandwich-1-580x765.jpg"
        },
        {
            nombre: "Brownie Neko",
            emoji: "🍫",
            categoria: "Postres",
            descripcion: "Brownie decorado con forma de gatito. Dulce y esponjoso.",
            precio: "$72",
            imagen: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80"
        }
    ],
    "Viernes": [
        {
            nombre: "Frappé Caramelo",
            emoji: "🧋",
            categoria: "Bebidas",
            descripcion: "Café frío batido con caramelo salado y crema chantilly.",
            precio: "$88",
            imagen: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80"
        },
        {
            nombre: "Mojito Mocktail",
            emoji: "🌿",
            categoria: "Bebidas",
            descripcion: "Lima, menta, azúcar morena y agua mineral. Sin alcohol.",
            precio: "$68",
            imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80"
        },
        {
            nombre: "Pizza Margherita",
            emoji: "🍕",
            categoria: "Comida",
            descripcion: "Masa delgada crujiente con mozzarella fresca y albahaca.",
            precio: "$130",
            imagen: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80"
        },
        {
            nombre: "Hamburguesa",
            emoji: "🍔",
            categoria: "Comida",
            descripcion: "Carne de res, queso cheddar, lechuga y tomate en pan brioche.",
            precio: "$125",
            imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80"
        },
        {
            nombre: "Cheesecake Oreo",
            emoji: "🍰",
            categoria: "Postres",
            descripcion: "Base de galleta Oreo con relleno cremoso de queso y vainilla.",
            precio: "$85",
            imagen: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=600&q=80"
        }
    ],
    "Sabado": [
        {
            nombre: "Bubble Tea",
            emoji: "🧋",
            categoria: "Bebidas",
            descripcion: "Té negro con perlas de tapioca y leche condensada.",
            precio: "$82",
            imagen: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80"
        },
        {
            nombre: "Flat White",
            emoji: "☕",
            categoria: "Bebidas",
            descripcion: "Doble espresso con leche vaporizada de textura sedosa.",
            precio: "$70",
            imagen: "https://images.unsplash.com/photo-1534687941688-651ccaafbff8?w=600&q=80"
        },
        {
            nombre: "Eggs Benedict",
            emoji: "🍳",
            categoria: "Comida",
            descripcion: "Huevos pochados sobre pan inglés con jamón y salsa holandesa.",
            precio: "$118",
            imagen: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80"
        },
        {
            nombre: "Crepes Dulces",
            emoji: "🫔",
            categoria: "Comida",
            descripcion: "Crepes rellenos de Nutella, plátano y fresas frescas.",
            precio: "$96",
            imagen: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80"
        },
        {
            nombre: "Cinnamon Roll",
            emoji: "🌀",
            categoria: "Postres",
            descripcion: "Recién horneado con glaseado de queso crema y canela.",
            precio: "$78",
            imagen: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80"
        }
    ],
    "Domingo": [
        {
            nombre: "Matcha Latte",
            emoji: "🍵",
            categoria: "Bebidas",
            descripcion: "Té matcha premium con leche de avena y espuma artesanal.",
            precio: "$75",
            imagen: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80"
        },
        {
            nombre: "Café de Olla",
            emoji: "☕",
            categoria: "Bebidas",
            descripcion: "Receta tradicional con canela y piloncillo. El favorito del domingo.",
            precio: "$55",
            imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80"
        },
        {
            nombre: "Hot Cakes",
            emoji: "🥞",
            categoria: "Comida",
            descripcion: "Esponjosos y servidos con miel de maple, mantequilla y fruta.",
            precio: "$85",
            imagen: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&q=80"
        },
        {
            nombre: "French Toast",
            emoji: "🍞",
            categoria: "Comida",
            descripcion: "Pan brioche dorado con fresas frescas y crema batida.",
            precio: "$95",
            imagen: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80"
        },
        {
            nombre: "Cheesecake",
            emoji: "🍰",
            categoria: "Postres",
            descripcion: "Cheesecake estilo Nueva York con coulis de frutos rojos.",
            precio: "$72",
            imagen: "https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=600&q=80"
        }
    ]
};

// ── FUNCIONES ────────────────────────────────────────────────

// Carga el carrusel de gatos con Bootstrap
function cargarGatos() {
    var indicatorsHtml = "";
    var innerHtml = "";

    $.each(gatos, function(index, gato) {
        var activeClass = index === 0 ? "active" : "";

        // Botones indicadores (los puntitos de abajo)
        indicatorsHtml += '<button type="button" data-bs-target="#nekoCafousel"' +
            ' data-bs-slide-to="' + index + '" class="' + activeClass + '"' +
            ' aria-label="Slide ' + (index + 1) + '"></button>';

        // Diapositiva
        innerHtml +=
            '<div class="carousel-item ' + activeClass + '">' +
                '<img src="' + gato.imagen + '" class="d-block w-100"' +
                    ' alt="' + gato.nombre + '"' +
                    ' style="height:500px; object-fit:cover; filter:brightness(65%);">' +
                '<div class="carousel-caption d-none d-md-block">' +
                    '<h3>' + gato.nombre + '</h3>' +
                    '<p><strong>Edad:</strong> ' + gato.edad +
                    ' &nbsp;|&nbsp; <strong>Carácter:</strong> ' + gato.caracter + '</p>' +
                '</div>' +
            '</div>';
    });

    $("#carouselIndicators").html(indicatorsHtml);
    $("#carouselInner").html(innerHtml);
}

// Carga el menú del día seleccionado como lista estilo restaurante
function actualizarMenu(dia) {
    var items = menusPorDia[dia] || [];

    // Actualizar el texto del día
    $("#currentDayText").text(dia === "Miercoles" ? "Miércoles" :
                              dia === "Sabado"    ? "Sábado"    : dia);

    // Agrupar items por categoría
    var categorias = {};
    $.each(items, function(i, item) {
        if (!categorias[item.categoria]) {
            categorias[item.categoria] = [];
        }
        categorias[item.categoria].push(item);
    });

    // Construir el HTML
    var html = "";
    $.each(categorias, function(cat, lista) {
        // Título de categoría
        html += '<div class="menu-categoria">' + cat + '</div>';

        // Filas de items
        $.each(lista, function(j, item) {
            html +=
                '<div class="menu-item"' +
                    ' data-nombre="' + item.nombre + '"' +
                    ' data-desc="'   + item.descripcion + '"' +
                    ' data-precio="' + item.precio + '"' +
                    ' data-img="'    + item.imagen + '">' +
                    '<span class="menu-emoji">' + item.emoji + '</span>' +
                    '<div class="menu-info">' +
                        '<div class="menu-nombre">' + item.nombre + '</div>' +
                        '<div class="menu-desc">'   + item.descripcion + '</div>' +
                    '</div>' +
                    '<span class="menu-precio">' + item.precio + '</span>' +
                '</div>';
        });
    });

    $("#menuContainer").html(html);
}

// ── DOCUMENTO LISTO (jQuery) ─────────────────────────────────
$(document).ready(function() {

    // Detectar el día actual de la semana
    var dias = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    var hoy  = dias[new Date().getDay()];

    // Inicializar con el día de hoy
    cargarGatos();
    actualizarMenu(hoy);
    $("#daySelector").val(hoy);

    // Cambiar menú al seleccionar otro día
    $("#daySelector").on("change", function() {
        actualizarMenu($(this).val());
    });

    // Click en un item del menú → abrir modal con detalles
    $(document).on("click", ".menu-item", function() {
        var nombre      = $(this).data("nombre");
        var descripcion = $(this).data("desc");
        var precio      = $(this).data("precio");
        var imagen      = $(this).data("img");

        $("#modalTitulo").text(nombre);
        $("#modalDescripcion").text(descripcion);
        $("#modalPrecio").text(precio);
        $("#modalImagen").attr("src", imagen).attr("alt", nombre);

        var modal = new bootstrap.Modal(document.getElementById("menuModal"));
        modal.show();
    });

    // Hover en item del menú → mostrar imagen flotante
    $(document).on("mousemove", ".menu-item", function(e) {
        var imgUrl = $(this).data("img");
        $("#hoverImagePreview").css({
            "display":          "block",
            "top":              (e.pageY + 15) + "px",
            "left":             (e.pageX + 15) + "px",
            "background-image": "url(" + imgUrl + ")"
        });
    }).on("mouseleave", ".menu-item", function() {
        $("#hoverImagePreview").hide();
    });

});

// REFERENCIAS
/*
https://getbootstrap.com/docs/5.3/components/carousel/
https://getbootstrap.com/docs/5.3/components/modal/
https://getbootstrap.com/docs/5.3/layout/grid/
https://api.jquery.com/mousemove/
https://api.jquery.com/each/
https://api.jquery.com/data/
https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date
*/
