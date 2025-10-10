const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // inicializa modelos/asociaciones
const clientesRouter = require('./routes/clientes');
const productosRouter = require('./routes/productos');
const pedidosRouter = require('./routes/pedidos');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/clientes', clientesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/pedidos', pedidosRouter);

// Error handler básico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Sincroniza modelos (crea tablas si no existen)
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Servidor levantado en http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error al inicializar la DB:', err);
    process.exit(1);
  }
})();
