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

const STORAGE_KEY = 'aroma-arte-menu-items';

let cart = [];
let menuItems = [];
let currentFilter = 'bebidas';

// ITENS PADRÃO (usados apenas na primeira vez, para popular o banco de dados)
const seedItems = [
    { id: 'seed-1', name: 'Espresso Clássico', description: 'Intenso, encorpado e aromático.', price: 8.50, category: 'bebidas', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-2', name: 'Cappuccino Real', description: 'Leite cremoso com toque de cacau.', price: 14.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-3', name: 'Caramel Macchiato', description: 'Café gelado com caramelo e baunilha.', price: 16.50, category: 'bebidas', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-4', name: 'Chocolate Belga', description: 'Quente, cremoso e com raspas de chocolate.', price: 15.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-5', name: 'Suco de Laranja', description: '100% natural, espremido na hora.', price: 11.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-6', name: 'Croissant Francês', description: 'Manteiga pura e massa folhada.', price: 12.00, category: 'comidas', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-7', name: 'Red Velvet', description: 'Fatia fofinha com cream cheese.', price: 18.00, category: 'comidas', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-8', name: 'Pão de Queijo Mineiro', description: 'Porção com 5 unidades quentinhas.', price: 9.00, category: 'comidas', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-9', name: 'Quiche de Alho Poró', description: 'Massa leve e recheio cremoso.', price: 14.50, category: 'comidas', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=500&q=60' },
    { id: 'seed-10', name: 'Cheesecake Berry', description: 'Com calda artesanal de frutas vermelhas.', price: 19.50, category: 'comidas', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=500&q=60' }
];

const formatPrice = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;

// CARREGAR ITENS DO BANCO DE DADOS (compartilhado com o painel admin)
async function loadMenuItems() {
    try {
        const result = await window.storage.get(STORAGE_KEY, true);
        menuItems = result && result.value ? JSON.parse(result.value) : [];
    } catch (e) {
        menuItems = [];
    }

    if (!menuItems || menuItems.length === 0) {
        menuItems = seedItems;
        try {
            await window.storage.set(STORAGE_KEY, JSON.stringify(menuItems), true);
        } catch (e) {
            // segue mesmo se não conseguir salvar
        }
    }

    renderMenu();
}

// RENDERIZAR CARDÁPIO DINAMICAMENTE
function renderMenu() {
    if (!menuGrid) return;
    const filtered = menuItems.filter(item => item.category === currentFilter);
    menuGrid.innerHTML = '';

    if (filtered.length === 0) {
        menuGrid.innerHTML = '<p class="menu-empty">Nenhum item cadastrado nesta categoria ainda.</p>';
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-category', item.category);
        card.innerHTML = `
            <div class="card-img">
                <img src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=60'">
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <div class="card-footer">
                    <span class="price">${formatPrice(item.price)}</span>
                    <button class="add-cart" data-name="${item.name}" data-price="${item.price}">+</button>
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
