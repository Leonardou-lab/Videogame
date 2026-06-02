CREATE DATABASE coward_king;
USE coward_king;

CREATE TABLE Card (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type ENUM('attack', 'defense', 'political') NOT NULL,
    base_ap_cost INT NOT NULL,
    base_hp INT DEFAULT 0,
    base_damage INT DEFAULT 0,
    range_attack INT DEFAULT 1,
    duration INT DEFAULT 0,
    effect_description TEXT
);

INSERT INTO Card (name, type, base_ap_cost, base_hp, base_damage, range_attack, duration, effect_description) VALUES
('Knight',       'attack',   3, 80,  30, 1, 0, 'Melee. attacks when adjacent.'),
('Archer',       'attack',   2, 50,  20, 3, 0, 'Ranged 3 tiles. Stationary. Auto-attacks nearest in range.'),
('Mage',         'attack',   4, 40,  25, 2, 0, 'AoE cross pattern, range 2. Fragile but powerful.'),
('Pikeman',      'attack',   2, 60,  15, 1, 0, 'Quick atacker'),
('Wall',         'defense',  3, 150, 0,  0, 0, 'Blocks tile. Enemies must destroy or go around.'),
('Squire',       'defense',  2, 70,  10, 1, 0, 'Reduces 50% damage to adjacent allies.'),
('Tower',        'defense',  4, 100, 35, 4, 0, 'Ranged 4 tiles. Stationary. Auto-attacks in range.'),
('Guardian',     'defense',  3, 120, 25, 1, 0, 'Tanky mobile unit. Absorbs high damage.'),
('Royal Guard',  'defense',  2, 90,  0,  1, 0, 'Follows King automatically. Absorbs first hit to the King.'),
('Trench',       'defense',  1, 40,  0,  0, 0, 'Enemies next to this card move 1 tile every 2 turns.'),
('Exile',        'political',2, 0,   0,  0, 2, 'Trap: enemy stepping on tile is paralyzed for 2 turns.'),
('Royal Decree', 'political',3, 0,   0,  0, 3, '3x3 push zone: enemies pushed 1 tile back each turn.'),
('Peace Treaty', 'political',2, 0,   0,  0, 4, '3x3 slow zone: enemies move at 50% speed.'),
('Royal Curse',  'political',4, 0,   0,  0, 5, '3x3 debuff zone: enemies deal 50% less damage.'),
('Decoy',        'political',1, 30,  0,  0, 0, 'Enemies prioritize attacking this over the King.');


CREATE TABLE Level (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    theme VARCHAR(50) NOT NULL,
    total_hordes INT DEFAULT 3,
    boss_name VARCHAR(50) NOT NULL
);

INSERT INTO Level (level_number, name, theme, total_hordes, boss_name) VALUES
(1, 'Skeleton King', 'Catacombs', 3, 'Skeleton King'),
(2, 'Ogre',          'Dungeon',   3, 'Ogre Boss'),
(3, 'Brave King',    'Castle',    3, 'Brave King');


CREATE TABLE Enemy (
    enemy_id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    type ENUM('normal', 'boss') NOT NULL,
    hp INT NOT NULL,
    damage INT NOT NULL,
    speed INT NOT NULL,
    is_boss BOOL DEFAULT FALSE,
    FOREIGN KEY (level_id) REFERENCES Level(level_id)
);

INSERT INTO Enemy (level_id, name, type, hp, damage, speed, is_boss) VALUES
(1, 'Skeleton',      'normal', 50,  15, 1, FALSE),
(2, 'Ogre',          'normal', 80,  25, 1, FALSE),
(3, 'Elite Warrior', 'normal', 100, 35, 2, FALSE),
(1, 'Skeleton King', 'boss',   200, 300, 1, TRUE),
(2, 'Ogre Boss',     'boss',   350, 400, 1, TRUE),
(3, 'Brave King',    'boss',   500, 500, 1, TRUE);

-- Player table
CREATE TABLE Player (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Stats (
    stat_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    total_runs INT DEFAULT 0,
    total_enemies_killed INT DEFAULT 0,
    total_upgrades INT DEFAULT 0,
    total_gold_earned INT DEFAULT 0,
    levels_completed INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Player(player_id)
);

-- Tabla de hordes por nivel
CREATE TABLE Horde (
    horde_id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    horde_number INT NOT NULL,
    max_turns INT DEFAULT 30,
    enemies_per_spawn INT DEFAULT 3,
    FOREIGN KEY (level_id) REFERENCES Level(level_id)
);

INSERT INTO Horde (level_id, horde_number) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2), (3, 3);

-- Tabla de runs (partidas)
CREATE TABLE Run (
    run_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    current_level_id INT,
    total_gold_earned INT DEFAULT 0,
    current_horde INT DEFAULT 1,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    result ENUM('victory', 'defeat', 'in_progress') DEFAULT 'in_progress',
    is_active BOOL DEFAULT TRUE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (current_level_id) REFERENCES Level(level_id)
);

-- upgrades per player
CREATE TABLE Card_Upgrade (
    upgrade_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    card_id INT NOT NULL,
    level INT DEFAULT 1,
    ap_cost_bonus INT DEFAULT 0,
    hp_bonus INT DEFAULT 0,
    damage_bonus INT DEFAULT 0,
    gold_spent INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id)
);

-- Table of hand by run and horde
CREATE TABLE Run_Hand (
    hand_id INT AUTO_INCREMENT PRIMARY KEY,
    run_id INT NOT NULL,
    horde_id INT NOT NULL,
    card_id INT NOT NULL,
    is_retained BOOL DEFAULT FALSE,
    FOREIGN KEY (run_id) REFERENCES Run(run_id),
    FOREIGN KEY (horde_id) REFERENCES Horde(horde_id),
    FOREIGN KEY (card_id) REFERENCES Card(card_id)
);

-- progress per horde
CREATE TABLE Run_Horde (
    run_horde_id INT AUTO_INCREMENT PRIMARY KEY,
    run_id INT NOT NULL,
    horde_id INT NOT NULL,
    turns_survived INT DEFAULT 0,
    enemies_killed INT DEFAULT 0,
    completed BOOL DEFAULT FALSE,
    FOREIGN KEY (run_id) REFERENCES Run(run_id),
    FOREIGN KEY (horde_id) REFERENCES Horde(horde_id)
);

USE coward_king;

UPDATE Card SET effect_description = 'Melee. attacks when adjacent.' WHERE name = 'Knight';
UPDATE Card SET effect_description = 'Quick atacker' WHERE name = 'Pikeman';
UPDATE Card SET effect_description = 'Reduces 50% damage to adjacent allies.' WHERE name = 'Squire';
UPDATE Card SET effect_description = 'Tanky mobile unit. Absorbs high damage.' WHERE name = 'Guardian';
UPDATE Card SET effect_description = '3x3 debuff zone: enemies deal 50% less damage.' WHERE name = 'Royal Curse';


UPDATE Card SET effect_description = 'Melee. attacks when adjacent.' WHERE name = 'Knight';
UPDATE Card SET effect_description = 'Quick atacker' WHERE name = 'Pikeman';
UPDATE Card SET effect_description = 'Reduces 50% damage to adjacent allies.' WHERE name = 'Squire';
UPDATE Card SET effect_description = 'Tanky mobile unit. Absorbs high damage.' WHERE name = 'Guardian';
UPDATE Card SET effect_description = '3x3 debuff zone: enemies deal 50% less damage.' WHERE name = 'Royal Curse';


SET SQL_SAFE_UPDATES = 0;
UPDATE Card SET base_ap_cost = 3 WHERE name = 'Archer';
UPDATE Card SET base_ap_cost = 2 WHERE name = 'Knight';
SET SQL_SAFE_UPDATES = 1;

SET SQL_SAFE_UPDATES = 0;
UPDATE Card 
SET name = 'Bomb',
    type = 'political',
    base_ap_cost = 4,
    base_hp = 0,
    base_damage = 40,
    range_attack = 0,
    duration = 0,
    effect_description = '3x3 AoE explosion: deals 40 damage to all enemies in the area on placement.'
WHERE name = 'Royal Decree';
SET SQL_SAFE_UPDATES = 1;

SET SQL_SAFE_UPDATES = 0;
UPDATE Card SET base_damage = 100 WHERE name = 'Bomb';
SET SQL_SAFE_UPDATES = 1;

Use coward_king;
SELECT p.username, s.total_runs, s.total_enemies_killed, s.total_upgrades, s.total_gold_earned, s.levels_completed
FROM Stats s
JOIN Player p ON s.player_id = p.player_id;

USE coward_king;
SET SQL_SAFE_UPDATES = 0;
UPDATE Card 
SET effect_description = '3x3 freeze zone: enemies inside cannot move or attack for 4 turns.'
WHERE name = 'Peace Treaty';
SET SQL_SAFE_UPDATES = 1;

USE coward_king;
SET SQL_SAFE_UPDATES = 0;
UPDATE Card 
SET base_ap_cost = 3
WHERE name = 'Peace Treaty';
SET SQL_SAFE_UPDATES = 1;

USE coward_king;
SET SQL_SAFE_UPDATES = 0;
UPDATE Card 
SET effect_description = 'A humble barricade. Cheap to build, costly to ignore.'
WHERE name = 'Trench';
SET SQL_SAFE_UPDATES = 1;