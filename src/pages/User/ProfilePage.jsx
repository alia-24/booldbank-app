/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // بيانات الملف الشخصي
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    email: '',
    bloodType: '',
    gender: '',
    birthDate: '',
    address: '',
    city: 'درعا'
  });

  // إحصائيات التبرع
  const [donationStats, setDonationStats] = useState({
    totalDonations: 0,
    lastDonation: null,
    nextDonation: null,
    points: 0,
    rank: 'مبتدئ'
  });

  // سجل التبرعات
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    loadUserData();
    
    // إضافة حدث لفحص حالة المصادقة
    const handleStorageChange = () => {
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadUserData = () => {
    setLoading(true);
    
    try {
      // البحث في جميع أماكن حفظ البيانات
      const userData = 
        localStorage.getItem('currentUser') || 
        localStorage.getItem('blood_bank_current_user') ||
        localStorage.getItem('blood_bank_daraa_user') ||
        localStorage.getItem('blood_bank_user');
      
      console.log('📋 تحميل بيانات المستخدم للملف الشخصي:', userData);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // تعبئة بيانات الملف الشخصي
        setProfileData({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          email: parsedUser.email || '',
          bloodType: parsedUser.bloodType || 'غير محدد',
          gender: parsedUser.gender || '',
          birthDate: parsedUser.birthDate || '',
          address: parsedUser.address || '',
          city: parsedUser.city || 'درعا'
        });
        
        // تعبئة إحصائيات التبرع
        setDonationStats({
          totalDonations: parsedUser.totalDonations || 0,
          lastDonation: parsedUser.lastDonation || null,
          nextDonation: parsedUser.nextDonation || null,
          points: parsedUser.points || 0,
          rank: parsedUser.rank || 'مبتدئ'
        });
        
        // تحميل سجل التبرعات من localStorage أو إنشاء بيانات تجريبية
        const savedHistory = localStorage.getItem(`donation_history_${parsedUser.id || 'user'}`);
        if (savedHistory) {
          setDonationHistory(JSON.parse(savedHistory));
        } else {
          // بيانات تجريبية
          const mockHistory = [
            { id: 1, date: '2024-01-15', center: 'مشفى درعا الوطني', amount: '450 مل', status: 'مكتمل' },
            { id: 2, date: '2023-11-20', center: 'مركز التبرع المركزي', amount: '450 مل', status: 'مكتمل' },
            { id: 3, date: '2023-09-10', center: 'مشفى درعا الوطني', amount: '450 مل', status: 'مكتمل' }
          ];
          setDonationHistory(mockHistory);
        }
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      // حفظ البيانات في جميع المفاتيح المحتملة
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('blood_bank_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('blood_bank_user', JSON.stringify(updatedUser));
      
      // تحديث الحالة
      setUser(updatedUser);
      
      // إرسال حدث لتحديث المكونات الأخرى
      window.dispatchEvent(new Event('storage'));
      
      alert('✅ تم حفظ التغييرات بنجاح!');
    }
  };

  const handleDonateNow = () => {
    navigate('/donate');
  };

  const handleLogout = () => {
    // حذف جميع بيانات المستخدم
    localStorage.removeItem('currentUser');
    localStorage.removeItem('blood_bank_current_user');
    localStorage.removeItem('blood_bank_daraa_user');
    localStorage.removeItem('blood_bank_user');
    localStorage.removeItem('remembered_user');
    
    // إرسال حدث لتحديث المكونات الأخرى
    window.dispatchEvent(new Event('storage'));
    
    // الانتقال إلى الصفحة الرئيسية
    navigate('/home');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // الحصول على الأحرف الأولى من الاسم
  const getInitials = (name) => {
    if (!name || name === 'متبرع جديد') return 'م';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0);
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>جاري تحميل بيانات الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-not-logged-in">
        <div className="login-prompt-card">
          <i className="fas fa-user-lock"></i>
          <h2>يجب تسجيل الدخول أولاً</h2>
          <p>صفحة الملف الشخصي متاحة فقط للمستخدمين المسجلين</p>
          <button 
            className="btn-login-prompt"
            onClick={() => navigate('/login')}
          >
            <i className="fas fa-sign-in-alt"></i>
            الانتقال لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Header مخصص للملف الشخصي */}
      <header className="profile-page-header">
        <div className="profile-header-content">
          {/* شعار بنك الدم */}
          <div className="profile-logo" onClick={() => navigate('/home')}>
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="logo-text">
              <h1>بنك الدم</h1>
              <span className="location-badge">
                <i className="fas fa-map-marker-alt"></i>
                درعا
              </span>
            </div>
          </div>
          
          {/* عنوان الصفحة */}
          <div className="profile-title">
            <h1>
              <i className="fas fa-user-circle"></i>
              ملفي الشخصي
            </h1>
          </div>
          
          {/* إجراءات المستخدم */}
          <div className="profile-header-actions">
            <button 
              className="btn-donate-now"
              onClick={handleDonateNow}
            >
              <i className="fas fa-hand-holding-heart"></i>
              تبرع الآن
            </button>
            
            <div 
              className="user-profile-mini"
              onClick={() => navigate('/profile')}
            >
              <div className="user-avatar-mini">
                <span>{getInitials(user.name)}</span>
              </div>
              <span className="user-name-mini">{user.name}</span>
            </div>
            
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* القائمة المتنقلة */}
      {isMobileMenuOpen && (
        <div className="profile-mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-logo">
              <div className="logo-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <h3>بنك الدم - درعا</h3>
            </div>
            <button className="close-menu" onClick={closeMobileMenu}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="mobile-menu-links">
            <button onClick={() => { navigate('/home'); closeMobileMenu(); }}>
              <i className="fas fa-home"></i>
              <span>الرئيسية</span>
            </button>
            
            <button onClick={() => { navigate('/donate'); closeMobileMenu(); }}>
              <i className="fas fa-hand-holding-heart"></i>
              <span>تبرع</span>
            </button>
            
            <button onClick={() => { navigate('/centers'); closeMobileMenu(); }}>
              <i className="fas fa-hospital"></i>
              <span>المراكز</span>
            </button>
            
            <button onClick={() => { navigate('/guide'); closeMobileMenu(); }}>
              <i className="fas fa-book-medical"></i>
              <span>الدليل</span>
            </button>
            
            <button onClick={() => { navigate('/profile'); closeMobileMenu(); }}>
              <i className="fas fa-user"></i>
              <span>ملفي الشخصي</span>
            </button>
            
            <button className="logout-btn-mobile" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}

      {/* محتوى الملف الشخصي */}
      <div className="profile-content">
        {/* بطاقة المستخدم الرئيسية */}
        <div className="user-profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span>{getInitials(user.name)}</span>
              <div className="avatar-status">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>
            <div className="profile-name-section">
              <h2 className="profile-full-name">{user.name}</h2>
              <p className="profile-phone">
                <i className="fas fa-phone"></i>
                {user.phone}
              </p>
              <div className="profile-tags">
                <span className="tag-blood">
                  <i className="fas fa-tint"></i>
                  {profileData.bloodType || 'غير محدد'}
                </span>
                <span className="tag-city">
                  <i className="fas fa-map-marker-alt"></i>
                  {profileData.city}
                </span>
                <span className="tag-rank">
                  <i className="fas fa-trophy"></i>
                  {donationStats.rank}
                </span>
              </div>
            </div>
          </div>
          
          <div className="profile-stats-section">
            <div className="stat-box">
              <div className="stat-number">{donationStats.totalDonations}</div>
              <div className="stat-label">عدد التبرعات</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{donationStats.points}</div>
              <div className="stat-label">النقاط</div>
            </div>
            <div className="stat-box">
              <div className="stat-date">
                {donationStats.lastDonation ? formatDate(donationStats.lastDonation) : 'لا يوجد'}
              </div>
              <div className="stat-label">آخر تبرع</div>
            </div>
            <div className="stat-box">
              <div className="stat-date">
                {donationStats.nextDonation ? formatDate(donationStats.nextDonation) : 'متاح'}
              </div>
              <div className="stat-label">الموعد القادم</div>
            </div>
          </div>
        </div>

        {/* تبويبات الملف الشخصي */}
        <div className="profile-tabs-container">
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <i className="fas fa-user"></i>
              <span>المعلومات الشخصية</span>
            </button>
            
            <button 
              className={`profile-tab ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              <i className="fas fa-history"></i>
              <span>سجل التبرعات</span>
            </button>
            
            <button 
              className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>الإعدادات</span>
            </button>
          </div>
          
          {/* محتوى التبويب النشط */}
          <div className="profile-tab-content">
            {activeTab === 'personal' && (
              <div className="personal-info-content">
                <h3 className="content-title">
                  <i className="fas fa-user-edit"></i>
                  المعلومات الشخصية
                </h3>
                
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-field">
                      <label>الاسم الكامل</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    
                    <div className="form-field">
                      <label>رقم الهاتف</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="09XXXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="example@email.com"
                      />
                    </div>
                    
                    <div className="form-field">
                      <label>فصيلة الدم</label>
                      <select
                        value={profileData.bloodType}
                        onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                      >
                        <option value="غير محدد">غير محدد</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-field">
                      <label>الجنس</label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                      >
                        <option value="">اختر الجنس</option>
                        <option value="ذكر">ذكر</option>
                        <option value="أنثى">أنثى</option>
                      </select>
                    </div>
                    
                    <div className="form-field">
                      <label>تاريخ الميلاد</label>
                      <input
                        type="date"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-field-full">
                    <label>العنوان</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      placeholder="أدخل عنوانك بالتفصيل"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveProfile}>
                      <i className="fas fa-save"></i>
                      حفظ التغييرات
                    </button>
                    <button 
                      className="btn-reset" 
                      onClick={() => setProfileData({
                        name: user.name || '',
                        phone: user.phone || '',
                        email: user.email || '',
                        bloodType: user.bloodType || 'غير محدد',
                        gender: user.gender || '',
                        birthDate: user.birthDate || '',
                        address: user.address || '',
                        city: user.city || 'درعا'
                      })}
                    >
                      <i className="fas fa-undo"></i>
                      إعادة تعيين
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'donations' && (
              <div className="donations-content">
                <h3 className="content-title">
                  <i className="fas fa-history"></i>
                  سجل التبرعات
                </h3>
                
                {donationHistory.length > 0 ? (
                  <div className="donations-table-container">
                    <table className="donations-table">
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>مركز التبرع</th>
                          <th>الكمية</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donationHistory.map(donation => (
                          <tr key={donation.id}>
                            <td>
                              <i className="fas fa-calendar"></i>
                              {formatDate(donation.date)}
                            </td>
                            <td>
                              <i className="fas fa-hospital"></i>
                              {donation.center}
                            </td>
                            <td>
                              <i className="fas fa-tint"></i>
                              {donation.amount}
                            </td>
                            <td>
                              <span className="status-completed">
                                {donation.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-view">
                                <i className="fas fa-eye"></i>
                                عرض
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-donations-message">
                    <i className="fas fa-history"></i>
                    <h4>لا توجد تبرعات سابقة</h4>
                    <p>ابدأ رحلتك في التبرع الآن وساهم في إنقاذ حياة</p>
                    <button className="btn-first-donate" onClick={handleDonateNow}>
                      تبرع لأول مرة
                    </button>
                  </div>
                )}
                
                <div className="donations-summary-section">
                  <h4>ملخص التبرعات</h4>
                  <div className="summary-cards">
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="fas fa-syringe"></i>
                      </div>
                      <div className="summary-info">
                        <h5>إجمالي التبرعات</h5>
                        <p className="summary-value">{donationStats.totalDonations}</p>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="fas fa-heart"></i>
                      </div>
                      <div className="summary-info">
                        <h5>متوسط التبرعات/سنة</h5>
                        <p className="summary-value">
                          {donationStats.totalDonations > 0 ? 
                            Math.round(donationStats.totalDonations / 2) : 0}
                        </p>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="summary-info">
                        <h5>آخر تبرع</h5>
                        <p className="summary-date">
                          {donationStats.lastDonation ? 
                            formatDate(donationStats.lastDonation) : 'لا يوجد'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="summary-icon">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="summary-info">
                        <h5>الموعد القادم</h5>
                        <p className="summary-date">
                          {donationStats.nextDonation ? 
                            formatDate(donationStats.nextDonation) : 'متاح الآن'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="settings-content">
                <h3 className="content-title">
                  <i className="fas fa-cog"></i>
                  الإعدادات
                </h3>
                
                <div className="settings-grid">
                  <div className="setting-card">
                    <div className="setting-header">
                      <i className="fas fa-bell"></i>
                      <h4>الإشعارات</h4>
                    </div>
                    <div className="setting-body">
                      <p>تحكم في الإشعارات التي تريد استقبالها</p>
                      <div className="setting-switch">
                        <span>إشعارات التبرع</span>
                        <label className="switch-toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="slider-toggle"></span>
                        </label>
                      </div>
                      <div className="setting-switch">
                        <span>عروض خاصة</span>
                        <label className="switch-toggle">
                          <input type="checkbox" defaultChecked />
                          <span className="slider-toggle"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="setting-card">
                    <div className="setting-header">
                      <i className="fas fa-lock"></i>
                      <h4>الأمان</h4>
                    </div>
                    <div className="setting-body">
                      <p>تغيير كلمة المرور وتحديث معلومات الأمان</p>
                      <button className="btn-change-password">
                        <i className="fas fa-key"></i>
                        تغيير كلمة المرور
                      </button>
                    </div>
                  </div>
                  
                  <div className="setting-card">
                    <div className="setting-header">
                      <i className="fas fa-globe"></i>
                      <h4>اللغة</h4>
                    </div>
                    <div className="setting-body">
                      <p>اختر لغة واجهة التطبيق</p>
                      <select className="language-select">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="setting-card">
                    <div className="setting-header">
                      <i className="fas fa-question-circle"></i>
                      <h4>المساعدة</h4>
                    </div>
                    <div className="setting-body">
                      <p>الدعم الفني والمساعدة</p>
                      <button className="btn-support">
                        <i className="fas fa-headset"></i>
                        اتصل بالدعم
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="danger-zone-section">
                  <h4>
                    <i className="fas fa-exclamation-triangle"></i>
                    منطقة الخطر
                  </h4>
                  <p>هذه الإجراءات لا يمكن التراجع عنها</p>
                  <div className="danger-actions">
                    <button className="btn-danger" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i>
                      تسجيل الخروج
                    </button>
                    <button className="btn-delete-account">
                      <i className="fas fa-trash"></i>
                      حذف الحساب
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;