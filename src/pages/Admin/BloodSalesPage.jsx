/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/main.css';
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

  // أنواع منتجات الدم (المنتجات المتاحة للبيع فقط)
  const bloodProducts = [
    { value: 'whole_blood', label: 'دم كامل', unit: 'وحدة' },
    { value: 'plasma', label: 'بلازما', unit: 'كيس (250 مل)' },
    { value: 'platelets', label: 'صفائح دموية', unit: 'وحدة' }
  ];

  // درجات الاستعجال
  const urgencyLevels = [
    { value: 'critical', label: 'حرجة - يحتاج نقل فوري', color: '#DC2626' },
    { value: 'high', label: 'عالية - خلال ساعتين', color: '#F59E0B' },
    { value: 'medium', label: 'متوسطة - خلال 6 ساعات', color: '#3B82F6' },
    { value: 'low', label: 'منخفضة - روتيني', color: '#10B981' }
  ];

  // أسباب الطلب
  const requestReasons = [
    'عملية جراحية',
    'حادث مروري',
    'نزيف داخلي',
    'ولادة',
    'علاج السرطان',
    'فقر دم حاد',
    'مرض مزمن',
    'حروق',
    'أخرى'
  ];

  // بيانات مخزون الدم الحقيقي (للمنتجات الثلاثة فقط)
  const initialBloodInventory = {
    'whole_blood': {
      'A+': 45,
      'A-': 15,
      'B+': 38,
      'B-': 22,
      'AB+': 12,
      'AB-': 8,
      'O+': 62,
      'O-': 29
    },
    'plasma': {
      'A+': 25,
      'A-': 8,
      'B+': 20,
      'B-': 12,
      'AB+': 15,
      'AB-': 6,
      'O+': 35,
      'O-': 18
    },
    'platelets': {
      'A+': 30,
      'A-': 10,
      'B+': 25,
      'B-': 15,
      'AB+': 18,
      'AB-': 7,
      'O+': 40,
      'O-': 20
    }
  };

  // حالة المخزون
  const [bloodInventory, setBloodInventory] = useState(initialBloodInventory);

  // تحديد السعر حسب نوع المستشفى ونوع المنتج
  const getPriceByProductAndHospital = (productType, hospitalName) => {
    // قائمة المستشفيات الحكومية
    const governmentHospitals = [
      'مستشفى درعا الوطني',
      'مستشفى الصنمين',
      'مستشفى الشيخ مسكين',
      'مستشفى ازرع',
      'مركز درعا الطبي',
      'مستشفى الأطفال',
      'مستشفى الولادة'
    ];
    
    // قائمة المستشفيات الخاصة
    const privateHospitals = [
      'مستشفى النزهة',
      'مستشفى الهضاب',
      'مستشفى الأمل',
      'مستشفى السلام',
      'مستشفى الرحمة',
      'مستشفى الحكمة',
      'مستشفى الرعاية',
      'مستشفى الشفاء'
    ];
    
    // الأسعار حسب نوع المنتج (للمنتجات الثلاثة فقط)
    const productPrices = {
      'whole_blood': {
        government: 60000,   // سعر الدم الكامل للمستشفيات الحكومية
        private: 200000      // سعر الدم الكامل للمستشفيات الخاصة
      },
      'plasma': {
        government: 80000,   // سعر البلازما للمستشفيات الحكومية
        private: 240000      // سعر البلازما للمستشفيات الخاصة
      },
      'platelets': {
        government: 150000,   // سعر الصفائح للمستشفيات الحكومية
        private: 425000      // سعر الصفائح للمستشفيات الخاصة
      }
    };
    
    const isGovernment = governmentHospitals.includes(hospitalName);
    const hospitalType = isGovernment ? 'government' : 'private';
    
    // الحصول على السعر المناسب للمنتج ونوع المستشفى
    return productPrices[productType]?.[hospitalType] || 
           (isGovernment ? 60000 : 200000); // سعر افتراضي
  };

  // تحديد نوع المستشفى
  const getHospitalType = (hospitalName) => {
    const governmentHospitals = [
      'مستشفى درعا الوطني',
      'مستشفى الصنمين',
      'مستشفى الشيخ مسكين',
      'مستشفى ازرع',
      'مركز درعا الطبي',
      'مستشفى الأطفال',
      'مستشفى الولادة'
    ];
    
    if (governmentHospitals.includes(hospitalName)) {
      return 'مستشفى حكومي';
    } else {
      return 'مستشفى خاص';
    }
  };

  // بيانات مبيعات الدم المعدلة
  const [sales, setSales] = useState([
    {
      id: 'SALE001',
      invoiceNo: 'INV-2024-001',
      customerName: 'مستشفى درعا الوطني',
      customerType: 'مستشفى حكومي',
      date: '2024-01-20',
      time: '10:30',
      productType: 'whole_blood',
      productName: 'دم كامل',
      bloodType: 'A+',
      quantity: 5,
      unit: 'وحدة',
      unitPrice: 60000,
      discount: 0,
      tax: 0,
      totalAmount: 300000,
      paymentMethod: 'شيك',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'أحمد محمود',
      notes: 'طلب عاجل للعمليات',
      
      // معلومات المريض الجديدة
      patientInfo: {
        patientName: 'محمد أحمد',
        nationalId: '1234567890',
        phoneNumber: '0991234567',
        age: 45,
        gender: 'ذكر'
      },
      urgencyLevel: 'critical',
      urgencyLabel: 'حرجة - يحتاج نقل فوري',
      requestReason: 'عملية جراحية',
      caseDetails: 'عملية قلب مفتوح - المريض يعاني من نزيف حاد'
    },
    {
      id: 'SALE002',
      invoiceNo: 'INV-2024-002',
      customerName: 'مستشفى الصنمين',
      customerType: 'مستشفى حكومي',
      date: '2024-01-19',
      time: '14:45',
      productType: 'plasma',
      productName: 'بلازما',
      bloodType: 'O-',
      quantity: 3,
      unit: 'كيس (250 مل)',
      unitPrice: 80000,
      discount: 0,
      tax: 0,
      totalAmount: 240000,
      paymentMethod: 'نقدي',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'سارة علي',
      notes: 'طلب روتيني',
      
      // معلومات المريض الجديدة
      patientInfo: {
        patientName: 'سعاد محمد',
        nationalId: '0987654321',
        phoneNumber: '0997654321',
        age: 32,
        gender: 'أنثى'
      },
      urgencyLevel: 'medium',
      urgencyLabel: 'متوسطة - خلال 6 ساعات',
      requestReason: 'ولادة',
      caseDetails: 'عملية قيصرية مع فقدان دم متوقع'
    },
    {
      id: 'SALE003',
      invoiceNo: 'INV-2024-003',
      customerName: 'مستشفى النزهة',
      customerType: 'مستشفى خاص',
      date: '2024-01-18',
      time: '11:15',
      productType: 'platelets',
      productName: 'صفائح دموية',
      bloodType: 'B+',
      quantity: 8,
      unit: 'وحدة',
      unitPrice: 425000,
      discount: 5000,
      tax: 0,
      totalAmount: 3395000,
      paymentMethod: 'شيك',
      paymentStatus: 'مدفوع',
      deliveryStatus: 'قيد التسليم',
      salesPerson: 'محمد حسن',
      notes: 'طلب كبير للعمليات القادمة',
      
      // معلومات المريض الجديدة
      patientInfo: {
        patientName: 'علي خالد',
        nationalId: '1122334455',
        phoneNumber: '0991122334',
        age: 28,
        gender: 'ذكر'
      },
      urgencyLevel: 'high',
      urgencyLabel: 'عالية - خلال ساعتين',
      requestReason: 'حادث مروري',
      caseDetails: 'حادث مروري - كسور متعددة مع نزيف داخلي'
    },
    {
      id: 'SALE004',
      invoiceNo: 'INV-2024-004',
      customerName: 'مستشفى الأمل',
      customerType: 'مستشفى خاص',
      date: '2024-01-17',
      time: '09:00',
      productType: 'whole_blood',
      productName: 'دم كامل',
      bloodType: 'AB+',
      quantity: 2,
      unit: 'وحدة',
      unitPrice: 200000,
      discount: 0,
      tax: 0,
      totalAmount: 400000,
      paymentMethod: 'نقدي',
      paymentStatus: 'مدفوع جزئياً',
      deliveryStatus: 'تم التسليم',
      salesPerson: 'خالد إبراهيم',
      notes: 'طلب خاص',
      
      // معلومات المريض الجديدة
      patientInfo: {
        patientName: 'فاطمة عمر',
        nationalId: '5566778899',
        phoneNumber: '0995566778',
        age: 65,
        gender: 'أنثى'
      },
      urgencyLevel: 'critical',
      urgencyLabel: 'حرجة - يحتاج نقل فوري',
      requestReason: 'علاج السرطان',
      caseDetails: 'مريضة سرطان تتعالج بالكيماوي - تحتاج نقل دم دوري'
    }
  ]);

  // حالة للنموذج الجديد
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [newSale, setNewSale] = useState({
    customerName: 'مستشفى درعا الوطني',
    customerType: 'مستشفى حكومي',
    productType: 'whole_blood',
    productName: 'دم كامل',
    bloodType: 'A+',
    quantity: 1,
    unit: 'وحدة',
    unitPrice: 60000,
    discount: 0,
    paymentMethod: 'نقدي',
    deliveryAddress: '',
    notes: '',
    
    // معلومات المريض الجديدة
    patientInfo: {
      patientName: '',
      nationalId: '',
      phoneNumber: '',
      age: '',
      gender: 'ذكر'
    },
    urgencyLevel: 'medium',
    urgencyLabel: 'متوسطة - خلال 6 ساعات',
    requestReason: 'عملية جراحية',
    caseDetails: ''
  });

  // حالة للبحث
  const [searchTerm, setSearchTerm] = useState('');

  // إحصائيات المبيعات
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    averageSale: 0,
    topProduct: ''
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
    
    // حساب أكثر منتج مطلوب
    const productCounts = {};
    sales.forEach(sale => {
      productCounts[sale.productName] = (productCounts[sale.productName] || 0) + sale.quantity;
    });
    
    const topProduct = Object.keys(productCounts).reduce((a, b) => 
      productCounts[a] > productCounts[b] ? a : b, '');
    
    stats.topProduct = topProduct;
    setSalesStats(stats);
  }, [sales]);

  // تصفية المبيعات حسب البحث
  const filteredSales = sales.filter(sale => {
    // البحث باسم المستشفى فقط
    if (searchTerm && !sale.customerName.includes(searchTerm)) {
      return false;
    }
    
    return true;
  });

  // فصائل الدم
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // طرق الدفع (نقدي وشيك فقط)
  const paymentMethods = ['نقدي', 'شيك'];

  // الجنس
  const genders = ['ذكر', 'أنثى'];

  // دالة التحقق من المخزون قبل البيع
  const checkBloodStock = (productType, bloodType, quantity) => {
    const currentStock = bloodInventory[productType]?.[bloodType];
    
    if (currentStock === undefined) {
      const productName = productType === 'whole_blood' ? 'دم كامل' :
                         productType === 'plasma' ? 'بلازما' :
                         productType === 'platelets' ? 'صفائح دموية' : 'المنتج';
      
      return {
        success: false,
        message: `❌ ${productName} - فصيلة ${bloodType} غير موجودة في المخزون`
      };
    }
    
    if (currentStock <= 0) {
      const productName = productType === 'whole_blood' ? 'دم كامل' :
                         productType === 'plasma' ? 'بلازما' :
                         productType === 'platelets' ? 'صفائح دموية' : 'المنتج';
      
      return {
        success: false,
        message: `❌ ${productName} - فصيلة ${bloodType} غير متاحة في المخزون`
      };
    }
    
    if (quantity > currentStock) {
      const productName = productType === 'whole_blood' ? 'دم كامل' :
                         productType === 'plasma' ? 'بلازما' :
                         productType === 'platelets' ? 'صفائح دموية' : 'المنتج';
      
      return {
        success: false,
        message: `❌ المخزون غير كافي!\n\n${productName} - فصيلة ${bloodType}\n\nالطلب: ${quantity} وحدة\nالمخزون الحالي: ${currentStock} وحدة\n\nيرجى تقليل الكمية أو اختيار منتج/فصيلة أخرى`
      };
    }
    
    if (currentStock < 10) {
      const productName = productType === 'whole_blood' ? 'دم كامل' :
                         productType === 'plasma' ? 'بلازما' :
                         productType === 'platelets' ? 'صفائح دموية' : 'المنتج';
      
      return {
        success: true,
        warning: true,
        message: `⚠️ تحذير: مخزون ${productName} - ${bloodType} منخفض\nالمخزون الحالي: ${currentStock} وحدة فقط`
      };
    }
    
    return {
      success: true,
      warning: false,
      message: 'المخزون كافي'
    };
  };

  // تحديث السعر والوحدة عند تغيير المنتج أو المستشفى
  useEffect(() => {
    const hospitalType = getHospitalType(newSale.customerName);
    const price = getPriceByProductAndHospital(newSale.productType, newSale.customerName);
    const product = bloodProducts.find(p => p.value === newSale.productType);
    const urgency = urgencyLevels.find(u => u.value === newSale.urgencyLevel);
    
    setNewSale({
      ...newSale,
      customerType: hospitalType,
      productName: product?.label || 'دم كامل',
      unit: product?.unit || 'وحدة',
      unitPrice: price,
      urgencyLabel: urgency?.label || 'متوسطة - خلال 6 ساعات'
    });
  }, [newSale.customerName, newSale.productType, newSale.urgencyLevel]);

  // إضافة عملية بيع جديدة
  const handleAddSale = () => {
    // التحقق من الحقول المطلوبة
    if (!newSale.customerName || !newSale.quantity || !newSale.unitPrice) {
      alert('❌ يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // التحقق من معلومات المريض
    if (!newSale.patientInfo.patientName || !newSale.patientInfo.nationalId) {
      alert('❌ يرجى إدخال اسم المريض والرقم الوطني');
      return;
    }

    // التحقق من المخزون قبل البيع
    const stockCheck = checkBloodStock(newSale.productType, newSale.bloodType, newSale.quantity);
    
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
      productType: newSale.productType,
      productName: newSale.productName,
      bloodType: newSale.bloodType,
      quantity: newSale.quantity,
      unit: newSale.unit,
      unitPrice: newSale.unitPrice,
      discount: discountAmount,
      tax: 0,
      totalAmount: totalAmount,
      paymentMethod: newSale.paymentMethod,
      paymentStatus: 'مدفوع',
      deliveryStatus: 'قيد التحضير',
      salesPerson: 'المستخدم الحالي',
      notes: newSale.notes,
      
      // معلومات المريض الجديدة
      patientInfo: newSale.patientInfo,
      urgencyLevel: newSale.urgencyLevel,
      urgencyLabel: newSale.urgencyLabel,
      requestReason: newSale.requestReason,
      caseDetails: newSale.caseDetails
    };

    // تحديث المخزون بعد البيع
    const updatedInventory = { ...bloodInventory };
    updatedInventory[newSale.productType][newSale.bloodType] -= newSale.quantity;
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
      productType: 'whole_blood',
      productName: 'دم كامل',
      bloodType: 'A+',
      quantity: 1,
      unit: 'وحدة',
      unitPrice: 60000,
      discount: 0,
      paymentMethod: 'نقدي',
      deliveryAddress: '',
      notes: '',
      
      // معلومات المريض الجديدة
      patientInfo: {
        patientName: '',
        nationalId: '',
        phoneNumber: '',
        age: '',
        gender: 'ذكر'
      },
      urgencyLevel: 'medium',
      urgencyLabel: 'متوسطة - خلال 6 ساعات',
      requestReason: 'عملية جراحية',
      caseDetails: ''
    });
  };

  // حفظ البيع في التقارير
  const saveSaleToReports = (saleRecord) => {
    try {
      const existingReports = JSON.parse(localStorage.getItem('bloodBankReports')) || [];
      
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
            'المنتج': saleRecord.productName,
            'فصيلة الدم': saleRecord.bloodType,
            'الكمية': `${saleRecord.quantity} ${saleRecord.unit}`,
            'المبلغ الإجمالي': `${saleRecord.totalAmount.toLocaleString()} ل.س`,
            'طريقة الدفع': saleRecord.paymentMethod,
            'اسم المريض': saleRecord.patientInfo.patientName,
            'درجة الاستعجال': saleRecord.urgencyLabel,
            'سبب الطلب': saleRecord.requestReason
          },
          details: [saleRecord],
          generatedAt: new Date().toLocaleString('ar-SA')
        }
      };
      
      const updatedReports = [salesReport, ...existingReports];
      localStorage.setItem('bloodBankReports', JSON.stringify(updatedReports));
      
      console.log('✅ تم حفظ البيع في التقارير:', salesReport);
    } catch (error) {
      console.error('❌ خطأ في حفظ البيع في التقارير:', error);
    }
  };

  // 📄 **دالة طباعة الفاتورة (محدثة مع معلومات المريض)**
  const handlePrintInvoice = (sale) => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');
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
              max-width: 850px;
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
              padding: 25px;
              text-align: center;
              position: relative;
            }
            
            .invoice-header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            
            .invoice-header h2 {
              font-size: 22px;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .header-details {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
              padding: 12px;
              margin-top: 15px;
              font-size: 14px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
              margin: 15px;
            }
            
            .info-card {
              background: white;
              border: 1px solid #e9ecef;
              border-radius: 10px;
              padding: 15px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .info-card h3 {
              color: #DC143C;
              font-size: 16px;
              margin-bottom: 12px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .patient-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 10px;
              margin: 10px 0;
            }
            
            .patient-field {
              margin-bottom: 8px;
            }
            
            .patient-label {
              font-size: 13px;
              color: #6B7280;
              margin-bottom: 3px;
            }
            
            .patient-value {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              padding: 5px 10px;
              background: #f8f9fa;
              border-radius: 6px;
              border-right: 3px solid #DC143C;
            }
            
            .urgency-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 13px;
              margin: 5px 0;
              text-align: center;
            }
            
            .critical-urgency {
              background: #FEE2E2;
              color: #DC2626;
              border: 1px solid #DC2626;
            }
            
            .high-urgency {
              background: #FEF3C7;
              color: #D97706;
              border: 1px solid #D97706;
            }
            
            .medium-urgency {
              background: #DBEAFE;
              color: #1E40AF;
              border: 1px solid #1E40AF;
            }
            
            .low-urgency {
              background: #D1FAE5;
              color: #065F46;
              border: 1px solid #065F46;
            }
            
            .case-details {
              background: #f8f9fa;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
              margin-top: 10px;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .amount-section {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 20px;
              margin: 15px;
              border-radius: 12px;
              border: 2px solid #DC143C;
            }
            
            .amount-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px dashed #ddd;
              font-size: 15px;
            }
            
            .amount-row:last-child {
              border-bottom: none;
            }
            
            .total-row {
              font-size: 22px;
              font-weight: bold;
              color: #DC143C;
              margin-top: 15px;
              padding-top: 15px;
              border-top: 2px solid #DC143C;
            }
            
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: bold;
              margin: 5px;
              font-size: 13px;
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
              padding: 20px;
              background: #f8f9fa;
              color: #6B7280;
              border-top: 2px solid #e9ecef;
              font-size: 13px;
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
              padding: 12px 30px;
              border-radius: 8px;
              font-size: 16px;
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
              padding: 12px 30px;
              border-radius: 8px;
              font-size: 16px;
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
                margin: 0;
                width: 100%;
              }
              
              .actions, .no-print {
                display: none !important;
              }
              
              .invoice-header {
                padding: 20px;
              }
              
              .info-grid {
                margin: 10px;
              }
            }
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 100px;
              color: rgba(220, 20, 60, 0.05);
              font-weight: bold;
              z-index: -1;
              white-space: nowrap;
            }
            
            .product-details-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin: 15px 0;
              text-align: center;
            }
            
            .product-detail-item {
              padding: 10px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            
            .detail-label {
              font-size: 12px;
              color: #6B7280;
              margin-bottom: 5px;
            }
            
            .detail-value {
              font-size: 18px;
              font-weight: bold;
              color: #DC143C;
            }
            
            .blood-type-display {
              background: #DC143C;
              color: white;
              padding: 8px 15px;
              border-radius: 20px;
              font-weight: bold;
              font-size: 16px;
              display: inline-block;
              margin: 5px;
            }
          </style>
        </head>
        <body>
          <div class="watermark">بنك الدم الوطني</div>
          
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>🌡️ بنك الدم الوطني - درعا</h1>
              <h2>فاتورة بيع دم ومشتقاته</h2>
              <div class="header-details">
                <div>
                  <div style="font-size: 15px; opacity: 0.9;">رقم الفاتورة</div>
                  <div style="font-size: 20px; font-weight: bold;">${sale.invoiceNo}</div>
                </div>
                <div>
                  <div style="font-size: 15px; opacity: 0.9;">تاريخ الفاتورة</div>
                  <div style="font-size: 20px; font-weight: bold;">${sale.date}</div>
                </div>
                <div>
                  <div style="font-size: 15px; opacity: 0.9;">الوقت</div>
                  <div style="font-size: 20px; font-weight: bold;">${sale.time}</div>
                </div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <h3><i class="fas fa-hospital"></i> معلومات المستشفى</h3>
                <div class="patient-field">
                  <div class="patient-label">اسم المستشفى</div>
                  <div class="patient-value">${sale.customerName}</div>
                </div>
                <div class="patient-field">
                  <div class="patient-label">نوع المستشفى</div>
                  <div class="patient-value">${sale.customerType}</div>
                </div>
                <div class="patient-field">
                  <div class="patient-label">منفذ البيع</div>
                  <div class="patient-value">${sale.salesPerson}</div>
                </div>
              </div>
              
              <div class="info-card">
                <h3><i class="fas fa-user-injured"></i> معلومات المريض</h3>
                <div class="patient-grid">
                  <div class="patient-field">
                    <div class="patient-label">اسم المريض</div>
                    <div class="patient-value">${sale.patientInfo.patientName}</div>
                  </div>
                  <div class="patient-field">
                    <div class="patient-label">الرقم الوطني</div>
                    <div class="patient-value">${sale.patientInfo.nationalId}</div>
                  </div>
                  <div class="patient-field">
                    <div class="patient-label">رقم الهاتف</div>
                    <div class="patient-value">${sale.patientInfo.phoneNumber}</div>
                  </div>
                  <div class="patient-field">
                    <div class="patient-label">العمر</div>
                    <div class="patient-value">${sale.patientInfo.age} سنة</div>
                  </div>
                  <div class="patient-field">
                    <div class="patient-label">الجنس</div>
                    <div class="patient-value">${sale.patientInfo.gender}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <h3><i class="fas fa-exclamation-triangle"></i> معلومات الطلب</h3>
                <div class="patient-field">
                  <div class="patient-label">درجة الاستعجال</div>
                  <div class="urgency-badge ${sale.urgencyLevel}-urgency">
                    ${sale.urgencyLabel}
                  </div>
                </div>
                <div class="patient-field">
                  <div class="patient-label">سبب الطلب</div>
                  <div class="patient-value">${sale.requestReason}</div>
                </div>
                <div class="patient-field">
                  <div class="patient-label">تفاصيل الحالة</div>
                  <div class="case-details">${sale.caseDetails || 'لا توجد تفاصيل إضافية'}</div>
                </div>
              </div>
              
              <div class="info-card">
                <h3><i class="fas fa-tint"></i> معلومات المنتج</h3>
                <div style="text-align: center; margin: 10px 0;">
                  <span class="blood-type-display">
                    <i class="fas fa-tint"></i> فصيلة ${sale.bloodType}
                  </span>
                </div>
                <div style="text-align: center; margin: 15px 0;">
                  <div style="font-size: 18px; font-weight: bold; color: #DC143C;">
                    ${sale.productName}
                  </div>
                  <div style="font-size: 14px; color: #6B7280; margin-top: 5px;">
                    ${sale.quantity} ${sale.unit}
                  </div>
                </div>
                <div class="product-details-grid">
                  <div class="product-detail-item">
                    <div class="detail-label">الكمية</div>
                    <div class="detail-value">${sale.quantity}</div>
                  </div>
                  <div class="product-detail-item">
                    <div class="detail-label">سعر الوحدة</div>
                    <div class="detail-value">${sale.unitPrice.toLocaleString()} ل.س</div>
                  </div>
                  <div class="product-detail-item">
                    <div class="detail-label">الإجمالي الفرعي</div>
                    <div class="detail-value">${(sale.quantity * sale.unitPrice).toLocaleString()} ل.س</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="amount-section">
              <h3 style="text-align: center; margin-bottom: 15px; color: #DC143C; font-size: 20px;">💰 تفاصيل المبلغ</h3>
              
              <div class="amount-row">
                <span style="font-size: 16px;">الإجمالي الفرعي:</span>
                <span style="font-size: 16px; font-weight: bold;">${(sale.quantity * sale.unitPrice).toLocaleString()} ل.س</span>
              </div>
              
              <div class="amount-row">
                <span style="font-size: 16px;">الخصم:</span>
                <span style="font-size: 16px; font-weight: bold; color: #EF4444;">- ${sale.discount.toLocaleString()} ل.س</span>
              </div>
              
              <div class="amount-row total-row">
                <span style="font-size: 20px;">الإجمالي النهائي:</span>
                <span style="font-size: 24px; font-weight: bold;">${sale.totalAmount.toLocaleString()} ل.س</span>
              </div>
            </div>
            
            <div class="info-grid">
              <div class="info-card">
                <h3><i class="fas fa-clipboard-check"></i> حالة الطلب</h3>
                <div style="margin: 10px 0;">
                  <span class="status-badge paid-status">✅ ${sale.paymentStatus}</span>
                  <span class="status-badge preparing-status">⏳ ${sale.deliveryStatus}</span>
                </div>
                <div class="patient-field">
                  <div class="patient-label">طريقة الدفع</div>
                  <div class="patient-value">${sale.paymentMethod}</div>
                </div>
              </div>
              
              <div class="info-card">
                <h3><i class="fas fa-sticky-note"></i> ملاحظات إضافية</h3>
                <div class="case-details">${sale.notes || 'لا توجد ملاحظات إضافية'}</div>
              </div>
            </div>
            
            <div class="footer">
              <p style="font-size: 14px; margin-bottom: 8px;">شكراً لتعاملكم مع بنك الدم الوطني - درعا</p>
              <p style="font-size: 12px; opacity: 0.8;">هذه الفاتورة صادرة إلكترونياً من نظام إدارة بنك الدم</p>
              <p style="font-size: 12px; opacity: 0.8;">رقم الاتصال: 123-456-789 | البريد الإلكتروني: info@bloodbank-daraa.sy</p>
              <p style="font-size: 11px; opacity: 0.6; margin-top: 10px;">تاريخ الإصدار: ${new Date().toLocaleString('ar-SA')}</p>
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

  // الحصول على أيقونة المنتج
  const getProductIcon = (productType) => {
    switch(productType) {
      case 'whole_blood': return 'fas fa-tint';
      case 'plasma': return 'fas fa-flask';
      case 'platelets': return 'fas fa-microscope';
      default: return 'fas fa-tint';
    }
  };

  // الحصول على لون درجة الاستعجال
  const getUrgencyColor = (urgencyLevel) => {
    const urgency = urgencyLevels.find(u => u.value === urgencyLevel);
    return urgency ? urgency.color : '#6B7280';
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
              مبيعات الدم ومشتقاته
            </h1>
            <p className="page-subtitle">
              <i className="fas fa-map-marker-alt"></i>
              بنك الدم الوطني - درعا | إدارة عمليات بيع الدم ومشتقاته للمستشفيات
            </p>
            <div className="available-products-banner" style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #DC143C, #B01030)',
              color: 'white',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              <i className="fas fa-check-circle"></i> المنتجات المتاحة للبيع: دم كامل | بلازما | صفائح دموية
            </div>
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

        {/* Search Only */}
        <div className="sales-filters" style={{ justifyContent: 'center' }}>
          <div className="search-box" style={{ width: '500px', maxWidth: '100%' }}>
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="ابحث باسم المستشفى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
                <i className="fas fa-list"></i>
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
                  <th>المريض</th>
                  <th>المنتج</th>
                  <th>الاستعجال</th>
                  <th>المبلغ</th>
                  <th>حالة الدفع</th>
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
                      <div className="patient-info">
                        <div className="patient-avatar">
                          <i className="fas fa-user-injured"></i>
                        </div>
                        <div>
                          <div className="patient-name">{sale.patientInfo.patientName}</div>
                          <div className="patient-details">
                            <span className="patient-age-gender">
                              <i className="fas fa-user-circle"></i>
                              {sale.patientInfo.age} سنة - {sale.patientInfo.gender}
                            </span>
                          </div>
                          <div className="patient-contact">
                            <i className="fas fa-phone"></i>
                            {sale.patientInfo.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="product-info">
                        <div className="product-icon">
                          <i className={getProductIcon(sale.productType)}></i>
                        </div>
                        <div className="product-details">
                          <div className="product-name">{sale.productName}</div>
                          <div className="product-specs">
                            <span className="blood-badge" style={{ backgroundColor: getDeliveryStatusColor(sale.deliveryStatus) }}>
                              <i className="fas fa-tint"></i>
                              {sale.bloodType}
                            </span>
                            <span className="quantity">
                              <i className="fas fa-hashtag"></i>
                              {sale.quantity} {sale.unit}
                            </span>
                          </div>
                          <div className="request-reason" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            <i className="fas fa-stethoscope"></i>
                            {sale.requestReason}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="urgency-info">
                        <div 
                          className="urgency-badge"
                          style={{
                            backgroundColor: `${getUrgencyColor(sale.urgencyLevel)}20`,
                            color: getUrgencyColor(sale.urgencyLevel),
                            border: `1px solid ${getUrgencyColor(sale.urgencyLevel)}`,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}
                        >
                          {sale.urgencyLevel === 'critical' ? '⚠️ حرجة' : 
                           sale.urgencyLevel === 'high' ? '🚨 عالية' : 
                           sale.urgencyLevel === 'medium' ? '⏱️ متوسطة' : '📋 منخفضة'}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="amount-info">
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
          <div className="modal" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>
                <i className="fas fa-hand-holding-usd"></i>
                عملية بيع جديدة - طلب مستشفى
              </h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              {/* معلومات المستشفى والمنتج */}
              <div className="form-section">
                <h4 className="section-title">
                  <i className="fas fa-hospital"></i>
                  معلومات المستشفى والمنتج
                </h4>
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
                      <i className="fas fa-box"></i>
                      نوع المنتج *
                    </label>
                    <select
                      value={newSale.productType}
                      onChange={(e) => {
                        const product = bloodProducts.find(p => p.value === e.target.value);
                        setNewSale({
                          ...newSale, 
                          productType: e.target.value,
                          productName: product?.label || 'دم كامل',
                          unit: product?.unit || 'وحدة'
                        });
                      }}
                      className="form-input"
                      required
                    >
                      {bloodProducts.map(product => (
                        <option key={product.value} value={product.value}>{product.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
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
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
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
                      <span className="input-unit">{newSale.unit}</span>
                    </div>
                    {/* عرض المخزون الحالي */}
                    <div className="stock-info" style={{
                      fontSize: '14px',
                      marginTop: '5px',
                      padding: '5px 10px',
                      background: bloodInventory[newSale.productType]?.[newSale.bloodType] < 10 ? '#FEF3C7' : '#D1FAE5',
                      color: bloodInventory[newSale.productType]?.[newSale.bloodType] < 10 ? '#92400E' : '#065F46',
                      borderRadius: '6px',
                      display: 'inline-block'
                    }}>
                      <i className={`fas ${bloodInventory[newSale.productType]?.[newSale.bloodType] < 10 ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                      المخزون الحالي: <strong>{bloodInventory[newSale.productType]?.[newSale.bloodType] || 0}</strong> {newSale.unit}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* معلومات المريض */}
              <div className="form-section" style={{ marginTop: '25px' }}>
                <h4 className="section-title">
                  <i className="fas fa-user-injured"></i>
                  معلومات المريض
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user"></i>
                      اسم المريض *
                    </label>
                    <input
                      type="text"
                      value={newSale.patientInfo.patientName}
                      onChange={(e) => setNewSale({
                        ...newSale,
                        patientInfo: { ...newSale.patientInfo, patientName: e.target.value }
                      })}
                      className="form-input"
                      placeholder="اسم المريض الكامل"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-id-card"></i>
                      الرقم الوطني *
                    </label>
                    <input
                      type="text"
                      value={newSale.patientInfo.nationalId}
                      onChange={(e) => setNewSale({
                        ...newSale,
                        patientInfo: { ...newSale.patientInfo, nationalId: e.target.value }
                      })}
                      className="form-input"
                      placeholder="الرقم الوطني للمريض"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-phone"></i>
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      value={newSale.patientInfo.phoneNumber}
                      onChange={(e) => setNewSale({
                        ...newSale,
                        patientInfo: { ...newSale.patientInfo, phoneNumber: e.target.value }
                      })}
                      className="form-input"
                      placeholder="رقم هاتف المريض أو المرافق"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-user-circle"></i>
                      الجنس
                    </label>
                    <select
                      value={newSale.patientInfo.gender}
                      onChange={(e) => setNewSale({
                        ...newSale,
                        patientInfo: { ...newSale.patientInfo, gender: e.target.value }
                      })}
                      className="form-input"
                    >
                      {genders.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-birthday-cake"></i>
                      العمر
                    </label>
                    <div className="input-with-unit">
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={newSale.patientInfo.age}
                        onChange={(e) => setNewSale({
                          ...newSale,
                          patientInfo: { ...newSale.patientInfo, age: e.target.value }
                        })}
                        className="form-input"
                        placeholder="عمر المريض"
                      />
                      <span className="input-unit">سنة</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* تفاصيل الطلب */}
              <div className="form-section" style={{ marginTop: '25px' }}>
                <h4 className="section-title">
                  <i className="fas fa-exclamation-triangle"></i>
                  تفاصيل الطلب
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <i className="fas fa-clock"></i>
                      درجة الاستعجال *
                    </label>
                    <select
                      value={newSale.urgencyLevel}
                      onChange={(e) => setNewSale({...newSale, urgencyLevel: e.target.value})}
                      className="form-input"
                      required
                      style={{ borderLeft: `4px solid ${getUrgencyColor(newSale.urgencyLevel)}` }}
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      <i className="fas fa-stethoscope"></i>
                      سبب الطلب *
                    </label>
                    <select
                      value={newSale.requestReason}
                      onChange={(e) => setNewSale({...newSale, requestReason: e.target.value})}
                      className="form-input"
                      required
                    >
                      {requestReasons.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-file-medical"></i>
                    تفاصيل الحالة (اختياري)
                  </label>
                  <textarea
                    value={newSale.caseDetails}
                    onChange={(e) => setNewSale({...newSale, caseDetails: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="وصف تفصيلي للحالة (نوع العملية، تفاصيل الحادث، التشخيص، إلخ)"
                  />
                </div>
              </div>
              
              {/* معلومات الدفع */}
              <div className="form-section" style={{ marginTop: '25px' }}>
                <h4 className="section-title">
                  <i className="fas fa-money-bill-wave"></i>
                  معلومات الدفع
                </h4>
                <div className="form-grid">
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
                        readOnly
                        className="form-input"
                        required
                        style={{ backgroundColor: '#f0f0f0' }}
                      />
                      <span className="input-unit">ل.س</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                      <i className="fas fa-info-circle"></i>
                      السعر: {newSale.customerType === 'مستشفى حكومي' ? 
                      `${newSale.productType === 'plasma' ? '80,000' : 
                        newSale.productType === 'platelets' ? '150,000' : '60,000'} ل.س` : 
                      `${newSale.productType === 'plasma' ? '240,000' : 
                        newSale.productType === 'platelets' ? '425,000' : '200,000'} ل.س`}
                    </div>
                  </div>
                  
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
                </div>
                
                <div className="form-group">
                  <label>
                    <i className="fas fa-credit-card"></i>
                    طريقة الدفع *
                  </label>
                  <select
                    value={newSale.paymentMethod}
                    onChange={(e) => setNewSale({...newSale, paymentMethod: e.target.value})}
                    className="form-input"
                    required
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* ملاحظات إضافية */}
              <div className="form-section" style={{ marginTop: '25px' }}>
                <h4 className="section-title">
                  <i className="fas fa-sticky-note"></i>
                  ملاحظات إضافية
                </h4>
                <div className="form-group">
                  <textarea
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                    className="form-input"
                    rows="3"
                    placeholder="أي ملاحظات إضافية حول الطلب..."
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="price-preview" style={{ marginTop: '25px' }}>
                <h4 className="section-title">
                  <i className="fas fa-file-invoice"></i>
                  معاينة الفاتورة
                </h4>
                <div className="preview-details">
                  <div className="preview-row">
                    <span>المستشفى:</span>
                    <span>{newSale.customerName}</span>
                  </div>
                  <div className="preview-row">
                    <span>اسم المريض:</span>
                    <span>{newSale.patientInfo.patientName || 'لم يتم إدخاله'}</span>
                  </div>
                  <div className="preview-row">
                    <span>المنتج:</span>
                    <span>{newSale.productName} - فصيلة {newSale.bloodType}</span>
                  </div>
                  <div className="preview-row">
                    <span>الكمية:</span>
                    <span>{newSale.quantity} {newSale.unit}</span>
                  </div>
                  <div className="preview-row">
                    <span>درجة الاستعجال:</span>
                    <span>{newSale.urgencyLabel}</span>
                  </div>
                  <div className="preview-row">
                    <span>سبب الطلب:</span>
                    <span>{newSale.requestReason}</span>
                  </div>
                  <div className="preview-row">
                    <span>سعر الوحدة:</span>
                    <span>{formatCurrency(newSale.unitPrice)}</span>
                  </div>
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
                    color: bloodInventory[newSale.productType]?.[newSale.bloodType] - newSale.quantity < 5 ? '#DC2626' : '#059669'
                  }}>
                    <span>
                      <i className="fas fa-boxes"></i>
                      المخزون بعد البيع:
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                      {Math.max(0, (bloodInventory[newSale.productType]?.[newSale.bloodType] || 0) - newSale.quantity)} {newSale.unit}
                    </span>
                  </div>
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
                      <span className="summary-label">اسم المريض:</span>
                      <span className="summary-value">{lastInvoice.patientInfo.patientName}</span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">المنتج:</span>
                      <span className="summary-value">{lastInvoice.productName}</span>
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
                      <span className="summary-value">{lastInvoice.quantity} {lastInvoice.unit}</span>
                    </div>
                    
                    <div className="summary-item">
                      <span className="summary-label">درجة الاستعجال:</span>
                      <span className="summary-value">{lastInvoice.urgencyLabel}</span>
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