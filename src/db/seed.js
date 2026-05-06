import bcrypt from 'bcryptjs';
import { db } from './database.js';
import { initializeSchema } from './schema.js';

initializeSchema();

const users = [
  { username: 'admin', password: 'Admin123!', role: 'ADMIN' },
  { username: 'empleado', password: 'User123!', role: 'USER' }
];

const products = [
  { name: 'Coca Cola 500ml', price: 1500, stock: 30, category: 'gaseosas' },
  { name: 'Papas fritas 80g', price: 1200, stock: 25, category: 'snacks' },
  { name: 'Agua mineral 500ml', price: 900, stock: 40, category: 'bebidas' },
  { name: 'Chocolate', price: 1100, stock: 20, category: 'golosinas' }
];

const findUser = db.prepare('SELECT id FROM users WHERE username = ?');
const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');

for (const user of users) {
  if (!findUser.get(user.username)) {
    const hashedPassword = bcrypt.hashSync(user.password, 12);
    insertUser.run(user.username, hashedPassword, user.role);
  }
}

const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
const insertProduct = db.prepare(`
  INSERT INTO products (name, price, stock, category)
  VALUES (?, ?, ?, ?)
`);

if (productCount === 0) {
  for (const product of products) {
    insertProduct.run(product.name, product.price, product.stock, product.category);
  }
}

console.log('Database seeded successfully.');
