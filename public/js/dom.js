const alertRegion = document.querySelector('#alertRegion');

export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function text(value) {
  return document.createTextNode(String(value ?? ''));
}

export function appendText(element, value) {
  element.textContent = String(value ?? '');
}

export function showAlert(message, type = 'info') {
  clearChildren(alertRegion);

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.setAttribute('role', 'alert');

  const content = document.createElement('span');
  content.textContent = normalizeMessage(message);
  alert.appendChild(content);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-close';
  button.setAttribute('aria-label', 'Cerrar');
  button.addEventListener('click', clearAlert);
  alert.appendChild(button);

  alertRegion.appendChild(alert);
}

export function clearAlert() {
  clearChildren(alertRegion);
}

export function normalizeMessage(message) {
  const value = String(message || 'Ocurrio un error inesperado.');
  return value.slice(0, 180);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 30);
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

export function setFormValidated(form, isValidated) {
  form.classList.toggle('was-validated', isValidated);
}
