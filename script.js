/* 
   SNEAKER ZOO // PHASE 19 // CORE ENGINE
   ARCHITECTURE: Class-Based State Management
*/

class App {
    constructor() {
        this.initCursor();
        this.initButtons();
        this.initHeader();
        this.initFooter(); // [NEW] Footer Engine
        this.initShowcase();
        this.initProduct();

        this.cartManager = new CartManager();
        this.authManager = new AuthManager();

        this.initCheckout();
        this.initAccount();

        this.updateCartCount();
        console.log('SNEAKER ZOO // BESPOKE ENGINE // ONLINE');
    }


    /* --- ACCOUNT / AUTH ENGINE --- */
    initAccount() {
        const loginForm = document.getElementById('login-form');
        const regForm = document.getElementById('register-form');
        const dashboard = document.getElementById('account-dashboard');

        // Check Logic
        const user = this.authManager.getUser();

        if (user && dashboard) {
            // SHOW DASHBOARD
            if (loginForm) loginForm.parentElement.style.display = 'none';
            if (regForm) regForm.parentElement.style.display = 'none';

            dashboard.style.display = 'block';
            const greeting = document.getElementById('user-greeting');
            if (greeting) greeting.innerText = `WELCOME, ${user.username.toUpperCase()}`;

            // Mock Orders
            const historyContainer = document.getElementById('order-history');
            const orders = [
                { id: 'SZ-9021', date: '2026-02-01', items: 'KINETIC RUNNER V2', status: 'DELIVERED', total: '$295.00' },
                { id: 'SZ-8810', date: '2026-01-15', items: 'DEEP VOID HOODIE', status: 'SHIPPED', total: '$120.00' }
            ];

            if (historyContainer) {
                historyContainer.innerHTML = orders.map(o => `
                    <div class="card-glass" style="padding: 1rem; display: flex; justify-content: space-between; align-items: center; border-left: 3px solid var(--accent);">
                        <div>
                            <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--accent); margin-bottom: 0.2rem;">${o.id} // ${o.status}</div>
                            <div style="font-weight: 700; font-family: var(--font-head);">${o.items}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-family: var(--font-head);">${o.total}</div>
                            <div style="font-size: 0.8rem; opacity: 0.6; font-family: var(--font-mono);">${o.date}</div>
                        </div>
                    </div>
                `).join('');
            }

        } else {
            // SHOW FORMS
            if (loginForm) {
                loginForm.onsubmit = (e) => {
                    e.preventDefault();
                    this.authManager.login(
                        document.getElementById('login-user').value,
                        '***'
                    );
                };
            }

            if (regForm) {
                regForm.onsubmit = (e) => {
                    e.preventDefault();
                    this.authManager.register(
                        document.getElementById('reg-user').value,
                        document.getElementById('reg-email').value
                    );
                };
            }
        }
    }

    /* --- CHECKOUT ENGINE --- */
    initCheckout() {
        const params = window.location.pathname;
        if (!params.includes('checkout.html')) return;

        const container = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');

        if (!container) return;

        const renderCart = () => {
            const cart = this.cartManager.cart;
            container.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                container.innerHTML = `
                    <div style="padding: 4rem; text-align: center; border: 1px dashed var(--line);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🕸️</div>
                        <p style="font-family: var(--font-head); margin-bottom: 2rem;">MANIFEST EMPTY</p>
                        <a href="showcase.html" class="btn-magnet">ACQUIRE ASSETS</a>
                    </div>
                `;
                subtotalEl.innerText = '$0.00';
                totalEl.innerText = '$0.00';
                return;
            }

            cart.forEach((item, index) => {
                total += item.price;
                const row = document.createElement('div');
                row.className = 'cart-row';
                row.style.cssText = `display: flex; gap: 2rem; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 2rem;`;

                row.innerHTML = `
                    <img src="${item.image}" style="width: 100px; height: 100px; object-fit: cover; border: 1px solid var(--line);">
                    <div style="flex-grow: 1;">
                        <h3 style="font-family: var(--font-head); font-size: 1.2rem; margin-bottom: 0.5rem;">${item.name}</h3>
                        <p style="font-size: 0.8rem; opacity: 0.7;">${item.variant} // ${item.category}</p>
                    </div>
                    <div style="font-family: var(--font-head); font-size: 1.2rem;">$${item.price.toFixed(2)}</div>
                    <button class="remove-btn" data-index="${index}" style="background: none; border: none; color: red; font-family: var(--font-head); cursor: pointer;">[REMOVE]</button>
                `;
                container.appendChild(row);
            });

            subtotalEl.innerText = `$${total.toFixed(2)}`;
            totalEl.innerText = `$${total.toFixed(2)}`;

            // Bind Remove Buttons
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const idx = e.target.dataset.index;
                    this.cartManager.removeItem(idx);
                    renderCart(); // Re-render
                };
            });
        };

        renderCart();
    }

    /* --- PRODUCT HOLOGRAM & DATA --- */
    initProduct() {
        // 1. Data Population
        const urlParams = new URLSearchParams(window.location.search);
        const pid = urlParams.get('id');
        const container = document.getElementById('hologram-container');

        if (!container) return; // Not on product page

        const item = window.INVENTORY ? window.INVENTORY.find(i => i.id === pid) : null;

        if (item) {
            document.title = `SNEAKER ZOO // ${item.name}`;
            document.getElementById('p-name').innerText = item.name;
            document.getElementById('p-variant').innerText = item.variant;
            document.getElementById('p-desc').innerText = item.description;
            document.getElementById('p-price').innerText = `$${item.price.toFixed(2)}`;

            // Add to Cart Interaction
            const btn = document.getElementById('btn-add');
            btn.onclick = () => {
                window.app.cartManager.addItem(item);
            };
        } else {
            // 404 State
            document.getElementById('p-name').innerText = "ARCHIVE DELETED";
            document.getElementById('p-variant').innerText = "ITEM NOT FOUND";
        }

        // 2. Three.js Hologram (Global Scope)
        if (typeof THREE !== 'undefined') {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x050505); // Void Color

            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.innerHTML = ''; // Clear stub
            container.appendChild(renderer.domElement);

            // Geometry (Dynamic based on Category)
            let geometry;
            if (item && item.category === 'FOOTWEAR') {
                geometry = new THREE.BoxGeometry(3, 1.5, 1);
            } else if (item && item.category === 'APPAREL') {
                geometry = new THREE.CylinderGeometry(1, 1, 3, 16); // Better for apparel
            } else {
                geometry = new THREE.IcosahedronGeometry(2, 0);
            }

            const material = new THREE.MeshBasicMaterial({
                color: 0xE0E0E0,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            const hologram = new THREE.Mesh(geometry, material);
            scene.add(hologram);

            // Inner Core
            const coreGeo = new THREE.IcosahedronGeometry(0.5, 0);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFF });
            const core = new THREE.Mesh(coreGeo, coreMat);
            scene.add(core);

            // Particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 200;
            const posArray = new Float32Array(particlesCount * 3);
            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                color: 0xE0E0E0
            });
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            function animate() {
                requestAnimationFrame(animate);

                hologram.rotation.x += 0.005;
                hologram.rotation.y += 0.01;
                core.rotation.y -= 0.02;
                particlesMesh.rotation.y += 0.002;

                renderer.render(scene, camera);
            }
            animate();

            // Handle Resize
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        }
    }


    /* --- FOOTER ENGINE --- */
    initFooter() {
        const container = document.getElementById('footer-container');
        if (!container) return;

        container.innerHTML = `
            <footer style="border-top: 1px solid var(--line); padding: 4rem 2rem; background: var(--bg-dark); margin-top: auto;">
                <div style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem;">
                    
                    <!-- Branding -->
                    <div>
                        <h4 style="font-family: 'Syncopate'; margin-bottom: 1rem; color: white;">SNEAKER ZOO</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
                            The world's premier destination for kinetic footwear and rare digital artifacts.
                            <br><br>
                            EST. 2026 // DEEP VOID
                        </p>
                    </div>

                    <!-- Links -->
                    <div>
                        <h4 style="font-family: 'Syncopate'; margin-bottom: 1rem; color: white;">EXPLORE</h4>
                        <ul style="list-style: none; padding: 0; font-family: 'Syne'; font-size: 0.9rem;">
                            <li style="margin-bottom: 0.5rem;"><a href="index.html" class="nav-link">HOME</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="showcase.html" class="nav-link">ARCHIVE</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="about.html" class="nav-link">MANIFESTO</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="faq.html" class="nav-link">PROTOCOL</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="terms.html" class="nav-link">TERMS</a></li>
                            <li style="margin-bottom: 0.5rem;"><a href="privacy.html" class="nav-link">PRIVACY</a></li>
                        </ul>
                    </div>

                    <!-- Newsletter -->
                    <div>
                        <h4 style="font-family: 'Syncopate'; margin-bottom: 1rem; color: white;">TRANSMISSIONS</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Join the secured network.</p>
                        <form id="newsletter-form" style="display: flex; border-bottom: 1px solid var(--line);">
                            <input type="email" placeholder="ENTER FREQUENCY" style="background: none; border: none; color: white; padding: 0.5rem 0; width: 100%; outline: none; font-family: 'Syne';">
                            <button type="submit" style="background: none; border: none; color: var(--accent); cursor: pointer;">→</button>
                        </form>
                    </div>
                </div>
                <div style="text-align: center; margin-top: 4rem; font-size: 0.7rem; color: var(--text-muted); font-family: 'Syncopate';">
                    © 2026 SNEAKER ZOO LLC. ALL RIGHTS RESERVED.
                </div>
            </footer>
        `;

        // Newsletter Logic
        const form = document.getElementById('newsletter-form');
        if (form && this.cartManager) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const input = form.querySelector('input');
                if (input.value) {
                    this.cartManager.showToast(`SUBSCRIBED: ${input.value}`);
                    input.value = '';
                }
            };
        }
    }

    /* --- SHOWCASE ENGINE --- */
    initShowcase() {
        const grid = document.getElementById('showcase-grid');
        const filters = document.querySelectorAll('.filter-btn');

        if (!grid || !window.INVENTORY) return; // Exit if not on showcase or no data

        const render = (category) => {
            grid.innerHTML = '';

            const filtered = category === 'ALL'
                ? window.INVENTORY
                : window.INVENTORY.filter(item => item.category === category);

            filtered.forEach(item => {
                const card = document.createElement('article');
                card.className = 'card-glass';
                card.onclick = () => window.location.href = `product.html?id=${item.id}`;

                // Icon mapping
                let icon = '📦';
                if (item.category === 'FOOTWEAR') icon = '👟';
                if (item.category === 'APPAREL') icon = '👕';
                if (item.category === 'OBJECTS') icon = '🗿';

                card.innerHTML = `
                    <div style="font-size: 5rem; text-align: center; margin-bottom: 2rem;">${icon}</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; text-transform: uppercase;">${item.name}</h3>
                    <p style="font-family: var(--font-body); opacity: 0.7;">${item.variant} // ${item.year}</p>
                    <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700;">$${item.price.toFixed(2)}</span>
                        <button class="btn-magnet" style="padding: 0.5rem 1rem; font-size: 12px;">VIEW</button>
                    </div>
                `;
                grid.appendChild(card);
            });

            // Re-init interactions for new elements
            this.initCursor();
            this.initButtons();
        };

        // Initial Render
        render('ALL');

        // Filter Logic
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update specific active state
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Color logic for filter bar
                filters.forEach(b => {
                    if (b === btn) {
                        b.style.color = 'var(--hologram)';
                        b.style.webkitTextStroke = '0px';
                    } else {
                        b.style.color = 'var(--void)';
                        b.style.webkitTextStroke = '1px var(--hologram)';
                    }
                });

                render(btn.dataset.filter);
            });
        });
    }

    /* --- HEADER INTELLIGENCE --- */
    /* --- HEADER INTELLIGENCE --- */
    initHeader() {
        // 1. Inject Header if missing
        if (!document.getElementById('bespoke-header')) {
            const headerHTML = `
                <header id="bespoke-header" class="glass-panel header-glass">
                    




                    <div class="logo" style="cursor: pointer; display: flex; align-items: center; gap: 18px;" 
                        onclick="window.location.href='index.html'">
                        <!-- EXPLODING KINETIC SNEAKER V5 (Larger) -->
                        <svg class="sneaker-icon" width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                            <!-- Drop Shadow -->
                            <ellipse class="k-part k-shadow" cx="50" cy="85" rx="35" ry="5" fill="#FF3333" fill-opacity="0.3" filter="blur(4px)" />
                            
                            <!-- Base Group -->
                            <g class="k-part k-sole">
                                <path d="M15 75 C 10 75, 10 65, 15 65 L 85 65 C 90 65, 90 75, 85 75 H 15 Z" fill="#E0E0E0"/>
                                <path d="M18 70 L 82 70" stroke="#050505" stroke-width="2"/>
                            </g>

                            <!-- Upper Body Group -->
                            <g class="k-part k-upper">
                                <path d="M20 65 C 20 50, 25 35, 40 35 L 80 40 L 85 65 H 20 Z" fill="#FF3333"/>
                                <!-- Detail Panels -->
                                <path class="k-part k-panel" d="M40 35 L 55 35 L 60 45 L 35 55 Z" fill="#050505"/>
                                <path class="k-part k-panel" d="M70 42 L 80 40 L 83 60 L 72 62 Z" fill="#050505"/>
                            </g>
                            
                            <!-- Swoosh (Silver) -->
                            <path class="k-part k-swoosh" d="M25 58 Q 50 45, 80 50 L 78 55 Q 50 52, 25 62 Z" fill="#E0E0E0"/>
                            
                            <!-- Laces Group -->
                            <g class="k-part k-laces">
                                <path d="M42 35 L 45 28" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round"/>
                                <path d="M48 37 L 51 30" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round"/>
                                <path d="M54 39 L 57 32" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round"/>
                            </g>
                        </svg>
                        <span style="font-family: var(--font-cyber); font-weight: 700; font-size: 1.4rem; letter-spacing: 0.05em; color: white;">
                            SNEAKER ZOO
                        </span>
                    </div>

                    <nav style="display: flex; gap: 2rem;">
                        <button class="btn-magnet" onclick="window.location.href='showcase.html'">ARCHIVE</button>
                        <button class="btn-magnet" onclick="window.location.href='account.html'" id="nav-account">ACCESS</button>
                        <button class="btn-magnet" onclick="window.location.href='checkout.html'" id="nav-cart">CART (0)</button>
                    </nav>
                </header>
            `;
            document.body.insertAdjacentHTML('afterbegin', headerHTML);
        }

        // 2. Auth State Update
        const accountBtn = document.getElementById('nav-account');
        if (this.authManager && accountBtn) {
            const user = this.authManager.getUser();
            if (user) {
                accountBtn.innerHTML = `<span style="color: var(--hologram)">// ${user.username.toUpperCase()}</span>`;
                accountBtn.onclick = () => {
                    if (confirm('TERMINATE LINK? (LOGOUT)')) {
                        this.authManager.logout();
                    }
                };
            }
        }

        // 3. Scroll Logic
        let lastScroll = 0;
        const header = document.getElementById('bespoke-header');
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 50) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });

        // 4. Re-bind Magnets for new elements
        this.initButtons();
    }

    /* --- CART STATE --- */
    // Proxy for Cart Updates
    updateCartCount() {
        if (this.cartManager) this.cartManager.updateCount();
    }

    /* --- CURSOR SYSTEM --- */
    initCursor() {
        // Create cursor elements dynamically if they don't exist
        if (!document.getElementById('cursor-dot')) {
            const dot = document.createElement('div');
            dot.id = 'cursor-dot';
            const ring = document.createElement('div');
            ring.id = 'cursor-ring';
            document.body.appendChild(dot);
            document.body.appendChild(ring);
        }

        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');

        document.addEventListener('mousemove', (e) => {
            dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

            // Slight delay for ring "catch up" effect
            setTimeout(() => {
                ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }, 50);
        });

        // Hover States
        document.querySelectorAll('a, button, .btn-magnet').forEach(el => {
            el.addEventListener('mouseenter', () => {
                ring.style.width = '60px';
                ring.style.height = '60px';
                ring.style.background = 'rgba(255,255,255,0.1)';
            });
            el.addEventListener('mouseleave', () => {
                ring.style.width = '40px';
                ring.style.height = '40px';
                ring.style.background = 'transparent';
            });
        });
    }

    /* --- BUTTON INTERACTIONS --- */
    initButtons() {
        const btns = document.querySelectorAll('.btn-magnet');
        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Magnetic pull effect
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const deltaX = (x - centerX) * 0.2;
                const deltaY = (y - centerY) * 0.2;

                btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

/* --- COMMERCE ENGINE --- */
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('sz_cart')) || [];
        this.updateCount();
    }

    addItem(product) {
        // Simple Add (Could be extended for size/qty)
        this.cart.push(product);
        this.save();
        this.updateCount();
        this.showToast(`ADDED: ${product.name}`);
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.save();
        this.updateCount();
    }

    save() {
        localStorage.setItem('sz_cart', JSON.stringify(this.cart));
    }

    updateCount() {
        // Use ID selector now that we injection header with specific ID
        const cartBtn = document.getElementById('nav-cart');
        if (cartBtn) {
            cartBtn.innerHTML = `CART (${this.cart.length})`;
            // Pulse Effect
            cartBtn.style.animation = 'none';
            cartBtn.offsetHeight; /* trigger reflow */
            cartBtn.style.animation = 'pulse 0.3s ease';
        }
    }

    showToast(msg) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed; bottom: 2rem; right: 2rem;
                background: rgba(5, 5, 5, 0.9); border: 1px solid var(--hologram);
                color: var(--hologram); padding: 1rem 2rem;
                font-family: var(--font-head); font-size: 0.8rem;
                transform: translateY(100px); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                z-index: 1000; pointer-events: none;
            `;
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.transform = 'translateY(0)';

        // Hide after 3s
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
        }, 3000);
    }
}

/* --- IDENTITY ENGINE --- */
class AuthManager {
    constructor() {
        this.updateHeaderState();
    }

    register(username, email) {
        // Mock Registration
        const profile = { username, email, joined: new Date().toLocaleDateString() };
        localStorage.setItem('sz_user', JSON.stringify(profile));
        this.showToast(`PROFILE GENERATED: ${username}`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    login(username, password) {
        // Mock Login (Accepts any password for demo)
        // Check if user exists? For demo/mock we just set the session.
        const profile = { username, joined: new Date().toLocaleDateString() };
        localStorage.setItem('sz_user', JSON.stringify(profile));
        this.showToast(`ACCESS GRANTED: ${username}`);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    logout() {
        localStorage.removeItem('sz_user');
        window.location.reload();
    }

    getUser() {
        return JSON.parse(localStorage.getItem('sz_user'));
    }

    updateHeaderState() {
        const user = this.getUser();
        // We need to wait for initHeader to inject the DOM, strictly speaking, 
        // but since App init order, header exists.
        // We'll target the ACCOUNT link blindly or injected.

        // Actually, initHeader is what injects/controls navigation. 
        // We should hook into the navigation builder.
    }

    // Helper to allow App to show toast
    showToast(msg) {
        window.app.cartManager.showToast(msg);
    }
}

// Global App Instance
window.onload = () => {
    window.app = new App();
};
