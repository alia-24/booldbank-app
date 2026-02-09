// src/services/notificationService.js
export const notificationService = {
  // إنشاء إشعار جديد
  createNotification: (notificationData) => {
    const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
      readAt: null
    };
    
    notifications.unshift(notification);
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
    
    // إرسال حدث لتحديث المكونات
    window.dispatchEvent(new Event('storage'));
    
    // إشعار متصفح (إذا كان مسموحاً)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png'
      });
    }
    
    return notification;
  },

  // إشعار تأكيد الموعد
  appointmentConfirmed: (appointmentData, userId, userPhone) => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'appointment_confirmed',
      title: 'تم تأكيد موعدك للتبرع',
      message: `تم تأكيد موعدك للتبرع بتاريخ ${appointmentData.appointmentDate} الساعة ${appointmentData.appointmentTime}`,
      appointmentId: appointmentData.id,
      appointmentDate: appointmentData.appointmentDate
    });
  },

  // إشعار إلغاء الموعد
  appointmentCancelled: (appointmentData, userId, userPhone, reason = '') => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'appointment_cancelled',
      title: 'تم إلغاء موعد التبرع',
      message: `تم إلغاء موعد التبرع المقرر بتاريخ ${appointmentData.appointmentDate} ${reason ? ` بسبب: ${reason}` : ''}`,
      appointmentId: appointmentData.id,
      appointmentDate: appointmentData.appointmentDate,
      reason
    });
  },

  // إشعار تذكير بالموعد
  appointmentReminder: (appointmentData, userId, userPhone) => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'appointment_reminder',
      title: 'تذكير بموعد التبرع',
      message: `لديك موعد تبرع غداً ${appointmentData.appointmentDate} الساعة ${appointmentData.appointmentTime}. يرجى الحضور قبل الموعد بـ 10 دقائق`,
      appointmentId: appointmentData.id,
      appointmentDate: appointmentData.appointmentDate
    });
  },

  // إشعار حملة جديدة
  newCampaign: (campaignData, userId, userPhone) => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'new_campaign',
      title: 'حملة تبرع جديدة',
      message: `حملة ${campaignData.title} - ${campaignData.description}`,
      campaignId: campaignData.id
    });
  },

  // إشعار نقاط مكتسبة
  pointsEarned: (points, userId, userPhone, reason) => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'points_earned',
      title: 'مبروك! حصلت على نقاط جديدة',
      message: `حصلت على ${points} نقطة ${reason ? ` بسبب: ${reason}` : ''}`,
      points
    });
  },

  // طلب دم عاجل
  bloodRequest: (requestData, userId, userPhone) => {
    return notificationService.createNotification({
      userId,
      userPhone,
      type: 'blood_request',
      title: 'طلب دم عاجل',
      message: `طلب عاجل لفصيلة ${requestData.bloodType} في ${requestData.hospital}`,
      bloodType: requestData.bloodType,
      hospital: requestData.hospital
    });
  },

  // تعيين طلب الإذن للإشعارات
  requestPermission: () => {
    if ('Notification' in window) {
      return Notification.requestPermission();
    }
    return Promise.resolve('default');
  },

  // مسح الإشعارات القديمة
  cleanupOldNotifications: (days = 30) => {
    const notifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filteredNotifications = notifications.filter(notif => 
      new Date(notif.createdAt) > cutoffDate
    );
    
    localStorage.setItem('user_notifications', JSON.stringify(filteredNotifications));
  }
};