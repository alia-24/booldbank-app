/* eslint-disable no-unused-vars */
// src/App-user.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import UserLayout from './components/User/UserLayout';
import LoginPage from './pages/User/LoginPage'; // استخدم صفحة تسجيل الدخول الموحدة

// صفحات المتبرعين
import HomePage from './pages/User/HomePage';
import DonatePage from './pages/User/DonatePage';
import CentersPage from './pages/User/CentersPage';
import GuidePage from './pages/User/GuidePage';
import ProfilePage from './pages/User/ProfilePage';

function AppUser() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    checkAuthStatus();
    
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = () => {
    const userData = localStorage.getItem('currentUser');
    console.log('🔍 التحقق من المصادقة:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
        console.log('✅ مستخدم مسجل:', parsedUser.name);
      } catch (error) {
        console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    
    setIsLoading(false);
  };

  const handleLogin = (userData) => {
    console.log('🔄 تسجيل دخول جديد:', userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // إرسال حدث لتحديث المكونات الأخرى
    window.dispatchEvent(new Event('storage'));
  };

  const handleLogout = () => {
    console.log('🚪 تسجيل الخروج');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // إرسال حدث لتحديث المكونات الأخرى
    window.dispatchEvent(new Event('storage'));
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        direction: 'rtl'
      }}>
        <div style={{
          fontSize: '4rem',
          animation: 'pulse 2s infinite'
        }}>
          <i className="fas fa-heartbeat"></i>
        </div>
        <h1 style={{ marginTop: '1rem' }}>بنك الدم المركزي - درعا</h1>
        <p style={{ marginTop: '0.5rem' }}>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* صفحة تسجيل الدخول الموحدة */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <LoginPage onLogin={handleLogin} />
          } 
        />
        
        {/* الصفحات المحمية */}
        <Route 
          element={
            isAuthenticated ? 
              <UserLayout user={currentUser} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
          }
        >
          <Route path="/home" element={<HomePage user={currentUser} />} />
          <Route path="/donate" element={<DonatePage user={currentUser} />} />
          <Route path="/centers" element={<CentersPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/profile" element={<ProfilePage user={currentUser} />} />
        </Route>
        
        {/* صفحة 404 */}
        <Route path="*" element={<NotFoundPage isAuthenticated={isAuthenticated} />} />
      </Routes>
    </BrowserRouter>
  );
}

const NotFoundPage = ({ isAuthenticated }) => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      direction: 'rtl',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f8f9fa'
    }}>
      <h1 style={{ color: '#343a40' }}>404 - الصفحة غير موجودة</h1>
      <button 
        onClick={() => window.location.href = isAuthenticated ? '/home' : '/login'}
        style={{
          padding: '12px 24px',
          background: '#c62828',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        {isAuthenticated ? 'العودة للصفحة الرئيسية' : 'تسجيل الدخول'}
      </button>
    </div>
  );
};

export default AppUser;