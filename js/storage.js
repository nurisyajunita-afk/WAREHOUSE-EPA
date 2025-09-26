// ========================================= 
// DATA MANAGEMENT & STORAGE - storage.js
// ========================================= 

// Global in-memory state (kept for UI rendering)
let items = [];
let requests = [];
let transactions = [];

// Request counter for auto-numbering (kept local)
let requestCounters = {
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    counters: {
        'IT': 1,
        'Security': 1,
        'Engineering': 1,
        'Housekeeping': 1,
        'HR': 1,
        'Finance': 1,
        'Operations': 1,
        'Marketing': 1,
        'Back Office': 1
    }
};

// Division code mapping
const divisionCodes = {
    'IT': 'IT',
    'Security': 'SCR',
    'Engineering': 'ENG',
    'Housekeeping': 'HK',
    'HR': 'HR',
    'Finance': 'FIN',
    'Operations': 'OPS',
    'Marketing': 'MKT',
    'Back Office': 'BO'
};

// API base (relative to index.html)
const API_BASE = 'api';

// Initialize data from server
async function initializeServerData() {
    // Load counters from localStorage (client-side only)
    const storedCounters = localStorage.getItem('warehouseCounters');
    if (storedCounters) {
        requestCounters = JSON.parse(storedCounters);
    }

    // Fetch items and requests from server
    await Promise.all([
        fetchItemsFromServer(),
        fetchRequestsFromServer()
    ]);
}

// -------- API HELPERS -------- //
async function fetchItemsFromServer() {
    const res = await fetch(`${API_BASE}/items.php`, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Failed to fetch items');
    const data = await res.json();
    items = Array.isArray(data.items) ? data.items : [];
}

async function createItemOnServer(newItem) {
    const res = await fetch(`${API_BASE}/items.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
    });
    if (!res.ok) throw new Error('Failed to create item');
    return res.json();
}

async function updateItemOnServer(id, item) {
    const res = await fetch(`${API_BASE}/items.php?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
}

async function deleteItemOnServer(id) {
    const res = await fetch(`${API_BASE}/items.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
}

async function fetchRequestsFromServer() {
    const res = await fetch(`${API_BASE}/requests.php`, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('Failed to fetch requests');
    const data = await res.json();
    // Map server fields to UI model
    requests = (Array.isArray(data.requests) ? data.requests : []).map(r => ({
        id: r.requestNumber,
        date: r.date,
        requester: r.requester,
        division: r.division,
        item: r.item,
        quantity: r.quantity,
        reason: r.reason,
        status: r.status
    }));
}

async function createRequestOnServer(newRequest) {
    const payload = {
        requestNumber: newRequest.id,
        date: newRequest.date,
        requester: newRequest.requester,
        division: newRequest.division,
        item: newRequest.item,
        quantity: newRequest.quantity,
        reason: newRequest.reason || null,
        status: newRequest.status
    };
    const res = await fetch(`${API_BASE}/requests.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
}

async function updateRequestStatusOnServer(requestNumber, status) {
    const res = await fetch(`${API_BASE}/requests.php?requestNumber=${encodeURIComponent(requestNumber)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update request status');
    return res.json();
}

// Minimal local persistence for counters and activities only
function saveClientOnlyState() {
    localStorage.setItem('warehouseCounters', JSON.stringify(requestCounters));
    // Activities are saved in realtime.js
}

// Backward-compat no-ops (to avoid breaking existing calls)
function saveDataToStorage() {
    // Do nothing (server is source of truth); keep counters saved locally
    saveClientOnlyState();
}

function loadDataFromStorage() {
    // Do nothing; server fetch functions populate items/requests
    const storedCounters = localStorage.getItem('warehouseCounters');
    if (storedCounters) requestCounters = JSON.parse(storedCounters);
}
