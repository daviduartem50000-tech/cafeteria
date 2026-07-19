// CONFIGURAÇÃO DO BANCO DE DADOS (mesma chave usada pelo site)
const STORAGE_KEY = 'aroma-arte-menu-items';

// ELEMENTOS
const itemForm = document.getElementById('item-form');
const nameInput = document.getElementById('item-name');
const descInput = document.getElementById('item-desc');
const priceInput = document.getElementById('item-price');
const categoryInput = document.getElementById('item-category');
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

// GERAR ID ÚNICO PARA CADA ITEM
function generateId() {
    return 'item-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

// CARREGAR ITENS DO BANCO DE DADOS
async function loadItems() {
    try {
        const result = await window.storage.get(STORAGE_KEY, true);
        menuItems = result && result.value ? JSON.parse(result.value) : [];
    } catch (e) {
        menuItems = [];
    }
    renderItems();
    renderStats();
}

// SALVAR NO BANCO DE DADOS
async function saveItems() {
    try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(menuItems), true);
        return true;
    } catch (e) {
        return false;
    }
}

// RENDERIZAR ESTATÍSTICAS
function renderStats() {
    statTotal.innerText = menuItems.length;
    statBebidas.innerText = menuItems.filter(i => i.category === 'bebidas').length;
    statComidas.innerText = menuItems.filter(i => i.category === 'comidas').length;
}

// RENDERIZAR LISTA DE ITENS
function renderItems() {
    const filtered = currentFilter === 'todos'
        ? menuItems
        : menuItems.filter(i => i.category === currentFilter);

    itemsListEl.innerHTML = '';

    if (filtered.length === 0) {
        itemsListEl.innerHTML = '<p class="items-list-empty">Nenhum item cadastrado ainda. Use o formulário ao lado para adicionar o primeiro.</p>';
        return;
    }

    // Itens mais recentes primeiro
    [...filtered].reverse().forEach(item => {
        const row = document.createElement('div');
        row.className = 'admin-item-row';
        row.innerHTML = `
            <img class="admin-item-thumb" src="${item.image || DEFAULT_IMAGE}" alt="${item.name}" onerror="this.src='${DEFAULT_IMAGE}'">
            <div class="admin-item-info">
                <h4>${item.name}</h4>
                <p>${item.description || 'Sem descrição'}</p>
            </div>
            <span class="admin-item-category ${item.category}">${item.category === 'bebidas' ? 'Bebida' : 'Comida'}</span>
            <span class="admin-item-price">${formatPrice(item.price)}</span>
            <button class="admin-delete-btn" data-id="${item.id}" title="Excluir item">
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

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!name || isNaN(price) || price < 0) {
        feedbackEl.textContent = 'Preencha o nome e um preço válido.';
        feedbackEl.className = 'form-feedback error';
        return;
    }

    const newItem = {
        id: generateId(),
        name,
        description: descInput.value.trim(),
        price,
        category: categoryInput.value,
        image: imageInput.value.trim() || DEFAULT_IMAGE
    };

    menuItems.push(newItem);
    const saved = await saveItems();

    if (saved) {
        feedbackEl.textContent = `"${name}" cadastrado com sucesso!`;
        feedbackEl.className = 'form-feedback success';
        itemForm.reset();
        renderItems();
        renderStats();
    } else {
        menuItems.pop();
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
    const item = menuItems.find(i => i.id === id);
    if (!item) return;

    const confirmDelete = confirm(`Tem certeza que deseja excluir "${item.name}"? Essa ação não pode ser desfeita.`);
    if (!confirmDelete) return;

    const backup = [...menuItems];
    menuItems = menuItems.filter(i => i.id !== id);

    const saved = await saveItems();
    if (!saved) {
        menuItems = backup;
        alert('Não foi possível excluir o item. Tente novamente.');
    }

    renderItems();
    renderStats();
});

// INICIALIZAÇÃO
loadItems();
