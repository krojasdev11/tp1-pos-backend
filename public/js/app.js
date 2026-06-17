import { initAuth } from './auth.js';
import { getSession } from './storage.js';
import { initProducts, getProducts } from './product.js';
import { initSales, renderSaleProducts, syncCartProducts } from './sales.js';
import { clearAlert, showAlert } from './dom.js';

const loginView = document.querySelector('#loginView');
const appView = document.querySelector('#appView');
const sessionBadge = document.querySelector('#sessionBadge');
const logoutButton = document.querySelector('#logoutButton');
const navButtons = document.querySelectorAll('[data-view]');
const viewPanels = {
  products: document.querySelector('#productsView'),
  sales: document.querySelector('#salesView'),
  reports: document.querySelector('#reportsView')
};

let loadProducts;
let salesApi;

initAuth({
  onLogin: async () => {
    renderSessionState();
    await loadProducts();
    showView('products');
  },
  onLogout: () => {
    renderSessionState();
    showView('products');
  }
});

loadProducts = initProducts({
  getCurrentSession: getSession,
  onProductsChanged: (products) => {
    renderSaleProducts(products);
    syncCartProducts(products);
  }
});

salesApi = initSales({
  getProducts,
  refreshProducts: loadProducts
});

navButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const view = button.dataset.view;
    showView(view);
    if (view === 'reports' && getSession()?.user?.role === 'ADMIN') {
      await salesApi.loadSalesReport();
    }
  });
});

window.addEventListener('unhandledrejection', () => {
  showAlert('No se pudo completar la operacion solicitada.', 'danger');
});

renderSessionState();

if (getSession()) {
  loadProducts();
}

function renderSessionState() {
  const session = getSession();
  const isAuthenticated = Boolean(session);
  const isAdmin = session?.user?.role === 'ADMIN';

  loginView.classList.toggle('d-none', isAuthenticated);
  appView.classList.toggle('d-none', !isAuthenticated);
  logoutButton.classList.toggle('d-none', !isAuthenticated);

  document.querySelectorAll('.admin-only').forEach((element) => {
    element.classList.toggle('d-none', !isAdmin);
  });

  if (isAuthenticated) {
    sessionBadge.textContent = `${session.user.username} - ${session.user.role}`;
    sessionBadge.className = isAdmin ? 'badge text-bg-primary' : 'badge text-bg-secondary';
  } else {
    sessionBadge.textContent = 'Sin sesion';
    sessionBadge.className = 'badge text-bg-secondary';
    clearAlert();
  }
}

function showView(viewName) {
  const session = getSession();
  if (!session) {
    return;
  }

  if (viewName === 'reports' && session.user.role !== 'ADMIN') {
    showAlert('No tiene permisos para ver reportes.', 'warning');
    return;
  }

  Object.entries(viewPanels).forEach(([name, panel]) => {
    panel.classList.toggle('d-none', name !== viewName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.view === viewName);
  });
}
