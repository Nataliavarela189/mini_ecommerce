const API_BASE = "http://localhost:3000/api";

export async function getProductos() {
  const res = await fetch(`${API_BASE}/productos`);
  return res.json();
}

export async function getClientes() {
  const res = await fetch(`${API_BASE}/clientes`);
  return res.json();
}

export async function crearPedido(pedido) {
  const res = await fetch(`${API_BASE}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
  });
  return res.json();
}



