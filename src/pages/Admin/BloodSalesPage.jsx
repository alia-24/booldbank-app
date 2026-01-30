/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/blood-sales.css';

const BloodSalesPage = () => {
  // قائمة مستشفيات درعا
  const hospitals = [
    'مستشفى درعا الوطني',
    'مستشفى الصنمين',
    'مستشفى الشيخ مسكين',
    'مستشفى ازرع',
    'مستشفى النزهة',
    'مستشفى الهضاب',
    'مستشفى الأمل',
    'مستشفى السلام',
    'مستشفى الرحمة',
    'مستشفى الحكمة',
    'مستشفى الرعاية',
    'مستشفى الشفاء',
    'مركز درعا الطبي',
    'مستشفى الأطفال',
    'مستشفى الولادة'
  ];

  // بيانات مخزون الدم الحقيقي (ستأتي من Firebase)
  const initialBloodInventory = {
    'A+': 45,
    'A-': 15,
    'B+': 38,
    'B-': 22,
    'AB+': 12,
    'AB-': 8,
    'O+': 62,
    'O-': 29
  };

  // حالة المخزون
  const [bloodInventory, setBloodInventory] = useState(initialBloodInventory);

  // بيانات مبيعات الدم
  const [sales, setSales] = useState([
    {
      id: 'SALE001',
      invoiceNo: 'INV-2024-001',
      customerName: 'مستشفى درعا الوطني',
      customerType: 'مستشفى حكومي',
      date: '2024-01-20',
      time: '10:30',
      bloodType: 'A+',
      quantity: 5,
      unit: 'وحدة',
      unitPrice: 35000,
      discount: 0,
      tax: 0,
      totalAmount: 175000,
      paymentMethod: 'تحويل بنكي',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'أحمد محمود',
      notes: 'طلب عاجل للعمليات'
    },
    {
      id: 'SALE002',
      invoiceNo: 'INV-2024-002',
      customerName: 'مستشفى الصنمين',
      customerType: 'مستشفى حكومي',
      date: '2024-01-19',
      time: '14:45',
      bloodType: 'O-',
      quantity: 3,
      unit: 'وحدة',
      unitPrice: 40000,
      discount: 0,
      tax: 0,
      totalAmount: 120000,
      paymentMethod: 'نقدي',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'سارة علي',
      notes: 'طلب روتيني'
    },
    {
      id: 'SALE003',
      invoiceNo: 'INV-2024-003',
      customerName: 'مستشفى الشيخ مسكين',
      customerType: 'مستشفى حكومي',
      date: '2024-01-18',
      time: '11:15',
      bloodType: 'B+',
      quantity: 8,
      unit: 'وحدة',
      unitPrice: 35000,
      discount: 5000,
      tax: 0,
      totalAmount: 275000,
      paymentMethod: 'شيك',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'قيد التسليم',
      salesPerson: 'محمد حسن',
      notes: 'طلب كبير للعمليات القادمة'
    },
    {
      id: 'SALE004',
      invoiceNo: 'INV-2024-004',
      customerName: 'مستشفى ازرع',
      customerType: 'مستشفى حكومي',
      date: '2024-01-17',
      time: '09:00',
      bloodType: 'AB+',
      quantity: 2,
      unit: 'وحدة',
      unitPrice: 45000,
      discount: 0,
      tax: 0,
      totalAmount: 90000,
      paymentMethod: 'تحويل بنكي',
      paymentStatus: 'مدفوع جزئياً',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'خالد إبراهيم',
      notes: 'طلب خاص'
    }
  ]);

  // حالة للنموذج الجديد
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [newSale, setNewSale] = useState({
    customerName: 'مستشفى درعا الوطني',
    customerType: 'مستشفى حكومي',
    bloodType: 'A+',
    quantity: 1,
    unitPrice: 35000,
    discount: 0,
    paymentMethod: 'نقدي',
    deliveryAddress: '',
    notes: ''
  });

  // حالة للبحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('الكل');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('الكل');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('الكل');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // إحصائيات المبيعات
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    averageSale: 0,
    topBloodType: ''
  });

  // تحديث الإحصائيات
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      todayRevenue: sales
        .filter(sale => sale.date === today)
        .reduce((sum, sale) => sum + sale.totalAmount, 0),
      pendingPayments: sales
        .filter(sale => sale.paymentStatus === 'غير مدفوع' || sale.paymentStatus === 'مدفوع جزئياً')
        .reduce((sum, sale) => sum + sale.totalAmount, 0),
      averageSale: sales.length > 0 ? 
        Math.round(sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length) : 0
    };
    
    // حساب أكثر فصيلة دم مطلوبة
    const bloodTypeCounts = {};
    sales.forEach(sale => {
      bloodTypeCounts[sale.bloodType] = (bloodTypeCounts[sale.bloodType] || 0) + sale.quantity;
    });
    
    const topBloodType = Object.keys(bloodTypeCounts).reduce((a, b) => 
      bloodTypeCounts[a] > bloodTypeCounts[b] ? a : b, '');
    
    stats.topBloodType = topBloodType;
    setSalesStats(stats);
  }, [sales]);

  // تصفية المبيعات
  const filteredSales = sales.filter(sale => {
    // البحث
    if (searchTerm && !sale.customerName.includes(searchTerm) && !sale.invoiceNo.includes(searchTerm)) {
      return false;
    }
    
    // تصفية نوع العميل
    if (customerTypeFilter !== 'الكل' && sale.customerType !== customerTypeFilter) {
      return false;
    }
    
    // تصفية فصيلة الدم
    if (bloodTypeFilter !== 'الكل' && sale.bloodType !== bloodTypeFilter) {
      return false;
    }
    
    // تصفية حالة الدفع
    if (paymentStatusFilter !== 'الكل' && sale.paymentStatus !== paymentStatusFilter) {
      return false;
    }
    
    // تصفية النطاق الزمني
    if (dateFromFilter && sale.date < dateFromFilter) {
      return false;
    }
    
    if (dateToFilter && sale.date > dateToFilter) {
      return false;
    }
    
    return true;
  });

  // فصائل الدم
  const bloodTypes = ['الكل', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // حالات الدفع
  const paymentStatuses = ['الكل', 'مدفوع', 'غير مدفوع', 'مدفوع جزئياً'];

  // طرق الدفع
  const paymentMethods = ['نقدي', 'تحويل بنكي', 'شيك'];

  // دالة التحقق من المخزون قبل البيع
  const checkBloodStock = (bloodType, quantity) => {
    const currentStock = bloodInventory[bloodType];
    
    if (currentStock === undefined) {
      return {
        success: false,
        message: '❌ فصيلة الدم غير موجودة في المخزون'
      };
    }
    
    if (currentStock <= 0) {
      return {
        success: false,
        message: `❌ فصيلة الدم ${bloodType} غير متاحة في المخزون`
      };
    }
    
    if (quantity > currentStock) {
      return {
        success: false,
        message: `❌ المخزون غير كافي!\n\nالطلب: ${quantity} وحدة\nالمخزون الحالي: ${currentStock} وحدة\n\nيرجى تقليل الكمية أو اختيار فصيلة أخرى`
      };
    }
    
    if (currentStock < 10) {
      return {
        success: true,
        warning: true,
        message: `⚠️ تحذير: مخزون ${bloodType} منخفض\nالمخزون الحالي: ${currentStock} وحدة فقط`
      };
    }
    
    return {
      success: true,
      warning: false,
      message: 'المخزون كافي'
    };
  };

  // إضافة عملية بيع جديدة
  const handleAddSale = () => {
    if (!newSale.customerName || !newSale.quantity || !newSale.unitPrice) {
      alert('❌ يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // التحقق من المخزون قبل البيع
    const stockCheck = checkBloodStock(newSale.bloodType, newSale.quantity);
    
    if (!stockCheck.success) {
      alert(stockCheck.message);
      return;
    }
    
    // إذا كان هناك تحذير (مخزون منخفض)
    if (stockCheck.warning) {
      const userConfirmed = window.confirm(`${stockCheck.message}\n\nهل تريد الاستمرار في عملية البيع؟`);
      
      if (!userConfirmed) {
        return;
      }
    }

    // حساب المبلغ الإجمالي
    const subtotal = newSale.quantity * newSale.unitPrice;
    const discountAmount = newSale.discount;
    const totalAmount = subtotal - discountAmount;

    // توليد رقم فاتورة
    const invoiceNo = `INV-2024-${(sales.length + 1).toString().padStart(3, '0')}`;
    const saleId = `SALE${(sales.length + 1).toString().padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(':').slice(0, 2).join(':');

    const newSaleRecord = {
      id: saleId,
      invoiceNo: invoiceNo,
      customerName: newSale.customerName,
      customerType: newSale.customerType,
      date: today,
      time: now,
      bloodType: newSale.bloodType,
      quantity: newSale.quantity,
      unit: 'وحدة',
      unitPrice: newSale.unitPrice,
      discount: discountAmount,
      tax: 0,
      totalAmount: totalAmount,
      paymentMethod: newSale.paymentMethod,
      paymentStatus: 'مدفوع',
      deliveryStatus: 'قيد التحضير',
      salesPerson: 'المستخدم الحالي',
      notes: newSale.notes
    };

    // تحديث المخزون بعد البيع
    const updatedInventory = { ...bloodInventory };
    updatedInventory[newSale.bloodType] -= newSale.quantity;
    setBloodInventory(updatedInventory);

    // إضافة البيع إلى القائمة
    setSales([newSaleRecord, ...sales]);
    
    // حفظ البيع في التقارير (LocalStorage)
    saveSaleToReports(newSaleRecord);
    
    // حفظ آخر فاتورة لعرضها للطباعة
    setLastInvoice(newSaleRecord);
    
    // إغلاق مودال البيع وفتح مودال الطباعة
    setShowAddModal(false);
    setShowPrintModal(true);
    
    // إعادة تعيين النموذج
    setNewSale({
      customerName: 'مستشفى درعا الوطني',
      customerType: 'مستشفى حكومي',
      bloodType: 'A+',
      quantity: 1,
      unitPrice: 35000,
      discount: 0,
      paymentMethod: 'نقدي',
      deliveryAddress: '',
      notes: ''
    });
  };

  // حفظ البيع في التقارير
  const saveSaleToReports = (saleRecord) => {
    try {
      // الحصول على التقارير الحالية من localStorage
      const existingReports = JSON.parse(localStorage.getItem('bloodBankReports')) || [];
      
      // إضافة تقرير البيع
      const salesReport = {
        id: `RPT-${Date.now()}`,
        title: `تقرير بيع ${saleRecord.invoiceNo}`,
        type: 'مبيعات',
        period: 'يومي',
        generatedBy: 'نظام المبيعات',
        date: saleRecord.date,
        size: '0.5 MB',
        status: 'مكتمل',
        data: {
          title: `تقرير بيع ${saleRecord.invoiceNo}`,
          summary: {
            'رقم الفاتورة': saleRecord.invoiceNo,
            'العميل': saleRecord.customerName,
            'فصيلة الدم': saleRecord.bloodType,
            'الكمية': `${saleRecord.quantity} وحدة`,
            'المبلغ الإجمالي': `${saleRecord.totalAmount.toLocaleString()} ل.س`,
            'طريقة الدفع': saleRecord.paymentMethod
          },
          details: [saleRecord],
          generatedAt: new Date().toLocaleString('ar-SA')
        }
      };
      
      // إضافة التقرير الجديد
      const updatedReports = [salesReport, ...existingReports];
      localStorage.setItem('bloodBankReports', JSON.stringify(updatedReports));
      
      console.log('✅ تم حفظ البيع في التقارير:', salesReport);
    } catch (error) {
      console.error('❌ خطأ في حفظ البيع في التقارير:', error);
    }
  };

  // 📄 **دالة طباعة الفاتورة**
  const handlePrintInvoice = (sale) => {
    const invoiceContent = `
      ===============================
      فاتورة بيع دم
      بنك الدم الوطني - درعا
      ===============================
      رقم الفاتورة: ${sale.invoiceNo}
      التاريخ: ${sale.date} ${sale.time}
      ===============================
      العميل: ${sale.customerName}
      نوع العميل: ${sale.customerType}
      ===============================
      الصنف: دم كامل - فصيلة ${sale.bloodType}
      الكمية: ${sale.quantity} ${sale.unit}
      سعر الوحدة: ${sale.unitPrice.toLocaleString()} ل.س
      ===============================
      الإجمالي الفرعي: ${(sale.quantity * sale.unitPrice).toLocaleString()} ل.س
      الخصم: ${sale.discount.toLocaleString()} ل.س
      ===============================
      الإجمالي النهائي: ${sale.totalAmount.toLocaleString()} ل.س
      ===============================
      طريقة الدفع: ${sale.paymentMethod}
      حالة الدفع: ${sale.paymentStatus}
      حالة التسليم: ${sale.deliveryStatus}
      ===============================
      منفذ البيع: ${sale.salesPerson}
      ملاحظات: ${sale.notes || 'لا توجد ملاحظات'}
      ===============================
      شكراً لتعاملكم مع بنك الدم الوطني
      ===============================
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <title>فاتورة ${sale.invoiceNo}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              font-family: 'Cairo', Arial, sans-serif;
            }
            
            body {
              direction: rtl;
              background: #f5f5f5;
              color: #333;
              padding: 20px;
              line-height: 1.6;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
              border: 3px solid #DC143C;
            }
            
            .invoice-header {
              background: linear-gradient(135deg, #DC143C 0%, #B01030 100%);
              color: white;
              padding: 30px;
              text-align: center;
              position: relative;
            }
            
            .invoice-header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            
            .invoice-header h2 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .header-details {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
              padding: 15px;
              margin-top: 15px;
            }
            
            .invoice-info {
              background: #f8f9fa;
              padding: 20px;
              border-bottom: 2px solid #e9ecef;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            
            .info-card {
              background: white;
              border: 1px solid #e9ecef;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .info-card h3 {
              color: #DC143C;
              font-size: 18px;
              margin-bottom: 15px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 8px;
            }
            
            .blood-type-badge {
              display: inline-block;
              background: #DC143C;
              color: white;
              padding: 8px 20px;
              border-radius: 25px;
              font-size: 18px;
              font-weight: bold;
              margin: 5px 0;
            }
            
            .amount-section {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 25px;
              margin: 20px;
              border-radius: 12px;
              border: 2px solid #DC143C;
            }
            
            .amount-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px dashed #ddd;
            }
            
            .amount-row:last-child {
              border-bottom: none;
            }
            
            .total-row {
              font-size: 24px;
              font-weight: bold;
              color: #DC143C;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #DC143C;
            }
            
            .status-badge {
              display: inline-block;
              padding: 6px 15px;
              border-radius: 20px;
              font-weight: bold;
              margin: 5px;
            }
            
            .paid-status {
              background: #10B981;
              color: white;
            }
            
            .preparing-status {
              background: #F59E0B;
              color: white;
            }
            
            .footer {
              text-align: center;
              padding: 25px;
              background: #f8f9fa;
              color: #6B7280;
              border-top: 2px solid #e9ecef;
            }
            
            .actions {
              text-align: center;
              padding: 20px;
              background: white;
              border-top: 2px solid #e9ecef;
            }
            
            .print-btn {
              background: linear-gradient(135deg, #DC143C 0%, #B01030 100%);
              color: white;
              border: none;
              padding: 15px 40px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              margin: 10px;
              display: inline-flex;
              align-items: center;
              gap: 10px;
              transition: all 0.3s ease;
            }
            
            .print-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(220, 20, 60, 0.3);
            }
            
            .close-btn {
              background: #6B7280;
              color: white;
              border: none;
              padding: 15px 40px;
              border-radius: 8px;
              font-size: 18px;
              cursor: pointer;
              margin: 10px;
              display: inline-flex;
              align-items: center;
              gap: 10px;
              transition: all 0.3s ease;
            }
            
            .close-btn:hover {
              background: #4B5563;
            }
            
            @media print {
              body {
                padding: 0;
                background: white;
              }
              
              .invoice-container {
                box-shadow: none;
                border: 1px solid #000;
              }
              
              .actions, .no-print {
                display: none !important;
              }
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              color: rgba(220, 20, 60, 0.05);
              font-weight: bold;
              z-index: -1;
              white-space: nowrap;
            }
          </style>
        </head>
        <body>
          <div class="watermark">بنك الدم الوطني</div>
          
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>🌡️ بنك الدم الوطني - درعا</h1>
              <h2>فاتورة بيع دم</h2>
              <div class="header-details">
                <div>
                  <div style="font-size: 18px; opacity: 0.9;">رقم الفاتورة</div>
                  <div style="font-size: 24px; font-weight: bold;">${sale.invoiceNo}</div>
                </div>
                <div>
                  <div style="font-size: 18px; opacity: 0.9;">تاريخ الفاتورة</div>
                  <div style="font-size: 24px; font-weight: bold;">${sale.date}</div>
                </div>
                <div>
                  <div style="font-size: 18px; opacity: 0.9;">الوقت</div>
                  <div style="font-size: 24px; font-weight: bold;">${sale.time}</div>
                </div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <h3>🏥 معلومات العميل</h3>
                <p style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">${sale.customerName}</p>
                <p style="color: #6B7280;"><strong>نوع العميل:</strong> ${sale.customerType}</p>
              </div>
              
              <div class="info-card">
                <h3>👤 معلومات المنفذ</h3>
                <p style="font-size: 18px; margin-bottom: 10px;"><strong>منفذ البيع:</strong> ${sale.salesPerson}</p>
                <p style="color: #6B7280;"><strong>طريقة الدفع:</strong> ${sale.paymentMethod}</p>
              </div>
            </div>
            
            <div style="padding: 0 20px;">
              <div class="info-card" style="margin: 20px 0;">
                <h3>🩸 معلومات المنتج</h3>
                <div style="text-align: center; margin: 15px 0;">
                  <span class="blood-type-badge">فصيلة الدم: ${sale.bloodType}</span>
                </div>
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 20px;">
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 14px; color: #6B7280;">الكمية</div>
                    <div style="font-size: 28px; font-weight: bold; color: #DC143C;">${sale.quantity} وحدة</div>
                  </div>
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 14px; color: #6B7280;">سعر الوحدة</div>
                    <div style="font-size: 28px; font-weight: bold; color: #DC143C;">${sale.unitPrice.toLocaleString()} ل.س</div>
                  </div>
                  <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 14px; color: #6B7280;">الإجمالي الفرعي</div>
                    <div style="font-size: 28px; font-weight: bold; color: #DC143C;">${(sale.quantity * sale.unitPrice).toLocaleString()} ل.س</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="amount-section">
              <h3 style="text-align: center; margin-bottom: 20px; color: #DC143C; font-size: 22px;">💰 تفاصيل المبلغ</h3>
              
              <div class="amount-row">
                <span style="font-size: 18px;">الإجمالي الفرعي:</span>
                <span style="font-size: 18px; font-weight: bold;">${(sale.quantity * sale.unitPrice).toLocaleString()} ل.س</span>
              </div>
              
              <div class="amount-row">
                <span style="font-size: 18px;">الخصم:</span>
                <span style="font-size: 18px; font-weight: bold; color: #EF4444;">- ${sale.discount.toLocaleString()} ل.س</span>
              </div>
              
              <div class="amount-row total-row">
                <span style="font-size: 22px;">الإجمالي النهائي:</span>
                <span style="font-size: 28px; font-weight: bold;">${sale.totalAmount.toLocaleString()} ل.س</span>
              </div>
            </div>
            
            <div class="info-grid" style="padding: 20px;">
              <div class="info-card">
                <h3>📋 حالة الطلب</h3>
                <div style="margin: 15px 0;">
                  <span class="status-badge paid-status">✅ ${sale.paymentStatus}</span>
                  <span class="status-badge preparing-status">⏳ ${sale.deliveryStatus}</span>
                </div>
              </div>
              
              <div class="info-card">
                <h3>📝 ملاحظات</h3>
                <p style="padding: 10px; background: #f8f9fa; border-radius: 8px; margin-top: 10px;">
                  ${sale.notes || 'لا توجد ملاحظات'}
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="font-size: 16px; margin-bottom: 10px;">شكراً لتعاملكم مع بنك الدم الوطني - درعا</p>
              <p style="font-size: 14px; opacity: 0.8;">هذه الفاتورة صادرة إلكترونياً من نظام إدارة بنك الدم</p>
              <p style="font-size: 14px; opacity: 0.8;">رقم الاتصال: 123-456-789 | البريد الإلكتروني: info@bloodbank-daraa.sy</p>
            </div>
            
            <div class="actions no-print">
              <button class="print-btn" onclick="window.print()">
                🖨️ طباعة الفاتورة
              </button>
              <button class="close-btn" onclick="window.close()">
                ✕ إغلاق النافذة
              </button>
            </div>
          </div>
          
          <script>
            // طباعة تلقائية بعد تحميل الصفحة
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // تحديث حالة التسليم
  const handleUpdateDeliveryStatus = (id, newStatus) => {
    setSales(sales.map(sale => 
      sale.id === id ? { ...sale, deliveryStatus: newStatus } : sale
    ));
    
    const statusMessages = {
      'قيد التحضير': '📦 تم وضع الطلب قيد التحضير',
      'قيد التسليم': '🚚 جارٍ تسليم الطلب',
      'تم التسليم': '✅ تم تسليم الطلب بنجاح',
      'ملغي': '❌ تم إلغاء الطلب'
    };
    
    if (statusMessages[newStatus]) {
      alert(statusMessages[newStatus]);
    }
  };

  // تحديث حالة الدفع
  const handleUpdatePaymentStatus = (id, newStatus) => {
    setSales(sales.map(sale => 
      sale.id === id ? { ...sale, paymentStatus: newStatus } : sale
    ));
    
    alert(`💰 تم تحديث حالة الدفع إلى "${newStatus}"`);
  };

  // حذف عملية بيع
  const handleDeleteSale = (id) => {
    if (window.confirm('⚠️ هل أنت متأكد من حذف هذه العملية؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setSales(sales.filter(sale => sale.id !== id));
      alert('🗑️ تم حذف العملية بنجاح');
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-SA', options);
  };

  // تنسيق العملة (ليرة سورية)
  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('ar-SA')} ل.س`;
  };

  // الحصول على لون حالة الدفع
  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'مدفوع': return '#10B981';
      case 'مدفوع جزئياً': return '#F59E0B';
      case 'غير مدفوع': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // الحصول على لون حالة التسليم
  const getDeliveryStatusColor = (status) => {
    switch(status) {
      case 'تم التسليم': return '#10B981';
      case 'قيد التسليم': return '#3B82F6';
      case 'قيد التحضير': return '#F59E0B';
      case 'ملغي': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // متابعة البيع بدون طباعة
  const handleContinueWithoutPrint = () => {
    setShowPrintModal(false);
    alert(`✅ تم إضافة عملية البيع بنجاح! رقم الفاتورة: ${lastInvoice.invoiceNo}`);
  };

  return (
    <div className="blood-sales-page">
      <Header />
      
      <div className="sales-container">
        {/* Header */}
        <div className="sales-header">
          <div>
            <h1 className="page-title">
              <i className="fas fa-hand-holding-usd"></i>
              مبيعات الدم
            </h1>
            <p className="page-subtitle">
              <i className="fas fa-map-marker-alt"></i>
              بنك الدم الوطني - درعا | إدارة عمليات بيع الدم للمستشفيات
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary add-sale-btn"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fas fa-plus-circle"></i>
              <span>عملية بيع جديدة</span>
            </button>
            <button className="btn btn-outline refresh-btn">
              <i className="fas fa-sync-alt"></i>
              <span>تحديث</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="sales-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #1E6BD6)' }}>
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(salesStats.totalRevenue)}</div>
              <div className="stat-label">إجمالي الإيرادات</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{salesStats.totalSales}</div>
              <div className="stat-label">إجمالي المبيعات</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(salesStats.todayRevenue)}</div>
              <div className="stat-label">مبيعات اليوم</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{formatCurrency(salesStats.pendingPayments)}</div>
              <div className="stat-label">مدفوعات معلقة</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="sales-filters">
          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="ابحث باسم المستشفى أو رقم الفاتورة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <select
              value={bloodTypeFilter}
              onChange={(e) => setBloodTypeFilter(e.target.value)}
              className="filter-select"
            >
              {bloodTypes.map(type => (
                <option key={type} value={type}>فصيلة: {type}</option>
              ))}
            </select>
            
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="filter-select"
            >
              {paymentStatuses.map(status => (
                <option key={status} value={status}>دفع: {status}</option>
              ))}
            </select>
            
            <button className="filter-clear" onClick={() => {
              setSearchTerm('');
              setBloodTypeFilter('الكل');
              setPaymentStatusFilter('الكل');
              setDateFromFilter('');
              setDateToFilter('');
            }}>
              <i className="fas fa-times"></i>
              مسح الفلاتر
            </button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="sales-table-container">
          <div className="table-header">
            <h3>
              <i className="fas fa-file-invoice"></i>
              قائمة عمليات البيع
            </h3>
            <div className="table-summary">
              <span>
                <i className="fas fa-filter"></i>
                عرض {filteredSales.length} من {sales.length} عملية
              </span>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>الفاتورة</th>
                  <th>المستشفى</th>
                  <th>المنتج</th>
                  <th>المبلغ</th>
                  <th>حالة الدفع</th>
                  <th>حالة التسليم</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="sale-row">
                    <td>
                      <div className="invoice-info">
                        <div className="invoice-number">{sale.invoiceNo}</div>
                        <div className="invoice-date">
                          <i className="far fa-calendar-alt"></i>
                          {formatDate(sale.date)}
                        </div>
                        <div className="invoice-time">
                          <i className="far fa-clock"></i>
                          {sale.time}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          <i className="fas fa-hospital"></i>
                        </div>
                        <div>
                          <div className="customer-name">{sale.customerName}</div>
                          <div className="sales-person">
                            <i className="fas fa-user"></i>
                            {sale.salesPerson}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="product-info">
                        <div className="blood-badge" style={{ backgroundColor: getDeliveryStatusColor(sale.deliveryStatus) }}>
                          <i className="fas fa-tint"></i>
                          {sale.bloodType}
                        </div>
                        <div className="product-details">
                          <div className="quantity">
                            <i className="fas fa-hashtag"></i>
                            {sale.quantity} وحدة
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="amount-info">
                        <div className="unit-price">
                          سعر الوحدة: {formatCurrency(sale.unitPrice)}
                        </div>
                        <div className="total-amount">
                          <i className="fas fa-money-bill-wave"></i>
                          {formatCurrency(sale.totalAmount)}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="status-container">
                        <div 
                          className="status-badge payment-status"
                          style={{
                            backgroundColor: `${getPaymentStatusColor(sale.paymentStatus)}20`,
                            color: getPaymentStatusColor(sale.paymentStatus),
                          }}
                        >
                          <div className="status-dot" style={{ backgroundColor: getPaymentStatusColor(sale.paymentStatus) }}></div>
                          {sale.paymentStatus}
                        </div>
                        <div className="payment-method">
                          <i className="fas fa-credit-card"></i>
                          {sale.paymentMethod}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="status-container">
                        <div 
                          className="status-badge delivery-status"
                          style={{
                            backgroundColor: `${getDeliveryStatusColor(sale.deliveryStatus)}20`,
                            color: getDeliveryStatusColor(sale.deliveryStatus),
                          }}
                        >
                          <div className="status-dot" style={{ backgroundColor: getDeliveryStatusColor(sale.deliveryStatus) }}></div>
                          {sale.deliveryStatus}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="action-btn print-btn"
                          onClick={() => handlePrintInvoice(sale)}
                          title="طباعة الفاتورة"
                        >
                          <i className="fas fa-print"></i>
                        </button>
                        
                        <button 
                          className="action-btn update-btn"
                          onClick={() => handleUpdateDeliveryStatus(sale.id, 
                            sale.deliveryStatus === 'قيد التحضير' ? 'قيد التسليم' : 
                            sale.deliveryStatus === 'قيد التسليم' ? 'تم التسليم' : 'قيد التحضير'
                          )}
                          title="تحديث الحالة"
                        >
                          <i className="fas fa-sync-alt"></i>
                        </button>
                        
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteSale(sale.id)}
                          title="حذف"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                <i className="fas fa-hand-holding-usd"></i>
                عملية بيع جديدة
              </h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <i className="fas fa-hospital"></i>
                    المستشفى *
                  </label>
                  <select
                    value={newSale.customerName}
                    onChange={(e) => setNewSale({...newSale, customerName: e.target.value})}
                    className="form-input"
                    required
                  >
                    {hospitals.map(hospital => (
                      <option key={hospital} value={hospital}>{hospital}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-tint"></i>
                    فصيلة الدم *
                  </label>
                  <select
                    value={newSale.bloodType}
                    onChange={(e) => setNewSale({...newSale, bloodType: e.target.value})}
                    className="form-input"
                    required
                  >
                    {bloodTypes.filter(type => type !== 'الكل').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <i className="fas fa-hashtag"></i>
                    الكمية *
                  </label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale({...newSale, quantity: parseInt(e.target.value) || 1})}
                      className="form-input"
                      required
                    />
                    <span className="input-unit">وحدة</span>
                  </div>
                  {/* عرض المخزون الحالي */}
                  <div className="stock-info" style={{
                    fontSize: '14px',
                    marginTop: '5px',
                    padding: '5px 10px',
                    background: bloodInventory[newSale.bloodType] < 10 ? '#FEF3C7' : '#D1FAE5',
                    color: bloodInventory[newSale.bloodType] < 10 ? '#92400E' : '#065F46',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    <i className={`fas ${bloodInventory[newSale.bloodType] < 10 ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                    المخزون الحالي: <strong>{bloodInventory[newSale.bloodType]}</strong> وحدة
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-money-bill"></i>
                    سعر الوحدة (ل.س) *
                  </label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      min="0"
                      value={newSale.unitPrice}
                      onChange={(e) => setNewSale({...newSale, unitPrice: parseInt(e.target.value) || 0})}
                      className="form-input"
                      required
                    />
                    <span className="input-unit">ل.س</span>
                  </div>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <i className="fas fa-tag"></i>
                    الخصم (ل.س)
                  </label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      min="0"
                      value={newSale.discount}
                      onChange={(e) => setNewSale({...newSale, discount: parseInt(e.target.value) || 0})}
                      className="form-input"
                    />
                    <span className="input-unit">ل.س</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-credit-card"></i>
                    طريقة الدفع
                  </label>
                  <select
                    value={newSale.paymentMethod}
                    onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                    className="form-input"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <i className="fas fa-sticky-note"></i>
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={newSale.notes}
                  onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="أي ملاحظات إضافية حول الطلب..."
                />
              </div>
              
              {/* Preview */}
              <div className="price-preview">
                <h4>
                  <i className="fas fa-file-invoice"></i>
                  معاينة الفاتورة
                </h4>
                <div className="preview-row">
                  <span>الإجمالي الفرعي:</span>
                  <span>{formatCurrency(newSale.quantity * newSale.unitPrice)}</span>
                </div>
                <div className="preview-row">
                  <span>الخصم:</span>
                  <span>- {formatCurrency(newSale.discount)}</span>
                </div>
                <div className="preview-row total-row">
                  <span>الإجمالي النهائي:</span>
                  <span>{formatCurrency(newSale.quantity * newSale.unitPrice - newSale.discount)}</span>
                </div>
                
                {/* عرض المخزون بعد البيع */}
                <div className="preview-row" style={{
                  borderTop: '1px dashed #ddd',
                  paddingTop: '10px',
                  marginTop: '10px',
                  color: bloodInventory[newSale.bloodType] - newSale.quantity < 5 ? '#DC2626' : '#059669'
                }}>
                  <span>
                    <i className="fas fa-boxes"></i>
                    المخزون بعد البيع:
                  </span>
                  <span style={{ fontWeight: 'bold' }}>
                    {bloodInventory[newSale.bloodType] - newSale.quantity} وحدة
                  </span>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
                إلغاء
              </button>
              <button className="btn btn-primary" onClick={handleAddSale}>
                <i className="fas fa-check"></i>
                تأكيد عملية البيع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Invoice Modal بعد عملية البيع */}
      {showPrintModal && lastInvoice && (
        <div className="modal-overlay">
          <div className="modal print-modal">
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
              <h3 style={{ color: 'white' }}>
                <i className="fas fa-check-circle"></i>
                ✅ تم إتمام عملية البيع بنجاح!
              </h3>
              <button className="close-btn" onClick={() => setShowPrintModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="success-message">
                <div className="success-icon">
                  <i className="fas fa-trophy" style={{ fontSize: '60px', color: '#10B981' }}></i>
                </div>
                
                <h4 style={{ textAlign: 'center', margin: '20px 0', color: '#059669' }}>
                  تم تسجيل عملية البيع بنجاح
                </h4>
                
                <div className="invoice-summary">
                  <div className="summary-card">
                    <div className="summary-item">
                      <span className="summary-label">رقم الفاتورة:</span>
                      <span className="summary-value" style={{ color: '#DC143C', fontWeight: 'bold' }}>
                        {lastInvoice.invoiceNo}
                      </span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">المستشفى:</span>
                      <span className="summary-value">{lastInvoice.customerName}</span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">فصيلة الدم:</span>
                      <span className="summary-value">
                        <span style={{
                          display: 'inline-block',
                          background: '#DC143C',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontWeight: 'bold'
                        }}>
                          {lastInvoice.bloodType}
                        </span>
                      </span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">الكمية:</span>
                      <span className="summary-value">{lastInvoice.quantity} وحدة</span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">الإجمالي النهائي:</span>
                      <span className="summary-value" style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold',
                        color: '#DC143C'
                      }}>
                        {formatCurrency(lastInvoice.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  marginTop: '30px'
                }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      handlePrintInvoice(lastInvoice);
                      setShowPrintModal(false);
                    }}
                    style={{
                      padding: '12px 30px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'linear-gradient(135deg, #DC143C, #B01030)'
                    }}
                  >
                    <i className="fas fa-print"></i>
                    🖨️ طباعة الفاتورة الآن
                  </button>
                  
                  <button 
                    className="btn btn-secondary"
                    onClick={handleContinueWithoutPrint}
                    style={{
                      padding: '12px 30px',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <i className="fas fa-arrow-right"></i>
                    متابعة بدون طباعة
                  </button>
                </div>
                
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#F3F4F6',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#6B7280'
                }}>
                  <p>
                    <i className="fas fa-info-circle"></i>
                    يمكنك طباعة الفاتورة في أي وقت من قائمة عمليات البيع
                  </p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button 
                className="btn btn-outline"
                onClick={() => setShowPrintModal(false)}
              >
                <i className="fas fa-times"></i>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodSalesPage;