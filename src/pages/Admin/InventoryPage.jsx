/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/inventory.css';

const InventoryPage = () => {
  // بيانات المخزون - الأسعار بالليرة السورية
  const [inventory, setInventory] = useState([
    { id: 1, bloodType: 'A+', quantity: 45, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-24', price: 35000 },
    { id: 2, bloodType: 'A-', quantity: 15, minQuantity: 20, status: 'منخفض', lastUpdated: '2024-01-24', price: 40000 },
    { id: 3, bloodType: 'B+', quantity: 38, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-23', price: 35000 },
    { id: 4, bloodType: 'B-', quantity: 22, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-23', price: 40000 },
    { id: 5, bloodType: 'AB+', quantity: 12, minQuantity: 15, status: 'حرج', lastUpdated: '2024-01-22', price: 45000 },
    { id: 6, bloodType: 'AB-', quantity: 8, minQuantity: 15, status: 'حرج', lastUpdated: '2024-01-22', price: 50000 },
    { id: 7, bloodType: 'O+', quantity: 62, minQuantity: 25, status: 'ممتاز', lastUpdated: '2024-01-24', price: 30000 },
    { id: 8, bloodType: 'O-', quantity: 29, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-24', price: 42000 }
  ]);

  // بيانات الحركات - محسنة مع أنواع مختلفة
  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      type: 'إضافة مخزون', 
      bloodType: 'A+', 
      quantity: 5, 
      source: 'تبرع طوعي', 
      date: '10:30 - 2024-01-24', 
      user: 'أحمد محمد',
      icon: '🩸',
      color: '#10B981',
      status: 'مكتمل'
    },
    { 
      id: 2, 
      type: 'تبرع', 
      bloodType: 'O+', 
      quantity: 3, 
      source: 'مستشفى درعا الوطني', 
      date: '09:15 - 2024-01-24', 
      user: 'محمد أحمد',
      icon: '❤️',
      color: '#EF4444',
      status: 'مكتمل'
    },
    { 
      id: 3, 
      type: 'إضافة مخزون', 
      bloodType: 'B-', 
      quantity: 10, 
      source: 'تبرع مؤسسي', 
      date: '16:45 - 2024-01-23', 
      user: 'مشرف النظام',
      icon: '🩸',
      color: '#10B981',
      status: 'مكتمل'
    },
    { 
      id: 4, 
      type: 'نقل', 
      bloodType: 'AB+', 
      quantity: 2, 
      source: 'مستشفى الصنمين', 
      date: '14:20 - 2024-01-23', 
      user: 'سارة خالد',
      icon: '🚚',
      color: '#3B82F6',
      status: 'معلق'
    },
    { 
      id: 5, 
      type: 'تبرع', 
      bloodType: 'A-', 
      quantity: 4, 
      source: 'مستشفى الشيخ مسكين', 
      date: '11:10 - 2024-01-22', 
      user: 'مشرف النظام',
      icon: '❤️',
      color: '#EF4444',
      status: 'مكتمل'
    },
    { 
      id: 6, 
      type: 'تحديث', 
      bloodType: 'B+', 
      quantity: 8, 
      source: 'جرد روتيني', 
      date: '09:00 - 2024-01-22', 
      user: 'فريق الجودة',
      icon: '📝',
      color: '#8B5CF6',
      status: 'مكتمل'
    },
    { 
      id: 7, 
      type: 'فحص', 
      bloodType: 'O-', 
      quantity: 15, 
      source: 'مختبر الجودة', 
      date: '15:30 - 2024-01-21', 
      user: 'تقني المختبر',
      icon: '🔬',
      color: '#EC4899',
      status: 'مكتمل'
    }
  ]);

  // حالة للبحث والتصفية
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBlood, setSelectedBlood] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // بيانات النموذج
  const [newStock, setNewStock] = useState({
    bloodType: 'A+',
    quantity: 0,
    source: 'donation',
    notes: ''
  });

  // ================================================
  // 🔧 **الدوال الجديدة المضافة للربط مع صفحة البيع**
  // ================================================

  // 🔧 **الدالة 1: التحقق من توفر الكمية**
  const checkBloodAvailability = (bloodType, quantity) => {
    const bloodItem = inventory.find(item => item.bloodType === bloodType);
    
    if (!bloodItem) {
      return { 
        success: false, 
        message: `❌ فصيلة الدم ${bloodType} غير موجودة في المخزون`,
        available: false 
      };
    }
    
    if (bloodItem.quantity < quantity) {
      return { 
        success: false, 
        message: `❌ الكمية غير كافية!\nالمتاح: ${bloodItem.quantity} وحدة\nالمطلوب: ${quantity} وحدة`,
        available: false,
        availableQuantity: bloodItem.quantity
      };
    }
    
    return { 
      success: true, 
      message: `✅ الكمية متاحة`,
      available: true,
      availableQuantity: bloodItem.quantity,
      price: bloodItem.price
    };
  };

  // 🔧 **الدالة 2: خصم الكمية من المخزون**
  const deductBloodFromInventory = (bloodType, quantity) => {
    const bloodItem = inventory.find(item => item.bloodType === bloodType);
    
    if (!bloodItem) {
      return { 
        success: false, 
        message: `❌ فصيلة الدم ${bloodType} غير موجودة في المخزون` 
      };
    }
    
    if (bloodItem.quantity < quantity) {
      return { 
        success: false, 
        message: `❌ الكمية غير كافية!\nالمتاح: ${bloodItem.quantity} وحدة\nالمطلوب: ${quantity} وحدة` 
      };
    }
    
    // تحديث المخزون
    const updatedInventory = inventory.map(item => {
      if (item.bloodType === bloodType) {
        const newQuantity = item.quantity - quantity;
        const newStatus = getStatus(newQuantity, item.minQuantity);
        
        return {
          ...item,
          quantity: newQuantity,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    });
    
    setInventory(updatedInventory);
    
    // إضافة حركة الخصم
    const newTransaction = {
      id: transactions.length + 1,
      type: 'خصم للبيع',
      bloodType: bloodType,
      quantity: quantity,
      source: 'عملية بيع',
      date: `${new Date().getHours()}:${new Date().getMinutes()} - ${new Date().toISOString().split('T')[0]}`,
      user: 'نظام المبيعات',
      icon: '💰',
      color: '#EF4444',
      status: 'مكتمل'
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    return { 
      success: true, 
      message: `✅ تم خصم ${quantity} وحدة من فصيلة ${bloodType}`,
      remainingQuantity: bloodItem.quantity - quantity
    };
  };

  // 🔧 **الدالة 3: الحصول على سعر فصيلة الدم**
  const getBloodPrice = (bloodType) => {
    const bloodItem = inventory.find(item => item.bloodType === bloodType);
    return bloodItem ? bloodItem.price : 0;
  };

  // ================================================
  // 🔧 **نهاية الدوال الجديدة**
  // ================================================

  // تصفية المخزون
  const filteredInventory = inventory.filter(item => {
    if (search && !item.bloodType.includes(search)) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  // تصفية الحركات حسب الوقت
  const filteredTransactions = transactions.filter(transaction => {
    if (timeFilter === 'today') {
      return transaction.date.includes('2024-01-24');
    }
    if (timeFilter === 'week') {
      return true;
    }
    return true;
  });

  // إضافة مخزون جديد
  const handleAddStock = () => {
    if (newStock.quantity <= 0) {
      alert('يرجى إدخال كمية صحيحة');
      return;
    }

    const updatedInventory = inventory.map(item => {
      if (item.bloodType === newStock.bloodType) {
        return {
          ...item,
          quantity: item.quantity + newStock.quantity,
          lastUpdated: new Date().toISOString().split('T')[0],
          status: getStatus(item.quantity + newStock.quantity, item.minQuantity)
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    
    // إضافة الحركة
    const newTransaction = {
      id: transactions.length + 1,
      type: 'إضافة مخزون',
      bloodType: newStock.bloodType,
      quantity: newStock.quantity,
      source: getSourceLabel(newStock.source),
      date: `${new Date().getHours()}:${new Date().getMinutes()} - ${new Date().toISOString().split('T')[0]}`,
      user: 'مشرف النظام',
      icon: '🩸',
      color: '#10B981',
      status: 'مكتمل'
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowAddModal(false);
    setNewStock({ bloodType: 'A+', quantity: 0, source: 'donation', notes: '' });
    alert('تمت إضافة المخزون بنجاح');
  };

  // دوال مساعدة
  const getStatus = (quantity, minQuantity) => {
    if (quantity <= 5) return 'حرج';
    if (quantity <= minQuantity) return 'منخفض';
    if (quantity >= minQuantity * 3) return 'ممتاز';
    return 'جيد';
  };

  const getSourceLabel = (source) => {
    const sources = {
      donation: 'تبرع',
      transfer: 'نقل',
      purchase: 'شراء',
      other: 'أخرى'
    };
    return sources[source] || source;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ممتاز': return '#10B981';
      case 'جيد': return '#3B82F6';
      case 'منخفض': return '#F59E0B';
      case 'حرج': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'ممتاز': return '#D1FAE5';
      case 'جيد': return '#DBEAFE';
      case 'منخفض': return '#FEF3C7';
      case 'حرج': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  };

  // إحصائيات المخزون
  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.status === 'منخفض' || item.status === 'حرج').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const averagePrice = inventory.length > 0 ? Math.round(totalValue / totalUnits) : 0;

  return (
    <div className="inventory-page">
      <Header />
      
      <div className="inventory-container">
        {/* Header */}
        <div className="inventory-header">
          <div className="header-content">
            <div className="header-title">
              <i className="fas fa-tint header-main-icon"></i>
              <h1 className="page-title">إدارة مخزون الدم</h1>
            </div>
            <p className="page-subtitle">
              <i className="fas fa-map-marker-alt"></i>
              بنك الدم الوطني - درعا | تتبع وإدارة وحدات الدم المتاحة
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary add-stock-btn"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus-circle"></i>
              <span>إضافة مخزون</span>
            </button>
            <button className="btn btn-outline refresh-btn">
              <i className="fas fa-sync-alt"></i>
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="inventory-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1E6BD6)' }}>
              <i className="fas fa-tint"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{totalUnits}</div>
              <div className="stat-label">إجمالي الوحدات</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +12% عن الأسبوع الماضي
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{lowStockItems}</div>
              <div className="stat-label">منخفض المخزون</div>
              <div className="stat-change negative">
                <i className="fas fa-arrow-down"></i>
                -2 عن الأسبوع الماضي
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <i className="fas fa-syringe"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{inventory.length}</div>
              <div className="stat-label">فصائل الدم</div>
              <div className="stat-change neutral">
                <i className="fas fa-minus"></i>
                جميع الفصائل متاحة
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{averagePrice.toLocaleString()} ل.س</div>
              <div className="stat-label">متوسط السعر</div>
              <div className="stat-change positive">
                <i className="fas fa-arrow-up"></i>
                +5% عن الشهر الماضي
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="ابحث عن فصيلة دم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <i className="fas fa-list"></i>
              الكل
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'ممتاز' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ممتاز')}
            >
              <i className="fas fa-star"></i>
              ممتاز
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'جيد' ? 'active' : ''}`}
              onClick={() => setStatusFilter('جيد')}
            >
              <i className="fas fa-check-circle"></i>
              جيد
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'منخفض' ? 'active' : ''}`}
              onClick={() => setStatusFilter('منخفض')}
            >
              <i className="fas fa-exclamation-circle"></i>
              منخفض
            </button>
            <button 
              className={`filter-btn ${statusFilter === 'حرج' ? 'active' : ''}`}
              onClick={() => setStatusFilter('حرج')}
            >
              <i className="fas fa-skull-crossbones"></i>
              حرج
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="inventory-table-container">
          <div className="table-header">
            <h3>
              <i className="fas fa-vial"></i>
              قائمة فصائل الدم والمخزون
            </h3>
            <div className="table-summary">
              <span className="summary-text">
                <i className="fas fa-filter"></i>
                عرض {filteredInventory.length} من {inventory.length} فصيلة
              </span>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>فصيلة الدم</th>
                  <th>الكمية المتاحة</th>
                  <th>الحد الأدنى</th>
                  <th>الحالة</th>
                  <th>السعر (ل.س)</th>
                  <th>آخر تحديث</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className={`inventory-row ${item.status === 'حرج' ? 'critical-row' : ''}`}>
                    <td>
                      <div className="blood-type-cell">
                        <div 
                          className="blood-type-badge"
                          style={{ 
                            background: `linear-gradient(135deg, ${getStatusColor(item.status)} 0%, ${getStatusColor(item.status)}99 100%)`,
                          }}
                        >
                          <i className="fas fa-tint"></i>
                          <span className="blood-type">{item.bloodType}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="quantity-cell">
                        <div className="quantity-value">{item.quantity}</div>
                        <div className="quantity-unit">وحدة</div>
                      </div>
                    </td>
                    <td>
                      <div className="min-quantity">
                        <span className="min-value">{item.minQuantity}</span>
                        <span className="min-label">وحدة</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-container">
                        <div 
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusBgColor(item.status),
                            color: getStatusColor(item.status),
                          }}
                        >
                          <div className="status-dot" style={{ backgroundColor: getStatusColor(item.status) }}></div>
                          {item.status}
                        </div>
                        {item.quantity < item.minQuantity && (
                          <div className="warning-icon" title="تحت الحد الأدنى">
                            <i className="fas fa-exclamation-triangle"></i>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="price-cell">
                        <div className="price-value">{item.price.toLocaleString()}</div>
                        <div className="price-currency">ليرة سورية</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <i className="far fa-calendar-alt"></i>
                        {item.lastUpdated}
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="action-btn add-btn"
                          onClick={() => {
                            setSelectedBlood(item);
                            setNewStock({...newStock, bloodType: item.bloodType});
                            setShowAddModal(true);
                          }}
                          title="إضافة مخزون"
                        >
                          <i className="fas fa-plus"></i>
                          <span>إضافة</span>
                        </button>
                        <button 
                          className="action-btn details-btn"
                          onClick={() => {
                            // استخدام الدالة الجديدة
                            const availability = checkBloodAvailability(item.bloodType, 1);
                            alert(`تفاصيل فصيلة ${item.bloodType}:\n${item.quantity} وحدة متاحة\n${availability.message}`);
                          }}
                          title="عرض التفاصيل"
                        >
                          <i className="fas fa-eye"></i>
                          <span>تفاصيل</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions - بدون ملخص */}
        <div className="transactions-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-history"></i>
              <h3>سجل الحركات والعمليات</h3>
              <span className="badge-count">{transactions.length}</span>
            </div>
            <div className="section-actions">
              <div className="date-filter">
                <i className="fas fa-calendar-alt"></i>
                <select 
                  className="filter-select"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                >
                  <option value="all">جميع الفترات</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
              <button className="btn btn-outline view-all-btn">
                <i className="fas fa-external-link-alt"></i>
                <span>لوحة الحركات الكاملة</span>
              </button>
            </div>
          </div>
          
          <div className="transactions-timeline">
            {filteredTransactions.map((transaction, index) => (
              <div key={transaction.id} className="transaction-card">
                <div className="timeline-dot" style={{ backgroundColor: transaction.color }}></div>
                {index < filteredTransactions.length - 1 && (
                  <div className="timeline-line"></div>
                )}
                
                <div className="transaction-main">
                  <div className="transaction-header">
                    <div className="transaction-type">
                      <div className="type-icon" style={{ backgroundColor: transaction.color }}>
                        <span>{transaction.icon}</span>
                      </div>
                      <div className="type-info">
                        <span className="type-name">{transaction.type}</span>
                        <span className="type-time">
                          <i className="far fa-clock"></i>
                          {transaction.date}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <button className="action-btn print-btn" title="طباعة">
                        <i className="fas fa-print"></i>
                      </button>
                      <button className="action-btn share-btn" title="مشاركة">
                        <i className="fas fa-share-alt"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="transaction-content">
                    <div className="blood-info">
                      <div className="blood-badge" style={{ backgroundColor: getStatusColor('جيد') }}>
                        <i className="fas fa-tint"></i>
                        <span>{transaction.bloodType}</span>
                      </div>
                      <div className="quantity-info">
                        <i className="fas fa-hashtag"></i>
                        <span className="quantity-label">{transaction.quantity} وحدة</span>
                      </div>
                    </div>
                    
                    <div className="transaction-details">
                      <div className="detail-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <div className="detail-content">
                          <span className="detail-label">المصدر / الجهة</span>
                          <span className="detail-value">{transaction.source}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-user-circle"></i>
                        <div className="detail-content">
                          <span className="detail-label">المسؤول</span>
                          <span className="detail-value">{transaction.user}</span>
                        </div>
                      </div>
                      
                      <div className="detail-item">
                        <i className="fas fa-sticky-note"></i>
                        <div className="detail-content">
                          <span className="detail-label">الحالة</span>
                          <span className={`status-badge ${transaction.status === 'مكتمل' ? 'completed' : 'pending'}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal add-stock-modal">
            <div className="modal-header">
              <h3>
                <i className="fas fa-plus-circle"></i>
                إضافة مخزون جديد
              </h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <i className="fas fa-tint"></i>
                    فصيلة الدم
                  </label>
                  <select
                    value={newStock.bloodType}
                    onChange={(e) => setNewStock({...newStock, bloodType: e.target.value})}
                    className="form-input"
                  >
                    {inventory.map(item => (
                      <option key={item.bloodType} value={item.bloodType}>
                        {item.bloodType} - {item.quantity} وحدة متاحة
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-hashtag"></i>
                    الكمية
                  </label>
                  <div className="input-with-button">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newStock.quantity}
                      onChange={(e) => setNewStock({...newStock, quantity: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="أدخل الكمية"
                    />
                    <span className="input-unit">وحدة</span>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-map-marker-alt"></i>
                  المصدر
                </label>
                <select
                  value={newStock.source}
                  onChange={(e) => setNewStock({...newStock, source: e.target.value})}
                  className="form-input"
                >
                  <option value="donation">تبرع</option>
                  <option value="transfer">نقل من فرع آخر</option>
                  <option value="purchase">شراء</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-sticky-note"></i>
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={newStock.notes}
                  onChange={(e) => setNewStock({...newStock, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>
              
              {selectedBlood && (
                <div className="current-stock-info">
                  <div className="info-label">المخزون الحالي:</div>
                  <div className="info-value">
                    {selectedBlood.bloodType}: {selectedBlood.quantity} وحدة
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={handleAddStock}>
                <i className="fas fa-check"></i>
                تأكيد الإضافة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================================================
// 🔧 **تصدير الدوال للاستخدام في صفحة البيع**
// ================================================

// دالة للتحقق من توفر الدم
export const checkBloodAvailability = (bloodType, quantity) => {
  // محاكاة البيانات المخزنة (في الواقع ستكون من قاعدة بيانات)
  const mockInventory = [
    { bloodType: 'A+', quantity: 45 },
    { bloodType: 'A-', quantity: 15 },
    { bloodType: 'B+', quantity: 38 },
    { bloodType: 'B-', quantity: 22 },
    { bloodType: 'AB+', quantity: 12 },
    { bloodType: 'AB-', quantity: 8 },
    { bloodType: 'O+', quantity: 62 },
    { bloodType: 'O-', quantity: 29 }
  ];
  
  const bloodItem = mockInventory.find(item => item.bloodType === bloodType);
  
  if (!bloodItem) {
    return { 
      success: false, 
      message: `❌ فصيلة الدم ${bloodType} غير موجودة في المخزون`,
      available: false 
    };
  }
  
  if (bloodItem.quantity < quantity) {
    return { 
      success: false, 
      message: `❌ الكمية غير كافية!\nالمتاح: ${bloodItem.quantity} وحدة\nالمطلوب: ${quantity} وحدة`,
      available: false,
      availableQuantity: bloodItem.quantity
    };
  }
  
  return { 
    success: true, 
    message: `✅ الكمية متاحة`,
    available: true,
    availableQuantity: bloodItem.quantity
  };
};

// دالة لخصم الدم من المخزون
export const deductBloodFromInventory = (bloodType, quantity) => {
  // محاكاة لخصم الدم
  console.log(`خصم ${quantity} وحدة من فصيلة ${bloodType}`);
  
  return { 
    success: true, 
    message: `✅ تم خصم ${quantity} وحدة من فصيلة ${bloodType}`,
    remainingQuantity: 40 // مثال
  };
};

// دالة للحصول على سعر الدم
export const getBloodPrice = (bloodType) => {
  const prices = {
    'A+': 35000,
    'A-': 40000,
    'B+': 35000,
    'B-': 40000,
    'AB+': 45000,
    'AB-': 50000,
    'O+': 30000,
    'O-': 42000
  };
  
  return prices[bloodType] || 0;
};

export default InventoryPage;