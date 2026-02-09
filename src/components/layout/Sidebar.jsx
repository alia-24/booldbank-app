import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'لوحة التحكم', icon: 'fas fa-tachometer-alt' },
    { path: '/inventory', label: 'المخزون', icon: 'fas fa-tint' },
    { path: '/appointments', label: 'المواعيد', icon: 'fas fa-calendar-check' },
    { path: '/blood-sales', label: 'بيع الدم', icon: 'fas fa-money-bill-wave' },
    { path: '/reports', label: 'التقارير', icon: 'fas fa-chart-bar' },
    { path: '/hospitals', label: 'المستشفيات', icon: 'fas fa-hospital' },
    { path: '/settings', label: 'الإعدادات', icon: 'fas fa-cogs' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-sidebar" onClick={() => setIsCollapsed(!isCollapsed)}>
        <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
      </button>
      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
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