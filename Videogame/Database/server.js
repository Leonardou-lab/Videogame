import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import crypto from 'crypto'

const app = express()
app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
    host:     '127.0.0.1',
    user:     'root',
    password: 'Leolol10',
    database: 'coward_king',
}).promise()

const CARD_META = {
    'Knight':       { color: '#4677c8', game_type: 'ally'  },
    'Archer':       { color: '#4b9d69', game_type: 'ally'  },
    'Mage':         { color: '#c05b4c', game_type: 'ally'  },
    'Pikeman':      { color: '#e67e22', game_type: 'ally'  },
    'Wall':         { color: '#7c7d82', game_type: 'ally'  },
    'Squire':       { color: '#27ae60', game_type: 'ally'  },
    'Tower':        { color: '#8e44ad', game_type: 'ally'  },
    'Guardian':     { color: '#2980b9', game_type: 'ally'  },
    'Royal Guard':  { color: '#f39c12', game_type: 'ally'  },
    'Trench':       { color: '#795548', game_type: 'ally'  },
    'Exile':        { color: '#9b59b6', game_type: 'trap', duration: 2 },
    'Bomb':         { color: '#e74c3c', game_type: 'zone'  },
    'Peace Treaty': { color: '#55b7b3', game_type: 'zone', duration: 4 },
    'Royal Curse':  { color: '#c0392b', game_type: 'zone', duration: 5 },
    'Decoy':        { color: '#e74c3c', game_type: 'ally'  },
}

//  HELPERS

function hashPassword(p) {
    return crypto.createHash('sha256').update(p).digest('hex')
}

//  GAME DATA

// GET /api/cards
app.get('/api/cards', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Card')
        const cards = rows.map(c => {
            const meta = CARD_META[c.name] ?? { range: 1, color: '#888', game_type: 'ally' }
            return {
                card_id:  c.card_id,
                name:     c.name,
                type:     meta.game_type,
                cost:     c.base_ap_cost,
                hp:       c.base_hp,
                damage:   c.base_damage,
                range:    c.range_attack,
                color:    meta.color,
                text:     c.effect_description,
                duration: meta.duration ?? undefined,
            }
        })
        res.json(cards)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/enemies/:levelId
app.get('/api/enemies/:levelId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM Enemy WHERE level_id = ?',
            [req.params.levelId]
        )
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/levels
app.get('/api/levels', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Level')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//  PLAYER 

// POST /api/player — registra jugador (Stats se crea automáticamente por trigger)
app.post('/api/player', async (req, res) => {
    const { username, password, is_admin } = req.body
    if (!username || !password) return res.status(400).json({ error: 'username and password required' })
    try {
        const [rows] = await pool.query(
            'CALL sp_register_player(?, ?, ?)',
            [username, hashPassword(password), is_admin ? 1 : 0]
        )
        const player_id = rows[0][0].new_player_id
        res.status(201).json({ player_id, username, is_admin: is_admin ? true : false })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'username already taken' })
        res.status(500).json({ error: err.message })
    }
})

// GET /api/player/:username — login / buscar jugador por nombre
app.get('/api/player/:username', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT player_id, username, password_hash, is_admin, created_at FROM Player WHERE username = ?',
            [req.params.username]
        )
        if (!rows.length) return res.status(404).json({ error: 'player not found' })
        const player = rows[0]
        if (req.query.password !== undefined) {
            if (player.password_hash !== hashPassword(req.query.password))
                return res.status(401).json({ error: 'wrong password' })
        }
        res.json({ player_id: player.player_id, username: player.username, is_admin: player.is_admin === 1 || player.is_admin === true, created_at: player.created_at })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/player/:id/stats — overview del jugador (v_player_overview)
app.get('/api/player/:id/stats', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_player_overview WHERE player_id = ?',
            [req.params.id]
        )
        if (!rows.length) return res.status(404).json({ error: 'player not found' })
        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/player/:id/upgrades — cartas mejoradas del jugador (v_player_upgrades)
app.get('/api/player/:id/upgrades', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_player_upgrades WHERE player_id = ?',
            [req.params.id]
        )
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/player/:id/history — historial de runs (v_player_run_history)
app.get('/api/player/:id/history', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM v_player_run_history WHERE player_id = ?',
            [req.params.id]
        )
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/player/:id/dashboard — 4 result sets: overview, best_run, upgrades, últimos 10 runs
app.get('/api/player/:id/dashboard', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'CALL sp_get_player_dashboard(?)',
            [req.params.id]
        )
        res.json({
            overview:    rows[0][0] ?? null,
            best_run:    rows[1][0] ?? null,
            upgrades:    rows[2],
            run_history: rows[3],
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//  RUN 

// POST /api/run/start — inicia nuevo run (sp_start_run, level_id=1 por default)
app.post('/api/run/start', async (req, res) => {
    const { player_id } = req.body
    if (!player_id) return res.status(400).json({ error: 'player_id required' })
    try {
        const [rows] = await pool.query('CALL sp_start_run(?)', [player_id])
        const run_id = rows[0][0].new_run_id
        res.status(201).json({ run_id, player_id, result: 'in_progress' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/run — alias de /api/run/start (backward compatibility)
app.post('/api/run', async (req, res) => {
    const { player_id } = req.body
    if (!player_id) return res.status(400).json({ error: 'player_id required' })
    try {
        const [rows] = await pool.query('CALL sp_start_run(?)', [player_id])
        const run_id = rows[0][0].new_run_id
        res.status(201).json({ run_id, player_id, result: 'in_progress' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/run/:id/complete-horde — completa una horde (kills y gold los suman los triggers)
app.post('/api/run/:id/complete-horde', async (req, res) => {
    const { horde_id, turns, kills } = req.body
    if (!horde_id) return res.status(400).json({ error: 'horde_id required' })
    try {
        await pool.query(
            'CALL sp_complete_horde(?, ?, ?, ?)',
            [req.params.id, horde_id, turns ?? 0, kills ?? 0]
        )
        // Avanza current_horde al número de la siguiente horde para que recordDeath
        // sepa exactamente en cuál murió el jugador si muere en la siguiente.
        await pool.query(
            'UPDATE Run SET current_horde = (SELECT horde_number + 1 FROM Horde WHERE horde_id = ?) WHERE run_id = ?',
            [horde_id, req.params.id]
        )
        res.json({ run_id: Number(req.params.id), horde_id, completed: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/run/:id/death — registra derrota (feeds v_death_distribution)
app.post('/api/run/:id/death', async (req, res) => {
    try {
        await pool.query('CALL sp_record_death(?)', [req.params.id])
        res.json({ run_id: Number(req.params.id), result: 'defeat' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PATCH /api/run/:id/level — avanza nivel sin cerrar el run (el trigger suma levels_completed)
app.patch('/api/run/:id/level', async (req, res) => {
    const { level_id } = req.body
    if (!level_id) return res.status(400).json({ error: 'level_id required' })
    try {
        await pool.query(
            'UPDATE Run SET current_level_id = ?, current_horde = 1 WHERE run_id = ?',
            [level_id, req.params.id]
        )
        res.json({ run_id: Number(req.params.id), current_level_id: level_id })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/run/:runId — actualiza run (victoria, avance de nivel, gold final)
app.put('/api/run/:runId', async (req, res) => {
    const { result, total_gold_earned, current_level_id } = req.body
    if (!result) return res.status(400).json({ error: 'result required (victory|defeat)' })
    try {
        await pool.query(
            `UPDATE Run SET
                result            = ?,
                is_active         = FALSE,
                ended_at          = NOW(),
                total_gold_earned = COALESCE(?, total_gold_earned),
                current_level_id  = COALESCE(?, current_level_id)
             WHERE run_id = ?`,
            [result, total_gold_earned ?? null, current_level_id ?? null, req.params.runId]
        )
        res.json({ run_id: Number(req.params.runId), result })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//  UPGRADE 

// POST /api/upgrade — compra upgrade de carta (tier y bonos calculados por el SP)
app.post('/api/upgrade', async (req, res) => {
    const { player_id, card_id, gold_cost, gold_spent } = req.body
    if (!player_id || !card_id) return res.status(400).json({ error: 'player_id and card_id required' })
    try {
        await pool.query(
            'CALL sp_upgrade_card(?, ?, ?)',
            [player_id, card_id, gold_cost ?? gold_spent ?? 0]
        )
        res.status(201).json({ upgraded: true, player_id, card_id })
    } catch (err) {
        if (err.message?.includes('cannot exceed'))
            return res.status(400).json({ error: 'Card already at max upgrade tier (3)' })
        res.status(500).json({ error: err.message })
    }
})

//  STATS 

// POST /api/stats — no-op: los triggers actualizan Stats automáticamente
app.post('/api/stats', async (req, res) => {
    const { player_id } = req.body
    if (!player_id) return res.status(400).json({ error: 'player_id required' })
    res.json({ updated: true, player_id })
})

// GET /api/stats/:playerId — stats directas de la tabla Stats
app.get('/api/stats/:playerId', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Stats WHERE player_id = ?', [req.params.playerId])
        if (!rows.length) return res.status(404).json({ error: 'stats not found' })
        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//  ADMIN 

// GET /api/admin/death-distribution — dificultad por level/horde
app.get('/api/admin/death-distribution', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_death_distribution')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/death-rates — partidas jugadas vs muertes por level-horde (grouped bar)
app.get('/api/admin/death-rates', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                CONCAT('L', l.level_number, '-H', h.horde_number) AS label,
                (
                    SELECT COUNT(*) FROM Run r2
                    WHERE (r2.current_level_id = l.level_id AND r2.current_horde >= h.horde_number)
                       OR r2.current_level_id > l.level_id
                ) AS runs_played,
                (
                    SELECT COUNT(*) FROM Run r3
                    WHERE r3.current_level_id = l.level_id
                      AND r3.result = 'defeat'
                      AND r3.current_horde = h.horde_number
                ) AS total_deaths
            FROM Horde h
            JOIN Level l ON h.level_id = l.level_id
            ORDER BY l.level_number, h.horde_number
        `)
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/most-upgraded-cards — meta del juego, cartas más populares
app.get('/api/admin/most-upgraded-cards', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_most_upgraded_cards')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/horde-difficulty — tasa de completion por horde
app.get('/api/admin/horde-difficulty', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_horde_difficulty')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/leaderboard — ranking global de jugadores
app.get('/api/admin/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_global_leaderboard')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/card-usage — distribución de cartas en manos
app.get('/api/admin/card-usage', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_card_usage_frequency')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/admin/run-duration — duración promedio de sesiones
app.get('/api/admin/run-duration', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM v_average_run_duration')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// 

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'))
