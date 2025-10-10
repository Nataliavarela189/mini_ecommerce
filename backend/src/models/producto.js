module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ACTIVO' }
  }, {
    tableName: 'PRODUCTOS',
    timestamps: false
  });

  return Producto;
};
