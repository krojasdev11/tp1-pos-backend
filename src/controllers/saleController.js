import { db, runInTransaction } from '../db/database.js';
import { HttpError } from '../utils/httpError.js';

const findProductForSale = db.prepare(`
  SELECT id, name, price, stock
  FROM products
  WHERE id = ?
`);

const insertSale = db.prepare(`
  INSERT INTO sales (total, payment, change, created_at, user_id)
  VALUES (?, ?, ?, ?, ?)
`);

const insertSaleItem = db.prepare(`
  INSERT INTO sale_items (sale_id, product_id, quantity, price)
  VALUES (?, ?, ?, ?)
`);

const discountStock = db.prepare(`
  UPDATE products
  SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ? AND stock >= ?
`);

const listSalesQuery = db.prepare(`
  SELECT
    s.id,
    s.total,
    s.payment,
    s.change,
    s.created_at,
    s.user_id,
    u.username
  FROM sales s
  INNER JOIN users u ON u.id = s.user_id
  ORDER BY s.created_at DESC
`);

const listSaleItemsQuery = db.prepare(`
  SELECT
    si.id,
    si.sale_id,
    si.product_id,
    p.name AS product_name,
    si.quantity,
    si.price,
    ROUND(si.quantity * si.price, 2) AS subtotal
  FROM sale_items si
  INNER JOIN products p ON p.id = si.product_id
  WHERE si.sale_id = ?
  ORDER BY si.id ASC
`);

const dailySalesQuery = db.prepare(`
  SELECT
    COALESCE(SUM(total), 0) AS total,
    COUNT(*) AS sales_count
  FROM sales
  WHERE date(created_at) = date('now')
`);

function normalizeItems(items) {
  const itemMap = new Map();

  for (const item of items) {
    const currentQuantity = itemMap.get(item.product_id) ?? 0;
    itemMap.set(item.product_id, currentQuantity + item.quantity);
  }

  return [...itemMap.entries()].map(([product_id, quantity]) => ({ product_id, quantity }));
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

export function createSale(req, res, next) {
  try {
    const normalizedItems = normalizeItems(req.body.items);
    const payment = req.body.payment;

    const sale = runInTransaction(() => {
      const detailedItems = normalizedItems.map((item) => {
        const product = findProductForSale.get(item.product_id);

        if (!product) {
          throw new HttpError(404, `Product ${item.product_id} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new HttpError(409, `Insufficient stock for product ${product.name}.`);
        }

        return {
          ...item,
          name: product.name,
          price: product.price,
          subtotal: roundMoney(product.price * item.quantity)
        };
      });

      const total = roundMoney(detailedItems.reduce((sum, item) => sum + item.subtotal, 0));

      if (payment < total) {
        throw new HttpError(400, 'Payment is lower than sale total.');
      }

      const change = roundMoney(payment - total);
      const timestamp = new Date().toISOString();
      const result = insertSale.run(total, payment, change, timestamp, req.user.id);
      const saleId = Number(result.lastInsertRowid);

      for (const item of detailedItems) {
        const stockResult = discountStock.run(item.quantity, item.product_id, item.quantity);

        if (stockResult.changes === 0) {
          throw new HttpError(409, `Insufficient stock for product ${item.name}.`);
        }

        insertSaleItem.run(saleId, item.product_id, item.quantity, item.price);
      }

      return {
        id: saleId,
        total,
        payment,
        change,
        timestamp,
        items: detailedItems
      };
    });

    res.status(201).json({ sale });
  } catch (error) {
    next(error);
  }
}

export function getSales(_req, res, next) {
  try {
    const sales = listSalesQuery.all().map((sale) => ({
      ...sale,
      items: listSaleItemsQuery.all(sale.id)
    }));

    res.json({ sales });
  } catch (error) {
    next(error);
  }
}

export function getDailySales(_req, res, next) {
  try {
    const report = dailySalesQuery.get();

    res.json({
      date: new Date().toISOString().slice(0, 10),
      total: roundMoney(report.total),
      sales_count: report.sales_count
    });
  } catch (error) {
    next(error);
  }
}
