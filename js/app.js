// ========================================= 
// APPLICATION INITIALIZATION - app.js
// ========================================= 

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sample data first
    initializeSampleData();
    
    // Check for existing session
    if (!checkExistingSession()) {
        // No existing session, show login screen
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
    
    // Set current month and year for reports
    const now = new Date();
    document.getElementById('reportMonth').value = now.getMonth() + 1;
    document.getElementById('reportYear').value = now.getFullYear();
    
    // Load activities from storage
    loadActivitiesFromStorage();
    lastActivityCheck = Date.now();
    
    // Update notification badge every 30 seconds
    setInterval(updateNotificationBadge, 30000);
    
    // Check for new activities every 3 seconds
    setInterval(checkForNewActivities, 3000);
    
    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'warehouseItems' || e.key === 'warehouseRequests' || 
            e.key === 'warehouseTransactions' || e.key === 'warehouseCounters' || 
            e.key === 'warehouseActivities') {
            
            // Reload data immediately when localStorage changes
            loadDataFromStorage();
            loadActivitiesFromStorage();
            
            // Refresh current section
            const currentSection = document.querySelector('.section:not(.hidden)');
            if (currentSection) {
                const sectionId = currentSection.id;
                if (sectionId === 'inventory') {
                    loadItems();
                } else if (sectionId === 'requests') {
                    loadRequests();
                    populateRequestItems();
                } else if (sectionId === 'transactions') {
                    loadTransactions();
                    populateTransactionItems();
                } else if (sectionId === 'dashboard') {
                    updateDashboardStats();
                    loadRecentActivities();
                }
            }
            
            // Always update notification badge and dashboard stats
            updateNotificationBadge();
            updateDashboardStats();
            
            // Show notification for new activities
            if (e.key === 'warehouseActivities' && e.newValue) {
                const newActivities = JSON.parse(e.newValue);
                const latestActivity = newActivities[0];
                if (latestActivity && latestActivity.user !== currentUser.displayName) {
                    showActivityNotification(latestActivity);
                }
            }
        }
    });
});