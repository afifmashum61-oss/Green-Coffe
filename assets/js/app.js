// Green Cafe POS Core Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initial State
    let cart = [];
    let currentCategory = 'all';
    let searchQuery = '';
    let selectedOrderType = 'Dine-In';
    let selectedTable = 1;
    let selectedMember = null;
    let appliedVoucher = null;
    let activeNavTab = 'menu';
    let cashPaidInput = '';
    let selectedPaymentMethod = 'cash';
    let currentCustomizingItem = null;
    
    // Persistent Orders History
    let ordersHistory = JSON.parse(localStorage.getItem('green_cafe_orders') || '[]');

    // DOM Elements
    const menuGrid = document.getElementById('menu-grid');
    const categoriesContainer = document.getElementById('categories-container');
    const searchInput = document.getElementById('search-input');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartBadgeCount = document.getElementById('cart-badge-count');
    const cartSubtotalEl = document.getElementById('cart-subtotal');
    const cartDiscountEl = document.getElementById('cart-discount');
    const cartTaxEl = document.getElementById('cart-tax');
    const cartServiceEl = document.getElementById('cart-service');
    const cartGrandTotalEl = document.getElementById('cart-grandtotal');
    const cartCountHeader = document.getElementById('cart-count-header');
    
    // Auth State & Persistent User Database
    let currentUser = JSON.parse(sessionStorage.getItem('green_cafe_user') || 'null');

    const DEFAULT_USERS = [
        { username: 'kasir', pin: '1234', name: 'Sarah Amalia', role: 'Kasir', avatar: 'SA' },
        { username: 'admin', pin: '8888', name: 'Budi (Admin Manager)', role: 'Admin', avatar: 'AD' }
    ];
    let usersDatabase = JSON.parse(localStorage.getItem('green_cafe_users_db') || JSON.stringify(DEFAULT_USERS));

    function saveUsersDatabase() {
        localStorage.setItem('green_cafe_users_db', JSON.stringify(usersDatabase));
        renderUsersList();
    }

    function renderUsersList() {
        const container = document.getElementById('users-list-container');
        if (!container) return;

        container.innerHTML = usersDatabase.map((user, idx) => `
            <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${user.role === 'Admin' ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-emerald-100 text-emerald-800 font-bold'} flex items-center justify-center text-xs">
                        ${user.avatar || user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-extrabold text-xs text-slate-800">${user.name}</span>
                            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${user.role === 'Admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'}">
                                ${user.role}
                            </span>
                        </div>
                        <div class="text-[11px] text-slate-500 mt-0.5">
                            Username: <code class="bg-white px-1 border rounded text-slate-700 font-mono">${user.username}</code> • PIN: <code class="bg-white px-1 border rounded text-slate-700 font-mono">${user.pin}</code>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="window.openEditUserModal(${idx})" class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold shadow-2xs">
                        <i class="fa-solid fa-pen-to-square mr-1"></i> Edit Nama / PIN
                    </button>
                    ${usersDatabase.length > 1 ? `
                        <button onclick="window.deleteUserAccount(${idx})" class="p-1.5 text-slate-400 hover:text-rose-600 text-xs">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    window.openEditUserModal = function(index) {
        const user = usersDatabase[index];
        if (!user) return;

        document.getElementById('edit-user-modal-title').innerText = `Edit Pengguna: ${user.name}`;
        document.getElementById('edit-user-index').value = index;
        document.getElementById('edit-user-username').value = user.username;
        document.getElementById('edit-user-username').readOnly = true;
        document.getElementById('edit-user-name').value = user.name;
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-pin').value = user.pin;

        const modal = document.getElementById('edit-user-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    window.openAddUserModal = function() {
        document.getElementById('edit-user-modal-title').innerText = 'Tambah Pengguna Kasir Baru';
        document.getElementById('edit-user-index').value = '-1';
        document.getElementById('edit-user-username').value = '';
        document.getElementById('edit-user-username').readOnly = false;
        document.getElementById('edit-user-name').value = '';
        document.getElementById('edit-user-role').value = 'Kasir';
        document.getElementById('edit-user-pin').value = '1234';

        const modal = document.getElementById('edit-user-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    window.closeEditUserModal = function() {
        const modal = document.getElementById('edit-user-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.saveUserChanges = function(event) {
        event.preventDefault();
        const idx = parseInt(document.getElementById('edit-user-index').value, 10);
        const username = document.getElementById('edit-user-username').value.trim().toLowerCase();
        const name = document.getElementById('edit-user-name').value.trim();
        const role = document.getElementById('edit-user-role').value;
        const pin = document.getElementById('edit-user-pin').value.trim();

        const words = name.split(' ');
        const avatar = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();

        if (idx === -1) {
            if (usersDatabase.some(u => u.username === username)) {
                alert('Username sudah digunakan! Pilih username lain.');
                return;
            }
            usersDatabase.push({ username, pin, name, role, avatar });
        } else {
            usersDatabase[idx] = { ...usersDatabase[idx], username, pin, name, role, avatar };
            if (currentUser && currentUser.username === username) {
                currentUser = usersDatabase[idx];
                sessionStorage.setItem('green_cafe_user', JSON.stringify(currentUser));
                updateOperatorProfile();
            }
        }

        saveUsersDatabase();
        window.closeEditUserModal();
        alert('Data pengguna berhasil diperbarui!');
    };

    window.deleteUserAccount = function(index) {
        const user = usersDatabase[index];
        if (!user) return;

        if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.name} (${user.username})?`)) {
            usersDatabase.splice(index, 1);
            saveUsersDatabase();
        }
    };

    function checkAuthStatus() {
        const loginModal = document.getElementById('login-modal');
        const sidebar = document.getElementById('sidebar');
        const sidebarBackdrop = document.getElementById('sidebar-backdrop');
        const cartDrawer = document.getElementById('cart-drawer');
        const cartBackdrop = document.getElementById('cart-backdrop');

        if (!currentUser) {
            if (loginModal) {
                loginModal.classList.remove('hidden');
                loginModal.classList.add('flex');
            }
            window.selectLoginRole('kasir');
        } else {
            if (loginModal) {
                loginModal.classList.add('hidden');
                loginModal.classList.remove('flex');
            }

            // Ensure mobile sidebar & cart drawer are closed when logged in
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
            if (cartDrawer) cartDrawer.classList.remove('mobile-open');
            if (cartBackdrop) cartBackdrop.classList.add('hidden');

            updateOperatorProfile();
        }
    }

    function updateOperatorProfile() {
        if (!currentUser) return;
        const avatarEl = document.getElementById('operator-avatar');
        const nameEl = document.getElementById('operator-name');
        const roleEl = document.getElementById('operator-role');
        const headerStatusEl = document.getElementById('header-status-badge');

        if (avatarEl) {
            avatarEl.innerText = currentUser.avatar || 'OP';
            avatarEl.className = currentUser.role === 'Admin' 
                ? 'w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-extrabold flex items-center justify-center text-xs shadow-sm'
                : 'w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs';
        }
        if (nameEl) nameEl.innerText = currentUser.name;
        if (roleEl) roleEl.innerText = `${currentUser.role} • Active`;

        if (headerStatusEl) {
            headerStatusEl.innerHTML = currentUser.role === 'Admin'
                ? `<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Mode Admin • Full Access`
                : `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online • Mode Kasir`;
            headerStatusEl.className = currentUser.role === 'Admin'
                ? 'text-xs font-bold text-amber-700 flex items-center justify-end gap-1.5'
                : 'text-xs font-bold text-emerald-600 flex items-center justify-end gap-1.5';
        }

        // Show/Hide Sidebar Menus & Admin Buttons Based on Role
        document.querySelectorAll('.nav-link').forEach(link => {
            const tab = link.dataset.tab;
            if (tab === 'settings' || tab === 'analytics') {
                if (currentUser.role === 'Kasir') {
                    link.classList.add('hidden');
                } else {
                    link.classList.remove('hidden');
                }
            }
        });

        const adminAddBtnContainer = document.getElementById('admin-add-menu-btn-container');
        if (adminAddBtnContainer) {
            adminAddBtnContainer.classList.toggle('hidden', currentUser.role !== 'Admin');
        }
        renderMenu();
    }

    window.selectLoginRole = function(role) {
        const tabKasir = document.getElementById('role-tab-kasir');
        const tabAdmin = document.getElementById('role-tab-admin');
        const userInput = document.getElementById('login-username');
        const passInput = document.getElementById('login-password');

        if (role === 'kasir') {
            if (tabKasir) tabKasir.className = 'py-2 rounded-xl transition-all bg-emerald-600 text-white shadow-xs';
            if (tabAdmin) tabAdmin.className = 'py-2 rounded-xl transition-all bg-slate-100 text-slate-600 hover:text-slate-800';
            if (userInput && userInput.value === 'admin') userInput.value = '';
            if (passInput && passInput.value === '8888') passInput.value = '';
        } else {
            if (tabAdmin) tabAdmin.className = 'py-2 rounded-xl transition-all bg-emerald-600 text-white shadow-xs';
            if (tabKasir) tabKasir.className = 'py-2 rounded-xl transition-all bg-slate-100 text-slate-600 hover:text-slate-800';
            if (userInput && userInput.value === 'kasir') userInput.value = '';
            if (passInput && passInput.value === '1234') passInput.value = '';
        }
    };

    window.togglePasswordVisibility = function() {
        const input = document.getElementById('login-password');
        const icon = document.getElementById('password-eye-icon');
        if (!input || !icon) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fa-solid fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fa-solid fa-eye';
        }
    };

    window.handleLoginSubmit = function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim().toLowerCase();
        const pin = document.getElementById('login-password').value.trim();

        const foundUser = usersDatabase.find(u => u.username === username && u.pin === pin);
        if (!foundUser) {
            alert('Username atau PIN/Password salah! Silakan coba lagi.');
            return;
        }

        currentUser = foundUser;
        sessionStorage.setItem('green_cafe_user', JSON.stringify(currentUser));
        checkAuthStatus();
    };

    window.logoutUser = function() {
        if (confirm('Apakah Anda yakin ingin keluar / logout dari sistem kasir?')) {
            currentUser = null;
            sessionStorage.removeItem('green_cafe_user');
            checkAuthStatus();
        }
    };

    // Init Application
    function init() {
        checkAuthStatus();
        renderCategories();
        renderMenu();
        renderCart();
        renderTablesList();
        renderMembersList();
        renderOrderHistory();
        renderAnalytics();
        renderUsersList();
        setupEventListeners();
    }

    // Currency Formatter
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    // Persistent Menu Items Database
    let menuItemsList = JSON.parse(localStorage.getItem('green_cafe_menu_list') || JSON.stringify(MENU_ITEMS));

    function saveMenuItemsList() {
        localStorage.setItem('green_cafe_menu_list', JSON.stringify(menuItemsList));
        renderCategories();
        renderMenu();
    }

    // Render Categories Tab
    function renderCategories() {
        if (!categoriesContainer) return;
        categoriesContainer.innerHTML = CATEGORIES.map(cat => `
            <button data-cat="${cat.id}" class="category-card flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${currentCategory === cat.id ? 'active bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold' : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-700'}">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center ${currentCategory === cat.id ? 'bg-emerald-600 text-white' : 'bg-emerald-100/70 text-emerald-700'}">
                    <i class="fa-solid ${cat.icon} text-lg"></i>
                </div>
                <div>
                    <div class="text-sm font-semibold whitespace-nowrap">${cat.name}</div>
                    <div class="text-xs text-slate-400">${cat.id === 'all' ? menuItemsList.length : menuItemsList.filter(m => m.category === cat.id).length} Item</div>
                </div>
            </button>
        `).join('');

        categoriesContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.cat;
                renderCategories();
                renderMenu();
            });
        });
    }

    // Render Menu Items Grid
    function renderMenu() {
        if (!menuGrid) return;
        
        let filtered = menuItemsList;
        if (currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCategory);
        }
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.name.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query)));
        }

        if (filtered.length === 0) {
            menuGrid.innerHTML = `
                <div class="col-span-full py-12 text-center">
                    <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                        <i class="fa-solid fa-magnifying-glass text-2xl"></i>
                    </div>
                    <h4 class="font-semibold text-slate-700">Menu Tidak Ditemukan</h4>
                    <p class="text-xs text-slate-400 mt-1">Coba kata kunci lain atau pilih kategori yang berbeda.</p>
                </div>
            `;
            return;
        }

        const isAdmin = currentUser && currentUser.role === 'Admin';

        menuGrid.innerHTML = filtered.map(item => `
            <div class="product-card bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-100 flex flex-col justify-between relative group shadow-xs hover:shadow-md cursor-pointer" onclick="window.openCustomModal(${item.id})">
                ${item.badge ? `
                    <span class="absolute top-3 left-3 z-10 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide uppercase rounded-full shadow-xs ${item.badge === 'Bestseller' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-600 text-white'} max-w-[48%] truncate">
                        ${item.badge}
                    </span>
                ` : ''}

                ${item.discountBadge ? `
                    <span class="absolute top-3 right-3 z-10 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold rounded-full bg-rose-500 text-white shadow-xs">
                        ${item.discountBadge}
                    </span>
                ` : ''}

                <div class="overflow-hidden rounded-xl sm:rounded-2xl mb-3 aspect-4/3 bg-slate-50 relative">
                    <img src="${item.image}" alt="${item.name}" class="img-zoom w-full h-full object-cover">
                </div>

                <div class="flex flex-col flex-1">
                    <div class="flex items-center gap-1 mb-1 text-amber-400 text-xs font-medium">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-slate-800">${item.rating || 4.8}</span>
                        <span class="text-slate-400 text-[10px]">(${item.reviewsCount || 50})</span>
                    </div>

                    <h3 class="font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug mb-1 line-clamp-2 min-h-[2.4rem] group-hover:text-emerald-700 transition-colors">
                        ${item.name}
                    </h3>
                    <p class="hidden sm:block text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed min-h-[2rem]">
                        ${item.description || 'Menu lezat khas Green Cafe.'}
                    </p>

                    <div class="mt-auto pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                        <div class="shrink-0">
                            <div class="text-xs sm:text-sm md:text-base font-black text-emerald-800 whitespace-nowrap">
                                ${formatRupiah(item.price)}
                            </div>
                            ${item.originalPrice ? `
                                <div class="text-[9px] sm:text-[11px] text-slate-400 line-through whitespace-nowrap">
                                    ${formatRupiah(item.originalPrice)}
                                </div>
                            ` : ''}
                        </div>

                        <div class="flex items-center gap-1.5 shrink-0">
                            ${isAdmin ? `
                                <button onclick="event.stopPropagation(); window.openEditMenuItemModal(${item.id})" title="Edit Menu" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold transition-all cursor-pointer">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button onclick="event.stopPropagation(); window.deleteMenuItem(${item.id})" title="Hapus Menu" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold transition-all cursor-pointer">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            ` : ''}
                            <button onclick="event.stopPropagation(); window.quickAddToCart(${item.id})" title="Tambah ke Keranjang" class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-sm shadow-emerald-600/20 transition-all cursor-pointer">
                                <i class="fa-solid fa-plus text-xs sm:text-sm"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Quick Add To Cart without Modal
    window.quickAddToCart = function(itemId) {
        const item = menuItemsList.find(m => m.id === itemId);
        if (!item) return;

        const cartIndex = cart.findIndex(c => c.id === itemId && (!c.extras || c.extras.length === 0) && !c.note);
        if (cartIndex > -1) {
            cart[cartIndex].qty += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                qty: 1,
                extras: [],
                note: '',
                unitPrice: item.price
            });
        }

        animateCartBadge();
        renderCart();
    };

    // Open Customization Modal
    window.openCustomModal = function(itemId) {
        const item = menuItemsList.find(m => m.id === itemId);
        if (!item) return;

        currentCustomizingItem = JSON.parse(JSON.stringify(item));
        
        const modal = document.getElementById('custom-modal');
        const content = document.getElementById('custom-modal-content');
        if (!modal || !content) return;

        content.innerHTML = `
            <div class="relative">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover rounded-2xl mb-4">
                <button onclick="window.closeCustomModal()" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            
            <h3 class="font-bold text-lg text-slate-800 mb-1">${item.name}</h3>
            <p class="text-xs text-slate-500 mb-4">${item.description}</p>
            
            ${item.options.sugar ? `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Level Gula:</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${item.options.sugar.map((opt, i) => `
                            <label class="flex items-center gap-2 p-2 border rounded-xl cursor-pointer hover:bg-emerald-50 text-xs">
                                <input type="radio" name="opt-sugar" value="${opt}" ${i === 0 ? 'checked' : ''} class="accent-emerald-600">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${item.options.ice ? `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Level Es:</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${item.options.ice.map((opt, i) => `
                            <label class="flex items-center gap-2 p-2 border rounded-xl cursor-pointer hover:bg-emerald-50 text-xs">
                                <input type="radio" name="opt-ice" value="${opt}" ${i === 0 ? 'checked' : ''} class="accent-emerald-600">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${item.options.spicy ? `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Pedas:</label>
                    <div class="grid grid-cols-3 gap-2">
                        ${item.options.spicy.map((opt, i) => `
                            <label class="flex items-center gap-2 p-2 border rounded-xl cursor-pointer hover:bg-emerald-50 text-xs">
                                <input type="radio" name="opt-spicy" value="${opt}" ${i === 0 ? 'checked' : ''} class="accent-emerald-600">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${item.options.extras && item.options.extras.length > 0 ? `
                <div class="mb-4">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">Tambahan / Extra Topping:</label>
                    <div class="space-y-2">
                        ${item.options.extras.map(extra => `
                            <label class="flex items-center justify-between p-2.5 border rounded-xl cursor-pointer hover:bg-emerald-50 text-xs">
                                <div class="flex items-center gap-2">
                                    <input type="checkbox" name="opt-extra" value="${extra.name}" data-price="${extra.price}" class="extra-checkbox accent-emerald-600">
                                    <span>${extra.name}</span>
                                </div>
                                <span class="font-bold text-emerald-700">+${formatRupiah(extra.price)}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="mb-4">
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Catatan Dapur / Khusus:</label>
                <input type="text" id="item-note-input" placeholder="Misal: Tanpa daun bawang, pisahkan saus" class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                    <span class="text-xs text-slate-400 block">Harga Dasar:</span>
                    <span class="text-base font-extrabold text-emerald-800">${formatRupiah(item.price)}</span>
                </div>
                <button onclick="window.confirmCustomAddToCart()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20">
                    + Tambahkan ke Pesanan
                </button>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closeCustomModal = function() {
        const modal = document.getElementById('custom-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.confirmCustomAddToCart = function() {
        if (!currentCustomizingItem) return;

        const selectedExtras = [];
        let extrasTotal = 0;

        document.querySelectorAll('.extra-checkbox:checked').forEach(cb => {
            const price = parseInt(cb.dataset.price, 10);
            selectedExtras.push({ name: cb.value, price: price });
            extrasTotal += price;
        });

        const sugarRadio = document.querySelector('input[name="opt-sugar"]:checked');
        const iceRadio = document.querySelector('input[name="opt-ice"]:checked');
        const spicyRadio = document.querySelector('input[name="opt-spicy"]:checked');
        const noteInput = document.getElementById('item-note-input');

        const optionLabels = [];
        if (sugarRadio) optionLabels.push(`Sugar: ${sugarRadio.value}`);
        if (iceRadio) optionLabels.push(`Ice: ${iceRadio.value}`);
        if (spicyRadio) optionLabels.push(`Pedas: ${spicyRadio.value}`);

        const itemNote = noteInput ? noteInput.value.trim() : '';

        cart.push({
            id: currentCustomizingItem.id,
            name: currentCustomizingItem.name,
            price: currentCustomizingItem.price + extrasTotal,
            image: currentCustomizingItem.image,
            qty: 1,
            options: optionLabels,
            extras: selectedExtras,
            note: itemNote
        });

        window.closeCustomModal();
        animateCartBadge();
        renderCart();
    };

    // Render Cart Items & Financial Summary
    function renderCart() {
        if (!cartItemsContainer) return;

        const totalItemCount = cart.reduce((sum, i) => sum + i.qty, 0);
        if (cartBadgeCount) cartBadgeCount.innerText = totalItemCount;
        if (cartCountHeader) cartCountHeader.innerText = `(${totalItemCount} Item)`;
        
        const cartBadgeMobile = document.getElementById('cart-badge-count-mobile');
        if (cartBadgeMobile) cartBadgeMobile.innerText = totalItemCount;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="py-16 text-center text-slate-400">
                    <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-basket-shopping text-2xl"></i>
                    </div>
                    <p class="font-semibold text-slate-600 text-sm">Keranjang Masih Kosong</p>
                    <p class="text-xs text-slate-400 mt-1">Pilih menu di sebelah kiri untuk ditambahkan.</p>
                </div>
            `;
            updateCartSummary(0);
            return;
        }

        cartItemsContainer.innerHTML = cart.map((item, idx) => `
            <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex gap-3 relative group">
                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl shrink-0">
                
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-1">
                        <h4 class="font-bold text-xs text-slate-800 truncate">${item.name}</h4>
                        <button onclick="window.removeCartItem(${idx})" class="text-slate-400 hover:text-rose-500 text-xs p-1">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>

                    ${(item.options && item.options.length > 0) || (item.extras && item.extras.length > 0) ? `
                        <div class="text-[10px] text-emerald-800/80 mt-0.5 space-y-0.5">
                            ${item.options ? `<div>${item.options.join(' • ')}</div>` : ''}
                            ${item.extras && item.extras.length > 0 ? `<div>Extra: ${item.extras.map(e => e.name).join(', ')}</div>` : ''}
                        </div>
                    ` : ''}

                    ${item.note ? `<div class="text-[10px] text-amber-700 italic mt-0.5">Note: "${item.note}"</div>` : ''}

                    <div class="flex items-center justify-between mt-2">
                        <span class="font-extrabold text-xs text-emerald-700">${formatRupiah(item.price * item.qty)}</span>

                        <div class="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button onclick="window.updateCartQty(${idx}, -1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="w-7 text-center font-bold text-xs text-slate-800">${item.qty}</span>
                            <button onclick="window.updateCartQty(${idx}, 1)" class="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        updateCartSummary(subtotal);
    }

    window.updateCartQty = function(index, delta) {
        if (!cart[index]) return;
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1);
        }
        renderCart();
    };

    window.removeCartItem = function(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            renderCart();
        }
    };

    // Calculate Cart Totals
    function updateCartSummary(subtotal) {
        let discount = 0;
        if (appliedVoucher) {
            discount = Math.min((subtotal * appliedVoucher.discountPercent) / 100, appliedVoucher.maxDiscount);
        }

        const afterDiscount = Math.max(0, subtotal - discount);
        const tax = Math.round(afterDiscount * 0.10); // 10% PPN
        const service = Math.round(afterDiscount * 0.05); // 5% Service Charge
        const grandTotal = Math.round(afterDiscount + tax + service);

        if (cartSubtotalEl) cartSubtotalEl.innerText = formatRupiah(subtotal);
        if (cartDiscountEl) cartDiscountEl.innerText = `- ${formatRupiah(discount)}`;
        if (cartTaxEl) cartTaxEl.innerText = formatRupiah(tax);
        if (cartServiceEl) cartServiceEl.innerText = formatRupiah(service);
        if (cartGrandTotalEl) cartGrandTotalEl.innerText = formatRupiah(grandTotal);

        // Update Mobile Floating Cart Bar
        const floatBar = document.getElementById('mobile-floating-cart-bar');
        const floatCount = document.getElementById('mobile-float-count');
        const floatTotal = document.getElementById('mobile-float-total');

        if (floatBar) {
            const totalItemCount = cart.reduce((sum, i) => sum + i.qty, 0);
            if (totalItemCount > 0) {
                floatBar.classList.remove('hidden');
                if (floatCount) floatCount.innerText = `${totalItemCount} Item dalam Keranjang`;
                if (floatTotal) floatTotal.innerText = formatRupiah(grandTotal);
            } else {
                floatBar.classList.add('hidden');
            }
        }

        return { subtotal, discount, tax, service, grandTotal };
    }

    function animateCartBadge() {
        if (cartBadgeCount) {
            cartBadgeCount.classList.add('cart-bump');
            setTimeout(() => cartBadgeCount.classList.remove('cart-bump'), 300);
        }
    }

    // Voucher application
    window.applyVoucherCode = function() {
        const input = document.getElementById('voucher-input');
        if (!input) return;
        const code = input.value.trim().toUpperCase();

        const voucher = PROMO_VOUCHERS.find(v => v.code === code);
        if (!voucher) {
            alert('Kode voucher tidak valid!');
            return;
        }

        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        if (subtotal < voucher.minPurchase) {
            alert(`Minimal pembelian untuk voucher ini adalah ${formatRupiah(voucher.minPurchase)}`);
            return;
        }

        appliedVoucher = voucher;
        alert(`Voucher ${voucher.code} berhasil dipasang! (Diskon ${voucher.discountPercent}%)`);
        renderCart();
    };

    // Render Tables Dropdown List
    function renderTablesList() {
        const tableSelect = document.getElementById('table-select');
        if (!tableSelect) return;

        tableSelect.innerHTML = TABLES_LIST.map(tbl => `
            <option value="${tbl.id}" ${tbl.status === 'Occupied' ? 'disabled' : ''}>
                ${tbl.name} (${tbl.capacity} Kursi) ${tbl.status === 'Occupied' ? '- Terisi' : ''}
            </option>
        `).join('');

        tableSelect.addEventListener('change', (e) => {
            selectedTable = parseInt(e.target.value, 10);
        });
    }

    // Render Members List
    function renderMembersList() {
        const memberSelect = document.getElementById('member-select');
        if (!memberSelect) return;

        memberSelect.innerHTML = `
            <option value="">-- Non-Member (Umum) --</option>
            ${MEMBERS_LIST.map(m => `
                <option value="${m.id}">${m.name} (${m.tier} - ${m.points} Pts)</option>
            `).join('')}
        `;

        memberSelect.addEventListener('change', (e) => {
            const memberId = e.target.value;
            selectedMember = MEMBERS_LIST.find(m => m.id === memberId) || null;
            
            const pointsInfo = document.getElementById('member-points-info');
            if (pointsInfo) {
                if (selectedMember) {
                    pointsInfo.innerText = `Points: ${selectedMember.points} Pts | Member Tier: ${selectedMember.tier}`;
                    pointsInfo.classList.remove('hidden');
                } else {
                    pointsInfo.classList.add('hidden');
                }
            }
        });
    }

    // Payment & Checkout Process Modal
    window.openPaymentModal = function() {
        if (cart.length === 0) {
            alert('Keranjang belanja masih kosong! Silakan pilih menu terlebih dahulu.');
            return;
        }

        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const { grandTotal } = updateCartSummary(subtotal);

        document.getElementById('modal-pay-total').innerText = formatRupiah(grandTotal);
        document.getElementById('cash-input').value = grandTotal;
        calculateCashChange();

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closePaymentModal = function() {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.selectPaymentTab = function(method) {
        selectedPaymentMethod = method;
        document.querySelectorAll('.pay-tab').forEach(tab => {
            if (tab.dataset.method === method) {
                tab.classList.add('border-emerald-600', 'bg-emerald-50', 'text-emerald-900', 'font-bold');
                tab.classList.remove('border-slate-200', 'text-slate-600');
            } else {
                tab.classList.remove('border-emerald-600', 'bg-emerald-50', 'text-emerald-900', 'font-bold');
                tab.classList.add('border-slate-200', 'text-slate-600');
            }
        });

        const cashPanel = document.getElementById('pay-panel-cash');
        const qrisPanel = document.getElementById('pay-panel-qris');
        const cardPanel = document.getElementById('pay-panel-card');

        if (cashPanel) cashPanel.classList.toggle('hidden', method !== 'cash');
        if (qrisPanel) qrisPanel.classList.toggle('hidden', method !== 'qris');
        if (cardPanel) cardPanel.classList.toggle('hidden', method !== 'card');
    };

    window.setQuickCash = function(amount) {
        const cashInput = document.getElementById('cash-input');
        if (cashInput) {
            cashInput.value = amount;
            calculateCashChange();
        }
    };

    window.calculateCashChange = function() {
        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const { grandTotal } = updateCartSummary(subtotal);

        const cashInput = document.getElementById('cash-input');
        const changeEl = document.getElementById('cash-change-display');
        const payBtn = document.getElementById('confirm-pay-btn');

        if (!cashInput || !changeEl) return;

        const cashGiven = parseInt(cashInput.value, 10) || 0;
        const change = cashGiven - grandTotal;

        if (change >= 0) {
            changeEl.innerText = formatRupiah(change);
            changeEl.className = 'text-lg font-bold text-emerald-700';
            if (payBtn) payBtn.disabled = false;
        } else {
            changeEl.innerText = `Kurang ${formatRupiah(Math.abs(change))}`;
            changeEl.className = 'text-sm font-bold text-rose-600';
            if (payBtn) payBtn.disabled = true;
        }
    };

    // Finalize Transaction & Save Order
    window.processFinalCheckout = function() {
        const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const { discount, tax, service, grandTotal } = updateCartSummary(subtotal);

        let cashGiven = grandTotal;
        let changeAmount = 0;

        if (selectedPaymentMethod === 'cash') {
            const cashInput = document.getElementById('cash-input');
            cashGiven = parseInt(cashInput.value, 10) || grandTotal;
            changeAmount = cashGiven - grandTotal;
            if (changeAmount < 0) {
                alert('Uang pembayaran tunai masih kurang!');
                return;
            }
        }

        const now = new Date();
        const orderId = `GC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900 + 100))}`;

        const newOrder = {
            id: orderId,
            date: now.toISOString(),
            time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            orderType: selectedOrderType,
            table: selectedOrderType === 'Dine-In' ? `Meja #${selectedTable}` : '-',
            customer: selectedMember ? selectedMember.name : 'Pelanggan Umum',
            memberId: selectedMember ? selectedMember.id : null,
            items: [...cart],
            subtotal: subtotal,
            discount: discount,
            tax: tax,
            service: service,
            grandTotal: grandTotal,
            paymentMethod: selectedPaymentMethod.toUpperCase(),
            cashGiven: cashGiven,
            changeAmount: changeAmount,
            status: 'Dimasak'
        };

        // Add Points to Member
        if (selectedMember) {
            const pointsEarned = Math.floor(grandTotal / 10000);
            selectedMember.points += pointsEarned;
        }

        ordersHistory.unshift(newOrder);
        localStorage.setItem('green_cafe_orders', JSON.stringify(ordersHistory));

        // Sync order to Google Sheets Database if configured
        const DEFAULT_GSHEET_URL = 'https://script.google.com/macros/s/AKfycbwc6FPWDPxRLeUw6n3_tP4-gV8f6nr9Ds20v0TuM5qsORn2fX4KVpoeEDAKRB9m-bZ2OA/exec';
        const gsheetUrl = localStorage.getItem('green_cafe_gsheet_url') || DEFAULT_GSHEET_URL;
        if (gsheetUrl && gsheetUrl.trim() !== '') {
            try {
                fetch(gsheetUrl.trim(), {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify(newOrder)
                }).then(() => console.log('Order synced to Google Sheets database!'))
                  .catch(err => console.warn('Google Sheets sync notice:', err));
            } catch (e) {
                console.warn('Sync warning:', e);
            }
        }

        window.closePaymentModal();
        showReceiptModal(newOrder);

        // Reset Cart & State
        cart = [];
        appliedVoucher = null;
        selectedMember = null;
        renderCart();
        renderOrderHistory();
        renderAnalytics();
    };

    // Show Receipt Modal
    function showReceiptModal(order) {
        const modal = document.getElementById('receipt-modal');
        const container = document.getElementById('thermal-receipt-printable');
        if (!modal || !container) return;

        container.innerHTML = `
            <div class="text-center mb-3">
                <div class="text-base font-extrabold tracking-wider">🍃 GREEN CAFE 🍃</div>
                <div class="text-[11px] text-slate-500">Jl. Fresh Organic No. 88, Jakarta</div>
                <div class="text-[11px] text-slate-500">Telp: (021) 555-8899</div>
                <div class="text-[10px] text-slate-400">--------------------------------</div>
            </div>

            <div class="text-[11px] space-y-1 mb-3">
                <div class="flex justify-between">
                    <span>No. Nota:</span>
                    <span class="font-bold">${order.id}</span>
                </div>
                <div class="flex justify-between">
                    <span>Waktu:</span>
                    <span>${new Date(order.date).toLocaleDateString('id-ID')} ${order.time}</span>
                </div>
                <div class="flex justify-between">
                    <span>Tipe / Meja:</span>
                    <span>${order.orderType} (${order.table})</span>
                </div>
                <div class="flex justify-between">
                    <span>Kasir:</span>
                    <span>Sarah A.</span>
                </div>
                <div class="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>${order.customer}</span>
                </div>
            </div>

            <div class="text-[10px] text-slate-400">--------------------------------</div>

            <div class="space-y-2 my-2 text-[11px]">
                ${order.items.map(item => `
                    <div>
                        <div class="font-bold flex justify-between">
                            <span>${item.name}</span>
                            <span>${formatRupiah(item.price * item.qty)}</span>
                        </div>
                        <div class="text-[10px] text-slate-500 flex justify-between">
                            <span>${item.qty} x ${formatRupiah(item.price)}</span>
                            <span></span>
                        </div>
                        ${item.options && item.options.length > 0 ? `<div class="text-[9px] text-slate-400">* ${item.options.join(', ')}</div>` : ''}
                        ${item.note ? `<div class="text-[9px] text-amber-700">* Note: ${item.note}</div>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="text-[10px] text-slate-400">--------------------------------</div>

            <div class="text-[11px] space-y-1 my-2">
                <div class="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${formatRupiah(order.subtotal)}</span>
                </div>
                ${order.discount > 0 ? `
                    <div class="flex justify-between text-rose-600">
                        <span>Diskon Promo:</span>
                        <span>-${formatRupiah(order.discount)}</span>
                    </div>
                ` : ''}
                <div class="flex justify-between">
                    <span>PPN (10%):</span>
                    <span>${formatRupiah(order.tax)}</span>
                </div>
                <div class="flex justify-between">
                    <span>Service (5%):</span>
                    <span>${formatRupiah(order.service)}</span>
                </div>
                <div class="flex justify-between font-extrabold text-xs pt-1 border-t border-slate-300">
                    <span>TOTAL PAS:</span>
                    <span>${formatRupiah(order.grandTotal)}</span>
                </div>
            </div>

            <div class="text-[10px] text-slate-400">--------------------------------</div>

            <div class="text-[11px] space-y-1 my-2">
                <div class="flex justify-between">
                    <span>Bayar (${order.paymentMethod}):</span>
                    <span>${formatRupiah(order.cashGiven)}</span>
                </div>
                <div class="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>${formatRupiah(order.changeAmount)}</span>
                </div>
            </div>

            <div class="text-center mt-4 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 space-y-1">
                <div>Terima Kasih Atas Kunjungan Anda!</div>
                <div>"Good Food, Good Mood"</div>
                <div>Follow IG: @greencafe.id</div>
            </div>
        `;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    window.closeReceiptModal = function() {
        const modal = document.getElementById('receipt-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.printReceipt = function() {
        window.print();
    };

    // Render Order Queue & History Tab
    function renderOrderHistory() {
        const container = document.getElementById('order-history-list');
        if (!container) return;

        if (ordersHistory.length === 0) {
            container.innerHTML = `
                <div class="py-12 text-center text-slate-400">
                    <i class="fa-solid fa-receipt text-3xl mb-2"></i>
                    <p class="font-semibold text-sm">Belum Ada Transaksi</p>
                </div>
            `;
            return;
        }

        container.innerHTML = ordersHistory.map(ord => `
            <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="font-bold text-sm text-slate-800">${ord.id}</span>
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${ord.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                            ${ord.status}
                        </span>
                        <span class="text-xs text-slate-400">• ${ord.time}</span>
                    </div>
                    <div class="text-xs text-slate-500">
                        ${ord.customer} (${ord.orderType} ${ord.table}) • <span class="font-semibold text-slate-700">${ord.items.length} Item</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div class="text-right">
                        <div class="text-xs text-slate-400">${ord.paymentMethod}</div>
                        <div class="text-sm font-extrabold text-emerald-800">${formatRupiah(ord.grandTotal)}</div>
                    </div>
                    <button onclick="window.reprintOrderReceipt('${ord.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">
                        <i class="fa-solid fa-print mr-1"></i> Struk
                    </button>
                </div>
            </div>
        `).join('');
    }

    window.reprintOrderReceipt = function(orderId) {
        const ord = ordersHistory.find(o => o.id === orderId);
        if (ord) showReceiptModal(ord);
    };

    // Render Analytics Overview
    function renderAnalytics() {
        const totalSalesEl = document.getElementById('stat-total-sales');
        const countTransEl = document.getElementById('stat-count-trans');
        const avgTransEl = document.getElementById('stat-avg-trans');

        const totalRevenue = ordersHistory.reduce((sum, o) => sum + o.grandTotal, 0);
        const transCount = ordersHistory.length;
        const avgRevenue = transCount > 0 ? Math.round(totalRevenue / transCount) : 0;

        if (totalSalesEl) totalSalesEl.innerText = formatRupiah(totalRevenue);
        if (countTransEl) countTransEl.innerText = transCount;
        if (avgTransEl) avgTransEl.innerText = formatRupiah(avgRevenue);
    }

    // Tab Navigation Handling
    function setupEventListeners() {
        // Search Input
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                renderMenu();
            });
        }

        // Shortcut Key for Search ('/' or Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
                e.preventDefault();
                if (searchInput) searchInput.focus();
            }
        });

    window.switchTab = function(targetTab) {
        if (!targetTab) return;

        // Security Role Check for Admin-only tabs
        if ((targetTab === 'settings' || targetTab === 'analytics') && currentUser && currentUser.role === 'Kasir') {
            alert('🔒 Akses Dibatasi! Halaman Pengaturan POS & Laporan Penjualan hanya dapat diakses oleh akun Mode Admin.');
            return;
        }

        // Update active class on all nav links
        document.querySelectorAll('.nav-link').forEach(l => {
            if (l.dataset.tab === targetTab) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });

        // Hide all tab sections & show target section
        document.querySelectorAll('.tab-content').forEach(section => {
            section.classList.add('hidden');
        });

        const targetSection = document.getElementById(`tab-${targetTab}`);
        if (targetSection) targetSection.classList.remove('hidden');

        // Scroll main content container to top
        const mainContainer = document.querySelector('main > div');
        if (mainContainer) mainContainer.scrollTop = 0;

        // Auto Close Mobile Drawers on small screens
        if (window.innerWidth < 768) {
            const sidebar = document.getElementById('sidebar');
            const sidebarBackdrop = document.getElementById('sidebar-backdrop');
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
        }
    };

    // Sidebar Links Switcher
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            if (targetTab) window.switchTab(targetTab);
        });
    });

        // Order Type Selector Buttons
        document.querySelectorAll('.order-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedOrderType = btn.dataset.type;
                document.querySelectorAll('.order-type-btn').forEach(b => {
                    b.classList.remove('bg-emerald-600', 'text-white', 'shadow-sm');
                    b.classList.add('bg-slate-100', 'text-slate-600');
                });
                btn.classList.remove('bg-slate-100', 'text-slate-600');
                btn.classList.add('bg-emerald-600', 'text-white', 'shadow-sm');

                const tableContainer = document.getElementById('table-select-container');
                if (tableContainer) {
                    tableContainer.classList.toggle('hidden', selectedOrderType !== 'Dine-In');
                }
            });
        });

        // Cash Input Auto Calculator
        const cashInput = document.getElementById('cash-input');
        if (cashInput) {
            cashInput.addEventListener('input', calculateCashChange);
        }

        // Load saved Google Sheets URL into input field
        const DEFAULT_GSHEET_URL = 'https://script.google.com/macros/s/AKfycbwc6FPWDPxRLeUw6n3_tP4-gV8f6nr9Ds20v0TuM5qsORn2fX4KVpoeEDAKRB9m-bZ2OA/exec';
        const gsheetInput = document.getElementById('gsheet-url-input');
        if (gsheetInput) {
            gsheetInput.value = localStorage.getItem('green_cafe_gsheet_url') || DEFAULT_GSHEET_URL;
        }
    }

    window.saveSettings = function() {
        const gsheetInput = document.getElementById('gsheet-url-input');
        if (gsheetInput) {
            const url = gsheetInput.value.trim();
            localStorage.setItem('green_cafe_gsheet_url', url);
            alert('Pengaturan POS dan URL Google Sheets Database berhasil disimpan!');
        }
    };

    // Admin Menu & Price Management Functions
    window.openAddMenuItemModal = function() {
        document.getElementById('edit-menu-item-modal-title').innerText = 'Tambah Menu Baru';
        document.getElementById('edit-item-id').value = '';
        document.getElementById('edit-item-name').value = '';
        document.getElementById('edit-item-category').value = 'coffee';
        document.getElementById('edit-item-price').value = '';
        document.getElementById('edit-item-original-price').value = '';
        document.getElementById('edit-item-badge').value = '';
        document.getElementById('edit-item-image').value = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
        document.getElementById('edit-item-desc').value = '';

        const modal = document.getElementById('edit-menu-item-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    window.openEditMenuItemModal = function(itemId) {
        const item = menuItemsList.find(m => m.id === itemId);
        if (!item) return;

        document.getElementById('edit-menu-item-modal-title').innerText = `Edit Menu & Harga: ${item.name}`;
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-category').value = item.category;
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-original-price').value = item.originalPrice || '';
        document.getElementById('edit-item-badge').value = item.badge || '';
        document.getElementById('edit-item-image').value = item.image || '';
        document.getElementById('edit-item-desc').value = item.description || '';

        const modal = document.getElementById('edit-menu-item-modal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    window.closeEditMenuItemModal = function() {
        const modal = document.getElementById('edit-menu-item-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    window.saveMenuItemChanges = function(event) {
        event.preventDefault();
        const idStr = document.getElementById('edit-item-id').value;
        const name = document.getElementById('edit-item-name').value.trim();
        const category = document.getElementById('edit-item-category').value;
        const price = parseInt(document.getElementById('edit-item-price').value, 10) || 0;
        const originalPriceStr = document.getElementById('edit-item-original-price').value;
        const originalPrice = originalPriceStr ? parseInt(originalPriceStr, 10) : null;
        const badge = document.getElementById('edit-item-badge').value.trim();
        const image = document.getElementById('edit-item-image').value.trim();
        const description = document.getElementById('edit-item-desc').value.trim();

        if (idStr === '') {
            // New Item
            const newId = menuItemsList.length > 0 ? Math.max(...menuItemsList.map(m => m.id)) + 1 : 101;
            menuItemsList.push({
                id: newId,
                name,
                category,
                price,
                originalPrice,
                rating: 4.8,
                reviewsCount: 1,
                badge: badge || null,
                discountBadge: originalPrice && originalPrice > price ? `${Math.round((1 - price / originalPrice) * 100)}% OFF` : null,
                image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                description: description || 'Menu lezat khas Green Cafe.',
                options: {}
            });
        } else {
            // Edit Existing
            const id = parseInt(idStr, 10);
            const idx = menuItemsList.findIndex(m => m.id === id);
            if (idx > -1) {
                menuItemsList[idx] = {
                    ...menuItemsList[idx],
                    name,
                    category,
                    price,
                    originalPrice,
                    badge: badge || null,
                    discountBadge: originalPrice && originalPrice > price ? `${Math.round((1 - price / originalPrice) * 100)}% OFF` : null,
                    image,
                    description
                };
            }
        }

        saveMenuItemsList();
        window.closeEditMenuItemModal();
        alert('Menu dan harga berhasil diperbarui!');
    };

    // Responsive Mobile Drawers Toggle (Applies ONLY on mobile/tablet screens)
    window.toggleMobileSidebar = function() {
        if (window.innerWidth >= 768) return;
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (!sidebar) return;

        sidebar.classList.toggle('mobile-open');
        if (backdrop) {
            backdrop.classList.toggle('hidden', !sidebar.classList.contains('mobile-open'));
        }
    };

    window.toggleCartDrawer = function() {
        if (window.innerWidth >= 1024) return;
        const cartDrawer = document.getElementById('cart-drawer');
        const backdrop = document.getElementById('cart-backdrop');
        if (!cartDrawer) return;

        cartDrawer.classList.toggle('mobile-open');
        if (backdrop) {
            backdrop.classList.toggle('hidden', !cartDrawer.classList.contains('mobile-open'));
        }
    };

    // Start App
    init();
});
