// src/pages/Admin/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // محاكاة اتصال API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات المستخدم (للاختبار)
      const userData = {
        id: 1,
        username: formData.username,
        name: 'مدير النظام',
        email: 'admin@bloodbank.com',
        role: 'admin',
        permissions: ['dashboard', 'inventory', 'reports', 'settings'],
        lastLogin: new Date().toISOString()
      };
      
      console.log('Calling onLogin with:', userData);
      
      // استدعاء دالة تسجيل الدخول
      if (onLogin) {
        onLogin(userData);
      } else {
        console.error('onLogin function is not provided!');
      }
      
      // التوجيه إلى لوحة التحكم
      console.log('Navigating to /dashboard');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: 'اسم المستخدم أو كلمة المرور غير صحيحة' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // بيانات تسجيل الدخول للاختبار
  const testCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'manager', password: 'manager123' },
    { username: 'staff', password: 'staff123' }
  ];

  const fillTestCredentials = (index) => {
    const creds = testCredentials[index];
    setFormData(creds);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="logo">
            <div className="blood-drop">
              <span>🩸</span>
            </div>
            <div className="logo-text">
              <h1>نظام إدارة بنك الدم</h1>
              <p>National Blood Bank Management System</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="card-header">
            <h2>تسجيل الدخول</h2>
            <p>للعاملين في إدارة بنك الدم</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Error Message */}
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                اسم المستخدم
              </label>
              <div className="input-with-icon">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'has-error' : ''}`}
                  placeholder="أدخل اسم المستخدم"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <div className="input-with-icon">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'has-error' : ''}`}
                  placeholder="أدخل كلمة المرور"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="checkbox">
                <input 
                  type="checkbox" 
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                <span>تذكرني</span>
              </label>
              
              <button 
                type="button" 
                className="forgot-password"
                disabled={isLoading}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  جاري تسجيل الدخول...
                </>
              ) : 'تسجيل الدخول'}
            </button>

            {/* Test Credentials (for development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="test-credentials">
                <p className="test-title">بيانات اختبار (للتطوير فقط):</p>
                <div className="test-buttons">
                  {testCredentials.map((cred, index) => (
                    <button
                      key={index}
                      type="button"
                      className="test-btn"
                      onClick={() => fillTestCredentials(index)}
                      disabled={isLoading}
                    >
                      {cred.username}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className="info-box">
              <p className="info-title">ملاحظة هامة:</p>
              <ul className="info-list">
                <li>هذه الصفحة مخصصة للعاملين في بنك الدم فقط</li>
                <li>يجب استخدام بيانات الدخول الرسمية الممنوحة لك</li>
                <li>للاستفسارات التقنية: <strong>it@bloodbank.gov</strong></li>
              </ul>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="footer-content">
            <p className="copyright">© 2024 وزارة الصحة - نظام إدارة بنك الدم الوطني</p>
            <div className="footer-links">
              <span>الإصدار 2.1.0</span>
              <span>•</span>
              <span>آخر تحديث: نوفمبر 2024</span>
            </div>
            <div className="emergency-contact">
              <span className="emergency-icon">🚨</span>
              <span>للطوارئ: <strong>1234</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;