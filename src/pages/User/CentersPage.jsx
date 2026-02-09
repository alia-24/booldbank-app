/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CentersPage.css';

function CentersPage() {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentWatermarkNumber, setCurrentWatermarkNumber] = useState(1);

  // بيانات مراكز التبرع والمشافي من الملف
  const centers = [
    {
      id: 'main-blood-bank',
      type: 'blood-bank',
      name: 'بنك الدم المركزي - درعا',
      arabicName: 'بنك الدم المركزي - درعا',
      address: 'درعا - مقابل مشفى درعا الوطني',
      phone: '6778610',
      workingHours: 'الأحد - الخميس: 8 ص - 2 م',
      closedDays: 'الجمعة والسبت: إجازة',
      description: 'المركز الوحيد المعتمد للتبرع بالدم في محافظة درعا',
      services: ['التبرع بالدم', 'فحص فصائل الدم', 'فحوصات طبية', 'شهادات تبرع'],
      isMain: true,
      coordinates: { lat: 32.6190, lng: 36.1015 }
    }
  ];

  const hospitals = [
    {
      id: 'daraa-national',
      type: 'hospital',
      name: 'مشفى درعا الوطني',
      arabicName: 'مشفى درعا الوطني',
      governmentType: 'حكومي',
      address: 'درعا – حي السحاري – طريق المشفى',
      phone: '6778610',
      workingHours: '24 ساعة',
      description: 'المشفى الرئيسي في المحافظة',
      services: ['طوارئ', 'سحب دم للتحاليل', 'علاج الحالات الحرجة'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'azraa-national',
      type: 'hospital',
      name: 'مشفى أزرع الوطني',
      arabicName: 'مشفى أزرع الوطني',
      governmentType: 'حكومي',
      address: 'أزرع – طريق دمشق القديم – الخوصة شرق القرن الآلي',
      phone: '5835249 – 5834247',
      workingHours: '24 ساعة',
      description: 'مشفى حكومي في منطقة أزرع',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'bosra-national',
      type: 'hospital',
      name: 'مشفى بصرى الوطني',
      arabicName: 'مشفى بصرى الوطني',
      governmentType: 'حكومي',
      address: 'بصرى – الحي الجنوبي – جنوب فندق بصرى',
      phone: '5841442 – 5841431',
      workingHours: '24 ساعة',
      description: 'مشفى حكومي في بصرى',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'jassim-national',
      type: 'hospital',
      name: 'مشفى جاسم الوطني',
      arabicName: 'مشفى جاسم الوطني',
      governmentType: 'حكومي',
      address: 'شمال شرق مدينة جاسم – طريق دير العدس',
      phone: '4882984',
      workingHours: '24 ساعة',
      description: 'مشفى حكومي في مدينة جاسم',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'tafas-national',
      type: 'hospital',
      name: 'مشفى طفس الوطني',
      arabicName: 'مشفى طفس الوطني',
      governmentType: 'حكومي',
      address: 'طفس – الطريق العام – جانب سوق الهال',
      phone: '2222847',
      workingHours: '24 ساعة',
      description: 'مشفى حكومي في طفس',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'nawa-national',
      type: 'hospital',
      name: 'مشفى نوى الوطني',
      arabicName: 'مشفى نوى الوطني',
      governmentType: 'حكومي',
      address: 'نوى – الحي الشمالي – طريق جاسم',
      phone: '277481',
      workingHours: '24 ساعة',
      description: 'مشفى حكومي في نوى',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'ash-shifa',
      type: 'hospital',
      name: 'مشفى الشفاء',
      arabicName: 'مشفى الشفاء',
      governmentType: 'خاص',
      address: 'درعا – حي السحاري – جنوب المركز الثقافي',
      phone: '0938850899',
      workingHours: '24 ساعة',
      description: 'مشفى خاص في درعا',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'ar-rahma',
      type: 'hospital',
      name: 'مشفى الرحمة',
      arabicName: 'مشفى الرحمة',
      governmentType: 'خاص',
      address: 'درعا – حي المطار – غرب حديقة المطار',
      phone: '2227333',
      workingHours: '24 ساعة',
      description: 'مشفى خاص في درعا',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    },
    {
      id: 'ash-sharq',
      type: 'hospital',
      name: 'مشفى الشرق',
      arabicName: 'مشفى الشرق',
      governmentType: 'خاص',
      address: 'درعا – شمال دوار الدلة',
      phone: '2224259',
      workingHours: '24 ساعة',
      description: 'مشفى خاص في درعا',
      services: ['طوارئ', 'سحب دم للتحاليل'],
      emergencyOnly: true,
      note: 'لا يقبل متبرعين - سحب الدم للتحاليل والطوارئ فقط'
    }
  ];

  // أرقام الطوارئ
  const emergencyNumbers = [
    { label: 'الطوارئ', number: '112' },
    { label: 'الإسعاف', number: '110' }
  ];

  // تغيير العلامة المائية كل 3 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWatermarkNumber(prev => (prev % 4) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // تصفية المراكز حسب النوع
  const filteredCenters = centers.filter(center => {
    if (filter === 'all') return true;
    if (filter === 'blood-bank') return center.type === 'blood-bank';
    if (filter === 'hospital') return center.type === 'hospital';
    return true;
  });

  // تصفية المشافي حسب البحث
  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = 
      hospital.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.governmentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all' || filter === 'hospital') {
      return matchesSearch;
    }
    return false;
  });

  // معالجة حجز موعد
  const handleBookAppointment = (center) => {
    const user = localStorage.getItem('blood_bank_daraa_user');
    
    if (!user) {
      alert('⚠️ يجب تسجيل الدخول أولاً لحجز موعد');
      navigate('/login');
      return;
    }

    setSelectedCenter(center);
    setShowBookingModal(true);
  };

  // إرسال حجز الموعد
  const handleSubmitBooking = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const time = formData.get('time');
    
    if (!date || !time) {
      alert('يرجى اختيار التاريخ والوقت');
      return;
    }

    // حفظ الحجز
    const bookingData = {
      centerId: selectedCenter.id,
      centerName: selectedCenter.name,
      date,
      time,
      bookedAt: new Date().toISOString(),
      status: 'pending'
    };

    const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    existingBookings.push(bookingData);
    localStorage.setItem('user_bookings', JSON.stringify(existingBookings));

    alert(`✅ تم حجز موعدك في ${selectedCenter.name}\nالتاريخ: ${date}\nالوقت: ${time}`);
    setShowBookingModal(false);
  };

  // محاكاة الاتصال الهاتفي
  const handleCall = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/[^\d–\-]/g, '');
    if (window.confirm(`هل تريد الاتصال بالرقم: ${phoneNumber}؟`)) {
      window.location.href = `tel:${cleanNumber}`;
    }
  };

  // محاكاة فتح خرائط جوجل
  const handleOpenMap = (center) => {
    if (center.coordinates) {
      const { lat, lng } = center.coordinates;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(center.address)}`, '_blank');
    }
  };

  // إغلاق المودال
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedCenter(null);
  };

  // مكون العلامة المائية
  const WatermarkNumber = ({ number }) => (
    <div className="watermark-number">
      <span className="watermark-digit">{number}</span>
    </div>
  );

  return (
    <div className="centers-page">
      {/* العنوان الرئيسي */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            <i className="fas fa-hospital"></i>
            المراكز والمشافي
          </h1>
          <p className="page-subtitle">
            تعرف على مراكز التبرع والمشافي في محافظة درعا
          </p>
        </div>
      </div>

      {/* تنبيه مهم */}
      <div className="container">
        <div className="important-note">
          <div className="note-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="note-content">
            <h3>تنبيه مهم جداً</h3>
            <p>
              <strong>التبرع بالدم فقط في بنك الدم المركزي بدرعا</strong>. 
              المشافي <strong>لا تقبل متبرعين</strong>، ولكن يتم سحب الدم في الحالات التالية:
            </p>
            <ul>
              <li>حالات الطوارئ (نزيف، حوادث، عمليات)</li>
              <li>التحاليل المخبرية والفحوصات الطبية</li>
              <li>فحوصات المرضى الداخلين</li>
            </ul>
          </div>
        </div>
      </div>

      {/* فلترة وبحث */}
      <div className="container">
        <div className="filters-section">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <i className="fas fa-list"></i>
              الكل
            </button>
            <button 
              className={`filter-btn ${filter === 'blood-bank' ? 'active' : ''}`}
              onClick={() => setFilter('blood-bank')}
            >
              <i className="fas fa-heartbeat"></i>
              بنك الدم
            </button>
            <button 
              className={`filter-btn ${filter === 'hospital' ? 'active' : ''}`}
              onClick={() => setFilter('hospital')}
            >
              <i className="fas fa-hospital-alt"></i>
              المشافي
            </button>
          </div>

          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="ابحث باسم المشفى أو الموقع أو الجهة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* بنك الدم المركزي */}
      <div className="container">
        <div className="section-header">
          <h2>
            <i className="fas fa-heartbeat"></i>
            بنك الدم المركزي
          </h2>
          <p>المركز الوحيد للتبرع بالدم في درعا</p>
        </div>

        <div className="centers-grid">
          {filteredCenters.map(center => (
            <div key={center.id} className="center-card main-center">
              <div className="center-header">
                <div className="center-icon">
                  <i className="fas fa-heartbeat"></i>
                  <span className="center-badge">المركز الوحيد</span>
                </div>
                <div className="center-info">
                  <h3>{center.arabicName}</h3>
                  <p className="center-description">{center.description}</p>
                </div>
              </div>

              <div className="center-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{center.address}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-phone"></i>
                  <span>{center.phone}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <span>{center.workingHours}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar-times"></i>
                  <span className="closed">{center.closedDays}</span>
                </div>
              </div>

              {/* الخدمات */}
              <div className="services-section">
                <h4>
                  <i className="fas fa-concierge-bell"></i>
                  الخدمات المقدمة
                </h4>
                <div className="services-tags">
                  {center.services.map((service, index) => (
                    <span key={index} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="center-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookAppointment(center)}
                >
                  <i className="fas fa-calendar-check"></i>
                  احجز موعد
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleCall(center.phone)}
                >
                  <i className="fas fa-phone"></i>
                  اتصل بنا
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleOpenMap(center)}
                >
                  <i className="fas fa-map"></i>
                  الموقع
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* المشافي */}
      <div className="container">
        <div className="section-header">
          <h2>
            <i className="fas fa-hospital-alt"></i>
            المشافي في درعا
          </h2>
          <p>المشافي الحكومية والخاصة في المحافظة</p>
        </div>

        {searchTerm && (
          <div className="search-results-info">
            <p>
              عرض {filteredHospitals.length} من {hospitals.length} مشفى
              {searchTerm && ` للبحث: "${searchTerm}"`}
            </p>
          </div>
        )}

        <div className="hospitals-grid">
          {filteredHospitals.length > 0 ? (
            filteredHospitals.map(hospital => (
              <div key={hospital.id} className="hospital-card">
                <div className="hospital-header">
                  <div className="hospital-icon">
                    <i className="fas fa-hospital"></i>
                    {hospital.emergencyOnly && (
                      <span className="emergency-badge">طوارئ فقط</span>
                    )}
                  </div>
                  <div className="hospital-info">
                    <h3>{hospital.arabicName}</h3>
                    <p className="hospital-type">
                      <i className="fas fa-building"></i>
                      {hospital.governmentType === 'حكومي' ? 'مشفى حكومي' : 'مشفى خاص'}
                    </p>
                    <p className="hospital-description">{hospital.description}</p>
                  </div>
                </div>

                <div className="hospital-details">
                  <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{hospital.address}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{hospital.workingHours}</span>
                  </div>
                </div>

                {/* ملاحظة هامة للمشافي */}
                {hospital.note && (
                  <div className="hospital-note">
                    <i className="fas fa-info-circle"></i>
                    <p>{hospital.note}</p>
                  </div>
                )}

                {/* الخدمات */}
                <div className="services-section">
                  <h4>
                    <i className="fas fa-stethoscope"></i>
                    الخدمات
                  </h4>
                  <div className="services-tags">
                    {hospital.services.map((service, index) => (
                      <span key={index} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="hospital-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleCall(hospital.phone)}
                  >
                    <i className="fas fa-phone"></i>
                    اتصل
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleOpenMap(hospital)}
                  >
                    <i className="fas fa-map"></i>
                    الموقع
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>لا توجد نتائج</h3>
              <p>لم يتم العثور على مشافي تطابق بحثك</p>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
              >
                <i className="fas fa-redo"></i>
                عرض كل المشافي
              </button>
            </div>
          )}
        </div>
      </div>

      {/* أرقام الطوارئ */}
      <div className="container">
        <div className="emergency-section">
          <div className="emergency-card">
            <div className="emergency-icon">
              <i className="fas fa-ambulance"></i>
            </div>
            <div className="emergency-content">
              <h3>أرقام الطوارئ</h3>
              <div className="emergency-numbers">
                {emergencyNumbers.map((emergency, index) => (
                  <div key={index} className="emergency-number">
                    <span className="number-label">{emergency.label}:</span>
                    <span className="number-value">{emergency.number}</span>
                  </div>
                ))}
                <div className="emergency-number">
                  <span className="number-label">بنك الدم:</span>
                  <span className="number-value">6778610</span>
                </div>
                <div className="emergency-number">
                  <span className="number-label">مشفى درعا:</span>
                  <span className="number-value">6778610</span>
                </div>
              </div>
              <p className="emergency-note">
                <i className="fas fa-exclamation-circle"></i>
                في حالات الطوارئ المتعلقة بالدم، اتصل ببنك الدم مباشرة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* تعليمات مهمة مع العلامة المائية */}
      <div className="container">
        <div className="instructions-section">
          <h3>
            <i className="fas fa-clipboard-check"></i>
            تعليمات عند التوجه للمركز
          </h3>
          
          {/* العلامة المائية */}
          <div className="watermark-container">
            <WatermarkNumber number={currentWatermarkNumber} />
          </div>
          
          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-icon">
                <i className="fas fa-id-card"></i>
              </div>
              <h4>الوثائق المطلوبة</h4>
              <ul>
                <li>الهوية الشخصية</li>
                <li>بطاقة التأمين الصحي (إن وجدت)</li>
                <li>رقم هاتف للتواصل</li>
              </ul>
            </div>
            <div className="instruction-card">
              <div className="instruction-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h4>قبل التبرع</h4>
              <ul>
                <li>تناول وجبة خفيفة قبل التبرع</li>
                <li>اشرب كمية كافية من الماء</li>
                <li>احصل على قسط كافٍ من النوم</li>
              </ul>
            </div>
            <div className="instruction-card">
              <div className="instruction-icon">
                <i className="fas fa-ban"></i>
              </div>
              <h4>تجنب قبل التبرع</h4>
              <ul>
                <li>التدخين قبل 12 ساعة</li>
                <li>تناول الوجبات الدسمة</li>
                <li>المشروبات المنبهة قبل 4 ساعات</li>
              </ul>
            </div>
            <div className="instruction-card">
              <div className="instruction-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h4>بعد التبرع</h4>
              <ul>
                <li>استرح لمدة 15 دقيقة</li>
                <li>تناول وجبة خفيفة</li>
                <li>اشرب سوائل أكثر من المعتاد</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* زر الإجراء السريع */}
      <div className="quick-action">
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/donate')}
        >
          <i className="fas fa-hand-holding-heart"></i>
          سجل للتبرع الآن
        </button>
      </div>

      {/* مودال حجز الموعد */}
      {showBookingModal && selectedCenter && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-calendar-check"></i>
                حجز موعد في {selectedCenter.arabicName}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="center-info-modal">
                <p>
                  <i className="fas fa-map-marker-alt"></i>
                  {selectedCenter.address}
                </p>
                <p>
                  <i className="fas fa-clock"></i>
                  {selectedCenter.workingHours}
                </p>
              </div>

              <form onSubmit={handleSubmitBooking}>
                <div className="form-group">
                  <label htmlFor="bookingDate">
                    <i className="fas fa-calendar"></i>
                    اختر التاريخ
                  </label>
                  <input
                    type="date"
                    id="bookingDate"
                    name="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bookingTime">
                    <i className="fas fa-clock"></i>
                    اختر الوقت
                  </label>
                  <select id="bookingTime" name="time" required>
                    <option value="">اختر الوقت</option>
                    <option value="8:00">8:00 - 8:30 ص</option>
                    <option value="8:30">8:30 - 9:00 ص</option>
                    <option value="9:00">9:00 - 9:30 ص</option>
                    <option value="9:30">9:30 - 10:00 ص</option>
                    <option value="10:00">10:00 - 10:30 ص</option>
                    <option value="10:30">10:30 - 11:00 ص</option>
                    <option value="11:00">11:00 - 11:30 ص</option>
                    <option value="11:30">11:30 - 12:00 ظ</option>
                    <option value="12:00">12:00 - 12:30 ظ</option>
                    <option value="12:30">12:30 - 1:00 ظ</option>
                    <option value="13:00">1:00 - 1:30 ظ</option>
                    <option value="13:30">1:30 - 2:00 ظ</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary">
                    تأكيد الحجز
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CentersPage;