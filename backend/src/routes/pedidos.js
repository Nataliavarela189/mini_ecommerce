const express = require('express');
const router = express.Router();
const { sequelize, Pedido, PedidoItem, Producto, Cliente } = require('../models');

/**
 * Rutas para pedidos
 * - POST /api/pedidos  => crea pedido + items de forma transaccional y descuenta stock
 * - GET /api/pedidos   => lista con items y cliente
 * - GET /api/pedidos/:id
 * - PATCH /api/pedidos/:id => actualizar estado
 * - DELETE /api/pedidos/:id => borra pedido y restaura stock (transacción)
 */

// Listar pedidos con items y cliente
router.get('/', async (req, res) => {
  const pedidos = await Pedido.findAll({
    include: [
      { model: PedidoItem, as: 'items', include: [{ model: Producto, as: 'producto' }] },
      { model: Cliente, as: 'cliente' }
    ]
  });
  res.json(pedidos);
});

// Obtener un pedido por id
router.get('/:id', async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id, {
    include: [
      { model: PedidoItem, as: 'items', include: [{ model: Producto, as: 'producto' }] },
      { model: Cliente, as: 'cliente' }
    ]
  });
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json(pedido);
});

// Crear pedido (transacción): crea pedido + items y actualiza stock
router.post('/', async (req, res) => {
  const { clienteId, items, estado } = req.body;

  if (!clienteId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'clienteId e items (array) son requeridos' });
  }

  const t = await sequelize.transaction();
  try {
    // Verificar cliente
    const cliente = await Cliente.findByPk(clienteId, { transaction: t });
    if (!cliente) throw new Error('Cliente no encontrado');

    // Traer productos involucrados
    const productIds = items.map(i => i.productoId);
    const productos = await Producto.findAll({
      where: { id: productIds },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    // Map de productos
    const prodMap = {};
    productos.forEach(p => prodMap[p.id] = p);

    // Validaciones y cálculo de total
    let total = 0;
    for (const it of items) {
      const producto = prodMap[it.productoId];
      if (!producto) throw new Error(`Producto ${it.productoId} no encontrado`);
      if (producto.stock < it.cantidad) throw new Error(`Stock insuficiente para producto ${producto.nombre}`);
      total += parseFloat(producto.precio) * it.cantidad;
    }

    // Crear pedido
    const pedido = await Pedido.create({
      clienteId,
      estado: estado || 'PENDIENTE',
      total,
      fecha: new Date()
    }, { transaction: t });

    // Crear items y descontar stock
    for (const it of items) {
      const producto = prodMap[it.productoId];
      const subtotal = parseFloat(producto.precio) * it.cantidad;

      await PedidoItem.create({
        pedidoId: pedido.id,
        productoId: producto.id,
        cantidad: it.cantidad,
        precioUnitario: producto.precio,
        subtotal
      }, { transaction: t });

      producto.stock = producto.stock - it.cantidad;
      await producto.save({ transaction: t });
    }

    await t.commit();

    // Retornar pedido con relación
    const pedidoFinal = await Pedido.findByPk(pedido.id, {
      include: [
        { model: PedidoItem, as: 'items', include: [{ model: Producto, as: 'producto' }] },
        { model: Cliente, as: 'cliente' }
      ]
    });

    res.status(201).json(pedidoFinal);
  } catch (err) {
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
});

// Actualizar estado del pedido (PATCH)
router.patch('/:id', async (req, res) => {
  const { estado } = req.body;
  if (!estado) return res.status(400).json({ error: 'estado es requerido' });

  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

  pedido.estado = estado;
  await pedido.save();
  res.json(pedido);
});

// Eliminar pedido y restaurar stock (transaccional)
router.delete('/:id', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const pedido = await Pedido.findByPk(req.params.id, {
      include: [{ model: PedidoItem, as: 'items' }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!pedido) {
      await t.rollback();
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Restaurar stock
    for (const item of pedido.items) {
      const producto = await Producto.findByPk(item.productoId, { transaction: t, lock: t.LOCK.UPDATE });
      producto.stock = producto.stock + item.cantidad;
      await producto.save({ transaction: t });
    }

    // Borrar items y pedido
    await PedidoItem.destroy({ where: { pedidoId: pedido.id }, transaction: t });
    await pedido.destroy({ transaction: t });

    await t.commit();
    res.json({ message: 'Pedido eliminado y stock restaurado' });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
