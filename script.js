// Product database
const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 349,
        emoji: '🎧',
        description: 'Crystal-clear audio with active noise cancellation'
    },
    {
        id: 2,
        name: 'Elite Smart Watch',
        price: 599,
        emoji: '⌚',
        description: 'Track your health with premium design'
    },
    {
        id: 3,
        name: 'Flagship Pro Phone',
        price: 1299,
        emoji: '📱',
        description: 'Ultimate performance in your pocket'
    },
    {
        id: 4,
        name: 'Premium Speakers',
        price: 449,
        emoji: '🔊',
        description: 'Immersive sound for your space'
    },
    {
        id: 5,
        name: 'Wireless Earbuds',
        price: 249,
        emoji: '🎵',
        description: 'Compact design, powerful sound'
    },
    {
        id: 6,
        name: 'Smart Tablet',
        price: 799,
        emoji: '📲',
        description: 'Work and play on the go'
    }
];

// Cart state
let cart = [];

// Render products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-footer">
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div class="cart-item-price">$${item.price} × ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    totalPrice.textContent = `$${total}`;
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
}

// Close cart when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('cartModal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            toggleCart();
        }
    });
});

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert(`Thank you for your purchase! Total: $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`);
    cart = [];
    updateCart();
    toggleCart();
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
renderProducts();
updateCart();