const express = require("express");
const mysql   = require("mysql2");
const cors    = require("cors");
const path    = require("path");

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host:     "localhost",
  user:     "root",      
  password: "Leolol10",           
  database: "nekocafe"
});

db.connect(err => {
  if (err) {
    console.error("Error al conectar con MySQL:", err.message);
    process.exit(1);
  }
  console.log("Conectado a MySQL ✔");
});

//Endpoints 
app.get("/api/menu/:dia", (req, res) => {
  const dia = parseInt(req.params.dia, 10);

  if (isNaN(dia) || dia < 0 || dia > 6) {
    return res.status(400).json({ error: "Invalid day. Use 0 (Sunday) a 6 (Saturday)." });
  }

  const sql = `
    SELECT m.id, m.name, m.description, m.price, m.category, m.image_url,
           d.name AS day_name
    FROM   menu_items m
    JOIN   weekdays d ON d.id = m.day_id
    WHERE  m.day_id = ?
    ORDER  BY m.id
  `;

  db.query(sql, [dia], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ dia: dia, label: rows[0]?.day_name ?? "", items: rows });
  });
});

// GET- todos los gatos
app.get("/api/gatos", (req, res) => {
  db.query("SELECT * FROM cats ORDER BY id", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
