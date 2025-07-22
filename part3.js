// ------------ CONFIGURAÇÃO ------------
// Substitua o endpoint abaixo pelo seu token do CrudCrud
const API_BASE = 'https://crudcrud.com/api/177e6f3725cd436fa7aa87ee224288eb/clients';

// ------------ CAPTURA DE ELEMENTOS ------------ //
const form = document.getElementById('client-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const listEl = document.getElementById('client-list');

// ------------ DEPURAÇÃO (console.log estilizado) ------------ //
function debugLog(message, type = 'info') {
  const styles = {
    info: 'color: navy; font-weight: bold',
    error: 'color: darkred; font-weight: bold',
    warn: 'color: orange; font-weight: bold'
  };
  console.log(`%c${message}`, styles[type] || styles.info);
}

// ------------ CARREGAR CLIENTES AO INICIAR ------------ //
window.addEventListener('DOMContentLoaded', fetchClients);

async function fetchClients() {
  debugLog('Buscando clientes...', 'info');
  try {
    const response = await fetch(API_BASE);
    debugLog(`GET ${API_BASE} → ${response.status}`, 'info');

    if (!response.ok) throw new Error('Erro ao buscar clientes');

    const clients = await response.json();
    debugLog('Clientes carregados:', 'info');
    console.table(clients);

    listEl.innerHTML = '';
    clients.forEach(renderClient);
  } catch (error) {
    debugLog(error.message, 'error');
    listEl.innerHTML = '<li>Erro ao carregar clientes.</li>';
  }
}

// ------------ EXIBIR CLIENTE NA LISTA ------------ //
function renderClient(client) {
  const li = document.createElement('li');
  li.id = client._id;

  const span = document.createElement('span');
  span.textContent = `${client.name} (${client.email})`;

  const btn = document.createElement('button');
  btn.textContent = 'Excluir';
  btn.addEventListener('click', () => deleteClient(client._id));

  li.append(span, btn);
  listEl.appendChild(li);
}

// ------------ ADICIONAR CLIENTE ------------ //
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const newClient = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };

  if (!newClient.name || !newClient.email) {
    debugLog('Nome ou e-mail vazio. Não foi possível adicionar.', 'warn');
    return;
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });

    debugLog(`POST → ${response.status}`, 'info');

    if (!response.ok) throw new Error('Erro ao adicionar cliente');

    nameInput.value = '';
    emailInput.value = '';
    fetchClients();
  } catch (error) {
    debugLog(error.message, 'error');
  }
});

// ------------ EXCLUIR CLIENTE ------------ //
async function deleteClient(id) {
  debugLog(`Excluindo cliente ID: ${id}`, 'warn');

  try {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    debugLog(`DELETE → ${response.status}`, 'info');

    if (!response.ok) throw new Error('Erro ao excluir cliente');
    document.getElementById(id)?.remove();
  } catch (error) {
    debugLog(error.message, 'error');
  }
}
