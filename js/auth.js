// ========================================= 
// AUTHENTICATION & SESSION - auth.js
// ========================================= 

// Check for existing session on page load
function checkExistingSession() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        initializeUserInterface();
        updateDashboardStats();
        loadRecentActivities();
        updateNotificationBadge();
        
        return true;
    }
    return false;
}

// Save user session
function saveUserSession() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Clear user session
function clearUserSession() {
    localStorage.removeItem('currentUser');
}

// Generate request number with format: MR-DIV-001-MM-YYYY
function generateRequestNumber(division) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Reset counter if month/year changed
    if (requestCounters.currentMonth !== currentMonth || requestCounters.currentYear !== currentYear) {
        requestCounters.currentMonth = currentMonth;
        requestCounters.currentYear = currentYear;
        // Reset all division counters
        Object.keys(requestCounters.counters).forEach(div => {
            requestCounters.counters[div] = 1;
        });
    }
    
    const divisionCode = divisionCodes[division] || 'UNK';
    const counter = requestCounters.counters[division] || 1;
    const counterStr = String(counter).padStart(3, '0');
    const monthStr = String(currentMonth).padStart(2, '0');
    
    const requestNumber = `MR-${divisionCode}-${counterStr}-${monthStr}-${currentYear}`;
    
    // Increment counter for next request
    requestCounters.counters[division] = counter + 1;
    
    // Save updated counters
    saveDataToStorage();
    
    return requestNumber;
}