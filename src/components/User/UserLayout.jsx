import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/user-layout.css';

const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const checkAuth = () => {
      // البحث في جميع المفاتيح الممكنة
      const storedUser = 
        localStorage.getItem('blood_bank_current_user') ||
        localStorage.getItem('currentUser') ||
        localStorage.getItem('blood_bank_daraa_user') ||
        localStorage.getItem('blood_bank_user');
      
      console.log('🔍 تحقق من تسجيل الدخول:', storedUser);
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUser(userData);
          console.log('✅ مستخدم مسجل:', userData.name);
        } catch (error) {
          console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    // الاستماع لتغيرات في localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // حذف جميع بيانات المستخدم
    localStorage.removeItem('blood_bank_current_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('blood_bank_daraa_user');
    localStorage.removeItem('blood_bank_user');
    localStorage.removeItem('remembered_user');
    
    setIsLoggedIn(false);
    setUser(null);
    setMobileMenuOpen(false);
    
    // إرسال حدث لتحديث الصفحات الأخرى
    window.dispatchEvent(new Event('storage'));
    
    navigate('/home');
  };

  const navItems = [
    { path: '/home', label: 'الرئيسية', icon: 'fas fa-home' },
    { path: '/donate', label: 'تبرع', icon: 'fas fa-hand-holding-heart' },
    { path: '/centers', label: 'المراكز', icon: 'fas fa-hospital' },
    { path: '/guide', label: 'الدليل', icon: 'fas fa-book-medical' },
    ...(isLoggedIn ? [{ path: '/profile', label: 'ملفي', icon: 'fas fa-user' }] : []),
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname === `/${path}`;
  };

  const getInitials = (name) => {
    if (!name || name === 'متبرع جديد') return 'م';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0);
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div className="user-layout">
      {/* الهيدر الأبيض */}
      <header className="user-header">
        <div className="container">
          {/* الشعار مع الأيقونة الحمراء فقط */}
          <Link to="/home" className="user-logo" onClick={() => setMobileMenuOpen(false)}>
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
          </Link>

          {/* قائمة التنقل - تصميم أبيض */}
          <nav className="user-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`user-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* قسم المستخدم فقط - بدون أزرار تسجيل دخول */}
          <div className="user-actions">
            {isLoggedIn ? (
              <div className="user-profile" onClick={() => {}}>
                <div className="user-avatar">
                  <span>{getInitials(user?.name)}</span>
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.name || 'مستخدم'}</span>
                  <span className="user-status">نشط</span>
                </div>
                <i className="fas fa-chevron-down"></i>
              </div>
            ) : (
              // لا تظهر أي شيء إذا لم يكن مسجلاً
              <div className="empty-user-section"></div>
            )}
          </div>

          {/* زر القائمة الجوال */}
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* القائمة المتنقلة */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <h3>بنك الدم - درعا</h3>
          </div>
          <button 
            className="close-menu"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="إغلاق"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="mobile-menu-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          
          {isLoggedIn ? (
            <button className="mobile-nav-link logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>تسجيل الخروج</span>
            </button>
          ) : (
            // لا تظهر أي أزرار تسجيل دخول في القائمة المتنقلة
            null
          )}
        </div>
      </div>

      {/* Overlay للقائمة المتنقلة */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* المحتوى الرئيسي */}
      <main className="user-main">
        <Outlet />
      </main>

      {/* الفوتر */}
      <footer className="user-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h3>بنك الدم - درعا</h3>
                <p>نظام لخدمة أهل المحافظة</p>
              </div>
            </div>

            <div className="footer-section">
              <h4>أوقات العمل</h4>
              <ul className="work-hours">
                <li>الأحد - الخميس: 8 ص - 2 م</li>
                <li>الجمعة والسبت: <span className="closed">إجازة</span></li>
                <li>مدة الموعد: 30 دقيقة</li>
                <li>آخر موعد: 1:30 - 2:00 م</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>تواصل معنا</h4>
              <ul className="footer-contacts">
                <li><i className="fas fa-phone"></i> 6778610</li>
                <li><i className="fas fa-ambulance"></i> طوارئ: 112</li>
                <li><i className="fas fa-envelope"></i> bloodbank@daraa.gov.sy</li>
                <li><i className="fas fa-map-marker-alt"></i> درعا، سوريا</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>روابط سريعة</h4>
              <ul className="footer-links">
                <li><Link to="/home">الرئيسية</Link></li>
                <li><Link to="/donate">تبرع</Link></li>
                <li><Link to="/centers">المراكز</Link></li>
                <li><Link to="/guide">الدليل</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} بنك الدم - درعا. كل الحقوق محفوظة.</p>
            <p className="footer-note">
              <i className="fas fa-heart"></i>
              سوا بننقذ حياة أهل درعا
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;