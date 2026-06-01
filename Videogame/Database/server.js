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
    'Exile':        { color: '#9b59b6', game_type: 'trap'  },
    'Bomb':         { color: '#e74c3c', game_type: 'zone'  },
    'Peace Treaty': { color: '#55b7b3', game_type: 'zone'  },
    'Royal Curse':  { color: '#c0392b', game_type: 'zone'  },
    'Decoy':        { color: '#e74c3c', game_type: 'ally'  },
}

//ENDPOINTS

// GET api-cards
app.get('/api/cards', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Card')
        const cards = rows.map(c => {
            const meta = CARD_META[c.name] ?? { range: 1, color: '#888', game_type: 'ally' }
            return {
                card_id: c.card_id,
                name:    c.name,
                type:    meta.game_type,
                cost:    c.base_ap_cost,
                hp:      c.base_hp,
                damage:  c.base_damage,
                range:   c.range_attack,
                color:   meta.color,
                text:    c.effect_description,
            }
        })
        res.json(cards)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET api-enemies with stats levelId 
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

// GET api-levels
app.get('/api/levels', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Level')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

function hashPassword(p) {
    return crypto.createHash('sha256').update(p).digest('hex')
}

// POST api-player  ccreate new player + row of stats
app.post('/api/player', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'username and password required' })
    try {
        const [result] = await pool.query(
            'INSERT INTO Player (username, password_hash) VALUES (?, ?)',
            [username, hashPassword(password)]
        )
        const player_id = result.insertId
        await pool.query('INSERT INTO Stats (player_id) VALUES (?)', [player_id])
        res.status(201).json({ player_id, username })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'username already taken' })
        res.status(500).json({ error: err.message })
    }
})

// GET api-player username if exists input password 
app.get('/api/player/:username', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT player_id, username, password_hash, created_at FROM Player WHERE username = ?',
            [req.params.username]
        )
        if (!rows.length) return res.status(404).json({ error: 'player not found' })
        const player = rows[0]
        if (req.query.password !== undefined) {
            if (player.password_hash !== hashPassword(req.query.password))
                return res.status(401).json({ error: 'wrong password' })
        }
        res.json({ player_id: player.player_id, username: player.username, created_at: player.created_at })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST api-run  start a new run
app.post('/api/run', async (req, res) => {
    const { player_id, level_id } = req.body
    if (!player_id) return res.status(400).json({ error: 'player_id required' })
    try {
        const [result] = await pool.query(
            'INSERT INTO Run (player_id, current_level_id) VALUES (?, ?)',
            [player_id, level_id ?? null]
        )
        res.status(201).json({ run_id: result.insertId, player_id, result: 'in_progress' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT api-run  update new run ID
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

// POST api-upgrade  saves upgrade 
app.post('/api/upgrade', async (req, res) => {
    const { player_id, card_id, level, ap_cost_bonus, hp_bonus, damage_bonus, gold_spent } = req.body
    if (!player_id || !card_id) return res.status(400).json({ error: 'player_id and card_id required' })
    try {
        const [existing] = await pool.query(
            'SELECT upgrade_id FROM Card_Upgrade WHERE player_id = ? AND card_id = ?',
            [player_id, card_id]
        )
        if (existing.length) {
            await pool.query(
                `UPDATE Card_Upgrade SET
                    level          = ?,
                    ap_cost_bonus  = ?,
                    hp_bonus       = ?,
                    damage_bonus   = ?,
                    gold_spent     = gold_spent + ?
                 WHERE player_id = ? AND card_id = ?`,
                [level ?? 1, ap_cost_bonus ?? 0, hp_bonus ?? 0, damage_bonus ?? 0,
                 gold_spent ?? 0, player_id, card_id]
            )
            res.json({ updated: true, player_id, card_id })
        } else {
            const [result] = await pool.query(
                'INSERT INTO Card_Upgrade (player_id, card_id, level, ap_cost_bonus, hp_bonus, damage_bonus, gold_spent) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [player_id, card_id, level ?? 1, ap_cost_bonus ?? 0, hp_bonus ?? 0, damage_bonus ?? 0, gold_spent ?? 0]
            )
            res.status(201).json({ upgrade_id: result.insertId, player_id, card_id })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST api-stats  sum stats of the player
app.post('/api/stats', async (req, res) => {
    const { player_id, total_runs, total_enemies_killed, total_upgrades, total_gold_earned, levels_completed } = req.body
    if (!player_id) return res.status(400).json({ error: 'player_id required' })
    try {
        await pool.query(
            `UPDATE Stats SET
                total_runs           = total_runs           + ?,
                total_enemies_killed = total_enemies_killed + ?,
                total_upgrades       = total_upgrades       + ?,
                total_gold_earned    = total_gold_earned    + ?,
                levels_completed     = levels_completed     + ?
             WHERE player_id = ?`,
            [total_runs ?? 0, total_enemies_killed ?? 0, total_upgrades ?? 0,
             total_gold_earned ?? 0, levels_completed ?? 0, player_id]
        )
        res.json({ updated: true, player_id })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET api-stats playerId  
app.get('/api/stats/:playerId', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Stats WHERE player_id = ?', [req.params.playerId])
        if (!rows.length) return res.status(404).json({ error: 'stats not found' })
        res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'))