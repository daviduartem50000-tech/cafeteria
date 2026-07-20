// Painel administrativo — fala direto com a API do backend (server.js)
// Endpoints usados: GET/POST /api/bebidas, GET/POST /api/comidas, DELETE /api/:tipo/:id

// ELEMENTOS
const itemForm = document.getElementById('item-form');
const nameInput = document.getElementById('item-name');
const descInput = document.getElementById('item-desc');
const priceInput = document.getElementById('item-price');
const typeInput = document.getElementById('item-type');
const categoryInput = document.getElementById('item-category');
const sizeInput = document.getElementById('item-size');
const imageInput = document.getElementById('item-image');
const feedbackEl = document.getElementById('form-feedback');

const itemsListEl = document.getElementById('items-list');
const filterBtns = document.querySelectorAll('.list-filter-btn');

const statTotal = document.getElementById('stat-total');
const statBebidas = document.getElementById('stat-bebidas');
const statComidas = document.getElementById('stat-comidas');

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=200&q=60';

let menuItems = [];
let currentFilter = 'todos';

const formatPrice = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;

// CARREGAR ITENS DA API (bebidas + comidas)
async function loadItems() {
    try {
        const [bebidasRes, comidasRes] = await Promise.all([
            fetch('/api/bebidas'),
            fetch('/api/comidas')
        ]);

        if (!bebidasRes.ok || !comidasRes.ok) {
            throw new Error('Falha ao buscar itens da API');
        }

        const bebidas = await bebidasRes.json();
        const comidas = await comidasRes.json();

        // Marca cada item com o "tipo" (tabela de origem), usado pra montar
        // a URL de exclusão e pros filtros/estatísticas da tela.
        menuItems = [
            ...bebidas.map(item => ({ ...item, tipo: 'bebidas' })),
            ...comidas.map(item => ({ ...item, tipo: 'comidas' }))
        ];
    } catch (e) {
        console.error('Erro ao carregar itens:', e);
        menuItems = [];
        feedbackEl.textContent = 'Não foi possível carregar os itens do servidor.';
        feedbackEl.className = 'form-feedback error';
    }
    renderItems();
    renderStats();
}

// RENDERIZAR ESTATÍSTICAS
function renderStats() {
    statTotal.innerText = menuItems.length;
    statBebidas.innerText = menuItems.filter(i => i.tipo === 'bebidas').length;
    statComidas.innerText = menuItems.filter(i => i.tipo === 'comidas').length;
}

// RENDERIZAR LISTA DE ITENS
function renderItems() {
    const filtered = currentFilter === 'todos'
        ? menuItems
        : menuItems.filter(i => i.tipo === currentFilter);

    itemsListEl.innerHTML = '';

    if (filtered.length === 0) {
        itemsListEl.innerHTML = '<p class="items-list-empty">Nenhum item cadastrado ainda. Use o formulário ao lado para adicionar o primeiro.</p>';
        return;
    }

    // Itens mais recentes primeiro (a API já retorna ORDER BY id DESC,
    // mas mantemos a ordem por segurança)
    filtered.forEach(item => {
        const detalhes = [item.categoria, item.tamanho].filter(Boolean).join(' · ');

        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.innerHTML = `
            <img class="admin-item-thumb" src="${item.imagem || DEFAULT_IMAGE}" alt="${item.nome}" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="admin-item-info">
                <h4>${item.nome}</h4>
                <p>${item.descricao || 'Sem descrição'}${detalhes ? ' · ' + detalhes : ''}</p>
            </div>
            <span class="admin-item-category ${item.tipo}">${item.tipo === 'bebidas' ? 'Bebida' : 'Comida'}</span>
            <span class="admin-item-price">${formatPrice(item.preco)}</span>
            <button class="admin-delete-btn" data-id="${item.id}" data-tipo="${item.tipo}" title="Excluir item">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        itemsListEl.appendChild(row);
    });
}

// FILTROS DA LISTA
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderItems();
    });
});

// CADASTRAR NOVO ITEM
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = nameInput.value.trim();
    const preco = parseFloat(priceInput.value);
    const tipo = typeInput.value;

    if (!nome || isNaN(preco) || preco < 0) {
        feedbackEl.textContent = 'Preencha o nome e um preço válido.';
        feedbackEl.className = 'form-feedback error';
        return;
    }

    const payload = {
        nome,
        descricao: descInput.value.trim(),
        preco,
        categoria: categoryInput.value.trim(),
        tamanho: sizeInput.value.trim(),
        imagem: imageInput.value.trim() || DEFAULT_IMAGE
    };

    try {
        const res = await fetch(`/api/${tipo}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const erro = await res.json().catch(() => ({}));
            throw new Error(erro.erro || 'Erro ao cadastrar item');
        }

        feedbackEl.textContent = `"${nome}" cadastrado com sucesso!`;
        feedbackEl.className = 'form-feedback success';
        itemForm.reset();
        await loadItems();
    } catch (err) {
        console.error('Erro ao cadastrar item:', err);
        feedbackEl.textContent = 'Não foi possível salvar o item. Tente novamente.';
        feedbackEl.className = 'form-feedback error';
    }

    setTimeout(() => { feedbackEl.textContent = ''; feedbackEl.className = 'form-feedback'; }, 4000);
});

// EXCLUIR ITEM
itemsListEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.admin-delete-btn');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const tipo = btn.getAttribute('data-tipo');
    const item = menuItems.find(i => String(i.id) === String(id) && i.tipo === tipo);
    if (!item) return;

    const confirmDelete = confirm(`Tem certeza que deseja excluir "${item.nome}"? Essa ação não pode ser desfeita.`);
    if (!confirmDelete) return;

    try {
        const res = await fetch(`/api/${tipo}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir item');
        await loadItems();
    } catch (err) {
        console.error('Erro ao excluir item:', err);
        alert('Não foi possível excluir o item. Tente novamente.');
    }
});

// INICIALIZAÇÃO
loadItems();
