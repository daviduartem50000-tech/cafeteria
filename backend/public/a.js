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

let cart = [];
let filtroAtual = 'bebidas';

// ABRIR/FECHAR CARRINHO
const toggleCart = () => {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
};

cartIcon.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);

/* =========================================================
   BUSCAR CARDÁPIO NA API (fetch) E MONTAR OS CARDS
   ========================================================= */
async function carregarCardapio() {
    try {
        const [resBebidas, resComidas] = await Promise.all([
            fetch('/api/bebidas'),
            fetch('/api/comidas')
        ]);

        if (!resBebidas.ok || !resComidas.ok) {
            throw new Error('Falha ao buscar dados da API');
        }

        const bebidas = await resBebidas.json();
        const comidas = await resComidas.json();

        menuGrid.innerHTML = '';
        renderizarCards(bebidas, 'bebidas');
        renderizarCards(comidas, 'comidas');
        aplicarFiltro(filtroAtual);
    } catch (err) {
        console.error('Erro ao carregar cardápio:', err);
        menuGrid.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Não foi possível carregar o cardápio. Verifique se a API está online.</p>';
    }
}

function renderizarCards(itens, categoria) {
    itens.forEach(item => {
        const precoNum = parseFloat(item.preco);

        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-category', categoria);

        card.innerHTML = `
            <div class="card-img">
                <img src="${item.imagem || 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=500&q=60'}" alt="${item.nome}">
            </div>
            <div class="card-body">
                <h3>${item.nome}</h3>
                <p>${item.descricao || ''}</p>
                <div class="card-footer">
                    <span class="price">R$ ${precoNum.toFixed(2).replace('.', ',')}</span>
                    <button class="add-cart" data-name="${item.nome}" data-price="${precoNum}">+</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

function aplicarFiltro(filtro) {
    filtroAtual = filtro;
    document.querySelectorAll('.menu-card').forEach(card => {
        if (card.getAttribute('data-category') === filtro) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// FILTRO DO CARDÁPIO (Bebidas / Comidas)
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        aplicarFiltro(btn.getAttribute('data-filter'));
    });
});

// ADICIONAR AO CARRINHO
// (delegação de evento: os botões .add-cart são criados dinamicamente pelo fetch,
// então o listener fica no container fixo `menu-grid`, não em cada botão)
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

// REMOVER ITEM DO CARRINHO (também por delegação de evento)
cartItemsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-btn');
    if (!btn) return;
    const name = btn.getAttribute('data-name');
    cart = cart.filter(item => item.name !== name);
    renderCart();
});

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
                    <small>${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</small>
                </div>
                <button class="remove-btn" data-name="${item.name}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotal.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartCount.innerText = count;
}

// FINALIZAR PEDIDO
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
carregarCardapio();
