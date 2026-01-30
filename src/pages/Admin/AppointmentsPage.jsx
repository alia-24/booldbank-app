import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/AppointmentsPage.css';

const AppointmentsPage = () => {
  // بيانات المواعيد
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      donorName: 'أحمد محمد', 
      donorId: 'DON001', 
      bloodType: 'A+', 
      date: '2024-01-25',
      time: '10:00',
      type: 'تبرع جديد',
      status: 'مؤكد',
      notes: 'موعد أول تبرع',
      phone: '0912345678'
    },
    { 
      id: 2, 
      donorName: 'سارة خالد', 
      donorId: 'DON045', 
      bloodType: 'O-', 
      date: '2024-01-25',
      time: '11:30',
      type: 'تبرع دوري',
      status: 'مؤكد',
      notes: 'المتبرعة الثالثة',
      phone: '0923456789'
    },
    { 
      id: 3, 
      donorName: 'محمد علي', 
      donorId: 'DON112', 
      bloodType: 'B+', 
      date: '2024-01-25',
      time: '14:00',
      type: 'فحص مخبري',
      status: 'معلق',
      notes: 'فحص ما قبل التبرع',
      phone: '0934567890'
    },
    { 
      id: 4, 
      donorName: 'فاطمة حسن', 
      donorId: 'DON078', 
      bloodType: 'AB+', 
      date: '2024-01-26',
      time: '09:00',
      type: 'تبرع جديد',
      status: 'مؤكد',
      notes: 'توصيل إلى المركز',
      phone: '0945678901'
    },
    { 
      id: 5, 
      donorName: 'خالد إبراهيم', 
      donorId: 'DON023', 
      bloodType: 'A-', 
      date: '2024-01-26',
      time: '15:30',
      type: 'تبرع دوري',
      status: 'ملغي',
      notes: 'اعتذر بسبب السفر',
      phone: '0956789012'
    },
    { 
      id: 6, 
      donorName: 'نورا أحمد', 
      donorId: 'DON156', 
      bloodType: 'O+', 
      date: '2024-01-27',
      time: '08:30',
      type: 'فحص مخبري',
      status: 'مؤكد',
      notes: 'فحص دوري',
      phone: '0967890123'
    },
    { 
      id: 7, 
      donorName: 'يوسف محمود', 
      donorId: 'DON089', 
      bloodType: 'B-', 
      date: '2024-01-27',
      time: '13:00',
      type: 'تبرع جديد',
      status: 'قيد الانتظار',
      notes: 'موعد مسائي',
      phone: '0978901234'
    },
    { 
      id: 8, 
      donorName: 'هدى سامي', 
      donorId: 'DON134', 
      bloodType: 'AB-', 
      date: '2024-01-28',
      time: '10:30',
      type: 'تبرع دوري',
      status: 'مؤكد',
      notes: 'تبرع رابع',
      phone: '0989012345'
    }
  ]);

  // حالة للبحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  
  // حالة للنموذج
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    donorName: '',
    phone: '',
    bloodType: 'A+',
    date: '',
    time: '09:00',
    type: 'تبرع جديد',
    notes: ''
  });

  // إحصائيات المواعيد
  const [appointmentStats, setAppointmentStats] = useState({
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0
  });

  // تحديث الإحصائيات
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const stats = {
      today: appointments.filter(a => a.date === today).length,
      tomorrow: appointments.filter(a => a.date === tomorrow).length,
      thisWeek: appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 86400000);
        return appointmentDate >= today && appointmentDate <= weekFromNow;
      }).length,
      confirmed: appointments.filter(a => a.status === 'مؤكد').length,
      pending: appointments.filter(a => a.status === 'معلق' || a.status === 'قيد الانتظار').length,
      cancelled: appointments.filter(a => a.status === 'ملغي').length
    };
    
    setAppointmentStats(stats);
  }, [appointments]);

  // تصفية المواعيد
  const filteredAppointments = appointments.filter(appointment => {
    if (searchTerm && !appointment.donorName.includes(searchTerm) && !appointment.donorId.includes(searchTerm)) {
      return false;
    }
    if (statusFilter !== 'الكل' && appointment.status !== statusFilter) {
      return false;
    }
    if (dateFilter && appointment.date !== dateFilter) {
      return false;
    }
    if (typeFilter !== 'الكل' && appointment.type !== typeFilter) {
      return false;
    }
    return true;
  });

  // إضافة موعد جديد
  const handleAddAppointment = () => {
    if (!newAppointment.donorName || !newAppointment.phone || !newAppointment.date) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const appointmentId = `DON${(appointments.length + 1).toString().padStart(3, '0')}`;
    
    const newAppt = {
      id: appointments.length + 1,
      donorName: newAppointment.donorName,
      donorId: appointmentId,
      bloodType: newAppointment.bloodType,
      date: newAppointment.date,
      time: newAppointment.time,
      type: newAppointment.type,
      status: 'معلق',
      notes: newAppointment.notes,
      phone: newAppointment.phone
    };

    setAppointments([newAppt, ...appointments]);
    setShowAddModal(false);
    setNewAppointment({
      donorName: '',
      phone: '',
      bloodType: 'A+',
      date: '',
      time: '09:00',
      type: 'تبرع جديد',
      notes: ''
    });
    
    alert('تم إضافة الموعد بنجاح!');
  };

  // تحديث حالة الموعد
  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(appointments.map(appt => 
      appt.id === id ? { ...appt, status: newStatus } : appt
    ));
    
    const statusMessages = {
      'مؤكد': 'تم تأكيد الموعد',
      'ملغي': 'تم إلغاء الموعد',
      'مكتمل': 'تم إكمال الموعد'
    };
    
    if (statusMessages[newStatus]) {
      alert(statusMessages[newStatus]);
    }
  };

  // حذف موعد
  const handleDeleteAppointment = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      setAppointments(appointments.filter(appt => appt.id !== id));
      alert('تم حذف الموعد بنجاح');
    }
  };

  // إرسال رسالة تذكير
  const handleSendReminder = (appointment) => {
    alert(`تم إرسال رسالة تذكير إلى ${appointment.donorName} على الرقم ${appointment.phone}`);
  };

  // أنواع المواعيد
  const appointmentTypes = ['الكل', 'تبرع جديد', 'تبرع دوري', 'فحص مخبري', 'استشارة'];
  
  // حالات المواعيد
  const appointmentStatuses = ['الكل', 'مؤكد', 'معلق', 'قيد الانتظار', 'ملغي', 'مكتمل'];

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    switch(status) {
      case 'مؤكد': return '#10B981';
      case 'معلق': return '#F59E0B';
      case 'قيد الانتظار': return '#3B82F6';
      case 'ملغي': return '#EF4444';
      case 'مكتمل': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // الحصول على لون خلفية الحالة
  const getStatusBgColor = (status) => {
    switch(status) {
      case 'مؤكد': return '#D1FAE5';
      case 'معلق': return '#FEF3C7';
      case 'قيد الانتظار': return '#DBEAFE';
      case 'ملغي': return '#FEE2E2';
      case 'مكتمل': return '#F3E8FF';
      default: return '#F3F4F6';
    }
  };

  // الحصول على أيقونة النوع
  const getTypeIcon = (type) => {
    switch(type) {
      case 'تبرع جديد': return '🆕';
      case 'تبرع دوري': return '🔄';
      case 'فحص مخبري': return '🔬';
      case 'استشارة': return '💬';
      default: return '📅';
    }
  };

  return (
    <div className="appointments-page">
      <Header />
      
      <div className="appointments-container">
        {/* Header */}
        <div className="appointments-header">
          <div>
            <h1 className="page-title">📅 إدارة المواعيد</h1>
            <p className="page-subtitle">جدولة ومتابعة مواعيد التبرع والفحوصات</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <span>➕</span> موعد جديد
            </button>
            <button className="btn btn-secondary" onClick={() => alert('جارٍ إرسال تذكير لجميع المواعيد')}>
              <span>🔔</span> تذكير جماعي
            </button>
            <button className="btn btn-outline">
              <span>📥</span> تصدير الجدول
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="appointment-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3B82F6' }}>📅</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.today}</div>
              <div className="stat-label">مواعيد اليوم</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#10B981' }}>⏰</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.tomorrow}</div>
              <div className="stat-label">مواعيد الغد</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#8B5CF6' }}>📆</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.thisWeek}</div>
              <div className="stat-label">هذا الأسبوع</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#F59E0B' }}>✅</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.confirmed}</div>
              <div className="stat-label">مؤكد</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3B82F6' }}>⏳</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.pending}</div>
              <div className="stat-label">قيد الانتظار</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#EF4444' }}>❌</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.cancelled}</div>
              <div className="stat-label">ملغي</div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="calendar-section">
          <div className="section-header">
            <h3>📆 تقويم المواعيد</h3>
            <div className="calendar-navigation">
              <button className="nav-btn">◀</button>
              <span className="current-month">يناير 2024</span>
              <button className="nav-btn">▶</button>
            </div>
          </div>
          
          <div className="calendar-grid">
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const dayAppointments = appointments.filter(a => {
                const appointmentDate = new Date(a.date);
                return appointmentDate.getDate() === day && appointmentDate.getMonth() === 0;
              });
              
              const isToday = day === new Date().getDate();
              
              return (
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <div className="day-number">{day}</div>
                  {dayAppointments.length > 0 && (
                    <div className="day-appointments">
                      {dayAppointments.slice(0, 2).map(appt => (
                        <div 
                          key={appt.id}
                          className="appointment-dot"
                          style={{ backgroundColor: getStatusColor(appt.status) }}
                          title={`${appt.donorName} - ${appt.time}`}
                        ></div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="more-appointments">+{dayAppointments.length - 2}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="appointments-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="🔍 ابحث باسم المتبرع أو الرقم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              {appointmentStatuses.map(status => (
                <option key={status} value={status}>الحالة: {status}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              {appointmentTypes.map(type => (
                <option key={type} value={type}>النوع: {type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-input"
              placeholder="التاريخ"
            />
          </div>
          
          <button className="filter-reset" onClick={() => {
            setSearchTerm('');
            setStatusFilter('الكل');
            setDateFilter('');
            setTypeFilter('الكل');
          }}>
            🗑️ مسح الفلاتر
          </button>
        </div>

        {/* Appointments Table */}
        <div className="appointments-table-container">
          <div className="table-header">
            <h3>📋 قائمة المواعيد</h3>
            <div className="table-summary">
              <span>عرض {filteredAppointments.length} من {appointments.length} موعد</span>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>المتبرع</th>
                  <th>فصيلة الدم</th>
                  <th>التاريخ والوقت</th>
                  <th>نوع الموعد</th>
                  <th>الحالة</th>
                  <th>ملاحظات</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="donor-info">
                        <div className="donor-avatar">
                          {appointment.donorName.charAt(0)}
                        </div>
                        <div>
                          <div className="donor-name">{appointment.donorName}</div>
                          <div className="donor-id">{appointment.donorId}</div>
                          <div className="donor-phone">{appointment.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="blood-type-cell">
                        <div 
                          className="blood-badge-small"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.bloodType}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="datetime-cell">
                        <div className="appointment-date">{formatDate(appointment.date)}</div>
                        <div className="appointment-time">
                          <span className="time-icon">🕒</span>
                          {appointment.time}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="type-cell">
                        <span className="type-icon">{getTypeIcon(appointment.type)}</span>
                        <span className="type-text">{appointment.type}</span>
                      </div>
                    </td>
                    <td>
                      <div 
                        className="status-badge"
                        style={{
                          backgroundColor: getStatusBgColor(appointment.status),
                          color: getStatusColor(appointment.status),
                          border: `1px solid ${getStatusColor(appointment.status)}`
                        }}
                      >
                        {appointment.status}
                      </div>
                    </td>
                    <td>
                      <div className="notes-cell">
                        {appointment.notes || 'لا توجد ملاحظات'}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        {appointment.status === 'معلق' && (
                          <button 
                            className="action-btn confirm-btn"
                            onClick={() => handleUpdateStatus(appointment.id, 'مؤكد')}
                            title="تأكيد"
                          >
                            ✅
                          </button>
                        )}
                        
                        <button 
                          className="action-btn reminder-btn"
                          onClick={() => handleSendReminder(appointment)}
                          title="إرسال تذكير"
                        >
                          🔔
                        </button>
                        
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => alert(`تعديل موعد ${appointment.donorName}`)}
                          title="تعديل"
                        >
                          ✏️
                        </button>
                        
                        {appointment.status !== 'ملغي' && appointment.status !== 'مكتمل' && (
                          <button 
                            className="action-btn cancel-btn"
                            onClick={() => handleUpdateStatus(appointment.id, 'ملغي')}
                            title="إلغاء"
                          >
                            ❌
                          </button>
                        )}
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          title="حذف"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="upcoming-appointments">
          <div className="section-header">
            <h3>⏰ المواعيد القادمة</h3>
            <button className="btn btn-outline">عرض الكل</button>
          </div>
          
          <div className="upcoming-list">
            {appointments
              .filter(a => a.status === 'مؤكد' && new Date(a.date) >= new Date())
              .slice(0, 5)
              .map(appointment => (
                <div key={appointment.id} className="upcoming-card">
                  <div className="upcoming-time">
                    <div className="time">{appointment.time}</div>
                    <div className="date">{appointment.date}</div>
                  </div>
                  <div className="upcoming-info">
                    <div className="donor-name">{appointment.donorName}</div>
                    <div className="donor-details">
                      <span className="blood-type">فصيلة: {appointment.bloodType}</span>
                      <span className="appointment-type">{appointment.type}</span>
                    </div>
                  </div>
                  <div className="upcoming-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSendReminder(appointment)}
                    >
                      تذكير
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => handleUpdateStatus(appointment.id, 'مكتمل')}
                    >
                      إكمال
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>➕ إضافة موعد جديد</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>اسم المتبرع *</label>
                  <input
                    type="text"
                    value={newAppointment.donorName}
                    onChange={(e) => setNewAppointment({...newAppointment, donorName: e.target.value})}
                    className="form-input"
                    placeholder="أدخل اسم المتبرع"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>رقم الهاتف *</label>
                  <input
                    type="tel"
                    value={newAppointment.phone}
                    onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                    className="form-input"
                    placeholder="أدخل رقم الهاتف"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>فصيلة الدم</label>
                  <select
                    value={newAppointment.bloodType}
                    onChange={(e) => setNewAppointment({...newAppointment, bloodType: e.target.value})}
                    className="form-input"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>نوع الموعد</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                    className="form-input"
                  >
                    <option value="تبرع جديد">تبرع جديد</option>
                    <option value="تبرع دوري">تبرع دوري</option>
                    <option value="فحص مخبري">فحص مخبري</option>
                    <option value="استشارة">استشارة</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>التاريخ *</label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    className="form-input"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label>الوقت</label>
                  <select
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    className="form-input"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const hour = i + 8; // من 8 صباحاً إلى 7 مساءً
                      return [`${hour}:00`, `${hour}:30`];
                    }).flat().map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>ملاحظات (اختياري)</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="أي ملاحظات إضافية حول الموعد..."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={handleAddAppointment}>
                حفظ الموعد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;