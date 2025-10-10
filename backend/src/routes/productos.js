const express = require('express');
const router = express.Router();
const { Producto } = require('../models');

/**
 * CRUD completo para productos
 */

router.get('/', async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

router.get('/:id', async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

router.post('/', async (req, res) => {
  try {
    const { nombre, precio, stock, estado } = req.body;
    const producto = await Producto.create({ nombre, precio, stock, estado });
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  await producto.destroy();
  res.json({ message: 'Producto eliminado' });
});

module.exports = router;
