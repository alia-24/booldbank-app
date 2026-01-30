/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';

import '../../styles/settings.css';

const SettingsPage = () => {
  // حالة النظام (الوضع الافتراضي)
  const defaultSettings = {
    userProfile: {
      name: 'أحمد محمد',
      email: 'admin@bloodbank.com',
      phone: '0931234567',
      position: 'مدير النظام',
      department: 'الإدارة',
      avatar: 'AM',
      joinDate: '2023-01-15'
    },
    systemSettings: {
      hospitalName: 'بنك الدم الوطني - درعا',
      address: 'درعا - سوريا، شارع الشهداء',
      phone: '015123456',
      email: 'info@bloodbank-daraa.com',
      taxRate: 0,
      currency: 'SYP',
      timezone: 'Asia/Damascus',
      dateFormat: 'DD/MM/YYYY',
      autoBackup: true,
      backupTime: '02:00',
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    },
    inventorySettings: {
      lowStockThreshold: 10,
      criticalStockThreshold: 5,
      expiryWarningDays: 7,
      autoReorder: true,
      reorderQuantity: 50,
      bloodTypes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      storageTemperature: '2-6°C',
      maxStorageDays: 42
    },
    securitySettings: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      failedAttempts: 5,
      ipWhitelist: ['192.168.1.0/24'],
      auditLogging: true,
      dataEncryption: true
    },
    themeSettings: {
      mode: 'light',
      primaryColor: '#DC143C',
      secondaryColor: '#1E6BD6',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      sidebarColor: '#f8f9fa',
      fontFamily: 'Cairo'
    }
  };

  // الحالة الحالية للإعدادات
  const [userProfile, setUserProfile] = useState(defaultSettings.userProfile);
  const [systemSettings, setSystemSettings] = useState(defaultSettings.systemSettings);
  const [inventorySettings, setInventorySettings] = useState(defaultSettings.inventorySettings);
  const [securitySettings, setSecuritySettings] = useState(defaultSettings.securitySettings);
  const [themeSettings, setThemeSettings] = useState(defaultSettings.themeSettings);
  
  // حالة التبويبات
  const [activeTab, setActiveTab] = useState('general');
  
  // حالة التحميل والحفظ
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // حالة تغيير كلمة المرور
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // حالة للنماذج
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // نسخ احتياطي
  const [backupHistory, setBackupHistory] = useState([
    { id: 1, date: '2024-01-20', time: '02:00', size: '2.4 GB', type: 'تلقائي', status: 'مكتمل' },
    { id: 2, date: '2024-01-19', time: '14:30', size: '2.3 GB', type: 'يدوي', status: 'مكتمل' },
    { id: 3, date: '2024-01-18', time: '02:00', size: '2.4 GB', type: 'تلقائي', status: 'مكتمل' },
    { id: 4, date: '2024-01-17', time: '02:00', size: '2.4 GB', type: 'تلقائي', status: 'فشل' },
  ]);

  // سجل التغييرات
  const [changeLog, setChangeLog] = useState([
    { id: 1, user: 'أحمد محمد', action: 'تغيير إعدادات النظام', timestamp: '2024-01-20 10:30' },
    { id: 2, user: 'سارة علي', action: 'تحديث عتبات المخزون', timestamp: '2024-01-19 15:45' },
    { id: 3, user: 'محمد حسن', action: 'إضافة مستخدم جديد', timestamp: '2024-01-18 09:15' },
    { id: 4, user: 'أحمد محمد', action: 'تغيير إعدادات الإشعارات', timestamp: '2024-01-17 14:20' },
  ]);

  // تحميل الإعدادات من localStorage
  useEffect(() => {
    loadSettings();
  }, []);

  // تطبيق إعدادات المظهر
  useEffect(() => {
    applyThemeSettings();
  }, [themeSettings]);

  // التحقق من التغييرات
  useEffect(() => {
    checkForChanges();
  }, [userProfile, systemSettings, inventorySettings, securitySettings, themeSettings]);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('bloodBankSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setUserProfile(parsedSettings.userProfile || defaultSettings.userProfile);
        setSystemSettings(parsedSettings.systemSettings || defaultSettings.systemSettings);
        setInventorySettings(parsedSettings.inventorySettings || defaultSettings.inventorySettings);
        setSecuritySettings(parsedSettings.securitySettings || defaultSettings.securitySettings);
        setThemeSettings(parsedSettings.themeSettings || defaultSettings.themeSettings);
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      }
    }
  };

  const saveSettings = () => {
    const settingsToSave = {
      userProfile,
      systemSettings,
      inventorySettings,
      securitySettings,
      themeSettings
    };
    
    localStorage.setItem('bloodBankSettings', JSON.stringify(settingsToSave));
    
    // إضافة لسجل التغييرات
    const newChange = {
      id: changeLog.length + 1,
      user: userProfile.name,
      action: 'تحديث إعدادات النظام',
      timestamp: new Date().toLocaleString('ar-SY')
    };
    setChangeLog([newChange, ...changeLog.slice(0, 9)]);
    
    setSaveMessage('✅ تم حفظ الإعدادات بنجاح');
    setHasChanges(false);
    
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const checkForChanges = () => {
    const currentSettings = {
      userProfile,
      systemSettings,
      inventorySettings,
      securitySettings,
      themeSettings
    };
    
    const savedSettings = localStorage.getItem('bloodBankSettings');
    if (!savedSettings) {
      setHasChanges(true);
      return;
    }
    
    try {
      const parsedSettings = JSON.parse(savedSettings);
      const hasChanged = JSON.stringify(currentSettings) !== JSON.stringify(parsedSettings);
      setHasChanges(hasChanged);
    } catch (error) {
      setHasChanges(true);
    }
  };

  const applyThemeSettings = () => {
    const root = document.documentElement;
    
    // تطبيق ألوان المظهر
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    root.style.setProperty('--secondary-color', themeSettings.secondaryColor);
    root.style.setProperty('--background-color', themeSettings.backgroundColor);
    root.style.setProperty('--text-color', themeSettings.textColor);
    root.style.setProperty('--sidebar-color', themeSettings.sidebarColor);
    root.style.setProperty('--font-family', themeSettings.fontFamily);
    
    // تطبيق الوضع (فاتح/داكن)
    if (themeSettings.mode === 'dark') {
      root.style.setProperty('--background-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--sidebar-color', '#2d2d2d');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#333333');
      root.style.setProperty('--sidebar-color', '#f8f9fa');
    }
  };

  // تحديث الملف الشخصي
  const handleUpdateProfile = () => {
    if (!userProfile.name || !userProfile.email) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowProfileModal(false);
      saveSettings();
      alert('✅ تم تحديث الملف الشخصي بنجاح');
    }, 1000);
  };

  // تغيير كلمة المرور
  const handleChangePassword = () => {
    if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة');
      return;
    }

    if (passwordChange.newPassword.length < 8) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('✅ تم تغيير كلمة المرور بنجاح');
    }, 1000);
  };

  // إنشاء نسخة احتياطية
  const handleCreateBackup = () => {
    setIsLoading(true);
    
    const newBackup = {
      id: backupHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
      size: '2.5 GB',
      type: 'يدوي',
      status: 'جارٍ'
    };

    setBackupHistory([newBackup, ...backupHistory]);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowBackupModal(false);
      
      // تحديث حالة النسخة الاحتياطية
      setBackupHistory(prev => prev.map(backup => 
        backup.id === newBackup.id ? { ...backup, status: 'مكتمل' } : backup
      ));
      
      alert('✅ تم إنشاء نسخة احتياطية بنجاح');
    }, 2000);
  };

  // إعادة التعيين إلى الوضع الافتراضي
  const handleResetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
      setIsLoading(true);
      
      setTimeout(() => {
        setUserProfile(defaultSettings.userProfile);
        setSystemSettings(defaultSettings.systemSettings);
        setInventorySettings(defaultSettings.inventorySettings);
        setSecuritySettings(defaultSettings.securitySettings);
        setThemeSettings(defaultSettings.themeSettings);
        
        setIsLoading(false);
        setHasChanges(false);
        alert('✅ تم إعادة تعيين الإعدادات بنجاح');
        
        // تطبيق المظهر الافتراضي فوراً
        applyThemeSettings();
      }, 1000);
    }
  };

  // تطبيق مظهر جديد
  const applyTheme = (theme) => {
    let newThemeSettings = { ...themeSettings };
    
    switch(theme) {
      case 'light':
        newThemeSettings = {
          ...newThemeSettings,
          mode: 'light',
          primaryColor: '#DC143C',
          secondaryColor: '#1E6BD6',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          sidebarColor: '#f8f9fa'
        };
        break;
        
      case 'dark':
        newThemeSettings = {
          ...newThemeSettings,
          mode: 'dark',
          primaryColor: '#ff6b6b',
          secondaryColor: '#4dabf7',
          backgroundColor: '#1a1a1a',
          textColor: '#ffffff',
          sidebarColor: '#2d2d2d'
        };
        break;
        
      case 'blue':
        newThemeSettings = {
          ...newThemeSettings,
          mode: 'light',
          primaryColor: '#1E6BD6',
          secondaryColor: '#10B981',
          backgroundColor: '#f0f7ff',
          textColor: '#1e293b',
          sidebarColor: '#e1f0ff'
        };
        break;
    }
    
    setThemeSettings(newThemeSettings);
    setShowThemeModal(false);
    setSaveMessage(`✅ تم تطبيق المظهر ${theme === 'light' ? 'الفاتح' : theme === 'dark' ? 'الداكن' : 'الأزرق'}`);
    
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  // تطبيق مظهر مخصص
  const applyCustomTheme = () => {
    setThemeSettings({
      ...themeSettings,
      mode: document.getElementById('theme-mode').value,
      primaryColor: document.getElementById('primary-color').value,
      secondaryColor: document.getElementById('secondary-color').value,
      backgroundColor: document.getElementById('background-color').value,
      textColor: document.getElementById('text-color').value,
      sidebarColor: document.getElementById('sidebar-color').value,
      fontFamily: document.getElementById('font-family').value
    });
    
    setShowThemeModal(false);
    setSaveMessage('✅ تم تطبيق المظهر المخصص');
    
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SY');
  };

  // مكونات التبويبات
  const tabs = [
    { id: 'general', label: '⚙️ الإعدادات العامة', icon: '⚙️' },
    { id: 'profile', label: '👤 الملف الشخصي', icon: '👤' },
    { id: 'inventory', label: '🩸 إعدادات المخزون', icon: '🩸' },
    { id: 'security', label: '🔐 الأمان', icon: '🔐' },
    { id: 'notifications', label: '🔔 الإشعارات', icon: '🔔' },
    { id: 'theme', label: '🎨 المظهر', icon: '🎨' },
    { id: 'backup', label: '💾 النسخ الاحتياطي', icon: '💾' }
  ];

  return (
    <div className="settings-page">
      <Header />
      
      <div className="settings-container">
        {/* Header */}
        <div className="settings-header">
          <div>
            <h1 className="page-title">⚙️ الإعدادات</h1>
            <p className="page-subtitle">إدارة إعدادات النظام والملف الشخصي</p>
          </div>
          
          {saveMessage && (
            <div className="save-message success">
              {saveMessage}
            </div>
          )}
          
          {hasChanges && (
            <div className="save-message warning">
              ⚠️ لديك تغييرات غير محفوظة
            </div>
          )}
          
          <div className="header-actions">
            {hasChanges && (
              <button 
                className="btn btn-primary"
                onClick={saveSettings}
                disabled={isLoading}
              >
                {isLoading ? 'جارٍ الحفظ...' : '💾 حفظ التغييرات'}
              </button>
            )}
            <button 
              className="btn btn-danger"
              onClick={handleResetSettings}
              disabled={isLoading}
            >
              🔄 إعادة تعيين
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <div className="sidebar-header">
              <div className="user-profile-summary">
                <div className="user-avatar-large">
                  {userProfile.avatar}
                </div>
                <div className="user-info">
                  <div className="user-name">{userProfile.name}</div>
                  <div className="user-position">{userProfile.position}</div>
                  <div className="user-join-date">تاريخ الانضمام: {formatDate(userProfile.joinDate)}</div>
                </div>
              </div>
            </div>
            
            <div className="sidebar-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="sidebar-footer">
              <div className="system-info">
                <div className="info-item">
                  <span className="info-label">إصدار النظام:</span>
                  <span className="info-value">v2.5.1</span>
                </div>
                <div className="info-item">
                  <span className="info-label">آخر تحديث:</span>
                  <span className="info-value">2024-01-15</span>
                </div>
                <div className="info-item">
                  <span className="info-label">المظهر:</span>
                  <span className="info-value">{themeSettings.mode === 'light' ? 'فاتح' : 'داكن'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="settings-panel">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="tab-content">
                <h2 className="tab-title">⚙️ الإعدادات العامة</h2>
                
                <div className="settings-section">
                  <h3 className="section-title">معلومات المنشأة</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>اسم المنشأة *</label>
                      <input
                        type="text"
                        value={systemSettings.hospitalName}
                        onChange={(e) => setSystemSettings({...systemSettings, hospitalName: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input
                        type="tel"
                        value={systemSettings.phone}
                        onChange={(e) => setSystemSettings({...systemSettings, phone: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>العنوان</label>
                    <textarea
                      value={systemSettings.address}
                      onChange={(e) => setSystemSettings({...systemSettings, address: e.target.value})}
                      className="form-input"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={systemSettings.email}
                      onChange={(e) => setSystemSettings({...systemSettings, email: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">إعدادات النظام</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>العملة</label>
                      <select
                        value={systemSettings.currency}
                        onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
                        className="form-input"
                      >
                        <option value="SYP">ليرة سورية (SYP)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>نسبة الضريبة (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={systemSettings.taxRate}
                        onChange={(e) => setSystemSettings({...systemSettings, taxRate: parseFloat(e.target.value)})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>التوقيت الزمني</label>
                      <select
                        value={systemSettings.timezone}
                        onChange={(e) => setSystemSettings({...systemSettings, timezone: e.target.value})}
                        className="form-input"
                      >
                        <option value="Asia/Damascus">دمشق (UTC+3)</option>
                        <option value="Asia/Riyadh">الرياض (UTC+3)</option>
                        <option value="Asia/Dubai">دبي (UTC+4)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>تنسيق التاريخ</label>
                      <select
                        value={systemSettings.dateFormat}
                        onChange={(e) => setSystemSettings({...systemSettings, dateFormat: e.target.value})}
                        className="form-input"
                      >
                        <option value="DD/MM/YYYY">يوم/شهر/سنة</option>
                        <option value="YYYY-MM-DD">سنة-شهر-يوم</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={systemSettings.autoBackup}
                        onChange={(e) => setSystemSettings({...systemSettings, autoBackup: e.target.checked})}
                      />
                      <span className="checkbox-text">النسخ الاحتياطي التلقائي</span>
                    </label>
                    {systemSettings.autoBackup && (
                      <div className="checkbox-option">
                        <label>وقت النسخ الاحتياطي</label>
                        <input
                          type="time"
                          value={systemSettings.backupTime}
                          onChange={(e) => setSystemSettings({...systemSettings, backupTime: e.target.value})}
                          className="form-input"
                          style={{ width: '150px' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="tab-content">
                <h2 className="tab-title">👤 الملف الشخصي</h2>
                
                <div className="settings-section">
                  <div className="profile-header">
                    <div className="profile-avatar-section">
                      <div className="profile-avatar-large">
                        {userProfile.avatar}
                      </div>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowProfileModal(true)}
                      >
                        تغيير الصورة
                      </button>
                    </div>
                    
                    <div className="profile-info">
                      <h3 className="profile-name">{userProfile.name}</h3>
                      <p className="profile-role">{userProfile.position} • {userProfile.department}</p>
                      <div className="profile-stats">
                        <div className="stat">
                          <span className="stat-label">البريد الإلكتروني:</span>
                          <span className="stat-value">{userProfile.email}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">رقم الهاتف:</span>
                          <span className="stat-value">{userProfile.phone}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">تاريخ الانضمام:</span>
                          <span className="stat-value">{formatDate(userProfile.joinDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">معلومات الحساب</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>الاسم الكامل *</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>البريد الإلكتروني *</label>
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>المسمى الوظيفي</label>
                      <input
                        type="text"
                        value={userProfile.position}
                        onChange={(e) => setUserProfile({...userProfile, position: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>القسم</label>
                    <input
                      type="text"
                      value={userProfile.department}
                      onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">تغيير كلمة المرور</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>كلمة المرور الحالية</label>
                      <input
                        type="password"
                        value={passwordChange.currentPassword}
                        onChange={(e) => setPasswordChange({...passwordChange, currentPassword: e.target.value})}
                        className="form-input"
                        placeholder="أدخل كلمة المرور الحالية"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        value={passwordChange.newPassword}
                        onChange={(e) => setPasswordChange({...passwordChange, newPassword: e.target.value})}
                        className="form-input"
                        placeholder="8 أحرف على الأقل"
                      />
                    </div>
                    <div className="form-group">
                      <label>تأكيد كلمة المرور</label>
                      <input
                        type="password"
                        value={passwordChange.confirmPassword}
                        onChange={(e) => setPasswordChange({...passwordChange, confirmPassword: e.target.value})}
                        className="form-input"
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                    disabled={isLoading}
                  >
                    {isLoading ? 'جارٍ التغيير...' : 'تغيير كلمة المرور'}
                  </button>
                </div>
              </div>
            )}

            {/* Inventory Settings */}
            {activeTab === 'inventory' && (
              <div className="tab-content">
                <h2 className="tab-title">🩸 إعدادات المخزون</h2>
                
                <div className="settings-section">
                  <h3 className="section-title">إعدادات المخزون</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>عتبة المخزون المنخفض</label>
                      <input
                        type="number"
                        min="1"
                        value={inventorySettings.lowStockThreshold}
                        onChange={(e) => setInventorySettings({...inventorySettings, lowStockThreshold: parseInt(e.target.value)})}
                        className="form-input"
                      />
                      <p className="input-help">عدد الوحدات لتفعيل تحذير المخزون المنخفض</p>
                    </div>
                    <div className="form-group">
                      <label>عتبة المخزون الحرج</label>
                      <input
                        type="number"
                        min="1"
                        value={inventorySettings.criticalStockThreshold}
                        onChange={(e) => setInventorySettings({...inventorySettings, criticalStockThreshold: parseInt(e.target.value)})}
                        className="form-input"
                      />
                      <p className="input-help">عدد الوحدات لتفعيل تحذير المخزون الحرج</p>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>تحذير انتهاء الصلاحية (أيام)</label>
                      <input
                        type="number"
                        min="1"
                        value={inventorySettings.expiryWarningDays}
                        onChange={(e) => setInventorySettings({...inventorySettings, expiryWarningDays: parseInt(e.target.value)})}
                        className="form-input"
                      />
                      <p className="input-help">عدد الأيام قبل انتهاء الصلاحية لإرسال التحذير</p>
                    </div>
                    <div className="form-group">
                      <label>درجة حرارة التخزين</label>
                      <input
                        type="text"
                        value={inventorySettings.storageTemperature}
                        onChange={(e) => setInventorySettings({...inventorySettings, storageTemperature: e.target.value})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={inventorySettings.autoReorder}
                        onChange={(e) => setInventorySettings({...inventorySettings, autoReorder: e.target.checked})}
                      />
                      <span className="checkbox-text">إعادة الطلب التلقائي</span>
                    </label>
                    {inventorySettings.autoReorder && (
                      <div className="checkbox-option">
                        <label>كمية إعادة الطلب</label>
                        <input
                          type="number"
                          min="1"
                          value={inventorySettings.reorderQuantity}
                          onChange={(e) => setInventorySettings({...inventorySettings, reorderQuantity: parseInt(e.target.value)})}
                          className="form-input"
                          style={{ width: '150px' }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>الحد الأقصى للتخزين (أيام)</label>
                    <input
                      type="number"
                      min="1"
                      value={inventorySettings.maxStorageDays}
                      onChange={(e) => setInventorySettings({...inventorySettings, maxStorageDays: parseInt(e.target.value)})}
                      className="form-input"
                    />
                    <p className="input-help">عدد الأيام القصوى لتخزين وحدات الدم</p>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">فصائل الدم المدعومة</h3>
                  <div className="blood-types-grid">
                    {inventorySettings.bloodTypes.map(type => (
                      <div key={type} className="blood-type-tag">
                        {type}
                        <button 
                          className="remove-tag"
                          onClick={() => {
                            if (inventorySettings.bloodTypes.length > 1) {
                              setInventorySettings({
                                ...inventorySettings,
                                bloodTypes: inventorySettings.bloodTypes.filter(t => t !== type)
                              });
                            } else {
                              alert('يجب أن يكون هناك نوع دم واحد على الأقل');
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-blood-type"
                      onClick={() => {
                        const newType = prompt('أدخل فصيلة الدم الجديدة (مثال: A+, B-, etc):');
                        if (newType && !inventorySettings.bloodTypes.includes(newType)) {
                          setInventorySettings({
                            ...inventorySettings,
                            bloodTypes: [...inventorySettings.bloodTypes, newType]
                          });
                        }
                      }}
                    >
                      + إضافة فصيلة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="tab-content">
                <h2 className="tab-title">🔐 إعدادات الأمان</h2>
                
                <div className="settings-section">
                  <h3 className="section-title">مصادقة المستخدم</h3>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorAuth}
                        onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                      />
                      <span className="checkbox-text">المصادقة الثنائية (2FA)</span>
                      <span className="checkbox-help">تتطلب رمز تحقق إضافي عند تسجيل الدخول</span>
                    </label>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>مدة انتهاء الجلسة (دقائق)</label>
                      <input
                        type="number"
                        min="1"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>انتهاء صلاحية كلمة المرور (أيام)</label>
                      <input
                        type="number"
                        min="1"
                        value={securitySettings.passwordExpiry}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>محاولات تسجيل الدخول الفاشلة المسموحة</label>
                    <input
                      type="number"
                      min="1"
                      value={securitySettings.failedAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, failedAttempts: parseInt(e.target.value)})}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">إعدادات متقدمة</h3>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={securitySettings.auditLogging}
                        onChange={(e) => setSecuritySettings({...securitySettings, auditLogging: e.target.checked})}
                      />
                      <span className="checkbox-text">سجل التدقيق (Audit Log)</span>
                      <span className="checkbox-help">تسجيل جميع الأنشطة في النظام</span>
                    </label>
                  </div>
                  
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={securitySettings.dataEncryption}
                        onChange={(e) => setSecuritySettings({...securitySettings, dataEncryption: e.target.checked})}
                      />
                      <span className="checkbox-text">تشفير البيانات</span>
                      <span className="checkbox-help">تشفير البيانات الحساسة في قاعدة البيانات</span>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>القائمة البيضاء لعناوين IP</label>
                    <textarea
                      value={securitySettings.ipWhitelist.join('\n')}
                      onChange={(e) => setSecuritySettings({
                        ...securitySettings,
                        ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                      })}
                      className="form-input"
                      rows="4"
                      placeholder="أدخل عنوان IP واحد في كل سطر&#10;مثال: 192.168.1.0/24&#10;10.0.0.0/8"
                    />
                    <p className="input-help">عنوان IP أو نطاق IP المسموح بالوصول للنظام</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h2 className="tab-title">🔔 إعدادات الإشعارات</h2>
                
                <div className="settings-section">
                  <h3 className="section-title">قنوات الإشعارات</h3>
                  <div className="notification-channels">
                    <div className="channel-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={systemSettings.notifications.email}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            notifications: {...systemSettings.notifications, email: e.target.checked}
                          })}
                        />
                        <span className="checkbox-text">📧 البريد الإلكتروني</span>
                      </label>
                      <div className="channel-help">إرسال الإشعارات إلى بريدك الإلكتروني</div>
                    </div>
                    
                    <div className="channel-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={systemSettings.notifications.sms}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            notifications: {...systemSettings.notifications, sms: e.target.checked}
                          })}
                        />
                        <span className="checkbox-text">📱 رسائل SMS</span>
                      </label>
                      <div className="channel-help">إرسال إشعارات نصية إلى هاتفك</div>
                    </div>
                    
                    <div className="channel-item">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={systemSettings.notifications.push}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            notifications: {...systemSettings.notifications, push: e.target.checked}
                          })}
                        />
                        <span className="checkbox-text">🔔 إشعارات التطبيق</span>
                      </label>
                      <div className="channel-help">إشعارات داخل التطبيق</div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">أنواع الإشعارات</h3>
                  <div className="notification-types">
                    <div className="notification-type">
                      <div className="type-header">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkbox-text">🩸 تحذيرات المخزون</span>
                        </label>
                      </div>
                      <div className="type-description">
                        إشعارات عند وصول المخزون لمستويات منخفضة أو حرجة
                      </div>
                    </div>
                    
                    <div className="notification-type">
                      <div className="type-header">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkbox-text">📅 مواعيد التبرع</span>
                        </label>
                      </div>
                      <div className="type-description">
                        تذكير بمواعيد التبرع القادمة والمؤكدة
                      </div>
                    </div>
                    
                    <div className="notification-type">
                      <div className="type-header">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkbox-text">💰 المبيعات والمدفوعات</span>
                        </label>
                      </div>
                      <div className="type-description">
                        إشعارات بالمبيعات الجديدة والمدفوعات المستحقة
                      </div>
                    </div>
                    
                    <div className="notification-type">
                      <div className="type-header">
                        <label className="checkbox-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkbox-text">⚠️ تنبيهات النظام</span>
                        </label>
                      </div>
                      <div className="type-description">
                        إشعارات بأخطاء النظام والصيانة المجدولة
                      </div>
                    </div>
                    
                    <div className="notification-type">
                      <div className="type-header">
                        <label className="checkbox-label">
                          <input type="checkbox" />
                          <span className="checkbox-text">📊 التقارير الدورية</span>
                        </label>
                      </div>
                      <div className="type-description">
                        إرسال التقارير اليومية والأسبوعية والشهرية
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">جدولة الإشعارات</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>وقت الإشعارات اليومية</label>
                      <input
                        type="time"
                        className="form-input"
                        defaultValue="09:00"
                      />
                      <p className="input-help">وقت إرسال الإشعارات اليومية والتقارير</p>
                    </div>
                    <div className="form-group">
                      <label>تذكير المواعيد قبل (ساعات)</label>
                      <input
                        type="number"
                        min="1"
                        max="48"
                        className="form-input"
                        defaultValue="24"
                      />
                      <p className="input-help">عدد الساعات قبل الموعد لإرسال التذكير</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="tab-content">
                <h2 className="tab-title">🎨 إعدادات المظهر</h2>
                
                <div className="settings-section">
                  <h3 className="section-title">المظهر الحالي</h3>
                  <div className="current-theme">
                    <div className="theme-preview-large" style={{
                      background: themeSettings.backgroundColor,
                      color: themeSettings.textColor,
                      borderColor: themeSettings.primaryColor
                    }}>
                      <div className="preview-header" style={{ background: themeSettings.primaryColor }}></div>
                      <div className="preview-sidebar" style={{ background: themeSettings.sidebarColor }}></div>
                      <div className="preview-content">
                        <div className="preview-text" style={{ color: themeSettings.textColor }}>
                          عينة من المظهر الحالي
                        </div>
                        <button className="preview-btn" style={{
                          background: themeSettings.secondaryColor,
                          color: 'white'
                        }}>
                          زر تجريبي
                        </button>
                      </div>
                    </div>
                    
                    <div className="theme-info">
                      <div className="info-row">
                        <span className="info-label">الوضع:</span>
                        <span className="info-value">{themeSettings.mode === 'light' ? 'فاتح' : 'داكن'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">اللون الرئيسي:</span>
                        <span className="info-value" style={{ color: themeSettings.primaryColor }}>
                          ■ {themeSettings.primaryColor}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">اللون الثانوي:</span>
                        <span className="info-value" style={{ color: themeSettings.secondaryColor }}>
                          ■ {themeSettings.secondaryColor}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">خط النص:</span>
                        <span className="info-value">{themeSettings.fontFamily}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">مظاهر جاهزة</h3>
                  <div className="theme-presets">
                    <div className="theme-preset" onClick={() => applyTheme('light')}>
                      <div className="preset-preview light">
                        <div className="preset-header" style={{ background: '#DC143C' }}></div>
                        <div className="preset-sidebar" style={{ background: '#f8f9fa' }}></div>
                        <div className="preset-content" style={{ background: '#ffffff' }}></div>
                      </div>
                      <div className="preset-name">فاتح (افتراضي)</div>
                      <div className="preset-colors">
                        <span className="color-dot" style={{ background: '#DC143C' }}></span>
                        <span className="color-dot" style={{ background: '#1E6BD6' }}></span>
                        <span className="color-dot" style={{ background: '#ffffff' }}></span>
                      </div>
                    </div>
                    
                    <div className="theme-preset" onClick={() => applyTheme('dark')}>
                      <div className="preset-preview dark">
                        <div className="preset-header" style={{ background: '#ff6b6b' }}></div>
                        <div className="preset-sidebar" style={{ background: '#2d2d2d' }}></div>
                        <div className="preset-content" style={{ background: '#1a1a1a' }}></div>
                      </div>
                      <div className="preset-name">داكن</div>
                      <div className="preset-colors">
                        <span className="color-dot" style={{ background: '#ff6b6b' }}></span>
                        <span className="color-dot" style={{ background: '#4dabf7' }}></span>
                        <span className="color-dot" style={{ background: '#1a1a1a' }}></span>
                      </div>
                    </div>
                    
                    <div className="theme-preset" onClick={() => applyTheme('blue')}>
                      <div className="preset-preview blue">
                        <div className="preset-header" style={{ background: '#1E6BD6' }}></div>
                        <div className="preset-sidebar" style={{ background: '#e1f0ff' }}></div>
                        <div className="preset-content" style={{ background: '#f0f7ff' }}></div>
                      </div>
                      <div className="preset-name">أزرق</div>
                      <div className="preset-colors">
                        <span className="color-dot" style={{ background: '#1E6BD6' }}></span>
                        <span className="color-dot" style={{ background: '#10B981' }}></span>
                        <span className="color-dot" style={{ background: '#f0f7ff' }}></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">تخصيص المظهر</h3>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowThemeModal(true)}
                  >
                    🎨 فتح محرر المظهر
                  </button>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="tab-content">
                <h2 className="tab-title">💾 النسخ الاحتياطي</h2>
                
                <div className="settings-section">
                  <div className="backup-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowBackupModal(true)}
                    >
                      💾 إنشاء نسخة احتياطية الآن
                    </button>
                  </div>
                  
                  <div className="backup-info">
                    <div className="info-card">
                      <div className="info-icon">💾</div>
                      <div className="info-content">
                        <div className="info-title">مساحة التخزين</div>
                        <div className="info-value">2.5 GB / 10 GB</div>
                        <div className="info-progress">
                          <div className="progress-bar" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">📅</div>
                      <div className="info-content">
                        <div className="info-title">آخر نسخة احتياطية</div>
                        <div className="info-value">20 يناير 2024</div>
                        <div className="info-sub">الساعة 02:00 صباحاً</div>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <div className="info-icon">⚙️</div>
                      <div className="info-content">
                        <div className="info-title">النسخ التلقائي</div>
                        <div className="info-value">{systemSettings.autoBackup ? 'مفعل' : 'معطل'}</div>
                        <div className="info-sub">يومياً الساعة {systemSettings.backupTime}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-section">
                  <h3 className="section-title">سجل النسخ الاحتياطي</h3>
                  <div className="backup-history">
                    <table className="backup-table">
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الوقت</th>
                          <th>الحجم</th>
                          <th>النوع</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {backupHistory.map(backup => (
                          <tr key={backup.id}>
                            <td>{formatDate(backup.date)}</td>
                            <td>{backup.time}</td>
                            <td>{backup.size}</td>
                            <td>
                              <span className={`backup-type ${backup.type === 'تلقائي' ? 'auto' : 'manual'}`}>
                                {backup.type}
                              </span>
                            </td>
                            <td>
                              <span className={`backup-status ${backup.status}`}>
                                {backup.status === 'مكتمل' ? '✅' : 
                                 backup.status === 'جارٍ' ? '🔄' : '❌'}
                                {backup.status}
                              </span>
                            </td>
                            <td>
                              <div className="backup-actions-cell">
                                <button className="action-btn" title="استعادة">
                                  🔄
                                </button>
                                <button className="action-btn" title="تحميل">
                                  📥
                                </button>
                                <button className="action-btn" title="حذف">
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

                <div className="settings-section">
                  <h3 className="section-title">سجل التغييرات</h3>
                  <div className="change-log">
                    {changeLog.map(change => (
                      <div key={change.id} className="change-item">
                        <div className="change-icon">📝</div>
                        <div className="change-content">
                          <div className="change-action">{change.action}</div>
                          <div className="change-details">
                            <span className="change-user">بواسطة {change.user}</span>
                            <span className="change-time">• {change.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>تغيير صورة الملف الشخصي</h3>
              <button className="close-btn" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  <div className="preview-large">
                    {userProfile.avatar}
                  </div>
                </div>
                
                <div className="avatar-colors">
                  <h4>اختر لون الخلفية:</h4>
                  <div className="color-options">
                    {['#DC143C', '#1E6BD6', '#10B981', '#8B5CF6', '#F59E0B'].map(color => (
                      <button
                        key={color}
                        className="color-option"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const newAvatar = userProfile.avatar;
                          setUserProfile({...userProfile, avatar: newAvatar});
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={handleUpdateProfile}>
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>💾 إنشاء نسخة احتياطية</h3>
              <button className="close-btn" onClick={() => setShowBackupModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="backup-options">
                <div className="backup-option">
                  <label className="radio-label">
                    <input type="radio" name="backup-type" defaultChecked />
                    <span className="radio-text">نسخة احتياطية كاملة</span>
                  </label>
                  <div className="option-description">
                    نسخ جميع البيانات بما في ذلك المستخدمين، المخزون، المبيعات، والتقارير
                  </div>
                </div>
              </div>
              
              <div className="backup-estimate">
                <h4>التقدير:</h4>
                <div className="estimate-details">
                  <div className="detail">
                    <span>الحجم المقدر:</span>
                    <span>2.5 GB</span>
                  </div>
                  <div className="detail">
                    <span>الوقت المقدر:</span>
                    <span>2-3 دقائق</span>
                  </div>
                  <div className="detail">
                    <span>آخر نسخة:</span>
                    <span>20 يناير 2024</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowBackupModal(false)}>
                إلغاء
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreateBackup}
                disabled={isLoading}
              >
                {isLoading ? 'جارٍ إنشاء النسخة...' : 'بدء النسخ الاحتياطي'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {showThemeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>🎨 تخصيص المظهر</h3>
              <button className="close-btn" onClick={() => setShowThemeModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="theme-editor">
                <div className="editor-section">
                  <h4>الوضع الأساسي</h4>
                  <select 
                    id="theme-mode" 
                    className="form-input"
                    defaultValue={themeSettings.mode}
                  >
                    <option value="light">فاتح</option>
                    <option value="dark">داكن</option>
                  </select>
                </div>
                
                <div className="editor-section">
                  <h4>الألوان</h4>
                  <div className="color-pickers">
                    <div className="color-picker">
                      <label>اللون الرئيسي</label>
                      <input 
                        id="primary-color" 
                        type="color" 
                        defaultValue={themeSettings.primaryColor} 
                      />
                      <span className="color-value">{themeSettings.primaryColor}</span>
                    </div>
                    <div className="color-picker">
                      <label>اللون الثانوي</label>
                      <input 
                        id="secondary-color" 
                        type="color" 
                        defaultValue={themeSettings.secondaryColor} 
                      />
                      <span className="color-value">{themeSettings.secondaryColor}</span>
                    </div>
                    <div className="color-picker">
                      <label>لون الخلفية</label>
                      <input 
                        id="background-color" 
                        type="color" 
                        defaultValue={themeSettings.backgroundColor} 
                      />
                      <span className="color-value">{themeSettings.backgroundColor}</span>
                    </div>
                    <div className="color-picker">
                      <label>لون النص</label>
                      <input 
                        id="text-color" 
                        type="color" 
                        defaultValue={themeSettings.textColor} 
                      />
                      <span className="color-value">{themeSettings.textColor}</span>
                    </div>
                    <div className="color-picker">
                      <label>لون الشريط الجانبي</label>
                      <input 
                        id="sidebar-color" 
                        type="color" 
                        defaultValue={themeSettings.sidebarColor} 
                      />
                      <span className="color-value">{themeSettings.sidebarColor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="editor-section">
                  <h4>خط النص</h4>
                  <select 
                    id="font-family" 
                    className="form-input"
                    defaultValue={themeSettings.fontFamily}
                  >
                    <option value="Cairo">Cairo (عربي)</option>
                    <option value="Arial">Arial</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="'Segoe UI'">Segoe UI</option>
                  </select>
                </div>
                
                <div className="theme-preview-editor" style={{
                  background: document.getElementById('background-color')?.value || themeSettings.backgroundColor,
                  color: document.getElementById('text-color')?.value || themeSettings.textColor
                }}>
                  <div className="preview-header" style={{ 
                    background: document.getElementById('primary-color')?.value || themeSettings.primaryColor 
                  }}></div>
                  <div className="preview-sidebar" style={{ 
                    background: document.getElementById('sidebar-color')?.value || themeSettings.sidebarColor 
                  }}></div>
                  <div className="preview-content">
                    <div className="preview-text">عينة من المظهر المخصص</div>
                    <button className="preview-btn" style={{
                      background: document.getElementById('secondary-color')?.value || themeSettings.secondaryColor,
                      color: 'white'
                    }}>زر تجريبي</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowThemeModal(false)}>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={applyCustomTheme}>
                تطبيق المظهر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;