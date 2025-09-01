const productos = [
  // 🥩 Carnes
  {
    categoria: 'carnes',
    nombre: 'Carne de Res Premium',
    precio: 28000,
    descripcion: 'Corte de res jugoso y tierno, ideal para asar.',
    imagen: 'img/carne-res.webp'
  },
  {
    categoria: 'carnes',
    nombre: 'Lomo Fino de Res',
    precio: 35000,
    descripcion: 'Lomo de res de alta calidad para parrilla o sartén.',
    imagen: 'img/lomo-fino.webp'
  },
  {
    categoria: 'carnes',
    nombre: 'Costillas de Res',
    precio: 22000,
    descripcion: 'Costillas carnosas para asados y barbacoas.',
    imagen: 'img/costillas-res.webp'
  },

  // 🍗 Pollos
  {
    categoria: 'pollos',
    nombre: 'Pechuga de Pollo',
    precio: 15000,
    descripcion: 'Pechuga fresca y magra de pollo, sin piel.',
    imagen: 'img/pechuga-pollo.webp'
  },
  {
    categoria: 'pollos',
    nombre: 'Muslos de Pollo',
    precio: 12000,
    descripcion: 'Muslos jugosos ideales para guisos o fritos.',
    imagen: 'img/muslos-pollo.webp'
  },
  {
    categoria: 'pollos',
    nombre: 'Alitas de Pollo',
    precio: 10000,
    descripcion: 'Alitas frescas, perfectas para freír o asar.',
    imagen: 'img/alitas-pollo.webp'
  },

  // 🐖 Cerdos
  {
    categoria: 'cerdos',
    nombre: 'Costillas de Cerdo',
    precio: 18000,
    descripcion: 'Costillas tiernas y jugosas para la parrilla.',
    imagen: 'img/costillas-cerdo.webp'
  },
  {
    categoria: 'cerdos',
    nombre: 'Lomo de Cerdo',
    precio: 21000,
    descripcion: 'Corte magro de cerdo, ideal para asar o guisar.',
    imagen: 'img/lomo-cerdo.webp'
  },
  {
    categoria: 'cerdos',
    nombre: 'Chicharrón de Cerdo',
    precio: 16000,
    descripcion: 'Chicharrón fresco y carnudo, ideal para fritura.',
    imagen: 'img/chicharron-cerdo.webp'
  },

  // 🧀 Quesos
  {
    categoria: 'quesos',
    nombre: 'Queso Fresco',
    precio: 8000,
    descripcion: 'Queso blanco artesanal, suave y delicioso.',
    imagen: 'img/queso-fresco.webp'
  },
];


// =============================
// Productos
// =============================
let productosFiltrados = [...productos];

// Carrito: clave = índice del producto, valor = cantidad
let carrito = {};

// =============================
// Formateador a pesos colombianos
// =============================
const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0
});

// =============================
// Restaurar datos guardados
// =============================
const carritoGuardado = sessionStorage.getItem('carrito');
if (carritoGuardado) {
  carrito = JSON.parse(carritoGuardado);
}

const pedidoGuardado = sessionStorage.getItem('pedido');
if (pedidoGuardado) {
  const pedido = JSON.parse(pedidoGuardado);
  pedido.resumen.forEach(item => {
    const index = productos.findIndex(p => p.nombre === item.nombre);
    if (index !== -1) carrito[index] = item.cantidad;
  });
}

// =============================
// Renderizado del carrito
// =============================
function renderCarrito() {
  const contenedor = document.querySelector('.cart-items');
  contenedor.innerHTML = '';

  productosFiltrados.forEach((producto) => {
    const index = productos.indexOf(producto);
    const cantidad = carrito[index] || 0;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <div class="info">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="bottom">
          <span>${formatoCOP.format(producto.precio)}</span>
          <div class="qty">
            <button class="menos" data-id="${index}">−</button>
            <span id="cant_${index}">${cantidad}</span>
            <button class="mas" data-id="${index}">+</button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(item);
  });

  // Asignar eventos a los botones
  document.querySelectorAll('.mas').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), 1));
  });

  document.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', () => cambiarCantidad(parseInt(btn.dataset.id), -1));
  });

  actualizarTotal();
}

// =============================
// Cambiar cantidad
// =============================
function cambiarCantidad(index, delta) {
  carrito[index] = Math.max(0, (carrito[index] || 0) + delta);
  document.getElementById(`cant_${index}`).textContent = carrito[index];
  actualizarTotal();
}

// =============================
// Calcular y actualizar total
// =============================
function actualizarTotal() {
  let total = 0;
  for (const i in carrito) {
    const index = parseInt(i, 10); // 👈 convertir clave a número
    if (productos[index]) {
      total += productos[index].precio * carrito[i];
    }
  }

  const totalTexto = document.getElementById('total-price');
  if (totalTexto) {
    totalTexto.textContent = formatoCOP.format(total);
  }

  // Guardar carrito en sessionStorage
  sessionStorage.setItem('carrito', JSON.stringify(carrito));
}

// =============================
// Filtro de categorías
// =============================
function filtrarBotonCategoria(boton, categoria) {
  document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
  boton.classList.add('active');
  localStorage.setItem('categoriaSeleccionada', categoria);
  filtrarCategoria(categoria);
}

function filtrarCategoria(categoria) {
  productosFiltrados = productos.filter(producto => producto.categoria === categoria);
  renderCarrito();
}

// =============================
// Evento de Realizar Pedido
// =============================
document.querySelector('.pay').addEventListener('click', () => {
  const resumen = [];
  let total = 0;

  for (const i in carrito) {
    const index = parseInt(i, 10);
    const producto = productos[index];
    const cantidad = carrito[i];
    if (producto && cantidad > 0) {
      const subtotal = producto.precio * cantidad;

      resumen.push({
        nombre: producto.nombre,
        cantidad,
        subtotal
      });

      total += subtotal;
    }
  }

  const pedido = { resumen, total };

  // Guardar en localStorage y sessionStorage
  localStorage.setItem('pedido', JSON.stringify(pedido));
  sessionStorage.setItem('pedido', JSON.stringify(pedido));

  // No limpiamos el carrito para que siga al volver atrás
  window.location.href = 'customer.html';
});

// =============================
// Inicialización al cargar
// =============================
const categoriaGuardada = localStorage.getItem('categoriaSeleccionada');

if (categoriaGuardada) {
  const boton = [...document.querySelectorAll('.categoria-btn')]
    .find(btn => btn.getAttribute('onclick').includes(categoriaGuardada));

  if (boton) {
    boton.classList.add('active');
    filtrarCategoria(categoriaGuardada);
  } else {
    productosFiltrados = [...productos];
    renderCarrito();
  }
} else {
  productosFiltrados = [...productos];
  renderCarrito();
}
