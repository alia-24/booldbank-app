/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/reports.css';
import * as XLSX from 'xlsx';

const ReportsPage = () => {
  // بيانات المخزون الحقيقية
  const [bloodInventory] = useState([
    { type: 'A+', quantity: 45, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-24', price: 35000 },
    { type: 'A-', quantity: 15, minQuantity: 20, status: 'منخفض', lastUpdated: '2024-01-24', price: 40000 },
    { type: 'B+', quantity: 38, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-23', price: 35000 },
    { type: 'B-', quantity: 22, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-23', price: 40000 },
    { type: 'AB+', quantity: 12, minQuantity: 15, status: 'حرج', lastUpdated: '2024-01-22', price: 45000 },
    { type: 'AB-', quantity: 8, minQuantity: 15, status: 'حرج', lastUpdated: '2024-01-22', price: 50000 },
    { type: 'O+', quantity: 62, minQuantity: 25, status: 'ممتاز', lastUpdated: '2024-01-24', price: 30000 },
    { type: 'O-', quantity: 29, minQuantity: 20, status: 'جيد', lastUpdated: '2024-01-24', price: 42000 }
  ]);

  // بيانات المتبرعين الحقيقية
  const [donorsData] = useState([
    { id: 1, name: 'أحمد محمد', bloodType: 'A+', lastDonation: '2024-01-20', totalDonations: 5, status: 'نشط' },
    { id: 2, name: 'سارة خالد', bloodType: 'O-', lastDonation: '2024-01-18', totalDonations: 3, status: 'نشط' },
    { id: 3, name: 'محمد علي', bloodType: 'B+', lastDonation: '2024-01-15', totalDonations: 7, status: 'نشط' },
    { id: 4, name: 'فاطمة حسن', bloodType: 'AB+', lastDonation: '2023-12-28', totalDonations: 2, status: 'غير نشط' },
    { id: 5, name: 'خالد مصطفى', bloodType: 'A-', lastDonation: '2024-01-10', totalDonations: 4, status: 'نشط' }
  ]);

  // بيانات المبيعات (للتقارير المالية فقط)
  const [salesData] = useState([
    { id: 'SALE_001', hospital: 'مستشفى درعا الوطني', bloodType: 'A+', quantity: 3, price: 105000, date: '2024-01-24', time: '10:30' },
    { id: 'SALE_002', hospital: 'مستشفى الصنمين', bloodType: 'O-', quantity: 2, price: 84000, date: '2024-01-23', time: '14:15' },
    { id: 'SALE_003', hospital: 'مستشفى الشيخ مسكين', bloodType: 'B+', quantity: 4, price: 140000, date: '2024-01-22', time: '09:45' },
    { id: 'SALE_004', hospital: 'مستشفى ازرع', bloodType: 'AB+', quantity: 1, price: 45000, date: '2024-01-21', time: '16:20' },
    { id: 'SALE_005', hospital: 'مستشفى النزهة', bloodType: 'A-', quantity: 2, price: 80000, date: '2024-01-20', time: '11:10' }
  ]);

  // التقارير
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');
  const [dateRange, setDateRange] = useState({
    start: '2024-01-01',
    end: new Date().toISOString().split('T')[0]
  });
  const [activeReport, setActiveReport] = useState(null);
  const [reportPreview, setReportPreview] = useState(false);

  // أنواع التقارير (بدون مبيعات)
  const reportTypes = ['الكل', 'مخزون', 'متبرعين', 'طوارئ', 'جودة', 'مالي'];

  // === دوال توليد التقارير ===
  const generateInventoryReport = () => {
    const totalUnits = bloodInventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = bloodInventory.filter(item => item.status === 'منخفض' || item.status === 'حرج').length;
    const totalValue = bloodInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    return {
      title: 'تقرير المخزون الشهري',
      type: 'مخزون',
      summary: {
        'إجمالي الوحدات': totalUnits,
        'فصائل الدم': bloodInventory.length,
        'منخفض المخزون': lowStock,
        'القيمة الإجمالية': `${totalValue.toLocaleString()} ل.س`,
        'متوسط السعر': totalUnits > 0 ? `${Math.round(totalValue / totalUnits).toLocaleString()} ل.س` : '0 ل.س'
      },
      details: bloodInventory,
      generatedAt: new Date().toLocaleString('ar-SA'),
      recommendations: lowStock > 0 
        ? `يوجد ${lowStock} فصيلة تحتاج تعزيز المخزون`
        : 'المخزون في حالة جيدة'
    };
  };

  const generateDonorsReport = () => {
    const activeDonors = donorsData.filter(d => d.status === 'نشط').length;
    const totalDonations = donorsData.reduce((sum, d) => sum + d.totalDonations, 0);
    const recentDonors = donorsData.filter(d => 
      new Date(d.lastDonation) > new Date(new Date().setDate(new Date().getDate() - 30))
    ).length;

    return {
      title: 'تقرير المتبرعين',
      type: 'متبرعين',
      summary: {
        'إجمالي المتبرعين': donorsData.length,
        'متبرعين نشطين': activeDonors,
        'إجمالي التبرعات': totalDonations,
        'متبرعين حديثاً': recentDonors,
        'متوسط التبرعات': donorsData.length > 0 ? (totalDonations / donorsData.length).toFixed(1) : '0'
      },
      details: donorsData,
      generatedAt: new Date().toLocaleString('ar-SA')
    };
  };

  // === تم إزالة generateMonthlySalesReport بالكامل ===

  const generateEmergencyReport = () => {
    const criticalStocks = bloodInventory.filter(item => item.status === 'حرج');
    const lowStocks = bloodInventory.filter(item => item.status === 'منخفض');
    const urgentNeeds = [...criticalStocks, ...lowStocks];
    
    return {
      title: 'تقرير حالة الطوارئ',
      type: 'طوارئ',
      summary: {
        'فصائل حرجة': criticalStocks.length,
        'فصائل منخفضة': lowStocks.length,
        'إجمالي العاجل': urgentNeeds.length,
        'الفصائل الحرجة': criticalStocks.length > 0 
          ? criticalStocks.map(s => s.type).join(', ')
          : 'لا توجد فصائل حرجة'
      },
      details: urgentNeeds,
      generatedAt: new Date().toLocaleString('ar-SA'),
      recommendations: urgentNeeds.length > 0 
        ? 'يجب اتخاذ إجراءات عاجلة لتعبئة المخزون المنخفض'
        : 'لا توجد حالات طوارئ'
    };
  };

  const generateQualityReport = () => {
    const qualityChecks = [
      { test: 'فحص HIV', passed: 100, total: 100, date: '2024-01-24' },
      { test: 'فحص Hepatitis', passed: 99, total: 100, date: '2024-01-24' },
      { test: 'فحص Syphilis', passed: 100, total: 100, date: '2024-01-23' },
      { test: 'فحص الدم الكامل', passed: 98, total: 100, date: '2024-01-23' },
      { test: 'فحص التخزين', passed: 100, total: 100, date: '2024-01-22' }
    ];

    const passRate = qualityChecks.reduce((sum, q) => sum + (q.passed / q.total), 0) / qualityChecks.length * 100;

    return {
      title: 'تقرير الجودة',
      type: 'جودة',
      summary: {
        'إجمالي الفحوصات': qualityChecks.length,
        'نسبة النجاح': `${passRate.toFixed(1)}%`,
        'فحوصات فاشلة': qualityChecks.filter(q => q.passed < q.total).length,
        'آخر تاريخ فحص': qualityChecks[0].date
      },
      details: qualityChecks,
      generatedAt: new Date().toLocaleString('ar-SA'),
      status: passRate >= 95 ? 'ممتاز' : 'مقبول'
    };
  };

  const generateFinancialReport = () => {
    const totalRevenue = salesData.reduce((sum, s) => sum + (s.price || 0), 0);
    const expenses = {
      salaries: 1500000,
      equipment: 800000,
      maintenance: 400000,
      supplies: 300000,
      other: 200000
    };
    const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
    const profit = totalRevenue - totalExpenses;

    return {
      title: 'التقرير المالي الشهري',
      type: 'مالي',
      summary: {
        'الإيرادات الإجمالية': `${totalRevenue.toLocaleString()} ل.س`,
        'المصروفات الإجمالية': `${totalExpenses.toLocaleString()} ل.س`,
        'صافي الربح': `${profit.toLocaleString()} ل.س`,
        'هامش الربح': totalRevenue > 0 ? `${((profit / totalRevenue) * 100).toFixed(1)}%` : '0%',
        'متوسط الإيرادات اليومي': `${Math.round(totalRevenue / 30).toLocaleString()} ل.س`
      },
      revenueDetails: salesData,
      expenseDetails: expenses,
      generatedAt: new Date().toLocaleString('ar-SA')
    };
  };

  // تهيئة التقارير تلقائياً
  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleString('ar-SA', { month: 'long', year: 'numeric' });
    
    // توليد التقارير الأساسية فقط (بدون تقارير مبيعات)
    const autoGeneratedReports = [
      {
        id: 'REPORT_INV_001',
        title: 'تقرير المخزون الشهري',
        type: 'مخزون',
        period: currentMonth,
        generatedBy: 'النظام',
        date: currentDate,
        size: '1.2 MB',
        status: 'مكتمل',
        isMonthlyReport: true,
        data: generateInventoryReport()
      },
      {
        id: 'REPORT_DON_001',
        title: 'تقرير المتبرعين',
        type: 'متبرعين',
        period: 'حتى ' + currentDate,
        generatedBy: 'النظام',
        date: currentDate,
        size: '0.8 MB',
        status: 'مكتمل',
        data: generateDonorsReport()
      },
      // === تم إزالة تقرير المبيعات الشهري ===
      {
        id: 'REPORT_EMERG_001',
        title: 'تقرير حالة الطوارئ',
        type: 'طوارئ',
        period: 'أخر تحديث',
        generatedBy: 'النظام',
        date: currentDate,
        size: '0.5 MB',
        status: 'مكتمل',
        data: generateEmergencyReport()
      },
      {
        id: 'REPORT_QUAL_001',
        title: 'تقرير الجودة',
        type: 'جودة',
        period: 'ربع سنوي',
        generatedBy: 'فريق الجودة',
        date: currentDate,
        size: '0.9 MB',
        status: 'مكتمل',
        data: generateQualityReport()
      },
      {
        id: 'REPORT_FIN_001',
        title: 'التقرير المالي الشهري',
        type: 'مالي',
        period: currentMonth,
        generatedBy: 'الإدارة المالية',
        date: currentDate,
        size: '1.4 MB',
        status: 'مكتمل',
        data: generateFinancialReport()
      }
    ];

    // تحميل التقارير المحفوظة من localStorage
    const savedReports = JSON.parse(localStorage.getItem('bloodBankReports')) || [];
    
    // تصفية التقارير المحفوظة لإزالة أي تقارير مبيعات
    const filteredSavedReports = savedReports.filter(report => report.type !== 'مبيعات');
    
    // دمج التقارير
    const allReports = [
      ...autoGeneratedReports,
      ...filteredSavedReports
    ];
    
    setReports(allReports);

    // حفظ التقارير في localStorage
    localStorage.setItem('bloodBankReports', JSON.stringify(allReports));

  }, []);

  // تحديث التقارير
  const refreshReports = () => {
    // إعادة تحميل التقارير من localStorage
    const savedReports = JSON.parse(localStorage.getItem('bloodBankReports')) || [];
    const filteredReports = savedReports.filter(report => report.type !== 'مبيعات');
    setReports(filteredReports);
  };

  // تصفية التقارير
  const filteredReports = reports.filter(report => {
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.type.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedType !== 'الكل' && report.type !== selectedType) {
      return false;
    }
    if (dateRange.start && new Date(report.date) < new Date(dateRange.start)) {
      return false;
    }
    if (dateRange.end && new Date(report.date) > new Date(dateRange.end)) {
      return false;
    }
    
    return true;
  });

  // إحصائيات
  const stats = {
    totalReports: reports.length,
    monthlyReports: reports.filter(r => r.isMonthlyReport).length,
    thisMonth: reports.filter(r => {
      const reportDate = new Date(r.date);
      const today = new Date();
      return reportDate.getMonth() === today.getMonth() && reportDate.getFullYear() === today.getFullYear();
    }).length
  };

  // تحديث البيانات يدويًا
  const handleRefreshData = () => {
    refreshReports();
    alert('تم تحديث البيانات بنجاح!');
  };

  // ==================== أدوات التصدير الكاملة ====================

  const exportToPDF = (report) => {
    const printContent = `
      <html dir="rtl">
        <head>
          <title>${report.title} - PDF</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            body { 
              font-family: 'Cairo', sans-serif; 
              padding: 30px; 
              background: white;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #DC143C;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #DC143C;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin: 30px 0;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
            }
            .info-item {
              text-align: center;
            }
            .info-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .info-value {
              font-size: 18px;
              font-weight: bold;
              color: #DC143C;
            }
            .summary-section {
              margin: 30px 0;
            }
            .summary-section h2 {
              color: #1E6BD6;
              border-right: 4px solid #1E6BD6;
              padding-right: 15px;
              margin-bottom: 20px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .summary-item {
              background: white;
              padding: 15px;
              border: 1px solid #eee;
              border-radius: 8px;
            }
            .summary-label {
              font-size: 14px;
              color: #666;
            }
            .summary-value {
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }
            .table-section {
              margin: 30px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background: #DC143C;
              color: white;
              padding: 12px;
              text-align: right;
              font-weight: 600;
            }
            td {
              padding: 10px;
              border: 1px solid #ddd;
              text-align: right;
            }
            tr:nth-child(even) {
              background: #f9f9f9;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.data.title}</h1>
            <p>بنك الدم الوطني - درعا</p>
            <p>تاريخ الإنشاء: ${report.data.generatedAt}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">نوع التقرير</div>
              <div class="info-value">${report.type}</div>
            </div>
            <div class="info-item">
              <div class="info-label">الفترة</div>
              <div class="info-value">${report.period}</div>
            </div>
            <div class="info-item">
              <div class="info-label">الحالة</div>
              <div class="info-value">${report.status}</div>
            </div>
          </div>
          
          <div class="summary-section">
            <h2>📊 ملخص التقرير</h2>
            <div class="summary-grid">
              ${Object.entries(report.data.summary).map(([key, value]) => `
                <div class="summary-item">
                  <div class="summary-label">${key}</div>
                  <div class="summary-value">${value}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${report.data.details && report.data.details.length > 0 ? `
            <div class="table-section">
              <h2>📋 التفاصيل</h2>
              <table>
                <thead>
                  <tr>
                    ${Object.keys(report.data.details[0]).map(key => 
                      `<th>${key}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${report.data.details.map(item => `
                    <tr>
                      ${Object.values(item).map(val => 
                        `<td>${val}</td>`
                      ).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
          
          ${report.data.recommendations ? `
            <div class="summary-section">
              <h2>💡 التوصيات</h2>
              <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-right: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-weight: 500;">
                  ${report.data.recommendations}
                </p>
              </div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة نظام إدارة بنك الدم</p>
            <p>© ${new Date().getFullYear()} بنك الدم الوطني. جميع الحقوق محفوظة.</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="
              padding: 12px 30px;
              background: #DC143C;
              color: white;
              border: none;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
              margin: 10px;
            ">
              🖨️ طباعة التقرير
            </button>
            <button onclick="window.close()" style="
              padding: 12px 30px;
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
              margin: 10px;
            ">
              ✕ إغلاق
            </button>
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    alert(`تم إنشاء ${report.title} جاهز للطباعة/الحفظ كـ PDF`);
  };

  const exportToExcel = (report) => {
    const wsData = [
      [report.data.title],
      [`تاريخ الإنشاء: ${report.data.generatedAt}`],
      [`النوع: ${report.type}`],
      [`الفترة: ${report.period}`],
      [],
      ['الملخص'],
      ...Object.entries(report.data.summary).map(([key, value]) => [key, value]),
      [],
    ];

    if (report.data.details && report.data.details.length > 0) {
      wsData.push(['التفاصيل']);
      wsData.push(Object.keys(report.data.details[0]));
      wsData.push(...report.data.details.map(item => Object.values(item)));
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // تنسيق الخلايا
    const wscols = [
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = wscols;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تقرير');
    
    XLSX.writeFile(wb, `${report.title}.xlsx`);
    alert(`تم تصدير ${report.title} كـ Excel`);
  };

  const exportToCSV = (report) => {
    const csvData = [
      ['تقرير', report.data.title],
      ['تاريخ الإنشاء', report.data.generatedAt],
      ['النوع', report.type],
      ['الفترة', report.period],
      [],
      ['الملخص'],
      ...Object.entries(report.data.summary).map(([key, value]) => [key, value]),
      []
    ];

    if (report.data.details && report.data.details.length > 0) {
      csvData.push(['التفاصيل']);
      csvData.push(Object.keys(report.data.details[0]));
      csvData.push(...report.data.details.map(item => Object.values(item)));
    }

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title}.csv`;
    link.click();
    
    alert(`تم تصدير ${report.title} كـ CSV`);
  };

  const printReport = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: 'Cairo', Arial, sans-serif; padding: 20px; }
            h1 { color: #DC143C; text-align: center; border-bottom: 3px solid #DC143C; padding-bottom: 10px; }
            .info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
            th { background: #DC143C; color: white; }
            .summary { margin: 30px 0; }
            .summary-item { margin: 10px 0; }
            @media print { 
              button { display: none; } 
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>${report.data.title}</h1>
          
          <div class="info">
            <p><strong>تاريخ الإنشاء:</strong> ${report.data.generatedAt}</p>
            <p><strong>النوع:</strong> ${report.type}</p>
            <p><strong>الفترة:</strong> ${report.period}</p>
          </div>
          
          <div class="summary">
            <h3>الملخص</h3>
            ${Object.entries(report.data.summary).map(([key, value]) => 
              `<div class="summary-item"><strong>${key}:</strong> ${value}</div>`
            ).join('')}
          </div>
          
          ${report.data.details && report.data.details.length > 0 ? `
            <h3>التفاصيل</h3>
            <table>
              <thead>
                <tr>
                  ${Object.keys(report.data.details[0]).map(key => `<th>${key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${report.data.details.map(item => `
                  <tr>
                    ${Object.values(item).map(val => `<td>${val}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
          
          <div style="text-align: center; margin-top: 40px;">
            <button onclick="window.print()" style="
              padding: 10px 30px;
              background: #DC143C;
              color: white;
              border: none;
              border-radius: 5px;
              font-size: 16px;
              cursor: pointer;
            ">
              🖨️ طباعة التقرير
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const emailReport = (report) => {
    const emailSubject = encodeURIComponent(`${report.title} - بنك الدم الوطني`);
    const emailBody = encodeURIComponent(`
التقرير: ${report.data.title}
تاريخ الإنشاء: ${report.data.generatedAt}
النوع: ${report.type}
الفترة: ${report.period}

الملخص:
${Object.entries(report.data.summary).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

---
تم إنشاء هذا التقرير بواسطة نظام إدارة بنك الدم
بنك الدم الوطني
© ${new Date().getFullYear()} جميع الحقوق محفوظة.
    `);
    
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  };

  // === معاينة التقرير ===
  const previewReport = (report) => {
    setActiveReport(report);
    setReportPreview(true);
  };

  return (
    <div className="reports-page">
      <Header />
      
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="page-title">📊 التقارير والإحصائيات</h1>
            <p className="page-subtitle">نظام التقارير الشهرية - تقارير المخزون والمتبرعين والمالية والجودة</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleRefreshData}>
              <span>🔄</span> تحديث البيانات
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="reports-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3B82F6' }}>📈</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalReports}</div>
              <div className="stat-label">إجمالي التقارير</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#10B981' }}>📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.monthlyReports}</div>
              <div className="stat-label">تقارير شهرية</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#F59E0B' }}>✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.thisMonth}</div>
              <div className="stat-label">هذا الشهر</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="reports-filters">
          <div className="filter-group">
            <label>🔍 بحث</label>
            <input
              type="text"
              placeholder="ابحث في التقارير..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>📂 النوع</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>📅 من تاريخ</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>📅 إلى تاريخ</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="filter-input"
            />
          </div>
          
          <button className="filter-reset" onClick={() => {
            setSearchTerm('');
            setSelectedType('الكل');
            setDateRange({
              start: '2024-01-01',
              end: new Date().toISOString().split('T')[0]
            });
          }}>
            🗑️ مسح الفلاتر
          </button>
        </div>

        {/* Reports Table */}
        <div className="reports-table-container">
          <div className="table-header">
            <h3>📁 التقارير المتاحة</h3>
            <div className="table-summary">
              <span>عرض {filteredReports.length} تقرير</span>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>اسم التقرير</th>
                  <th>النوع</th>
                  <th>الفترة</th>
                  <th>التاريخ</th>
                  <th>الحجم</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className={`main-report-row ${report.isMonthlyReport ? 'monthly-report' : ''}`}>
                    <td>
                      <div className="report-title-cell">
                        <div className="report-icon-small">
                          {report.type === 'مخزون' ? '🩸' : 
                           report.type === 'متبرعين' ? '👥' : 
                           report.type === 'طوارئ' ? '🚨' : 
                           report.type === 'جودة' ? '⭐' : '💳'}
                        </div>
                        <div>
                          <div className="report-name">
                            {report.title}
                          </div>
                          <div className="report-id">ID: {report.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`type-badge type-${report.type}`}>
                        {report.type}
                      </div>
                    </td>
                    <td>
                      <div className="report-period">{report.period}</div>
                    </td>
                    <td>
                      <div className="report-date">{report.date}</div>
                    </td>
                    <td>
                      <div className="report-size">{report.size}</div>
                    </td>
                    <td>
                      <div className="report-actions">
                        <button 
                          className="action-btn view-btn"
                          onClick={() => previewReport(report)}
                          title="معاينة"
                        >
                          👁️
                        </button>
                        <button 
                          className="action-btn download-btn"
                          onClick={() => exportToPDF(report)}
                          title="PDF"
                        >
                          📄
                        </button>
                        <button 
                          className="action-btn excel-btn"
                          onClick={() => exportToExcel(report)}
                          title="Excel"
                        >
                          📊
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* معاينة التقرير */}
        {reportPreview && activeReport && (
          <div className="report-preview-modal">
            <div className="preview-header">
              <h3>
                {activeReport.type === 'مخزون' ? '🩸' : 
                 activeReport.type === 'متبرعين' ? '👥' : 
                 activeReport.type === 'طوارئ' ? '🚨' : 
                 activeReport.type === 'جودة' ? '⭐' : '💳'}
                {activeReport.title}
              </h3>
              <button className="close-btn" onClick={() => setReportPreview(false)}>✕</button>
            </div>
            
            <div className="preview-content">
              <div className="report-info">
                <div className="info-item">
                  <span className="info-label">تاريخ الإنشاء:</span>
                  <span className="info-value">{activeReport.data.generatedAt}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">الفترة:</span>
                  <span className="info-value">{activeReport.period}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">نوع التقرير:</span>
                  <span className="info-value">
                    {activeReport.isMonthlyReport ? 'شهري' : activeReport.type}
                  </span>
                </div>
              </div>
              
              <div className="report-summary">
                <h4>📋 ملخص التقرير</h4>
                <div className="summary-grid">
                  {Object.entries(activeReport.data.summary).map(([key, value]) => (
                    <div key={key} className="summary-item">
                      <span className="summary-label">{key}</span>
                      <span className="summary-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {activeReport.data.details && activeReport.data.details.length > 0 && (
                <div className="report-details">
                  <h4>📊 التفاصيل</h4>
                  <div className="details-table">
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(activeReport.data.details[0]).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {activeReport.data.details.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item).map((value, idx) => (
                              <td key={idx}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {activeReport.data.recommendations && (
                <div className="report-recommendations">
                  <h4>💡 التوصيات</h4>
                  <p>{activeReport.data.recommendations}</p>
                </div>
              )}
            </div>
            
            <div className="preview-footer">
              <div className="export-buttons">
                <button className="export-btn" onClick={() => exportToPDF(activeReport)}>
                  <span>📄</span> PDF
                </button>
                <button className="export-btn" onClick={() => exportToExcel(activeReport)}>
                  <span>📊</span> Excel
                </button>
                <button className="export-btn" onClick={() => exportToCSV(activeReport)}>
                  <span>📑</span> CSV
                </button>
                <button className="export-btn" onClick={() => printReport(activeReport)}>
                  <span>🖨️</span> طباعة
                </button>
                <button className="export-btn" onClick={() => emailReport(activeReport)}>
                  <span>📧</span> بريد إلكتروني
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Tools */}
        <div className="export-section">
          <h3>📤 أدوات تصدير التقارير</h3>
          <p className="section-subtitle">اختر التقرير ثم اضغط على أداة التصدير المطلوبة</p>
          
          <div className="export-tools">
            <div className="export-tool-card">
              <div className="tool-icon pdf">
                📄
              </div>
              <h4>تصدير PDF</h4>
              <p>حفظ التقرير بصيغة PDF جاهزة للطباعة</p>
              <button className="tool-btn" onClick={() => {
                if (activeReport) exportToPDF(activeReport);
                else alert('يرجى اختيار تقرير أولاً من الجدول أعلاه');
              }}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon excel">
                📊
              </div>
              <h4>تصدير Excel</h4>
              <p>تصدير البيانات بصيغة Excel للتحليل</p>
              <button className="tool-btn" onClick={() => {
                if (activeReport) exportToExcel(activeReport);
                else alert('يرجى اختيار تقرير أولاً من الجدول أعلاه');
              }}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon csv">
                📑
              </div>
              <h4>تصدير CSV</h4>
              <p>حفظ البيانات بصيغة CSV للبرامج الأخرى</p>
              <button className="tool-btn" onClick={() => {
                if (activeReport) exportToCSV(activeReport);
                else alert('يرجى اختيار تقرير أولاً من الجدول أعلاه');
              }}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon print">
                🖨️
              </div>
              <h4>طباعة مباشرة</h4>
              <p>طباعة التقرير مباشرة من المتصفح</p>
              <button className="tool-btn" onClick={() => {
                if (activeReport) printReport(activeReport);
                else alert('يرجى اختيار تقرير أولاً من الجدول أعلاه');
              }}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon email">
                📧
              </div>
              <h4>إرسال بالبريد</h4>
              <p>إرسال التقرير عبر البريد الإلكتروني</p>
              <button className="tool-btn" onClick={() => {
                if (activeReport) emailReport(activeReport);
                else alert('يرجى اختيار تقرير أولاً من الجدول أعلاه');
              }}>
                استخدام الأداة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;