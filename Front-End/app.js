// ══════════════════════════════════════════════════════════
// PetShop SPA — Main Application
// Hash-based routing, state management, API integration
// ══════════════════════════════════════════════════════════

const API = window.API_URL || 'http://localhost:3000/api';

// ── State ──
const state = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  cart: JSON.parse(localStorage.getItem('cart') || '[]'),
};

function saveState() {
  localStorage.setItem('user', JSON.stringify(state.user));
  localStorage.setItem('token', state.token);
  localStorage.setItem('cart', JSON.stringify(state.cart));
}

// ── API Helper ──
async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ── Cart ──
function addToCart(item) {
  state.cart.push(item);
  saveState();
  updateCartUI();
  showToast(`"${item.name}" adicionado ao carrinho!`);
}

function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveState();
  updateCartUI();
}

function clearCart() {
  state.cart = [];
  saveState();
  updateCartUI();
}

function updateCartUI() {
  const count = document.getElementById('cart-count');
  const items = document.getElementById('cart-items');
  const total = document.getElementById('cart-total-value');
  if (count) {
    count.textContent = state.cart.length;
    count.classList.add('bump');
    setTimeout(() => count.classList.remove('bump'), 300);
  }
  if (items) {
    items.innerHTML = state.cart.length === 0
      ? '<li style="text-align:center;padding:2rem;color:var(--text-muted)">Carrinho vazio</li>'
      : state.cart.map((it, i) => `
        <li class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${it.name}</div>
            <div class="cart-item-price">R$ ${Number(it.price).toFixed(2)}</div>
          </div>
          <button class="cart-item-remove" data-index="${i}">✕</button>
        </li>
      `).join('');
    items.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.index)));
    });
  }
  if (total) {
    const sum = state.cart.reduce((s, it) => s + Number(it.price), 0);
    total.textContent = `R$ ${sum.toFixed(2)}`;
  }
}

function updateAuthNav() {
  const nav = document.getElementById('auth-nav');
  if (!nav) return;
  if (state.user) {
    nav.innerHTML = `
      <a href="#/perfil" class="btn btn-sm btn-ghost">👤 ${state.user.name || state.user.email}</a>
      <button id="logout-btn" class="btn btn-sm btn-ghost">Sair</button>
    `;
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      state.user = null;
      state.token = null;
      saveState();
      updateAuthNav();
      navigate('/');
    });
  } else {
    nav.innerHTML = `<a href="#/login" class="btn btn-outline btn-sm">Entrar</a>`;
  }
}

// ── Toast ──
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Router ──
const routes = {};

function route(path, handler) { routes[path] = handler; }

function navigate(path) { window.location.hash = path; }

async function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const [path, ...params] = hash.split('/').filter(Boolean);
  const routePath = '/' + (path || '');

  const app = document.getElementById('app');

  // Update active nav
  document.querySelectorAll('.nav-links a').forEach(a => {
    const p = a.getAttribute('data-page');
    a.classList.toggle('active', p === path || (!path && p === 'home'));
  });

  // Close mobile nav
  document.getElementById('nav-links')?.classList.remove('open');

  // Find handler
  let handler = routes[routePath];
  if (!handler && routes['/detail']) handler = routes['/detail'];
  if (!handler) {
    app.innerHTML = '<div class="empty-state"><div class="emoji">🔍</div><p>Página não encontrada</p><a href="#/" class="btn btn-primary" style="margin-top:1rem">Voltar ao início</a></div>';
    return;
  }

  app.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Carregando...</p></div>';

  try {
    await handler(app, params);
  } catch (err) {
    app.innerHTML = `<div class="error-msg">⚠️ ${err.message}</div>`;
    console.error(err);
  }
}

// ── Species helpers ──
const speciesEmoji = { cachorro: '🐕', gato: '🐈', peixe: '🐠', ave: '🦜', roedor: '🐹' };
const speciesLabel = { cachorro: 'Cachorro', gato: 'Gato', peixe: 'Peixe', ave: 'Ave', roedor: 'Roedor' };
const serviceIcon = { banho: '🛁', tosa: '✂️', veterinaria: '🩺', vacinacao: '💉', hospedagem: '🏠' };

// ══════════════════════════════════════════════════════════
//  PAGES
// ══════════════════════════════════════════════════════════

// ── HOME ──
route('/', async (app) => {
  const [pets, services, products] = await Promise.all([
    api('/pets?status=disponivel'),
    api('/services'),
    api('/products'),
  ]);

  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <h1>Tudo que seu pet precisa, em um só lugar 🐾</h1>
        <p>Produtos, serviços de banho & tosa, veterinário e animais de estimação esperando por você.</p>
        <div class="hero-actions">
          <a href="#/animais" class="btn btn-primary">🐕 Ver Animais</a>
          <a href="#/produtos" class="btn btn-accent">🛍️ Ver Produtos</a>
          <a href="#/servicos" class="btn btn-outline">💈 Nossos Serviços</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="features">
        <div class="feature"><div class="feature-icon">🚚</div><h3>Entrega Rápida</h3><p>Entregamos em até 24h na sua região</p></div>
        <div class="feature"><div class="feature-icon">🩺</div><h3>Veterinário</h3><p>Consultas com profissionais qualificados</p></div>
        <div class="feature"><div class="feature-icon">🛁</div><h3>Banho & Tosa</h3><p>Seu pet limpinho e estiloso</p></div>
        <div class="feature"><div class="feature-icon">💖</div><h3>Com Amor</h3><p>Cuidamos do seu pet como se fosse nosso</p></div>
      </div>
    </section>

    ${pets.length > 0 ? `
    <section class="section">
      <div class="section-header">
        <div><h2 class="section-title">🐾 Animais Disponíveis</h2><p class="section-subtitle">Encontre seu novo companheiro</p></div>
        <a href="#/animais" class="btn btn-outline btn-sm">Ver todos →</a>
      </div>
      <div class="grid grid-4">${pets.slice(0, 4).map(petCard).join('')}</div>
    </section>` : ''}

    ${products.length > 0 ? `
    <section class="section">
      <div class="section-header">
        <div><h2 class="section-title">🛍️ Produtos em Destaque</h2><p class="section-subtitle">As melhores marcas para seu pet</p></div>
        <a href="#/produtos" class="btn btn-outline btn-sm">Ver todos →</a>
      </div>
      <div class="grid grid-4">${products.slice(0, 4).map(productCard).join('')}</div>
    </section>` : ''}

    ${services.length > 0 ? `
    <section class="section">
      <div class="section-header">
        <div><h2 class="section-title">💈 Nossos Serviços</h2><p class="section-subtitle">Cuidado profissional para seu pet</p></div>
        <a href="#/servicos" class="btn btn-outline btn-sm">Ver todos →</a>
      </div>
      <div class="grid grid-3">${services.slice(0, 3).map(serviceCard).join('')}</div>
    </section>` : ''}
  `;
  bindCards(app);
});

// ── ANIMAIS ──
route('/animais', async (app) => {
  const pets = await api('/pets');

  app.innerHTML = `
    <section class="section">
      <div class="section-header">
        <div><h2 class="section-title">🐾 Animais Disponíveis</h2><p class="section-subtitle">Encontre seu novo companheiro de vida</p></div>
      </div>
      <div class="filters" id="species-filters">
        <button class="filter-btn active" data-species="">Todos</button>
        <button class="filter-btn" data-species="cachorro">🐕 Cachorros</button>
        <button class="filter-btn" data-species="gato">🐈 Gatos</button>
        <button class="filter-btn" data-species="peixe">🐠 Peixes</button>
        <button class="filter-btn" data-species="ave">🦜 Aves</button>
        <button class="filter-btn" data-species="roedor">🐹 Roedores</button>
      </div>
      <div class="grid grid-4" id="pet-grid">${pets.map(petCard).join('')}</div>
      ${pets.length === 0 ? '<div class="empty-state"><div class="emoji">🐾</div><p>Nenhum animal disponível no momento</p></div>' : ''}
    </section>
  `;

  let allPets = pets;
  app.querySelector('#species-filters')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    app.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const species = btn.dataset.species;
    const filtered = species ? allPets.filter(p => p.species === species) : allPets;
    const grid = app.querySelector('#pet-grid');
    grid.innerHTML = filtered.length ? filtered.map(petCard).join('') : '<div class="empty-state"><div class="emoji">🔍</div><p>Nenhum animal nessa categoria</p></div>';
    bindCards(app);
  });

  bindCards(app);
});

// ── ANIMAL DETAIL ──
route('/animais', async (app, params) => {
  if (!params || !params[0]) return;
  // This is handled by the dynamic route below
});

// Dynamic route for animal detail
route('/detail', async (app, params) => {});

// ── PRODUTOS ──
route('/produtos', async (app) => {
  const [products, categories] = await Promise.all([
    api('/products'),
    api('/categories'),
  ]);

  app.innerHTML = `
    <section class="section">
      <div class="section-header">
        <div><h2 class="section-title">🛍️ Produtos</h2><p class="section-subtitle">Tudo para o dia a dia do seu pet</p></div>
      </div>
      <div class="filters" id="cat-filters">
        <button class="filter-btn active" data-cat="">Todos</button>
        ${categories.map(c => `<button class="filter-btn" data-cat="${c.id}">${c.name}</button>`).join('')}
      </div>
      <div class="grid grid-4" id="product-grid">${products.map(productCard).join('')}</div>
      ${products.length === 0 ? '<div class="empty-state"><div class="emoji">📦</div><p>Nenhum produto disponível</p></div>' : ''}
    </section>
  `;

  app.querySelector('#cat-filters')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    app.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    const filtered = cat ? products.filter(p => p.categoryId === Number(cat)) : products;
    const grid = app.querySelector('#product-grid');
    grid.innerHTML = filtered.length ? filtered.map(productCard).join('') : '<div class="empty-state"><div class="emoji">🔍</div><p>Nenhum produto nessa categoria</p></div>';
    bindCards(app);
  });

  bindCards(app);
});

// ── SERVIÇOS ──
route('/servicos', async (app) => {
  const services = await api('/services');

  app.innerHTML = `
    <section class="hero" style="padding:3rem 2rem 2rem">
      <div class="hero-content">
        <h1>💈 Nossos Serviços</h1>
        <p>Cuidado profissional e carinho para o seu pet</p>
      </div>
    </section>
    <section class="section">
      <div class="grid grid-3">${services.map(serviceCard).join('')}</div>
      ${services.length === 0 ? '<div class="empty-state"><div class="emoji">💈</div><p>Nenhum serviço disponível</p></div>' : ''}
    </section>

    ${state.user ? `
    <section class="section" style="text-align:center">
      <h2 class="section-title">Agendar um Serviço</h2>
      <p class="section-subtitle" style="margin-bottom:1.5rem">Selecione um serviço acima e agende para o seu pet</p>
      <a href="#/perfil" class="btn btn-primary">📅 Ir para Meus Agendamentos</a>
    </section>` : `
    <section class="section" style="text-align:center">
      <h2 class="section-title">Quer agendar?</h2>
      <p class="section-subtitle" style="margin-bottom:1.5rem">Faça login e cadastre seu pet para agendar serviços</p>
      <a href="#/login" class="btn btn-primary">Entrar</a>
    </section>`}
  `;

  // Add booking buttons
  app.querySelectorAll('.service-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.user) { navigate('/login'); return; }
      navigate('/perfil');
    });
  });
});

// ── LOGIN ──
route('/login', async (app) => {
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h1>🔐 Entrar</h1>
        <p class="subtitle">Acesse sua conta para gerenciar seus pets e agendamentos</p>
        <form id="login-form">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" required placeholder="seu@email.com" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" required placeholder="Sua senha" />
          </div>
          <div id="login-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:1rem">Entrar</button>
        </form>
        <div class="auth-footer">
          Não tem conta? <a href="#/registro">Criar conta</a>
        </div>
      </div>
    </div>
  `;

  app.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = app.querySelector('#login-error');
    errEl.style.display = 'none';
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: app.querySelector('#email').value,
          password: app.querySelector('#password').value,
        }),
      });
      state.user = data.user;
      state.token = data.token;
      saveState();
      updateAuthNav();
      showToast(`Bem-vindo, ${data.user.name || data.user.email}!`);
      navigate('/perfil');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });
});

// ── REGISTRO ──
route('/registro', async (app) => {
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h1>📝 Criar Conta</h1>
        <p class="subtitle">Cadastre-se para acessar todos os recursos</p>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" placeholder="Seu nome" />
          </div>
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" required placeholder="seu@email.com" />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" required minlength="6" placeholder="Mínimo 6 caracteres" />
          </div>
          <div id="register-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top:1rem">Criar Conta</button>
        </form>
        <div class="auth-footer">
          Já tem conta? <a href="#/login">Entrar</a>
        </div>
      </div>
    </div>
  `;

  app.querySelector('#register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = app.querySelector('#register-error');
    errEl.style.display = 'none';
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: app.querySelector('#name').value,
          email: app.querySelector('#email').value,
          password: app.querySelector('#password').value,
        }),
      });
      state.user = data.user;
      state.token = data.token;
      saveState();
      updateAuthNav();
      showToast('Conta criada com sucesso!');
      navigate('/perfil');
    } catch (err) {
      errEl.textContent = err.message;
      errEl.style.display = 'block';
    }
  });
});

// ── PERFIL ──
route('/perfil', async (app) => {
  if (!state.user) { navigate('/login'); return; }

  let activeTab = 'pets';
  await renderProfile();

  async function renderProfile() {
    const [myPets, appointments, services] = await Promise.all([
      api('/my-pets'),
      api('/appointments'),
      api('/services'),
    ]);

    app.innerHTML = `
      <div class="profile-page">
        <div class="profile-header">
          <div class="profile-avatar">👤</div>
          <div class="profile-info">
            <h2>${state.user.name || 'Usuário'}</h2>
            <p>${state.user.email}</p>
          </div>
        </div>

        <div class="tabs">
          <button class="tab-btn ${activeTab === 'pets' ? 'active' : ''}" data-tab="pets">🐾 Meus Pets</button>
          <button class="tab-btn ${activeTab === 'appointments' ? 'active' : ''}" data-tab="appointments">📅 Agendamentos</button>
        </div>

        <div id="tab-content"></div>
      </div>
    `;

    const tabContent = app.querySelector('#tab-content');

    function renderTab() {
      if (activeTab === 'pets') {
        tabContent.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
            <h3>Meus Pets Cadastrados</h3>
            <button id="add-pet-btn" class="btn btn-primary btn-sm">+ Cadastrar Pet</button>
          </div>
          <div class="grid" style="gap:1rem">
            ${myPets.length === 0 ? '<div class="empty-state"><div class="emoji">🐾</div><p>Nenhum pet cadastrado</p><p style="font-size:0.9rem;margin-top:0.5rem">Cadastre seu pet para agendar serviços</p></div>' : myPets.map(p => `
              <div class="my-pet-card" data-pet-id="${p.id}">
                <div class="my-pet-avatar">${speciesEmoji[p.species] || '🐾'}</div>
                <div class="my-pet-info">
                  <h3>${p.name}</h3>
                  <p>${speciesLabel[p.species] || p.species}${p.breed ? ' · ' + p.breed : ''}${p.age != null ? ' · ' + p.age + ' ano(s)' : ''}</p>
                  ${p.notes ? `<p style="font-size:0.82rem">${p.notes}</p>` : ''}
                </div>
                <div class="my-pet-actions">
                  <button class="btn btn-accent btn-sm book-svc-btn" data-pet-id="${p.id}" data-pet-name="${p.name}">📅 Agendar</button>
                  <button class="btn btn-danger btn-sm del-pet-btn" data-pet-id="${p.id}">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        app.querySelector('#add-pet-btn')?.addEventListener('click', () => showPetModal());

        app.querySelectorAll('.del-pet-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            if (!confirm('Tem certeza que quer remover este pet?')) return;
            await api(`/my-pets/${btn.dataset.petId}`, { method: 'DELETE' });
            showToast('Pet removido');
            renderProfile();
          });
        });

        app.querySelectorAll('.book-svc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            showAppointmentModal(btn.dataset.petId, btn.dataset.petName, services);
          });
        });

      } else {
        tabContent.innerHTML = `
          <h3 style="margin-bottom:1.5rem">Meus Agendamentos</h3>
          <div class="grid" style="gap:1rem">
            ${appointments.length === 0 ? '<div class="empty-state"><div class="emoji">📅</div><p>Nenhum agendamento</p></div>' : appointments.map(a => `
              <div class="appointment-card">
                <div class="appointment-info">
                  <h3>${a.service?.name || 'Serviço'}</h3>
                  <p>🐾 ${a.myPet?.name || '-'} · 📅 ${new Date(a.dateTime).toLocaleDateString('pt-BR')} às ${new Date(a.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                  ${a.notes ? `<p>${a.notes}</p>` : ''}
                </div>
                <span class="status-badge status-${a.status}">${a.status}</span>
                ${a.status === 'pendente' ? `<button class="btn btn-danger btn-sm cancel-apt-btn" data-apt-id="${a.id}">Cancelar</button>` : ''}
              </div>
            `).join('')}
          </div>
        `;

        app.querySelectorAll('.cancel-apt-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            await api(`/appointments/${btn.dataset.aptId}`, { method: 'DELETE' });
            showToast('Agendamento cancelado');
            renderProfile();
          });
        });
      }
    }

    renderTab();

    app.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        app.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTab));
        renderTab();
      });
    });
  }

  function showPetModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>🐾 Cadastrar Pet</h2>
          <button class="icon-btn modal-close">✕</button>
        </div>
        <form id="pet-form">
          <div class="form-group">
            <label>Nome</label>
            <input type="text" name="name" required placeholder="Nome do pet" />
          </div>
          <div class="form-group">
            <label>Espécie</label>
            <select name="species" required>
              <option value="">Selecione</option>
              <option value="cachorro">🐕 Cachorro</option>
              <option value="gato">🐈 Gato</option>
              <option value="peixe">🐠 Peixe</option>
              <option value="ave">🦜 Ave</option>
              <option value="roedor">🐹 Roedor</option>
            </select>
          </div>
          <div class="form-group">
            <label>Raça (opcional)</label>
            <input type="text" name="breed" placeholder="Ex: Labrador" />
          </div>
          <div class="form-group">
            <label>Idade (anos)</label>
            <input type="number" name="age" min="0" placeholder="Ex: 3" />
          </div>
          <div class="form-group">
            <label>Peso (kg, opcional)</label>
            <input type="number" name="weight" min="0" step="0.1" placeholder="Ex: 12.5" />
          </div>
          <div class="form-group">
            <label>Observações médicas (opcional)</label>
            <textarea name="notes" placeholder="Alergias, medicamentos, etc."></textarea>
          </div>
          <div id="pet-form-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary btn-block">Cadastrar</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#pet-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const errEl = overlay.querySelector('#pet-form-error');
      errEl.style.display = 'none';
      try {
        const body = {
          name: form.name.value,
          species: form.species.value,
          breed: form.breed.value || undefined,
          age: form.age.value ? Number(form.age.value) : undefined,
          weight: form.weight.value ? Number(form.weight.value) : undefined,
          notes: form.notes.value || undefined,
        };
        await api('/my-pets', { method: 'POST', body: JSON.stringify(body) });
        overlay.remove();
        showToast('Pet cadastrado com sucesso!');
        renderProfile();
      } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    });
  }

  function showAppointmentModal(petId, petName, services) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>📅 Agendar Serviço</h2>
          <button class="icon-btn modal-close">✕</button>
        </div>
        <p style="margin-bottom:1rem;color:var(--text-muted)">Para: <strong>${petName}</strong></p>
        <form id="apt-form">
          <div class="form-group">
            <label>Serviço</label>
            <select name="serviceId" required>
              <option value="">Selecione</option>
              ${services.map(s => `<option value="${s.id}">${serviceIcon[s.serviceType] || '💈'} ${s.name} — R$ ${Number(s.price).toFixed(2)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Data e Hora</label>
            <input type="datetime-local" name="dateTime" required />
          </div>
          <div class="form-group">
            <label>Observações (opcional)</label>
            <textarea name="notes" placeholder="Informações adicionais"></textarea>
          </div>
          <div id="apt-form-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-accent btn-block">Agendar</button>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.modal-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelector('#apt-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const errEl = overlay.querySelector('#apt-form-error');
      errEl.style.display = 'none';
      try {
        await api('/appointments', {
          method: 'POST',
          body: JSON.stringify({
            serviceId: Number(form.serviceId.value),
            myPetId: Number(petId),
            dateTime: form.dateTime.value,
            notes: form.notes.value || undefined,
          }),
        });
        overlay.remove();
        showToast('Serviço agendado com sucesso!');
        renderProfile();
      } catch (err) {
        errEl.textContent = err.message;
        errEl.style.display = 'block';
      }
    });
  }
});

// ══════════════════════════════════════════════════════════
//  CARD RENDERERS
// ══════════════════════════════════════════════════════════

function petCard(pet) {
  return `
    <div class="card" data-href="#/animais/${pet.id}">
      <div class="card-img-wrapper">
        ${pet.imageUrl ? `<img class="card-img" src="${pet.imageUrl}" alt="${pet.name}" loading="lazy" />` : `<div class="card-img" style="background:var(--primary-bg);display:flex;align-items:center;justify-content:center;font-size:3rem">${speciesEmoji[pet.species] || '🐾'}</div>`}
        <span class="card-badge">${speciesLabel[pet.species] || pet.species}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${pet.name}</div>
        <div class="card-text">${pet.breed || ''} ${pet.age != null ? '· ' + pet.age + ' ano(s)' : ''}</div>
        <div class="card-meta">
          <span class="card-price">R$ ${Number(pet.price).toFixed(2)}</span>
          <button class="btn btn-primary btn-sm add-cart-btn" data-id="${pet.id}" data-name="${pet.name}" data-price="${pet.price}" data-type="pet">🛒</button>
        </div>
      </div>
    </div>
  `;
}

function productCard(product) {
  return `
    <div class="card">
      <div class="card-img-wrapper">
        ${product.imageUrl ? `<img class="card-img" src="${product.imageUrl}" alt="${product.name}" loading="lazy" />` : `<div class="card-img" style="background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:3rem">📦</div>`}
        ${product.category ? `<span class="card-badge">${product.category.name}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-title">${product.name}</div>
        <div class="card-text">${product.description || ''}</div>
        <div class="card-meta">
          <span class="card-price">R$ ${Number(product.price).toFixed(2)}</span>
          <button class="btn btn-primary btn-sm add-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-type="product">🛒</button>
        </div>
      </div>
    </div>
  `;
}

function serviceCard(svc) {
  return `
    <div class="service-card">
      <div class="service-icon">${serviceIcon[svc.serviceType] || '💈'}</div>
      <h3>${svc.name}</h3>
      <p>${svc.description || ''}</p>
      <div class="service-price">R$ ${Number(svc.price).toFixed(2)}</div>
      <div class="service-duration">${svc.duration >= 1440 ? Math.floor(svc.duration / 1440) + ' dia(s)' : svc.duration + ' minutos'}</div>
      <button class="btn btn-accent btn-sm service-book-btn" style="margin-top:1rem">📅 Agendar</button>
    </div>
  `;
}

function bindCards(container) {
  // Navigate on card click
  container.querySelectorAll('.card[data-href]').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-cart-btn')) return;
      window.location.hash = card.dataset.href;
    });
  });

  // Add to cart buttons
  container.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: btn.dataset.price,
        type: btn.dataset.type,
      });
    });
  });

  // Service book buttons
  container.querySelectorAll('.service-book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.user) { navigate('/login'); return; }
      navigate('/perfil');
    });
  });
}

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════

// Theme
const themeBtn = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  if (themeBtn) themeBtn.textContent = '☀️';
}
themeBtn?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// Mobile nav toggle
document.getElementById('nav-toggle')?.addEventListener('click', () => {
  document.getElementById('nav-links')?.classList.toggle('open');
});

// Cart drawer
document.getElementById('cart-toggle')?.addEventListener('click', () => {
  document.getElementById('cart-drawer')?.classList.remove('hidden');
});
document.getElementById('cart-close')?.addEventListener('click', () => {
  document.getElementById('cart-drawer')?.classList.add('hidden');
});
document.getElementById('cart-overlay')?.addEventListener('click', () => {
  document.getElementById('cart-drawer')?.classList.add('hidden');
});
document.getElementById('cart-clear')?.addEventListener('click', clearCart);
document.getElementById('cart-checkout')?.addEventListener('click', () => {
  if (state.cart.length === 0) { showToast('Carrinho vazio!'); return; }
  if (!state.user) { navigate('/login'); document.getElementById('cart-drawer')?.classList.add('hidden'); return; }
  showToast('✅ Pedido realizado com sucesso!');
  clearCart();
  document.getElementById('cart-drawer')?.classList.add('hidden');
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 10);
});

// Dynamic route handler for /animais/:id
const originalHandleRoute = handleRoute;

async function enhancedHandleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts[0] === 'animais' && parts[1]) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Carregando...</p></div>';
    try {
      const pet = await api(`/pets/${parts[1]}`);
      app.innerHTML = `
        <div class="detail-page">
          <a href="#/animais" class="btn btn-ghost btn-sm" style="margin-bottom:1.5rem">← Voltar</a>
          <div class="detail-grid">
            ${pet.imageUrl ? `<img class="detail-img" src="${pet.imageUrl}" alt="${pet.name}" />` : `<div class="detail-img" style="background:var(--primary-bg);display:flex;align-items:center;justify-content:center;font-size:5rem">${speciesEmoji[pet.species] || '🐾'}</div>`}
            <div class="detail-info">
              <h1>${pet.name}</h1>
              <div class="detail-meta">
                <span class="detail-meta-item">${speciesEmoji[pet.species] || '🐾'} ${speciesLabel[pet.species] || pet.species}</span>
                ${pet.breed ? `<span class="detail-meta-item">Raça: ${pet.breed}</span>` : ''}
                ${pet.age != null ? `<span class="detail-meta-item">Idade: ${pet.age} ano(s)</span>` : ''}
                <span class="detail-meta-item status-badge status-${pet.status === 'disponivel' ? 'confirmado' : 'cancelado'}">${pet.status}</span>
              </div>
              <div class="price">R$ ${Number(pet.price).toFixed(2)}</div>
              <p class="description">${pet.description || 'Sem descrição disponível.'}</p>
              <button class="btn btn-primary add-cart-btn" data-id="${pet.id}" data-name="${pet.name}" data-price="${pet.price}" data-type="pet">🛒 Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      `;
      bindCards(app);
    } catch (err) {
      app.innerHTML = `<div class="error-msg">⚠️ ${err.message}</div>`;
    }
    return;
  }

  await originalHandleRoute();
}

// Boot
updateCartUI();
updateAuthNav();
window.addEventListener('hashchange', enhancedHandleRoute);
enhancedHandleRoute();
