import { apiRequest } from './api.js';
import { clearChildren, formatCurrency, formatDate, setFormValidated, showAlert } from './dom.js';

const cart = new Map();
let currentProducts = [];

export function initSales({ getProducts, refreshProducts }) {
  const saleForm = document.querySelector('#saleForm');
  const clearCartButton = document.querySelector('#clearCartButton');
  const allSalesButton = document.querySelector('#allSalesButton');
  const dailySalesButton = document.querySelector('#dailySalesButton');

  clearCartButton.addEventListener('click', () => {
    cart.clear();
    renderCart();
  });

  saleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormValidated(saleForm, true);

    const payment = Number(new FormData(saleForm).get('payment'));
    const items = [...cart.values()].map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    if (items.length === 0) {
      showAlert('Agregue al menos un producto al carrito.', 'warning');
      return;
    }

    if (!Number.isFinite(payment) || payment <= 0) {
      showAlert('Ingrese un pago valido.', 'warning');
      return;
    }

    try {
      const result = await apiRequest('/sales', {
        method: 'POST',
        body: JSON.stringify({ items, payment })
      });
      cart.clear();
      saleForm.reset();
      setFormValidated(saleForm, false);
      renderCart();
      await refreshProducts();
      showAlert(`Venta registrada. Vuelto: ${formatCurrency(result.change)}`, 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });

  allSalesButton.addEventListener('click', () => loadSalesReport('/sales', allSalesButton, dailySalesButton));
  dailySalesButton.addEventListener('click', () => loadSalesReport('/sales/daily', dailySalesButton, allSalesButton));

  renderSaleProducts(getProducts());

  return {
    loadSalesReport: () => loadSalesReport('/sales', allSalesButton, dailySalesButton)
  };
}

export function renderSaleProducts(products) {
  currentProducts = products;
  const list = document.querySelector('#saleProductsList');
  clearChildren(list);

  if (products.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-body-secondary';
    empty.textContent = 'No hay productos disponibles.';
    list.appendChild(empty);
    return;
  }

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card product-card';

    const body = document.createElement('div');
    body.className = 'card-body';

    const title = document.createElement('h2');
    title.className = 'h6';
    title.textContent = product.name;

    const category = document.createElement('p');
    category.className = 'text-body-secondary mb-2';
    category.textContent = product.category;

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const price = document.createElement('p');
    price.className = 'fw-semibold mb-1';
    price.textContent = formatCurrency(product.price);

    const stock = document.createElement('p');
    stock.className = 'small text-body-secondary mb-2';
    stock.textContent = `Stock: ${product.stock}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-sm btn-primary';
    button.textContent = 'Agregar';
    button.disabled = product.stock <= 0;
    button.addEventListener('click', () => addToCart(product));

    meta.append(price, stock, button);
    body.append(title, category, meta);
    card.appendChild(body);
    list.appendChild(card);
  });
}

function addToCart(product) {
  const existing = cart.get(product.id);
  const quantity = existing ? existing.quantity + 1 : 1;

  if (quantity > product.stock) {
    showAlert('No hay stock suficiente para agregar mas unidades.', 'warning');
    return;
  }

  cart.set(product.id, { product, quantity });
  renderCart();
}

function renderCart() {
  const cartList = document.querySelector('#cartList');
  const cartTotal = document.querySelector('#cartTotal');
  clearChildren(cartList);

  if (cart.size === 0) {
    const empty = document.createElement('div');
    empty.className = 'list-group-item text-body-secondary';
    empty.textContent = 'El carrito esta vacio.';
    cartList.appendChild(empty);
    cartTotal.textContent = formatCurrency(0);
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.product.price * item.quantity;

    const row = document.createElement('div');
    row.className = 'list-group-item d-flex align-items-center justify-content-between gap-2';

    const name = document.createElement('div');
    name.className = 'flex-grow-1';
    const title = document.createElement('div');
    title.className = 'fw-semibold';
    title.textContent = item.product.name;
    const subtotal = document.createElement('small');
    subtotal.className = 'text-body-secondary';
    subtotal.textContent = formatCurrency(item.product.price * item.quantity);
    name.append(title, subtotal);

    const quantity = document.createElement('input');
    quantity.className = 'form-control form-control-sm cart-quantity';
    quantity.type = 'number';
    quantity.min = '1';
    quantity.max = String(item.product.stock);
    quantity.step = '1';
    quantity.value = String(item.quantity);
    quantity.addEventListener('change', () => updateCartQuantity(item.product.id, Number(quantity.value)));

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn-sm btn-outline-danger';
    remove.textContent = 'Quitar';
    remove.addEventListener('click', () => {
      cart.delete(item.product.id);
      renderCart();
    });

    row.append(name, quantity, remove);
    cartList.appendChild(row);
  });

  cartTotal.textContent = formatCurrency(total);
}

function updateCartQuantity(productId, quantity) {
  const item = cart.get(productId);
  if (!item) {
    return;
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.product.stock) {
    showAlert('Cantidad invalida para el stock disponible.', 'warning');
    renderCart();
    return;
  }

  item.quantity = quantity;
  cart.set(productId, item);
  renderCart();
}

async function loadSalesReport(path, activeButton, inactiveButton) {
  try {
    activeButton.classList.add('active');
    inactiveButton.classList.remove('active');
    const sales = await apiRequest(path);
    renderSalesReport(sales);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

function renderSalesReport(sales) {
  const body = document.querySelector('#salesReportBody');
  clearChildren(body);

  if (sales.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.className = 'text-center text-body-secondary py-4';
    cell.textContent = 'No hay ventas para mostrar.';
    row.appendChild(cell);
    body.appendChild(row);
    return;
  }

  sales.forEach((sale) => {
    const row = document.createElement('tr');
    row.append(createCell(sale.id));
    row.append(createCell(sale.username));
    row.append(createCell(formatDate(sale.created_at)));
    row.append(createCell(formatCurrency(sale.total), 'text-end'));
    row.append(createCell(formatCurrency(sale.payment), 'text-end'));
    row.append(createCell(formatCurrency(sale.change), 'text-end'));
    body.appendChild(row);
  });
}

function createCell(value, className = '') {
  const cell = document.createElement('td');
  if (className) {
    cell.className = className;
  }
  cell.textContent = String(value ?? '');
  return cell;
}

export function syncCartProducts(products = currentProducts) {
  currentProducts = products;
  const productsById = new Map(products.map((product) => [product.id, product]));
  cart.forEach((item, productId) => {
    const updatedProduct = productsById.get(productId);
    if (!updatedProduct || updatedProduct.stock <= 0) {
      cart.delete(productId);
      return;
    }
    item.product = updatedProduct;
    item.quantity = Math.min(item.quantity, updatedProduct.stock);
    cart.set(productId, item);
  });
  renderCart();
}
