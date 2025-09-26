// ========================================= 
// REAL-TIME SYNC & NOTIFICATIONS - realtime.js
// ========================================= 

// Real-time activity tracking system
let activityLog = [];
let lastActivityCheck = Date.now();
let lastDataUpdate = 0;
let syncChannel = null;

// Initialize sync systems
function initializeSyncSystems() {
    // Initialize BroadcastChannel if supported
    if (typeof BroadcastChannel !== 'undefined') {
        try {
            syncChannel = new BroadcastChannel('warehouse_updates');
            syncChannel.addEventListener('message', handleBroadcastMessage);
            console.log('BroadcastChannel initialized for real-time sync');
        } catch (e) {
            console.log('BroadcastChannel not supported, using localStorage events only');
        }
    }
    
    // Set up periodic polling as backup
    setInterval(pollForUpdates, 2000); // Check every 2 seconds
    
    console.log('Real-time sync systems initialized');
}

// Handle broadcast channel messages
function handleBroadcastMessage(event) {
    const data = event.data;
    if (data.type === 'data_updated' && data.user !== (currentUser ? currentUser.displayName : 'Unknown')) {
        console.log('Received broadcast update from:', data.user);
        forceDataReload();
    }
}

// Poll for updates (server-based)
async function pollForUpdates() {
    try {
        const prevItemsLen = items.length;
        const prevReqLen = requests.length;
        await Promise.all([
            fetchItemsFromServer(),
            fetchRequestsFromServer()
        ]);
        if (items.length !== prevItemsLen || requests.length !== prevReqLen) {
            forceDataReload();
        }
    } catch (e) {
        // silently ignore polling errors
    }
}

// Force reload of all data and refresh UI
function forceDataReload() {
    console.log('Forcing data reload...');
    
    // Store current data lengths for comparison
    const oldItemsLength = items.length;
    const oldRequestsLength = requests.length;
    const oldTransactionsLength = transactions.length;
    
    // Reload data from localStorage
    loadDataFromStorage();
    loadActivitiesFromStorage();
    
    // Check what changed and refresh accordingly
    let hasChanges = false;
    if (items.length !== oldItemsLength || 
        requests.length !== oldRequestsLength || 
        transactions.length !== oldTransactionsLength) {
        hasChanges = true;
    }
    
    if (hasChanges) {
        console.log('Data changes detected, refreshing UI...');
        refreshCurrentSection();
        updateNotificationBadge();
        updateDashboardStats();
        
        // Show notification about updates
        showUpdateNotification();
    }
}

// Show notification about data updates
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 left-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="bg-white bg-opacity-20 p-1 rounded-full">
                🔄
            </div>
            <div class="flex-1">
                <p class="font-semibold text-sm">Data Terbaru!</p>
                <p class="text-xs opacity-90">Sistem telah diperbarui dengan data terbaru</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white opacity-75 hover:opacity-100">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Refresh the current section
function refreshCurrentSection() {
    const currentSection = document.querySelector('.section:not(.hidden)');
    if (currentSection) {
        const sectionId = currentSection.id;
        console.log('Refreshing section:', sectionId);
        
        switch(sectionId) {
            case 'inventory':
                if (typeof loadItems === 'function') loadItems();
                break;
            case 'requests':
                if (typeof loadRequests === 'function') loadRequests();
                if (typeof populateRequestItems === 'function') populateRequestItems();
                break;
            case 'transactions':
                if (typeof loadTransactions === 'function') loadTransactions();
                if (typeof populateTransactionItems === 'function') populateTransactionItems();
                break;
            case 'dashboard':
                if (typeof updateDashboardStats === 'function') updateDashboardStats();
                if (typeof loadRecentActivities === 'function') loadRecentActivities();
                break;
        }
    }
}

// Add activity to log
function addActivity(type, message, user = null) {
    const activity = {
        id: Date.now(),
        type: type, // 'item_added', 'item_updated', 'transaction', 'request'
        message: message,
        user: user || currentUser.displayName,
        timestamp: new Date().toISOString(),
        isNew: true
    };
    
    activityLog.unshift(activity);
    
    // Keep only last 50 activities
    if (activityLog.length > 50) {
        activityLog = activityLog.slice(0, 50);
    }
    
    // Store in localStorage for persistence across users
    localStorage.setItem('warehouseActivities', JSON.stringify(activityLog));
    
    // Show notification to other users
    showActivityNotification(activity);
}

// Load activities from localStorage
function loadActivitiesFromStorage() {
    const stored = localStorage.getItem('warehouseActivities');
    if (stored) {
        activityLog = JSON.parse(stored);
    }
}

// Show real-time notification
function showActivityNotification(activity) {
    // Don't show notification to the user who created the activity
    if (activity.user === currentUser.displayName) {
        return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="bg-white bg-opacity-20 p-1 rounded-full">
                ${getActivityIcon(activity.type)}
            </div>
            <div class="flex-1">
                <p class="font-semibold text-sm">Aktivitas Baru!</p>
                <p class="text-xs opacity-90">${activity.message}</p>
                <p class="text-xs opacity-75 mt-1">oleh ${activity.user}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white opacity-75 hover:opacity-100">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Play notification sound (optional)
    playNotificationSound();
}

// Get icon for activity type
function getActivityIcon(type) {
    switch(type) {
        case 'item_added': return '📦';
        case 'item_updated': return '✏️';
        case 'transaction_in': return '📥';
        case 'transaction_out': return '📤';
        case 'request_created': return '📋';
        case 'request_approved': return '✅';
        case 'request_rejected': return '❌';
        default: return '🔔';
    }
}

// Play notification sound
function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback: no sound if Web Audio API is not supported
    }
}

// Check for new activities and data changes periodically (Legacy function)
function checkForNewActivities() {
    // This function is now mostly handled by the new sync systems
    // but we keep it for activity notifications
    
    const newActivities = activityLog.filter(activity => {
        const activityTime = new Date(activity.timestamp).getTime();
        return activityTime > lastActivityCheck && activity.user !== (currentUser ? currentUser.displayName : 'Unknown');
    });
    
    newActivities.forEach(activity => {
        showActivityNotification(activity);
    });
    
    lastActivityCheck = Date.now();
    
    // Update recent activities display
    if (typeof loadRecentActivities === 'function') {
        loadRecentActivities();
    }
}

// Enhanced recent activities loader
function loadRecentActivities() {
    const container = document.getElementById('recentActivities');
    
    // Combine transactions and activity log
    const allActivities = [];
    
    // Add transaction activities
    transactions.slice(0, 3).forEach(transaction => {
        const item = items.find(i => i.code === transaction.code);
        const itemName = item ? item.name : 'Unknown Item';
        
        allActivities.push({
            type: transaction.type === 'masuk' ? 'transaction_in' : 'transaction_out',
            message: `${transaction.type === 'masuk' ? 'Barang Masuk' : 'Barang Keluar'}: ${itemName} (${transaction.quantity} unit)`,
            time: `${transaction.time} • ${new Date(transaction.date).toLocaleDateString('id-ID')}`,
            user: 'Warehouse Staff',
            timestamp: new Date(transaction.date + 'T' + transaction.time).getTime()
        });
    });
    
    // Add recent activity log entries
    activityLog.slice(0, 5).forEach(activity => {
        allActivities.push({
            type: activity.type,
            message: activity.message,
            time: new Date(activity.timestamp).toLocaleString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            user: activity.user,
            timestamp: new Date(activity.timestamp).getTime()
        });
    });
    
    // Sort by timestamp (newest first)
    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    
    container.innerHTML = '';
    allActivities.slice(0, 5).forEach(activity => {
        const activityDiv = document.createElement('div');
        activityDiv.className = 'flex items-center space-x-4 p-3 bg-gray-50 rounded-lg';
        
        const iconClass = activity.type.includes('in') || activity.type === 'item_added' ? 
            'bg-green-100 text-green-600' : 
            activity.type.includes('out') ? 'bg-red-100 text-red-600' :
            activity.type.includes('approved') ? 'bg-green-100 text-green-600' :
            activity.type.includes('rejected') ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600';
        
        activityDiv.innerHTML = `
            <div class="${iconClass} p-2 rounded-full">
                <span class="text-sm">${getActivityIcon(activity.type)}</span>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${activity.message}</p>
                <p class="text-xs text-gray-500">${activity.time} • oleh ${activity.user}</p>
            </div>
        `;
        
        container.appendChild(activityDiv);
    });
}