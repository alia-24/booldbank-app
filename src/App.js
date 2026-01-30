// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// استيراد جميع الصفحات
import LoginPage from './pages/Admin/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import InventoryPage from './pages/Admin/InventoryPage';
import AppointmentsPage from './pages/Admin/AppointmentsPage';
import BloodSalesPage from './pages/Admin/BloodSalesPage';
import ReportsPage from './pages/Admin/ReportsPage';
import SettingsPage from './pages/Admin/SettingsPage';

function App() {
  // حالة تسجيل الدخول
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // تحقق من localStorage
    const auth = localStorage.getItem('bloodBankAuth');
    console.log('Auth from localStorage:', auth);
    return auth === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bloodBankUser');
    return savedUser ? JSON.parse(savedUser) : { name: 'المشرف' };
  });

  console.log('Current auth state:', isAuthenticated);

  // دالة تسجيل الدخول
  const handleLogin = (userData) => {
    console.log('Login called with:', userData);
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('bloodBankAuth', 'true');
    localStorage.setItem('bloodBankUser', JSON.stringify(userData));
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    console.log('Logout called');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('bloodBankAuth');
    localStorage.removeItem('bloodBankUser');
  };

  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route 
          path="/" 
          element={
            <Navigate to="/login" replace />
          } 
        />
        
        {/* صفحة تسجيل الدخول */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? (
              <div>
                <LoginPage onLogin={handleLogin} />
              </div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />
        
        {/* جميع الصفحات المحمية تستخدم نفس الـ Layout */}
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <DashboardPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/inventory" 
            element={
              isAuthenticated ? (
                <InventoryPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/appointments" 
            element={
              isAuthenticated ? (
                <AppointmentsPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/blood-sales" 
            element={
              isAuthenticated ? (
                <BloodSalesPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/reports" 
            element={
              isAuthenticated ? (
                <ReportsPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              isAuthenticated ? (
                <SettingsPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Route>
        
        {/* صفحة 404 */}
        <Route 
          path="*" 
          element={
            <div style={{ 
              padding: '50px', 
              textAlign: 'center',
              direction: 'rtl'
            }}>
              <h1 style={{ color: '#d32f2f' }}>404 - الصفحة غير موجودة</h1>
              <button 
                onClick={() => window.location.href = isAuthenticated ? '/dashboard' : '/login'}
                style={{
                  padding: '10px 20px',
                  margin: '10px',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {isAuthenticated ? 'العودة للوحة التحكم' : 'العودة لتسجيل الدخول'}
              </button>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;