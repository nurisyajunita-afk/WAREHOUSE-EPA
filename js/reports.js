// ========================================= 
// REPORTS & ANALYTICS - reports.js
// ========================================= 

// Report functions
function setupReportsSection() {
    const databaseActions = document.getElementById('databaseActions');
    
    // Always show database actions for all users
    databaseActions.classList.remove('hidden');
}

function generateMonthlyReport() {
    const month = document.getElementById('reportMonth').value;
    const year = document.getElementById('reportYear').value;
    
    const monthNames = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const reportContent = document.getElementById('reportContent');
    const reportResults = document.getElementById('reportResults');
    
    // Filter transactions for the selected month/year
    const monthlyTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 == month && transactionDate.getFullYear() == year;
    });
    
    const incomingTransactions = monthlyTransactions.filter(t => t.type === 'masuk');
    const outgoingTransactions = monthlyTransactions.filter(t => t.type === 'keluar');
    
    // Calculate totals
    const totalIncoming = incomingTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const totalOutgoing = outgoingTransactions.reduce((sum, t) => sum + t.quantity, 0);
    
    // Find most requested items
    const itemCounts = {};
    outgoingTransactions.forEach(t => {
        itemCounts[t.code] = (itemCounts[t.code] || 0) + t.quantity;
    });
    
    const topItems = Object.entries(itemCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => {
            const item = items.find(i => i.code === code);
            return { name: item ? item.name : code, count };
        });
    
    let html = `
        <div class="space-y-6">
            <div class="text-center">
                <h4 class="text-xl font-bold text-gray-800">Laporan Bulanan</h4>
                <p class="text-gray-600">${monthNames[month]} ${year}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <p class="text-2xl font-bold text-blue-600">${monthlyTransactions.length}</p>
                    <p class="text-sm text-blue-800">Total Transaksi</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <p class="text-2xl font-bold text-green-600">${totalIncoming}</p>
                    <p class="text-sm text-green-800">Barang Masuk</p>
                </div>
                <div class="bg-red-50 p-4 rounded-lg text-center">
                    <p class="text-2xl font-bold text-red-600">${totalOutgoing}</p>
                    <p class="text-sm text-red-800">Barang Keluar</p>
                </div>
            </div>
            
            <div>
                <h5 class="font-semibold text-gray-800 mb-3">Barang Terlaris Bulan Ini</h5>
                <div class="space-y-2">
    `;
    
    if (topItems.length === 0) {
        html += '<p class="text-gray-500">Tidak ada data barang keluar bulan ini.</p>';
    } else {
        topItems.forEach((item, index) => {
            html += `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span class="font-medium">${index + 1}. ${item.name}</span>
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">${item.count} unit</span>
                </div>
            `;
        });
    }
    
    html += `
                </div>
            </div>
            
            <div>
                <h5 class="font-semibold text-gray-800 mb-3">Laporan per Divisi</h5>
                <div class="overflow-x-auto">
                    <table class="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="border border-gray-300 px-4 py-2 text-left">Divisi</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Jumlah Transaksi</th>
                                <th class="border border-gray-300 px-4 py-2 text-left">Total Barang</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    const divisionStats = {};
    outgoingTransactions.forEach(t => {
        if (t.division !== '-') {
            if (!divisionStats[t.division]) {
                divisionStats[t.division] = { transactions: 0, items: 0 };
            }
            divisionStats[t.division].transactions++;
            divisionStats[t.division].items += t.quantity;
        }
    });
    
    Object.entries(divisionStats).forEach(([division, stats]) => {
        html += `
            <tr>
                <td class="border border-gray-300 px-4 py-2">${division}</td>
                <td class="border border-gray-300 px-4 py-2">${stats.transactions}</td>
                <td class="border border-gray-300 px-4 py-2">${stats.items}</td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    reportContent.innerHTML = html;
    reportResults.classList.remove('hidden');
}

function generatePDFReport() {
    alert('Fitur Generate PDF Report akan segera tersedia. Laporan akan diunduh dalam format PDF.');
}

function backupDatabase() {
    const data = {
        items: items,
        requests: requests,
        transactions: transactions,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `warehouse_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Database berhasil di-backup dan diunduh!');
}

function importDatabase() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.items && data.requests && data.transactions) {
                        items = data.items;
                        requests = data.requests;
                        transactions = data.transactions;
                        
                        // Refresh all displays
                        updateDashboardStats();
                        loadItems();
                        loadRequests();
                        loadTransactions();
                        updateNotificationBadge();
                        
                        alert('Database berhasil diimport!');
                    } else {
                        alert('Format file tidak valid!');
                    }
                } catch (error) {
                    alert('Error membaca file: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function resetDatabase() {
    if (confirm('Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan!')) {
        if (confirm('Konfirmasi sekali lagi: Semua data akan hilang!')) {
            items = [];
            requests = [];
            transactions = [];
            
            // Refresh all displays
            updateDashboardStats();
            loadItems();
            loadRequests();
            loadTransactions();
            updateNotificationBadge();
            
            alert('Database berhasil direset!');
        }
    }
}