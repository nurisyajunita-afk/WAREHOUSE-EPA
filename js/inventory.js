// ========================================= 
// INVENTORY MANAGEMENT - inventory.js
// ========================================= 

// Item management functions
function loadItems() {
    const tbody = document.getElementById('itemsTableBody');
    const addBtn = document.getElementById('addItemBtn');
    const actionColumn = document.getElementById('actionColumn');
    const itemCount = document.getElementById('itemCount');
    const viewModeToggle = document.getElementById('viewModeToggle');
    
    // Show/hide view mode toggle based on permissions
    if (currentUser.permissions.editInventory) {
        viewModeToggle.classList.remove('hidden');
    } else {
        viewModeToggle.classList.add('hidden');
    }
    
    // Show/hide add button and action column based on permissions and view mode
    if (currentUser.permissions.editInventory && !isViewOnlyMode) {
        addBtn.classList.remove('hidden');
        actionColumn.classList.remove('hidden');
    } else {
        addBtn.classList.add('hidden');
        actionColumn.classList.add('hidden');
    }
    
    tbody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusClass = item.status === 'Rendah' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        
        // Type badges
        const typeIcon = item.type === 'Capex' ? '💰' : '🔄';
        const typeClass = item.type === 'Capex' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
        
        // Classification badges
        let classIcon = '📦';
        let classClass = 'bg-gray-100 text-gray-800';
        if (item.classification === 'Asset') {
            classIcon = '🏢';
            classClass = 'bg-purple-100 text-purple-800';
        } else if (item.classification === 'Non-Consumable') {
            classIcon = '🔧';
            classClass = 'bg-orange-100 text-orange-800';
        }
        
        // Movement badges
        let movementIcon = '📊';
        let movementClass = 'bg-blue-100 text-blue-800';
        if (item.movement === 'Fast Moving') {
            movementIcon = '🚀';
            movementClass = 'bg-green-100 text-green-800';
        } else if (item.movement === 'Slow Moving') {
            movementIcon = '🐌';
            movementClass = 'bg-red-100 text-red-800';
        }
        
        let actionCell = '';
        if (currentUser.permissions.editInventory && !isViewOnlyMode) {
            actionCell = `
                <td class="px-4 py-3 text-sm">
                    <button onclick="editItem(${item.id})" class="text-blue-600 hover:text-blue-800 mr-3" title="Edit barang">✏️</button>
                    <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-800" title="Hapus barang">🗑️</button>
                </td>
            `;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${item.code}</td>
            <td class="px-4 py-3 text-sm text-gray-900" title="${item.description || ''}">${item.name}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${item.category}</td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${typeClass}">
                    ${typeIcon} ${item.type}
                </span>
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${classClass}">
                    ${classIcon} ${item.classification}
                </span>
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${movementClass}">
                    ${movementIcon} ${item.movement}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">${item.stock}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${item.minStock}</td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                    ${item.status === 'Rendah' ? '⚠️' : '✅'} ${item.status}
                </span>
            </td>
            ${actionCell}
        `;
        
        tbody.appendChild(row);
    });
    
    // Update item count
    if (itemCount) {
        itemCount.textContent = items.length;
    }
}

function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const classificationFilter = document.getElementById('classificationFilter').value;
    const movementFilter = document.getElementById('movementFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) || 
                            item.code.toLowerCase().includes(searchTerm) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesClassification = !classificationFilter || item.classification === classificationFilter;
        const matchesMovement = !movementFilter || item.movement === movementFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesType && matchesClassification && matchesMovement && matchesStatus;
    });
    
    const tbody = document.getElementById('itemsTableBody');
    const itemCount = document.getElementById('itemCount');
    tbody.innerHTML = '';
    
    filteredItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusClass = item.status === 'Rendah' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        
        // Type badges
        const typeIcon = item.type === 'Capex' ? '💰' : '🔄';
        const typeClass = item.type === 'Capex' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800';
        
        // Classification badges
        let classIcon = '📦';
        let classClass = 'bg-gray-100 text-gray-800';
        if (item.classification === 'Asset') {
            classIcon = '🏢';
            classClass = 'bg-purple-100 text-purple-800';
        } else if (item.classification === 'Non-Consumable') {
            classIcon = '🔧';
            classClass = 'bg-orange-100 text-orange-800';
        }
        
        // Movement badges
        let movementIcon = '📊';
        let movementClass = 'bg-blue-100 text-blue-800';
        if (item.movement === 'Fast Moving') {
            movementIcon = '🚀';
            movementClass = 'bg-green-100 text-green-800';
        } else if (item.movement === 'Slow Moving') {
            movementIcon = '🐌';
            movementClass = 'bg-red-100 text-red-800';
        }
        
        let actionCell = '';
        if (currentUser.permissions.editInventory && !isViewOnlyMode) {
            actionCell = `
                <td class="px-4 py-3 text-sm">
                    <button onclick="editItem(${item.id})" class="text-blue-600 hover:text-blue-800 mr-3" title="Edit barang">✏️</button>
                    <button onclick="deleteItem(${item.id})" class="text-red-600 hover:text-red-800" title="Hapus barang">🗑️</button>
                </td>
            `;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${item.code}</td>
            <td class="px-4 py-3 text-sm text-gray-900" title="${item.description || ''}">${item.name}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${item.category}</td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${typeClass}">
                    ${typeIcon} ${item.type}
                </span>
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${classClass}">
                    ${classIcon} ${item.classification}
                </span>
            </td>
            <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${movementClass}">
                    ${movementIcon} ${item.movement}
                </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">${item.stock}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${item.minStock}</td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                    ${item.status === 'Rendah' ? '⚠️' : '✅'} ${item.status}
                </span>
            </td>
            ${actionCell}
        `;
        
        tbody.appendChild(row);
    });
    
    // Update filtered item count
    if (itemCount) {
        itemCount.textContent = filteredItems.length;
    }
}

// Modal functions for items
function showAddItemModal() {
    if (!currentUser.permissions.editInventory) {
        alert('Anda tidak memiliki izin untuk menambah barang.');
        return;
    }
    document.getElementById('addItemModal').classList.remove('hidden');
    document.getElementById('addItemModal').classList.add('flex');
}

function closeAddItemModal() {
    document.getElementById('addItemModal').classList.add('hidden');
    document.getElementById('addItemModal').classList.remove('flex');
    document.getElementById('addItemForm').reset();
}

function addNewItem(event) {
    event.preventDefault();
    
    if (!currentUser.permissions.editInventory) {
        alert('Anda tidak memiliki izin untuk menambah barang.');
        return;
    }
    
    const stock = parseInt(document.getElementById('itemStock').value);
    const minStock = parseInt(document.getElementById('itemMinStock').value);
    const itemName = document.getElementById('itemName').value;
    const itemCode = document.getElementById('itemCode').value;
    
    const newItem = {
        id: items.length + 1,
        code: itemCode,
        name: itemName,
        category: document.getElementById('itemCategory').value,
        type: document.getElementById('itemType').value,
        classification: document.getElementById('itemClassification').value,
        movement: document.getElementById('itemMovement').value,
        stock: stock,
        minStock: minStock,
        status: stock <= minStock ? 'Rendah' : 'Normal',
        description: document.getElementById('itemDescription').value
    };
    
    items.push(newItem);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Add activity log
    addActivity('item_added', `Barang baru ditambahkan: ${itemName} (${itemCode}) dengan stok ${stock} unit`);
    
    loadItems();
    closeAddItemModal();
    updateDashboardStats();
    
    alert('Barang berhasil ditambahkan!');
}

function editItem(id) {
    if (!currentUser.permissions.editInventory) {
        alert('Anda tidak memiliki izin untuk mengedit barang.');
        return;
    }
    
    const item = items.find(i => i.id === id);
    if (item) {
        document.getElementById('itemCode').value = item.code;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemType').value = item.type;
        document.getElementById('itemClassification').value = item.classification;
        document.getElementById('itemMovement').value = item.movement;
        document.getElementById('itemStock').value = item.stock;
        document.getElementById('itemMinStock').value = item.minStock;
        document.getElementById('itemDescription').value = item.description || '';
        
        showAddItemModal();
        
        document.getElementById('addItemForm').onsubmit = function(event) {
            event.preventDefault();
            
            const stock = parseInt(document.getElementById('itemStock').value);
            const minStock = parseInt(document.getElementById('itemMinStock').value);
            const oldStock = item.stock;
            const itemName = document.getElementById('itemName').value;
            
            item.code = document.getElementById('itemCode').value;
            item.name = itemName;
            item.category = document.getElementById('itemCategory').value;
            item.type = document.getElementById('itemType').value;
            item.classification = document.getElementById('itemClassification').value;
            item.movement = document.getElementById('itemMovement').value;
            item.stock = stock;
            item.minStock = minStock;
            item.status = stock <= minStock ? 'Rendah' : 'Normal';
            item.description = document.getElementById('itemDescription').value;
            
            // Save to localStorage
            saveDataToStorage();
            
            // Add activity log
            let updateMessage = `Barang diperbarui: ${itemName}`;
            if (oldStock !== stock) {
                updateMessage += ` (stok: ${oldStock} → ${stock})`;
            }
            addActivity('item_updated', updateMessage);
            
            loadItems();
            closeAddItemModal();
            updateDashboardStats();
            
            document.getElementById('addItemForm').onsubmit = addNewItem;
            
            alert('Barang berhasil diperbarui!');
        };
    }
}

function deleteItem(id) {
    if (!currentUser.permissions.editInventory) {
        alert('Anda tidak memiliki izin untuk menghapus barang.');
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        items = items.filter(item => item.id !== id);
        
        // Save to localStorage
        saveDataToStorage();
        
        loadItems();
        updateDashboardStats();
        alert('Barang berhasil dihapus!');
    }
}