// ViraLata Club - Utilitários Globais

const API_URL = '/api';

// Obter token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Obter usuário do localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Salvar dados de login
function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

// Limpar dados de login
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Verificar se está logado
function isLoggedIn() {
  return !!getToken();
}

// Verificar se é admin
function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

// Fazer requisição autenticada
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      window.location.href = '/pages/login.html';
      return;
    }
    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
}

// Mostrar toast
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
  const id = `toast-${Date.now()}`;

  const toastHtml = `
    <div id="${id}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);
  const toastEl = document.getElementById(id);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// Mostrar / esconder loading
function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'flex';
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
}

// Atualizar navbar conforme estado de autenticação
function updateNavbar() {
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;

  const user = getUser();

  if (user) {
    const inicial = user.nome.charAt(0).toUpperCase();
    navAuth.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-perfil-badge dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="nav-perfil-avatar">${inicial}</span>
          <span style="font-weight:500;">Olá, ${user.nome.split(' ')[0]}</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end shadow">
          <li><h6 class="dropdown-header">${user.nome}</h6></li>
          <li><hr class="dropdown-divider"></li>
          ${user.role === 'admin'
            ? '<li><a class="dropdown-item" href="/pages/admin/dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Painel Admin</a></li>'
            : '<li><a class="dropdown-item" href="/pages/minhas-adocoes.html"><i class="bi bi-clipboard-heart me-2"></i>Minhas Solicitações</a></li>'
          }
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item text-danger" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        </ul>
      </li>
    `;
  } else {
    navAuth.innerHTML = `
      <li class="nav-item">
        <a class="nav-link fw-semibold" href="/pages/login.html" style="color:#444;">Login</a>
      </li>
      <li class="nav-item ms-2">
        <a class="btn btn-primary btn-sm fw-semibold px-3" href="/pages/register.html">Cadastrar</a>
      </li>
    `;
  }
}

// Logout
function logout() {
  clearAuth();
  window.location.href = '/';
}

// Estágio de vida do pet
function etapaVida(meses) {
  if (meses < 12) return 'Filhote';
  if (meses < 84) return 'Adulto';
  return 'Idoso';
}

// Capitalizar primeira letra
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Tipo do animal
function tipoAnimal(especie) {
  if (especie === 'cachorro') return 'Vira-lata';
  if (especie === 'gato') return 'Gato Mestiço';
  return 'Animal Resgatado';
}

// Formatar idade
function formatIdade(meses) {
  if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  const anos = Math.floor(meses / 12);
  const restMeses = meses % 12;
  let texto = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  if (restMeses > 0) texto += ` e ${restMeses} ${restMeses === 1 ? 'mês' : 'meses'}`;
  return texto;
}

// Formatar status para badge
function statusBadge(status) {
  const labels = {
    disponivel: 'Disponível',
    em_analise: 'Em Análise',
    adotado: 'Adotado',
    pendente: 'Pendente',
    aprovada: 'Aprovada',
    rejeitada: 'Rejeitada',
  };
  return `<span class="badge status-badge-${status}">${labels[status] || status}</span>`;
}

// Inicializar navbar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  hideLoading();
});
