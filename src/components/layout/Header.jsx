/* eslint-disable no-unused-vars */
// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const [notifications] = useState(3);
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLogout = () => {
    // هنا ضع منطق تسجيل الخروج
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* الشعار */}
        <div className="logo-section">
          <div className="logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <div className="logo-text">
              <h1>بنك الدم الوطني</h1>
              <p>درعا - سوريا</p>
            </div>
          </div>
        </div>

        {/* معلومات النظام - حذف قسم "النظام نشط" */}
        <div className="system-info">
          <div className="info-item">
            <i className="fas fa-clock"></i>
            <span>{currentDate}</span>
          </div>
        </div>

        {/* زر التنبيهات والمستخدم */}
        <div className="user-actions">
          {/* زر التنبيهات */}
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            {notifications > 0 && (
              <span className="notification-badge">{notifications}</span>
            )}
          </button>

          {/* معلومات المستخدم */}
          <div className="user-profile">
            <div className="user-avatar">
              <i className="fas fa-user-md"></i>
            </div>
            <div className="user-info">
              <span className="user-name">مدير النظام</span>
              <span className="user-role">مشرف البنك</span>
            </div>
          </div>

          {/* زر الخروج */}
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;