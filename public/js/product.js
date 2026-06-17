import { apiRequest } from './api.js';
import { appendText, clearChildren, formatCurrency, setFormValidated, showAlert } from './dom.js';

let products = [];

export function getProducts() {
  return [...products];
}

export function initProducts({ getCurrentSession, onProductsChanged }) {
  const tableBody = document.querySelector('#productsTableBody');
  const productForm = document.querySelector('#productForm');
  const productFormTitle = document.querySelector('#productFormTitle');
  const refreshButton = document.querySelector('#refreshProductsButton');
  const cancelButton = document.querySelector('#cancelProductEditButton');

  refreshButton.addEventListener('click', () => loadProducts({ tableBody, getCurrentSession, onProductsChanged }));
  cancelButton.addEventListener('click', () => resetProductForm(productForm, productFormTitle));

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormValidated(productForm, true);

    if (!productForm.checkValidity()) {
      showAlert('Revise los datos del producto.', 'warning');
      return;
    }

    const formData = new FormData(productForm);
    const id = String(formData.get('productId') || '').trim();
    const payload = {
      name: String(formData.get('name') || '').trim(),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: String(formData.get('category') || '').trim()
    };

    if (!isValidProduct(payload)) {
      showAlert('Los datos del producto no cumplen las reglas requeridas.', 'warning');
      return;
    }

    try {
      const path = id ? `/products/${encodeURIComponent(id)}` : '/products';
      const method = id ? 'PUT' : 'POST';
      await apiRequest(path, { method, body: JSON.stringify(payload) });
      resetProductForm(productForm, productFormTitle);
      await loadProducts({ tableBody, getCurrentSession, onProductsChanged });
      showAlert('Producto guardado correctamente.', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });

  return () => loadProducts({ tableBody, getCurrentSession, onProductsChanged });
}

export async function loadProducts({ tableBody, getCurrentSession, onProductsChanged }) {
  try {
    products = await apiRequest('/products');
    renderProductsTable(tableBody, products, getCurrentSession()?.user?.role);
    onProductsChanged(products);
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

function renderProductsTable(tableBody, productList, role) {
  clearChildren(tableBody);

  if (productList.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = role === 'ADMIN' ? 5 : 4;
    cell.className = 'text-center text-body-secondary py-4';
    cell.textContent = 'No hay productos cargados.';
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  productList.forEach((product) => {
    const row = document.createElement('tr');
    row.appendChild(createCell(product.name));
    row.appendChild(createCell(product.category));
    row.appendChild(createCell(formatCurrency(product.price), 'text-end'));
    row.appendChild(createCell(product.stock, 'text-end'));

    if (role === 'ADMIN') {
      const actions = document.createElement('td');
      actions.className = 'text-end';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'btn btn-sm btn-outline-primary me-2';
      editButton.textContent = 'Editar';
      editButton.addEventListener('click', () => fillProductForm(product));

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'btn btn-sm btn-outline-danger';
      deleteButton.textContent = 'Eliminar';
      deleteButton.addEventListener('click', () => deleteProduct(product.id));

      actions.append(editButton, deleteButton);
      row.appendChild(actions);
    }

    tableBody.appendChild(row);
  });
}

function createCell(value, className = '') {
  const cell = document.createElement('td');
  if (className) {
    cell.className = className;
  }
  appendText(cell, value);
  return cell;
}

function fillProductForm(product) {
  document.querySelector('#productFormTitle').textContent = 'Editar producto';
  document.querySelector('#productId').value = product.id;
  document.querySelector('#productName').value = product.name;
  document.querySelector('#productPrice').value = product.price;
  document.querySelector('#productStock').value = product.stock;
  document.querySelector('#productCategory').value = product.category;
  document.querySelector('#productName').focus();
}

async function deleteProduct(id) {
  const confirmed = window.confirm('Desea eliminar este producto?');
  if (!confirmed) {
    return;
  }

  try {
    await apiRequest(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
    products = products.filter((product) => product.id !== id);
    renderProductsTable(document.querySelector('#productsTableBody'), products, 'ADMIN');
    showAlert('Producto eliminado.', 'success');
  } catch (error) {
    showAlert(error.message, 'danger');
  }
}

function resetProductForm(form, title) {
  form.reset();
  document.querySelector('#productId').value = '';
  title.textContent = 'Nuevo producto';
  setFormValidated(form, false);
}

function isValidProduct(product) {
  return product.name.length >= 2
    && product.name.length <= 120
    && product.category.length >= 2
    && product.category.length <= 60
    && Number.isFinite(product.price)
    && product.price > 0
    && Number.isInteger(product.stock)
    && product.stock >= 0;
}
