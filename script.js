const products = [
  {id:1,name:'Premium Wireless Headphones',price:349,emoji:'🎧',desc:'LDAC, hybrid ANC, 45h battery life.', specs:[
    'Hybrid ANC (up to 40dB)',
    '45h battery, USB-C fast charge',
    'LDAC / AAC / SBC codecs',
    'Memory foam earcups'
  ]},
  {id:2,name:'Elite Smart Watch',price:599,emoji:'⌚',desc:'ECG, SpO2, 10-day battery, AMOLED.', specs:[
    'ECG & SpO2 sensors',
    '1.8" AMOLED with AOD',
    '10-day battery, 5ATM',
    'GPS + NFC payments'
  ]},
  {id:3,name:'Flagship Pro Phone',price:1299,emoji:'📱',desc:'Snapdragon 8 Gen, 120Hz LTPO, 1TB.', specs:[
    'Snapdragon 8 Gen CPU',
    '120Hz LTPO AMOLED',
    '1TB storage, 16GB RAM',
    '5000mAh + 65W fast charge'
  ]},
  {id:4,name:'Premium Speakers',price:449,emoji:'🔊',desc:'Room-filling sound, Wi-Fi multiroom.', specs:[
    'Wi-Fi multiroom ready',
    'Hi-Res + Bluetooth',
    'Dual sub passive radiators',
    'Voice assistant ready'
  ]},
  {id:5,name:'Wireless Earbuds',price:249,emoji:'🎵',desc:'Adaptive ANC, wireless charging.', specs:[
    'Adaptive ANC',
    'Qi wireless charging',
    'IPX4 sweat resistant',
    'Spatial audio ready'
  ]},
  {id:6,name:'Smart Tablet',price:799,emoji:'📲',desc:'12.9" mini-LED, pen + keyboard.', specs:[
    '12.9" mini-LED display',
    'Pen + keyboard support',
    'Wi-Fi 6E + 5G',
    'All-day battery'
  ]},
  {id:7,name:'4K Action Cam',price:549,emoji:'📷',desc:'5.3K60, horizon lock, 10-bit color.', specs:[
    '5.3K60 / 4K120',
    'Horizon lock + HyperSmooth',
    '10-bit color depth',
    'Waterproof 10m'
  ]},
  {id:8,name:'Gaming Mouse Pro',price:159,emoji:'🖱️',desc:'58g, 8K polling, optical switches.', specs:[
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
let user = null;
let users = [];

function saveState() {
  localStorage.setItem('nexus_cart', JSON.stringify(cart));
  localStorage.setItem('nexus_user', JSON.stringify(user));
  localStorage.setItem('nexus_users', JSON.stringify(users));
}

function loadState() {
  cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]');
  user = JSON.parse(localStorage.getItem('nexus_user') || 'null');
  users = JSON.parse(localStorage.getItem('nexus_users') || '[]');
}

function render() {
  document.getElementById('productGrid').innerHTML = products.map(p => `
    <div class="product-card">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="footer">
        <div class="price">$${p.price}</div>
        <div class="btn-group">
          <button onclick="openProduct(${p.id})">Details</button>
          <button onclick="addCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addCart(id) {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++; else cart.push({...p, qty:1});
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
  document.getElementById('cartCount').textContent = cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById('total').textContent = total.toFixed(2);
  document.getElementById('cartItems').innerHTML = cart.length ? cart.map(i => `
    <div class="cart-item">
      <div>${i.emoji} ${i.name}</div>
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
function toggleUser() { document.getElementById('userDrop').classList.toggle('active'); }

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
  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 29.99;
  const tax = subtotal * 0.1;
  const total = (subtotal + shipping + tax).toFixed(2);

  form.innerHTML = `
    <input id="chName" placeholder="Full Name" value="${user?.name || ''}">
    <input id="chEmail" placeholder="Email" value="${user?.email || ''}">
    <input id="chAddress" placeholder="Address">
    <input id="chCity" placeholder="City">
    <input id="chZip" placeholder="ZIP">
    <div style="margin:20px 0">
      <div>Subtotal: $${subtotal.toFixed(2)}</div>
      <div>Shipping: ${shipping === 0 ? 'FREE' : '$' + shipping}</div>
      <div>Tax: $${tax.toFixed(2)}</div>
      <div class="total">Total: $${total}</div>
    </div>
    <button onclick="completeOrder()">Place Order - $${total}</button>
  `;
  modal.classList.add('active');
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
  document.getElementById('productTitle').innerHTML = `${p.emoji} ${p.name} <span onclick="closeProduct()">×</span>`;
  const specsList = p.specs?.length ? `<ul class="specs">${p.specs.map(s=>`<li>${s}</li>`).join('')}</ul>` : '<p>No specs available.</p>';
  document.getElementById('productDetails').innerHTML = `
    <p style="margin-bottom:12px; opacity:0.9;">${p.desc}</p>
    ${specsList}
    <button onclick="addCart(${p.id}); closeProduct();">Add to Cart</button>
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
loadState();
render();
renderReviews();
updateCart();
updateUser();
if(localStorage.getItem('nexus_theme') === 'dark') {
  document.body.classList.add('dark');
}
