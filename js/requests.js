// ========================================= 
// REQUEST MANAGEMENT - requests.js
// ========================================= 

// Request management functions
function loadRequests() {
    const tbody = document.getElementById('requestsTableBody');
    const createBtn = document.getElementById('createRequestBtn');
    
    // Show/hide create button based on permissions
    if (currentUser.permissions.createRequests) {
        createBtn.classList.remove('hidden');
    } else {
        createBtn.classList.add('hidden');
    }
    
    tbody.innerHTML = '';
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        let statusClass = '';
        switch(request.status) {
            case 'Menunggu Staff':
                statusClass = 'status-waiting-staff';
                break;
            case 'Menunggu Manager':
                statusClass = 'status-waiting-manager';
                break;
            case 'Disetujui':
                statusClass = 'status-approved';
                break;
            case 'Ditolak':
                statusClass = 'status-rejected';
                break;
            default:
                statusClass = 'status-pending';
        }
        
        let actionCell = '<span class="text-gray-400">-</span>';
        
        if (request.status === 'Menunggu Staff' && currentUser.permissions.approveStaffRequests) {
            actionCell = `
                <button onclick="approveRequest('${request.id}', 'staff')" class="text-green-600 hover:text-green-800 mr-2">Setujui</button>
                <button onclick="rejectRequest('${request.id}')" class="text-red-600 hover:text-red-800">Tolak</button>
            `;
        } else if (request.status === 'Menunggu Manager' && currentUser.permissions.approveManagerRequests) {
            actionCell = `
                <button onclick="approveRequest('${request.id}', 'manager')" class="text-green-600 hover:text-green-800 mr-2">Setujui</button>
                <button onclick="rejectRequest('${request.id}')" class="text-red-600 hover:text-red-800">Tolak</button>
            `;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${request.id}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${new Date(request.date).toLocaleDateString('id-ID')}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.requester}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${request.division}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.item}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.quantity}</td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                    ${request.status}
                </span>
            </td>
            <td class="px-4 py-3 text-sm">
                ${actionCell}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function filterRequests() {
    const statusFilter = document.getElementById('requestStatusFilter').value;
    
    const filteredRequests = requests.filter(request => {
        return !statusFilter || request.status === statusFilter;
    });
    
    const tbody = document.getElementById('requestsTableBody');
    tbody.innerHTML = '';
    
    filteredRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        let statusClass = '';
        switch(request.status) {
            case 'Menunggu Staff':
                statusClass = 'status-waiting-staff';
                break;
            case 'Menunggu Manager':
                statusClass = 'status-waiting-manager';
                break;
            case 'Disetujui':
                statusClass = 'status-approved';
                break;
            case 'Ditolak':
                statusClass = 'status-rejected';
                break;
            default:
                statusClass = 'status-pending';
        }
        
        let actionCell = '<span class="text-gray-400">-</span>';
        
        if (request.status === 'Menunggu Staff' && currentUser.permissions.approveStaffRequests) {
            actionCell = `
                <button onclick="approveRequest('${request.id}', 'staff')" class="text-green-600 hover:text-green-800 mr-2">Setujui</button>
                <button onclick="rejectRequest('${request.id}')" class="text-red-600 hover:text-red-800">Tolak</button>
            `;
        } else if (request.status === 'Menunggu Manager' && currentUser.permissions.approveManagerRequests) {
            actionCell = `
                <button onclick="approveRequest('${request.id}', 'manager')" class="text-green-600 hover:text-green-800 mr-2">Setujui</button>
                <button onclick="rejectRequest('${request.id}')" class="text-red-600 hover:text-red-800">Tolak</button>
            `;
        }
        
        row.innerHTML = `
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${request.id}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${new Date(request.date).toLocaleDateString('id-ID')}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.requester}</td>
            <td class="px-4 py-3 text-sm text-gray-500">${request.division}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.item}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${request.quantity}</td>
            <td class="px-4 py-3">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">
                    ${request.status}
                </span>
            </td>
            <td class="px-4 py-3 text-sm">
                ${actionCell}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function showRequestModal() {
    if (!currentUser.permissions.createRequests) {
        alert('Anda tidak memiliki izin untuk membuat permintaan.');
        return;
    }
    
    document.getElementById('requestModal').classList.remove('hidden');
    document.getElementById('requestModal').classList.add('flex');
    
    // Auto-fill for division users
    if (currentUser.division) {
        setTimeout(() => {
            document.getElementById('requesterName').value = currentUser.displayName;
            document.getElementById('requesterDivision').value = currentUser.division;
            document.getElementById('requesterName').readOnly = true;
            document.getElementById('requesterDivision').disabled = true;
        }, 100);
    }
}

function closeRequestModal() {
    document.getElementById('requestModal').classList.add('hidden');
    document.getElementById('requestModal').classList.remove('flex');
    document.getElementById('requestForm').reset();
    
    // Reset readonly/disabled states
    document.getElementById('requesterName').readOnly = false;
    document.getElementById('requesterDivision').disabled = false;
}

function populateRequestItems() {
    const select = document.getElementById('requestedItem');
    select.innerHTML = '<option value="">Pilih Barang</option>';
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.code} - ${item.name}`;
        select.appendChild(option);
    });
}

function addNewRequest(event) {
    event.preventDefault();
    
    if (!currentUser.permissions.createRequests) {
        alert('Anda tidak memiliki izin untuk membuat permintaan.');
        return;
    }
    
    const division = document.getElementById('requesterDivision').value;
    const requestNumber = generateRequestNumber(division);
    const requesterName = document.getElementById('requesterName').value;
    const itemName = document.getElementById('requestedItem').value;
    const quantity = parseInt(document.getElementById('requestedQuantity').value);
    
    const newRequest = {
        id: requestNumber,
        date: new Date().toISOString().split('T')[0],
        requester: requesterName,
        division: division,
        item: itemName,
        quantity: quantity,
        reason: document.getElementById('requestReason').value,
        status: 'Menunggu Staff'
    };
    
    requests.unshift(newRequest);
    
    // Save to localStorage
    saveDataToStorage();
    
    // Add activity log
    addActivity('request_created', `Permintaan baru: ${itemName} (${quantity} unit) dari ${division} - ${requesterName}`);
    
    loadRequests();
    closeRequestModal();
    updateNotificationBadge();
    
    alert(`Permintaan berhasil dibuat dengan nomor ${requestNumber} dan menunggu persetujuan staff!`);
}

function approveRequest(requestId, level) {
    const request = requests.find(r => r.id === requestId);
    if (request) {
        if (level === 'staff' && currentUser.permissions.approveStaffRequests) {
            request.status = 'Menunggu Manager';
            addActivity('request_approved', `Permintaan ${request.id} disetujui staff: ${request.item} (${request.quantity} unit) dari ${request.division}`);
            alert('Permintaan disetujui staff. Menunggu persetujuan manager.');
        } else if (level === 'manager' && currentUser.permissions.approveManagerRequests) {
            request.status = 'Disetujui';
            addActivity('request_approved', `Permintaan ${request.id} disetujui manager: ${request.item} (${request.quantity} unit) dari ${request.division} - SIAP DIKELUARKAN`);
            alert('Permintaan disetujui manager. Barang dapat dikeluarkan.');
        } else {
            alert('Anda tidak memiliki izin untuk menyetujui permintaan ini.');
            return;
        }
        
        // Save to localStorage
        saveDataToStorage();
        
        loadRequests();
        updateNotificationBadge();
    }
}

function rejectRequest(requestId) {
    if (confirm('Apakah Anda yakin ingin menolak permintaan ini?')) {
        const request = requests.find(r => r.id === requestId);
        if (request) {
            if ((request.status === 'Menunggu Staff' && currentUser.permissions.approveStaffRequests) ||
                (request.status === 'Menunggu Manager' && currentUser.permissions.approveManagerRequests)) {
                request.status = 'Ditolak';
                
                const rejectedBy = request.status === 'Menunggu Staff' ? 'staff' : 'manager';
                addActivity('request_rejected', `Permintaan ${request.id} ditolak ${rejectedBy}: ${request.item} (${request.quantity} unit) dari ${request.division}`);
                
                // Save to localStorage
                saveDataToStorage();
                
                loadRequests();
                updateNotificationBadge();
                alert('Permintaan ditolak.');
            } else {
                alert('Anda tidak memiliki izin untuk menolak permintaan ini.');
            }
        }
    }
}