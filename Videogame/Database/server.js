import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

const app = express()
app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
    host:     '127.0.0.1',
    user:     'root',
    password: 'Leolol10',
    database: 'coward_king',
}).promise()

// color y game_type son propiedades visuales/de gameplay — no tienen sentido en la BD
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
    'Royal Decree': { color: '#d6a632', game_type: 'zone'  },
    'Peace Treaty': { color: '#55b7b3', game_type: 'zone'  },
    'Royal Curse':  { color: '#c0392b', game_type: 'zone'  },
    'Decoy':        { color: '#e74c3c', game_type: 'ally'  },
}

// GET /api/cards  →  cartas con campos listos para el juego (hp, damage, cost, range, color, type)
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
                range:   c.range,
                color:   meta.color,
                text:    c.effect_description,
            }
        })
        res.json(cards)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/enemies/:levelId  →  enemigos del nivel con sus stats de BD
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

// GET /api/levels  →  lista de niveles
app.get('/api/levels', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Level')
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'))