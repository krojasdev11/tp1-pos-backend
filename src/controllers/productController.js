import { db } from '../db/database.js';
import { HttpError } from '../utils/httpError.js';

const listAllProducts = db.prepare(`
  SELECT id, name, price, stock, category, created_at, updated_at
  FROM products
  ORDER BY name ASC
`);

const listProductsByCategory = db.prepare(`
  SELECT id, name, price, stock, category, created_at, updated_at
  FROM products
  WHERE category = ?
  ORDER BY name ASC
`);

const findProductById = db.prepare(`
  SELECT id, name, price, stock, category, created_at, updated_at
  FROM products
  WHERE id = ?
`);

const insertProduct = db.prepare(`
  INSERT INTO products (name, price, stock, category)
  VALUES (?, ?, ?, ?)
`);

const updateProductById = db.prepare(`
  UPDATE products
  SET name = ?, price = ?, stock = ?, category = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const deleteProductById = db.prepare('DELETE FROM products WHERE id = ?');

export function getProducts(req, res, next) {
  try {
    const { category } = req.query;
    const products = category
      ? listProductsByCategory.all(category)
      : listAllProducts.all();

    res.json({ products });
  } catch (error) {
    next(error);
  }
}

export function createProduct(req, res, next) {
  try {
    const { name, price, stock, category } = req.body;
    const result = insertProduct.run(name, price, stock, category);
    const product = findProductById.get(Number(result.lastInsertRowid));

    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
}

export function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const result = updateProductById.run(name, price, stock, category, id);

    if (result.changes === 0) {
      throw new HttpError(404, 'Product not found.');
    }

    res.json({ product: findProductById.get(id) });
  } catch (error) {
    next(error);
  }
}

export function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const result = deleteProductById.run(id);

    if (result.changes === 0) {
      throw new HttpError(404, 'Product not found.');
    }

    res.status(204).send();
  } catch (error) {
    if (error.code?.startsWith('ERR_SQLITE_CONSTRAINT')) {
      return next(new HttpError(409, 'Product cannot be deleted because it is linked to existing sales.'));
    }

    next(error);
  }
}
