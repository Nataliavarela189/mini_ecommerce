const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Cliente = require('./cliente')(sequelize, DataTypes);
const Producto = require('./producto')(sequelize, DataTypes);
const Pedido = require('./pedido')(sequelize, DataTypes);
const PedidoItem = require('./pedidoItem')(sequelize, DataTypes);

// Asociaciones
Cliente.hasMany(Pedido, { foreignKey: 'clienteId', as: 'pedidos' });
Pedido.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Pedido.hasMany(PedidoItem, { foreignKey: 'pedidoId', as: 'items' });
PedidoItem.belongsTo(Pedido, { foreignKey: 'pedidoId', as: 'pedido' });

Producto.hasMany(PedidoItem, { foreignKey: 'productoId', as: 'pedidoItems' });
PedidoItem.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

module.exports = {
  sequelize,
  Cliente,
  Producto,
  Pedido,
  PedidoItem
};
