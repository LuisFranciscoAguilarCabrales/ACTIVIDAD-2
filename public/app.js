/*ACTIVIDAD 2
PROGRAMACION AVANZADA 1-3
LUIS FRANCISCO AGUILAR CABRALES 180256
CARLOS ADRIAN CASTILLO PEREZ 170169 */

// Cargar todos los items al iniciar
document.addEventListener('DOMContentLoaded', cargarItems);

// Agregar Item
document.getElementById('itemForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('itemNombre').value;
  const descripcion = document.getElementById('itemDescripcion').value;

  await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion }),
  });

  cargarItems();
});

// Buscar Items
document.getElementById('buscarBtn').addEventListener('click', async () => {
  const nombre = document.getElementById('buscarNombre').value;

  const res = await fetch(`/api/items/buscar/${nombre}`);
  const items = await res.json();

  mostrarLista(items);
});

// Cargar todos los items
async function cargarItems() {
  const res = await fetch('/api/items');
  const items = await res.json();
  mostrarLista(items);
}

// Mostrar lista de items
function mostrarLista(items) {
  const lista = document.getElementById('itemList');
  lista.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre}: ${item.descripcion}`;

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', () => eliminarItem(item.id));

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.addEventListener('click', () => editarItem(item.id));

    li.appendChild(editarBtn);
    li.appendChild(eliminarBtn);
    lista.appendChild(li);
  });
}

// Eliminar Item
async function eliminarItem(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' });
  cargarItems();
}

// Editar Item
async function editarItem(id) {
  const nombre = prompt('Nuevo nombre:');
  const descripcion = prompt('Nueva descripción:');

  await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion }),
  });

  cargarItems();
}
