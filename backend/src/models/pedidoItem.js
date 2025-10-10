module.exports = (sequelize, DataTypes) => {
  const PedidoItem = sequelize.define('PedidoItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pedidoId: { type: DataTypes.INTEGER, allowNull: false },
    productoId: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precioUnitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10,2), allowNull: false }
  }, {
    tableName: 'PEDIDO_ITEMS',
    timestamps: false
  });

  return PedidoItem;
};
