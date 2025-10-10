const { Sequelize, DataTypes } = require('sequelize');
const PedidoModel = require('../src/models/pedido'); // ajustá la ruta si es distinta

let sequelize;
let Pedido;

beforeAll(async () => {
  // Base SQLite en memoria
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
  Pedido = PedidoModel(sequelize, DataTypes);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('crea un pedido correctamente', async () => {
  const pedido = await Pedido.create({
    clienteId: 1,
    estado: 'PENDIENTE',
    total: 5000.50
  });

  expect(pedido.id).toBeDefined();
  expect(pedido.clienteId).toBe(1);
  expect(pedido.estado).toBe('PENDIENTE');
  expect(Number(pedido.total)).toBeCloseTo(5000.50);
  expect(pedido.fecha).toBeInstanceOf(Date);
});

test('usa valores por defecto correctamente', async () => {
  const pedido = await Pedido.create({ clienteId: 2 });

  expect(pedido.estado).toBe('PENDIENTE');
  expect(Number(pedido.total)).toBeCloseTo(0);
  expect(pedido.fecha).toBeInstanceOf(Date);
});

test('no permite crear un pedido sin clienteId', async () => {
  await expect(
    Pedido.create({
      estado: 'CONFIRMADO',
      total: 3000
    })
  ).rejects.toThrow();
});
