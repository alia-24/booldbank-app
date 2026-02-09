/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './UserHeader.css';

function UserHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // التحقق من حالة تسجيل الدخول
  const checkAuthStatus = () => {
    console.log('🔄 التحقق من حالة المصادقة...');
    
    // البحث في جميع المفاتيح الممكنة
    const userData = 
      localStorage.getItem('currentUser') ||
      localStorage.getItem('blood_bank_current_user') ||
      localStorage.getItem('blood_bank_daraa_user') ||
      localStorage.getItem('blood_bank_user');
    
    console.log('📦 بيانات المستخدم:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ مستخدم مسجل:', parsedUser.name);
        
        setIsLoggedIn(true);
        setUser({
          name: parsedUser.name || 'متبرع جديد',
          initials: getInitials(parsedUser.name) || 'م',
          ...parsedUser
        });
      } catch (error) {
        console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      console.log('❌ لا يوجد مستخدم مسجل');
      setIsLoggedIn(false);
      setUser(null);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // التحقق الأولي
    checkAuthStatus();

    // تأثير التمرير
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // الاستماع لتغيرات في localStorage من صفحات أخرى
    const handleStorageChange = () => {
      console.log('📡 حدث تغيير في localStorage');
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // فحص كل ثانية (حل مؤقت)
    const intervalId = setInterval(checkAuthStatus, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const getInitials = (name) => {
    if (!name || name === 'متبرع جديد') return 'م';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0);
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // معالجة تسجيل الدخول
  const handleLogin = () => {
    console.log('📍 الانتقال إلى صفحة تسجيل الدخول');
    navigate('/login');
    closeAllMenus();
  };

  // معالجة إنشاء حساب
  const handleRegister = () => {
    console.log('📍 الانتقال إلى صفحة إنشاء حساب');
    navigate('/register');
    closeAllMenus();
  };

  // معالجة تسجيل الخروج
  const handleLogout = () => {
    console.log('🚪 تسجيل الخروج...');
    
    // حذف جميع بيانات المستخدم
    localStorage.removeItem('currentUser');
    localStorage.removeItem('blood_bank_current_user');
    localStorage.removeItem('blood_bank_daraa_user');
    localStorage.removeItem('blood_bank_user');
    localStorage.removeItem('remembered_user');
    
    // تحديث الحالة
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    
    // إرسال حدث لتحديث الصفحات الأخرى
    window.dispatchEvent(new Event('storage'));
    
    console.log('✅ تم تسجيل الخروج بنجاح');
    navigate('/home');
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // النقر على الشعار
  const handleLogoClick = () => {
    closeAllMenus();
    navigate('/home');
  };

  // النقر على رابط القائمة
  const handleNavLinkClick = (path) => {
    closeAllMenus();
    navigate(path);
  };

  if (loading) {
    return null; // أو عرض شاشة تحميل بسيطة
  }

  return (
    <>
      {/* الشريط العلوي */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* الشعار */}
          <div className="logo">
            <button 
              className="logo-button"
              onClick={handleLogoClick}
              aria-label="بنك الدم - درعا"
            >
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
            </button>
          </div>

          {/* القائمة الرئيسية - تظهر فقط على الأجهزة الكبيرة */}
          <div className="nav-menu">
            <button 
              className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
              onClick={() => handleNavLinkClick('/home')}
            >
              <i className="fas fa-home"></i>
              <span>الرئيسية</span>
            </button>
            
            <button 
              className={`nav-link ${location.pathname === '/donate' ? 'active' : ''}`}
              onClick={() => handleNavLinkClick('/donate')}
            >
              <i className="fas fa-hand-holding-heart"></i>
              <span>تبرع</span>
            </button>
            
            <button 
              className={`nav-link ${location.pathname === '/centers' ? 'active' : ''}`}
              onClick={() => handleNavLinkClick('/centers')}
            >
              <i className="fas fa-hospital"></i>
              <span>المراكز</span>
            </button>
            
            <button 
              className={`nav-link ${location.pathname === '/guide' ? 'active' : ''}`}
              onClick={() => handleNavLinkClick('/guide')}
            >
              <i className="fas fa-book-medical"></i>
              <span>الدليل</span>
            </button>
            
            {isLoggedIn && (
              <button 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('/profile')}
              >
                <i className="fas fa-user"></i>
                <span>ملفي</span>
              </button>
            )}
          </div>

          {/* الجزء الأيمن - الأزرار والمستخدم */}
          <div className="nav-actions">
            {isLoggedIn ? (
              // إذا كان المستخدم مسجلاً
              <div 
                className="user-profile-section"
                onClick={toggleUserMenu}
              >
                <div className="user-avatar-small">
                  <span>{user?.initials || 'م'}</span>
                </div>
                <span className="user-name-small">
                  {user?.name || 'متبرع جديد'}
                </span>
                <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'rotated' : ''}`}></i>
              </div>
            ) : (
              // إذا لم يكن المستخدم مسجلاً
              <div className="auth-section">
                <button 
                  className="login-button-header"
                  onClick={handleLogin}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>تسجيل الدخول</span>
                </button>
                <button 
                  className="register-button-header"
                  onClick={handleRegister}
                >
                  <i className="fas fa-user-plus"></i>
                  <span>إنشاء حساب</span>
                </button>
              </div>
            )}
            
            {/* زر القائمة المتنقلة */}
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="فتح القائمة"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* القائمة المتنقلة */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-container">
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h3>بنك الدم - درعا</h3>
              </div>
              <button 
                className="close-mobile-menu"
                onClick={toggleMobileMenu}
                aria-label="إغلاق القائمة"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mobile-menu-content">
              <button 
                className={`mobile-nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('/home')}
              >
                <i className="fas fa-home"></i>
                <span>الرئيسية</span>
              </button>
              
              <button 
                className={`mobile-nav-link ${location.pathname === '/donate' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('/donate')}
              >
                <i className="fas fa-hand-holding-heart"></i>
                <span>تبرع</span>
              </button>
              
              <button 
                className={`mobile-nav-link ${location.pathname === '/centers' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('/centers')}
              >
                <i className="fas fa-hospital"></i>
                <span>المراكز</span>
              </button>
              
              <button 
                className={`mobile-nav-link ${location.pathname === '/guide' ? 'active' : ''}`}
                onClick={() => handleNavLinkClick('/guide')}
              >
                <i className="fas fa-book-medical"></i>
                <span>الدليل</span>
              </button>
              
              {isLoggedIn && (
                <button 
                  className={`mobile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick('/profile')}
                >
                  <i className="fas fa-user"></i>
                  <span>الملف الشخصي</span>
                </button>
              )}
              
              <div className="mobile-auth-section">
                {!isLoggedIn ? (
                  <>
                    <button 
                      className="mobile-login-button"
                      onClick={handleLogin}
                    >
                      <i className="fas fa-sign-in-alt"></i>
                      <span>تسجيل الدخول</span>
                    </button>
                    <button 
                      className="mobile-register-button"
                      onClick={handleRegister}
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>إنشاء حساب جديد</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mobile-user-info">
                      <div className="mobile-user-avatar">
                        <span>{user?.initials || 'م'}</span>
                      </div>
                      <div className="mobile-user-details">
                        <h4>{user?.name || 'متبرع جديد'}</h4>
                        <p>متبرع في درعا</p>
                      </div>
                    </div>
                    <button 
                      className="mobile-logout-button"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>تسجيل الخروج</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* قائمة المستخدم المنسدلة */}
      {isUserMenuOpen && isLoggedIn && (
        <div className="user-dropdown-overlay" onClick={() => setIsUserMenuOpen(false)}>
          <div className="user-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-header">
              <div className="dropdown-user-avatar">
                <span>{user?.initials || 'م'}</span>
              </div>
              <div className="dropdown-user-info">
                <h4>{user?.name || 'متبرع جديد'}</h4>
                <p>متبرع في درعا</p>
              </div>
            </div>
            
            <div className="dropdown-content">
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleNavLinkClick('/profile');
                  setIsUserMenuOpen(false);
                }}
              >
                <i className="fas fa-user"></i>
                <span>الملف الشخصي</span>
              </button>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleNavLinkClick('/donate');
                  setIsUserMenuOpen(false);
                }}
              >
                <i className="fas fa-plus-circle"></i>
                <span>تبرع جديد</span>
              </button>
              
              <button 
                className="dropdown-item"
                onClick={() => {
                  handleNavLinkClick('/donation-history');
                  setIsUserMenuOpen(false);
                }}
              >
                <i className="fas fa-history"></i>
                <span>سجل التبرعات</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserHeader;