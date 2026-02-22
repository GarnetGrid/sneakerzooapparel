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



    // ─── HEADER ────────────────────────────────────────────────
    initHeader() {
        const user = this.authManager.getUser();
        const accountLabel = user ? user.username.toUpperCase() : 'ACCOUNT';
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        const isActive = (page) => currentPage === page ? 'style="color: var(--text-primary);"' : '';

        const header = document.createElement('header');
        header.className = 'header-glass';
        header.innerHTML = `
        <a href="index.html" class="brand sz-brand" aria-label="Sneaker Zoo Home">
            <div class="sz-logo-wrap">
                <svg class="sz-logo" width="52" height="44" viewBox="0 0 200 170" aria-hidden="true">
                    <defs>
                        <linearGradient id="sole-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#ff2d2d"/>
                            <stop offset="50%" stop-color="#ff6b1a"/>
                            <stop offset="100%" stop-color="#ff2d2d"/>
                        </linearGradient>
                        <linearGradient id="upper-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#1a0a0a"/>
                            <stop offset="40%" stop-color="#2a0f0f"/>
                            <stop offset="100%" stop-color="#3d1515"/>
                        </linearGradient>
                        <linearGradient id="stripe-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#ff2d2d"/>
                            <stop offset="50%" stop-color="#ff0080"/>
                            <stop offset="100%" stop-color="#ff2d2d"/>
                        </linearGradient>
                        <filter id="sz-glow">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="sz-neon">
                            <feGaussianBlur stdDeviation="2" result="blur"/>
                            <feFlood flood-color="#ff2d2d" flood-opacity="0.4" result="color"/>
                            <feComposite in="color" in2="blur" operator="in" result="glow"/>
                            <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                    </defs>
                    <!-- Midsole + outsole — hot gradient -->
                    <path class="sz-part sz-sole" d="M20 130 L175 130 Q190 130 192 120 L192 115 Q192 112 188 112 L18 112 Q14 112 14 116 L14 124 Q14 130 20 130Z" fill="url(#sole-grad)" stroke="#ff6b1a" stroke-width="1"/>
                    <!-- Upper body — deep crimson gradient -->
                    <path class="sz-part sz-upper" d="M22 112 L22 70 Q22 40 50 25 Q65 18 80 18 L95 18 Q110 18 110 30 L110 50 Q150 45 175 55 Q192 62 192 80 L192 112Z" fill="url(#upper-grad)" stroke="rgba(255,45,45,0.25)" stroke-width="1.5"/>
                    <!-- Toe cap — slightly lighter -->
                    <path class="sz-part sz-toe" d="M22 112 L22 90 Q22 80 35 78 Q55 75 80 80 Q90 82 90 90 L90 112Z" fill="#200e0e" stroke="rgba(255,45,45,0.15)" stroke-width="1"/>
                    <!-- Collar / ankle padding -->
                    <path class="sz-part sz-collar" d="M95 18 Q88 10 95 5 Q110 -2 125 5 Q132 10 128 18 L110 30 Q100 22 95 18Z" fill="#2d1111" stroke="rgba(255,100,50,0.3)" stroke-width="1"/>
                    <!-- Neon accent stripe — vibrant gradient -->
                    <path class="sz-part sz-stripe" d="M35 100 Q70 72 120 65 Q155 60 185 72" fill="none" stroke="url(#stripe-grad)" stroke-width="5" stroke-linecap="round" filter="url(#sz-neon)"/>
                    <!-- Stitching detail -->
                    <path class="sz-part sz-stitch" d="M92 112 L92 45" fill="none" stroke="rgba(255,100,100,0.15)" stroke-width="1" stroke-dasharray="3 4"/>
                    <!-- Eyelets — cyan neon -->
                    <circle class="sz-dot sz-dot-1" cx="100" cy="35" r="3" fill="#00e5ff" stroke="#00e5ff" stroke-width="1.5" opacity="0" filter="url(#sz-glow)"/>
                    <circle class="sz-dot sz-dot-2" cx="100" cy="48" r="3" fill="#00e5ff" stroke="#00e5ff" stroke-width="1.5" opacity="0" filter="url(#sz-glow)"/>
                    <circle class="sz-dot sz-dot-3" cx="100" cy="61" r="3" fill="#00e5ff" stroke="#00e5ff" stroke-width="1.5" opacity="0" filter="url(#sz-glow)"/>
                    <circle class="sz-dot sz-dot-4" cx="100" cy="74" r="3" fill="#00e5ff" stroke="#00e5ff" stroke-width="1.5" opacity="0" filter="url(#sz-glow)"/>
                    <!-- Lace lines -->
                    <g class="sz-laces" opacity="0">
                        <line x1="100" y1="35" x2="115" y2="32" stroke="rgba(255,150,100,0.5)" stroke-width="1.2" stroke-linecap="round"/>
                        <line x1="100" y1="48" x2="118" y2="44" stroke="rgba(255,150,100,0.5)" stroke-width="1.2" stroke-linecap="round"/>
                        <line x1="100" y1="61" x2="120" y2="56" stroke="rgba(255,150,100,0.5)" stroke-width="1.2" stroke-linecap="round"/>
                    </g>
                    <!-- Sole tread accents -->
                    <g class="sz-treads" opacity="0">
                        <rect x="30" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="45" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="60" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="75" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="90" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="105" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="120" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="135" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="150" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                        <rect x="165" y="128" width="8" height="2" rx="1" fill="#cc4400"/>
                    </g>
                </svg>
                <canvas class="sz-particles" width="80" height="60"></canvas>
            </div>
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

        // SZ Logo particle system — orbiting + hover burst
        const szWrap = header.querySelector('.sz-logo-wrap');
        const szCanvas = header.querySelector('.sz-particles');
        if (szWrap && szCanvas) {
            szCanvas.width = 120;
            szCanvas.height = 100;
            const ctx = szCanvas.getContext('2d');
            let burstParticles = [];
            const cx = szCanvas.width / 2;
            const cy = szCanvas.height / 2;

            // Orbiting particles — always visible
            const orbitColors = ['#ff2d2d', '#ff6b1a', '#ff0080', '#00e5ff', '#ffffff'];
            const orbiters = orbitColors.map((color, i) => ({
                angle: (Math.PI * 2 / orbitColors.length) * i,
                speed: 0.008 + Math.random() * 0.006,
                rx: 28 + Math.random() * 14,
                ry: 18 + Math.random() * 10,
                size: 1.2 + Math.random() * 1,
                color,
                phase: Math.random() * Math.PI * 2
            }));

            // Burst particles (on hover)
            class BurstParticle {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 3 + 1.5;
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                    this.life = 1;
                    this.decay = Math.random() * 0.03 + 0.015;
                    this.size = Math.random() * 2.5 + 0.5;
                    this.color = orbitColors[Math.floor(Math.random() * orbitColors.length)];
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += 0.04;
                    this.vx *= 0.99;
                    this.life -= this.decay;
                }
                draw(c) {
                    c.globalAlpha = this.life;
                    c.fillStyle = this.color;
                    c.shadowColor = this.color;
                    c.shadowBlur = 6;
                    c.beginPath();
                    c.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
                    c.fill();
                }
            }

            function spawnBurst() {
                for (let i = 0; i < 18; i++) {
                    burstParticles.push(new BurstParticle(cx, cy));
                }
            }

            function draw() {
                ctx.clearRect(0, 0, szCanvas.width, szCanvas.height);

                // Draw orbiting particles
                orbiters.forEach(o => {
                    o.angle += o.speed;
                    const x = cx + Math.cos(o.angle + o.phase) * o.rx;
                    const y = cy + Math.sin(o.angle + o.phase) * o.ry;
                    const pulse = 0.6 + 0.4 * Math.sin(o.angle * 3);
                    ctx.globalAlpha = pulse;
                    ctx.fillStyle = o.color;
                    ctx.shadowColor = o.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(x, y, o.size * pulse, 0, Math.PI * 2);
                    ctx.fill();
                });

                // Draw burst particles
                burstParticles = burstParticles.filter(p => p.life > 0);
                burstParticles.forEach(p => { p.update(); p.draw(ctx); });

                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                requestAnimationFrame(draw);
            }

            draw(); // start immediately — orbits are always on

            szWrap.addEventListener('mouseenter', () => {
                spawnBurst();
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
