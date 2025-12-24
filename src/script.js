/**
 * بنك الدم - درعا
 * الجافاسكريبت الرئيسي
 */

// ===== نظام الدولة والتخزين =====
const appState = {
    currentSection: 'home',
    user: {
        isLoggedIn: false,
        name: 'متبرع جديد',
        phone: null,
        totalDonations: 0,
        city: null,
        status: 'جاهز للتبرع',
        bloodType: null,
        lastDonation: null,
        donationHistory: [],
        badges: ['welcome', 'daraa']
    },
    formData: {}
};

// ===== نظام معلومات فصائل الدم =====
const bloodTypeInfo = {
    'O+': {
        name: 'O موجب',
        percentage: '38%',
        canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
        canReceiveFrom: ['O+', 'O-'],
        importance: 'الأكثر شيوعاً',
        description: 'الفصيلة الأكثر شيوعاً في العالم العربي',
        rarity: 'شائع',
        color: '#dc2626'
    },
    'O-': {
        name: 'O سالب',
        percentage: '7%',
        canDonateTo: ['جميع الفصائل'],
        canReceiveFrom: ['O- فقط'],
        importance: 'المانح العالمي',
        description: 'فصيلة الدم الوحيدة التي يمكن نقلها لأي شخص في حالات الطوارئ',
        rarity: 'نادر جداً',
        color: '#b91c1c'
    },
    'A+': {
        name: 'A موجب',
        percentage: '34%',
        canDonateTo: ['A+', 'AB+'],
        canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
        importance: 'شائع جداً',
        description: 'ثاني أكثر فصيلة دم شيوعاً',
        rarity: 'شائع',
        color: '#1e40af'
    },
    'A-': {
        name: 'A سالب',
        percentage: '6%',
        canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
        canReceiveFrom: ['A-', 'O-'],
        importance: 'مهم للعمليات الجراحية',
        description: 'مطلوب بشكل خاص للعمليات الجراحية المخططة',
        rarity: 'نادر نسبياً',
        color: '#1d4ed8'
    },
    'B+': {
        name: 'B موجب',
        percentage: '9%',
        canDonateTo: ['B+', 'AB+'],
        canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
        importance: 'مهم في منطقتك',
        description: 'منتشر في منطقة الشرق الأوسط',
        rarity: 'متوسط',
        color: '#7c3aed'
    },
    'B-': {
        name: 'B سالب',
        percentage: '2%',
        canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
        canReceiveFrom: ['B-', 'O-'],
        importance: 'نادر جداً',
        description: 'من أندر فصائل الدم',
        rarity: 'نادر جداً',
        color: '#8b5cf6'
    },
    'AB+': {
        name: 'AB موجب',
        percentage: '3%',
        canDonateTo: ['AB+ فقط'],
        canReceiveFrom: ['جميع الفصائل'],
        importance: 'المتلقي العالمي',
        description: 'يمكنه استقبال الدم من أي فصيلة',
        rarity: 'نادر',
        color: '#0d9488'
    },
    'AB-': {
        name: 'AB سالب',
        percentage: '1%',
        canDonateTo: ['AB+', 'AB-'],
        canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
        importance: 'الأندر',
        description: 'أندر فصيلة دم في العالم',
        rarity: 'نادر للغاية',
        color: '#0891b2'
    }
};

// ===== الحقائق السريعة =====
const quickFacts = [
    "كل تبرع دم يمكن أن ينقذ حياة 3 أشخاص",
    "الدم المتبرع به يُخزن لمدة 42 يومًا فقط",
    "يمكن التبرع بالدم كل 3 أشهر للرجال و4 أشهر للنساء",
    "في درعا، يحتاج المستشفيات إلى 50 وحدة دم يومياً",
    "85% من سكان درعا مؤهلون للتبرع بالدم",
    "التبرع المنتظم يقلل خطر الإصابة بأمراض القلب",
    "فصيلة O- تعتبر المانح العالمي في حالات الطوارئ",
    "فصيلة AB+ يمكنها استقبال الدم من أي فصيلة",
    "وزن 50 كجم هو الحد الأدنى للتبرع بالدم",
    "التبرع بالدم يساعد في تجديد خلايا الدم"
];

// ===== الأوسمة والشهادات =====
const badges = {
    welcome: {
        id: 'welcome',
        name: 'أهلاً وسهلاً',
        description: 'متبرع جديد في درعا',
        icon: 'fas fa-heart',
        color: 'welcome'
    },
    daraa: {
        id: 'daraa',
        name: 'درعاوي أصيل',
        description: 'متبرع من محافظة درعا',
        icon: 'fas fa-map-marker-alt',
        color: 'daraa'
    },
    firstDonation: {
        id: 'firstDonation',
        name: 'خطوة البداية',
        description: 'أول تبرع بالدم',
        icon: 'fas fa-trophy',
        color: 'hero'
    },
    regularDonor: {
        id: 'regularDonor',
        name: 'متبرع منتظم',
        description: '3 تبرعات على الأقل',
        icon: 'fas fa-medal',
        color: 'hero'
    },
    bloodHero: {
        id: 'bloodHero',
        name: 'بطل الدم',
        description: '5 تبرعات أو أكثر',
        icon: 'fas fa-crown',
        color: 'hero'
    },
    rareType: {
        id: 'rareType',
        name: 'الفاتر نادر',
        description: 'حامل فصيلة دم نادرة',
        icon: 'fas fa-gem',
        color: 'daraa'
    },
    lifesaver: {
        id: 'lifesaver',
        name: 'منقذ أرواح',
        description: 'ساهم في إنقاذ أكثر من 10 حياة',
        icon: 'fas fa-hands-helping',
        color: 'hero'
    },
    goldenDonor: {
        id: 'goldenDonor',
        name: 'المتبرع الذهبي',
        description: '10 تبرعات أو أكثر',
        icon: 'fas fa-star',
        color: 'hero'
    },
    activeMember: {
        id: 'activeMember',
        name: 'عضو نشط',
        description: 'متبرع في آخر 6 أشهر',
        icon: 'fas fa-bolt',
        color: 'daraa'
    }
};

// ===== البيانات الحقيقية لدرعا =====
const daraaData = {
    cities: [
        { id: 'daraa-city', name: 'مدينة درعا' },
        { id: 'daraa-al-balad', name: 'درعا البلد' },
        { id: 'al-sanamayn', name: 'الصنمين' },
        { id: 'al-harra', name: 'الحراك' },
        { id: 'in-khil', name: 'إنخل' },
        { id: 'jassim', name: 'جاسم' },
        { id: 'nawa', name: 'نوى' },
        { id: 'tassil', name: 'تسيل' },
        { id: 'al-muzayrib', name: 'المزيريب' },
        { id: 'al-yadudah', name: 'اليادودة' },
        { id: 'azraa', name: 'أزرع' },
        { id: 'bosra', name: 'بصري' },
        { id: 'tafas', name: 'طفس' },
        { id: 'other', name: 'قرية أخرى' }
    ],
    
    centers: [
        { 
            id: 'daraa-national', 
            name: 'مشفى درعا الوطني', 
            type: 'حكومي',
            phone: '6778610',
            address: 'درعا – حي السحاري – طريق المشفى'
        },
        { 
            id: 'azraa-national', 
            name: 'مشفى أزرع الوطني', 
            type: 'حكومي',
            phone: '5835249 - 5834247',
            address: 'أزرع – طريق دمشق القديم'
        },
        { 
            id: 'bosra-national', 
            name: 'مشفى بصري الوطني', 
            type: 'حكومي',
            phone: '5841442 - 5841431',
            address: 'بصري – الحي الجنوبي'
        },
        { 
            id: 'jassim-national', 
            name: 'مشفى جاسم الوطني', 
            type: 'حكومي',
            phone: '4882984',
            address: 'شمال شرق مدينة جاسم – طريق دير العدس'
        },
        { 
            id: 'tafas-national', 
            name: 'مشفى طفس الوطني', 
            type: 'حكومي',
            phone: '2222847',
            address: 'طفس – الطريق العام – جانب سوق الهال'
        },
        { 
            id: 'nawa-national', 
            name: 'مشفى نوى الوطني', 
            type: 'حكومي',
            phone: '277481',
            address: 'نوى – الحي الشمالي – طريق جاسم'
        },
        { 
            id: 'ash-shifa', 
            name: 'مشفى الشفاء', 
            type: 'خاص',
            phone: '2215242',
            address: 'درعا – حي السحاري – جنوب المركز الثقافي'
        },
        { 
            id: 'ar-rahma', 
            name: 'مشفى الرحمة', 
            type: 'خاص',
            phone: '0938850899',
            address: 'درعا – حي المطار – غرب حديقة المطار'
        },
        { 
            id: 'ash-sharq', 
            name: 'مشفى الشرق', 
            type: 'خاص',
            phone: '2227333 - 2224259',
            address: 'درعا – شمال دوار الدلة'
        }
    ],
    
    emergencyNumbers: {
        emergency: '112',
        ambulance: '110',
        daraaNational: '6778610'
    }
};

// ===== نظام الأمراض المزمنة المانعة للتبرع =====
// eslint-disable-next-line no-unused-vars
const chronicDiseases = {
    // قائمة الأمراض المزمنة التي تمنع التبرع نهائياً حسب منظمة الصحة العالمية
    preventingDiseases: [
        'السرطان',
        'أمراض القلب المزمنة',
        'أمراض الكبد المزمنة (التهاب الكبد الوبائي)',
        'أمراض الكلى المزمنة',
        'فيروس نقص المناعة البشرية (الإيدز)',
        'فيروسات الكبد B و C',
        'السل النشط',
        'أمراض الدم المزمنة (الثلاسيميا، فقر الدم المنجلي)',
        'الصرع غير المتحكم به',
        'السكري غير المستقر',
        'أمراض المناعة الذاتية'
    ],
    
    // الأمراض التي تحتاج إلى استشارة طبية
    needConsultation: [
        'ارتفاع ضغط الدم',
        'السكري المتحكم به',
        'الربو',
        'أمراض الغدة الدرقية',
        'الاكتئاب والقلق'
    ]
};

// ===== نظام المصادقة المعدل =====
class AuthSystem {
    constructor() {
        this.STORAGE_KEY = 'blood_bank_daraa_user';
        this.USERS_KEY = 'blood_bank_users';
        this.DONATIONS_KEY = 'blood_bank_donations';
    }
    
    init() {
        this.loadSession();
        this.setupEventListeners();
        this.updateUI();
    }
    
    loadSession() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const user = JSON.parse(stored);
                appState.user = { 
                    ...appState.user, 
                    ...user, 
                    isLoggedIn: true 
                };
                
                // تحميل تاريخ التبرعات
                this.loadDonationHistory();
            }
        } catch (e) {
            this.clearSession();
        }
    }
    
    saveSession(user) {
        const { password, ...safeUser } = user;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(safeUser));
        appState.user = { 
            ...appState.user, 
            ...safeUser, 
            isLoggedIn: true 
        };
        this.updateUI();
    }
    
    clearSession() {
        localStorage.removeItem(this.STORAGE_KEY);
        appState.user = {
            isLoggedIn: false,
            name: 'متبرع جديد',
            phone: null,
            totalDonations: 0,
            city: null,
            status: 'جاهز للتبرع',
            bloodType: null,
            lastDonation: null,
            donationHistory: [],
            badges: ['welcome', 'daraa']
        };
        this.updateUI();
    }
    
    getUsers() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
    
    getDonationHistory() {
        const history = localStorage.getItem(this.DONATIONS_KEY);
        return history ? JSON.parse(history) : [];
    }
    
    saveDonationHistory(history) {
        localStorage.setItem(this.DONATIONS_KEY, JSON.stringify(history));
    }
    
    loadDonationHistory() {
        const allHistory = this.getDonationHistory();
        if (appState.user.phone) {
            appState.user.donationHistory = allHistory.filter(
                donation => donation.phone === appState.user.phone
            );
            appState.user.totalDonations = appState.user.donationHistory.length;
            
            if (appState.user.donationHistory.length > 0) {
                appState.user.lastDonation = appState.user.donationHistory[0].date;
            }
        }
    }
    
    async login(phone, password) {
        const users = this.getUsers();
        const user = users.find(u => u.phone === phone && u.password === password);
        
        if (!user) {
            throw new Error('رقم الهاتف أو كلمة المرور غير صحيحة');
        }
        
        this.saveSession(user);
        this.loadDonationHistory();
        showToast('تم تسجيل الدخول بنجاح', 'success');
        closeAllModals();
        updateProfileSection();
        navigateTo('profile');
        return true;
    }
    
    // ===== تعديل دالة التسجيل لإضافة سؤال الأمراض المزمنة =====
    async register(userData) {
        const { name, phone, password, confirmPassword, hasChronicDisease } = userData;
        const bloodType = document.getElementById('regBloodType')?.value || 'unknown';
        
        // التحقق من البيانات
        if (!name || name.length < 2) throw new Error('الاسم يجب أن يكون على الأقل حرفين');
        if (!this.isValidPhone(phone)) throw new Error('رقم الهاتف غير صحيح');
        if (password.length < 6) throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        if (password !== confirmPassword) throw new Error('كلمات المرور غير متطابقة');
        
        // التحقق من وجود المستخدم
        const users = this.getUsers();
        if (users.some(u => u.phone === phone)) {
            throw new Error('رقم الهاتف مسجل مسبقاً');
        }
        
        // التحقق من الأمراض المزمنة
        if (hasChronicDisease === 'yes') {
            throw new Error('لا يمكن التسجيل بسبب الأمراض المزمنة. يرجى مراجعة طبيبك.');
        }
        
        // إنشاء المستخدم الجديد
        const newUser = {
            id: Date.now(),
            name,
            phone,
            password,
            bloodType: bloodType !== 'unknown' ? bloodType : null,
            totalDonations: 0,
            city: 'درعا',
            status: 'نشط',
            lastDonation: null,
            badges: ['welcome', 'daraa'],
            hasChronicDisease: hasChronicDisease === 'yes',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // إذا كانت الفصيلة معروفة، أضف شارة Rare إذا كانت نادرة
        if (bloodType !== 'unknown' && ['O-', 'B-', 'AB-'].includes(bloodType)) {
            newUser.badges.push('rareType');
        }
        
        users.push(newUser);
        this.saveUsers(users);
        
        // تسجيل الدخول تلقائياً
        this.saveSession(newUser);
        this.loadDonationHistory();
        
        showToast('تم إنشاء الحساب بنجاح', 'success');
        closeAllModals();
        updateProfileSection();
        navigateTo('profile');
        return true;
    }
    
    isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return /^(09|9)\d{9}$/.test(cleaned); // تغيير من 8 إلى 9 ليكون 10 أرقام
    }
    
    // ===== إضافة معالجة للأمراض المزمنة في التسجيل =====
    setupEventListeners() {
        // تسجيل الدخول
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await this.login(
                        document.getElementById('loginPhone').value,
                        document.getElementById('loginPassword').value
                    );
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        }
        
        // التسجيل مع التحقق من الأمراض المزمنة
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            // التحقق من الأمراض المزمنة في الوقت الفعلي
            const diseaseRadios = document.querySelectorAll('input[name="regChronicDisease"]');
            diseaseRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const warningDiv = document.querySelector('.reg-disease-warning');
                    if (e.target.value === 'yes' && warningDiv) {
                        warningDiv.style.display = 'block';
                    } else if (warningDiv) {
                        warningDiv.style.display = 'none';
                    }
                });
            });
            
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const hasChronicDisease = document.querySelector('input[name="regChronicDisease"]:checked')?.value;
                    
                    await this.register({
                        name: document.getElementById('regName').value,
                        phone: document.getElementById('regPhone').value,
                        password: document.getElementById('regPassword').value,
                        confirmPassword: document.getElementById('regConfirmPassword').value,
                        hasChronicDisease: hasChronicDisease
                    });
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        }
    }
    
    updateUI() {
        const authButtons = document.getElementById('authButtons');
        const userInfo = document.querySelector('.user-info');
        const userAvatar = document.getElementById('userAvatarText');
        const userName = document.querySelector('.user-name');
        const userInitial = document.getElementById('userInitial');
        const userFullName = document.getElementById('userFullName');
        const userPhone = document.getElementById('userPhone');
        
        if (appState.user.isLoggedIn) {
            // إخفاء أزرار الدخول
            if (authButtons) authButtons.style.display = 'none';
            
            // إظهار معلومات المستخدم
            if (userInfo) {
                userInfo.classList.add('visible');
                if (userAvatar) {
                    const initials = this.getInitials(appState.user.name);
                    userAvatar.textContent = initials;
                }
                if (userName) userName.textContent = appState.user.name;
            }
            
            // تحديث القائمة المنسدلة
            if (userInitial) {
                const initials = this.getInitials(appState.user.name);
                userInitial.textContent = initials;
            }
            if (userFullName) userFullName.textContent = appState.user.name;
            if (userPhone) userPhone.textContent = appState.user.phone || 'غير محدد';
            
        } else {
            // إظهار أزرار الدخول
            if (authButtons) authButtons.style.display = 'flex';
            
            // إخفاء معلومات المستخدم
            if (userInfo) {
                userInfo.classList.remove('visible');
                if (userName) userName.textContent = 'متبرع جديد';
            }
            
            // إخفاء القائمة المنسدلة
            this.hideUserMenu();
        }
    }
    
    getInitials(name) {
        if (!name) return 'م';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
    logout() {
        this.clearSession();
        showToast('تم تسجيل الخروج', 'info');
        navigateTo('home');
        this.hideUserMenu();
    }
    
    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.toggle('show');
        }
    }
    
    hideUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.classList.remove('show');
        }
    }
}

// إنشاء نسخة من النظام
const authSystem = new AuthSystem();

// ===== نظام الملف الشخصي =====
function updateProfileSection() {
    if (!appState.user.isLoggedIn) {
        setGuestProfile();
    } else {
        setUserProfile();
    }
}

function setGuestProfile() {
    // المعلومات الأساسية
    document.getElementById('profileName').textContent = 'مرحباً، متبرع جديد';
    document.getElementById('profileStatus').textContent = 'سجل الآن لتبدأ رحلة الإنقاذ في درعا';
    document.getElementById('profileAvatar').textContent = 'م';
    
    const bloodBadge = document.getElementById('bloodTypeBadge');
    if (bloodBadge) {
        bloodBadge.textContent = '?';
        bloodBadge.style.background = '#6b7280';
    }
    
    // إحصائيات
    document.getElementById('totalDonations').textContent = '0';
    document.getElementById('livesSaved').textContent = '0';
    document.getElementById('daysToNext').textContent = '--';
    document.getElementById('localRank').textContent = '--';
    document.getElementById('lastDonationDate').textContent = 'لا يوجد';
    
    // معلومات الدم
    document.getElementById('bloodTypeValue').textContent = 'غير معروفة';
    document.getElementById('bloodTypeFact').textContent = 'فصيلة الدم';
    document.getElementById('bloodImportance').textContent = '--';
    document.getElementById('bloodTypeInfo').textContent = 'سجل فصيلة دمك للحصول على معلومات مهمة';
    document.getElementById('bloodPercentage').textContent = '--';
    document.getElementById('canDonateTo').textContent = '--';
    document.getElementById('canReceiveFrom').textContent = '--';
    
    // الشارات
    updateBadges(['welcome', 'daraa']);
    
    // حقائق سريعة
    updateRandomFact();
    
    // المستوى
    updateLevelBar(0);
    document.getElementById('levelText').textContent = 'مبتدئ';
    document.getElementById('donorLevel').textContent = 'مبتدئ';
    
    // الأزرار
    document.getElementById('profileActions').innerHTML = `
        <button class="btn btn-primary" onclick="showRegisterModal()">
            <i class="fas fa-plus"></i>
            إنشاء حساب
        </button>
        <button class="btn btn-outline" onclick="showLoginModal()">
            <i class="fas fa-sign-in-alt"></i>
            تسجيل الدخول
        </button>
    `;
    
    // تاريخ التبرعات
    updateDonationHistory([]);
}

function setUserProfile() {
    const user = appState.user;
    const initials = authSystem.getInitials(user.name);
    
    // المعلومات الأساسية
    document.getElementById('profileName').textContent = `مرحباً، ${user.name}`;
    document.getElementById('profileAvatar').textContent = initials;
    
    // تحديد حالة المستخدم
    let statusText = 'جاهز للتبرع';
    if (user.city) {
        statusText = `متبرع نشط من ${user.city}`;
    }
    document.getElementById('profileStatus').textContent = statusText;
    
    // فصيلة الدم
    const bloodType = user.bloodType || 'unknown';
    const bloodBadge = document.getElementById('bloodTypeBadge');
    
    if (bloodType === 'unknown') {
        bloodBadge.textContent = '?';
        bloodBadge.style.background = '#6b7280';
    } else {
        bloodBadge.textContent = bloodType;
        bloodBadge.style.background = getBloodTypeColor(bloodType);
    }
    
    // تحديث جميع المعلومات
    updateBloodInfo(bloodType);
    updateDonationStats(user);
    updateUserLevel(user);
    updateBadges(getUserBadges(user));
    updateRandomFact();
    updateProfileActions(user);
    updateDonationHistory(user.donationHistory || []);
}

function updateBloodInfo(bloodType) {
    const bloodInfo = bloodTypeInfo[bloodType];
    
    if (bloodInfo) {
        // معلومات الفصيلة
        document.getElementById('bloodTypeValue').textContent = bloodType;
        document.getElementById('bloodTypeFact').textContent = `فصيلة ${bloodInfo.name}`;
        document.getElementById('bloodImportance').textContent = bloodInfo.importance;
        document.getElementById('bloodTypeInfo').textContent = bloodInfo.description;
        document.getElementById('bloodPercentage').textContent = bloodInfo.percentage;
        document.getElementById('canDonateTo').textContent = bloodInfo.canDonateTo.join('، ');
        document.getElementById('canReceiveFrom').textContent = bloodInfo.canReceiveFrom.join('، ');
        
        // إبراز الفصيلة النادرة
        const bloodInfoCard = document.getElementById('bloodInfoCard');
        if (['O-', 'B-', 'AB-'].includes(bloodType)) {
            bloodInfoCard.style.borderTopColor = bloodInfo.color;
        }
    } else {
        // فصيلة غير معروفة
        document.getElementById('bloodTypeValue').textContent = 'غير معروفة';
        document.getElementById('bloodImportance').textContent = 'غير معروفة';
        document.getElementById('bloodTypeInfo').textContent = 'سجل فصيلة دمك للحصول على معلومات مهمة';
        document.getElementById('bloodPercentage').textContent = '--';
        document.getElementById('canDonateTo').textContent = '--';
        document.getElementById('canReceiveFrom').textContent = '--';
    }
}

function getBloodTypeColor(bloodType) {
    const info = bloodTypeInfo[bloodType];
    return info ? info.color : '#dc2626';
}

function updateDonationStats(user) {
    const totalDonations = user.totalDonations || 0;
    const livesSaved = totalDonations * 3; // كل تبرع ينقذ 3 أشخاص
    
    // الإحصائيات الأساسية
    document.getElementById('totalDonations').textContent = totalDonations;
    document.getElementById('livesSaved').textContent = livesSaved;
    
    // تاريخ آخر تبرع
    const lastDonationDate = document.getElementById('lastDonationDate');
    if (user.lastDonation) {
        const lastDate = new Date(user.lastDonation);
        const formattedDate = lastDate.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        lastDonationDate.textContent = formattedDate;
    } else {
        lastDonationDate.textContent = 'لا يوجد';
    }
    
    // حساب الأيام المتبقية للتبرع القادم
    const daysToNext = document.getElementById('daysToNext');
    if (user.lastDonation) {
        const lastDate = new Date(user.lastDonation);
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 90); // 90 يوم بين كل تبرع
        
        const today = new Date();
        const diffTime = nextDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            daysToNext.textContent = diffDays;
        } else {
            daysToNext.textContent = 'جاهز الآن';
            daysToNext.style.color = '#10b981';
        }
    } else {
        daysToNext.textContent = 'جاهز الآن';
        daysToNext.style.color = '#10b981';
    }
    
    // المستوى المحلي
    const localRank = document.getElementById('localRank');
    if (totalDonations >= 10) {
        localRank.textContent = 'بطل';
        localRank.style.color = '#f59e0b';
    } else if (totalDonations >= 5) {
        localRank.textContent = 'متقدم';
        localRank.style.color = '#3b82f6';
    } else if (totalDonations >= 1) {
        localRank.textContent = 'نشط';
        localRank.style.color = '#10b981';
    } else {
        localRank.textContent = 'مبتدئ';
        localRank.style.color = '#6b7280';
    }
}

function updateUserLevel(user) {
    const totalDonations = user.totalDonations || 0;
    let level, levelText, progress;
    
    if (totalDonations >= 10) {
        level = 'بطل';
        levelText = 'المتبرع البطل';
        progress = 100;
    } else if (totalDonations >= 5) {
        level = 'متقدم';
        levelText = 'المتبرع المتقدم';
        progress = Math.min(100, (totalDonations / 10) * 100);
    } else if (totalDonations >= 1) {
        level = 'نشط';
        levelText = 'المتبرع النشط';
        progress = Math.min(100, (totalDonations / 5) * 100);
    } else {
        level = 'مبتدئ';
        levelText = 'المتبرع المبتدئ';
        progress = 10;
    }
    
    document.getElementById('levelText').textContent = levelText;
    document.getElementById('donorLevel').textContent = level;
    
    // تحديث شريط التقدم
    const progressBar = document.getElementById('levelProgress');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = `${progress}%`;
        }, 100);
    }
}

function getUserBadges(user) {
    const userBadges = ['welcome', 'daraa'];
    const totalDonations = user.totalDonations || 0;
    const bloodType = user.bloodType;
    
    // شارات التبرع
    if (totalDonations >= 1) userBadges.push('firstDonation');
    if (totalDonations >= 3) userBadges.push('regularDonor');
    if (totalDonations >= 5) userBadges.push('bloodHero');
    if (totalDonations >= 10) userBadges.push('goldenDonor');
    
    // شارات خاصة
    if (bloodType && ['O-', 'B-', 'AB-'].includes(bloodType)) {
        userBadges.push('rareType');
    }
    
    if (totalDonations >= 3) {
        userBadges.push('lifesaver');
    }
    
    if (user.lastDonation) {
        const lastDate = new Date(user.lastDonation);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (lastDate > sixMonthsAgo) {
            userBadges.push('activeMember');
        }
    }
    
    appState.user.badges = userBadges;
    return userBadges;
}

function updateBadges(badgeIds) {
    const badgesGrid = document.getElementById('badgesGrid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    
    badgeIds.forEach(badgeId => {
        const badge = badges[badgeId];
        if (badge) {
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge-item ${badge.color}-badge`;
            badgeElement.innerHTML = `
                <div class="badge-icon">
                    <i class="${badge.icon}"></i>
                </div>
                <div class="badge-info">
                    <h5>${badge.name}</h5>
                    <p>${badge.description}</p>
                </div>
            `;
            badgesGrid.appendChild(badgeElement);
        }
    });
}

function updateRandomFact() {
    const randomFactElement = document.getElementById('randomFact');
    if (randomFactElement) {
        const randomIndex = Math.floor(Math.random() * quickFacts.length);
        randomFactElement.textContent = quickFacts[randomIndex];
    }
}

function updateProfileActions(user) {
    const profileActions = document.getElementById('profileActions');
    if (!profileActions) return;
    
    const totalDonations = user.totalDonations || 0;
    
    profileActions.innerHTML = `
        <button class="btn btn-primary" onclick="navigateTo('donate')">
            <i class="fas fa-plus"></i>
            ${totalDonations === 0 ? 'ابدأ أول تبرع' : 'تبرع جديد'}
        </button>
        <button class="btn btn-outline" onclick="showBloodInfoModal()">
            <i class="fas fa-info-circle"></i>
            معلومات عن التبرع
        </button>
        <button class="btn btn-secondary" onclick="shareAchievement()">
            <i class="fas fa-share-alt"></i>
            شارك إنجازك
        </button>
    `;
}

function updateDonationHistory(donations) {
    const historyList = document.getElementById('donationHistory');
    if (!historyList) return;
    
    if (donations.length === 0) {
        historyList.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-history"></i>
                <p>لا توجد تبرعات سابقة</p>
                <button class="btn btn-sm btn-outline" onclick="navigateTo('donate')">
                    ابدأ أول تبرع
                </button>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    // ترتيب التبرعات من الأحدث إلى الأقدم
    donations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    donations.forEach((donation, index) => {
        if (index >= 5) return; // عرض آخر 5 تبرعات فقط
        
        const donationDate = new Date(donation.date);
        // تغيير التاريخ من الهجري إلى الميلادي
        const formattedDate = donationDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const donationElement = document.createElement('div');
        donationElement.className = 'donation-item';
        donationElement.innerHTML = `
            <div class="donation-info">
                <div class="donation-date">${formattedDate}</div>
                <div class="donation-center">${donation.center || 'مركز التبرع'}</div>
            </div>
            <div class="donation-status completed">مكتمل</div>
        `;
        
        historyList.appendChild(donationElement);
    });
}

// ===== تحديث فصيلة الدم =====
function updateBloodTypePrompt() {
    if (!appState.user.isLoggedIn) {
        showToast('يجب تسجيل الدخول أولاً', 'warning');
        showLoginModal();
        return;
    }
    
    const currentType = appState.user.bloodType || 'unknown';
    let currentText = currentType === 'unknown' ? 'غير معروفة' : currentType;
    
    const bloodType = prompt(
        `فصيلة دمك الحالية: ${currentText}\n\n` +
        'أدخل فصيلة دمك الجديدة:\n' +
        'الخيارات المتاحة: O+, O-, A+, A-, B+, B-, AB+, AB-\n\n' +
        'أدخل "غير معروفة" إذا كنت لا تعرف فصيلة دمك',
        currentType === 'unknown' ? '' : currentType
    );
    
    if (bloodType === null) return; // المستخدم ضغط إلغاء
    
    let formattedType = bloodType.trim().toUpperCase();
    
    // معالجة حالة "غير معروفة"
    if (formattedType === 'غير معروفة' || formattedType === 'UNKNOWN' || formattedType === '') {
        formattedType = 'unknown';
    }
    
    // التحقق من صحة الفصيلة
    const validTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB+', 'AB-'];
    if (formattedType !== 'unknown' && !validTypes.includes(formattedType)) {
        showToast('فصيلة الدم غير صحيحة. الرجاء استخدام التنسيق الصحيح (مثال: O+, A-)', 'error');
        return;
    }
    
    // تحديث في appState
    appState.user.bloodType = formattedType !== 'unknown' ? formattedType : null;
    
    // تحديث في قاعدة البيانات
    const users = authSystem.getUsers();
    const userIndex = users.findIndex(u => u.phone === appState.user.phone);
    if (userIndex !== -1) {
        users[userIndex].bloodType = formattedType !== 'unknown' ? formattedType : null;
        
        // تحديث الشارات
        if (formattedType !== 'unknown' && ['O-', 'B-', 'AB-'].includes(formattedType)) {
            if (!users[userIndex].badges.includes('rareType')) {
                users[userIndex].badges.push('rareType');
                showToast('مبروك! حصلت على شارة "الفاتر نادر"', 'success');
            }
        } else {
            // إزالة شارة rare إذا لم تعد الفصيلة نادرة
            const badgeIndex = users[userIndex].badges.indexOf('rareType');
            if (badgeIndex !== -1) {
                users[userIndex].badges.splice(badgeIndex, 1);
            }
        }
        
        authSystem.saveUsers(users);
    }
    
    // حفظ في الجلسة
    authSystem.saveSession(appState.user);
    
    // تحديث الواجهة
    updateProfileSection();
    
    if (formattedType === 'unknown') {
        showToast('تم تحديث فصيلة دمك إلى "غير معروفة"', 'info');
    } else {
        showToast(`تم تحديث فصيلة دمك إلى ${formattedType} بنجاح`, 'success');
    }
}

// ===== نظام التنقل =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navigateTo('home');
    
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
    
    // التنقل أثناء التمرير
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const sectionId = section.getAttribute('id');
                setActiveNavLink(sectionId);
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
        appState.currentSection = sectionId;
        
        // التمرير إلى القسم
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
        
        // تحديث رابط التنقل النشط
        setActiveNavLink(sectionId);
        
        // تحديث المحتوى حسب القسم
        if (sectionId === 'profile') {
            updateProfileSection();
        } else if (sectionId === 'donate') {
            initDonationForm();
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

// ===== نظام التدخين وسياسات التبرع العالمية =====
const smokingPolicies = {
    restrictions: {
        beforeDonation: {
            hours: 12, // عدم التدخين قبل التبرع بـ 12 ساعة
            reason: 'النيكوتين يسبب تضيق الأوعية الدموية ويؤثر على تدفق الدم'
        },
        afterDonation: {
            hours: 2, // عدم التدخين بعد التبرع بـ ساعتين
            reason: 'يؤثر على الشفاء ويزيد الدوخة'
        },
        caffeine: {
            hours: 4, // عدم تناول الكافيين قبل 4 ساعات
            reason: 'يزيد من ضغط الدم ومعدل ضربات القلب'
        }
    },
    
    instructions: {
        smoker: [
            'توقف عن التدخين لمدة 12 ساعة قبل التبرع',
            'تجنب التدخين لمدة ساعتين بعد التبرع',
            'اشرب الكثير من الماء قبل التبرع (2-3 أكواب)',
            'تجنب الكافيين (قهوة، شاي، مشروبات غازية) قبل 4 ساعات',
            'تناول وجبة خفيفة قبل التبرع بساعتين',
            'استرح لمدة 15 دقيقة بعد التبرع قبل التدخين'
        ],
        nonSmoker: [
            'لا يوجد قيود خاصة',
            'اشرب كمية كافية من الماء',
            'تناول وجبة صحية قبل التبرع',
            'احصل على قسط كافٍ من النوم'
        ],
        exSmoker: [
            'نفس تعليمات غير المدخنين',
            'إذا أقلعت مؤخراً، اشرب المزيد من الماء',
            'تجنب المحفزات التي تزيد الرغبة في التدخين'
        ]
    }
};

// ===== نظام فترات التبرع =====
const donationIntervals = {
    minimumDays: 90, // 3 أشهر = 90 يوم
    lastDonationWarnings: {
        lessThan1Month: 'لا يمكن التبرع قبل مرور 3 أشهر من آخر تبرع',
        between1_2Months: 'لا يزال هناك أقل من 3 أشهر منذ آخر تبرع',
        between2_3Months: 'متبقي أقل من شهر حتى يصبح مؤهلاً للتبرع'
    }
};

// ===== نموذج التبرع المعدل =====
function initDonationForm() {
    const form = document.getElementById('donationForm');
    if (!form) return;
    
    // تعبئة خيارات المدن
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">أين تقيم؟</option>';
        daraaData.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
    
    // إزالة خيارات المراكز غير المطلوبة
    // تم حذف تعبئة المراكز لأن التبرع فقط في بنك الدم المركزي
    
    // تعبئة تاريخ الميلاد (يجب أن يكون 18+)
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setFullYear(today.getFullYear() - 18);
        birthDateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    // إعداد مواعيد العمل
    setupAppointmentTimes();
    
    // التحقق من آخر تبرع في الوقت الفعلي
    setupLastDonationValidation();
    
    // التحقق من الأمراض المزمنة في الوقت الفعلي
    setupChronicDiseaseValidation();
    
    // التحقق من التدخين في الوقت الفعلي
    setupSmokingValidation();
    
    // تحذير الوزن في الوقت الفعلي
    setupWeightValidation();
    
    // حدث إرسال النموذج
    form.addEventListener('submit', handleDonationSubmit);
    
    // أحداث التحقق من الصحة
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });
    
    // التحقق من رقم الهاتف
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
        });
    }
    
    // التحقق من رقم الهوية
    const nationalIdInput = document.getElementById('nationalId');
    if (nationalIdInput) {
        nationalIdInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
        });
    }
}

// ===== التحقق من آخر تبرع =====
function setupLastDonationValidation() {
    const lastDonationSelect = document.getElementById('lastDonation');
    if (!lastDonationSelect) return;
    
    const warningDiv = document.querySelector('.last-donation-warning');
    
    lastDonationSelect.addEventListener('change', function(e) {
        const value = e.target.value;
        if (warningDiv) {
            warningDiv.style.display = 'none';
        }
        
        // التحقق إذا كان أقل من 3 أشهر
        if (value === 'less-1month' || value === '1-2months' || value === '2-3months') {
            if (warningDiv) {
                warningDiv.style.display = 'block';
                warningDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${donationIntervals.lastDonationWarnings.lessThan1Month}</span>
                `;
                showToast(donationIntervals.lastDonationWarnings.lessThan1Month, 'warning');
            }
        }
    });
}

// ===== التحقق من الأمراض المزمنة =====
function setupChronicDiseaseValidation() {
    const diseaseRadios = document.querySelectorAll('input[name="chronicDisease"]');
    const warningDiv = document.querySelector('.chronic-disease-warning');
    
    if (!diseaseRadios.length || !warningDiv) return;
    
    diseaseRadios.forEach(radio => {
        radio.addEventListener('change', function(e) {
            if (warningDiv) {
                warningDiv.style.display = 'none';
            }
            
            if (e.target.value === 'yes') {
                if (warningDiv) {
                    warningDiv.style.display = 'block';
                    warningDiv.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>الأمراض المزمنة تمنع التبرع بالدم نهائياً</span>
                    `;
                    showToast('لا يمكن التبرع بسبب الأمراض المزمنة', 'error');
                }
            }
        });
    });
}

// ===== التحقق من التدخين =====
function setupSmokingValidation() {
    const smokingRadios = document.querySelectorAll('input[name="smoking"]');
    const instructionsDiv = document.querySelector('.smoking-instructions');
    
    if (!smokingRadios.length || !instructionsDiv) return;
    
    smokingRadios.forEach(radio => {
        radio.addEventListener('change', function(e) {
            const value = e.target.value;
            
            if (instructionsDiv) {
                instructionsDiv.style.display = 'block';
                instructionsDiv.innerHTML = '';
                
                let instructions = [];
                let title = '';
                
                // eslint-disable-next-line default-case
                switch(value) {
                    case 'yes':
                        title = 'تعليمات للمدخنين:';
                        instructions = smokingPolicies.instructions.smoker;
                        break;
                    case 'no':
                        title = 'تعليمات لغير المدخنين:';
                        instructions = smokingPolicies.instructions.nonSmoker;
                        break;
                    case 'ex-smoker':
                        title = 'تعليمات للمدخنين السابقين:';
                        instructions = smokingPolicies.instructions.exSmoker;
                        break;
                }
                
                if (instructions.length > 0) {
                    const instructionsHTML = `
                        <p><i class="fas fa-info-circle"></i> <strong>${title}</strong></p>
                        <ul style="margin-right: 20px;">
                            ${instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ul>
                    `;
                    instructionsDiv.innerHTML = instructionsHTML;
                }
            }
        });
    });
    
    // تشغيل الحدث للقيمة الافتراضية
    const defaultRadio = document.querySelector('input[name="smoking"]:checked');
    if (defaultRadio) {
        defaultRadio.dispatchEvent(new Event('change'));
    }
}

function setupWeightValidation() {
    const weightInput = document.getElementById('weight');
    if (weightInput) {
        weightInput.addEventListener('input', function(e) {
            const weight = parseInt(e.target.value);
            const parent = e.target.parentNode;
            let warning = parent.querySelector('.weight-warning');
            
            if (weight && weight < 50) {
                if (!warning) {
                    warning = document.createElement('div');
                    warning.className = 'weight-warning';
                    parent.appendChild(warning);
                }
                warning.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>الوزن أقل من 50 كجم - لا يمكن التبرع حتى يصل الوزن إلى 50 كجم على الأقل</span>
                `;
                warning.style.display = 'block';
            } else if (warning) {
                warning.style.display = 'none';
            }
        });
        
        weightInput.addEventListener('blur', function(e) {
            const weight = parseInt(e.target.value);
            if (weight && weight < 50) {
                showToast('الوزن أقل من 50 كجم - لا يمكن التبرع', 'warning');
            }
        });
    }
}

function setupAppointmentTimes() {
    const daySelect = document.getElementById('appointmentDay');
    const timeSelect = document.getElementById('appointmentTime');
    
    if (daySelect) {
        daySelect.innerHTML = `
            <option value="">اختر اليوم</option>
            <option value="sunday">الأحد</option>
            <option value="monday">الاثنين</option>
            <option value="tuesday">الثلاثاء</option>
            <option value="wednesday">الأربعاء</option>
            <option value="thursday">الخميس</option>
        `;
    }
    
    if (timeSelect) {
        const timeSlots = [];
        for (let hour = 8; hour < 14; hour++) {
            const time1 = `${hour}:00`;
            const time2 = `${hour}:30`;
            const displayTime1 = `${hour}:00 - ${hour}:30`;
            const displayTime2 = `${hour}:30 - ${hour + 1}:00`;
            
            timeSlots.push(`<option value="${time1}">${displayTime1} ${hour < 12 ? 'صباحاً' : 'ظهراً'}</option>`);
            
            if (hour < 13) {
                timeSlots.push(`<option value="${time2}">${displayTime2} ${hour < 12 ? 'صباحاً' : 'ظهراً'}</option>`);
            }
        }
        
        timeSelect.innerHTML = '<option value="">اختر الوقت</option>' + timeSlots.join('');
    }
}

function validateInput(input) {
    // مسح الخطأ السابق
    input.classList.remove('error');
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
    
    // إذا كان الحقل فارغاً
    if (!input.value.trim()) {
        showError(input, 'هذا الحقل مطلوب');
        return false;
    }
    
    // التحقق حسب نوع الحقل
    const checks = {
        phone: value => /^\d{10}$/.test(value) || 'رقم الهاتف يجب أن يكون 10 أرقام',
        nationalId: value => value.length === 11 || 'رقم الهوية يجب أن يكون 11 رقماً',
        weight: value => {
            const weight = parseInt(value);
            if (weight < 50) return 'الوزن يجب أن يكون 50 كجم على الأقل للتبرع';
            if (weight > 200) return 'الرجاء التحقق من الوزن المدخل';
            return true;
        },
        birthDate: value => {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) return 'يجب أن يكون عمرك 18 سنة على الأقل';
            if (age > 65) return 'العمر يجب أن يكون أقل من 65 سنة للتبرع';
            return true;
        },
        bloodType: value => value !== '' || 'يرجى اختيار فصيلة الدم',
        city: value => value !== '' || 'يرجى اختيار المدينة',
        appointmentDay: value => {
            if (value === '') return 'يرجى اختيار اليوم';
            if (['friday', 'saturday'].includes(value)) return 'الجمعة والسبت إجازة';
            return true;
        },
        appointmentTime: value => value !== '' || 'يرجى اختيار الوقت'
    };
    
    if (checks[input.id]) {
        const result = checks[input.id](input.value);
        if (typeof result === 'string') {
            showError(input, result);
            return false;
        }
    }
    
    return true;
}

function showError(input, message) {
    input.classList.add('error');
    const error = document.createElement('div');
    error.className = 'input-error';
    error.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentNode.appendChild(error);
}

// ===== معالجة إرسال نموذج التبرع المعدل =====
async function handleDonationSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('donationForm');
    
    // التحقق من جميع الحقول المطلوبة
    const requiredInputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
        return;
    }
    
    // التحقق من الوزن
    const weight = parseInt(document.getElementById('weight').value);
    if (weight < 50) {
        showToast('الوزن أقل من 50 كجم - لا يمكن التبرع', 'error');
        return;
    }
    
    // التحقق من تسجيل الدخول
    if (!appState.user.isLoggedIn) {
        showToast('يجب تسجيل الدخول أولاً', 'warning');
        showLoginModal();
        return;
    }
    
    // التحقق من الأمراض المزمنة
    const hasChronicDisease = document.querySelector('input[name="chronicDisease"]:checked')?.value;
    if (hasChronicDisease === 'yes') {
        showToast('لا يمكن التبرع بسبب الأمراض المزمنة', 'error');
        return;
    }
    
    // التحقق من آخر تبرع (أقل من 3 أشهر)
    const lastDonationValue = document.getElementById('lastDonation').value;
    if (lastDonationValue === 'less-1month' || lastDonationValue === '1-2months' || lastDonationValue === '2-3months') {
        showToast('لا يمكن التبرع قبل مرور 3 أشهر من آخر تبرع', 'error');
        return;
    }
    
    // التحقق من التدخين (إذا كان مدخن)
    const smokingStatus = document.querySelector('input[name="smoking"]:checked')?.value;
    if (smokingStatus === 'yes') {
        // eslint-disable-next-line no-restricted-globals
        const confirmSmoking = confirm(`هل توقفت عن التدخين لمدة ${smokingPolicies.restrictions.beforeDonation.hours} ساعة على الأقل قبل التبرع؟\n\nتعليمات مهمة:\n• عدم التدخين قبل التبرع بـ 12 ساعة\n• عدم التدخين بعد التبرع بـ ساعتين\n• عدم تناول الكافيين قبل 4 ساعات`);
        if (!confirmSmoking) {
            showToast('يرجى اتباع تعليمات التبرع للمدخنين', 'warning');
            return;
        }
    }
    
    // جمع البيانات
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // إظهار تحميل
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    
    // محاكاة الإرسال
    setTimeout(() => {
        // حفظ البيانات
        appState.formData = data;
        
        // تحديث فصيلة الدم إذا كانت غير معروفة سابقاً
        if (data.bloodType && data.bloodType !== 'unknown') {
            // تحديث في appState
            appState.user.bloodType = data.bloodType;
            
            // تحديث في قاعدة البيانات
            const users = authSystem.getUsers();
            const userIndex = users.findIndex(u => u.phone === appState.user.phone);
            if (userIndex !== -1) {
                users[userIndex].bloodType = data.bloodType;
                
                // إضافة شارة Rare إذا كانت نادرة
                if (['O-', 'B-', 'AB-'].includes(data.bloodType) && 
                    !users[userIndex].badges.includes('rareType')) {
                    users[userIndex].badges.push('rareType');
                }
                
                authSystem.saveUsers(users);
            }
            
            showToast('تم تحديث فصيلة دمك بنجاح', 'success');
        }
        
        // تسجيل التبرع الجديد
        const newDonation = {
            id: Date.now(),
            phone: appState.user.phone,
            date: new Date().toISOString(),
            center: 'بنك الدم المركزي - درعا', // تم التعديل: مركز ثابت
            bloodType: data.bloodType,
            smokingStatus: smokingStatus,
            hasChronicDisease: hasChronicDisease === 'yes',
            status: 'مكتمل'
        };
        
        // تحديث تاريخ التبرعات
        const allHistory = authSystem.getDonationHistory();
        allHistory.unshift(newDonation); // إضافة في البداية
        authSystem.saveDonationHistory(allHistory);
        
        // تحديث حالة المستخدم
        appState.user.totalDonations += 1;
        appState.user.lastDonation = newDonation.date;
        appState.user.donationHistory = allHistory.filter(
            donation => donation.phone === appState.user.phone
        );
        
        // حفظ في التخزين المحلي
        authSystem.saveSession(appState.user);
        
        // إعادة تعيين النموذج
        form.reset();
        
        // إعادة تعيين تعليمات التدخين
        const defaultSmokingRadio = document.querySelector('input[name="smoking"][value="no"]');
        if (defaultSmokingRadio) {
            defaultSmokingRadio.checked = true;
            defaultSmokingRadio.dispatchEvent(new Event('change'));
        }
        
        // إعادة زر الإرسال
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // إظهار رسالة النجاح مع تعليمات خاصة حسب حالة التدخين
        let successMessage = 'تم تسجيل التبرع بنجاح! شكراً لك على إنقاذ حياة';
        if (smokingStatus === 'yes') {
            successMessage += '\n\nتذكير: لا تدخن لمدة ساعتين بعد التبرع واشرب الكثير من الماء.';
        }
        
        showToast(successMessage, 'success');
        
        // التنقل إلى الملف الشخصي
        setTimeout(() => {
            navigateTo('profile');
        }, 1500);
        
    }, 2000);
}

function clearForm() {
    const form = document.getElementById('donationForm');
    if (form) {
        form.reset();
        
        // إعادة تعيين تعليمات التدخين
        const defaultSmokingRadio = document.querySelector('input[name="smoking"][value="no"]');
        if (defaultSmokingRadio) {
            defaultSmokingRadio.checked = true;
            defaultSmokingRadio.dispatchEvent(new Event('change'));
        }
        
        showToast('تم مسح النموذج', 'info');
        
        // مسح أخطاء التحقق
        form.querySelectorAll('.input-error').forEach(error => error.remove());
        form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
        
        // إخفاء جميع التحذيرات
        document.querySelectorAll('.weight-warning, .last-donation-warning, .chronic-disease-warning, .reg-disease-warning').forEach(warning => {
            warning.style.display = 'none';
        });
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

// ===== نظام Modal =====
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showBloodInfoModal() {
    document.getElementById('bloodInfoModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function showBookingModal(centerName) {
    if (!appState.user.isLoggedIn) {
        showToast('يجب تسجيل الدخول أولاً', 'warning');
        showLoginModal();
        return;
    }
    
    const modal = document.getElementById('bookingModal');
    const centerNameElement = document.getElementById('bookingCenterName');
    
    if (centerNameElement) {
        centerNameElement.textContent = `حجز موعد في ${centerName}`;
    }
    
    // تعيين تاريخ الحد الأدنى (غداً)
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        // منع اختيار الجمعة أو السبت
        dateInput.addEventListener('change', function(e) {
            const selectedDate = new Date(e.target.value);
            const day = selectedDate.getDay();
            if (day === 5 || day === 6) { // الجمعة أو السبت
                showToast('لا يمكن حجز موعد يوم الجمعة أو السبت', 'warning');
                e.target.value = '';
            }
        });
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function confirmBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    
    if (!date || !time) {
        showToast('يرجى اختيار التاريخ والوقت', 'warning');
        return;
    }
    
    const selectedDate = new Date(date);
    const day = selectedDate.getDay();
    if (day === 5 || day === 6) {
        showToast('لا يمكن حجز موعد يوم الجمعة أو السبت', 'error');
        return;
    }
    
    closeModal('bookingModal');
    showToast('تم حجز الموعد بنجاح! سنتصل بك للتأكيد', 'success');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
    document.body.style.overflow = '';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = '';
}

// ===== التحكم في القائمة المنسدلة =====
function toggleUserMenu() {
    authSystem.toggleUserMenu();
}

function hideUserMenu() {
    authSystem.hideUserMenu();
}

// ===== العداد المتحرك =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                if (!counter.classList.contains('animated')) {
                    animateCounter(counter);
                    counter.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/,/g, ''));
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current).toLocaleString();
    }, stepTime);
}

// ===== رسالة الترحيب =====
function updateWelcomeMessage() {
    const cityHighlight = document.querySelector('.city-highlight');
    if (cityHighlight) {
        const hour = new Date().getHours();
        let greeting = 'صباح الخير';
        
        if (hour >= 12 && hour < 18) {
            greeting = 'مساء الخير';
        } else if (hour >= 18) {
            greeting = 'مساء الخير';
        }
        
        cityHighlight.textContent = `${greeting} في درعا`;
    }
}

// ===== مشاركة الإنجاز =====
function shareAchievement() {
    if (!appState.user.isLoggedIn) {
        showToast('سجل الدخول لمشاركة إنجازك', 'warning');
        showLoginModal();
        return;
    }
    
    const user = appState.user;
    const totalDonations = user.totalDonations || 0;
    const livesSaved = totalDonations * 3;
    const bloodType = user.bloodType || 'غير معروفة';
    
    const shareText = `🏥 بنك الدم - درعا 🩸
    
أنا ${user.name}، متبرع في بنك الدم - محافظة درعا.
فصيلة دمي: ${bloodType}
لقد تبرعت بالدم ${totalDonations} مرة، مما ساعد في إنقاذ ما يصل إلى ${livesSaved} حياة! 💖

انضم إلي في رحلة إنقاذ الأرواح:
${window.location.href}

#بنك_الدم_درعا #التبرع_بالدم #إنقاذ_حياة`;
    
    if (navigator.share) {
        navigator.share({
            title: 'إنجازي في بنك الدم - درعا',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showToast('تم مشاركة إنجازك بنجاح!', 'success');
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ النص إلى الحافظة!', 'success');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('تم نسخ النص إلى الحافظة!', 'success');
    });
}

// ===== دالة تحديث شريط المستوى =====
function updateLevelBar(progress) {
    const progressBar = document.getElementById('levelProgress');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = `${progress}%`;
        }, 100);
    }
}

// ===== التهيئة الرئيسية =====
document.addEventListener('DOMContentLoaded', () => {
    // إخفاء شاشة التحميل
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);
    
    // تهيئة الأنظمة
    updateWelcomeMessage();
    initNavigation();
    initMobileMenu();
    initDonationForm();
    initCounters();
    authSystem.init();
    
    // إخفاء زر المشاركة للضيوف
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && !appState.user.isLoggedIn) {
        shareBtn.style.display = 'none';
    }
    
    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', (e) => {
        // إغلاق القائمة المنسدلة
        const userMenu = document.getElementById('userMenu');
        const userInfo = document.querySelector('.user-info');
        
        if (userMenu && userMenu.classList.contains('show') &&
            !userMenu.contains(e.target) &&
            !(userInfo && userInfo.contains(e.target))) {
            authSystem.hideUserMenu();
        }
        
        // إغلاق Modals
        if (!e.target.closest('.modal-content') && 
            !e.target.closest('[onclick*="show"]') &&
            !e.target.closest('.center-btn')) {
            closeAllModals();
        }
    });
    
    // تحديث زر المشاركة عند تغيير حالة المستخدم
    const observer = new MutationObserver(() => {
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.style.display = appState.user.isLoggedIn ? 'flex' : 'none';
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});

// ===== دوال عامة متاحة عالمياً =====
window.navigateTo = navigateTo;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.clearForm = clearForm;
window.toggleUserMenu = toggleUserMenu;
window.hideUserMenu = hideUserMenu;
window.logout = () => authSystem.logout();
window.showBookingModal = showBookingModal;
window.confirmBooking = confirmBooking;
window.removeToast = removeToast;
window.showBloodInfoModal = showBloodInfoModal;
window.shareAchievement = shareAchievement;
window.updateBloodTypePrompt = updateBloodTypePrompt;