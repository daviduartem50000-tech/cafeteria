// VARIÁVEIS
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');

let cart = [];

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
        const filter = btn.getAttribute('data-filter');

        menuCards.forEach(card => {
            if (card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ADICIONAR AO CARRINHO
document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = parseFloat(btn.getAttribute('data-price'));
        
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        
        renderCart();
        if(!cartSidebar.classList.contains('active')) toggleCart();
    });
});

// REMOVER ITEM
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
                    <small>${item.quantity}x R$ ${item.price.toFixed(2)}</small>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.name}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotal.innerText = `R$ ${total.toFixed(2)}`;
    cartCount.innerText = count;
}

// FINALIZAR
document.getElementById('checkout-btn').addEventListener('click', () => {
    if(cart.length > 0) {
        alert("Pedido enviado para a cozinha! Obrigado.");
        cart = [];
        renderCart();
        toggleCart();
    } else {
        alert("Seu carrinho está vazio!");
    }
});