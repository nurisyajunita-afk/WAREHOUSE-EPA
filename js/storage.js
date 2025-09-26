// ========================================= 
// DATA MANAGEMENT & STORAGE - storage.js
// ========================================= 

// Sample data with enhanced classification
let items = [];
let requests = [];

// Request counter for auto-numbering
let requestCounters = {
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    counters: {
        'IT': 1,
        'Security': 3,
        'Engineering': 4,
        'Housekeeping': 5,
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

let transactions = [];

// Initialize sample data if not exists
function initializeSampleData() {
    const storedItems = localStorage.getItem('warehouseItems');
    const storedRequests = localStorage.getItem('warehouseRequests');
    const storedTransactions = localStorage.getItem('warehouseTransactions');
    const storedCounters = localStorage.getItem('warehouseCounters');
    
    if (!storedItems) {
        // Sample items data
        items = [
            {
                id: 1,
                code: 'LP001',
                name: 'Laptop Dell Inspiron 15',
                category: 'Elektronik',
                type: 'Capex',
                classification: 'Asset',
                movement: 'Fast Moving',
                stock: 10,
                minStock: 3,
                status: 'Normal',
                description: 'Laptop untuk keperluan kantor dengan spesifikasi standar'
            },
            {
                id: 2,
                code: 'MS002',
                name: 'Mouse Wireless Logitech',
                category: 'Elektronik',
                type: 'Opex',
                classification: 'Consumable',
                movement: 'Fast Moving',
                stock: 25,
                minStock: 10,
                status: 'Normal',
                description: 'Mouse wireless untuk produktivitas kerja'
            },
            {
                id: 3,
                code: 'PR003',
                name: 'Printer Canon PIXMA',
                category: 'Elektronik',
                type: 'Capex',
                classification: 'Asset',
                movement: 'Normal Moving',
                stock: 5,
                minStock: 2,
                status: 'Normal',
                description: 'Printer multifungsi untuk kebutuhan cetak dokumen'
            },
            {
                id: 4,
                code: 'CH004',
                name: 'Kursi Kantor Ergonomis',
                category: 'Furniture',
                type: 'Capex',
                classification: 'Asset',
                movement: 'Slow Moving',
                stock: 15,
                minStock: 5,
                status: 'Normal',
                description: 'Kursi kantor dengan desain ergonomis untuk kenyamanan kerja'
            },
            {
                id: 5,
                code: 'PEN005',
                name: 'Pulpen Pilot',
                category: 'Alat Tulis',
                type: 'Opex',
                classification: 'Consumable',
                movement: 'Fast Moving',
                stock: 2,
                minStock: 20,
                status: 'Rendah',
                description: 'Pulpen untuk keperluan tulis menulis sehari-hari'
            },
            {
                id: 6,
                code: 'KA4006',
                name: 'Kertas A4 80gsm',
                category: 'Alat Tulis',
                type: 'Opex',
                classification: 'Consumable',
                movement: 'Fast Moving',
                stock: 100,
                minStock: 50,
                status: 'Normal',
                description: 'Kertas A4 untuk keperluan cetak dan fotokopi'
            },
            {
                id: 7,
                code: 'DET007',
                name: 'Deterjen Pembersih Lantai',
                category: 'Cleaning',
                type: 'Opex',
                classification: 'Consumable',
                movement: 'Normal Moving',
                stock: 8,
                minStock: 15,
                status: 'Rendah',
                description: 'Deterjen khusus untuk membersihkan lantai gedung'
            },
            {
                id: 8,
                code: 'CAM008',
                name: 'CCTV Camera 4MP',
                category: 'Security',
                type: 'Capex',
                classification: 'Asset',
                movement: 'Slow Moving',
                stock: 12,
                minStock: 3,
                status: 'Normal',
                description: 'Kamera CCTV resolusi 4MP untuk sistem keamanan'
            },
            {
                id: 9,
                code: 'WR009',
                name: 'Kunci Inggris Set',
                category: 'Engineering',
                type: 'Capex',
                classification: 'Non-Consumable',
                movement: 'Normal Moving',
                stock: 6,
                minStock: 3,
                status: 'Normal',
                description: 'Set kunci inggris untuk keperluan maintenance'
            },
            {
                id: 10,
                code: 'TIN010',
                name: 'Tinta Printer Canon',
                category: 'Elektronik',
                type: 'Opex',
                classification: 'Consumable',
                movement: 'Fast Moving',
                stock: 1,
                minStock: 5,
                status: 'Rendah',
                description: 'Cartridge tinta untuk printer Canon'
            }
        ];
        saveDataToStorage();
    } else {
        loadDataFromStorage();
    }
    
    if (!storedRequests) {
        // Sample requests data
        requests = [
            {
                id: 'MR-IT-001-12-2024',
                date: '2024-12-15',
                requester: 'John Doe',
                division: 'IT',
                item: 'Monitor LED 24 inch',
                quantity: 2,
                reason: 'Untuk workstation baru karyawan IT',
                status: 'Disetujui'
            },
            {
                id: 'MR-SCR-002-12-2024',
                date: '2024-12-14',
                requester: 'Ahmad Security',
                division: 'Security',
                item: 'Walkie Talkie',
                quantity: 4,
                reason: 'Penggantian walkie talkie yang rusak',
                status: 'Menunggu Manager'
            },
            {
                id: 'MR-ENG-003-12-2024',
                date: '2024-12-13',
                requester: 'Budi Engineering',
                division: 'Engineering',
                item: 'Kunci Inggris Set',
                quantity: 1,
                reason: 'Untuk maintenance AC lantai 3',
                status: 'Menunggu Staff'
            }
        ];
        saveDataToStorage();
    } else {
        loadDataFromStorage();
    }
    
    if (!storedTransactions) {
        // Sample transactions data
        transactions = [
            {
                id: 'TRX001',
                date: '2024-12-15',
                time: '09:30',
                type: 'masuk',
                code: 'LP001',
                quantity: 5,
                division: '-',
                supplier: 'PT Teknologi Maju',
                note: 'Pengadaan laptop untuk divisi baru'
            },
            {
                id: 'TRX002',
                date: '2024-12-15',
                time: '14:15',
                type: 'keluar',
                code: 'MS002',
                quantity: 3,
                division: 'IT',
                requester: 'Sarah IT',
                note: 'Untuk Sarah IT - Workstation baru'
            },
            {
                id: 'TRX003',
                date: '2024-12-14',
                time: '11:20',
                type: 'masuk',
                code: 'KA4006',
                quantity: 50,
                division: '-',
                supplier: 'PT Kertas Nusantara',
                note: 'Stok bulanan kertas A4'
            }
        ];
        saveDataToStorage();
    } else {
        loadDataFromStorage();
    }
    
    if (storedCounters) {
        requestCounters = JSON.parse(storedCounters);
    } else {
        saveDataToStorage();
    }
}

// Save data to localStorage
function saveDataToStorage() {
    localStorage.setItem('warehouseItems', JSON.stringify(items));
    localStorage.setItem('warehouseRequests', JSON.stringify(requests));
    localStorage.setItem('warehouseTransactions', JSON.stringify(transactions));
    localStorage.setItem('warehouseCounters', JSON.stringify(requestCounters));
}

// Load data from localStorage
function loadDataFromStorage() {
    const storedItems = localStorage.getItem('warehouseItems');
    const storedRequests = localStorage.getItem('warehouseRequests');
    const storedTransactions = localStorage.getItem('warehouseTransactions');
    const storedCounters = localStorage.getItem('warehouseCounters');
    
    if (storedItems) items = JSON.parse(storedItems);
    if (storedRequests) requests = JSON.parse(storedRequests);
    if (storedTransactions) transactions = JSON.parse(storedTransactions);
    if (storedCounters) requestCounters = JSON.parse(storedCounters);
}