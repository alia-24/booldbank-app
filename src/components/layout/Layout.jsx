// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // ← مهم جداً!
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/layout.css';

function Layout({ user, onLogout }) {
  return (
    <div className="layout">
      <Header user={user} onLogout={onLogout} />
      <div className="layout-container">
        <Sidebar user={user} />
        <main className="main-content">
          {/* هنا سيتم عرض المحتوى */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;