import { db } from '../db/database.js';
import { HttpError } from '../utils/httpError.js';

export function getAllProducts(req, res, next) {
  try {
    const products = db.prepare(`
      SELECT id, name, price, stock, category, created_at, updated_at
      FROM products
      ORDER BY name ASC
    `).all();

    res.json(products);
  } catch (error) {
    next(error);
  }
}

export function createProduct(req, res, next) {
  try {
    const { name, price, stock, category } = req.body;

    const result = db.prepare(`
      INSERT INTO products (name, price, stock, category)
      VALUES (?, ?, ?, ?)
    `).run(name, price, stock, category);

    const product = db.prepare(`
      SELECT * FROM products WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

export function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;

    const result = db.prepare(`
      UPDATE products
      SET name = ?, price = ?, stock = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, price, stock, category, id);

    if (result.changes === 0) {
      throw new HttpError(404, 'Product not found.');
    }

    const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);

    res.json({ product });
  } catch (error) {
    next(error);
  }
}

export function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const result = db.prepare(`
      DELETE FROM products WHERE id = ?
    `).run(id);

    if (result.changes === 0) {
      throw new HttpError(404, 'Product not found.');
    }

    res.status(204).send();
  } catch (error) {
    if (error.code?.startsWith('SQLITE_CONSTRAINT')) {
      return next(new HttpError(409, 'Product linked to sales.'));
    }

    next(error);
  }
}