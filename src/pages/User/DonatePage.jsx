/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonatePage.css';

function DonatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    nationalId: '',
    birthDate: '',
    city: '',
    customCity: '',
    bloodType: '',
    weight: '',
    lastDonation: '',
    chronicDisease: 'no',
    smoking: 'no',
    medicalNotes: '',
    appointmentDay: '',
    appointmentTime: ''
  });

  // أخطاء التحقق
  const [errors, setErrors] = useState({});

  // التحذيرات
  const [showSmokingInstructions, setShowSmokingInstructions] = useState(false);
  const [showChronicWarning, setShowChronicWarning] = useState(false);
  const [showLastDonationWarning, setShowLastDonationWarning] = useState(false);
  const [showWeightWarning, setShowWeightWarning] = useState(false);
  const [showCustomCity, setShowCustomCity] = useState(false);

  // بيانات درعا
  const daraaCities = [
    { id: 'daraa-city', name: 'مدينة درعا' },
    { id: 'daraa-al-balad', name: 'درعا البلد' },
    { id: 'al-sanamayn', name: 'الصنمين' },
    { id: 'al-harra', name: 'الحراك' },
    { id: 'in-khil', name: 'إنخل' },
    { id: 'jassim', name: 'جاسم' },
    { id: 'nawa', name: 'نوى' },
    { id: 'tassil', name: 'تسيل' },
    { id: 'al-muzayrib', name: 'المزيريب' },
    { id: 'al-yadudah', name: 'اليادودة' },
    { id: 'azraa', name: 'أزرع' },
    { id: 'bosra', name: 'بصري' },
    { id: 'tafas', name: 'طفس' },
    { id: 'other', name: 'مكان آخر' }
  ];

  const bloodTypes = [
    { value: '', label: 'اختر الفصيلة' },
    { value: 'unknown', label: 'لا أعرف فصيلة دمي' },
    { value: 'O+', label: 'O+ (O موجب)' },
    { value: 'O-', label: 'O- (O سالب)' },
    { value: 'A+', label: 'A+ (A موجب)' },
    { value: 'A-', label: 'A- (A سالب)' },
    { value: 'B+', label: 'B+ (B موجب)' },
    { value: 'B-', label: 'B- (B سالب)' },
    { value: 'AB+', label: 'AB+ (AB موجب)' },
    { value: 'AB-', label: 'AB- (AB سالب)' }
  ];

  const timeSlots = [
    { value: '', label: 'اختر الوقت' },
    { value: '8:00', label: '8:00 - 8:30 ص' },
    { value: '8:30', label: '8:30 - 9:00 ص' },
    { value: '9:00', label: '9:00 - 9:30 ص' },
    { value: '9:30', label: '9:30 - 10:00 ص' },
    { value: '10:00', label: '10:00 - 10:30 ص' },
    { value: '10:30', label: '10:30 - 11:00 ص' },
    { value: '11:00', label: '11:00 - 11:30 ص' },
    { value: '11:30', label: '11:30 - 12:00 ظ' },
    { value: '12:00', label: '12:00 - 12:30 ظ' },
    { value: '12:30', label: '12:30 - 1:00 ظ' },
    { value: '13:00', label: '1:00 - 1:30 ظ' },
    { value: '13:30', label: '1:30 - 2:00 ظ' }
  ];

  const appointmentDays = [
    { value: '', label: 'اختر اليوم' },
    { value: 'sunday', label: 'الأحد' },
    { value: 'monday', label: 'الاثنين' },
    { value: 'tuesday', label: 'الثلاثاء' },
    { value: 'wednesday', label: 'الأربعاء' },
    { value: 'thursday', label: 'الخميس' }
  ];

  const chronicDiseases = [
    'السكري',
    'أمراض القلب',
    'ارتفاع ضغط الدم',
    'أمراض الكلى المزمنة',
    'أمراض الكبد',
    'الأورام السرطانية',
    'أمراض الدم (فقر الدم المنجلي، الثلاسيميا)',
    'الصرع',
    'الأمراض المناعية',
    'الإيدز'
  ];

  // دالة للتحقق من تسجيل الدخول في جميع المفاتيح
  const checkAuthentication = () => {
    console.log('🔍 التحقق من حالة المصادقة...');
    
    const userData = 
      localStorage.getItem('currentUser') ||
      localStorage.getItem('blood_bank_current_user') ||
      localStorage.getItem('blood_bank_daraa_user') ||
      localStorage.getItem('blood_bank_user');
    
    console.log('📋 بيانات المستخدم في localStorage:', userData);
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ مستخدم مسجل:', parsedUser);
        setUser(parsedUser);
        setAuthChecked(true);
        
        // تعبئة بعض الحقول تلقائياً
        setFormData(prev => ({
          ...prev,
          fullName: parsedUser.name || '',
          phone: parsedUser.phone || '',
          bloodType: parsedUser.bloodType || ''
        }));
        
        return parsedUser;
      } catch (error) {
        console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
        setUser(null);
        setAuthChecked(true);
        return null;
      }
    } else {
      console.log('❌ لا يوجد مستخدم مسجل');
      setUser(null);
      setAuthChecked(true);
      return null;
    }
  };

  // عند تحميل الصفحة
  useEffect(() => {
    // التحقق من المصادقة
    checkAuthentication();

    // الاستماع لتغيرات في localStorage
    const handleStorageChange = () => {
      console.log('🔄 حدث تغيير في localStorage، إعادة التحقق من المصادقة');
      checkAuthentication();
    };
    
    window.addEventListener('storage', handleStorageChange);

    // تعيين تاريخ الميلاد الأقصى (العمر 18+)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    
    const birthDateInput = document.getElementById('birthDate');
    if (birthDateInput) {
      birthDateInput.max = maxDateStr;
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // دالة لحساب العمر
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // دالة لتحويل اليوم إلى تاريخ
  const getAppointmentDate = (dayName) => {
    const daysMap = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4
    };
    
    const today = new Date();
    const todayDay = today.getDay(); // 0: الأحد، 1: الاثنين، إلخ
    const targetDay = daysMap[dayName];
    
    // حساب الأيام المتبقية للوصول لليوم المطلوب
    let daysToAdd = targetDay - todayDay;
    if (daysToAdd <= 0) daysToAdd += 7; // إذا كان اليوم المطلوب قد مر هذا الأسبوع
    
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + daysToAdd);
    
    return appointmentDate.toISOString().split('T')[0]; // إرجاع التاريخ بصيغة YYYY-MM-DD
  };

  // معالجة تغيير الحقول
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'radio' ? e.target.value : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));

    // التحقق من المدينة المخصصة
    if (name === 'city') {
      setShowCustomCity(inputValue === 'other');
    }

    // التحقق من التدخين
    if (name === 'smoking') {
      setShowSmokingInstructions(inputValue === 'yes');
    }

    // التحقق من الأمراض المزمنة
    if (name === 'chronicDisease') {
      setShowChronicWarning(inputValue === 'yes');
    }

    // التحقق من آخر تبرع
    if (name === 'lastDonation') {
      const blockedValues = ['less-1month', '1-2months', '2-3months'];
      setShowLastDonationWarning(blockedValues.includes(inputValue));
    }

    // التحقق من الوزن
    if (name === 'weight') {
      const weight = parseInt(value);
      setShowWeightWarning(weight < 50);
    }

    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};

    // التحقق من الاسم
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الثلاثي مطلوب';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'الاسم يجب أن يكون على الأقل حرفين';
    }

    // التحقق من الهاتف
    const phoneRegex = /^(09|9)\d{8}$/;
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!phoneRegex.test(cleanedPhone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (يجب أن يبدأ بـ 09 ويتكون من 10 أرقام)';
    }

    // التحقق من رقم الهوية
    if (formData.nationalId && formData.nationalId.length !== 11) {
      newErrors.nationalId = 'رقم الهوية يجب أن يكون 11 رقماً';
    }

    // التحقق من تاريخ الميلاد
    if (!formData.birthDate) {
      newErrors.birthDate = 'تاريخ الميلاد مطلوب';
    }

    // التحقق من المدينة
    if (!formData.city) {
      newErrors.city = 'المدينة مطلوبة';
    } else if (formData.city === 'other' && !formData.customCity.trim()) {
      newErrors.customCity = 'يرجى كتابة اسم المكان';
    }

    // التحقق من فصيلة الدم
    if (!formData.bloodType) {
      newErrors.bloodType = 'فصيلة الدم مطلوبة';
    }

    // التحقق من الوزن
    const weight = parseInt(formData.weight);
    if (!formData.weight) {
      newErrors.weight = 'الوزن مطلوب';
    } else if (weight < 50) {
      newErrors.weight = 'الوزن يجب أن يكون 50 كجم على الأقل';
    } else if (weight > 200) {
      newErrors.weight = 'الرجاء التحقق من الوزن المدخل';
    }

    // التحقق من اليوم
    if (!formData.appointmentDay) {
      newErrors.appointmentDay = 'اليوم المفضل مطلوب';
    }

    // التحقق من الوقت
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'الوقت المفضل مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إعادة تعيين النموذج
  const handleReset = () => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        phone: user.phone || '',
        nationalId: '',
        birthDate: '',
        city: '',
        customCity: '',
        bloodType: user.bloodType || '',
        weight: '',
        lastDonation: '',
        chronicDisease: 'no',
        smoking: 'no',
        medicalNotes: '',
        appointmentDay: '',
        appointmentTime: ''
      });
    } else {
      setFormData({
        fullName: '',
        phone: '',
        nationalId: '',
        birthDate: '',
        city: '',
        customCity: '',
        bloodType: '',
        weight: '',
        lastDonation: '',
        chronicDisease: 'no',
        smoking: 'no',
        medicalNotes: '',
        appointmentDay: '',
        appointmentTime: ''
      });
    }
    
    setErrors({});
    setShowSmokingInstructions(false);
    setShowChronicWarning(false);
    setShowLastDonationWarning(false);
    setShowWeightWarning(false);
    setShowCustomCity(false);
  };

  // إرسال النموذج - التعديل الأساسي هنا
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 بدء عملية إرسال طلب التبرع...');
    
    // التحقق من تسجيل الدخول في جميع المفاتيح الممكنة
    const userData = 
      localStorage.getItem('currentUser') ||
      localStorage.getItem('blood_bank_current_user') ||
      localStorage.getItem('blood_bank_daraa_user') ||
      localStorage.getItem('blood_bank_user');
    
    console.log('🔐 بيانات تسجيل الدخول الموجودة:', userData);
    
    if (!userData) {
      alert('⚠️ يجب تسجيل الدخول أولاً لتسجيل التبرع');
      navigate('/login');
      return;
    }
    
    // تحليل بيانات المستخدم
    let currentUser;
    try {
      currentUser = JSON.parse(userData);
      console.log('✅ تم تحليل بيانات المستخدم:', currentUser);
    } catch (error) {
      console.error('❌ خطأ في تحليل بيانات المستخدم:', error);
      alert('⚠️ بيانات المستخدم غير صالحة. يرجى تسجيل الدخول مرة أخرى');
      navigate('/login');
      return;
    }
    
    const activeUser = currentUser;

    // التحقق من صحة البيانات
    if (!validateForm()) {
      alert('⚠️ يوجد أخطاء في النموذج. يرجى تصحيحها أولاً.');
      return;
    }

    // التحقق من موانع التبرع
    if (formData.chronicDisease === 'yes') {
      alert('🚫 لا يمكن التبرع بسبب الأمراض المزمنة. يرجى مراجعة طبيبك.');
      return;
    }

    if (showLastDonationWarning) {
      alert('⏰ لا يمكن التبرع قبل مرور 3 أشهر من آخر تبرع.');
      return;
    }

    if (showWeightWarning) {
      alert('⚖️ الوزن أقل من 50 كجم - لا يمكن التبرع.');
      return;
    }

    // التحقق من التدخين
    if (formData.smoking === 'yes') {
      const confirmSmoking = window.confirm(
        '🚬 هل توقفت عن التدخين لمدة 12 ساعة على الأقل قبل التبرع؟\n\n' +
        'تعليمات مهمة للمدخنين:\n' +
        '• توقف عن التدخين 12 ساعة قبل التبرع\n' +
        '• تجنب التدخين لمدة ساعتين بعد التبرع\n' +
        '• اشرب الكثير من الماء قبل التبرع\n\n' +
        'هل أنت متأكد من أنك توقفت عن التدخين لمدة 12 ساعة؟'
      );
      
      if (!confirmSmoking) {
        alert('يرجى اتباع تعليمات التبرع للمدخنين.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // جمع المدينة النهائية
      const finalCity = formData.city === 'other' ? formData.customCity : 
        daraaCities.find(c => c.id === formData.city)?.name || formData.city;

      // حساب العمر
      const age = calculateAge(formData.birthDate);
      
      // حساب تاريخ الموعد الحقيقي
      const appointmentDate = getAppointmentDate(formData.appointmentDay);

      // ==== بيانات الموعد للبنك ====
      const bankAppointmentData = {
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        donorId: activeUser.id || `user_${Date.now()}`,
        donorName: formData.fullName,
        donorPhone: formData.phone,
        donorNationalId: formData.nationalId || '',
        donorAge: age,
        donorCity: finalCity,
        donorBloodType: formData.bloodType,
        donorWeight: formData.weight,
        donorLastDonation: formData.lastDonation,
        donorChronicDisease: formData.chronicDisease,
        donorSmoking: formData.smoking,
        appointmentDay: formData.appointmentDay,
        appointmentDayArabic: appointmentDays.find(d => d.value === formData.appointmentDay)?.label || formData.appointmentDay,
        appointmentTime: formData.appointmentTime,
        appointmentTimeArabic: timeSlots.find(t => t.value === formData.appointmentTime)?.label || formData.appointmentTime,
        appointmentDate: appointmentDate, // التاريخ الحقيقي YYYY-MM-DD
        appointmentStatus: 'pending', // pending, confirmed, cancelled, completed
        appointmentType: 'blood_donation',
        center: 'بنك الدم المركزي - درعا',
        medicalNotes: formData.medicalNotes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        priority: formData.bloodType === 'O-' ? 'high' : 'normal' // أولوية للمانح العالمي
      };

      console.log('📋 بيانات الموعد المحفوظة:', bankAppointmentData);

      // ==== حفظ الموعد في نظام البنك ====
      // 1. المواعيد العامة (للبنك)
      const bankAppointments = JSON.parse(localStorage.getItem('blood_bank_appointments') || '[]');
      bankAppointments.push(bankAppointmentData);
      localStorage.setItem('blood_bank_appointments', JSON.stringify(bankAppointments));

      // 2. مواعيد المستخدم (للمتبرع)
      const userAppointments = JSON.parse(localStorage.getItem('user_appointments') || '[]');
      userAppointments.push({
        ...bankAppointmentData,
        userNotes: 'تم حجز الموعد بنجاح، يرجى الحضور قبل الموعد بـ 10 دقائق'
      });
      localStorage.setItem('user_appointments', JSON.stringify(userAppointments));

      // ==== بيانات التبرع للمستخدم ====
      const donationData = {
        ...formData,
        city: finalCity,
        userId: activeUser.id || `user_${Date.now()}`,
        appointmentId: bankAppointmentData.id, // ربط بالموعد
        submittedAt: new Date().toISOString(),
        status: 'pending',
        center: 'بنك الدم المركزي - درعا'
      };

      // الحصول على التبرعات السابقة وإضافة الجديدة
      const existingDonations = JSON.parse(localStorage.getItem('user_donations') || '[]');
      existingDonations.push(donationData);
      localStorage.setItem('user_donations', JSON.stringify(existingDonations));

      // تحديث بيانات المستخدم
      const updatedUser = {
        ...activeUser,
        lastDonation: new Date().toISOString(),
        bloodType: formData.bloodType !== 'unknown' ? formData.bloodType : activeUser.bloodType,
        totalDonations: (activeUser.totalDonations || 0) + 1,
        points: (activeUser.points || 0) + 50
      };
      
      // حفظ البيانات في جميع المفاتيح للتأكد من الوصول
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('blood_bank_current_user', JSON.stringify(updatedUser));
      localStorage.setItem('blood_bank_daraa_user', JSON.stringify(updatedUser));
      localStorage.setItem('blood_bank_user', JSON.stringify(updatedUser));
      
      // تحديث حالة المستخدم في المكون
      setUser(updatedUser);
      
      // إرسال حدث لتحديث المكونات الأخرى
      window.dispatchEvent(new Event('storage'));
      
      console.log('✅ تم تحديث بيانات المستخدم:', updatedUser);

      // محاكاة الإرسال
      await new Promise(resolve => setTimeout(resolve, 2000));

      // عرض رسالة النجاح مع تفاصيل الموعد
      const dayArabic = appointmentDays.find(d => d.value === formData.appointmentDay)?.label || formData.appointmentDay;
      const timeArabic = timeSlots.find(t => t.value === formData.appointmentTime)?.label || formData.appointmentTime;
      
      alert(`✅ تم تسجيل طلب التبرع بنجاح!\n\n` +
            `📅 **تفاصيل الموعد:**\n` +
            `اليوم: ${dayArabic}\n` +
            `الوقت: ${timeArabic}\n` +
            `التاريخ: ${appointmentDate}\n` +
            `المركز: بنك الدم المركزي بدرعا\n\n` +
            `📋 **تعليمات:**\n` +
            `• احضر قبل الموعد بـ 10 دقائق\n` +
            `• أحضر الهوية الشخصية\n` +
            `• لا تتناول وجبة دسمة قبل التبرع\n` +
            `• اشرب الكثير من الماء\n\n` +
            `🎉 **مبروك! حصلت على 50 نقطة**\n\n` +
            `📞 **للاستفسار:** 6778610`);

      // إعادة تعيين النموذج
      handleReset();
      
      // الانتقال إلى الصفحة الشخصية
      navigate('/profile');

    } catch (error) {
      console.error('❌ خطأ أثناء تسجيل التبرع:', error);
      alert('❌ حدث خطأ أثناء تسجيل التبرع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // إذا لم يتم التحقق من المصادقة بعد، عرض تحميل
  if (!authChecked) {
    return (
      <div className="auth-checking">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجلاً، عرض رسالة تسجيل الدخول
  if (!user) {
    return (
      <div className="donate-not-logged-in">
        <div className="login-required-card">
          <div className="card-header">
            <i className="fas fa-lock"></i>
            <h2>تسجيل الدخول مطلوب</h2>
          </div>
          
          <div className="card-body">
            <p>للتسجيل كمتبرع، يجب تسجيل الدخول أولاً إلى حسابك.</p>
            
            <div className="user-data-info">
              <h4>سيتم تعبئة البيانات التالية تلقائياً:</h4>
              <ul>
                <li><i className="fas fa-user"></i> اسمك الكامل</li>
                <li><i className="fas fa-phone"></i> رقم هاتفك</li>
                <li><i className="fas fa-tint"></i> فصيلة دمك</li>
              </ul>
            </div>
            
            <div className="auth-buttons">
              <button 
                className="btn-login"
                onClick={() => navigate('/login')}
              >
                <i className="fas fa-sign-in-alt"></i>
                تسجيل الدخول
              </button>
              
              <button 
                className="btn-register"
                onClick={() => navigate('/login?register=true')}
              >
                <i className="fas fa-user-plus"></i>
                إنشاء حساب جديد
              </button>
            </div>
            
            <div className="back-link">
              <button onClick={() => navigate('/home')}>
                <i className="fas fa-arrow-right"></i>
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // إذا كان المستخدم مسجلاً، عرض نموذج التبرع
  return (
    <div className="donate-page">
      <div className="container">
        {/* عنوان الصفحة */}
        <div className="page-header">
          <h1 className="page-title">
            <i className="fas fa-hand-holding-heart"></i>
            سجل كمتبرع في درعا
          </h1>
          <p className="page-subtitle">املأ البيانات للانضمام لمجتمع المتبرعين</p>
          
          {/* معلومات المستخدم */}
          <div className="user-welcome">
            <div className="user-info-small">
              <div className="user-avatar-mini">
                <span>{user.name?.charAt(0) || 'م'}</span>
              </div>
              <div className="user-details-mini">
                <strong>مرحباً {user.name}</strong>
                <span>فصيلة الدم: {user.bloodType || 'غير محدد'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات مهمة */}
        <div className="info-card">
          <div className="info-icon">
            <i className="fas fa-info-circle"></i>
          </div>
          <div className="info-content">
            <h3>معلومات مهمة قبل التبرع</h3>
            <ul>
              <li>التبرع فقط في <strong>بنك الدم المركزي بدرعا</strong></li>
              <li>يجب أن يكون عمرك بين 18-65 سنة</li>
              <li>الوزن يجب أن يكون 50 كجم على الأقل</li>
              <li>لا يمكن التبرع إذا كنت مصاباً بأمراض مزمنة</li>
              <li>يجب أن تمر 3 أشهر على الأقل منذ آخر تبرع</li>
            </ul>
          </div>
        </div>

        {/* نموذج التبرع */}
        <form className="donation-form" onSubmit={handleSubmit} noValidate>
          {/* القسم 1: المعلومات الشخصية */}
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-user"></i>
                البيانات الشخصية
              </h3>
              <p>معلوماتك الأساسية للتواصل معك</p>
            </div>

            <div className="form-grid">
              {/* الاسم الكامل */}
              <div className={`form-group ${errors.fullName ? 'has-error' : ''}`}>
                <label htmlFor="fullName">
                  <i className="fas fa-signature"></i>
                  الاسم الثلاثي <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="أدخل اسمك الثلاثي"
                  required
                  autoComplete="name"
                />
                {errors.fullName && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* رقم الهاتف */}
              <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i>
                  رقم الهاتف <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  required
                  pattern="[0-9]{10}"
                  autoComplete="tel"
                />
                <small>يبدأ بـ 09 ويتكون من 10 أرقام</small>
                {errors.phone && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* رقم الهوية */}
              <div className={`form-group ${errors.nationalId ? 'has-error' : ''}`}>
                <label htmlFor="nationalId">
                  <i className="fas fa-id-card"></i>
                  رقم الهوية
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="11 رقماً"
                  pattern="[0-9]{11}"
                  maxLength="11"
                />
                <small>اختياري - 11 رقماً</small>
                {errors.nationalId && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.nationalId}
                  </div>
                )}
              </div>

              {/* تاريخ الميلاد */}
              <div className={`form-group ${errors.birthDate ? 'has-error' : ''}`}>
                <label htmlFor="birthDate">
                  <i className="fas fa-birthday-cake"></i>
                  تاريخ الميلاد <span className="required-star">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  max={new Date().getFullYear() - 18 + '-12-31'}
                />
                {errors.birthDate && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.birthDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* القسم 2: الموقع */}
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-map-marker-alt"></i>
                الموقع
              </h3>
              <p>موقعك في محافظة درعا</p>
            </div>

            <div className="form-grid">
              {/* المدينة */}
              <div className={`form-group ${errors.city ? 'has-error' : ''}`}>
                <label htmlFor="city">
                  <i className="fas fa-city"></i>
                  المدينة/البلدة <span className="required-star">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">اختر مدينتك</option>
                  {daraaCities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.city}
                  </div>
                )}
              </div>
            </div>

            {/* حقل المدينة المخصصة */}
            {showCustomCity && (
              <div className={`form-group ${errors.customCity ? 'has-error' : ''}`}>
                <label htmlFor="customCity">
                  <i className="fas fa-edit"></i>
                  اكتب اسم المكان <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="customCity"
                  name="customCity"
                  value={formData.customCity}
                  onChange={handleChange}
                  placeholder="اكتب اسم قريتك أو مكان إقامتك"
                  required={showCustomCity}
                />
                {errors.customCity && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.customCity}
                  </div>
                )}
              </div>
            )}

            {/* ملاحظة الموقع */}
            <div className="location-note">
              <i className="fas fa-info-circle"></i>
              <p>
                <strong>ملاحظة:</strong> التبرع بالدم فقط في 
                <span className="highlight"> بنك الدم المركزي بدرعا </span>
                مقابل مشفى درعا الوطني
              </p>
            </div>
          </div>

          {/* القسم 3: المعلومات الصحية */}
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-heartbeat"></i>
                المعلومات الصحية
              </h3>
              <p>معلومات طبية مهمة للتبرع</p>
            </div>

            <div className="form-grid">
              {/* فصيلة الدم */}
              <div className={`form-group ${errors.bloodType ? 'has-error' : ''}`}>
                <label htmlFor="bloodType">
                  <i className="fas fa-tint"></i>
                  فصيلة الدم <span className="required-star">*</span>
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                >
                  {bloodTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <small>إذا اخترت "لا أعرف فصيلة دمي" سنفحصها عند التبرع</small>
                {errors.bloodType && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.bloodType}
                  </div>
                )}
              </div>

              {/* الوزن */}
              <div className={`form-group ${errors.weight ? 'has-error' : ''}`}>
                <label htmlFor="weight">
                  <i className="fas fa-weight"></i>
                  الوزن (كجم) <span className="required-star">*</span>
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="أدخل وزنك بالكيلوغرام"
                  min="30"
                  max="200"
                  step="0.5"
                  required
                />
                {showWeightWarning && !errors.weight && (
                  <div className="warning-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    الوزن أقل من 50 كجم - لا يمكن التبرع
                  </div>
                )}
                {errors.weight && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.weight}
                  </div>
                )}
              </div>

              {/* آخر تبرع */}
              <div className="form-group">
                <label htmlFor="lastDonation">
                  <i className="fas fa-calendar-check"></i>
                  آخر تبرع بالدم
                </label>
                <select
                  id="lastDonation"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                >
                  <option value="">اختر المدة</option>
                  <option value="never">لم أتبرع من قبل</option>
                  <option value="less-1month">أقل من شهر</option>
                  <option value="1-2months">من 1-2 شهر</option>
                  <option value="2-3months">من 2-3 أشهر</option>
                  <option value="3-6months">من 3-6 أشهر</option>
                  <option value="6-12months">من 6-12 شهر</option>
                  <option value="over-year">أكثر من سنة</option>
                </select>
                {showLastDonationWarning && (
                  <div className="warning-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    لا يمكن التبرع قبل مرور 3 أشهر من آخر تبرع
                  </div>
                )}
              </div>
            </div>

            {/* الأمراض المزمنة */}
            <div className="form-group">
              <label>
                <i className="fas fa-user-md"></i>
                هل تعاني من أمراض مزمنة؟ (السكري، أمراض القلب، ارتفاع ضغط الدم، أمراض الكلى، أمراض الكبد، الأورام السرطانية، أمراض الدم، الصرع، الأمراض المناعية، الإيدز)
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="chronicDisease"
                    value="no"
                    checked={formData.chronicDisease === 'no'}
                    onChange={handleChange}
                  />
                  <span className="radio-text">لا</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="chronicDisease"
                    value="yes"
                    checked={formData.chronicDisease === 'yes'}
                    onChange={handleChange}
                  />
                  <span className="radio-text">نعم</span>
                </label>
              </div>
              {showChronicWarning && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  الأمراض المزمنة تمنع التبرع بالدم نهائياً
                </div>
              )}
            </div>

            {/* التدخين */}
            <div className="form-group">
              <label>
                <i className="fas fa-smoking"></i>
                هل أنت مدخن؟
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="smoking"
                    value="no"
                    checked={formData.smoking === 'no'}
                    onChange={handleChange}
                  />
                  <span className="radio-text">لا</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="smoking"
                    value="yes"
                    checked={formData.smoking === 'yes'}
                    onChange={handleChange}
                  />
                  <span className="radio-text">نعم</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="smoking"
                    value="ex-smoker"
                    checked={formData.smoking === 'ex-smoker'}
                    onChange={handleChange}
                  />
                  <span className="radio-text">مدخن سابق</span>
                </label>
              </div>
              
              {showSmokingInstructions && (
                <div className="info-box">
                  <h4>
                    <i className="fas fa-info-circle"></i>
                    تعليمات مهمة للمدخنين:
                  </h4>
                  <ul>
                    <li>توقف عن التدخين لمدة <strong>12 ساعة</strong> على الأقل قبل التبرع</li>
                    <li>تجنب التدخين لمدة <strong>ساعتين</strong> بعد التبرع</li>
                    <li>اشرب الكثير من الماء قبل التبرع</li>
                    <li>تجنب الكافيين (قهوة، شاي) قبل 4 ساعات من التبرع</li>
                  </ul>
                </div>
              )}
            </div>

            {/* ملاحظات طبية */}
            <div className="form-group">
              <label htmlFor="medicalNotes">
                <i className="fas fa-sticky-note"></i>
                ملاحظات طبية أخرى (اختياري)
              </label>
              <textarea
                id="medicalNotes"
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleChange}
                placeholder="أي ملاحظات طبية إضافية (حساسية، أدوية، أمراض سابقة...)"
                rows="3"
              />
            </div>
          </div>

          {/* القسم 4: الموعد */}
          <div className="form-section">
            <div className="section-header">
              <h3>
                <i className="fas fa-calendar-alt"></i>
                تحديد الموعد
              </h3>
              <p>اختر الوقت المناسب لك للتبرع</p>
            </div>

            {/* معلومات أوقات العمل */}
            <div className="working-hours">
              <h4>
                <i className="fas fa-clock"></i>
                أوقات عمل بنك الدم
              </h4>
              <ul>
                <li>
                  <i className="fas fa-calendar-day"></i>
                  <span>الأحد - الخميس: <strong>8 ص - 2 م</strong></span>
                </li>
                <li>
                  <i className="fas fa-calendar-day"></i>
                  <span>الجمعة والسبت: <span className="closed">إجازة</span></span>
                </li>
                <li>
                  <i className="fas fa-stopwatch"></i>
                  <span>مدة الموعد: <strong>30 دقيقة</strong></span>
                </li>
              </ul>
            </div>

            <div className="form-grid">
              {/* اليوم */}
              <div className={`form-group ${errors.appointmentDay ? 'has-error' : ''}`}>
                <label htmlFor="appointmentDay">
                  <i className="fas fa-calendar-day"></i>
                  اليوم المفضل <span className="required-star">*</span>
                </label>
                <select
                  id="appointmentDay"
                  name="appointmentDay"
                  value={formData.appointmentDay}
                  onChange={handleChange}
                  required
                >
                  {appointmentDays.map(day => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                {errors.appointmentDay && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.appointmentDay}
                  </div>
                )}
              </div>

              {/* الوقت */}
              <div className={`form-group ${errors.appointmentTime ? 'has-error' : ''}`}>
                <label htmlFor="appointmentTime">
                  <i className="fas fa-clock"></i>
                  الوقت المفضل <span className="required-star">*</span>
                </label>
                <select
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.appointmentTime && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {errors.appointmentTime}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* أزرار النموذج */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <i className="fas fa-redo"></i>
              مسح النموذج
            </button>
            
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  إرسال طلب التبرع
                </>
              )}
            </button>
          </div>
        </form>

        {/* معلومات إضافية */}
        <div className="additional-info">
          <div className="info-section">
            <h3>
              <i className="fas fa-question-circle"></i>
              أسئلة شائعة
            </h3>
            <div className="faq-item">
              <h4>هل التبرع بالدم مؤلم؟</h4>
              <p>يشعر معظم المتبرعين بوخز بسيط عند إدخال الإبرة، ثم لا يشعرون بأي ألم أثناء التبرع.</p>
            </div>
            <div className="faq-item">
              <h4>كم تستغرق عملية التبرع؟</h4>
              <p>تستغرق عملية التبرع نفسها 10-15 دقيقة، بالإضافة إلى وقت التسجيل والفحص الطبي.</p>
            </div>
            <div className="faq-item">
              <h4>هل يمكنني التبرع بعد التطعيم؟</h4>
              <p>يمكن التبرع بعد معظم التطعيمات مباشرة، إلا تطعيمات معينة تحتاج إلى فترة انتظار.</p>
            </div>
          </div>

          <div className="info-section">
            <h3>
              <i className="fas fa-phone-alt"></i>
              للاستفسار
            </h3>
            <div className="contact-info">
              <p>
                <i className="fas fa-phone"></i>
                <strong>بنك الدم المركزي:</strong> 6778610
              </p>
              <p>
                <i className="fas fa-ambulance"></i>
                <strong>طوارئ:</strong> 112
              </p>
              <p>
                <i className="fas fa-envelope"></i>
                <strong>البريد الإلكتروني:</strong> bloodbank@daraa.gov.sy
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i>
                <strong>الموقع:</strong> درعا - مقابل مشفى درعا الوطني
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonatePage;