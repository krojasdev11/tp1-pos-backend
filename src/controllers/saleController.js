import { db, runInTransaction } from '../db/database.js';
import { HttpError } from '../utils/httpError.js';

export function createSale(req, res, next) {
  try {
    const { items, payment } = req.body;

    const result = runInTransaction(() => {
      let total = 0;

      for (const item of items) {
        const product = db.prepare(`
          SELECT id, price, stock FROM products WHERE id = ?
        `).get(item.product_id);

        if (!product) {
          throw new HttpError(404, 'Product not found');
        }

        if (product.stock < item.quantity) {
          throw new HttpError(400, 'Insufficient stock');
        }

        total += product.price * item.quantity;

        db.prepare(`
          UPDATE products SET stock = stock - ? WHERE id = ?
        `).run(item.quantity, item.product_id);
      }

      const change = payment - total;

      if (change < 0) {
        throw new HttpError(400, 'Insufficient payment');
      }

      const saleResult = db.prepare(`
        INSERT INTO sales (total, payment, change, created_at, user_id)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)
      `).run(total, payment, change, req.user.id);

      for (const item of items) {
        const product = db.prepare(`
          SELECT price FROM products WHERE id = ?
        `).get(item.product_id);

        db.prepare(`
          INSERT INTO sale_items (sale_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `).run(saleResult.lastInsertRowid, item.product_id, item.quantity, product.price);
      }

      return {
        id: saleResult.lastInsertRowid,
        total,
        payment,
        change
      };
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export function getSales(req, res, next) {
  try {
    const sales = db.prepare(`
      SELECT s.*, u.username
      FROM sales s
      JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
    `).all();

    res.json(sales);
  } catch (error) {
    next(error);
  }
}

export function getDailySales(req, res, next) {
  try {
    const sales = db.prepare(`
      SELECT s.*, u.username
      FROM sales s
      JOIN users u ON u.id = s.user_id
      WHERE DATE(s.created_at) = DATE('now')
      ORDER BY s.created_at DESC
    `).all();

    res.json(sales);
  } catch (error) {
    next(error);
  }
}