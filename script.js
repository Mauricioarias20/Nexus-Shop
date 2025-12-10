const products = [
  {id:1,name:'Premium Wireless Headphones',price:349,category:'Audio',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',desc:'LDAC, hybrid ANC, 45h battery life.', specs:[
    'Hybrid ANC (up to 40dB)',
    '45h battery, USB-C fast charge',
    'LDAC / AAC / SBC codecs',
    'Memory foam earcups'
  ]},
  {id:2,name:'Elite Smart Watch',price:599,category:'Watch',image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',desc:'ECG, SpO2, 10-day battery, AMOLED.', specs:[
    'ECG & SpO2 sensors',
    '1.8" AMOLED with AOD',
    '10-day battery, 5ATM',
    'GPS + NFC payments'
  ]},
  {id:3,name:'Flagship Pro Phone',price:1299,category:'Phone',image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',desc:'Snapdragon 8 Gen, 120Hz LTPO, 1TB.', specs:[
    'Snapdragon 8 Gen CPU',
    '120Hz LTPO AMOLED',
    '1TB storage, 16GB RAM',
    '5000mAh + 65W fast charge'
  ]},
  {id:4,name:'Premium Speakers',price:449,category:'Audio',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',desc:'Room-filling sound, Wi-Fi multiroom.', specs:[
    'Wi-Fi multiroom ready',
    'Hi-Res + Bluetooth',
    'Dual sub passive radiators',
    'Voice assistant ready'
  ]},
  {id:5,name:'Wireless Earbuds',price:249,category:'Audio',image:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',desc:'Adaptive ANC, wireless charging.', specs:[
    'Adaptive ANC',
    'Qi wireless charging',
    'IPX4 sweat resistant',
    'Spatial audio ready'
  ]},
  {id:6,name:'Smart Tablet',price:799,category:'Laptop',image:'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',desc:'12.9" mini-LED, pen + keyboard.', specs:[
    '12.9" mini-LED display',
    'Pen + keyboard support',
    'Wi-Fi 6E + 5G',
    'All-day battery'
  ]},
  {id:7,name:'4K Action Cam',price:549,category:'Camera',image:'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop',desc:'5.3K60, horizon lock, 10-bit color.', specs:[
    '5.3K60 / 4K120',
    'Horizon lock + HyperSmooth',
    '10-bit color depth',
    'Waterproof 10m'
  ]},
  {id:8,name:'Gaming Mouse Pro',price:159,category:'Accessories',image:'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',desc:'58g, 8K polling, optical switches.', specs:[
    '58g ultra-light',
    '8000Hz polling rate',
    'Optical switches',
    'PTFE feet + paracord'
  ]},
];

const reviews = [
  {name:'Sophie L.', rating:5, text:'Lightning-fast shipping and curated selection. Love the ANC picks.'},
  {name:'Alex P.',   rating:4, text:'Checkout was smooth, packaging was premium. Will buy again.'},
  {name:'Mia R.',    rating:5, text:'Support answered in minutes. Tablet + pen combo is perfect.'},
  {name:'Daniel K.', rating:5, text:'Great warranties and the noise-canceling lineup is top tier.'},
  {name:'Priya S.',  rating:4, text:'Prices are fair for flagship gear. Delivery tracking was accurate.'},
  {name:'Jon C.',    rating:5, text:'Love the minimal UI and fast cart experience.'}
];

let cart = [];
let favorites = [];
let user = null;
let users = [];
let appliedCoupon = null;

const filterState = {
  search: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: 'featured'
};

const coupons = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off' },
  FREESHIP: { type: 'shipping', value: 100, label: 'Free shipping' }
};

function saveState() {
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
  localStorage.setItem('nexus_favorites', JSON.stringify(favorites));
  localStorage.setItem('nexus_user', JSON.stringify(user));
  localStorage.setItem('nexus_users', JSON.stringify(users));
  localStorage.setItem('nexus_coupon', JSON.stringify(appliedCoupon));
}

function loadState() {
  cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]');
  favorites = JSON.parse(localStorage.getItem('nexus_favorites') || '[]');
  user = JSON.parse(localStorage.getItem('nexus_user') || 'null');
  users = JSON.parse(localStorage.getItem('nexus_users') || '[]');
  appliedCoupon = JSON.parse(localStorage.getItem('nexus_coupon') || 'null');
}

function render(list = products) {
  if (!list.length) {
    document.getElementById('productGrid').innerHTML = `<div style="text-align:center; grid-column:1/-1; opacity:0.8;">No products found.</div>`;
    return;
  }
  document.getElementById('productGrid').innerHTML = list.map((p, idx) => {
    const isFav = favorites.some(f => f.id === p.id);
    return `
    <div class="product-card" style="animation-delay:${idx * 0.05}s">
      <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${p.id})" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}">${isFav ? '❤️' : '🤍'}</button>
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="footer">
        <div class="price">$${p.price}</div>
        <div class="btn-group">
          <button onclick="openProduct(${p.id})">Details</button>
          <button onclick="addCart(${p.id}, event); event.stopPropagation();">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function applyFilters() {
  let list = [...products];
  const term = filterState.search.trim().toLowerCase();

  if (term) {
    list = list.filter(p => {
      const haystack = [
        p.name,
        p.desc,
        p.category,
        ...(p.specs || [])
      ].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }

  if (filterState.category) {
    list = list.filter(p => p.category === filterState.category);
  }

  const min = filterState.minPrice !== '' ? Number(filterState.minPrice) : null;
  const max = filterState.maxPrice !== '' ? Number(filterState.maxPrice) : null;
  if (min !== null && !Number.isNaN(min)) list = list.filter(p => p.price >= min);
  if (max !== null && !Number.isNaN(max)) list = list.filter(p => p.price <= max);

  switch (filterState.sort) {
    case 'price-asc':
      list.sort((a,b)=>a.price-b.price);
      break;
    case 'price-desc':
      list.sort((a,b)=>b.price-a.price);
      break;
    case 'name-asc':
      list.sort((a,b)=>a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  render(list);
}

function filterProducts(term) {
  filterState.search = term;
  applyFilters();
}

function addCart(id, event) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++; else cart.push({...p, qty:1});
  
  // Animate card
  if (event) {
    const card = event.target?.closest('.product-card');
    if (card) {
      card.classList.add('added-to-cart');
      setTimeout(() => card.classList.remove('added-to-cart'), 600);
    }
  }
  
  // Animate cart count
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.classList.add('updated');
    setTimeout(() => cartCount.classList.remove('updated'), 500);
  }
  
  updateCart();
  toast(`${p.name} added!`);
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCart();
}

function updateCart() {
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  const mobileCartCount = document.getElementById('mobileCartCount');
  if (mobileCartCount) mobileCartCount.textContent = count;
  document.getElementById('total').textContent = total.toFixed(2);
  document.getElementById('cartItems').innerHTML = cart.length ? cart.map((i, idx) => `
    <div class="cart-item" style="animation-delay:${idx * 0.1}s">
      <div class="cart-item-info">
        <img src="${i.image || 'https://via.placeholder.com/60'}" alt="${i.name}" class="cart-item-image">
        <div>${i.name}</div>
      </div>
      <div class="cart-actions">
        <button onclick="changeQty(${i.id}, -1)">-</button>
        <span>x${i.qty}</span>
        <button onclick="changeQty(${i.id}, 1)">+</button>
        <span class="line-total">$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    </div>
  `).join('') : 'Empty cart';
  saveState();
}

function toggleCart() { document.getElementById('cartModal').classList.toggle('active'); }
function toggleFavorites() { 
  const modal = document.getElementById('favoritesModal');
  modal.classList.toggle('active');
  if (modal.classList.contains('active')) updateFavorites();
}
function toggleFavorite(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const index = favorites.findIndex(f => f.id === id);
  if (index >= 0) {
    favorites.splice(index, 1);
    toast(`${p.name} removed from favorites`);
  } else {
    favorites.push({...p});
    toast(`${p.name} added to favorites`);
    
    // Animate favorites count
    const favCount = document.getElementById('favoritesCount');
    if (favCount) {
      favCount.classList.add('updated');
      setTimeout(() => favCount.classList.remove('updated'), 500);
    }
  }
  updateFavorites();
  const filtered = applyFilters();
  render(filtered);
  saveState();
}
function updateFavorites() {
  const count = favorites.length;
  document.getElementById('favoritesCount').textContent = count;
  const mobileFavCount = document.getElementById('mobileFavoritesCount');
  if (mobileFavCount) mobileFavCount.textContent = count;
  const itemsEl = document.getElementById('favoritesItems');
  const emptyEl = document.getElementById('favoritesEmpty');
  if (!favorites.length) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'block';
  } else {
    emptyEl.style.display = 'none';
    itemsEl.innerHTML = favorites.map((f, idx) => `
      <div class="favorite-item" style="animation-delay:${idx * 0.1}s">
        <div class="favorite-info">
          <img src="${f.image || 'https://via.placeholder.com/80'}" alt="${f.name}" class="favorite-image">
          <div>
            <h4>${f.name}</h4>
            <p class="favorite-price">$${f.price}</p>
          </div>
        </div>
        <div class="favorite-actions">
          <button onclick="addCart(${f.id}, event); toast('Added to cart!')">Add to Cart</button>
          <button onclick="removeFavoriteWithAnim(${f.id})" class="remove-fav">Remove</button>
        </div>
      </div>
    `).join('');
  }
  saveState();
}
function removeFavoriteWithAnim(id) {
  const items = document.querySelectorAll('.favorite-item');
  items.forEach(item => {
    const btn = item.querySelector(`button[onclick*="removeFavoriteWithAnim(${id})"]`);
    if (btn) {
      item.classList.add('removed');
      setTimeout(() => {
        toggleFavorite(id);
      }, 300);
      return;
    }
  });
}
function toggleUser() { document.getElementById('userDrop').classList.toggle('active'); }
function toggleMobileMenu() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('mobileOverlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}
function closeMobileMenu() {
  const sidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('mobileOverlay');
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('nexus_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  toast('Theme updated');
}

function openAuth(type) {
  toggleUser();
  const modal = document.getElementById('authModal');
  const title = document.getElementById('authTitle');
  const form = document.getElementById('authForm');

  if(type === 'login') {
    title.innerHTML = 'Login <span onclick="closeAuth()">×</span>';
    form.innerHTML = `
      <input id="email" placeholder="Email">
      <input id="pass" type="password" placeholder="Password">
      <button onclick="login()">Login</button>
      <p style="text-align:center">No account? <a onclick="openAuth('register')" style="cursor:pointer;color:#B8860B">Register</a></p>
    `;
  } else {
    title.innerHTML = 'Register <span onclick="closeAuth()">×</span>';
    form.innerHTML = `
      <input id="name" placeholder="Name">
      <input id="email" placeholder="Email">
      <input id="pass" type="password" placeholder="Password">
      <button onclick="register()">Create Account</button>
      <p style="text-align:center">Have an account? <a onclick="openAuth('login')" style="cursor:pointer;color:#B8860B">Login</a></p>
    `;
  }
  modal.classList.add('active');
}

function closeAuth() { document.getElementById('authModal').classList.remove('active'); }

function validEmail(email) { return /\S+@\S+\.\S+/.test(email); }

function login() {
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('pass').value;
  const found = users.find(u => u.email === email && u.pass === pass);
  if(found) {
    user = found;
    updateUser();
    closeAuth();
    toast('Welcome back!');
  } else toast('Invalid credentials');
}

function register() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('pass').value;
  if(!name || !email || !pass) return toast('Fill all fields');
  if(!validEmail(email)) return toast('Invalid email');
  if(pass.length < 6) return toast('Password too short');
  if(users.find(u => u.email === email)) return toast('Email exists');
  user = {id:Date.now(), name, email, pass};
  users.push(user);
  updateUser();
  closeAuth();
  toast('Account created!');
}

function updateUser() {
  if(user) {
    document.getElementById('loggedOut').style.display = 'none';
    document.getElementById('loggedIn').style.display = 'block';
    document.getElementById('greeting').textContent = 'Hello, ' + user.name + '!';
  } else {
    document.getElementById('loggedOut').style.display = 'block';
    document.getElementById('loggedIn').style.display = 'none';
  }
  saveState();
}

function logout() {
  user = null;
  updateUser();
  toggleUser();
  toast('Logged out');
}

function startCheckout() {
  if(!cart.length) return toast('Cart is empty');
  toggleCart();
  const modal = document.getElementById('checkoutModal');
  const form = document.getElementById('checkoutForm');
  form.innerHTML = `
    <input id="chName" placeholder="Full Name" value="${user?.name || ''}">
    <input id="chEmail" placeholder="Email" value="${user?.email || ''}">
    <input id="chAddress" placeholder="Address">
    <input id="chCity" placeholder="City">
    <input id="chZip" placeholder="ZIP">
    <div class="coupon-row">
      <input id="couponCode" placeholder="Coupon code" value="${appliedCoupon || ''}">
      <button type="button" onclick="applyCoupon()">Apply</button>
    </div>
    <div id="couponApplied" class="coupon-applied"></div>
    <div style="margin:20px 0" id="checkoutSummary">
      <div id="sumSubtotal">Subtotal: $0.00</div>
      <div id="sumShipping">Shipping: $0.00</div>
      <div id="sumTax">Tax: $0.00</div>
      <div id="sumDiscount" style="display:none;">Discount: -$0.00</div>
      <div class="total" id="sumTotal">Total: $0.00</div>
    </div>
    <button id="placeOrderBtn" onclick="completeOrder()">Place Order</button>
  `;
  modal.classList.add('active');
  renderCheckoutTotals();
}

function closeCheckout() { document.getElementById('checkoutModal').classList.remove('active'); }

function completeOrder() {
  const name = document.getElementById('chName').value.trim();
  const email = document.getElementById('chEmail').value.trim();
  if(!name || !email) return toast('Fill required fields');
  document.getElementById('checkoutForm').innerHTML = `
    <div style="text-align:center; padding:40px">
      <div style="font-size:4rem">✓</div>
      <h3>Order Confirmed!</h3>
      <p>Order #NX${Date.now().toString().slice(-6)}</p>
      <button onclick="closeCheckout(); cart=[]; updateCart();">Continue Shopping</button>
    </div>
  `;
  toast('Order placed!');
}

function calculateTotals() {
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const shippingBase = subtotal > 500 ? 0 : 29.99;
  let shipping = shippingBase;
  let discount = 0;
  if (appliedCoupon && coupons[appliedCoupon]) {
    const c = coupons[appliedCoupon];
    if (c.type === 'percent') discount = subtotal * (c.value/100);
    if (c.type === 'shipping') shipping = 0;
  }
  const taxedSubtotal = Math.max(subtotal - discount, 0);
  const tax = taxedSubtotal * 0.10;
  const total = taxedSubtotal + shipping + tax;
  return { subtotal, shipping, tax, discount, total };
}

function renderCheckoutTotals() {
  const { subtotal, shipping, tax, discount, total } = calculateTotals();
  const sumSubtotal = document.getElementById('sumSubtotal');
  const sumShipping = document.getElementById('sumShipping');
  const sumTax = document.getElementById('sumTax');
  const sumDiscount = document.getElementById('sumDiscount');
  const sumTotal = document.getElementById('sumTotal');
  const couponApplied = document.getElementById('couponApplied');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  if (!sumSubtotal) return;
  sumSubtotal.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  sumShipping.textContent = `Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}`;
  sumTax.textContent = `Tax: $${tax.toFixed(2)}`;
  if (discount > 0) {
    sumDiscount.style.display = 'block';
    sumDiscount.textContent = `Discount: -$${discount.toFixed(2)}`;
  } else {
    sumDiscount.style.display = 'none';
  }
  sumTotal.textContent = `Total: $${total.toFixed(2)}`;
  if (placeOrderBtn) placeOrderBtn.textContent = `Place Order - $${total.toFixed(2)}`;
  if (couponApplied) {
    couponApplied.textContent = appliedCoupon ? `Applied: ${appliedCoupon} (${coupons[appliedCoupon]?.label || ''})` : '';
  }
}

function applyCoupon() {
  const input = document.getElementById('couponCode');
  const code = (input?.value || '').trim().toUpperCase();
  if (!code) { appliedCoupon = null; saveState(); renderCheckoutTotals(); return; }
  if (!coupons[code]) return toast('Invalid coupon');
  appliedCoupon = code;
  saveState();
  renderCheckoutTotals();
  toast('Coupon applied');
}

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if(el) el.scrollIntoView({behavior:'smooth'});
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Product details modal
function openProduct(id) {
  const p = products.find(x => x.id === id);
  if(!p) return;
  const modal = document.getElementById('productModal');
  document.getElementById('productTitle').innerHTML = `${p.name} <span onclick="closeProduct()">×</span>`;
  const specsList = p.specs?.length ? `<ul class="specs">${p.specs.map(s=>`<li>${s}</li>`).join('')}</ul>` : '<p>No specs available.</p>';
  document.getElementById('productDetails').innerHTML = `
    <div class="product-modal-image">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <p style="margin-bottom:12px; opacity:0.9;">${p.desc}</p>
    ${specsList}
    <button onclick="addCart(${p.id}, event); closeProduct();">Add to Cart</button>
  `;
  modal.classList.add('active');
}

function closeProduct() {
  document.getElementById('productModal').classList.remove('active');
}

// Reviews
function starIcons(count) {
  return Array.from({length:5}, (_,i) => i < count ? '★' : '☆').join('');
}

function renderReviews() {
  const list = document.getElementById('reviewsList');
  if(!list) return;
  list.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-head">
        <div class="review-name">${r.name}</div>
        <div class="review-stars">${starIcons(r.rating)}</div>
      </div>
      <div class="review-body">${r.text}</div>
    </div>
  `).join('');

  const avg = reviews.reduce((s,r)=>s+r.rating,0) / reviews.length;
  document.getElementById('avgRating').textContent = avg.toFixed(1);
  document.getElementById('reviewCount').textContent = `${reviews.length} reviews`;
  document.getElementById('avgStars').innerHTML = starIcons(Math.round(avg)).split('').map(s=>`<span class="star">${s}</span>`).join('');
}

// Init
document.body.classList.add('loading');
loadState();
applyFilters();
renderReviews();
updateCart();
updateFavorites();
updateUser();
if(localStorage.getItem('nexus_theme') === 'dark') {
  document.body.classList.add('dark');
}

// Hide loader after 3 seconds
setTimeout(() => {
  const loader = document.getElementById('loaderScreen');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => {
      document.body.classList.remove('loading');
      loader.style.display = 'none';
    }, 800);
  }
}, 3000);

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('filterCategory');
const priceMinInput = document.getElementById('priceMin');
const priceMaxInput = document.getElementById('priceMax');
const sortSelect = document.getElementById('sortSelect');
const clearBtn = document.getElementById('clearFilters');

if (searchInput) searchInput.addEventListener('input', (e) => filterProducts(e.target.value));
const mobileSearchInput = document.getElementById('mobileSearchInput');
if (mobileSearchInput) mobileSearchInput.addEventListener('input', (e) => {
  filterProducts(e.target.value);
  if (searchInput) searchInput.value = e.target.value;
});
if (categorySelect) categorySelect.addEventListener('change', (e) => { filterState.category = e.target.value; applyFilters(); });
if (priceMinInput) priceMinInput.addEventListener('change', (e) => { filterState.minPrice = e.target.value; applyFilters(); });
if (priceMaxInput) priceMaxInput.addEventListener('change', (e) => { filterState.maxPrice = e.target.value; applyFilters(); });
if (sortSelect) sortSelect.addEventListener('change', (e) => { filterState.sort = e.target.value; applyFilters(); });
if (clearBtn) clearBtn.addEventListener('click', () => {
  filterState.search = '';
  filterState.category = '';
  filterState.minPrice = '';
  filterState.maxPrice = '';
  filterState.sort = 'featured';
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = '';
  if (priceMinInput) priceMinInput.value = '';
  if (priceMaxInput) priceMaxInput.value = '';
  if (sortSelect) sortSelect.value = 'featured';
  applyFilters();
});
