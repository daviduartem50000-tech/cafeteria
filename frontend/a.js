// VARIÁVEIS
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const tabBtns = document.querySelectorAll('.tab-btn');
const menuGrid = document.getElementById('menu-grid');

// API do backend — no Railway, o frontend (serviço "cafeteria") e o
// backend (serviço "radiant-acceptance") são deployments separados, com
// domínios diferentes. Por isso precisamos apontar explicitamente pra URL
// completa do backend, com o protocolo — sem "https://" o navegador trata
// como um caminho relativo do próprio frontend e a chamada nunca chega
// no backend.
const API_BASE = 'https://radiant-acceptance-production-d0da.up.railway.app';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60';

let cart = [];
let menuItems = [];
let currentFilter = 'bebidas';

const formatPrice = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;

// CARREGAR ITENS DA API (bebidas + comidas)
async function loadMenuItems() {
    try {
        const [bebidasRes, comidasRes] = await Promise.all([
            fetch(`${API_BASE}/api/bebidas`),
            fetch(`${API_BASE}/api/comidas`)
        ]);

        if (!bebidasRes.ok || !comidasRes.ok) {
            throw new Error('Falha ao buscar itens da API');
        }

        const bebidas = await bebidasRes.json();
        const comidas = await comidasRes.json();

        // Marca cada item com o "tipo" (bebidas/comidas), usado no filtro do cardápio
        menuItems = [
            ...bebidas.map(item => ({ ...item, tipo: 'bebidas' })),
            ...comidas.map(item => ({ ...item, tipo: 'comidas' }))
        ];
    } catch (e) {
        console.error('Erro ao carregar itens do cardápio:', e);
        menuItems = [];
    }

    renderMenu();
}

// RENDERIZAR CARDÁPIO DINAMICAMENTE
function renderMenu() {
    if (!menuGrid) return;
    const filtered = menuItems.filter(item => item.tipo === currentFilter);
    menuGrid.innerHTML = '';

    if (filtered.length === 0) {
        menuGrid.innerHTML = '<p class="menu-empty">Nenhum item cadastrado nesta categoria ainda.</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-category', item.tipo);
        card.innerHTML = `
            <div class="card-img">
                <img src="${item.imagem || DEFAULT_IMAGE}" alt="${item.nome}" onerror="this.src='${DEFAULT_IMAGE}'">
            </div>
            <div class="card-body">
                <h3>${item.nome}</h3>
                <p>${item.descricao || ''}</p>
                <div class="card-footer">
                    <span class="price">${formatPrice(item.preco)}</span>
                    <button class="add-cart" data-name="${item.nome}" data-price="${item.preco}">+</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// ABRIR/FECHAR CARRINHO
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};

cartIcon.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);

// FILTRO DO CARDÁPIO
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderMenu();
    });
});

// ADICIONAR AO CARRINHO (delegação de evento, pois os cards são criados dinamicamente)
menuGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-cart');
    if (!btn) return;

    const name = btn.getAttribute('data-name');
    const price = parseFloat(btn.getAttribute('data-price'));

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    renderCart();
    if (!cartSidebar.classList.contains('active')) toggleCart();
});

// REMOVER ITEM DO CARRINHO
const removeItem = (name) => {
    cart = cart.filter(item => item.name !== name);
    renderCart();
};

// ATUALIZAR INTERFACE DO CARRINHO
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <small>${item.quantity}x ${formatPrice(item.price)}</small>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.name}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotal.innerText = formatPrice(total);
    cartCount.innerText = count;
}

// FINALIZAR
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length > 0) {
        alert("Pedido enviado para a cozinha! Obrigado.");
        cart = [];
        renderCart();
        toggleCart();
    } else {
        alert("Seu carrinho está vazio!");
    }
});

// INICIALIZAÇÃO
loadMenuItems();
