import { renderProductos, renderPedidoItems, renderClientes } from "./ui.js";
import { crearPedido } from "./api.js";

let pedidoActual = [];
let clienteSeleccionado = null;

function agregarProducto(producto) {
  const existente = pedidoActual.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    pedidoActual.push({ ...producto, cantidad: 1 });
  }
  renderPedidoItems(pedidoActual);
}

async function handleCrearPedido() {
  if (!clienteSeleccionado) {
    alert("Debes seleccionar un cliente.");
    return;
  }

  if (pedidoActual.length === 0) {
    alert("Agrega al menos un producto antes de crear el pedido.");
    return;
  }

  const pedido = {
    clienteId: clienteSeleccionado.id,
    items: pedidoActual.map(p => ({
      productoId: p.id,
      cantidad: p.cantidad
    }))
  };

  try {
    const res = await crearPedido(pedido);

    if (res && res.id) {
      alert("✅ Pedido creado con éxito!");
      pedidoActual = [];
      renderPedidoItems(pedidoActual);

      // Mostrar pedido creado
      document.getElementById("pedido-creado").innerHTML = `
        <h3>Pedido creado para ${res.cliente.nombre}</h3>
        <p>Estado: ${res.estado}</p>
        <p>Total: $${res.total}</p>
        <ul>
          ${res.items.map(i => `<li>${i.producto.nombre} x${i.cantidad} — $${i.subtotal}</li>`).join("")}
        </ul>
      `;
    } else {
      alert("❌ Error al crear el pedido.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al conectar con el servidor.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductos(agregarProducto);
  renderPedidoItems(pedidoActual);
  renderClientes(cliente => (clienteSeleccionado = cliente));
  document.getElementById("btn-crear-pedido").addEventListener("click", handleCrearPedido);
});



