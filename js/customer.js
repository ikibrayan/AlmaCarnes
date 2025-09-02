function finalizarPedido() {
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const entrega = document.getElementById('entrega').value;
  const pago = document.getElementById('pago').value;
  const observaciones = document.getElementById('observaciones').value.trim(); // 🔹 Nuevo campo

  const urlParams = new URLSearchParams(window.location.search);
  const esOferta = urlParams.get('oferta') === 'true';

  if (!nombre || !direccion || !telefono) {
    alert('Por favor completa todos los datos del cliente.');
    return;
  }

  const pedido = JSON.parse(localStorage.getItem("pedido"));

  if (!esOferta && (!pedido || !pedido.resumen || pedido.resumen.length === 0)) {
    alert('No se encontró un pedido válido. Regresa al menú.');
    return;
  }

  // 🔹 Formateador COP
  const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0
  });

  let mensaje = `Hola, quiero hacer un pedido:\n`;

  if (!esOferta) {
    pedido.resumen.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} – ${formatoCOP.format(item.subtotal)}\n`;
    });

    mensaje += `\nTotal: ${formatoCOP.format(pedido.total)}\n`;
  } else {
    mensaje += `Esta es una solicitud de oferta directa sin productos seleccionados.\n`;
  }

  mensaje += `\n📍 Dirección: ${direccion}`;
  mensaje += `\n🙋 Nombre: ${nombre}`;
  mensaje += `\n📞 Teléfono: ${telefono}`;
  mensaje += `\n🚚 Tipo de entrega: ${entrega}`;
  mensaje += `\n💳 Método de pago: ${pago}`;

  // 🔹 Agregar observaciones si existen
  if (observaciones) {
    mensaje += `\n📝 Observaciones: ${observaciones}`;
  }

  const numero = '3205510535'; // Reemplaza con el número real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  // 🔹 Limpiar pedido después de enviarlo
  localStorage.removeItem("pedido");
  sessionStorage.removeItem("pedido");

  window.open(url, '_blank');
}
