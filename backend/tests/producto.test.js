const { Sequelize, DataTypes } = require('sequelize');
const ProductoModel = require('../src/models/producto'); // ajustá la ruta si es distinta

let sequelize;
let Producto;

beforeAll(async () => {
  // Crea una base SQLite en memoria solo para los tests
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
  Producto = ProductoModel(sequelize, DataTypes);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('crea un producto correctamente', async () => {
  const producto = await Producto.create({
    nombre: 'Laptop',
    precio: 1200.50,
    stock: 10,
    estado: 'ACTIVO'
  });

  expect(producto.id).toBeDefined();
  expect(producto.nombre).toBe('Laptop');
  expect(Number(producto.precio)).toBeCloseTo(1200.50);
  expect(producto.stock).toBe(10);
  expect(producto.estado).toBe('ACTIVO');
});

test('usa valores por defecto cuando no se especifican', async () => {
  const producto = await Producto.create({
    nombre: 'Licuadora',
    precio: 3000.00
  });

  expect(producto.stock).toBe(0);
  expect(producto.estado).toBe('ACTIVO');
});

test('no permite crear un producto sin nombre', async () => {
  await expect(
    Producto.create({
      precio: 5000,
      stock: 5,
      estado: 'ACTIVO'
    })
  ).rejects.toThrow();
});
