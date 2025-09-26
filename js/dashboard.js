// ========================================= 
// DASHBOARD FUNCTIONS - dashboard.js
// ========================================= 

// Dashboard functions
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    const recentTransactions = transactions.slice(0, 5);
    
    container.innerHTML = '';
    recentTransactions.forEach(transaction => {
        const item = items.find(i => i.code === transaction.code);
        const itemName = item ? item.name : 'Unknown Item';
        
        const activityDiv = document.createElement('div');
        activityDiv.className = 'flex items-center space-x-4 p-3 bg-gray-50 rounded-lg';
        
        const iconClass = transaction.type === 'masuk' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
        const typeText = transaction.type === 'masuk' ? 'Barang Masuk' : 'Barang Keluar';
        
        activityDiv.innerHTML = `
            <div class="${iconClass} p-2 rounded-full">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${transaction.type === 'masuk' ? 'M7 16l-4-4m0 0l4-4m-4 4h18' : 'M17 8l4 4m0 0l-4 4m4-4H3'}"></path>
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${typeText}: ${itemName}</p>
                <p class="text-xs text-gray-500">Jumlah: ${transaction.quantity} • ${transaction.time} • ${transaction.date}</p>
            </div>
        `;
        
        container.appendChild(activityDiv);
    });
}

function updateDashboardStats() {
    const totalItems = items.length;
    const lowStockCount = items.filter(item => item.stock <= item.minStock).length;
    const todayIncoming = transactions.filter(t => t.type === 'masuk' && t.date === new Date().toISOString().split('T')[0]).length;
    const todayOutgoing = transactions.filter(t => t.type === 'keluar' && t.date === new Date().toISOString().split('T')[0]).length;
    
    document.getElementById('totalItems').textContent = totalItems.toLocaleString('id-ID');
    document.getElementById('lowStock').textContent = lowStockCount;
    document.getElementById('todayIncoming').textContent = todayIncoming;
    document.getElementById('todayOutgoing').textContent = todayOutgoing;
}