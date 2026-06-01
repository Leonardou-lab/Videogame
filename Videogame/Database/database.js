import mysql from 'mysql2'

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Leolol10',
    database:'coward_king'
}).promise()

// Test
const [rows] = await pool.query('SELECT 1')
console.log('Conexión exitosa:', rows)

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1')
    console.log('Conexión exitosa a MySQL!')
  } catch (err) {
    console.error('Error de conexión:', err.message)
  }
}

testConnection()