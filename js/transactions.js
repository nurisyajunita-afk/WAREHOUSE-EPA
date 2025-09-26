// ========================================= 
// TRANSACTION MANAGEMENT - transactions.js
// ========================================= 

// Transaction functions
function setupTransactionForms() {
    const formsContainer = document.getElementById('transactionForms');
    formsContainer.innerHTML = '';
    
    if (!currentUser.permissions.createTransactions) {
        return;
    }
    
    // Barang Masuk Form
    formsContainer.innerHTML += `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span class="bg-green-100 p-2 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                    </svg>
                </span>
                Barang Masuk
            </h3>
            <form id="incomingForm" onsubmit="addIncomingTransaction(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                        <select id="incomingItemCode" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih Barang</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                        <input type="number" id="incomingQuantity" required min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input type="text" id="incomingSupplier" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <textarea id="incomingNote" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="2"></textarea>
                    </div>
                    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Simpan Barang Masuk
                    </button>
                </div>
            </form>
        </div>
    `;
    
    // Barang Keluar Form
    formsContainer.innerHTML += `
        <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span class="bg-red-100 p-2 rounded-lg mr-3">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </span>
                Barang Keluar
            </h3>
            <form id="outgoingForm" onsubmit="addOutgoingTransaction(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Barang</label>
                        <select id="outgoingItemCode" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih Barang</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                        <input type="number" id="outgoingQuantity" required min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Divisi</label>
                        <select id="outgoingDivision" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih Divisi</option>
                            <option value="IT">IT</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Security">Security</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Housekeeping">Housekeeping</option>
                            <option value="Back Office">Back Office</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Peminta</label>
                        <input type="text" id="outgoingRequester" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
                        <input type="text" id="outgoingDestination" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Simpan Barang Keluar
                    </button>
                </div>
            </form>
        </div>
    `;
}

function loadTransactions() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    
    transactions.slice(0, 10).forEach(transaction => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const typeClass = transaction.type === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        const typeText = transaction.type === 'masuk' ? 'Masuk' : 'Keluar';
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm text-gray-900">${new Date(transaction.date).toLocaleDateString('id-ID')}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${transaction.time}</td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeClass}">
                    ${typeText}
                </span>
            </td>
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${transaction.code}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${transaction.quantity}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${transaction.division}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${transaction.note}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function populateTransactionItems() {
    if (!currentUser.permissions.createTransactions) {
        return;
    }
    
    const incomingSelect = document.getElementById('incomingItemCode');
    const outgoingSelect = document.getElementById('outgoingItemCode');
    
    if (incomingSelect) {
        incomingSelect.innerHTML = '<option value="">Pilih Barang</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = `${item.code} - ${item.name}`;
            incomingSelect.appendChild(option);
        });
    }
    
    if (outgoingSelect) {
        outgoingSelect.innerHTML = '<option value="">Pilih Barang</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = `${item.code} - ${item.name} (Stok: ${item.stock})`;
            outgoingSelect.appendChild(option);
        });
    }
}

function addIncomingTransaction(event) {
    event.preventDefault();
    
    if (!currentUser.permissions.createTransactions) {
        alert('Anda tidak memiliki izin untuk membuat transaksi.');
        return;
    }
    
    const itemCode = document.getElementById('incomingItemCode').value;
    const quantity = parseInt(document.getElementById('incomingQuantity').value);
    const supplier = document.getElementById('incomingSupplier').value;
    const note = document.getElementById('incomingNote').value;
    
    // Update item stock
    const item = items.find(i => i.code === itemCode);
    let itemName = 'Unknown Item';
    if (item) {
        itemName = item.name;
        item.stock += quantity;
        item.status = item.stock <= item.minStock ? 'Rendah' : 'Normal';
    }
    
    const newTransaction = {
        id: 'TRX' + String(transactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'masuk',
        code: itemCode,
        quantity: quantity,
        division: '-',
        supplier: supplier,
        note: note
    };
    
    transactions.unshift(newTransaction);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Add activity log
    addActivity('transaction_in', `Barang masuk: ${itemName} sebanyak ${quantity} unit dari ${supplier}`);
    
    loadTransactions();
    updateDashboardStats();
    document.getElementById('incomingForm').reset();
    
    alert('Transaksi barang masuk berhasil disimpan!');
}

function addOutgoingTransaction(event) {
    event.preventDefault();
    
    if (!currentUser.permissions.createTransactions) {
        alert('Anda tidak memiliki izin untuk membuat transaksi.');
        return;
    }
    
    const itemCode = document.getElementById('outgoingItemCode').value;
    const quantity = parseInt(document.getElementById('outgoingQuantity').value);
    const division = document.getElementById('outgoingDivision').value;
    const requester = document.getElementById('outgoingRequester').value;
    const destination = document.getElementById('outgoingDestination').value;
    
    // Check and update item stock
    const item = items.find(i => i.code === itemCode);
    let itemName = 'Unknown Item';
    if (item) {
        itemName = item.name;
        if (item.stock >= quantity) {
            item.stock -= quantity;
            item.status = item.stock <= item.minStock ? 'Rendah' : 'Normal';
        } else {
            alert('Stok tidak mencukupi! Stok tersedia: ' + item.stock);
            return;
        }
    }
    
    const newTransaction = {
        id: 'TRX' + String(transactions.length + 1).padStart(3, '0'),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'keluar',
        code: itemCode,
        quantity: quantity,
        division: division,
        requester: requester,
        destination: destination,
        note: `Untuk ${requester} - ${destination}`
    };
    
    transactions.unshift(newTransaction);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Add activity log
    addActivity('transaction_out', `Barang keluar: ${itemName} sebanyak ${quantity} unit untuk ${division} (${requester})`);
    
    loadTransactions();
    updateDashboardStats();
    populateTransactionItems(); // Refresh stock info
    document.getElementById('outgoingForm').reset();
    
    alert('Transaksi barang keluar berhasil disimpan!');
}