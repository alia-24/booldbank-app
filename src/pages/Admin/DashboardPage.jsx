import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const bloodTypesInventory = [
    { type: 'A+', count: 45, lowStock: false, color: '#DC143C', percentage: 12.5 },
    { type: 'A-', count: 15, lowStock: true, color: '#FF6B6B', percentage: 7.2 },
    { type: 'B+', count: 38, lowStock: false, color: '#1E6BD6', percentage: 10.8 },
    { type: 'B-', count: 22, lowStock: true, color: '#4ECDC4', percentage: 6.3 },
    { type: 'AB+', count: 12, lowStock: true, color: '#6F42C1', percentage: 4.3 },
    { type: 'AB-', count: 8, lowStock: true, color: '#EC4899', percentage: 2.3 },
    { type: 'O+', count: 62, lowStock: false, color: '#28A745', percentage: 34.3 },
    { type: 'O-', count: 29, lowStock: false, color: '#10B981', percentage: 22.3 },
  ];

  const stats = [
    { 
      title: 'إجمالي المتبرعين', 
      value: '1,254', 
      change: '+12%', 
      color: '#3B82F6', 
      icon: <i className="fas fa-user-friends"></i>
    },
    { 
      title: 'وحدات الدم المتاحة', 
      value: '892', 
      change: '+8%', 
      color: '#EF4444', 
      icon: <i className="fas fa-tint"></i>
    },
    { 
      title: 'المواعيد المعلقة', 
      value: '47', 
      change: '-5%', 
      color: '#10B981', 
      icon: <i className="fas fa-calendar-check"></i>
    },
    { 
      title: 'مستشفيات متعاونة', 
      value: '12', 
      change: '+2', 
      color: '#8B5CF6', 
      icon: <i className="fas fa-hospital-alt"></i>
    },
    { 
      title: 'مخزون متخصص', 
      value: '3', 
      change: '+1', 
      color: '#F59E0B', 
      icon: <i className="fas fa-exclamation-triangle"></i>
    },
    { 
      title: 'طلبات اليوم', 
      value: '8', 
      change: '-3', 
      color: '#EC4899', 
      icon: <i className="fas fa-clipboard-list"></i>
    },
  ];

  const totalUnits = bloodTypesInventory.reduce((sum, blood) => sum + blood.count, 0);
  const availableTypes = bloodTypesInventory.length;
  const topBloodType = bloodTypesInventory.reduce((a, b) => a.count > b.count ? a : b);

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1>
                  <i className="fas fa-heartbeat" style={{ color: '#DC143C', marginLeft: '10px' }}></i>
                  مرحباً بك في نظام إدارة بنك الدم
                </h1>
                <p>
                  <i className="fas fa-map-marker-alt" style={{ color: '#1E6BD6', marginLeft: '8px' }}></i>
                  بنك الدم الوطني - درعا | إدارة المتبرعين والمخزون والطلبات
                </p>
              </div>
              <div className="welcome-stats">
                <div className="welcome-stat-item">
                  <span className="stat-value">
                    <i className="fas fa-tint" style={{ color: '#DC143C', marginLeft: '5px' }}></i>
                    {bloodTypesInventory.find(b => b.type === 'O+')?.count || 0}
                  </span>
                  <span className="stat-label">O+ متاحة</span>
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
                    {totalUnits}
                  </span>
                  <span className="stat-label">وحدات متاحة</span>
                </div>
                <div className="welcome-stat-item">
                  <span className="stat-value">
                    <i className="fas fa-bell" style={{ color: '#EC4899', marginLeft: '5px' }}></i>
                    {stats.find(s => s.title === 'طلبات اليوم')?.value || 0}
                  </span>
                  <span className="stat-label">طلبات اليوم</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stats-card">
              <div className="stats-header">
                <div className="stats-icon-container" style={{ backgroundColor: `${stat.color}20` }}>
                  <span className="stats-icon" style={{ color: stat.color, fontSize: '24px' }}>
                    {stat.icon}
                  </span>
                </div>
                <span className="stats-change" style={{ 
                  backgroundColor: stat.change.startsWith('+') ? '#D1FAE5' : '#FEE2E2',
                  color: stat.change.startsWith('+') ? '#065F46' : '#DC2626'
                }}>
                  <i className={`fas ${stat.change.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'}`} 
                     style={{ fontSize: '10px', marginLeft: '4px' }}></i>
                  {stat.change}
                </span>
              </div>
              <div className="stats-body">
                <h3 className="stats-value">{stat.value}</h3>
                <p className="stats-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-column">
            
            {/* قسم مخزون فصائل الدم */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-tint" style={{ color: '#DC143C' }}></i>
                  مخزون فصائل الدم
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-chart-bar" style={{ marginLeft: '6px' }}></i>
                  تفاصيل المخزون
                </button>
              </div>
              <div className="blood-inventory">
                <div className="inventory-summary">
                  <div className="summary-item">
                    <span className="summary-label">
                      <i className="fas fa-boxes" style={{ color: '#6B7280', marginLeft: '5px' }}></i>
                      إجمالي الوحدات
                    </span>
                    <span className="summary-value">{totalUnits}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">
                      <i className="fas fa-vial" style={{ color: '#6B7280', marginLeft: '5px' }}></i>
                      الفصائل المتاحة
                    </span>
                    <span className="summary-value">{availableTypes}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">
                      <i className="fas fa-trophy" style={{ color: '#6B7280', marginLeft: '5px' }}></i>
                      أكثر فصيلة
                    </span>
                    <span className="summary-value" style={{ color: topBloodType.color }}>
                      {topBloodType.type} ({topBloodType.count})
                    </span>
                  </div>
                </div>
                
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
                            width: `${blood.percentage}%`,
                            backgroundColor: blood.color
                          }}
                        ></div>
                      </div>
                      <div className="blood-status">
                        {blood.lowStock ? (
                          <span className="status-warning">
                            <i className="fas fa-exclamation-circle"></i>
                            مخزون منخفض
                          </span>
                        ) : (
                          <span className="status-ok">
                            <i className="fas fa-check-circle"></i>
                            مخزون جيد
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="inventory-legend">
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#10B981' }}></span>
                    <span>
                      <i className="fas fa-check" style={{ color: '#10B981', marginLeft: '5px' }}></i>
                      مخزون جيد (أكثر من 20 وحدة)
                    </span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }}></span>
                    <span>
                      <i className="fas fa-exclamation" style={{ color: '#F59E0B', marginLeft: '5px' }}></i>
                      مخزون متوسط (10-20 وحدة)
                    </span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#EF4444' }}></span>
                    <span>
                      <i className="fas fa-times" style={{ color: '#EF4444', marginLeft: '5px' }}></i>
                      مخزون منخفض (أقل من 10 وحدات)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
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
                  { 
                    id: 4, 
                    type: 'بيع', 
                    donor: 'مستشفى درعا', 
                    bloodType: 'A+', 
                    time: 'منذ يوم', 
                    status: 'مكتمل',
                    icon: <i className="fas fa-money-bill-wave" style={{ color: '#F59E0B' }}></i>
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

          {/* Right Column */}
          <div className="dashboard-column">
            {/* إجراءات سريعة */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-bolt"></i>
                  إجراءات سريعة
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-ellipsis-h" style={{ marginLeft: '6px' }}></i>
                  المزيد
                </button>
              </div>
              <div className="quick-actions-grid">
                <button className="quick-action-item" onClick={() => navigate('/inventory')}>
                  <div className="action-icon" style={{ backgroundColor: '#EFF6FF' }}>
                    <i className="fas fa-chart-pie" style={{ color: '#3B82F6', fontSize: '22px' }}></i>
                  </div>
                  <div className="action-content">
                    <h4>مراجعة المخزون</h4>
                    <p>عرض وتحديث مخزون الدم</p>
                  </div>
                </button>
                
                <button className="quick-action-item" onClick={() => navigate('/appointments')}>
                  <div className="action-icon" style={{ backgroundColor: '#F0FDF4' }}>
                    <i className="fas fa-calendar-plus" style={{ color: '#10B981', fontSize: '22px' }}></i>
                  </div>
                  <div className="action-content">
                    <h4>جدولة موعد</h4>
                    <p>إضافة موعد تبرع جديد</p>
                  </div>
                </button>
                
                {/* زر بيع وحدة دم معدل */}
                <button 
                  className="quick-action-item" 
                  onClick={() => navigate('/blood-sales')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="action-icon" style={{ backgroundColor: '#FEF3C7' }}>
                    <i className="fas fa-hand-holding-usd" style={{ color: '#F59E0B', fontSize: '22px' }}></i>
                  </div>
                  <div className="action-content">
                    <h4>بيع وحدة دم</h4>
                    <p>تسجيل عملية بيع جديدة</p>
                  </div>
                </button>
                
                <button className="quick-action-item" onClick={() => navigate('/reports')}>
                  <div className="action-icon" style={{ backgroundColor: '#F3E8FF' }}>
                    <i className="fas fa-chart-line" style={{ color: '#8B5CF6', fontSize: '22px' }}></i>
                  </div>
                  <div className="action-content">
                    <h4>تقرير أدائي</h4>
                    <p>عرض التقارير والإحصائيات</p>
                  </div>
                </button>
              </div>
              
              {/* قسم الفصائل السريعة */}
              <div className="quick-blood-types">
                <h4>
                  <i className="fas fa-vials" style={{ marginLeft: '8px' }}></i>
                  فصائل الدم الرئيسية:
                </h4>
                <div className="quick-types-grid">
                  {bloodTypesInventory.slice(0, 4).map((blood, index) => (
                    <div key={index} className="quick-type-item">
                      <div 
                        className="quick-type-badge" 
                        style={{ backgroundColor: blood.color }}
                        title={`${blood.count} وحدة متاحة`}
                      >
                        <i className="fas fa-tint" style={{ color: 'white', fontSize: '14px', marginLeft: '3px' }}></i>
                        {blood.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* المواعيد القادمة */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-calendar-alt"></i>
                  المواعيد القادمة
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-calendar" style={{ marginLeft: '6px' }}></i>
                  جميع المواعيد
                </button>
              </div>
              <div className="appointments-list">
                {[
                  { 
                    id: 1, 
                    name: 'أحمد محمد', 
                    time: '10:00 صباحاً', 
                    bloodType: 'A+', 
                    status: 'مؤكد',
                    avatar: <i className="fas fa-user-circle" style={{ color: '#3B82F6', fontSize: '18px' }}></i>
                  },
                  { 
                    id: 2, 
                    name: 'سارة خالد', 
                    time: '11:30 صباحاً', 
                    bloodType: 'O-', 
                    status: 'مؤكد',
                    avatar: <i className="fas fa-user-circle" style={{ color: '#EC4899', fontSize: '18px' }}></i>
                  },
                  { 
                    id: 3, 
                    name: 'محمد علي', 
                    time: '02:00 مساءً', 
                    bloodType: 'B+', 
                    status: 'معلق',
                    avatar: <i className="fas fa-user-circle" style={{ color: '#10B981', fontSize: '18px' }}></i>
                  },
                  { 
                    id: 4, 
                    name: 'فاطمة حسن', 
                    time: '04:30 مساءً', 
                    bloodType: 'AB+', 
                    status: 'مؤكد',
                    avatar: <i className="fas fa-user-circle" style={{ color: '#8B5CF6', fontSize: '18px' }}></i>
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
                        {appointment.avatar}
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

            {/* أهداف التبرع */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-bullseye"></i>
                  أهداف التبرع الشهرية
                </h3>
                <button className="btn-outline btn-sm">
                  <i className="fas fa-edit" style={{ marginLeft: '6px' }}></i>
                  تحديث الأهداف
                </button>
              </div>
              <div className="targets-progress">
                <div className="target-item">
                  <div className="target-info">
                    <span className="target-label">
                      <i className="fas fa-tint" style={{ color: '#DC143C', marginLeft: '5px' }}></i>
                      الهدف الشهري
                    </span>
                    <span className="target-value">500 وحدة</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ 
                      width: '75%',
                      background: 'linear-gradient(90deg, #FF6B6B, #DC143C)'
                    }}></div>
                  </div>
                  <div className="progress-text">
                    <i className="fas fa-chart-bar" style={{ marginLeft: '5px', color: '#6B7280' }}></i>
                    375 / 500 (75%)
                  </div>
                </div>
                <div className="target-item">
                  <div className="target-info">
                    <span className="target-label">
                      <i className="fas fa-user-plus" style={{ color: '#1E6BD6', marginLeft: '5px' }}></i>
                      المتبرعين الجدد
                    </span>
                    <span className="target-value">100 متبرع</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ 
                      width: '60%',
                      background: 'linear-gradient(90deg, #4ECDC4, #1E6BD6)'
                    }}></div>
                  </div>
                  <div className="progress-text">
                    <i className="fas fa-chart-line" style={{ marginLeft: '5px', color: '#6B7280' }}></i>
                    60 / 100 (60%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* هنا تم إزالة قسم "روابط سريعة" بالكامل */}
      </div>
    </div>
  );
};

export default DashboardPage;