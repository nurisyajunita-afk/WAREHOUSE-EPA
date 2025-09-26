// ========================================= 
// UI MANAGEMENT & NAVIGATION - ui.js
// ========================================= 

// Login functions
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (userRoles[username] && userRoles[username].password === password) {
        currentUser = {
            username: username,
            ...userRoles[username]
        };
        
        // Save session
        saveUserSession();
        
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        initializeUserInterface();
        updateDashboardStats();
        loadRecentActivities();
        updateNotificationBadge();
    } else {
        alert('Username atau password salah!');
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        currentUser = null;
        isViewOnlyMode = false;
        
        // Clear session
        clearUserSession();
        
        // Reset to login screen
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('loginForm').reset();
        
        // Reset all sections to hidden
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show dashboard by default when logging back in
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Clear any modals
        document.getElementById('addItemModal').classList.add('hidden');
        document.getElementById('requestModal').classList.add('hidden');
        
        alert('Anda telah berhasil keluar dari sistem.');
    }
}

// Toggle view mode function
function toggleViewMode(mode) {
    isViewOnlyMode = (mode === 'view');
    
    const editBtn = document.getElementById('editModeBtn');
    const viewBtn = document.getElementById('viewModeBtn');
    const addBtn = document.getElementById('addItemBtn');
    const actionColumn = document.getElementById('actionColumn');
    
    if (isViewOnlyMode) {
        editBtn.classList.remove('bg-blue-600', 'text-white');
        editBtn.classList.add('text-gray-600', 'hover:text-gray-800');
        viewBtn.classList.remove('text-gray-600', 'hover:text-gray-800');
        viewBtn.classList.add('bg-blue-600', 'text-white');
        
        if (addBtn) addBtn.classList.add('hidden');
        if (actionColumn) actionColumn.classList.add('hidden');
    } else {
        viewBtn.classList.remove('bg-blue-600', 'text-white');
        viewBtn.classList.add('text-gray-600', 'hover:text-gray-800');
        editBtn.classList.remove('text-gray-600', 'hover:text-gray-800');
        editBtn.classList.add('bg-blue-600', 'text-white');
        
        if (currentUser.permissions.editInventory && addBtn) addBtn.classList.remove('hidden');
        if (currentUser.permissions.editInventory && actionColumn) actionColumn.classList.remove('hidden');
    }
    
    loadItems(); // Refresh the table
}

// Initialize user interface based on role
function initializeUserInterface() {
    // Update user info
    document.getElementById('currentUserName').textContent = currentUser.displayName;
    document.getElementById('currentUserRole').textContent = currentUser.name;
    document.getElementById('userInitials').textContent = currentUser.initials;
    
    // Setup navigation
    setupNavigation();
    
    // Setup quick actions
    setupQuickActions();
    
    // Auto-fill user info for division users
    if (currentUser.division) {
        setTimeout(() => {
            const requesterName = document.getElementById('requesterName');
            const requesterDivision = document.getElementById('requesterDivision');
            if (requesterName && requesterDivision) {
                requesterName.value = currentUser.displayName;
                requesterDivision.value = currentUser.division;
                requesterName.readOnly = true;
                requesterDivision.disabled = true;
            }
        }, 100);
    }
}

function setupNavigation() {
    const nav = document.getElementById('navigationMenu');
    nav.innerHTML = '';
    
    // Dashboard - always visible
    nav.innerHTML += `
        <button onclick="showSection('dashboard')" class="nav-btn py-4 px-3 border-b-2 border-blue-600 text-blue-600 font-medium whitespace-nowrap">
            📊 Dashboard
        </button>
    `;
    
    // Inventory
    if (currentUser.permissions.viewInventory) {
        nav.innerHTML += `
            <button onclick="showSection('inventory')" class="nav-btn py-4 px-3 border-b-2 border-transparent text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">
                📦 Kelola Inventory
            </button>
        `;
    }
    
    // Requests
    if (currentUser.permissions.viewRequests) {
        nav.innerHTML += `
            <button onclick="showSection('requests')" class="nav-btn py-4 px-3 border-b-2 border-transparent text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">
                📋 Permintaan Barang
            </button>
        `;
    }
    
    // Transactions
    if (currentUser.permissions.viewTransactions) {
        nav.innerHTML += `
            <button onclick="showSection('transactions')" class="nav-btn py-4 px-3 border-b-2 border-transparent text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">
                🔄 Transaksi
            </button>
        `;
    }
    
    // Reports
    if (currentUser.permissions.viewReports) {
        nav.innerHTML += `
            <button onclick="showSection('reports')" class="nav-btn py-4 px-3 border-b-2 border-transparent text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap">
                📈 Laporan
            </button>
        `;
    }
}

function setupQuickActions() {
    const quickActions = document.getElementById('quickActions');
    quickActions.innerHTML = '';
    
    if (currentUser.permissions.viewInventory) {
        quickActions.innerHTML += `
            <button onclick="showSection('inventory')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left group">
                <div class="flex items-center space-x-4">
                    <div class="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Kelola Inventory</h3>
                        <p class="text-sm text-gray-600">${currentUser.permissions.editInventory ? 'Lihat & kelola stok barang' : 'Lihat stok barang'}</p>
                    </div>
                </div>
            </button>
        `;
    }
    
    if (currentUser.permissions.viewRequests) {
        quickActions.innerHTML += `
            <button onclick="showSection('requests')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left group">
                <div class="flex items-center space-x-4">
                    <div class="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Permintaan Barang</h3>
                        <p class="text-sm text-gray-600">Sistem otorisasi 3 tingkat</p>
                    </div>
                </div>
            </button>
        `;
    }
    
    if (currentUser.permissions.viewTransactions) {
        quickActions.innerHTML += `
            <button onclick="showSection('transactions')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left group">
                <div class="flex items-center space-x-4">
                    <div class="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Transaksi</h3>
                        <p class="text-sm text-gray-600">Barang masuk & keluar</p>
                    </div>
                </div>
            </button>
        `;
    }
    
    if (currentUser.permissions.viewReports) {
        quickActions.innerHTML += `
            <button onclick="showSection('reports')" class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-left group">
                <div class="flex items-center space-x-4">
                    <div class="bg-orange-100 p-3 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">Laporan</h3>
                        <p class="text-sm text-gray-600">Analisis & laporan gudang</p>
                    </div>
                </div>
            </button>
        `;
    }
}

// Notification system
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    const count = document.getElementById('notificationCount');
    
    if (currentUser.username === 'building_manager') {
        const pendingRequests = requests.filter(r => r.status === 'Menunggu Manager').length;
        
        if (pendingRequests > 0) {
            badge.classList.remove('hidden');
            count.textContent = pendingRequests;
        } else {
            badge.classList.add('hidden');
        }
    } else {
        badge.classList.add('hidden');
    }
}

// Navigation functions
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionName).classList.remove('hidden');
    document.getElementById(sectionName).classList.add('fade-in');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-600');
    });
    
    event.target.classList.remove('border-transparent', 'text-gray-600');
    event.target.classList.add('border-blue-600', 'text-blue-600');
    
    if (sectionName === 'inventory') {
        loadItems();
    } else if (sectionName === 'requests') {
        loadRequests();
        populateRequestItems();
    } else if (sectionName === 'transactions') {
        loadTransactions();
        setupTransactionForms();
        populateTransactionItems();
    } else if (sectionName === 'dashboard') {
        loadRecentActivities();
    } else if (sectionName === 'reports') {
        setupReportsSection();
    }
}