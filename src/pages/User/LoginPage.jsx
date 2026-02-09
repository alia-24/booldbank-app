// src/pages/User/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodType: ''
  });
  
  // أخطاء
  const [errors, setErrors] = useState({});
  
  // بيانات تسجيل الدخول
  const [loginData, setLoginData] = useState({
    phone: '',
    password: ''
  });

  // تغيير وضع النموذج
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e, isLoginForm = false) => {
    const { name, value } = e.target;
    
    if (isLoginForm) {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors = {};
    
    if (isLogin) {
      if (!loginData.phone.trim()) {
        newErrors.phone = 'رقم الهاتف مطلوب';
      } else if (!/^09\d{8}$/.test(loginData.phone)) {
        newErrors.phone = 'رقم هاتف غير صحيح';
      }
      
      if (!loginData.password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'الاسم مطلوب';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'رقم الهاتف مطلوب';
      } else if (!/^09\d{8}$/.test(formData.phone)) {
        newErrors.phone = 'رقم هاتف غير صحيح';
      }
      
      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (formData.password.length < 6) {
        newErrors.password = 'كلمة المرور قصيرة جداً';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تسجيل الدخول
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      try {
        // محاكاة قاعدة بيانات
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => 
          u.phone === loginData.phone && u.password === loginData.password
        );
        
        if (!user) {
          setErrors({ phone: 'رقم الهاتف أو كلمة المرور غير صحيحة' });
          setLoading(false);
          return;
        }
        
        // إنشاء بيانات المستخدم
        const userData = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          bloodType: user.bloodType,
          points: user.points || 0
        };
        
        console.log('✅ تسجيل دخول ناجح:', userData);
        
        // استدعاء دالة تسجيل الدخول
        if (onLogin) {
          onLogin(userData);
        }
        
        // الانتقال للصفحة الرئيسية
        navigate('/home');
        
      } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        setErrors({ phone: 'حدث خطأ، حاول مرة أخرى' });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // معالجة التسجيل
  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    setTimeout(() => {
      try {
        // التحقق من عدم وجود مستخدم بنفس الرقم
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.phone === formData.phone);
        
        if (existingUser) {
          setErrors({ phone: 'هذا الرقم مسجل مسبقاً' });
          setLoading(false);
          return;
        }
        
        // إنشاء مستخدم جديد
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          bloodType: formData.bloodType || 'غير محدد',
          points: 100, // نقاط ترحيبية
          createdAt: new Date().toISOString(),
          donations: 0
        };
        
        // حفظ المستخدم
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // إنشاء بيانات المستخدم
        const userData = {
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          bloodType: newUser.bloodType,
          points: newUser.points
        };
        
        console.log('✅ تسجيل ناجح:', userData);
        
        // استدعاء دالة تسجيل الدخول
        if (onLogin) {
          onLogin(userData);
        }
        
        // الانتقال للصفحة الرئيسية
        navigate('/home');
        
      } catch (error) {
        console.error('❌ خطأ في التسجيل:', error);
        setErrors({ phone: 'حدث خطأ، حاول مرة أخرى' });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // معالجة النموذج
  const handleSubmit = (e) => {
    if (isLogin) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="logo">
          <i className="fas fa-heartbeat"></i>
          <h1>بنك الدم - درعا</h1>
        </div>
        <p className="welcome-text">
          {isLogin ? 'مرحباً بعودتك!' : 'انضم إلى مجتمع المتبرعين'}
        </p>
      </div>

      <div className="login-form-container">
        <div className="tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            تسجيل الدخول
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>الاسم الكامل</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange(e)}
                placeholder="أدخل اسمك الكامل"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label>رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              value={isLogin ? loginData.phone : formData.phone}
              onChange={(e) => handleInputChange(e, isLogin)}
              placeholder="09XXXXXXXX"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={isLogin ? loginData.password : formData.password}
              onChange={(e) => handleInputChange(e, isLogin)}
              placeholder="أدخل كلمة المرور"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>تأكيد كلمة المرور</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="أعد إدخال كلمة المرور"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="form-group">
                <label>فصيلة الدم (اختياري)</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange(e)}
                >
                  <option value="">اختر فصيلة الدم</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </>
          )}

          {isLogin && (
            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>تذكرني</span>
              </label>
              <button type="button" className="forgot-password">
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {isLogin ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...'}
              </>
            ) : (
              isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
            )}
          </button>

          <div className="switch-mode">
            <p>
              {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
              <button type="button" onClick={toggleMode}>
                {isLogin ? 'أنشئ حساباً' : 'سجل دخولك'}
              </button>
            </p>
          </div>
        </form>
      </div>

      <div className="login-footer">
        <p>© 2024 بنك الدم المركزي - درعا. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
};

export default LoginPage;