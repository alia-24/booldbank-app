/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const bloodTypesInventory = [
    { type: 'A+', count: 45, lowStock: false, color: '#DC143C' },
    { type: 'A-', count: 15, lowStock: true, color: '#FF6B6B' },
    { type: 'B+', count: 38, lowStock: false, color: '#1E6BD6' },
    { type: 'B-', count: 22, lowStock: true, color: '#4ECDC4' },
    { type: 'AB+', count: 12, lowStock: true, color: '#6F42C1' },
    { type: 'AB-', count: 8, lowStock: true, color: '#EC4899' },
    { type: 'O+', count: 62, lowStock: false, color: '#28A745' },
    { type: 'O-', count: 29, lowStock: false, color: '#10B981' },
  ];

  const stats = [
    { 
      title: 'إجمالي المتبرعين', 
      value: '1,254', 
      change: '+12%', 
      color: '#3B82F6', 
      icon: <i className="fas fa-users"></i>
    },
    { 
      title: 'وحدات الدم المتاحة', 
      value: '892', 
      change: '+8%', 
      color: '#EF4444', 
      icon: <i className="fas fa-tint"></i>
    },
    { 
      title: 'المخزون الكلي', 
      value: '231', 
      change: '+5%', 
      color: '#10B981', 
      icon: <i className="fas fa-box"></i>
    },
  ];

  const totalUnits = bloodTypesInventory.reduce((sum, blood) => sum + blood.count, 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1>
                  <i className="fas fa-heartbeat" style={{ color: '#DC143C', marginLeft: '10px' }}></i>
                  لوحة التحكم الرئيسية
                </h1>
                <p>
                  <i className="fas fa-map-marker-alt" style={{ color: '#1E6BD6', marginLeft: '8px' }}></i>
                  بنك الدم الوطني - درعا
                </p>
              </div>
              <div className="welcome-stats">
                <div className="welcome-stat-item">
                  <span className="stat-value">
                    <i className="fas fa-tint" style={{ color: '#DC143C', marginLeft: '5px' }}></i>
                    {totalUnits}
                  </span>
                  <span className="stat-label">إجمالي الوحدات</span>
                </div>
                <div className="welcome-stat-item">
                  <span className="stat-value">
                    <i className="fas fa-exclamation-circle" style={{ color: '#EF4444', marginLeft: '5px' }}></i>
                    {bloodTypesInventory.filter(b => b.lowStock).length}
                  </span>
                  <span className="stat-label">فصائل منخفضة</span>
                </div>
                <div className="welcome-stat-item">
                  <span className="stat-value">
                    <i className="fas fa-chart-line" style={{ color: '#1E6BD6', marginLeft: '5px' }}></i>
                    {bloodTypesInventory.filter(b => !b.lowStock).length}
                  </span>
                  <span className="stat-label">فصائل جيدة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stats-card">
              <div className="stats-main">
                <div className="stats-icon-container" style={{ backgroundColor: `${stat.color}15` }}>
                  <span className="stats-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </span>
                </div>
                <div className="stats-content">
                  <h3 className="stats-value">{stat.value}</h3>
                  <p className="stats-title">{stat.title}</p>
                </div>
              </div>
              <div className="stats-footer">
                <span className="stats-change" style={{ 
                  backgroundColor: stat.change.startsWith('+') ? '#D1FAE5' : '#FEE2E2',
                  color: stat.change.startsWith('+') ? '#065F46' : '#DC2626'
                }}>
                  <i className={`fas ${stat.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                  {stat.change}
                </span>
                <span className="stats-period">الشهر الماضي</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-tint" style={{ color: '#DC143C' }}></i>
                  مخزون فصائل الدم
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-chart-bar" style={{ marginLeft: '6px' }}></i>
                  التفاصيل
                </button>
              </div>
              <div className="blood-inventory">
                <div className="blood-types-grid">
                  {bloodTypesInventory.map((blood, index) => (
                    <div key={index} className={`blood-type-card ${blood.lowStock ? 'low-stock' : ''}`}>
                      <div className="blood-type-header">
                        <div className="blood-type-badge" style={{ backgroundColor: blood.color }}>
                          <i className="fas fa-tint" style={{ color: 'white', fontSize: '20px', marginLeft: '5px' }}></i>
                          {blood.type}
                        </div>
                        <span className="blood-count">{blood.count} وحدة</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${(blood.count / totalUnits) * 100}%`,
                            backgroundColor: blood.color
                          }}
                        ></div>
                      </div>
                      <div className="blood-status">
                        {blood.lowStock ? (
                          <span className="status-warning">
                            <i className="fas fa-exclamation-circle"></i>
                            منخفض
                          </span>
                        ) : (
                          <span className="status-ok">
                            <i className="fas fa-check-circle"></i>
                            جيد
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="inventory-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#10B981' }}></span>
                    <span>مخزون جيد</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                    <span>مخزون متوسط</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#EF4444' }}></span>
                    <span>مخزون منخفض</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-history"></i>
                  النشاط الأخير
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-list" style={{ marginLeft: '6px' }}></i>
                  عرض الكل
                </button>
              </div>
              <div className="activities-list">
                {[
                  { 
                    id: 1, 
                    type: 'تبرع', 
                    donor: 'أحمد محمد', 
                    bloodType: 'A+', 
                    time: 'منذ ساعتين', 
                    status: 'مكتمل',
                    icon: <i className="fas fa-hand-holding-heart" style={{ color: '#DC143C' }}></i>
                  },
                  { 
                    id: 2, 
                    type: 'حجز', 
                    donor: 'سارة خالد', 
                    bloodType: 'O-', 
                    time: 'منذ 4 ساعات', 
                    status: 'معلق',
                    icon: <i className="fas fa-calendar-alt" style={{ color: '#1E6BD6' }}></i>
                  },
                  { 
                    id: 3, 
                    type: 'فحص', 
                    donor: 'محمد علي', 
                    bloodType: 'B+', 
                    time: 'منذ 5 ساعات', 
                    status: 'مكتمل',
                    icon: <i className="fas fa-stethoscope" style={{ color: '#10B981' }}></i>
                  },
                ].map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon-container">
                      <span className="activity-icon">
                        {activity.icon}
                      </span>
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">
                        <span className="activity-donor">{activity.donor}</span>
                        <span className="activity-type">{activity.type}</span>
                      </div>
                      <div className="activity-meta">
                        <span className="activity-blood">
                          <i className="fas fa-tint" style={{ fontSize: '12px', marginLeft: '3px' }}></i>
                          فصيلة {activity.bloodType}
                        </span>
                        <span className="activity-time">
                          <i className="far fa-clock" style={{ fontSize: '12px', marginLeft: '3px' }}></i>
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className={`activity-status ${activity.status === 'مكتمل' ? 'completed' : 'pending'}`}>
                      {activity.status === 'مكتمل' ? (
                        <i className="fas fa-check-circle" style={{ marginLeft: '5px' }}></i>
                      ) : (
                        <i className="fas fa-clock" style={{ marginLeft: '5px' }}></i>
                      )}
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-column">
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-calendar-alt"></i>
                  المواعيد القادمة
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-calendar" style={{ marginLeft: '6px' }}></i>
                  الكل
                </button>
              </div>
              <div className="appointments-list">
                {[
                  { 
                    id: 1, 
                    name: 'أحمد محمد', 
                    time: '10:00 صباحاً', 
                    bloodType: 'A+', 
                    status: 'مؤكد'
                  },
                  { 
                    id: 2, 
                    name: 'سارة خالد', 
                    time: '11:30 صباحاً', 
                    bloodType: 'O-', 
                    status: 'مؤكد'
                  },
                  { 
                    id: 3, 
                    name: 'محمد علي', 
                    time: '02:00 مساءً', 
                    bloodType: 'B+', 
                    status: 'معلق'
                  },
                ].map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-time">
                      <span className="time">
                        <i className="far fa-clock" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
                        {appointment.time}
                      </span>
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-name">
                        <i className="fas fa-user" style={{ marginLeft: '4px' }}></i>
                        {appointment.name}
                      </div>
                      <div className="appointment-blood">
                        <i className="fas fa-tint" style={{ fontSize: '12px', marginLeft: '4px', color: '#DC143C' }}></i>
                        فصيلة {appointment.bloodType}
                      </div>
                    </div>
                    <div className={`appointment-status ${appointment.status}`}>
                      {appointment.status === 'مؤكد' ? (
                        <i className="fas fa-check-circle" style={{ marginLeft: '5px' }}></i>
                      ) : (
                        <i className="fas fa-clock" style={{ marginLeft: '5px' }}></i>
                      )}
                      {appointment.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;