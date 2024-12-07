/*ACTIVIDAD 2
PROGRAMACION AVANZADA 1-3
LUIS FRANCISCO AGUILAR CABRALES 180256
CARLOS ADRIAN CASTILLO PEREZ 170169 */

const express = require('express');
const betterSqlite3 = require('better-sqlite3');
const app = express();
const port = 3000;

// Conexión a la base de datos
const db = betterSqlite3('database.db');

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL
  )
`).run();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Rutas CRUD

// Alta (crear un nuevo item)
app.post('/api/items', (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    db.prepare('INSERT INTO items (nombre, descripcion) VALUES (?, ?)').run(nombre, descripcion);
    res.status(201).send('Item agregado');
  } catch (error) {
    res.status(500).send('Error al agregar el item: ' + error.message);
  }
});

// Buscar (por nombre)
app.get('/api/items/buscar/:nombre', (req, res) => {
  const { nombre } = req.params;
  try {
    const rows = db.prepare('SELECT * FROM items WHERE nombre LIKE ?').all(`%${nombre}%`);
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al buscar items: ' + error.message);
  }
});

// Listar todos los items
app.get('/api/items', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM items').all();
    res.json(rows);
  } catch (error) {
    res.status(500).send('Error al listar items: ' + error.message);
  }
});

// Actualizar un item por ID
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    db.prepare('UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?').run(nombre, descripcion, id);
    res.send('Item actualizado');
  } catch (error) {
    res.status(500).send('Error al actualizar el item: ' + error.message);
  }
});

// Eliminar un item por ID
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    res.send('Item eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar el item: ' + error.message);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
