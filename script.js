/* ═══════════════════════════════════════════════════════════════
   SNEAKER ZOO — ENGINE V2.0
   Complete rewrite with enhanced UX, scroll reveal, header/footer
   injection, showcase, product, checkout, and account systems.
   ═══════════════════════════════════════════════════════════════ */

// ─── CART MANAGER ──────────────────────────────────────────────
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sz_cart')) || [];
        this.updateCount();
    }

    addItem(product) {
        this.cart.push({ ...product, addedAt: Date.now() });
        this.save();
        this.updateCount();
        this.showToast(`ADDED: ${product.name}`);
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.save();
        this.updateCount();
    }

    clear() {
        this.cart = [];
        this.save();
        this.updateCount();
    }

    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    getTax() {
        return this.getSubtotal() * 0.08875; // NYC tax
    }

    getTotal() {
        return this.getSubtotal() + this.getTax();
    }

    save() {
        localStorage.setItem('sz_cart', JSON.stringify(this.cart));
    }

    updateCount() {
        document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = this.cart.length;
        });
        const cartBtn = document.getElementById('nav-cart');
        if (cartBtn) {
            cartBtn.textContent = `CART (${this.cart.length})`;
            if (this.cart.length > 0) {
                cartBtn.style.animation = 'none';
                cartBtn.offsetHeight;
                cartBtn.style.animation = 'pulse 0.3s ease';
            }
        }
    }

    showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
    }
}

// ─── AUTH MANAGER ──────────────────────────────────────────────
class AuthManager {
    constructor() {
        this.updateHeaderState();
    }

    register(username, email) {
        const profile = { username, email, joined: new Date().toLocaleDateString() };
        localStorage.setItem('sz_user', JSON.stringify(profile));
        this.showToast(`WELCOME, ${username.toUpperCase()}`);
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    }

    login(username) {
        const profile = { username, joined: new Date().toLocaleDateString() };
        localStorage.setItem('sz_user', JSON.stringify(profile));
        this.showToast(`ACCESS GRANTED: ${username.toUpperCase()}`);
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    }

    logout() {
        localStorage.removeItem('sz_user');
        window.location.reload();
    }

    getUser() {
        return JSON.parse(localStorage.getItem('sz_user'));
    }

    updateHeaderState() {
        // Handled in header injection
    }

    showToast(msg) {
        if (window.app && window.app.cartManager) {
            window.app.cartManager.showToast(msg);
        }
    }
}

// ─── APP (ORCHESTRATOR) ────────────────────────────────────────
class App {
    constructor() {
        this.cartManager = new CartManager();
        this.authManager = new AuthManager();

        this.initLoader();
        this.initCursor();
        this.initHeader();
        this.initFooter();
        this.initScrollReveal();
        this.initHeaderScroll();

        // Page-specific
        this.initHome();
        this.initShowcase();
        this.initProduct();
        this.initCheckout();
        this.initAccount();

        console.log('%cSNEAKER ZOO // ENGINE V2.0 // ONLINE', 'color: #ff2d2d; font-weight: bold; font-size: 14px;');
    }

    // ─── LOADER ────────────────────────────────────────────────
    initLoader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.classList.add('hidden');
                    document.body.classList.remove('loading');
                }
            }, 1200);
        });
    }

    // ─── CUSTOM CURSOR ─────────────────────────────────────────
    initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const dot = document.createElement('div');
        dot.id = 'cursor-dot';
        const ring = document.createElement('div');
        ring.id = 'cursor-ring';

        // Remove old cursors
        document.querySelectorAll('#cursor-dot, #cursor-ring').forEach(el => el.remove());
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        const animate = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animate);
        };
        animate();

        // Magnetic buttons
        document.addEventListener('mouseover', e => {
            const link = e.target.closest('a, button, [onclick]');
            if (link) {
                ring.style.width = '60px';
                ring.style.height = '60px';
                ring.style.background = 'rgba(255, 255, 255, 0.04)';
            }
        });

        document.addEventListener('mouseout', e => {
            const link = e.target.closest('a, button, [onclick]');
            if (link) {
                ring.style.width = '40px';
                ring.style.height = '40px';
                ring.style.background = 'transparent';
            }
        });
    }

    // ─── HEADER ────────────────────────────────────────────────
    initHeader() {
        const user = this.authManager.getUser();
        const accountLabel = user ? user.username.toUpperCase() : 'ACCOUNT';
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const isActive = (page) => currentPage === page ? 'style="color: var(--text-primary);"' : '';

        const header = document.createElement('header');
        header.className = 'header-glass';
        header.innerHTML = `
        <a href="index.html" class="brand" aria-label="Sneaker Zoo Home">
            <svg class="sneaker-icon logo" width="42" height="28" viewBox="0 0 200 120" aria-hidden="true">
                <ellipse class="k-part k-shadow" cx="100" cy="115" rx="70" ry="6" fill="rgba(224,224,224,0.10)"/>
                <path class="k-part k-sole" d="M30 85 Q95 105 175 85 Q180 95 175 100 Q95 120 30 100 Q25 95 30 85Z" fill="#333"/>
                <path class="k-part k-upper" d="M40 85 Q50 35 90 25 Q130 18 160 40 Q175 55 175 85 Q95 105 40 85Z" fill="#e0e0e0"/>
                <path class="k-part k-panel" d="M85 30 Q110 25 130 35 Q145 45 150 65 L90 75 Q80 50 85 30Z" fill="#c0c0c0"/>
                <path class="k-part k-swoosh" d="M60 75 Q100 50 155 60" stroke="#ff2d2d" stroke-width="4.5" fill="none" stroke-linecap="round"/>
                <g class="k-part k-laces">
                    <line x1="95" y1="35" x2="110" y2="30" stroke="#888" stroke-width="2" stroke-linecap="round"/>
                    <line x1="92" y1="45" x2="112" y2="38" stroke="#888" stroke-width="2" stroke-linecap="round"/>
                    <line x1="90" y1="55" x2="113" y2="47" stroke="#888" stroke-width="2" stroke-linecap="round"/>
                </g>
            </svg>
        </a>
        <button class="hamburger" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
        <nav id="nav-menu">
            <a href="showcase.html" class="nav-link" ${isActive('showcase.html')}>ARCHIVE</a>
            <a href="drops.html" class="nav-link" ${isActive('drops.html')}>DROPS</a>
            <a href="lookbook.html" class="nav-link" ${isActive('lookbook.html')}>LOOKBOOK</a>
            <a href="about.html" class="nav-link" ${isActive('about.html')}>ABOUT</a>
            <a href="checkout.html" id="nav-cart" class="nav-link" ${isActive('checkout.html')}>CART (${this.cartManager.cart.length})</a>
            <a href="account.html" class="nav-link" ${isActive('account.html')}>${accountLabel}</a>
        </nav>
    `;
        document.body.prepend(header);

        // Hamburger toggle
        const toggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (toggle && navMenu) {
            toggle.addEventListener('click', () => {
                const isOpen = navMenu.classList.toggle('nav-open');
                toggle.classList.toggle('is-active', isOpen);
                toggle.setAttribute('aria-expanded', isOpen);
            });
            // Close menu when a link is clicked
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('nav-open');
                    toggle.classList.remove('is-active');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    // ─── HEADER SCROLL BEHAVIOR ────────────────────────────────
    initHeaderScroll() {
        const header = document.querySelector('.header-glass');
        if (!header) return;

        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            if (y > lastScroll && y > 400) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = y;
        }, { passive: true });
    }

    // ─── FOOTER ────────────────────────────────────────────────
    initFooter() {
        const container = document.getElementById('footer-container');
        if (!container) return;

        container.innerHTML = `
        <footer class="bespoke-footer">
            <div class="footer-grid">
                <div>
                    <h3 style="font-family: var(--font-head); font-size: 1.5rem; margin-bottom: 1rem;">SNEAKER ZOO</h3>
                    <p class="footer-brand-text">
                        Staten Island's premier sneaker boutique. Authenticated deadstock, 
                        rare grails, and premium streetwear since 2026.
                    </p>
                </div>
                <div>
                    <h4 class="footer-heading">SHOP</h4>
                    <ul class="footer-links">
                        <li><a href="showcase.html">Archive</a></li>
                        <li><a href="drops.html">Upcoming Drops</a></li>
                        <li><a href="lookbook.html">Lookbook</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">INFO</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="faq.html">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-heading">LEGAL</h4>
                    <ul class="footer-links">
                        <li><a href="privacy.html">Privacy Policy</a></li>
                        <li><a href="terms.html">Terms of Service</a></li>
                    </ul>
                    <div style="margin-top: 1.5rem;">
                        <h4 class="footer-heading">LOCATION</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">
                            2481 Richmond Rd<br>
                            Staten Island, NY 10306<br>
                            <span style="color: var(--text-muted);">DAILY // 11:00 — 19:00 EST</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                © 2026 SNEAKER ZOO & APPAREL // ALL RIGHTS RESERVED // SNEAKERZOOAPPAREL.COM
            </div>
        </footer>`;
    }

    // ─── SCROLL REVEAL ─────────────────────────────────────────
    initScrollReveal() {
        const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
        if (!targets.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        targets.forEach(el => obs.observe(el));
    }

    // ─── HOME ──────────────────────────────────────────────────
    initHome() {
        const grid = document.getElementById('featured-grid');
        if (!grid || !window.INVENTORY) return;

        // Top 4 products (by price descending — grails first)
        const featured = [...window.INVENTORY]
            .sort((a, b) => b.price - a.price)
            .slice(0, 4);

        featured.forEach(item => {
            grid.appendChild(this._createProductCard(item));
        });

        // Re-init scroll reveal for dynamic cards
        this.initScrollReveal();

        // Newsletter form
        const form = document.getElementById('home-newsletter');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const btn = form.querySelector('button span');
                btn.textContent = 'SUBSCRIBED ✓';
                form.querySelector('input').disabled = true;
                this.cartManager.showToast('SUBSCRIBED — YOU\'RE IN.');
            });
        }
    }

    // ─── SHOWCASE ──────────────────────────────────────────────
    initShowcase() {
        const grid = document.getElementById('showcase-grid');
        if (!grid || !window.INVENTORY) return;

        let currentFilter = 'ALL';
        let currentSort = 'default';

        const render = () => {
            grid.innerHTML = '';
            let items = currentFilter === 'ALL'
                ? [...window.INVENTORY]
                : window.INVENTORY.filter(i => i.category === currentFilter);

            // Sort
            switch (currentSort) {
                case 'price-asc': items.sort((a, b) => a.price - b.price); break;
                case 'price-desc': items.sort((a, b) => b.price - a.price); break;
                case 'name': items.sort((a, b) => a.name.localeCompare(b.name)); break;
                case 'year': items.sort((a, b) => (b.year || 0) - (a.year || 0)); break;
            }

            // Update count
            const countEl = document.getElementById('product-count');
            if (countEl) countEl.textContent = `${items.length} ARTIFACT${items.length !== 1 ? 'S' : ''} IN ARCHIVE`;

            if (items.length === 0) {
                grid.innerHTML = `<div class="empty-state"><h3>NO ARTIFACTS FOUND</h3><p style="color: var(--text-muted);">Try a different category.</p></div>`;
                return;
            }

            items.forEach((item, i) => {
                const card = this._createProductCard(item);
                card.style.animationDelay = `${i * 0.05}s`;
                grid.appendChild(card);
            });

            // Trigger stagger
            requestAnimationFrame(() => grid.classList.add('visible'));
        };

        // Filter buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                grid.classList.remove('visible');
                setTimeout(render, 50);
            });
        });

        // Sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                currentSort = sortSelect.value;
                grid.classList.remove('visible');
                setTimeout(render, 50);
            });
        }

        // View toggle
        const gridBtn = document.getElementById('view-grid');
        const largeBtn = document.getElementById('view-large');
        if (gridBtn && largeBtn) {
            gridBtn.addEventListener('click', () => {
                grid.classList.remove('grid-large');
                gridBtn.classList.add('active');
                largeBtn.classList.remove('active');
            });
            largeBtn.addEventListener('click', () => {
                grid.classList.add('grid-large');
                largeBtn.classList.add('active');
                gridBtn.classList.remove('active');
            });
        }

        render();
    }

    // ─── PRODUCT CARD FACTORY ──────────────────────────────────
    _createProductCard(item) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.onclick = () => window.location.href = `product.html?id=${item.id}`;

        const categoryIcons = { 'FOOTWEAR': '👟', 'APPAREL': '👕', 'OBJECTS': '🗿' };
        const icon = categoryIcons[item.category] || '📦';

        card.innerHTML = `
            <div class="card-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem; background: var(--void-light);">
                <img src="${item.image}" alt="${item.name}" 
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:4rem;\\'>${icon}</span>';">
                <button class="quick-add btn-accent" style="padding: 0.6rem 1.2rem; font-size: 0.7rem;" 
                    onclick="event.stopPropagation(); window.app.cartManager.addItem(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <span>+ QUICK ADD</span>
                </button>
            </div>
            <div class="card-body">
                <span class="card-brand">${item.category}</span>
                <h3 class="card-name">${item.name}</h3>
                <span class="card-variant">${item.variant}</span>
                <div class="card-footer">
                    <span class="card-price">$${item.price.toLocaleString()}</span>
                    ${item.year ? `<span class="card-year">${item.year}</span>` : ''}
                </div>
            </div>
        `;
        return card;
    }

    // ─── PRODUCT DETAIL ────────────────────────────────────────
    initProduct() {
        const nameEl = document.getElementById('p-name');
        if (!nameEl || !window.INVENTORY) return;

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const item = window.INVENTORY.find(i => i.id === id);

        if (!item) {
            nameEl.textContent = 'ARTIFACT NOT FOUND';
            return;
        }

        // Set page title
        document.title = `SNEAKER ZOO // ${item.name} — ${item.variant}`;

        // Populate
        nameEl.textContent = item.name;
        document.getElementById('p-variant').textContent = item.variant;
        document.getElementById('p-desc').textContent = item.description || 'Authenticated artifact from the Sneaker Zoo archive.';
        document.getElementById('p-price').textContent = `$${item.price.toLocaleString()}`;
        document.getElementById('pdp-crumb').textContent = item.name;

        // Image
        const img = document.getElementById('pdp-img');
        if (img) {
            img.src = item.image;
            img.alt = `${item.name} — ${item.variant}`;
            img.onerror = function () {
                const icons = { 'FOOTWEAR': '👟', 'APPAREL': '👕', 'OBJECTS': '🗿' };
                this.style.display = 'none';
                this.parentElement.innerHTML += `<span style="font-size: 10rem;">${icons[item.category] || '📦'}</span>`;
            };
        }

        // Image label
        const label = document.getElementById('pdp-image-label');
        if (label) label.textContent = `${item.id.toUpperCase()} // ${item.category}`;

        // Meta
        const brandEl = document.getElementById('pdp-brand');
        const yearEl = document.getElementById('pdp-year');
        const catEl = document.getElementById('pdp-category');
        if (brandEl) brandEl.textContent = item.name.split(' ')[0];
        if (yearEl) yearEl.textContent = item.year || '—';
        if (catEl) catEl.textContent = item.category;

        // Size selector
        let selectedSize = null;
        const sizeGrid = document.getElementById('size-grid');
        const addBtn = document.getElementById('btn-add');
        const buyBtn = document.getElementById('btn-buy');

        // Hide sizes for non-footwear
        if (item.category !== 'FOOTWEAR' && sizeGrid) {
            sizeGrid.parentElement.querySelector('.chapter-title').textContent = 'ONE SIZE';
            sizeGrid.innerHTML = '<button class="size-btn selected" data-size="OS">OS</button>';
            selectedSize = 'OS';
            if (addBtn) { addBtn.disabled = false; addBtn.querySelector('span').textContent = 'ADD TO CART'; }
            if (buyBtn) buyBtn.disabled = false;
        }

        if (sizeGrid) {
            sizeGrid.addEventListener('click', e => {
                const btn = e.target.closest('.size-btn');
                if (!btn) return;
                sizeGrid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedSize = btn.dataset.size;
                if (addBtn) { addBtn.disabled = false; addBtn.querySelector('span').textContent = 'ADD TO CART'; }
                if (buyBtn) buyBtn.disabled = false;
            });
        }

        // Add to cart
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (!selectedSize) return;
                this.cartManager.addItem({ ...item, size: selectedSize });
                addBtn.querySelector('span').textContent = 'ADDED ✓';
                setTimeout(() => { addBtn.querySelector('span').textContent = 'ADD TO CART'; }, 2000);
            });
        }

        // Buy now
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                if (!selectedSize) return;
                this.cartManager.addItem({ ...item, size: selectedSize });
                window.location.href = 'checkout.html';
            });
        }
    }

    // ─── CHECKOUT ──────────────────────────────────────────────
    initCheckout() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        const renderCart = () => {
            const cart = this.cartManager.cart;

            if (cart.length === 0) {
                cartContainer.innerHTML = `
                    <div class="empty-cart">
                        <h3 style="font-family: var(--font-head); font-size: 1.5rem; margin-bottom: 1rem;">YOUR CART IS EMPTY</h3>
                        <p style="color: var(--text-muted); margin-bottom: 2rem;">Nothing here yet. Go find your grail.</p>
                        <a href="showcase.html" class="btn-accent"><span>BROWSE ARCHIVE</span></a>
                    </div>`;
                // Hide the form
                const form = document.getElementById('checkout-form');
                if (form) form.style.display = 'none';
            } else {
                cartContainer.innerHTML = '';
                cart.forEach((item, i) => {
                    const el = document.createElement('div');
                    el.className = 'cart-item';
                    el.style.animationDelay = `${i * 0.08}s`;
                    const icons = { 'FOOTWEAR': '👟', 'APPAREL': '👕', 'OBJECTS': '🗿' };
                    el.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" 
                            onerror="this.style.display='none'; this.insertAdjacentHTML('afterend','<div style=\\'width:90px;height:90px;display:flex;align-items:center;justify-content:center;font-size:2rem;background:var(--surface);border:1px solid var(--line);\\'>${icons[item.category] || '📦'}</div>')">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-variant">${item.variant}${item.size ? ' // SIZE ' + item.size : ''}</div>
                        </div>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                        <button class="cart-item-remove" data-index="${i}">✕ REMOVE</button>
                    `;
                    cartContainer.appendChild(el);
                });
            }

            // Summary
            const subtotal = this.cartManager.getSubtotal();
            const tax = this.cartManager.getTax();
            const total = this.cartManager.getTotal();

            const subEl = document.getElementById('cart-subtotal');
            const taxEl = document.getElementById('cart-tax');
            const totalEl = document.getElementById('cart-total');
            const summaryItems = document.getElementById('summary-items');

            if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
            if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

            if (summaryItems) {
                summaryItems.innerHTML = cart.map(item => `
                    <div class="summary-row" style="font-size: 0.8rem;">
                        <span style="color: var(--text-primary);">${item.name}</span>
                        <span>$${item.price.toLocaleString()}</span>
                    </div>
                `).join('');
            }
        };

        cartContainer.addEventListener('click', e => {
            const btn = e.target.closest('.cart-item-remove');
            if (btn) {
                this.cartManager.removeItem(parseInt(btn.dataset.index));
                renderCart();
            }
        });

        renderCart();

        // Checkout form
        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                const btn = form.querySelector('button');
                btn.querySelector('span').textContent = 'PROCESSING...';
                btn.disabled = true;

                // Simulate processing
                setTimeout(() => {
                    this.cartManager.clear();
                    cartContainer.innerHTML = `
                        <div style="text-align: center; padding: 4rem 2rem;">
                            <div style="font-size: 4rem; margin-bottom: 1.5rem;">✓</div>
                            <h3 style="font-family: var(--font-head); font-size: 2rem; margin-bottom: 1rem;">ORDER CONFIRMED</h3>
                            <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                                Order #SZ-${Math.floor(Math.random() * 9000 + 1000)} has been placed successfully.
                            </p>
                            <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.9rem;">
                                You'll receive a confirmation email shortly.
                            </p>
                            <a href="showcase.html" class="btn-accent"><span>CONTINUE SHOPPING</span></a>
                        </div>`;
                    form.style.display = 'none';
                    // Clear summary
                    document.querySelector('.order-summary').innerHTML = `
                        <h3 class="chapter-title" style="margin-bottom: 1rem;">ORDER PLACED ✓</h3>
                        <p style="color: var(--text-muted); font-size: 0.85rem;">Your items are being prepared.</p>
                    `;
                }, 2000);
            });
        }

        // Card input masking
        const cardInput = document.getElementById('co-card');
        if (cardInput) {
            cardInput.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 16);
                e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
            });
        }

        const expiryInput = document.getElementById('co-expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (v.length > 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
                e.target.value = v;
            });
        }
    }

    // ─── ACCOUNT ───────────────────────────────────────────────
    initAccount() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const dashboard = document.getElementById('account-dashboard');
        const authForms = document.getElementById('auth-forms');

        if (!loginForm && !dashboard) return;

        const user = this.authManager.getUser();

        if (user && dashboard && authForms) {
            authForms.style.display = 'none';
            dashboard.style.display = 'block';

            const greeting = document.getElementById('dashboard-greeting');
            if (greeting) greeting.textContent = `WELCOME BACK, ${user.username.toUpperCase()}`;

            const joinDate = document.getElementById('dashboard-joined');
            if (joinDate) joinDate.textContent = user.joined;

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) logoutBtn.addEventListener('click', () => this.authManager.logout());
        }

        if (loginForm) {
            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                const username = loginForm.querySelector('[name="username"]')?.value || loginForm.querySelector('input')?.value;
                if (username) this.authManager.login(username);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', e => {
                e.preventDefault();
                const username = registerForm.querySelector('[name="username"]')?.value || registerForm.querySelectorAll('input')[0]?.value;
                const email = registerForm.querySelector('[name="email"]')?.value || registerForm.querySelectorAll('input')[1]?.value;
                if (username && email) this.authManager.register(username, email);
            });
        }
    }
}

// ─── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
