const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');

/**
 * CRUD básico para clientes
 */

router.get('/', async (req, res) => {
  const clientes = await Cliente.findAll();
  res.json(clientes);
});

router.get('/:id', async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

router.post('/', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    await cliente.update(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  await cliente.destroy();
  res.json({ message: 'Cliente eliminado' });
});

module.exports = router;
