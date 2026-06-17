import { apiRequest } from './api.js';
import { clearSession, getSession, saveSession } from './storage.js';
import { clearAlert, setFormValidated, showAlert } from './dom.js';

export function initAuth({ onLogin, onLogout }) {
  const loginForm = document.querySelector('#loginForm');
  const logoutButton = document.querySelector('#logoutButton');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setFormValidated(loginForm, true);
    clearAlert();

    const formData = new FormData(loginForm);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '');

    if (!loginForm.checkValidity()) {
      showAlert('Revise los datos ingresados.', 'warning');
      return;
    }

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      saveSession(data);
      loginForm.reset();
      setFormValidated(loginForm, false);
      onLogin(getSession());
      showAlert('Sesion iniciada correctamente.', 'success');
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  });

  logoutButton.addEventListener('click', () => {
    clearSession();
    onLogout();
    showAlert('Sesion cerrada.', 'info');
  });
}
