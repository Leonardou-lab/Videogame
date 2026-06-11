# THE COWARD KING

## Game Design Document — Versión Actualizada

**Tactical Roguelite Board Game**

| Game Title | The Coward King |
| :---- | :---- |
| **Genre** | Roguelite Tactical Turn-Based Board Game |
| **Platform** | PC (Desktop / Web Browser) |
| **Target Audience** | Strategy & roguelite fans, 12+ |
| **Team Size/Name** | 3 developers — Silent Crown |
| **Document Status** | Versión final actualizada conforme al programa implementado |
| **Authors** | José Abel Domínguez Rish A01781852 · Leonardo André Flores Mendoza A01787221 · Nicolás Casillas Larrañaga A01787292 |

---

> **Nota sobre este documento:** Este GDD refleja el estado real del juego implementado. Las diferencias con respecto al GDD original se marcan con `[CAMBIO]`. Las secciones que permanecieron iguales se conservan íntegras.

---

# 1. Índice

1. Índice
2. Game Design
   - 2.0 Historia
   - 2.1 Resumen
   - 2.2 Gameplay
   - 2.3 Mindset
   - 2.4 Elementos Roguelite y TCG
   - 2.5 Estilo Visual
   - 2.6 Referencias
3. Technical
   - 3.1 Pantallas
   - 3.2 Controles
   - 3.3 Mecánicas
4. Level Design
   - 4.1 Temas
   - 4.2 Flujo de Juego
5. Development
   - 5.1 Clases Abstractas
   - 5.2 Clases Derivadas
6. Graphics
7. Sounds / Music
8. Backend y Base de Datos
9. Programa de Desarrollo

---

# 2. Game Design

## 2.0 Historia

El Reino de Velundra ha conocido a muchos reyes. Reyes valientes. Reyes feroces. Reyes que cargaron de frente a la batalla, espada en alto, y murieron antes de que sus coronas tuvieran tiempo de perder el brillo.

Luego llegó el Rey Aldric el Prudente, y todo cambió.

Aldric no nació guerrero. Nació estratega. Mientras otros reyes entrenaban sus cuerpos, Aldric entrenó su mente, su lengua y su red de súbditos leales. Cuando la Horda de Esqueletos surgió de las Catacumbas bajo el reino, cada asesor esperaba que marchara. En cambio, Aldric se retiró al centro de su sala de guerra, invocó sus cartas y comenzó a pensar.

Sus enemigos lo llamaron cobardía. Su pueblo lo llamó genio.

Ahora Aldric debe hacer lo que mejor sabe: sobrevivir. No luchando, no huyendo. Sino siendo la persona más inteligente del tablero.

El rey cobarde no huye porque tiene miedo. Huye porque ya está tres movimientos adelante.

---

## 2.1 Resumen

### Descripción Básica del Juego

The Coward King es un juego roguelite altamente táctico, jugado sobre un tablero de 8×8 (similar en tamaño a un tablero de ajedrez). El juego gira en torno a un rey que es a la vez el más poderoso y el más vulnerable del tablero: no puede defenderse directamente, sino que usa una mano de cartas para desplegar aliados y trampas políticas que lo protejan.

El objetivo del juego es que el Rey sobreviva la cantidad de turnos indicados por horda sin que la **presión** en su zona segura 3×3 alcance o supere 2. Un enemigo normal cuenta como 1 de presión; un jefe cuenta como 2.

El juego tiene tres niveles, cada uno con varias hordas y un jefe final, para un total de 12 encuentros. Como en todo buen roguelite, si el Rey cae la partida regresa al Nivel 1 Horda 1, pero conserva las mejoras permanentes compradas con el oro ganado.

`[CAMBIO]` **Condición de derrota revisada:** En el GDD original se indicaba que el Rey perdía si un enemigo lo "tocaba". En la implementación final, la derrota ocurre cuando la presión acumulada de enemigos dentro de la zona segura 3×3 llega a 2 o más, sin importar si el Rey fue tocado directamente. Los jefes cuentan como 2 de presión por sí solos.

### Design Model: Roguelite

- **Mejoras permanentes:** Las mejoras de cartas (+daño, +HP, −coste AP) compradas con oro sobreviven a la muerte. Cada intento es más fuerte que el anterior.
- **`[CAMBIO]` Sistema de checkpoint:** La muerte regresa al jugador siempre al Nivel 1 Horda 1, no al inicio del nivel donde murió como se planeó originalmente.
- **Mano aleatoria:** Se reparten cartas al azar de un pool al inicio de cada horda, generando variación entre intentos.
- **Sesiones cortas:** Cada horda tiene un límite de turnos variable (más adelante detallado). El juego completo toma 1–3 horas.
- **Bucle "una partida más":** La combinación de manos aleatorias, mejoras permanentes y el medidor de Desesperación crea el bucle compulsivo del género.

---

## 2.2 Gameplay

### Objetivo

**Victoria (por horda):** Sobrevivir los turnos requeridos sin que la presión en la zona segura del Rey alcance 2 o más.

**Derrota:** La presión en la zona segura alcanza 2 o más, O la Desesperación del Rey alcanza 4.

**Victoria total:** Completar los 3 niveles (3 hordas + 1 jefe cada uno) = 12 encuentros superados.

### Estructura de Niveles

| Nivel | Encuentros | Turno límite por horda |
| :---- | :---- | :---- |
| **Nivel 1** | Horda 1 / Horda 2 / Horda 3 / Jefe: Skeleton King | 10 / 15 / 20 / sin límite |
| **Nivel 2** | Horda 1 / Horda 2 / Horda 3 / Jefe: Ogre Boss | 20 / 26 / 32 / sin límite |
| **Nivel 3** | Horda 1 / Horda 2 / Horda 3 / Jefe: Brave King | 20 / 28 / 34 / sin límite |

`[CAMBIO]` **Límite de turnos:** El GDD original establecía 30 turnos fijos para todas las hordas. La implementación final usa límites variables y escalonados según la horda y el nivel (mostrados arriba). Los encuentros con jefes no tienen límite de turnos; deben ganarse derrotando al jefe.

`[CAMBIO]` **Checkpoint al morir:** El GDD original especificaba que la muerte en Nivel 2 regresaba al jugador al inicio del Nivel 2. En la implementación final, toda derrota regresa al Nivel 1 Horda 1.

| **Al morir** | Se pierden el oro no gastado y el progreso del intento actual. Las mejoras compradas se conservan. |
| :---- | :---- |
| **Al completar nivel** | Progresión automática al siguiente nivel (sin guardado automático implementado). |
| **Guardado manual** | El jugador puede guardar en cualquier momento desde el menú de pausa. |

### El Tablero (8×8)

El tablero se organiza en una cuadrícula de 8 filas × 8 columnas (64 casillas en total). Las casillas pueden contener:

- El Rey (exactamente 1 en todo momento)
- Una unidad aliada (Knight, Archer, Mage, etc.)
- Una unidad enemiga
- Un efecto de carta (trampa o zona)
- Un obstáculo inamovible (escombros)
- Espacio vacío

El Rey comienza en la casilla central (fila 4, columna 4), y su zona segura 3×3 es dinámica y se mueve con él.

`[CAMBIO]` **Obstáculos inamovibles:** Las hordas más avanzadas generan obstáculos aleatorios en el tablero (escombros, mobiliario roto). Estos bloquean el movimiento y la colocación de cartas. Los encuentros con jefes no generan obstáculos. La cantidad de obstáculos por horda es la siguiente:

| Nivel | Horda 1 | Horda 2 | Horda 3 |
| :---- | :---- | :---- | :---- |
| **1** | 0 | 2 | 4 |
| **2** | 2 | 4 | 6 |
| **3** | 2 | 3 | 4 |

`[CAMBIO]` **Bordes de aparición de enemigos:** Los enemigos aparecen en bordes del tablero que se expanden con la dificultad:

| Nivel | Horda 1 | Horda 2 | Horda 3 |
| :---- | :---- | :---- | :---- |
| **1** | Solo top | Top, izq, der | Top, izq, der, abajo |
| **2** | Top, izq | Top, izq, der | Top, izq, der, abajo |
| **3** | Top, izq, der | Top, izq, der, abajo | Top, izq, der, abajo |

### Sistema de Turnos

| Fase 1 — Jugador | Elige UNA acción principal: jugar carta(s) (gastando AP) O mover al Rey. Abrir mejoras NO consume el turno. |
| :---- | :---- |
| **Fase 2 — Enemigos** | Los enemigos se mueven hacia el Rey. Las unidades aliadas atacan automáticamente si hay un enemigo en rango. |
| **Límite de turnos** | Variable por horda (ver tabla de niveles). Sobrevivir los turnos = victoria automática de esa horda. |
| **`[CAMBIO]` Orden de combate** | En la Horda 1 del Nivel 1, los aliados atacan antes que los enemigos. A partir de la Horda 2 y en todos los encuentros con jefes, los enemigos actúan primero, haciendo las posiciones más peligrosas. |

### Acciones del Jugador (elegir UNA por turno)

- **Jugar Carta(s):** Gastar AP para invocar unidades o colocar efectos. Se pueden jugar múltiples cartas en un turno si hay AP suficiente. No se puede colocar en casillas ocupadas u obstruidas.
- **Mover al Rey:** El Rey se mueve como el rey del ajedrez — 1 casilla en cualquiera de las 8 direcciones. No puede moverse a casillas ocupadas por aliados, enemigos u obstáculos. La zona segura se mueve con él. Mover al Rey **reinicia la Desesperación** a 0.
- **Mejorar Cartas (sin coste de turno):** Accesible desde el menú de mejoras durante el turno del jugador. Cuesta oro (20-50 por mejora). Las mejoras son permanentes entre muertes.

### Sistema de Recursos

| AP inicial | 5 por horda |
| :---- | :---- |
| **`[CAMBIO]` Recuperación de AP** | Si el Rey NO se mueve durante el turno, se gana +1 AP al final del turno. Si el Rey se mueve, no se gana AP. |
| **`[CAMBIO]` AP máximo** | Limitado a 5 en todo momento (no ilimitado como se indicó originalmente). |
| **Coste de cartas** | 1 a 4 AP según el poder de la carta. |
| **Oro por horda** | 10 oro al ganar una horda normal. |
| **`[CAMBIO]` Oro por jefe** | 25 oro al derrotar a un jefe (no se mencionaba en el GDD original). |
| **Oro al morir** | El oro no gastado se pierde. Las mejoras compradas se conservan. |

### Sistema de Cartas — Mecánica de Mano

- Al inicio de cada horda: recibir cartas aleatorias del pool (3 en la primera horda introductoria del Nivel 1; 4 en el resto).
- Al ganar una horda: elegir 1 carta de la mano anterior para conservar, luego recibir cartas nuevas aleatorias hasta completar 4.
- Tamaño máximo de mano: 4 cartas.
- Las cartas jugadas no regresan a la mano hasta la siguiente horda.

`[CAMBIO]` **Límites de colocación por mejora:** Las cartas de tipo aliado con altos niveles de mejora tienen un límite de cuántas copias pueden estar en el tablero simultáneamente. A nivel de mejora 3, solo se pueden tener 3 copias en juego. A nivel 2, máximo 5 copias. Sin mejora, sin límite.

---

### Pool Completo de Cartas (15 Cartas)

`[CAMBIO]` **El pool original contemplaba "Royal Decree" (empuje 3×3). En la implementación final, esta carta fue reemplazada por "Bomb" (daño masivo en área 3×3).** El resto de las cartas se conservó con ajustes menores de coste.

| Carta | Tipo | Coste (AP) | Stats | Efecto |
| :---- | :---- | :---- | :---- | :---- |
| **Knight** | Unidad Aliada | 3 | 80 HP / 30 DMG | Melé. Ataca al enemigo adyacente más cercano. |
| **Archer** | Unidad Aliada | 2 | 50 HP / 20 DMG | Estacionario. Ataca al enemigo más cercano en rango 3. |
| **Mage** | Unidad Aliada | 4 | 40 HP / 25 DMG | Ataca al enemigo más cercano en rango 2. Frágil pero poderoso. |
| **Pikeman** | Unidad Aliada | 2 | 60 HP / 15 DMG | Ataca al enemigo más cercano en rango 1. |
| **Wall** | Unidad de Defensa | 3 | 150 HP / 0 DMG | Bloquea la casilla. Los enemigos deben destruirla o rodearla. Tiene 3 frames visuales según HP restante. |
| **Squire** | Unidad de Defensa | 2 | 70 HP / 10 DMG | Reduce un 50% el daño a aliados adyacentes. |
| **Tower** | Unidad de Defensa | 4 | 100 HP / 35 DMG | Estacionario. Ataca en rango 4. |
| **Guardian** | Unidad de Defensa | 3 | 120 HP / 25 DMG | Unidad tanque. Absorbe mucho daño. |
| **Royal Guard** | Unidad de Defensa | 2 | 90 HP / 0 DMG | Sigue al Rey automáticamente cada vez que se mueve. |
| **Trench** | Unidad de Defensa | 1 | 40 HP / 0 DMG | Barricada barata que bloquea casilla. |
| **Exile** | Trampa | 2 | — | Trampa: el enemigo que pise esta casilla queda paralizado 2 turnos. |
| **`[CAMBIO]` Bomb** | Zona | 4 | 40 DMG | Se detona al colocarse. 40 de daño a todos los enemigos en 3×3. Reemplaza a "Royal Decree". |
| **Peace Treaty** | Zona | 2 | — | Zona 3×3. Congela a los enemigos dentro de la zona cada turno durante 4 turnos. |
| **Royal Curse** | Zona | 3 | — | Zona 3×3. Los enemigos dentro reciben 50% menos daño durante 5 turnos. |
| **Decoy** | Unidad Especial | 1 | 30 HP / 0 DMG | Los enemigos priorizan atacar al Decoy en lugar de al Rey. No se puede mejorar. |

> **Nota de implementación sobre "Royal Decree":** Esta carta del GDD original (empujaba a los enemigos 1 casilla por turno desde una zona 3×3) fue descartada durante el desarrollo. Su rol de empuje fue parcialmente absorbido por la necesidad de gestionar el movimiento del Rey (Desesperación) y la Bomb.

---

### Mejoras de Cartas con Oro

Solo las cartas de tipo aliado (excluyendo Decoy) son mejorables. Las mejoras son acumulativas desde el nivel base.

| Nivel de Mejora | Coste en Oro | Bonificación | Ejemplo: Knight |
| :---- | :---- | :---- | :---- |
| **Base (Nivel 0)** | — | — | 80 HP / 30 DMG / 3 AP |
| **Nivel 1** | 20 oro | +15 HP / +10 DMG | 95 HP / 40 DMG / 3 AP |
| **Nivel 2** | 40 oro | +25 HP / +20 DMG / −1 AP | 105 HP / 50 DMG / 2 AP |
| **Nivel 3** | 50 oro | +40 HP / +35 DMG / −1 AP | 120 HP / 65 DMG / 2 AP |

Las mejoras deben ser progresivas (no se puede saltar de Nivel 1 a Nivel 3 directamente).

---

### Stats de Enemigos por Nivel

`[CAMBIO]` **HP del Skeleton King ajustado:** El GDD original indicaba 200 HP para el Skeleton King. En la implementación final, el Skeleton King tiene **500 HP** para hacer el encuentro más desafiante y acorde al resto de los jefes.

| Nivel | Enemigo | HP | Daño | Velocidad | Notas |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Nivel 1** | Skeleton | 50 | 15 | 1 casilla/turno | Básico. Fácil de interceptar. |
| **Nivel 2** | Ogre | 80 | 25 | 1 casilla/turno | Más resistente. Requiere unidades más fuertes. |
| **Nivel 3** | Elite Warrior | 100 | 35 | 2 casillas/turno | Rápido. Evade defensas lentas. |
| **`[CAMBIO]` Jefe 1** | Skeleton King | **500** | 30 | Especial | Invoca cada 2 turnos. Avanza cada 3 turnos. Ocupa 2×2. |
| **Jefe 2** | Ogre Boss | 350 | 40 | Especial | Igual que Jefe 1 pero con estadísticas más altas. |
| **Jefe 3** | Brave King | 500 | 50 | Especial | Desafío final. Invocados son Elite Warriors. |

`[CAMBIO]` **Invocados por los jefes:**

| Jefe | Invocado | HP Invocado | DMG Invocado |
| :---- | :---- | :---- | :---- |
| Skeleton King | Skeleton Vanguard | 80 | 22 |
| Ogre Boss | Ogre Brute | 100 | 30 |
| Brave King | Royal Elite | 120 | 40 |

### Mecánica de Jefes

`[CAMBIO]` **La mecánica de jefes fue modificada respecto al GDD original.** El GDD indicaba que el jefe "no se mueve mientras su invocado está vivo, y avanza 1 casilla cuando muere". En la implementación final, los jefes siguen un patrón basado en turnos (no en la muerte de sus invocados):

- Al inicio del combate, el jefe ocupa 2×2 casillas en la parte superior del tablero.
- **Invocación:** El jefe invoca un enemigo adicional cada 2 turnos.
- **Movimiento:** El jefe avanza 1 casilla hacia el Rey cada 3 turnos.
- El ciclo continúa hasta que el jefe sea derrotado o alcance al Rey.
- Los jefes cuentan como 2 de presión en la zona segura.
- Los encuentros con jefes no tienen límite de turnos: el jugador debe derrotar al jefe para ganar.
- Los encuentros con jefes no generan obstáculos para dar espacio al 2×2 del jefe.

---

## 2.3 Mindset

*(Esta sección permanece igual que en el GDD original.)*

### 1. Tensión Táctica Constante

Cada turno presentará desafíos complejos y obligará al jugador a tomar decisiones difíciles: ¿guardar AP para jugadas más poderosas o desplegar una unidad ahora? ¿Mantener la posición del Rey o arriesgar un movimiento?

### 2. Satisfacción del Plan Perfecto

Cuando el jugador coloca una pared estratégica, usa el Peace Treaty para congelar a tres enemigos en una sola jugada, o combina cartas de manera inteligente, crea una experiencia extraordinaria al ver su estrategia desarrollarse en el tablero.

### 3. Cobardía Estratégica (No Humillante)

El Rey huye y nunca ataca, pero esto no es debilidad: es astucia. El jugador actúa como el cerebro detrás de la operación, implementando estrategias para mantener vivo al Rey. La animación del Rey con expresiones cómicas refuerza este tono sin volverlo vergonzoso.

### 4. Aprender a través de la Repetición

Cada muerte enseña algo. "Debería haber usado Exile antes." "La próxima vez pondré el Tower primero." El sistema de mejoras permanentes crea una sensación de progreso en lugar de frustración.

### 5. Una Partida Más (Adicción Saludable)

Las manos aleatorias y el sistema de Desesperación (que fuerza al Rey a moverse) garantizan que cada intento sea diferente, promoviendo la rejugabilidad.

---

## 2.4 Elementos Roguelite y TCG

*(Esta sección se actualiza para reflejar la implementación final.)*

### Elementos Roguelite

| Característica Roguelite | Implementación en The Coward King |
| :---- | :---- |
| **Progresión permanente** | Mejoras de cartas (+daño, +HP, −coste) compradas con oro sobreviven a la muerte. |
| **`[CAMBIO]` Sistema de checkpoint** | La muerte reinicia desde el Nivel 1 Horda 1. |
| **Corridas aleatorizadas** | Cartas aleatorias en cada horda desde un pool de 15. Distintas builds en cada intento. |
| **Sesiones cortas** | Cada horda tiene un límite de turnos variable. El juego completo dura 1-3 horas. |
| **Fallo significativo** | La derrota siempre enseña algo. El juego muestra qué causó la derrota. |
| **`[NUEVO]` Sistema de Desesperación** | El Rey debe moverse periódicamente. No moverse aumenta la Desesperación; al llegar a 4, el intento se pierde. Esto fuerza una toma de decisiones activa y previene que el jugador se quede quieto indefinidamente. |

### Elementos TCG

| Característica TCG | Implementación en The Coward King |
| :---- | :---- |
| **Gestión de mano** | El jugador tiene 3-4 cartas por horda y decide cuándo jugar cada una. |
| **Pool y aleatoriedad** | 15 cartas en el pool. Se reparten aleatoriamente, creando estrategias variables. |
| **Sistema de coste de recursos** | AP (1-4 por carta) refleja el sistema de maná/energía de los TCG. |
| **Elección de retención** | Entre hordas, el jugador conserva 1 carta de su mano anterior. |
| **Mejora de cartas** | Mejoras permanentes (+daño, +HP, −coste) reflejan el sistema de mejora de TCGs y CCGs. |
| **Potencial de sinergia** | Combinar cartas (Exile + Mage, Wall + Tower, Peace Treaty + Guardian) crea combos poderosos. |

---

## 2.5 Estilo Visual

*(Esta sección refleja lo implementado; se actualizan detalles menores.)*

### Dirección Artística

The Coward King usa una estética de pixel art. El tablero tiene un estilo oscuro con casillas alternadas azul-grisáceas (#3f4652 / #252c35) y un borde dorado. La zona segura se resalta con un tono dorado semitransparente.

| Estilo artístico | Pixel art, sprites de tamaño variable por tipo de unidad |
| :---- | :---- |
| **Estilo del tablero** | Cuadrícula 8×8 con tonos azul-grisáceos alternados. Zona segura resaltada en dorado suave. |
| **Paleta de colores** | Paleta medieval apagada: grises de piedra, verdes oscuros, amarillos pergamino, rojos profundos para enemigos. |
| **`[NUEVO]` Panel de Desesperación** | Panel lateral con imagen del Rey que cambia según el nivel de Desesperación (0-4). Oscila entre calma y pánico total. Pulsa visualmente cuando la Desesperación es crítica. |
| **Animaciones** | Sprites con animaciones de 1-6 frames por unidad (idle + ataque). La pared tiene 3 frames según HP restante. |
| **UI de cartas** | Botones de carta con imagen de arte, stats (HP/DMG), coste AP, descripción y tag de nivel de mejora. |
| **Tono** | Cómico pero legible. El humor viene de las expresiones del Rey y los textos de las cartas, no del caos visual. |

### Sprites Implementados

Los siguientes sprites están implementados y cargados en el juego:

| Sprite | Animación |
| :---- | :---- |
| King | 3 cols × 2 rows (6 frames) |
| Skeleton | 3 cols × 1 row |
| Skeleton King (jefe) | 1 frame |
| Knight | 2 cols × 2 rows |
| Archer | 3 cols × 2 rows |
| Wall | 3 cols × 1 row (daño visual) |
| Mage | 3 cols × 2 rows |
| Guardian | 3 cols × 2 rows |
| Ogre | 2 cols × 2 rows |
| Ogre Boss | 1 frame |
| Elite Warrior | 2 cols × 2 rows |
| Squire | 2 cols × 2 rows |
| Pikeman | 3 cols × 1 row |
| Royal Guard | 1 frame |
| Brave King (jefe) | 1 frame |
| Tower | 1 frame |
| Decoy | 1 frame |
| Trench | 1 frame |

Todas las unidades tienen barra de HP dibujada debajo (excepto el Rey). El color de la barra cambia de verde → naranja → rojo según HP restante.

### Backgrounds por Nivel

Cada nivel tiene su imagen de fondo propia:
- **Nivel 1 Catacumbas:** `Assets/Level1.png`
- **Nivel 2 Ogre Dungeon:** `Assets/Level2.png`
- **Nivel 3 Brave King's Castle:** `Assets/Level3.png`

---

## 2.6 Referencias

*(Sin cambios respecto al GDD original.)*

- **Into the Breach:** Inspiración para la claridad del tablero y el enfoque en posicionamiento estratégico.
- **Slay the Spire:** Inspiración para la UI de cartas y la progresión roguelite.
- **Dungeon of the Endless:** Inspiración para la defensa por oleadas con recursos limitados.

---

# 3. Technical

## 3.1 Pantallas

`[NUEVO]` **El sistema de pantallas fue ampliado respecto al GDD original.** Se implementó un menú principal completo, sistema de autenticación, pantalla de estadísticas con gráficas, y pantalla de victoria final.

### Menú Principal (indexMenu.html)

Primera pantalla al abrir el juego. Contiene:

1. **Botón de Login/Usuario**
   - Permite crear una cuenta o iniciar sesión con nombre de usuario y contraseña.
   - Almacena el progreso, estadísticas y mejoras del jugador.
   - Modo invitado disponible (sin persistencia en servidor).
   - Opción de registrarse como Administrador (con acceso al panel admin de estadísticas).

2. **START GAME**
   - Inicia una nueva partida desde el Nivel 1.

3. **TUTORIAL**
   - Modal con explicación de todas las reglas, controles, cartas y video tutorial integrado.

4. **STATISTICS**
   - Panel personal con estadísticas del jugador (partidas jugadas, enemigos eliminados, oro ganado, niveles completados, historial de intentos).
   - Gráfica de rendimiento por intento (Chart.js, tipo barra).
   - Gráfica de mejoras de cartas (Chart.js, tipo radar).
   - Tabla de mejoras compradas.
   - **Panel Admin** (solo para administradores): leaderboard global, distribución de muertes, tasas de completación por horda, popularidad de mejoras de cartas.

5. **CREDITS**
   - Nombre del proyecto, género, equipo y miembros.

6. **SETTINGS**
   - Sliders de volumen: Máster, Música, Efectos de sonido.
   - Configuración se guarda en localStorage.

### Pantalla de Juego (index.html)

Pantalla principal de gameplay. Dividida en:

- **Zona del Tablero:** Canvas 620×620px centrado. Muestra el tablero 8×8, el Rey, aliados, enemigos, efectos, obstáculos, zona segura resaltada y highlights de movimiento/colocación.
- **Panel de Mano (handPanel):** En la parte inferior. Muestra las cartas disponibles con arte, stats y coste AP. En modo "keep-mode", permite elegir qué carta conservar.
- **HUD:** En la parte superior. Muestra Nivel, Encuentro, Turno/Límite, Fase, AP, Oro, Enemigos en tablero/máximo, y Estado.
- **`[NUEVO]` Panel de Desesperación:** Panel lateral que muestra el nivel de Desesperación (0-4) con imagen del Rey y medidor visual. Pulsa y se torna rojo cuando es crítico.
- **Log de Eventos:** Historial de los últimos 8 eventos de la partida.
- **Botones de acción:** Move King, End Turn, Upgrades, Menú (pausa).

### Pantalla de Transición (elección de carta)

Aparece tras ganar una horda. El panel de mano cambia a "keep-mode" y el jugador hace clic en la carta que desea conservar. Una vez elegida, el botón "Continue" se activa.

### Pantalla de Mejoras (Overlay)

Accesible durante el turno del jugador. Muestra todas las cartas mejorables con sus stats actuales, stats del siguiente nivel y coste en oro. Las mejoras se aplican inmediatamente incluyendo a copias de la carta ya en la mano actual.

### Menú de Pausa (Overlay)

Accesible durante el juego con el botón de menú. Opciones:
- Reanudar
- Guardar partida (localStorage)
- Volver al menú principal

### Game Over / Pantalla de Resultado

Se muestra al ganar o perder una horda/jefe. El botón "Continue" (victoria) o "Retry Level" (derrota) aparece en el HUD para continuar.

### `[NUEVO]` Pantalla de Victoria Final

Se activa al completar el Nivel 3 incluyendo al Brave King. Muestra un overlay especial de celebración con opción de volver al menú.

---

## 3.2 Controles

`[CAMBIO]` **El juego es controlable tanto con el ratón como con el teclado.** El GDD original especificaba solo control con ratón.

| Acción | Input |
| :---: | :---: |
| Seleccionar carta de la mano | Clic izquierdo sobre la carta |
| Colocar unidad o trampa en el tablero | Clic izquierdo en casilla válida |
| Mover al Rey (clic) | Clic en botón "Move King", luego clic en casilla adyacente válida |
| Mover al Rey (teclado) | Flechas / WASD para 4 direcciones; Q/E/Z/C para diagonales |
| Cancelar selección | Escape |
| Terminar turno | Clic en "End Turn" o barra espaciadora |
| Abrir menú de mejoras | Clic en "Upgrades" |
| Abrir menú de pausa | Clic en botón de menú o Escape (si overlay de mejoras está cerrado) |
| Navegar menús | Clic izquierdo |

Las casillas muestran feedback visual al pasar el cursor: azul para movimiento del Rey, verde para colocación de cartas.

---

## 3.3 Mecánicas

### Sistema de Fases de Turno

1. **Fase del Jugador:** El jugador puede jugar cartas, mover al Rey, abrir mejoras, o terminar el turno sin acción. Las cartas se seleccionan haciendo clic en ellas y luego en la casilla destino.
2. **Fase del Enemigo:** Los efectos de zona se aplican (Peace Treaty, Royal Curse), luego se resuelve el combate (orden según horde number), limpieza de objetos muertos, conteo de efectos activos, verificación de derrota, actualización de Desesperación, verificación de victoria, spawn de nuevos enemigos y recuperación de AP.

### `[NUEVO]` Sistema de Desesperación

Mecánica nueva no descrita en el GDD original:

- Si el Rey NO se mueve durante el turno del jugador, la Desesperación aumenta en 1 (máximo 4).
- Si el Rey SE mueve, la Desesperación se reinicia a 0.
- Al alcanzar Desesperación ≥ 3, se activa un sonido de bucle de advertencia.
- Al alcanzar Desesperación = 4, la partida se pierde con el mensaje "Defeat: the King surrendered to desperation."
- El panel lateral muestra la cara del Rey cambiando de tranquilo a aterrorizado conforme sube la Desesperación.
- Propósito: Evitar que el jugador se quede estático indefinidamente y forzar movimiento activo del Rey.

### Sistema de AP

- El jugador comienza cada horda con 5 AP.
- `[CAMBIO]` **El AP está limitado a un máximo de 5 en todo momento** (no ilimitado como indicaba el GDD).
- Si el Rey no se mueve, se recupera +1 AP al final del turno (hasta el límite de 5).
- Si el Rey se mueve, no se recupera AP ese turno.
- Las cartas cuestan 1-4 AP.
- `[CAMBIO]` **El bonus de +5 AP por ganar horda descrito en el GDD original no está implementado.** La recuperación de AP es exclusivamente a razón de +1 por turno sin movimiento del Rey.

### Selección y Colocación de Cartas

- El jugador hace clic en una carta de la mano para seleccionarla (se resaltan casillas válidas en verde).
- Las cartas de tipo "ally" crean una unidad aliada en la casilla elegida.
- Las cartas de tipo "trap" (Exile) crean un efecto de trampa en la casilla elegida.
- Las cartas de tipo "zone" (Peace Treaty, Royal Curse) crean un efecto de zona.
- `[NUEVO]` Las cartas de tipo "zone" con nombre "Bomb" detonan inmediatamente al colocarse, causando daño AOE sin dejar un efecto permanente.
- No se pueden colocar cartas en casillas ocupadas o con efectos activos.

### Movimiento del Rey

- Al hacer clic en el Rey o en "Move King", se activa el modo de movimiento (casillas válidas en azul).
- El Rey se mueve 1 casilla en cualquier dirección, incluyendo diagonal.
- No puede moverse a casillas ocupadas por aliados, enemigos u obstáculos.
- `[NUEVO]` El Royal Guard sigue automáticamente al Rey en cada movimiento.
- Mover al Rey consume el turno y reinicia la Desesperación.

### Aleatorización de Mano

- Primera horda del Nivel 1: 3 cartas aleatorias del pool de 15.
- Resto de hordas y jefes: 4 cartas (1 conservada + 3 nuevas aleatorias, o 4 nuevas si no se conserva ninguna).

### Sistema de Spawn de Enemigos

- En cada turno de la fase enemiga (en hordas normales), se generan entre 1-2 nuevos enemigos en los bordes disponibles.
- La cantidad exacta está limitada por `maxEnemiesOnBoard` de la horda actual.
- Los enemigos no aparecen dentro de la zona segura ni en casillas ocupadas.
- Los encuentros con jefes no generan nuevos enemigos via spawn; solo el jefe puede invocar a sus minions.

### Sistema de Mejoras de Cartas

- Accesible desde el overlay de mejoras durante el turno del jugador.
- Muestra todas las cartas mejorables (tipo "ally" excepto Decoy) con stats actuales y del siguiente nivel.
- Al comprar una mejora, se descuenta el oro, se sube el nivel en el `upgradeRegistry` (persiste entre muertes), y las cartas ya en mano se actualizan inmediatamente.
- Las mejoras persisten a través de muertes porque el `upgradeRegistry` solo se reinicia al comenzar una partida completamente nueva.

### Sistema de Guardado

- **Guardado manual:** El jugador puede guardar en el menú de pausa. Se guarda en localStorage la posición actual, oro, AP, nivel, horda, mano y mejoras.
- **Sin guardado automático por nivel** (el GDD original describía auto-guardado al completar niveles, pero no fue implementado).

### Movimiento de Aliados (Revisado)

`[CAMBIO]` **El GDD original describía aliados que se movían automáticamente (Knight hacia el enemigo más cercano, Pikeman rápido). En la implementación final, todos los aliados son estacionarios (speed = 0) y solo atacan al enemigo más cercano en su rango de ataque.** El Royal Guard es la excepción: sigue al Rey al moverse.

### Sistema de Combate Aliado

- En cada fase enemiga, todos los aliados vivos con damage > 0 atacan automáticamente al enemigo más cercano dentro de su rango.
- El Squire reduce en 50% el daño recibido por aliados adyacentes.
- Los ataques del Rey son imposibles (damage = 0, range = 0).
- Si un enemigo está adyacente a un aliado, el enemigo ataca al aliado en lugar de avanzar.
- Los enemigos "cursados" (bajo Royal Curse) hacen 50% menos daño.

---

# 4. Level Design

## 4.1 Temas

*(Esta sección se actualiza con información del código final.)*

### Nivel 1: Skeleton King, Catacombs

**Ambiente:** Atmósfera sombría. Paredes de piedra fría, antorchas parpadeantes y arcos en ruinas enmarcan el tablero. Paleta de colores: grises de piedra, azules fríos, amarillos apagados de luz de antorchas.

**Interactivos:**
- Skeletons (50 HP / 15 DMG / 1 casilla/turno). 3 hordas progresivas.
- Skeleton King (Boss 500 HP / 30 DMG). Ocupa 2×2. Invoca un Skeleton Vanguard cada 2 turnos. Avanza 1 casilla hacia el Rey cada 3 turnos.
- Skeleton Vanguard (invocado): 80 HP / 22 DMG.

**Configuración de hordas:**

| Horda | Turnos máx | Enemigos/turno | Max en tablero | Obstáculos |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 10 | 1 | 8 | 0 |
| 2 | 15 | 1 | 10 | 2 |
| 3 | 20 | 2 | 12 | 4 |
| Boss | sin límite | (invocados por jefe) | — | 0 |

**Desafíos:** Introducción al bucle principal de juego: gestión de AP, colocación de cartas y defensa de la zona segura. Las estadísticas del enemigo son bajas, dando margen al jugador para experimentar.

---

### Nivel 2: Ogre Boss, Ogre Dungeon

**Ambiente:** Mazmorra oscura y opresiva con toques de bosque retorcido. Sombras más profundas, piedra musgosa y rojos profundos. Paleta: verdes oscuros, marrones oscuros, rojos apagados, sombras turbias.

**Interactivos:**
- Ogres (80 HP / 25 DMG / 1 casilla/turno). Requieren unidades más fuertes o combos de cartas.
- Ogre Boss (350 HP / 40 DMG). Ocupa 2×2. Invoca Ogre Brutes cada 2 turnos. Avanza cada 3 turnos.
- Ogre Brute (invocado): 100 HP / 30 DMG.

**Configuración de hordas:**

| Horda | Turnos máx | Enemigos/turno | Max en tablero | Obstáculos |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 20 | 1 | 7 | 2 |
| 2 | 26 | 1 | 9 | 4 |
| 3 | 32 | 2 | 10 | 6 |
| Boss | sin límite | (invocados por jefe) | — | 0 |

**Desafíos:** Mayor HP de enemigos exige mejor gestión del AP. Los jugadores deben confiar en sinergias (Wall + Tower, Guardian + Archer). El jefe requiere daño sostenido a través de múltiples ciclos de invocación.

---

### Nivel 3: Brave King, Brave King's Castle

**Ambiente:** El nivel final en la sala del trono del reino enemigo. Ornamentos ricos, ventanas altas y luz dorada de velas crean un fondo visualmente impactante. Paleta: rojos profundos, acentos dorados, púrpuras reales y iluminación dramática.

**Interactivos:**
- Elite Warriors (100 HP / 35 DMG / 2 casillas/turno). Movimiento doble que evita muchas formaciones defensivas.
- Brave King (Boss 500 HP / 50 DMG). Ocupa 2×2. Invoca Royal Elites cada 2 turnos. Avanza cada 3 turnos.
- Royal Elite (invocado): 120 HP / 40 DMG / 2 casillas/turno.

**Configuración de hordas:**

| Horda | Turnos máx | Enemigos/turno | Max en tablero | Obstáculos |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 20 | 1 | 8 | 2 |
| 2 | 28 | 2 | 10 | 3 |
| 3 | 34 | 2 | 12 | 4 |
| Boss | sin límite | (invocados por jefe) | — | 0 |

**Desafíos:** El movimiento doble de los Elite Warriors rompe las formaciones defensivas de niveles anteriores. Las cartas políticas (Exile, Peace Treaty) se vuelven críticas. Los aliados invocados del jefe son en sí mismos una amenaza severa que requiere eliminar rápidamente.

---

## 4.2 Flujo de Juego

```
Menú Principal
  └── START GAME
         │
         ▼
Nivel 1 - Horda 1  ──(victoria: elige carta a conservar)──►  Horda 2  ──►  Horda 3  ──►  Boss: Skeleton King
                                                                                                  │
         ┌────────────────────────────────────────────────────────────────────────────────────────┘
         ▼
Nivel 2 - Horda 1  ──►  Horda 2  ──►  Horda 3  ──►  Boss: Ogre Boss
         │
         ▼
Nivel 3 - Horda 1  ──►  Horda 2  ──►  Horda 3  ──►  Boss: Brave King
                                                            │
                                                            ▼
                                                    PANTALLA DE VICTORIA FINAL
```

**Reglas de transición:**
- Entre cada horda: pantalla de selección de carta a conservar → nueva mano de 4 cartas.
- La tienda de mejoras está disponible en cualquier momento durante el turno del jugador.
- Al morir: regreso a Nivel 1 Horda 1. Mejoras conservadas, oro perdido.
- Sin selección de nivel de inicio; la progresión siempre es secuencial.

---

# 5. Development

## 5.1 Clases Abstractas (Componentes)

*(Esta sección refleja las clases realmente implementadas.)*

### GameObject (Clase Base — Base de todos los objetos del juego)

Representada internamente en el motor del juego. Todos los objetos del tablero extienden `BoardObject extends GameObject`.

Atributos:
- `position` → Posición en píxeles en el canvas.
- `type` → Identificador de tipo (king, enemy, ally, trap, zone, obstacle).
- `isActive` → Estado activo/inactivo.

Métodos:
- `update()` → Actualiza el estado del objeto.
- `render()` → Dibuja el objeto en pantalla.

### BoardObject (Clase derivada de GameObject)

Añade coordenadas de casilla al tablero.

Atributos:
- `row`, `col` → Posición en la cuadrícula 8×8.

Métodos:
- `setTile(row, col)` → Mueve el objeto a una nueva casilla.

### Unit (Clase Abstracta — extiende BoardObject)

Representa cualquier entidad que puede moverse o recibir daño.

Atributos:
- `hp`, `maxHp` → Puntos de vida.
- `damage` → Valor de ataque.
- `range` → Rango de ataque en casillas.
- `speed` → Casillas por turno.
- `stunTurns` → Turnos de parálisis restantes.
- `slowedThisTurn` → Marcador si fue congelado este turno.
- `cursedThisTurn` → Marcador si está bajo Royal Curse este turno.

Métodos:
- `takeDamage(amount)` → Reduce HP.

### Board (Componente)

Gestiona el sistema de cuadrícula 8×8.

Atributos:
- Listas separadas: `allies[]`, `enemies[]`, `effects[]`, `obstacles[]`.
- `safeZone` → Área dinámica 3×3 alrededor del Rey.

Métodos:
- `isInSafeZone(row, col)`, `isInsideBoard(row, col)`, `getBlockingObject(row, col)`.
- `spawnEnemies()`, `spawnBoss()`, `generateObstacles()`.
- `checkDefeat()` → Verifica si la presión en la zona segura ≥ 2.

### TurnManager (Componente)

Controla el flujo del juego.

Atributos:
- `phase` → "player" o "enemy".
- `turn` → Turno actual.
- `desperation` → Nivel de desesperación del Rey (0-4).
- `status` → "playing", "won", o "lost".

Métodos:
- `resolveTurn()` → Ejecuta toda la lógica de fin de turno.
- `endPlayerTurn()` → Pasa a la fase enemiga.
- `updateDesperation()` → Actualiza el medidor de Desesperación.

---

## 5.2 Clases Derivadas

### King (extiende Unit)

Unidad especial controlada por el jugador.
- HP = 0, Damage = 0, Range = 0, Speed = 1.
- No puede atacar.
- Se mueve 1 casilla en cualquier dirección (movimiento del rey de ajedrez).
- Su posición determina la zona segura 3×3.

### Enemy (extiende Unit)

Enemigo regular que aparece cada turno y trata de alcanzar al Rey.
- Tiene `safeZoneWeight` (normalmente 1; para jefes 2).
- Tiene `tileSpan` (normalmente 1; para jefes 2).

### Boss (extiende Enemy)

Jefe del nivel. Ocupa 2×2 casillas.
- `tileSpan = 2`.
- `summonEveryTurns` (cada N turnos invoca un minion).
- `moveEveryTurns` (avanza 1 casilla cada M turnos).

### Ally (extiende Unit)

Unidad aliada colocada por el jugador desde una carta.
- `cardName` → Nombre de la carta de origen.
- `speed = 0` (todos los aliados son estacionarios excepto Royal Guard que sigue al Rey).
- Ataca automáticamente al enemigo más cercano en su rango.

### Obstacle (extiende BoardObject)

Obstáculo inamovible en el tablero.
- Bloquea movimiento y colocación de cartas.
- No puede ser destruido.
- Generado aleatoriamente al inicio de cada horda (no en boss fights).

### BoardEffect (extiende BoardObject)

Efecto temporal colocado por una carta (trampa o zona).
- `effectType` → "trap" (Exile) o "zone" (Peace Treaty, Royal Curse).
- `duration` → Turnos restantes activo.
- `radius` → Radio del efecto (0 para trap, 1 para zone = 3×3).

### HandSystem (Componente)

Gestiona las cartas del jugador.

Atributos:
- `hand[]` → Mano actual (máx. 4 cartas).
- `keptCardName` → Carta elegida para conservar entre hordas.
- `upgradeRegistry{}` → Diccionario {nombre_carta: nivel_mejora} persistente entre muertes.

Métodos:
- `drawCards(amount)` → Selecciona cartas aleatorias del pool aplicando mejoras.
- `playCard(row, col)` → Coloca la carta seleccionada en el tablero.
- `chooseCardToKeep(card)` → Marca la carta a conservar.
- `applyUpgradeToCard(card)` → Aplica las mejoras al stat base de la carta.

### EnemySpawner (Componente)

Controla la generación de enemigos.

Comportamiento:
- Genera 1-2 enemigos por turno según configuración de la horda.
- Colocación aleatoria en bordes disponibles.
- Respeta el límite máximo de enemigos en tablero.

### UpgradeSystem (Componente)

Gestiona la meta-progresión.

Atributos:
- `gold` → Oro actual del jugador.
- `upgradeRegistry{}` → Persistente entre muertes.

Métodos:
- `purchaseUpgrade(cardName)` → Descuenta oro y sube el nivel en el registro.
- `renderUpgradeOverlay()` → Construye la UI de mejoras.

---

# 6. Graphics

## 6.1 Atributos de Estilo

*(Sin cambios respecto al GDD original.)*

- Pixel art, sprites de tamaño adaptado al tablero.
- Paleta medieval apagada.
- Tono cómico y legible.

## 6.2 Gráficos Implementados

### Personajes y cartas en tablero

- King (sprite animado, 6 frames)
- Skeleton, Skeleton King (boss 2×2)
- Ogre, Ogre Boss (boss 2×2)
- Elite Warrior, Brave King (boss 2×2)
- Knight, Archer, Mage, Pikeman
- Wall (sprite con daño visual progresivo)
- Squire, Tower, Guardian, Royal Guard
- Decoy, Trench
- Obstacle (escombros inamovibles)

### Interfaz

- Cartas en mano con arte propio por nivel de mejora (base, lvl1, lvl2, lvl3)
- Panel de Desesperación con 5 imágenes (Cara0.png a Cara4.png)
- Overlay de mejoras, pausa y victoria
- HUD con información de nivel, turno, AP, oro, enemigos

### Backgrounds

- Assets/Level1.png, Level2.png, Level3.png

---

# 7. Sounds / Music

## 7.1 Atributos de Estilo

*(Sin cambios respecto al GDD original.)*

Música de ambiente de temática medieval que cambia por nivel. Efectos de sonido para cada carta jugada y eventos de combate.

## 7.2 Efectos de Sonido Implementados

| Evento | Archivo |
| :---- | :---- |
| Clic en botón | sfx/button-click.mp3 |
| Movimiento del Rey | sfx/button-click.mp3 |
| Victoria | sfx/victory.mp3 |
| Derrota | sfx/defeat.m4a |
| Desesperación crítica (bucle) | sfx/desperation-critical.mp3 |
| Muerte por Desesperación | sfx/desperation-death.mp3 |

Efectos de sonido por carta: knight, archer, mage, pikeman, wall, squire, tower, guardian, royal-guard, trench, exile, bomb, peace-treaty, royal-curse, decoy.

## 7.3 Música Implementada

| Nivel | Track |
| :---- | :---- |
| Nivel 1 — Catacombs | audio/level1-skeletons.mp3 |
| Nivel 2 — Ogre Dungeon | audio/level2-ogres.mp3 |
| Nivel 3 — Royal Castle | audio/level3-royal.mp3 |

La música cambia automáticamente al entrar a un nuevo nivel. El menú principal reproduce un track aleatorio de los tres disponibles. El volumen es ajustable por separado (máster, música, SFX) y se guarda en localStorage.

---

# 8. Backend y Base de Datos

`[NUEVO]` **Esta sección no existía en el GDD original.** El juego implementa un backend completo con base de datos relacional para persistencia de jugadores, estadísticas y mejoras.

### Stack Técnico

- **Servidor:** Node.js + Express.js
- **Base de datos:** MySQL (base de datos `coward_king`)
- **Puerto:** localhost:3000
- **Autenticación:** Hash SHA-256 de contraseñas

### Endpoints de API Implementados

| Método | Ruta | Función |
| :---- | :---- | :---- |
| GET | /api/cards | Cargar el pool completo de cartas |
| GET | /api/enemies/:levelId | Cargar enemigos de un nivel |
| POST | /api/player | Registrar nuevo jugador |
| GET | /api/player/:username | Login / buscar jugador |
| GET | /api/player/:id/dashboard | Estadísticas personales |
| GET | /api/player/:id/upgrades | Mejoras del jugador |
| POST | /api/upgrade | Guardar mejora de carta |
| POST | /api/run/start | Iniciar nuevo intento |
| POST | /api/run/:id/complete-horde | Marcar horda completada |
| POST | /api/run/:id/death | Registrar muerte |
| PATCH | /api/run/:id/level | Avanzar de nivel |
| POST | /api/stats | Guardar estadísticas del encuentro |
| GET | /api/admin/leaderboard | Tabla global de líderes |
| GET | /api/admin/death-distribution | Distribución de muertes |
| GET | /api/admin/horde-difficulty | Dificultad de hordas |
| GET | /api/admin/most-upgraded-cards | Cartas más mejoradas |
| GET | /api/admin/death-rates | Tasas de muerte por nivel |

### Modo Invitado

El juego funciona completamente sin servidor activo. Si la carga de datos del servidor falla, se usan los valores predeterminados del `cardPool` local (8 cartas de respaldo) y las mejoras se guardan solo en memoria de la sesión.

### Estadísticas Globales (Panel Admin)

Disponibles solo para usuarios con `is_admin = true`:
- Leaderboard global con ranking por niveles completados.
- Distribución de muertes por nivel y horda.
- Tasas de completación de hordas (%).
- Popularidad de mejoras de cartas (gráfica de rosca).
- Gráficas implementadas con Chart.js.

---

# 9. Programa de Desarrollo

## Fases de Desarrollo Completadas

### 1. Sistemas Base
- Motor de canvas 2D con sistema de casillas.
- Sistema de coordenadas `tileToPosition` / `positionToTile`.
- Clase base `GameObject → BoardObject → Unit`.
- Sistema de colisión por casilla.

### 2. Mecánicas de Gameplay
- Sistema de fases (Player/Enemy).
- Sistema de AP con recuperación por turno.
- Sistema de Desesperación (nueva mecánica).
- Detección de derrota por presión en zona segura.

### 3. Sistema de Cartas
- Pool de 15 cartas con efectos únicos.
- Lógica de "keep mode" entre hordas.
- Sistema de mejoras con `upgradeRegistry` persistente.
- Límites de colocación por nivel de mejora.

### 4. Sistema de Enemigos
- Spawn dinámico por bordes múltiples.
- Movimiento hacia el Rey con pathfinding simple.
- Priorización del Decoy como objetivo.
- Sistema de stun (Exile), slow (Peace Treaty) y curse (Royal Curse).

### 5. Sistema de Jefes
- Jefes 2×2 con ciclo timer-based de invocación y movimiento.
- 3 jefes con invocados propios: Skeleton King, Ogre Boss, Brave King.

### 6. Sistemas de UI
- HUD con información en tiempo real.
- Panel de Desesperación animado con imágenes reactivas.
- Overlay de mejoras con preview de stats.
- Menú de pausa con guardado manual.
- Pantalla de victoria final.

### 7. Sistema Roguelite
- Progresión a través de 3 niveles × 4 encuentros.
- Reset al Nivel 1 Horda 1 en derrota.
- Mejoras permanentes entre intentos.

### 8. Backend y Base de Datos
- Servidor Express.js con MySQL.
- Sistema de autenticación con hash.
- API de estadísticas (personal y global).
- Panel de administrador con gráficas Chart.js.

### 9. Visual y Audio
- Sprites animados por tipo de unidad.
- 3 backgrounds de nivel.
- 3 tracks de música por nivel.
- 15 efectos de sonido por carta.
- Efectos de sonido para eventos globales (victoria, derrota, Desesperación).

### 10. Menú Principal
- Menú animado con decoración de castillo CSS.
- Tutorial completo con video integrado.
- Estadísticas personales con gráficas.
- Sistema de login/registro.
- Panel de administrador.
- Configuración de volumen persistente.

---

*Documento preparado por Silent Crown — The Coward King — Versión Final Actualizada*
