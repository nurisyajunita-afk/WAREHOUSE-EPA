// ========================================= 
// DATA MODELS & CONFIGURATION - data.js
// ========================================= 

// User roles and permissions
const userRoles = {
    'ga_warehouse': {
        name: 'Warehouse Staff',
        displayName: 'Staff Gudang',
        password: 'ga_warehouse_epa001',
        permissions: {
            viewInventory: true,
            editInventory: true,
            viewTransactions: true,
            createTransactions: true,
            viewRequests: true,
            approveStaffRequests: true,
            viewReports: true,
            databaseActions: true
        },
        icon: '👤',
        initials: 'WS'
    },
    'building_manager': {
        name: 'Building Manager',
        displayName: 'Manager Gedung',
        password: 'manager_epa001',
        permissions: {
            viewInventory: true,
            editInventory: false,
            viewTransactions: true,
            createTransactions: false,
            viewRequests: true,
            approveManagerRequests: true,
            viewReports: true,
            databaseActions: false
        },
        icon: '🏢',
        initials: 'BM'
    },
    'security_user': {
        name: 'Security Division',
        displayName: 'Divisi Security',
        password: 'security_epa001',
        permissions: {
            viewInventory: true,
            editInventory: false,
            viewTransactions: false,
            createTransactions: false,
            viewRequests: true,
            createRequests: true,
            viewReports: false,
            databaseActions: false
        },
        icon: '🛡️',
        initials: 'SC',
        division: 'Security'
    },
    'engineering_user': {
        name: 'Engineering Division',
        displayName: 'Divisi Engineering',
        password: 'engineering_epa001',
        permissions: {
            viewInventory: true,
            editInventory: false,
            viewTransactions: false,
            createTransactions: false,
            viewRequests: true,
            createRequests: true,
            viewReports: false,
            databaseActions: false
        },
        icon: '🔧',
        initials: 'EN',
        division: 'Engineering'
    },
    'housekeeping_user': {
        name: 'Housekeeping Division',
        displayName: 'Divisi Housekeeping',
        password: 'housekeeping_epa001',
        permissions: {
            viewInventory: true,
            editInventory: false,
            viewTransactions: false,
            createTransactions: false,
            viewRequests: true,
            createRequests: true,
            viewReports: false,
            databaseActions: false
        },
        icon: '🧹',
        initials: 'HK',
        division: 'Housekeeping'
    },
    'backoffice_user': {
        name: 'Back Office Division',
        displayName: 'Divisi Back Office',
        password: 'backoffice_epa001',
        permissions: {
            viewInventory: true,
            editInventory: false,
            viewTransactions: false,
            createTransactions: false,
            viewRequests: true,
            createRequests: true,
            viewReports: false,
            databaseActions: false
        },
        icon: '💼',
        initials: 'BO',
        division: 'Back Office'
    }
};

let currentUser = null;
let isViewOnlyMode = false;