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
    
    // Init Application
    function init() {
        renderCategories();
        renderMenu();
        renderCart();
        renderTablesList();
        renderMembersList();
        renderOrderHistory();
        renderAnalytics();
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
                    <div class="text-xs text-slate-400">${cat.id === 'all' ? MENU_ITEMS.length : MENU_ITEMS.filter(m => m.category === cat.id).length} Item</div>
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
        
        let filtered = MENU_ITEMS;
        if (currentCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCategory);
        }
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
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

        menuGrid.innerHTML = filtered.map(item => `
            <div class="product-card bg-white rounded-3xl p-4 border border-slate-100 flex flex-col justify-between relative group shadow-sm hover:shadow-md">
                ${item.badge ? `
                    <span class="absolute top-6 left-6 z-10 px-3 py-1 text-[11px] font-bold tracking-wide uppercase rounded-full shadow-sm ${item.badge === 'Bestseller' ? 'bg-amber-400 text-amber-950' : 'bg-emerald-600 text-white'}">
                        ${item.badge}
                    </span>
                ` : ''}

                ${item.discountBadge ? `
                    <span class="absolute top-6 right-6 z-10 px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-500 text-white shadow-sm">
                        ${item.discountBadge}
                    </span>
                ` : ''}

                <div class="overflow-hidden rounded-2xl mb-3 aspect-4/3 bg-slate-50 relative cursor-pointer" onclick="window.openCustomModal(${item.id})">
                    <img src="${item.image}" alt="${item.name}" class="img-zoom w-full h-full object-cover">
                </div>

                <div class="flex flex-col flex-1">
                    <div class="flex items-center gap-1.5 mb-1 text-amber-400 text-xs font-medium">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-slate-800">${item.rating}</span>
                        <span class="text-slate-400">(${item.reviewsCount})</span>
                    </div>

                    <h3 class="font-bold text-slate-800 text-base leading-tight mb-1 group-hover:text-emerald-700 transition-colors cursor-pointer" onclick="window.openCustomModal(${item.id})">
                        ${item.name}
                    </h3>
                    <p class="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        ${item.description}
                    </p>

                    <div class="mt-auto pt-2 flex items-center justify-between border-t border-slate-100">
                        <div>
                            <div class="text-base font-extrabold text-emerald-800">
                                ${formatRupiah(item.price)}
                            </div>
                            ${item.originalPrice ? `
                                <div class="text-[11px] text-slate-400 line-through">
                                    ${formatRupiah(item.originalPrice)}
                                </div>
                            ` : ''}
                        </div>

                        <button onclick="window.quickAddToCart(${item.id})" class="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 transition-all cursor-pointer">
                            <i class="fa-solid fa-plus text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Quick Add To Cart without Modal
    window.quickAddToCart = function(itemId) {
        const item = MENU_ITEMS.find(m => m.id === itemId);
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
        const item = MENU_ITEMS.find(m => m.id === itemId);
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

        // Sidebar Links Switcher
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = link.dataset.tab;
                if (!targetTab) return;

                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                document.querySelectorAll('.tab-content').forEach(section => {
                    section.classList.add('hidden');
                });

                const targetSection = document.getElementById(`tab-${targetTab}`);
                if (targetSection) targetSection.classList.remove('hidden');
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
    }

    // Start App
    init();
});
