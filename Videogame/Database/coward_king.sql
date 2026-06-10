DROP DATABASE IF EXISTS coward_king;
CREATE DATABASE coward_king;
USE coward_king;

-- TABLES
CREATE TABLE Card (
    card_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(50) NOT NULL,
    type           ENUM('attack', 'defense', 'political') NOT NULL,
    base_ap_cost   INT NOT NULL,
    base_hp        INT DEFAULT 0,
    base_damage    INT DEFAULT 0,
    range_attack   INT DEFAULT 1,
    duration       INT DEFAULT 0,
    effect_description TEXT
) ENGINE=InnoDB;

INSERT INTO Card (name, type, base_ap_cost, base_hp, base_damage, range_attack, duration, effect_description) VALUES
('Knight',       'attack',    2, 80,  30,  1, 0, 'Melee. attacks when adjacent.'),
('Archer',       'attack',    3, 50,  20,  3, 0, 'Ranged 3 tiles. Stationary. Auto-attacks nearest in range.'),
('Mage',         'attack',    4, 40,  25,  2, 0, 'AoE cross pattern, range 2. Fragile but powerful.'),
('Pikeman',      'attack',    2, 60,  15,  1, 0, 'Quick atacker'),
('Wall',         'defense',   3, 150, 0,   0, 0, 'Blocks tile. Enemies must destroy or go around.'),
('Squire',       'defense',   2, 70,  10,  1, 0, 'Reduces 50% damage to adjacent allies.'),
('Tower',        'defense',   4, 100, 35,  4, 0, 'Ranged 4 tiles. Stationary. Auto-attacks in range.'),
('Guardian',     'defense',   3, 120, 25,  1, 0, 'Tanky mobile unit. Absorbs high damage.'),
('Royal Guard',  'defense',   2, 90,  0,   1, 0, 'Follows King automatically. Absorbs first hit to the King.'),
('Trench',       'defense',   1, 40,  0,   0, 0, 'A humble barricade. Cheap to build, costly to ignore.'),
('Exile',        'political', 2, 0,   0,   0, 2, 'Trap: enemy stepping on tile is paralyzed for 2 turns.'),
('Bomb',         'political', 4, 0,   100, 0, 0, '3x3 AoE explosion: deals 100 damage to all enemies in the area on placement.'),
('Peace Treaty', 'political', 3, 0,   0,   0, 4, '3x3 freeze zone: enemies inside cannot move or attack for 4 turns.'),
('Royal Curse',  'political', 4, 0,   0,   0, 5, '3x3 debuff zone: enemies deal 50% less damage.'),
('Decoy',        'political', 1, 30,  0,   0, 0, 'Enemies prioritize attacking this over the King.');

CREATE TABLE Level (
    level_id     INT AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL,
    name         VARCHAR(50) NOT NULL,
    theme        VARCHAR(50) NOT NULL,
    total_hordes INT DEFAULT 3,
    boss_name    VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO Level (level_number, name, theme, total_hordes, boss_name) VALUES
(1, 'Skeleton King', 'Catacombs', 3, 'Skeleton King'),
(2, 'Ogre',          'Dungeon',   3, 'Ogre Boss'),
(3, 'Brave King',    'Castle',    3, 'Brave King');

CREATE TABLE Enemy (
    enemy_id INT AUTO_INCREMENT PRIMARY KEY,
    level_id INT NOT NULL,
    name     VARCHAR(50) NOT NULL,
    type     ENUM('normal', 'boss') NOT NULL,
    hp       INT NOT NULL,
    damage   INT NOT NULL,
    speed    INT NOT NULL,
    is_boss  BOOL DEFAULT FALSE,
    FOREIGN KEY (level_id) REFERENCES Level(level_id)
) ENGINE=InnoDB;

INSERT INTO Enemy (level_id, name, type, hp, damage, speed, is_boss) VALUES
(1, 'Skeleton',      'normal', 50,  15,  1, FALSE),
(2, 'Ogre',          'normal', 80,  25,  1, FALSE),
(3, 'Elite Warrior', 'normal', 100, 35,  2, FALSE),
(1, 'Skeleton King', 'boss',   200, 300, 1, TRUE),
(2, 'Ogre Boss',     'boss',   350, 400, 1, TRUE),
(3, 'Brave King',    'boss',   500, 500, 1, TRUE);

CREATE TABLE Player (
    player_id     INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(64),
    is_admin      BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE Stats (
    stat_id              INT AUTO_INCREMENT PRIMARY KEY,
    player_id            INT NOT NULL,
    total_runs           INT DEFAULT 0,
    total_enemies_killed INT DEFAULT 0,
    total_upgrades       INT DEFAULT 0,
    total_gold_earned    INT DEFAULT 0,
    levels_completed     INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Player(player_id)
) ENGINE=InnoDB;

CREATE TABLE Horde (
    horde_id          INT AUTO_INCREMENT PRIMARY KEY,
    level_id          INT NOT NULL,
    horde_number      INT NOT NULL,
    max_turns         INT DEFAULT 30,
    enemies_per_spawn INT DEFAULT 3,
    FOREIGN KEY (level_id) REFERENCES Level(level_id)
) ENGINE=InnoDB;

INSERT INTO Horde (level_id, horde_number) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2), (3, 3);

CREATE TABLE Run (
    run_id            INT AUTO_INCREMENT PRIMARY KEY,
    player_id         INT NOT NULL,
    current_level_id  INT,
    total_gold_earned INT DEFAULT 0,
    current_horde     INT DEFAULT 1,
    started_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at          TIMESTAMP NULL,
    result            ENUM('victory', 'defeat', 'in_progress') DEFAULT 'in_progress',
    is_active         BOOL DEFAULT TRUE,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (current_level_id) REFERENCES Level(level_id)
) ENGINE=InnoDB;

CREATE TABLE Card_Upgrade (
    upgrade_id    INT AUTO_INCREMENT PRIMARY KEY,
    player_id     INT NOT NULL,
    card_id       INT NOT NULL,
    level         INT DEFAULT 1,
    ap_cost_bonus INT DEFAULT 0,
    hp_bonus      INT DEFAULT 0,
    damage_bonus  INT DEFAULT 0,
    gold_spent    INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES Player(player_id),
    FOREIGN KEY (card_id)   REFERENCES Card(card_id)
) ENGINE=InnoDB;

CREATE TABLE Run_Hand (
    hand_id     INT AUTO_INCREMENT PRIMARY KEY,
    run_id      INT NOT NULL,
    horde_id    INT NOT NULL,
    card_id     INT NOT NULL,
    is_retained BOOL DEFAULT FALSE,
    FOREIGN KEY (run_id)   REFERENCES Run(run_id),
    FOREIGN KEY (horde_id) REFERENCES Horde(horde_id),
    FOREIGN KEY (card_id)  REFERENCES Card(card_id)
) ENGINE=InnoDB;

CREATE TABLE Run_Horde (
    run_horde_id   INT AUTO_INCREMENT PRIMARY KEY,
    run_id         INT NOT NULL,
    horde_id       INT NOT NULL,
    turns_survived INT DEFAULT 0,
    enemies_killed INT DEFAULT 0,
    completed      BOOL DEFAULT FALSE,
    FOREIGN KEY (run_id)   REFERENCES Run(run_id),
    FOREIGN KEY (horde_id) REFERENCES Horde(horde_id)
) ENGINE=InnoDB;


-- VIEWS

-- View for player dashboard 
CREATE OR REPLACE VIEW v_player_overview AS
SELECT 
    p.player_id,
    p.username,
    p.created_at,
    COALESCE(s.total_runs, 0)           AS total_runs,
    COALESCE(s.total_enemies_killed, 0) AS total_enemies_killed,
    COALESCE(s.total_upgrades, 0)       AS total_upgrades,
    COALESCE(s.total_gold_earned, 0)    AS total_gold_earned,
    COALESCE(s.levels_completed, 0)     AS levels_completed
FROM Player p
LEFT JOIN Stats s ON p.player_id = s.player_id;

-- View for player run history
CREATE OR REPLACE VIEW v_player_run_history AS
SELECT
    r.run_id,
    r.player_id,
    p.username,
    l.level_number,
    l.name AS level_name,
    r.current_horde,
    r.result,
    r.total_gold_earned,
    r.started_at,
    r.ended_at,
    TIMESTAMPDIFF(MINUTE, r.started_at, r.ended_at) AS duration_minutes,
    COALESCE(SUM(rh.enemies_killed), 0) AS enemies_killed
FROM Run r
JOIN Player p ON r.player_id = p.player_id
LEFT JOIN Level l ON r.current_level_id = l.level_id
LEFT JOIN Run_Horde rh ON r.run_id = rh.run_id
GROUP BY
    r.run_id, r.player_id, p.username,
    l.level_number, l.name,
    r.current_horde, r.result, r.total_gold_earned,
    r.started_at, r.ended_at
ORDER BY r.started_at DESC;

-- View for player card upgrades (one row per player+card, highest level wins)
CREATE OR REPLACE VIEW v_player_upgrades AS
SELECT
    cu.player_id,
    p.username,
    cu.card_id,
    c.name        AS card_name,
    c.type        AS card_type,
    MAX(cu.level) AS upgrade_level,
    MAX(cu.ap_cost_bonus) AS ap_cost_bonus,
    MAX(cu.hp_bonus)      AS hp_bonus,
    MAX(cu.damage_bonus)  AS damage_bonus,
    SUM(cu.gold_spent)    AS gold_spent
FROM Card_Upgrade cu
JOIN Player p ON cu.player_id = p.player_id
JOIN Card c   ON cu.card_id   = c.card_id
GROUP BY cu.player_id, p.username, cu.card_id, c.name, c.type;

-- View for player best run 
CREATE OR REPLACE VIEW v_player_best_run AS
SELECT 
    r.player_id,
    p.username,
    MAX(l.level_number)      AS deepest_level_reached,
    SUM(rh.enemies_killed)   AS total_kills_across_runs,
    SUM(rh.turns_survived)   AS total_turns_survived,
    MAX(r.total_gold_earned) AS highest_gold_in_single_run
FROM Run r
JOIN Player p          ON r.player_id = p.player_id
LEFT JOIN Level l      ON r.current_level_id = l.level_id
LEFT JOIN Run_Horde rh ON r.run_id = rh.run_id
GROUP BY r.player_id, p.username;

-- View for death distribution (admin: difficulty chart)
CREATE OR REPLACE VIEW v_death_distribution AS
SELECT 
    l.level_number,
    l.name AS level_name,
    r.current_horde,
    COUNT(*) AS total_deaths
FROM Run r
JOIN Level l ON r.current_level_id = l.level_id
WHERE r.result = 'defeat'
GROUP BY l.level_number, l.name, r.current_horde
ORDER BY l.level_number, r.current_horde;

-- View for most upgraded cards (admin: meta tracking & balance)
CREATE OR REPLACE VIEW v_most_upgraded_cards AS
SELECT 
    c.card_id,
    c.name AS card_name,
    c.type AS card_type,
    COUNT(cu.upgrade_id)                 AS total_upgrade_purchases,
    COALESCE(SUM(cu.gold_spent), 0)      AS total_gold_spent,
    COALESCE(ROUND(AVG(cu.level), 2), 0) AS avg_upgrade_level,
    COALESCE(MAX(cu.level), 0)           AS max_upgrade_level
FROM Card c
LEFT JOIN Card_Upgrade cu ON c.card_id = cu.card_id
GROUP BY c.card_id, c.name, c.type
ORDER BY total_upgrade_purchases DESC;

-- View for card usage frequency (admin: hand distribution & retention insights)
CREATE OR REPLACE VIEW v_card_usage_frequency AS
SELECT 
    c.card_id,
    c.name AS card_name,
    c.type AS card_type,
    COUNT(rh.hand_id)   AS times_dealt,
    SUM(rh.is_retained) AS times_retained,
    ROUND(COALESCE(SUM(rh.is_retained) / NULLIF(COUNT(rh.hand_id), 0) * 100, 0), 2) AS retention_rate_percent
FROM Card c
LEFT JOIN Run_Hand rh ON c.card_id = rh.card_id
GROUP BY c.card_id, c.name, c.type
ORDER BY times_dealt DESC;

-- View for horde difficulty (admin: completion rate per horde for balancing)
CREATE OR REPLACE VIEW v_horde_difficulty AS
SELECT 
    l.level_number,
    l.name AS level_name,
    h.horde_number,
    COUNT(rh.run_horde_id) AS total_attempts,
    SUM(rh.completed)      AS total_completions,
    ROUND(COALESCE(SUM(rh.completed) / NULLIF(COUNT(rh.run_horde_id), 0) * 100, 0), 2) AS completion_rate_percent,
    ROUND(AVG(rh.turns_survived), 1) AS avg_turns_survived,
    ROUND(AVG(rh.enemies_killed), 1) AS avg_enemies_killed
FROM Horde h
JOIN Level l           ON h.level_id = l.level_id
LEFT JOIN Run_Horde rh ON h.horde_id = rh.horde_id
GROUP BY l.level_number, l.name, h.horde_number
ORDER BY l.level_number, h.horde_number;

-- View for global leaderboard (admin + player: top players ranking)
CREATE OR REPLACE VIEW v_global_leaderboard AS
SELECT 
    p.player_id,
    p.username,
    s.levels_completed,
    s.total_enemies_killed,
    s.total_runs,
    s.total_gold_earned,
    s.total_upgrades,
    RANK() OVER (ORDER BY s.levels_completed DESC, s.total_enemies_killed DESC) AS leaderboard_rank
FROM Player p
JOIN Stats s ON p.player_id = s.player_id
ORDER BY leaderboard_rank;

-- View for average run duration (admin: session length analysis)
CREATE OR REPLACE VIEW v_average_run_duration AS
SELECT 
    result,
    COUNT(*) AS total_runs,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, started_at, ended_at)), 2) AS avg_duration_minutes,
    MIN(TIMESTAMPDIFF(MINUTE, started_at, ended_at)) AS min_duration_minutes,
    MAX(TIMESTAMPDIFF(MINUTE, started_at, ended_at)) AS max_duration_minutes
FROM Run
WHERE ended_at IS NOT NULL
GROUP BY result;


-- TRIGGERS

DELIMITER $$

-- Trigger: auto create stats row when a player is registered (feeds v_player_overview)
CREATE TRIGGER trg_after_player_insert
AFTER INSERT ON Player
FOR EACH ROW
BEGIN
    INSERT INTO Stats (player_id) VALUES (NEW.player_id);
END$$

-- Trigger: increment total_runs when a new run starts (feeds v_player_overview & v_global_leaderboard)
CREATE TRIGGER trg_after_run_insert
AFTER INSERT ON Run
FOR EACH ROW
BEGIN
    UPDATE Stats
    SET total_runs = total_runs + 1
    WHERE player_id = NEW.player_id;
END$$

-- Trigger: when a horde is completed, add kills and gold (feeds v_horde_difficulty & v_player_best_run)
CREATE TRIGGER trg_after_run_horde_completed
AFTER UPDATE ON Run_Horde
FOR EACH ROW
BEGIN
    DECLARE v_player_id INT;
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        SELECT player_id INTO v_player_id FROM Run WHERE run_id = NEW.run_id;
        UPDATE Stats
        SET total_enemies_killed = total_enemies_killed + NEW.enemies_killed,
            total_gold_earned    = total_gold_earned + 10
        WHERE player_id = v_player_id;
        UPDATE Run
        SET total_gold_earned = total_gold_earned + 10
        WHERE run_id = NEW.run_id;
    END IF;
END$$

-- Trigger: when a Run advances a level or wins, increment levels_completed (feeds v_global_leaderboard)
CREATE TRIGGER trg_after_run_level_advance
AFTER UPDATE ON Run
FOR EACH ROW
BEGIN
    IF NEW.current_level_id IS NOT NULL 
       AND OLD.current_level_id IS NOT NULL
       AND NEW.current_level_id > OLD.current_level_id THEN
        UPDATE Stats
        SET levels_completed = levels_completed + 1
        WHERE player_id = NEW.player_id;
    END IF;
    IF NEW.result = 'victory' AND OLD.result <> 'victory' THEN
        UPDATE Stats
        SET levels_completed = levels_completed + 1
        WHERE player_id = NEW.player_id;
    END IF;
END$$

-- Trigger: validate upgrade level cap before insert (max tier = 3)
CREATE TRIGGER trg_before_card_upgrade_insert
BEFORE INSERT ON Card_Upgrade
FOR EACH ROW
BEGIN
    IF NEW.level > 3 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Card upgrade level cannot exceed 3';
    END IF;
END$$

-- Trigger: increment total_upgrades when a card is upgraded (feeds v_most_upgraded_cards)
CREATE TRIGGER trg_after_card_upgrade_insert
AFTER INSERT ON Card_Upgrade
FOR EACH ROW
BEGIN
    UPDATE Stats
    SET total_upgrades = total_upgrades + 1
    WHERE player_id = NEW.player_id;
END$$

DELIMITER ;


-- STORED PROCEDURES

DELIMITER $$

-- Procedure: register a new player (Stats row auto-created via trigger)
CREATE PROCEDURE sp_register_player(
    IN p_username      VARCHAR(50),
    IN p_password_hash VARCHAR(64),
    IN p_is_admin      BOOLEAN
)
BEGIN
    INSERT INTO Player (username, password_hash, is_admin) VALUES (p_username, p_password_hash, p_is_admin);
    SELECT LAST_INSERT_ID() AS new_player_id;
END$$

-- Procedure: start a new run for a player (triggers stats update)
CREATE PROCEDURE sp_start_run(
    IN p_player_id INT
)
BEGIN
    INSERT INTO Run (player_id, current_level_id, current_horde, result, is_active)
    VALUES (p_player_id, 1, 1, 'in_progress', TRUE);
    SELECT LAST_INSERT_ID() AS new_run_id;
END$$

-- Procedure: complete a horde (triggers kill + gold updates via trigger)
CREATE PROCEDURE sp_complete_horde(
    IN p_run_id   INT,
    IN p_horde_id INT,
    IN p_turns    INT,
    IN p_kills    INT
)
BEGIN
    DECLARE v_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_exists 
    FROM Run_Horde 
    WHERE run_id = p_run_id AND horde_id = p_horde_id;
    
    IF v_exists = 0 THEN
        INSERT INTO Run_Horde (run_id, horde_id, turns_survived, enemies_killed, completed)
        VALUES (p_run_id, p_horde_id, p_turns, p_kills, FALSE);
    END IF;
    
    UPDATE Run_Horde
    SET completed      = TRUE,
        turns_survived = p_turns,
        enemies_killed = p_kills
    WHERE run_id = p_run_id AND horde_id = p_horde_id;
END$$

-- Procedure: record player death (feeds v_death_distribution + v_horde_difficulty)
CREATE PROCEDURE sp_record_death(
    IN p_run_id INT
)
BEGIN
    DECLARE v_level_id  INT;
    DECLARE v_horde_num INT;
    DECLARE v_horde_id  INT;
    DECLARE v_exists    INT DEFAULT 0;

    SELECT current_level_id, current_horde
    INTO v_level_id, v_horde_num
    FROM Run WHERE run_id = p_run_id;

    SELECT horde_id INTO v_horde_id
    FROM Horde WHERE level_id = v_level_id AND horde_number = v_horde_num
    LIMIT 1;

    IF v_horde_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_exists
        FROM Run_Horde WHERE run_id = p_run_id AND horde_id = v_horde_id;

        IF v_exists = 0 THEN
            INSERT INTO Run_Horde (run_id, horde_id, turns_survived, enemies_killed, completed)
            VALUES (p_run_id, v_horde_id, 0, 0, FALSE);
        END IF;
    END IF;

    UPDATE Run
    SET result    = 'defeat',
        is_active = FALSE,
        ended_at  = CURRENT_TIMESTAMP
    WHERE run_id = p_run_id;
END$$

-- Procedure: purchase a card upgrade (triggers stats update, validates tier cap)
CREATE PROCEDURE sp_upgrade_card(
    IN p_player_id INT,
    IN p_card_id   INT,
    IN p_gold_cost INT
)
BEGIN
    DECLARE v_current_level INT DEFAULT 0;
    
    SELECT COALESCE(MAX(level), 0) INTO v_current_level
    FROM Card_Upgrade
    WHERE player_id = p_player_id AND card_id = p_card_id;
    
    INSERT INTO Card_Upgrade (player_id, card_id, level, ap_cost_bonus, hp_bonus, damage_bonus, gold_spent)
    VALUES (
        p_player_id, 
        p_card_id, 
        v_current_level + 1,
        CASE WHEN v_current_level + 1 >= 2 THEN -1 ELSE 0 END,
        (v_current_level + 1) * 20,
        (v_current_level + 1) * 5,
        p_gold_cost
    );
END$$

-- Procedure: get full player dashboard (returns 4 result sets for stats screen)
CREATE PROCEDURE sp_get_player_dashboard(
    IN p_player_id INT
)
BEGIN
    SELECT * FROM v_player_overview    WHERE player_id = p_player_id;
    SELECT * FROM v_player_best_run    WHERE player_id = p_player_id;
    SELECT * FROM v_player_upgrades    WHERE player_id = p_player_id;
    SELECT * FROM v_player_run_history WHERE player_id = p_player_id LIMIT 10;
END$$

DELIMITER ;