import { getProductos, getClientes } from "./api.js";

export async function renderProductos(onAgregarProducto) {
  const productos = await getProductos();
  const tbody = document.getElementById("productos-body");
  tbody.innerHTML = "";

  productos.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>$${p.precio}</td>
      <td>${p.stock}</td>
      <td><button data-id="${p.id}" class="btn-agregar">Agregar</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const producto = productos.find(p => p.id === id);
      onAgregarProducto(producto);
    });
  });
}

export async function renderClientes(onSeleccionarCliente) {
  const clientes = await getClientes();
  const select = document.getElementById("select-cliente");
  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nombre;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const id = parseInt(select.value);
    const cliente = clientes.find(c => c.id === id);
    onSeleccionarCliente(cliente);
  });
}

export function renderPedidoItems(items) {
  const container = document.getElementById("pedido-items");
  container.innerHTML = items.length
    ? items.map(i => `<p>${i.nombre} x${i.cantidad}</p>`).join("")
    : "<p>No hay productos en el pedido.</p>";
}



