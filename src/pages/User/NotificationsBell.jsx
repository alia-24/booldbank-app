/* eslint-disable react-hooks/exhaustive-deps */
// src/components/User/NotificationsBell.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationsBell.css';

const NotificationsBell = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // تحميل بيانات المستخدم
    const userData = localStorage.getItem('currentUser') ||
                    localStorage.getItem('blood_bank_current_user');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }

    loadNotifications();
    
    // فحص الإشعارات الجديدة كل 30 ثانية
    const intervalId = setInterval(loadNotifications, 30000);
    
    // الاستماع لتحديثات الإشعارات
    window.addEventListener('storage', loadNotifications);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', loadNotifications);
    };
  }, []);

  const loadNotifications = () => {
    try {
      const allNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
      
      if (user) {
        // تصفية إشعارات المستخدم الحالي فقط
        const userNotifications = allNotifications.filter(
          notif => notif.userId === user.id || notif.userPhone === user.phone
        );
        
        setNotifications(userNotifications);
        
        // حساب الإشعارات غير المقروءة
        const unread = userNotifications.filter(notif => !notif.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل الإشعارات:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => {
      if (notif.id === notificationId && !notif.read) {
        return { ...notif, read: true, readAt: new Date().toISOString() };
      }
      return notif;
    });
    
    // تحديث في localStorage
    const allNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    const updatedAllNotifications = allNotifications.map(notif => {
      if (notif.id === notificationId) {
        return { ...notif, read: true, readAt: new Date().toISOString() };
      }
      return notif;
    });
    
    localStorage.setItem('user_notifications', JSON.stringify(updatedAllNotifications));
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true,
      readAt: new Date().toISOString()
    }));
    
    // تحديث في localStorage
    const allNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    const updatedAllNotifications = allNotifications.map(notif => ({
      ...notif,
      read: true,
      readAt: new Date().toISOString()
    }));
    
    localStorage.setItem('user_notifications', JSON.stringify(updatedAllNotifications));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // التنقل حسب نوع الإشعار
    switch (notification.type) {
      case 'appointment_confirmed':
      case 'appointment_cancelled':
        navigate('/appointments');
        break;
      case 'new_campaign':
        navigate('/campaigns');
        break;
      case 'points_earned':
        navigate('/profile');
        break;
      default:
        break;
    }
    
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return 'fas fa-calendar-check';
      case 'appointment_cancelled':
        return 'fas fa-calendar-times';
      case 'appointment_reminder':
        return 'fas fa-bell';
      case 'new_campaign':
        return 'fas fa-bullhorn';
      case 'points_earned':
        return 'fas fa-star';
      case 'blood_request':
        return 'fas fa-tint';
      case 'system':
        return 'fas fa-cog';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'appointment_confirmed':
        return 'success';
      case 'appointment_cancelled':
        return 'danger';
      case 'appointment_reminder':
        return 'warning';
      case 'new_campaign':
        return 'primary';
      case 'points_earned':
        return 'star';
      default:
        return 'info';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `منذ ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else if (diffDays === 1) {
      return 'أمس';
    } else if (diffDays < 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  if (!user) return null;

  return (
    <div className="notifications-container">
      {/* زر الجرس */}
      <button 
        className="notifications-bell"
        onClick={toggleDropdown}
        aria-label="الإشعارات"
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {/* القائمة المنسدلة */}
      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>الإشعارات</h4>
            <div className="header-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read"
                  onClick={markAllAsRead}
                >
                  تعيين الكل كمقروء
                </button>
              )}
              <button 
                className="close-dropdown"
                onClick={() => setShowDropdown(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <i className="fas fa-bell-slash"></i>
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'} ${getNotificationColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  <div className="notification-content">
                    <h5>{notification.title}</h5>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.read && (
                    <div className="unread-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="dropdown-footer">
            <button 
              className="view-all"
              onClick={() => {
                navigate('/notifications');
                setShowDropdown(false);
              }}
            >
              عرض جميع الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;