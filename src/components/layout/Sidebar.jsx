/* eslint-disable no-unused-vars */
// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: 'fas fa-tachometer-alt', active: true },
    { path: '/inventory', label: 'المخزون', icon: 'fas fa-tint' },
    { path: '/appointments', label: 'المواعيد', icon: 'fas fa-calendar-check' },
    { path: '/donors', label: 'المتبرعين', icon: 'fas fa-users' },
    { path: '/blood-sales', label: 'بيع الدم', icon: 'fas fa-money-bill-wave' },
    { path: '/reports', label: 'التقارير', icon: 'fas fa-chart-bar' },
    { path: '/hospitals', label: 'المستشفيات', icon: 'fas fa-hospital' },
    { path: '/settings', label: 'الإعدادات', icon: 'fas fa-cogs' },
  ];

  const quickStats = [
    { label: 'المخزون الكلي', value: '892', icon: 'fas fa-tint', color: '#DC143C' },
    { label: 'المواعيد اليوم', value: '12', icon: 'fas fa-calendar', color: '#1E6BD6' },
    { label: 'طلبات اليوم', value: '8', icon: 'fas fa-clipboard-list', color: '#28A745' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* زر طي/فتح السيدبار */}
      <button 
        className="toggle-sidebar" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>

      {/* قائمة التنقل */}
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <div className="nav-icon">
                  <i className={item.icon}></i>
                </div>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {!isCollapsed && (
        <div className="sidebar-footer">
          <div className="system-status">
            <div className="last-update">
              <i className="fas fa-history"></i>
              <span>آخر تحديث: الآن</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;