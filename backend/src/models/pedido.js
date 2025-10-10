module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define('Pedido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDIENTE' },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'PEDIDOS',
    timestamps: false
  });

  return Pedido;
};
