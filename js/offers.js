// =============================
// Carrito compartido
// =============================
let carrito = JSON.parse(sessionStorage.getItem('carrito')) || {};

// =============================
// Formateador a pesos colombianos
// =============================
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

// =============================
// Cambiar cantidad (+ y -)
// =============================
function cambiarCantidad(id, nombre, precio, delta) {
  if (!carrito[id]) {
    carrito[id] = { nombre, precio, cantidad: 0 };
  }

  // aseguramos que el precio quede siempre guardado
  carrito[id].precio = precio;

  carrito[id].cantidad = Math.max(0, carrito[id].cantidad + delta);

  // Actualizar cantidad en interfaz
  const cantidadEl = document.getElementById(`cant_${id}`);
  if (cantidadEl) {
    cantidadEl.textContent = carrito[id].cantidad;
  }

  // Guardar en sessionStorage
  sessionStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar total
  actualizarTotal();
}

// =============================
// Eventos para botones + y -
// =============================
document.querySelectorAll('.mas').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const card = btn.closest('.offer-card');
    const nombre = card.querySelector('h3').textContent;
    const priceEl = card.querySelector('.price');
    const precio = Number(priceEl.dataset.price) ? Number(priceEl.dataset.price) : 0; // 👈 ya no multiplica x100

    cambiarCantidad(id, nombre, precio, 1);
  });
});

document.querySelectorAll('.menos').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.id;
    const card = btn.closest('.offer-card');
    const nombre = card.querySelector('h3').textContent;
    const priceEl = card.querySelector('.price');
    const precio = Number(priceEl.dataset.price) ? Number(priceEl.dataset.price) : 0; // 👈 ya no multiplica x100

    cambiarCantidad(id, nombre, precio, -1);
  });
});

// =============================
// Restaurar cantidades al cargar
// =============================
window.addEventListener('DOMContentLoaded', () => {
  for (const key in carrito) {
    if (document.getElementById(`cant_${key}`)) {
      document.getElementById(`cant_${key}`).textContent = carrito[key].cantidad;
    }
  }
  actualizarTotal();
});

// =============================
// Actualizar total en footer
// =============================
function actualizarTotal() {
  let total = 0;
  for (const key in carrito) {
    if (!isNaN(carrito[key].precio)) {
      total += carrito[key].precio * carrito[key].cantidad;
    }
  }
  const totalEl = document.getElementById('total-price');
  if (totalEl) {
    totalEl.textContent = formatoCOP.format(total); // 👈 ya no divides entre 100
  }
}

// =============================
// Realizar pedido
// =============================
document.querySelector('.pay').addEventListener('click', () => {
  const resumen = [];
  let total = 0;

  for (const key in carrito) {
    const item = carrito[key];
    if (item.cantidad > 0 && !isNaN(item.precio)) {
      resumen.push({
        nombre: item.nombre,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      });
      total += item.precio * item.cantidad;
    }
  }

  const pedido = { resumen, total };

  // Guardar pedido
  localStorage.setItem('pedido', JSON.stringify(pedido));
  sessionStorage.setItem('pedido', JSON.stringify(pedido));

  // Redirigir a customer.html
  window.location.href = 'customer.html';
});
