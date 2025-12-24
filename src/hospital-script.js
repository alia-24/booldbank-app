// ===== نظام واجهة المشفى =====
const hospitalState = {
    currentSection: 'hospital-home',
    hospitalInfo: {
        id: 'HOS-001',
        name: 'مشفى درعا الوطني',
        type: 'government',
        phone: '6778610',
        address: 'درعا – حي السحاري – طريق المشفى',
        director: 'د. أحمد محمد',
        beds: 250,
        level: 'المستوى الثالث'
    },
    
    // بيانات مخزون الدم
    bloodInventory: {
        'O+': { available: 75, reserved: 12, used: 45, minLevel: 50, maxLevel: 150 },
        'O-': { available: 8, reserved: 3, used: 12, minLevel: 10, maxLevel: 30 },
        'A+': { available: 65, reserved: 8, used: 38, minLevel: 45, maxLevel: 120 },
        'A-': { available: 15, reserved: 2, used: 20, minLevel: 15, maxLevel: 40 },
        'B+': { available: 40, reserved: 6, used: 25, minLevel: 30, maxLevel: 80 },
        'B-': { available: 12, reserved: 1, used: 8, minLevel: 8, maxLevel: 25 },
        'AB+': { available: 18, reserved: 3, used: 10, minLevel: 10, maxLevel: 30 },
        'AB-': { available: 6, reserved: 0, used: 4, minLevel: 5, maxLevel: 15 }
    },
    
    // بيانات طلبات الدم
    bloodRequests: [
        {
            id: 'REQ-2024-001',
            patientName: 'محمد أحمد',
            patientAge: 45,
            patientGender: 'male',
            bloodType: 'O+',
            units: 2,
            priority: 'urgent',
            reason: 'surgery',
            status: 'pending',
            date: '2024-01-15',
            dueDate: '2024-01-15',
            notes: 'عملية قلب مفتوح - عاجل'
        },
        {
            id: 'REQ-2024-002',
            patientName: 'سارة محمد',
            patientAge: 28,
            patientGender: 'female',
            bloodType: 'A+',
            units: 3,
            priority: 'high',
            reason: 'childbirth',
            status: 'processing',
            date: '2024-01-14',
            dueDate: '2024-01-16',
            notes: 'ولادة قيصرية - متوقع نزيف'
        },
        {
            id: 'REQ-2024-003',
            patientName: 'علي حسن',
            patientAge: 62,
            patientGender: 'male',
            bloodType: 'B+',
            units: 1,
            priority: 'normal',
            reason: 'disease',
            status: 'completed',
            date: '2024-01-13',
            dueDate: '2024-01-13',
            notes: 'فقر دم مزمن'
        }
    ],
    
    // إمدادات الدم
    bloodSupply: [
        {
            id: 'SUP-001',
            bloodType: 'O-',
            units: 10,
            urgency: 'urgent',
            requiredBy: '2024-01-17',
            status: 'pending',
            date: '2024-01-15'
        },
        {
            id: 'SUP-002',
            bloodType: 'A+',
            units: 20,
            urgency: 'normal',
            requiredBy: '2024-01-20',
            status: 'processing',
            date: '2024-01-14'
        }
    ],
    
    // التقارير
    reports: {
        monthlyRequests: 124,
        monthlyUnits: 378,
        fulfillmentRate: 92,
        responseTime: 2.4
    }
};

// ===== تهيئة النظام =====
function initHospitalSystem() {
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
    
    // تهيئة التنقل
    initNavigation();
    initMobileMenu();
    
    // تحديث جميع الأقسام
    updateDashboard();
    updateBloodRequests();
    updateInventory();
    updateBloodSupply();
    updateHospitalProfile();
    updateReports();
    
    // إعداد الموديلات
    setupModals();
    
    // إعداد الرسوم البيانية
    setTimeout(() => {
        initCharts();
    }, 1000);
}

// ===== نظام التنقل =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navigateTo('hospital-home');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            navigateTo(sectionId);
            
            // إغلاق القائمة المتنقلة
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        });
    });
}

function navigateTo(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        hospitalState.currentSection = sectionId;
        
        // التمرير إلى القسم
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // تحديث رابط التنقل النشط
        setActiveNavLink(sectionId);
        
        // تحديث المحتوى حسب القسم
        if (sectionId === 'hospital-home') {
            updateDashboard();
        } else if (sectionId === 'blood-requests') {
            updateBloodRequests();
        } else if (sectionId === 'inventory') {
            updateInventory();
        } else if (sectionId === 'blood-supply') {
            updateBloodSupply();
        } else if (sectionId === 'reports') {
            updateReports();
        }
    }
}

function setActiveNavLink(sectionId) {
    // تحديث روابط التنقل الرئيسية
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// ===== القائمة المتنقلة =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (closeMenu && mobileMenu) {
        closeMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('show') &&
            !mobileMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('show');
        document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : '';
    }
}

// ===== تحديث لوحة التحكم =====
function updateDashboard() {
    updateDashboardStats();
    updateRecentRequests();
    updateInventoryOverview();
}

function updateDashboardStats() {
    // حساب الإحصائيات
    const pendingRequests = hospitalState.bloodRequests.filter(r => r.status === 'pending').length;
    const urgentRequests = hospitalState.bloodRequests.filter(r => r.priority === 'urgent').length;
    const completedRequests = hospitalState.bloodRequests.filter(r => r.status === 'completed').length;
    const totalUnits = Object.values(hospitalState.bloodInventory).reduce((sum, type) => sum + type.available, 0);
    
    // تحديث الأرقام
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('urgentRequests').textContent = urgentRequests;
    document.getElementById('completedRequests').textContent = completedRequests;
    document.getElementById('totalUnits').textContent = totalUnits;
}

function updateRecentRequests() {
    const recentRequests = document.getElementById('recentRequests');
    if (!recentRequests) return;
    
    recentRequests.innerHTML = '';
    
    // عرض آخر 5 طلبات
    const latestRequests = [...hospitalState.bloodRequests]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    latestRequests.forEach(request => {
        const statusText = getStatusText(request.status);
        const statusClass = getStatusClass(request.status);
        // eslint-disable-next-line no-unused-vars
        const priorityText = getPriorityText(request.priority);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.id}</td>
            <td>${request.bloodType}</td>
            <td>${request.units}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formatDate(request.date)}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="showRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        recentRequests.appendChild(row);
    });
}

function updateInventoryOverview() {
    const bloodLevelsGrid = document.querySelector('.blood-levels-grid');
    if (!bloodLevelsGrid) return;
    
    bloodLevelsGrid.innerHTML = '';
    
    Object.entries(hospitalState.bloodInventory).forEach(([type, data]) => {
        const percentage = Math.min(100, (data.available / data.maxLevel) * 100);
        const levelClass = getLevelClass(percentage);
        
        const levelCard = document.createElement('div');
        levelCard.className = 'blood-level-card';
        levelCard.innerHTML = `
            <div class="blood-level-header">
                <h4>${type}</h4>
                <span class="level-percentage">${data.available}/${data.maxLevel}</span>
            </div>
            <div class="blood-level-bar">
                <div class="level-fill ${levelClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="blood-level-info">
                <span class="info-item">متاح: ${data.available}</span>
                <span class="info-item">محجوز: ${data.reserved}</span>
                <span class="info-item">مستخدم: ${data.used}</span>
            </div>
        `;
        bloodLevelsGrid.appendChild(levelCard);
    });
}

// ===== تحديث طلبات الدم =====
function updateBloodRequests() {
    updateRequestsTable();
    updateRequestStats();
}

function updateRequestsTable() {
    const tableBody = document.getElementById('requestsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // الحصول على الفلتر الحالي
    const statusFilter = document.getElementById('requestStatus')?.value || 'all';
    const bloodTypeFilter = document.getElementById('bloodTypeFilter')?.value || 'all';
    
    // فلترة الطلبات
    let filteredRequests = [...hospitalState.bloodRequests];
    
    if (statusFilter !== 'all') {
        filteredRequests = filteredRequests.filter(r => {
            if (statusFilter === 'urgent') {
                return r.priority === 'urgent';
            }
            return r.status === statusFilter;
        });
    }
    
    if (bloodTypeFilter !== 'all') {
        filteredRequests = filteredRequests.filter(r => r.bloodType === bloodTypeFilter);
    }
    
    // عرض الطلبات
    filteredRequests.forEach(request => {
        const statusText = getStatusText(request.status);
        const statusClass = getStatusClass(request.status);
        const priorityText = getPriorityText(request.priority);
        const priorityClass = getPriorityClass(request.priority);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="request-checkbox" value="${request.id}" onchange="updateSelection()">
            </td>
            <td>${request.id}</td>
            <td>${request.patientName}</td>
            <td>${request.bloodType}</td>
            <td>${request.units}</td>
            <td>${formatDate(request.date)}</td>
            <td>${formatDate(request.dueDate)}</td>
            <td><span class="priority-badge ${priorityClass}">${priorityText}</span></td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="showRequestDetails('${request.id}')" title="عرض التفاصيل">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="processRequest('${request.id}')" title="معالجة الطلب">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="completeRequest('${request.id}')" title="إكمال الطلب">
                        <i class="fas fa-check"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateRequestStats() {
    const pending = hospitalState.bloodRequests.filter(r => r.status === 'pending').length;
    const urgent = hospitalState.bloodRequests.filter(r => r.priority === 'urgent').length;
    const processing = hospitalState.bloodRequests.filter(r => r.status === 'processing').length;
    const completed = hospitalState.bloodRequests.filter(r => r.status === 'completed').length;
    
    document.getElementById('statsPending').textContent = pending;
    document.getElementById('statsUrgent').textContent = urgent;
    document.getElementById('statsProcessing').textContent = processing;
    document.getElementById('statsCompleted').textContent = completed;
}

function filterRequests() {
    updateRequestsTable();
}

// ===== تحديث المخزون =====
function updateInventory() {
    updateInventoryTable();
    updateBloodLevels();
    updateExpiringUnits();
}

function updateInventoryTable() {
    const tableBody = document.getElementById('inventoryTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    Object.entries(hospitalState.bloodInventory).forEach(([type, data]) => {
        const percentage = (data.available / data.maxLevel) * 100;
        const status = getInventoryStatus(percentage);
        const statusClass = getLevelClass(percentage);
        const lastUpdated = new Date().toLocaleDateString('ar-SA');
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${type}</strong></td>
            <td>${data.minLevel}</td>
            <td>${data.available}</td>
            <td>${data.reserved}</td>
            <td>${data.used}</td>
            <td><span class="inventory-status ${statusClass}">${status}</span></td>
            <td>${lastUpdated}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="adjustInventory('${type}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateBloodLevels() {
    const bloodLevelsGrid = document.querySelector('#inventory .blood-levels-grid');
    if (!bloodLevelsGrid) return;
    
    bloodLevelsGrid.innerHTML = '';
    
    Object.entries(hospitalState.bloodInventory).forEach(([type, data]) => {
        const percentage = Math.min(100, (data.available / data.maxLevel) * 100);
        const levelClass = getLevelClass(percentage);
        
        const levelCard = document.createElement('div');
        levelCard.className = 'blood-level-card';
        levelCard.innerHTML = `
            <div class="blood-level-header">
                <h4>${type}</h4>
                <span class="level-percentage">${Math.round(percentage)}%</span>
            </div>
            <div class="blood-level-bar">
                <div class="level-fill ${levelClass}" style="width: ${percentage}%"></div>
            </div>
            <div class="blood-level-info">
                <span class="info-item">${data.available} وحدة</span>
                <span class="info-item ${data.available < data.minLevel ? 'danger' : ''}">
                    الحد الأدنى: ${data.minLevel}
                </span>
            </div>
        `;
        bloodLevelsGrid.appendChild(levelCard);
    });
}

function updateExpiringUnits() {
    const expiringUnits = document.getElementById('expiringUnits');
    if (!expiringUnits) return;
    
    expiringUnits.innerHTML = '';
    
    // وحدات وهمية على وشك الانتهاء
    const units = [
        { id: 'U001', bloodType: 'O+', expiryDate: '2024-01-20', units: 3 },
        { id: 'U002', bloodType: 'A+', expiryDate: '2024-01-21', units: 2 },
        { id: 'U003', bloodType: 'B+', expiryDate: '2024-01-22', units: 4 },
        { id: 'U004', bloodType: 'O-', expiryDate: '2024-01-23', units: 1 }
    ];
    
    units.forEach(unit => {
        const daysLeft = calculateDaysLeft(unit.expiryDate);
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.innerHTML = `
            <div class="unit-header">
                <span class="unit-id">${unit.id}</span>
                <span class="unit-type">${unit.bloodType}</span>
            </div>
            <div class="unit-info">
                <div class="unit-detail">
                    <i class="fas fa-calendar-times"></i>
                    <span>ينتهي في: ${formatDate(unit.expiryDate)}</span>
                </div>
                <div class="unit-detail">
                    <i class="fas fa-hashtag"></i>
                    <span>${unit.units} وحدة</span>
                </div>
                <div class="unit-detail">
                    <i class="fas fa-clock"></i>
                    <span class="${daysLeft <= 3 ? 'danger' : 'warning'}">${daysLeft} أيام متبقية</span>
                </div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="useUnit('${unit.id}')">
                استخدام
            </button>
        `;
        expiringUnits.appendChild(unitCard);
    });
}

// ===== تحديث إمدادات الدم =====
function updateBloodSupply() {
    updateSupplyRequests();
    updateSupplyStats();
}

function updateSupplyRequests() {
    const supplyRequests = document.getElementById('activeSupplyRequests');
    if (!supplyRequests) return;
    
    supplyRequests.innerHTML = '';
    
    hospitalState.bloodSupply.forEach(supply => {
        const statusText = getSupplyStatusText(supply.status);
        const statusClass = getSupplyStatusClass(supply.status);
        const urgencyText = getPriorityText(supply.urgency);
        const urgencyClass = getPriorityClass(supply.urgency);
        
        const supplyCard = document.createElement('div');
        supplyCard.className = 'supply-card';
        supplyCard.innerHTML = `
            <div class="supply-header">
                <h4>${supply.id}</h4>
                <span class="supply-status ${statusClass}">${statusText}</span>
            </div>
            <div class="supply-info">
                <div class="supply-detail">
                    <i class="fas fa-tint"></i>
                    <span>${supply.bloodType}</span>
                </div>
                <div class="supply-detail">
                    <i class="fas fa-hashtag"></i>
                    <span>${supply.units} وحدة</span>
                </div>
                <div class="supply-detail">
                    <i class="fas fa-exclamation-circle"></i>
                    <span class="${urgencyClass}">${urgencyText}</span>
                </div>
                <div class="supply-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>مطلوب قبل: ${formatDate(supply.requiredBy)}</span>
                </div>
            </div>
            <div class="supply-actions">
                <button class="btn btn-sm btn-outline" onclick="updateSupplyStatus('${supply.id}', 'processing')">
                    قبول
                </button>
                <button class="btn btn-sm btn-danger" onclick="updateSupplyStatus('${supply.id}', 'cancelled')">
                    إلغاء
                </button>
            </div>
        `;
        supplyRequests.appendChild(supplyCard);
    });
}

function updateSupplyStats() {
    const pending = hospitalState.bloodSupply.filter(s => s.status === 'pending').length;
    const processing = hospitalState.bloodSupply.filter(s => s.status === 'processing').length;
    const delivered = 15; // بيانات وهمية
    const cancelled = 1; // بيانات وهمية
    
    document.getElementById('supplyPending').textContent = pending;
    document.getElementById('supplyProcessing').textContent = processing;
    document.getElementById('supplyDelivered').textContent = delivered;
    document.getElementById('supplyCancelled').textContent = cancelled;
}

// ===== تحديث معلومات المشفى =====
function updateHospitalProfile() {
    const hospital = hospitalState.hospitalInfo;
    
    // تحديث المعلومات في القائمة العلوية
    document.getElementById('hospitalName').textContent = hospital.name;
    document.getElementById('hospitalAvatar').textContent = '🏥';
    document.getElementById('hospitalMenuName').textContent = hospital.name;
    document.getElementById('hospitalMenuAvatar').textContent = '🏥';
    
    // تحديث معلومات الملف الشخصي
    document.getElementById('hospitalProfileName').textContent = hospital.name;
    document.getElementById('hospitalProfileType').textContent = `مشفى ${hospital.type === 'government' ? 'حكومي' : 'خاص'} - ${hospital.level}`;
    document.getElementById('hospitalProfileAvatar').textContent = '🏥';
    document.getElementById('hospitalPhone').textContent = hospital.phone;
    document.getElementById('hospitalAddress').textContent = hospital.address;
    document.getElementById('hospitalDirector').textContent = hospital.director;
    document.getElementById('hospitalBeds').textContent = `${hospital.beds} سرير`;
    
    // تحديث الإحصائيات
    document.getElementById('monthlyRequests').textContent = hospitalState.reports.monthlyRequests;
    document.getElementById('monthlyUnits').textContent = hospitalState.reports.monthlyUnits;
    document.getElementById('fulfillmentRate').textContent = `${hospitalState.reports.fulfillmentRate}%`;
    document.getElementById('responseTime').textContent = `${hospitalState.reports.responseTime}`;
}

// ===== تحديث التقارير =====
function updateReports() {
    updateReportTable();
    // الرسوم البيانية سيتم تحديثها بواسطة initCharts
}

function updateReportTable() {
    const tableBody = document.getElementById('reportTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // بيانات وهمية للتقرير
    const reportData = [
        { date: '2024-01-01 إلى 2024-01-07', requests: 28, units: 85, responseTime: 2.1, fulfillment: 95, cost: '8,500' },
        { date: '2024-01-08 إلى 2024-01-14', requests: 32, units: 96, responseTime: 2.4, fulfillment: 94, cost: '9,600' },
        { date: '2024-01-15 إلى 2024-01-21', requests: 35, units: 105, responseTime: 2.3, fulfillment: 93, cost: '10,500' },
        { date: '2024-01-22 إلى 2024-01-28', requests: 29, units: 92, responseTime: 2.5, fulfillment: 96, cost: '9,200' }
    ];
    
    reportData.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.date}</td>
            <td>${report.requests}</td>
            <td>${report.units}</td>
            <td>${report.responseTime} ساعة</td>
            <td>${report.fulfillment}%</td>
            <td>${report.cost} ل.س</td>
        `;
        tableBody.appendChild(row);
    });
}

// ===== الرسوم البيانية =====
function initCharts() {
    // رسم بياني لاستخدام الدم حسب الفصيلة
    const bloodUsageCtx = document.getElementById('bloodUsageChart');
    if (bloodUsageCtx) {
        // eslint-disable-next-line no-undef, no-unused-vars
        const bloodUsageChart = new Chart(bloodUsageCtx, {
            type: 'bar',
            data: {
                labels: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
                datasets: [{
                    label: 'الوحدات المستخدمة',
                    data: [45, 12, 38, 20, 25, 8, 10, 4],
                    backgroundColor: [
                        '#dc2626', '#b91c1c', '#1e40af', '#1d4ed8',
                        '#7c3aed', '#8b5cf6', '#0d9488', '#0891b2'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // رسم بياني لطلبات الدم الشهرية
    const requestsCtx = document.getElementById('requestsChart');
    if (requestsCtx) {
        // eslint-disable-next-line no-undef, no-unused-vars
        const requestsChart = new Chart(requestsCtx, {
            type: 'line',
            data: {
                labels: ['يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                datasets: [{
                    label: 'طلبات الدم',
                    data: [112, 124, 98, 135, 142, 124],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // رسم بياني لأوقات الاستجابة
    const responseCtx = document.getElementById('responseTimeChart');
    if (responseCtx) {
        // eslint-disable-next-line no-undef, no-unused-vars
        const responseChart = new Chart(responseCtx, {
            type: 'doughnut',
            data: {
                labels: ['أقل من ساعة', '1-2 ساعة', '2-3 ساعة', 'أكثر من 3 ساعات'],
                datasets: [{
                    data: [15, 45, 30, 10],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// ===== دوال المساعدة =====
function getStatusText(status) {
    const statusMap = {
        'pending': 'معلق',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل',
        'rejected': 'مرفوض'
    };
    return statusMap[status] || status;
}

function getStatusClass(status) {
    const classMap = {
        'pending': 'pending',
        'processing': 'processing',
        'completed': 'completed',
        'rejected': 'rejected'
    };
    return classMap[status] || 'pending';
}

function getPriorityText(priority) {
    const priorityMap = {
        'normal': 'عادية',
        'high': 'عالية',
        'urgent': 'عاجلة'
    };
    return priorityMap[priority] || priority;
}

function getPriorityClass(priority) {
    const classMap = {
        'normal': 'normal',
        'high': 'high',
        'urgent': 'urgent'
    };
    return classMap[priority] || 'normal';
}

function getSupplyStatusText(status) {
    const statusMap = {
        'pending': 'معلق',
        'processing': 'قيد التجهيز',
        'delivered': 'تم التسليم',
        'cancelled': 'ملغى'
    };
    return statusMap[status] || status;
}

function getSupplyStatusClass(status) {
    const classMap = {
        'pending': 'pending',
        'processing': 'processing',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    };
    return classMap[status] || 'pending';
}

function getInventoryStatus(percentage) {
    if (percentage >= 75) return 'ممتلئ';
    if (percentage >= 50) return 'جيد';
    if (percentage >= 25) return 'متوسط';
    if (percentage > 0) return 'منخفض';
    return 'فارغ';
}

function getLevelClass(percentage) {
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    if (percentage >= 25) return 'low';
    return 'critical';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        day: 'numeric',
        month: 'short'
    });
}

function calculateDaysLeft(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ===== الموديلات =====
function setupModals() {
    // نموذج طلب دم جديد
    const newRequestForm = document.getElementById('newRequestForm');
    if (newRequestForm) {
        newRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createNewRequest();
        });
    }
    
    // نموذج تعديل معلومات المشفى
    const editHospitalForm = document.getElementById('editHospitalForm');
    if (editHospitalForm) {
        editHospitalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateHospitalInfo();
        });
    }
    
    // نموذج إضافة وحدات
    const addUnitsForm = document.getElementById('addUnitsForm');
    if (addUnitsForm) {
        addUnitsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addBloodUnits();
        });
    }
    
    // نموذج طلب إمدادات
    const supplyRequestForm = document.getElementById('supplyRequestForm');
    if (supplyRequestForm) {
        supplyRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createSupplyRequest();
        });
    }
}

function showNewRequestModal() {
    document.getElementById('newRequestModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showEditHospitalModal() {
    const hospital = hospitalState.hospitalInfo;
    
    // تعبئة النموذج بالبيانات الحالية
    document.getElementById('editHospitalName').value = hospital.name;
    document.getElementById('editHospitalType').value = hospital.type;
    document.getElementById('editHospitalPhone').value = hospital.phone;
    document.getElementById('editHospitalAddress').value = hospital.address;
    document.getElementById('editHospitalDirector').value = hospital.director;
    document.getElementById('editHospitalBeds').value = hospital.beds;
    
    document.getElementById('editHospitalModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showAddUnitsModal() {
    document.getElementById('addUnitsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showRequestDetails(requestId) {
    const request = hospitalState.bloodRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const detailsContent = document.getElementById('requestDetailsContent');
    if (detailsContent) {
        detailsContent.innerHTML = `
            <div class="request-detail-item">
                <strong>رقم الطلب:</strong> ${request.id}
            </div>
            <div class="request-detail-item">
                <strong>اسم المريض:</strong> ${request.patientName}
            </div>
            <div class="request-detail-item">
                <strong>العمر:</strong> ${request.patientAge}
            </div>
            <div class="request-detail-item">
                <strong>الجنس:</strong> ${request.patientGender === 'male' ? 'ذكر' : 'أنثى'}
            </div>
            <div class="request-detail-item">
                <strong>فصيلة الدم:</strong> ${request.bloodType}
            </div>
            <div class="request-detail-item">
                <strong>عدد الوحدات:</strong> ${request.units}
            </div>
            <div class="request-detail-item">
                <strong>الأولوية:</strong> <span class="${getPriorityClass(request.priority)}">${getPriorityText(request.priority)}</span>
            </div>
            <div class="request-detail-item">
                <strong>السبب:</strong> ${getRequestReasonText(request.reason)}
            </div>
            <div class="request-detail-item">
                <strong>الحالة:</strong> <span class="${getStatusClass(request.status)}">${getStatusText(request.status)}</span>
            </div>
            <div class="request-detail-item">
                <strong>تاريخ الطلب:</strong> ${formatDate(request.date)}
            </div>
            <div class="request-detail-item">
                <strong>تاريخ الاستحقاق:</strong> ${formatDate(request.dueDate)}
            </div>
            <div class="request-detail-item">
                <strong>ملاحظات:</strong> ${request.notes || 'لا توجد ملاحظات'}
            </div>
        `;
    }
    
    document.getElementById('requestDetailsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function getRequestReasonText(reason) {
    const reasonMap = {
        'surgery': 'عملية جراحية',
        'accident': 'حادث',
        'disease': 'مرض دم',
        'childbirth': 'ولادة',
        'other': 'سبب آخر'
    };
    return reasonMap[reason] || reason;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
    document.body.style.overflow = '';
}

// ===== دوال الطلبات =====
function createNewRequest() {
    const patientName = document.getElementById('patientName').value;
    const patientAge = document.getElementById('patientAge').value;
    const patientGender = document.getElementById('patientGender').value;
    const bloodType = document.getElementById('patientBloodType').value;
    const units = parseInt(document.getElementById('unitsNeeded').value);
    const priority = document.getElementById('requestPriority').value;
    const reason = document.getElementById('reasonForRequest').value;
    const notes = document.getElementById('requestNotes').value;
    
    const newRequest = {
        id: `REQ-${new Date().getFullYear()}-${String(hospitalState.bloodRequests.length + 1).padStart(3, '0')}`,
        patientName,
        patientAge: parseInt(patientAge),
        patientGender,
        bloodType,
        units,
        priority,
        reason,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
        notes
    };
    
    hospitalState.bloodRequests.unshift(newRequest);
    
    closeModal('newRequestModal');
    updateDashboard();
    updateBloodRequests();
    showToast('تم إنشاء طلب الدم بنجاح', 'success');
}

function processRequest(requestId) {
    const request = hospitalState.bloodRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'processing';
        updateDashboard();
        updateBloodRequests();
        showToast('تم بدء معالجة الطلب', 'info');
    }
}

function completeRequest(requestId) {
    const request = hospitalState.bloodRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'completed';
        
        // تحديث المخزون
        if (hospitalState.bloodInventory[request.bloodType]) {
            hospitalState.bloodInventory[request.bloodType].available -= request.units;
            hospitalState.bloodInventory[request.bloodType].used += request.units;
        }
        
        updateDashboard();
        updateBloodRequests();
        updateInventory();
        showToast('تم إكمال الطلب وتحديث المخزون', 'success');
    }
}

// ===== إدارة المخزون =====
function addBloodUnits() {
    const bloodType = document.getElementById('bloodTypeToAdd').value;
    const units = parseInt(document.getElementById('unitsToAdd').value);
    // eslint-disable-next-line no-unused-vars
    const sourceType = document.getElementById('sourceType').value;
    // eslint-disable-next-line no-unused-vars
    const expiryDate = document.getElementById('expiryDate').value;
    
    if (hospitalState.bloodInventory[bloodType]) {
        hospitalState.bloodInventory[bloodType].available += units;
        closeModal('addUnitsModal');
        updateDashboard();
        updateInventory();
        showToast(`تم إضافة ${units} وحدة من فصيلة ${bloodType}`, 'success');
    }
}

function adjustInventory(bloodType) {
    const newUnits = prompt(`تعديل مخزون فصيلة ${bloodType}:\n\nالكمية الحالية: ${hospitalState.bloodInventory[bloodType].available} وحدة\nأدخل الكمية الجديدة:`);
    
    if (newUnits && !isNaN(newUnits)) {
        const units = parseInt(newUnits);
        if (units >= 0) {
            hospitalState.bloodInventory[bloodType].available = units;
            updateDashboard();
            updateInventory();
            showToast(`تم تحديث مخزون ${bloodType} إلى ${units} وحدة`, 'success');
        }
    }
}

function useUnit(unitId) {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('هل تريد استخدام هذه الوحدة من الدم؟')) {
        showToast('تم استخدام الوحدة بنجاح', 'success');
        updateExpiringUnits();
    }
}

// ===== إدارة الإمدادات =====
function createSupplyRequest() {
    const bloodType = document.getElementById('requestedBloodType').value;
    const units = parseInt(document.getElementById('requestedUnits').value);
    const urgency = document.getElementById('urgencyLevel').value;
    const requiredBy = document.getElementById('requiredBy').value;
    const notes = document.getElementById('supplyNotes').value;
    
    const newSupply = {
        id: `SUP-${new Date().getFullYear()}-${String(hospitalState.bloodSupply.length + 1).padStart(3, '0')}`,
        bloodType,
        units,
        urgency,
        requiredBy,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        notes
    };
    
    hospitalState.bloodSupply.unshift(newSupply);
    
    document.getElementById('supplyRequestForm').reset();
    updateBloodSupply();
    showToast('تم إرسال طلب الإمدادات إلى البنك المركزي', 'success');
}

function updateSupplyStatus(supplyId, newStatus) {
    const supply = hospitalState.bloodSupply.find(s => s.id === supplyId);
    if (supply) {
        supply.status = newStatus;
        updateBloodSupply();
        showToast(`تم تحديث حالة الطلب إلى ${getSupplyStatusText(newStatus)}`, 'info');
    }
}

// ===== تحديث معلومات المشفى =====
function updateHospitalInfo() {
    const name = document.getElementById('editHospitalName').value;
    const type = document.getElementById('editHospitalType').value;
    const phone = document.getElementById('editHospitalPhone').value;
    const address = document.getElementById('editHospitalAddress').value;
    const director = document.getElementById('editHospitalDirector').value;
    const beds = parseInt(document.getElementById('editHospitalBeds').value);
    
    hospitalState.hospitalInfo = {
        ...hospitalState.hospitalInfo,
        name,
        type,
        phone,
        address,
        director,
        beds
    };
    
    closeModal('editHospitalModal');
    updateHospitalProfile();
    showToast('تم تحديث معلومات المشفى بنجاح', 'success');
}

// ===== الإجراءات الجماعية =====
function updateSelection() {
    const checkboxes = document.querySelectorAll('.request-checkbox:checked');
    const selectedCount = checkboxes.length;
    const bulkActions = document.getElementById('bulkActions');
    const selectedCountSpan = document.getElementById('selectedCount');
    
    if (selectedCount > 0) {
        bulkActions.style.display = 'block';
        selectedCountSpan.textContent = selectedCount;
    } else {
        bulkActions.style.display = 'none';
    }
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.request-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelection();
}

function bulkAction(action) {
    const checkboxes = document.querySelectorAll('.request-checkbox:checked');
    const requestIds = Array.from(checkboxes).map(cb => cb.value);
    
    if (requestIds.length === 0) {
        showToast('لم يتم اختيار أي طلبات', 'warning');
        return;
    }
    
    let message = '';
    let type = 'info';
    
    // eslint-disable-next-line default-case
    switch (action) {
        case 'approve':
            requestIds.forEach(id => {
                const request = hospitalState.bloodRequests.find(r => r.id === id);
                if (request) request.status = 'processing';
            });
            message = `تمت الموافقة على ${requestIds.length} طلب`;
            type = 'success';
            break;
            
        case 'reject':
            requestIds.forEach(id => {
                const request = hospitalState.bloodRequests.find(r => r.id === id);
                if (request) request.status = 'rejected';
            });
            message = `تم رفض ${requestIds.length} طلب`;
            type = 'warning';
            break;
            
        case 'process':
            requestIds.forEach(id => {
                const request = hospitalState.bloodRequests.find(r => r.id === id);
                if (request) request.status = 'processing';
            });
            message = `تم بدء معالجة ${requestIds.length} طلب`;
            type = 'info';
            break;
    }
    
    clearSelection();
    updateDashboard();
    updateBloodRequests();
    showToast(message, type);
}

function clearSelection() {
    document.getElementById('selectAll').checked = false;
    const checkboxes = document.querySelectorAll('.request-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateSelection();
}

// ===== التقارير =====
function generateReports() {
    const period = document.getElementById('reportPeriod').value;
    const customRange = document.getElementById('customDateRange');
    
    if (period === 'custom') {
        customRange.style.display = 'flex';
    } else {
        customRange.style.display = 'none';
    }
    
    updateReports();
    showToast(`تم تحديث التقارير للفترة: ${period}`, 'info');
}

function exportReport() {
    showToast('جاري تجهيز ملف التقرير للتحميل...', 'info');
    setTimeout(() => {
        showToast('تم تصدير التقرير بنجاح', 'success');
    }, 2000);
}

function printReport() {
    window.print();
}

// ===== القائمة المنسدلة للمشفى =====
function toggleHospitalMenu() {
    const hospitalMenu = document.getElementById('hospitalMenu');
    if (hospitalMenu) {
        hospitalMenu.classList.toggle('show');
    }
}

function hideHospitalMenu() {
    const hospitalMenu = document.getElementById('hospitalMenu');
    if (hospitalMenu) {
        hospitalMenu.classList.remove('show');
    }
}

function hospitalLogout() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('هل تريد تسجيل الخروج من النظام؟')) {
        showToast('تم تسجيل الخروج بنجاح', 'info');
        hideHospitalMenu();
        // في تطبيق حقيقي، هنا سيتم إعادة التوجيه لصفحة تسجيل الدخول
    }
}

// ===== نظام الإشعارات =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toastId = 'toast-' + Date.now();
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast('${toastId}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // إزالة تلقائية بعد 5 ثواني
    setTimeout(() => removeToast(toastId), 5000);
}

function removeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }
}

// ===== التهيئة عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    initHospitalSystem();
    
    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', (e) => {
        // إغلاق القائمة المنسدلة
        const hospitalMenu = document.getElementById('hospitalMenu');
        const hospitalInfo = document.querySelector('.hospital-info');
        
        if (hospitalMenu && hospitalMenu.classList.contains('show') &&
            !hospitalMenu.contains(e.target) &&
            !(hospitalInfo && hospitalInfo.contains(e.target))) {
            hideHospitalMenu();
        }
        
        // إغلاق Modals
        if (!e.target.closest('.modal-content') && 
            !e.target.closest('[onclick*="show"]')) {
            closeModal('newRequestModal');
            closeModal('editHospitalModal');
            closeModal('addUnitsModal');
            closeModal('requestDetailsModal');
        }
    });
});

// ===== دوال عامة متاحة عالمياً =====
window.navigateTo = navigateTo;
window.showNewRequestModal = showNewRequestModal;
window.showEditHospitalModal = showEditHospitalModal;
window.showAddUnitsModal = showAddUnitsModal;
window.showRequestDetails = showRequestDetails;
window.closeModal = closeModal;
window.filterRequests = filterRequests;
window.updateSelection = updateSelection;
window.toggleSelectAll = toggleSelectAll;
window.bulkAction = bulkAction;
window.clearSelection = clearSelection;
window.toggleHospitalMenu = toggleHospitalMenu;
window.hideHospitalMenu = hideHospitalMenu;
window.hospitalLogout = hospitalLogout;
window.removeToast = removeToast;
window.generateReports = generateReports;
window.exportReport = exportReport;
window.printReport = printReport;
window.updateInventory = updateInventory;
window.processRequest = processRequest;
window.completeRequest = completeRequest;
window.adjustInventory = adjustInventory;
window.useUnit = useUnit;
window.updateSupplyStatus = updateSupplyStatus;