import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/AppointmentsPage.css';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
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

  // تحميل المواعيد من LocalStorage
  useEffect(() => {
    loadAppointments();
    const interval = setInterval(loadAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAppointments = () => {
    try {
      setLoading(true);
      const storedAppointments = JSON.parse(localStorage.getItem('blood_bank_appointments') || '[]');
      
      const formattedAppointments = storedAppointments.map(appt => {
        let statusArabic = 'معلق';
        if (appt.appointmentStatus === 'confirmed') statusArabic = 'مؤكد';
        else if (appt.appointmentStatus === 'cancelled') statusArabic = 'ملغي';
        else if (appt.appointmentStatus === 'completed') statusArabic = 'مكتمل';
        else if (appt.appointmentStatus === 'pending') statusArabic = 'معلق';
        
        let typeArabic = 'تبرع جديد';
        if (appt.appointmentType === 'blood_donation') typeArabic = 'تبرع بالدم';
        else if (appt.appointmentType === 'checkup') typeArabic = 'فحص مخبري';
        
        const donorId = `DON${appt.donorPhone ? appt.donorPhone.slice(-3) : '001'}`;
        const formattedTime = appt.appointmentTime?.length === 4 ? `0${appt.appointmentTime}` : appt.appointmentTime || '09:00';
        
        return {
          id: appt.id,
          donorName: appt.donorName || 'غير معروف',
          donorId: donorId,
          bloodType: appt.donorBloodType || 'غير معروف',
          date: appt.appointmentDate || new Date().toISOString().split('T')[0],
          time: formattedTime,
          type: typeArabic,
          status: statusArabic,
          notes: appt.medicalNotes || appt.notes || 'موعد تبرع بالدم',
          phone: appt.donorPhone || 'غير معروف',
          originalData: appt,
          age: appt.donorAge,
          city: appt.donorCity,
          weight: appt.donorWeight,
          lastDonation: appt.donorLastDonation,
          chronicDisease: appt.donorChronicDisease,
          smoking: appt.donorSmoking,
          createdAt: appt.createdAt,
          priority: appt.priority
        };
      });
      
      formattedAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('خطأ في تحميل المواعيد:', error);
    } finally {
      setLoading(false);
    }
  };

  // إحصائيات المواعيد
  const [appointmentStats, setAppointmentStats] = useState({
    today: 0,
    tomorrow: 0,
    thisWeek: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    completed: 0 // إضافة إحصائية للمواعيد المكتملة
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
      pending: appointments.filter(a => a.status === 'معلق').length,
      cancelled: appointments.filter(a => a.status === 'ملغي').length,
      completed: appointments.filter(a => a.status === 'مكتمل').length
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

    const bankAppointmentData = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      donorName: newAppointment.donorName,
      donorPhone: newAppointment.phone,
      donorBloodType: newAppointment.bloodType,
      appointmentDate: newAppointment.date,
      appointmentTime: newAppointment.time,
      appointmentStatus: 'pending',
      appointmentType: newAppointment.type === 'تبرع جديد' ? 'blood_donation' : 
                     newAppointment.type === 'فحص مخبري' ? 'checkup' : 'consultation',
      center: 'بنك الدم المركزي - درعا',
      medicalNotes: newAppointment.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      addedManually: true
    };

    const bankAppointments = JSON.parse(localStorage.getItem('blood_bank_appointments') || '[]');
    bankAppointments.push(bankAppointmentData);
    localStorage.setItem('blood_bank_appointments', JSON.stringify(bankAppointments));

    loadAppointments();
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

  // تحديث حالة الموعد مع إضافة المتبرع للتقارير عند الاكتمال
  const handleUpdateStatus = (id, newStatus) => {
    let englishStatus = 'pending';
    if (newStatus === 'مؤكد') englishStatus = 'confirmed';
    else if (newStatus === 'ملغي') englishStatus = 'cancelled';
    else if (newStatus === 'مكتمل') englishStatus = 'completed';
    
    const bankAppointments = JSON.parse(localStorage.getItem('blood_bank_appointments') || '[]');
    let donorData = null;
    
    const updatedAppointments = bankAppointments.map(appt => {
      if (appt.id === id) {
        // حفظ بيانات المتبرع إذا كانت الحالة "مكتمل"
        if (englishStatus === 'completed') {
          donorData = {
            id: `DONOR_${Date.now()}`,
            name: appt.donorName,
            phone: appt.donorPhone,
            bloodType: appt.donorBloodType,
            appointmentId: appt.id,
            appointmentDate: appt.appointmentDate,
            completedAt: new Date().toISOString(),
            donationType: appt.appointmentType === 'blood_donation' ? 'تبرع بالدم' : 'فحص مخبري'
          };
        }
        
        return {
          ...appt,
          appointmentStatus: englishStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return appt;
    });
    
    localStorage.setItem('blood_bank_appointments', JSON.stringify(updatedAppointments));
    
    // إذا كانت الحالة مكتملة، أضف المتبرع إلى تقرير المتبرعين
    if (donorData && newStatus === 'مكتمل') {
      addToCompletedDonorsReport(donorData);
    }
    
    loadAppointments();
    
    const statusMessages = {
      'مؤكد': 'تم تأكيد الموعد',
      'ملغي': 'تم إلغاء الموعد',
      'مكتمل': 'تم إكمال الموعد وإضافة المتبرع للتقرير'
    };
    
    if (statusMessages[newStatus]) {
      alert(statusMessages[newStatus]);
    }
  };

  // إضافة المتبرع المكتمل إلى تقرير المتبرعين
  const addToCompletedDonorsReport = (donorData) => {
    try {
      // تحميل تقارير المتبرعين المكتملين الحالية
      const completedDonors = JSON.parse(localStorage.getItem('completed_donors_report') || '[]');
      
      // التحقق من عدم وجود تكرار
      const isDuplicate = completedDonors.some(donor => 
        donor.phone === donorData.phone && 
        donor.appointmentDate === donorData.appointmentDate
      );
      
      if (!isDuplicate) {
        completedDonors.push(donorData);
        localStorage.setItem('completed_donors_report', JSON.stringify(completedDonors));
        console.log('تم إضافة المتبرع إلى التقرير:', donorData.name);
      }
    } catch (error) {
      console.error('خطأ في إضافة المتبرع للتقرير:', error);
    }
  };

  // حذف موعد
  const handleDeleteAppointment = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      const bankAppointments = JSON.parse(localStorage.getItem('blood_bank_appointments') || '[]');
      const filteredAppointments = bankAppointments.filter(appt => appt.id !== id);
      localStorage.setItem('blood_bank_appointments', JSON.stringify(filteredAppointments));
      
      loadAppointments();
      alert('تم حذف الموعد بنجاح');
    }
  };

  // إرسال رسالة تذكير
  const handleSendReminder = (appointment) => {
    const message = `عزيزي/عزيزتي ${appointment.donorName},
    
تذكير بموعد التبرع بالدم:
📅 التاريخ: ${formatDate(appointment.date)}
🕒 الوقت: ${appointment.time}
📍 المكان: بنك الدم المركزي - درعا

يرجى الحضور قبل الموعد بـ 10 دقائق.

بنك الدم المركزي - درعا
📞 6778610`;
    
    alert(`تم إرسال رسالة تذكير إلى ${appointment.donorName} على الرقم ${appointment.phone}\n\n${message}`);
  };

  // عرض تفاصيل الموعد
  const handleViewDetails = (appointment) => {
    const details = `
👤 اسم المتبرع: ${appointment.donorName}
📞 رقم الهاتف: ${appointment.phone}
🆔 رقم المتبرع: ${appointment.donorId}
🩸 فصيلة الدم: ${appointment.bloodType}
🎂 العمر: ${appointment.age || 'غير معروف'}
🏙️ المدينة: ${appointment.city || 'غير معروف'}
⚖️ الوزن: ${appointment.weight || 'غير معروف'} كجم
🩺 آخر تبرع: ${getLastDonationText(appointment.lastDonation)}
🚬 التدخين: ${getSmokingText(appointment.smoking)}
💊 الأمراض المزمنة: ${appointment.chronicDisease === 'yes' ? 'نعم' : 'لا'}
📅 تاريخ الموعد: ${formatDate(appointment.date)}
🕒 وقت الموعد: ${appointment.time}
📝 الملاحظات: ${appointment.notes}
📋 الحالة: ${appointment.status}
⏰ تاريخ التسجيل: ${new Date(appointment.createdAt).toLocaleString('ar-SA')}
    `;
    
    alert(details);
  };

  // دالة مساعدة لتحويل نص آخر تبرع
  const getLastDonationText = (lastDonation) => {
    const texts = {
      'never': 'لم يسبق التبرع',
      'less-1month': 'أقل من شهر',
      '1-2months': 'من 1-2 شهر',
      '2-3months': 'من 2-3 أشهر',
      '3-6months': 'من 3-6 أشهر',
      '6-12months': 'من 6-12 شهر',
      'over-year': 'أكثر من سنة'
    };
    return texts[lastDonation] || 'غير معروف';
  };

  // دالة مساعدة لتحويل نص التدخين
  const getSmokingText = (smoking) => {
    const texts = {
      'no': 'لا',
      'yes': 'نعم',
      'ex-smoker': 'مدخن سابق'
    };
    return texts[smoking] || 'غير معروف';
  };

  // أنواع المواعيد
  const appointmentTypes = ['الكل', 'تبرع بالدم', 'تبرع جديد', 'فحص مخبري', 'استشارة'];
  
  // حالات المواعيد (مع إضافة "مكتمل")
  const appointmentStatuses = ['الكل', 'مؤكد', 'معلق', 'ملغي', 'مكتمل'];

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('ar-SA', options);
    } catch (e) {
      return dateString;
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    switch(status) {
      case 'مؤكد': return '#10B981';
      case 'معلق': return '#F59E0B';
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
      case 'ملغي': return '#FEE2E2';
      case 'مكتمل': return '#F3E8FF';
      default: return '#F3F4F6';
    }
  };

  // الحصول على أيقونة النوع
  const getTypeIcon = (type) => {
    switch(type) {
      case 'تبرع جديد': return '🆕';
      case 'تبرع بالدم': return '💉';
      case 'تبرع دوري': return '🔄';
      case 'فحص مخبري': return '🔬';
      case 'استشارة': return '💬';
      default: return '📅';
    }
  };

  // رسالة التحميل
  if (loading) {
    return (
      <div className="appointments-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المواعيد...</p>
        </div>
      </div>
    );
  }

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
            <button className="btn btn-secondary" onClick={() => {
              if (window.confirm('هل تريد إرسال تذكير لجميع المواعيد المؤكدة؟')) {
                const confirmedAppointments = appointments.filter(a => a.status === 'مؤكد');
                confirmedAppointments.forEach(appt => {
                  alert(`تم إرسال تذكير لـ ${appt.donorName}`);
                });
              }
            }}>
              <span>🔔</span> تذكير جماعي
            </button>
            <button className="btn btn-outline" onClick={loadAppointments}>
              <span>🔄</span> تحديث
            </button>
          </div>
        </div>

        {/* Stats - مع إضافة إحصائية المكتملين */}
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
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#8B5CF6' }}>🏆</div>
            <div className="stat-content">
              <div className="stat-value">{appointmentStats.completed}</div>
              <div className="stat-label">مكتمل</div>
            </div>
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
            <h3>📋 قائمة المواعيد ({filteredAppointments.length})</h3>
            <div className="table-summary">
              <span>عرض {filteredAppointments.length} من {appointments.length} موعد</span>
              <span style={{ marginLeft: '20px', color: '#8B5CF6', fontWeight: 'bold' }}>
                🏆 المكتملين: {appointmentStats.completed}
              </span>
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
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <div className="empty-message">
                        <div className="empty-icon">📭</div>
                        <h4>لا توجد مواعيد</h4>
                        <p>لم يتم العثور على مواعيد تطابق بحثك</p>
                        <button className="btn btn-primary" onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('الكل');
                          setDateFilter('');
                          setTypeFilter('الكل');
                        }}>
                          عرض جميع المواعيد
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
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
                            {appointment.age && (
                              <div className="donor-age">العمر: {appointment.age}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="blood-type-cell">
                          <div 
                            className="blood-badge-small"
                            style={{ 
                              backgroundColor: appointment.bloodType === 'O-' ? '#EF4444' : getStatusColor(appointment.status),
                              color: 'white'
                            }}
                          >
                            {appointment.bloodType}
                            {appointment.bloodType === 'O-' && ' ⚡'}
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
                          <button 
                            className="action-btn info-btn"
                            onClick={() => handleViewDetails(appointment)}
                            title="تفاصيل"
                          >
                            ℹ️
                          </button>
                          
                          {appointment.status === 'معلق' && (
                            <button 
                              className="action-btn confirm-btn"
                              onClick={() => handleUpdateStatus(appointment.id, 'مؤكد')}
                              title="تأكيد"
                            >
                              ✅
                            </button>
                          )}
                          
                          {appointment.status === 'مؤكد' && (
                            <button 
                              className="action-btn complete-btn"
                              onClick={() => handleUpdateStatus(appointment.id, 'مكتمل')}
                              title="إكمال وإضافة للتقرير"
                              style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                            >
                              🏆
                            </button>
                          )}
                          
                          <button 
                            className="action-btn reminder-btn"
                            onClick={() => handleSendReminder(appointment)}
                            title="إرسال تذكير"
                          >
                            🔔
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="upcoming-appointments">
          <div className="section-header">
            <h3>⏰ المواعيد القادمة لهذا الأسبوع</h3>
            <button className="btn btn-outline" onClick={() => {
              alert('عرض جميع المواعيد القادمة');
            }}>عرض الكل</button>
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
                      className="btn btn-complete btn-sm"
                      onClick={() => handleUpdateStatus(appointment.id, 'مكتمل')}
                      style={{ backgroundColor: '#8B5CF6', color: 'white' }}
                    >
                      🏆 إكمال
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="quick-info-card">
          <h4>💡 ملاحظة مهمة:</h4>
          <p>عند النقر على زر "🏆 إكمال" سيتم:</p>
          <ol>
            <li>تغيير حالة الموعد إلى <strong>مكتمل</strong></li>
            <li>إضافة المتبرع إلى <strong>تقرير المتبرعين المكتملين</strong></li>
            <li>يمكنك عرض المتبرعين المكتملين في صفحة التقارير</li>
          </ol>
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
                      const hour = i + 8;
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