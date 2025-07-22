// ------------ CONFIGURAÇÃO ------------
// Adicione o endpoint correto (exemplo: 'clients')
const API_BASE = 'https://crudcrud.com/api/177e6f3725cd436fa7aa87ee224288eb/clients';

// Captura elementos do DOM
const form = document.getElementById('client-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const listEl = document.getElementById('client-list');

// ------------ DEPURAÇÃO ------------
function debugLog(msg, type = 'info') {
  const styles = {
    info: 'color: navy; font-weight: bold',
    error: 'color: darkred; font-weight: bold',
    warn: 'color: orange; font-weight: bold'
  };
  console.log(`%c${msg}`, styles[type] || styles.info);
}

// ------------ FUNÇÕES ------------
window.addEventListener('DOMContentLoaded', fetchClients);

async function fetchClients() {
  debugLog('Chamando fetchClients()', 'info');
  try {
    const res = await fetch(API_BASE);
    debugLog(`GET ${API_BASE} → ${res.status}`, 'info');

    if (!res.ok) throw new Error('Falha no GET');
    const data = await res.json();
    debugLog('Dados recebidos do servidor:', 'info');
    console.table(data);

    listEl.innerHTML = '';
    data.forEach(renderClient);
  } catch (err) {
    debugLog(err.message, 'error');
  }
}

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

form.addEventListener('submit', async e => {
  e.preventDefault();

  const newClient = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim()
  };
  if (!newClient.name || !newClient.email) {
    debugLog('Nome ou e-mail vazio. Abortando POST.', 'warn');
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
    debugLog(`POST → ${res.status}`, 'info');

    if (!res.ok) throw new Error('Falha no POST');
    nameInput.value = '';
    emailInput.value = '';
    fetchClients();
  } catch (err) {
    debugLog(err.message, 'error');
  }
});

async function deleteClient(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    debugLog(`DELETE → ${res.status}`, 'info');

    if (!res.ok) throw new Error('Falha no DELETE');
    document.getElementById(id)?.remove();
  } catch (err) {
    debugLog(err.message, 'error');
  }
}
