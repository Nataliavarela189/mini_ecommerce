const { Sequelize, DataTypes } = require('sequelize');
const ClienteModel = require('../src/models/cliente'); // ajustá la ruta si es distinta

let sequelize;
let Cliente;

beforeAll(async () => {
  // Base en memoria, no toca tu base real
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
  Cliente = ClienteModel(sequelize, DataTypes);
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('crea un cliente correctamente', async () => {
  const cliente = await Cliente.create({
    nombre: 'Juan Pérez',
    email: 'juan@example.com'
  });

  expect(cliente.id).toBeDefined();
  expect(cliente.nombre).toBe('Juan Pérez');
  expect(cliente.email).toBe('juan@example.com');
});

test('no permite crear un cliente sin nombre', async () => {
  await expect(
    Cliente.create({
      email: 'sinNombre@example.com'
    })
  ).rejects.toThrow();
});

test('no permite crear un cliente con email inválido', async () => {
  await expect(
    Cliente.create({
      nombre: 'Cliente Inválido',
      email: 'no-es-un-email'
    })
  ).rejects.toThrow();
});

test('no permite crear dos clientes con el mismo email', async () => {
  await Cliente.create({ nombre: 'Carlos', email: 'carlos@example.com' });

  await expect(
    Cliente.create({ nombre: 'Otro Carlos', email: 'carlos@example.com' })
  ).rejects.toThrow();
});
