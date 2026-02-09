/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import '../../styles/main.css';
import '../../styles/reports.css';
import * as XLSX from 'xlsx';

const ReportsPage = () => {
  // بيانات المخزون
  const [bloodInventory] = useState([
    { type: 'A+', quantity: 45, minQuantity: 20, status: 'جيد', lastUpdated: new Date().toISOString().split('T')[0], price: 35000 },
    { type: 'A-', quantity: 15, minQuantity: 20, status: 'منخفض', lastUpdated: new Date().toISOString().split('T')[0], price: 40000 },
    { type: 'B+', quantity: 38, minQuantity: 20, status: 'جيد', lastUpdated: new Date().toISOString().split('T')[0], price: 35000 },
    { type: 'B-', quantity: 22, minQuantity: 20, status: 'جيد', lastUpdated: new Date().toISOString().split('T')[0], price: 40000 },
    { type: 'AB+', quantity: 12, minQuantity: 15, status: 'حرج', lastUpdated: new Date().toISOString().split('T')[0], price: 45000 },
    { type: 'AB-', quantity: 8, minQuantity: 15, status: 'حرج', lastUpdated: new Date().toISOString().split('T')[0], price: 50000 },
    { type: 'O+', quantity: 62, minQuantity: 25, status: 'ممتاز', lastUpdated: new Date().toISOString().split('T')[0], price: 30000 },
    { type: 'O-', quantity: 29, minQuantity: 20, status: 'جيد', lastUpdated: new Date().toISOString().split('T')[0], price: 42000 }
  ]);

  // حالة لتقارير المتبرعين المكتملين
  const [completedDonors, setCompletedDonors] = useState([]);
  
  // التقارير الأساسية
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('الكل');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activeReport, setActiveReport] = useState(null);
  const [reportPreview, setReportPreview] = useState(false);

  // أنواع التقارير (اثنين فقط)
  const reportTypes = ['الكل', 'مخزون', 'متبرعين'];

  // تحميل بيانات المتبرعين المكتملين من localStorage
  useEffect(() => {
    loadCompletedDonors();
    initializeReports();
  }, []);

  const loadCompletedDonors = () => {
    try {
      const storedDonors = JSON.parse(localStorage.getItem('completed_donors_report') || '[]');
      setCompletedDonors(storedDonors);
    } catch (error) {
      console.error('خطأ في تحميل المتبرعين المكتملين:', error);
      setCompletedDonors([]);
      localStorage.setItem('completed_donors_report', JSON.stringify([]));
    }
  };

  const initializeReports = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleString('ar-SA', { month: 'long', year: 'numeric' });
    
    // التقارير الأساسية المتاحة حالياً
    const initialReports = [
      {
        id: 'REPORT_INV_001',
        title: 'تقرير المخزون',
        type: 'مخزون',
        period: currentMonth,
        generatedBy: 'النظام',
        date: currentDate,
        size: '1.2 MB',
        status: 'مكتمل',
        icon: '🩸',
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
        icon: '👥',
        data: generateDonorsReport()
      }
    ];

    // التقارير المستقبلية (ستتاح لاحقاً)
    const futureReports = [
      {
        id: 'REPORT_MONTHLY_001',
        title: 'التقرير الشهري',
        type: 'مخزون',
        period: 'يناير 2024',
        generatedBy: 'النظام',
        date: '2024-01-31',
        size: '2.1 MB',
        status: 'تحت التطوير',
        icon: '📅',
        data: null,
        available: false
      },
      {
        id: 'REPORT_YEARLY_001',
        title: 'التقرير السنوي',
        type: 'مخزون',
        period: '2024',
        generatedBy: 'النظام',
        date: '2024-12-31',
        size: '3.5 MB',
        status: 'تحت التطوير',
        icon: '📊',
        data: null,
        available: false
      },
      {
        id: 'REPORT_ANALYSIS_001',
        title: 'تقرير التحليل الإحصائي',
        type: 'متبرعين',
        period: 'ربع سنوي',
        generatedBy: 'النظام',
        date: '2024-03-31',
        size: '1.8 MB',
        status: 'تحت التطوير',
        icon: '📈',
        data: null,
        available: false
      },
      {
        id: 'REPORT_COMPARE_001',
        title: 'تقرير المقارنة',
        type: 'مخزون',
        period: 'شهري مقارن',
        generatedBy: 'النظام',
        date: '2024-02-29',
        size: '1.5 MB',
        status: 'تحت التطوير',
        icon: '⚖️',
        data: null,
        available: false
      }
    ];

    const allReports = [...initialReports, ...futureReports];
    setReports(allReports);
    localStorage.setItem('bloodBankReports', JSON.stringify(allReports));
  };

  // توليد تقرير المخزون
  const generateInventoryReport = () => {
    const totalUnits = bloodInventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = bloodInventory.filter(item => item.status === 'منخفض' || item.status === 'حرج').length;
    const totalValue = bloodInventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    const details = bloodInventory.map(item => ({
      'فصيلة الدم': item.type,
      'الكمية المتاحة': `${item.quantity} وحدة`,
      'الحد الأدنى': `${item.minQuantity} وحدة`,
      'الحالة': item.status,
      'تاريخ التحديث': item.lastUpdated,
      'السعر': `${item.price.toLocaleString()} ل.س`
    }));

    return {
      title: 'تقرير المخزون',
      summary: {
        'إجمالي الوحدات': `${totalUnits} وحدة`,
        'فصائل الدم': bloodInventory.length,
        'منخفض المخزون': lowStock,
        'القيمة الإجمالية': `${totalValue.toLocaleString()} ل.س`,
        'متوسط السعر': totalUnits > 0 ? `${Math.round(totalValue / totalUnits).toLocaleString()} ل.س` : '0 ل.س'
      },
      details: details,
      generatedAt: new Date().toLocaleString('ar-SA'),
      recommendations: lowStock > 0 
        ? `يوجد ${lowStock} فصيلة تحتاج تعزيز المخزون`
        : 'المخزون في حالة جيدة'
    };
  };

  // توليد تقرير المتبرعين
  const generateDonorsReport = () => {
    const totalDonors = completedDonors.length;
    const today = new Date().toISOString().split('T')[0];
    
    // المتبرعين هذا الشهر
    const thisMonthDonors = completedDonors.filter(donor => {
      const donorDate = new Date(donor.appointmentDate || donor.completedAt);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      return donorDate.getMonth() === currentMonth && donorDate.getFullYear() === currentYear;
    }).length;

    // تجميع حسب فصيلة الدم
    const bloodTypeCounts = {};
    completedDonors.forEach(donor => {
      const type = donor.bloodType || 'غير معروف';
      bloodTypeCounts[type] = (bloodTypeCounts[type] || 0) + 1;
    });

    // تفاصيل المتبرعين
    const donorDetails = completedDonors.map((donor, index) => ({
      'رقم': index + 1,
      'اسم المتبرع': donor.name || 'غير معروف',
      'رقم الهاتف': donor.phone || 'غير معروف',
      'فصيلة الدم': donor.bloodType || 'غير معروف',
      'تاريخ التبرع': donor.appointmentDate || 'غير معروف',
      'نوع التبرع': donor.donationType || 'تبرع بالدم'
    })).reverse();

    return {
      title: 'تقرير المتبرعين',
      summary: {
        'إجمالي المتبرعين': totalDonors,
        'المتبرعين هذا الشهر': thisMonthDonors,
        'أكثر فصيلة تبرعاً': Object.keys(bloodTypeCounts).length > 0 
          ? Object.entries(bloodTypeCounts).sort((a, b) => b[1] - a[1])[0][0]
          : 'لا توجد بيانات',
        'آخر تبرع': completedDonors.length > 0 
          ? completedDonors[completedDonors.length - 1].appointmentDate || 'غير معروف'
          : 'لا توجد بيانات',
        'متوسط التبرعات/شهر': thisMonthDonors > 0 ? thisMonthDonors : 0
      },
      details: donorDetails,
      generatedAt: new Date().toLocaleString('ar-SA'),
      recommendations: totalDonors > 0 
        ? `تم تسجيل ${totalDonors} متبرع. ${thisMonthDonors} منهم هذا الشهر.`
        : 'لا توجد بيانات عن المتبرعين'
    };
  };

  // تحديث التقارير
  const handleRefreshReports = () => {
    loadCompletedDonors();
    
    const currentDate = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toLocaleString('ar-SA', { month: 'long', year: 'numeric' });
    
    // تحديث التقارير المتاحة فقط
    const updatedReports = reports.map(report => {
      if (report.id === 'REPORT_INV_001' || report.id.startsWith('REPORT_INV_')) {
        return {
          ...report,
          date: currentDate,
          period: currentMonth,
          data: generateInventoryReport()
        };
      }
      if (report.id === 'REPORT_DON_001' || report.id.startsWith('REPORT_DON_')) {
        return {
          ...report,
          date: currentDate,
          period: 'حتى ' + currentDate,
          data: generateDonorsReport()
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    localStorage.setItem('bloodBankReports', JSON.stringify(updatedReports));
    
    alert('✅ تم تحديث التقارير بنجاح!');
  };

  // تصفية التقارير
  const filteredReports = reports.filter(report => {
    if (searchTerm && !report.title.includes(searchTerm) && !report.type.includes(searchTerm)) {
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
    totalReports: reports.filter(r => r.available !== false).length,
    totalDonors: completedDonors.length,
    todayDonors: completedDonors.filter(donor => 
      donor.appointmentDate === new Date().toISOString().split('T')[0]
    ).length,
    totalBloodUnits: bloodInventory.reduce((sum, item) => sum + item.quantity, 0),
    futureReports: reports.filter(r => r.available === false).length
  };

  // ==================== أدوات التصدير ====================
  const exportToPDF = (report) => {
    if (!report.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    const printWindow = window.open('', '_blank');
    const printContent = `
      <html dir="rtl">
        <head>
          <title>${report.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
            body { 
              font-family: 'Cairo', sans-serif; 
              padding: 40px; 
              background: white;
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #DC143C;
            }
            .header h1 { 
              color: #DC143C; 
              margin: 0 0 10px 0;
              font-size: 32px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 20px; 
              margin: 30px 0; 
              background: #f8f9fa;
              padding: 25px;
              border-radius: 15px;
            }
            .info-item { text-align: center; }
            .info-label { 
              font-size: 14px; 
              color: #666; 
              margin-bottom: 8px;
              font-weight: 600;
            }
            .info-value { 
              font-size: 18px; 
              font-weight: 700; 
              color: #DC143C;
            }
            .summary-section { margin: 40px 0; }
            .summary-section h2 { 
              color: #1E6BD6; 
              border-right: 4px solid #1E6BD6;
              padding-right: 15px; 
              margin-bottom: 25px;
              font-size: 24px;
            }
            .summary-grid { 
              display: grid; 
              grid-template-columns: repeat(2, 1fr); 
              gap: 20px;
            }
            .summary-item { 
              background: white; 
              padding: 20px; 
              border: 1px solid #eee; 
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .summary-label { 
              font-size: 15px; 
              color: #666; 
              margin-bottom: 10px;
              display: block;
            }
            .summary-value { 
              font-size: 22px; 
              font-weight: 700; 
              color: #1E6BD6;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
              font-size: 14px;
            }
            th { 
              background: #DC143C; 
              color: white; 
              padding: 15px; 
              text-align: right; 
              font-weight: 600;
              border: 1px solid #fff;
            }
            td { 
              padding: 12px 15px; 
              border: 1px solid #ddd; 
              text-align: right;
            }
            tr:nth-child(even) { background: #f9f9f9; }
            .footer { 
              text-align: center; 
              margin-top: 50px; 
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
            <p style="color: #666; font-size: 16px;">بنك الدم المركزي - درعا</p>
            <p style="color: #888; font-size: 14px;">تاريخ الإنشاء: ${report.data.generatedAt}</p>
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
          </div>
          
          <div class="summary-section">
            <h2>📊 ملخص التقرير</h2>
            <div class="summary-grid">
              ${Object.entries(report.data.summary).map(([key, value]) => `
                <div class="summary-item">
                  <span class="summary-label">${key}</span>
                  <span class="summary-value">${value}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          ${report.data.details && report.data.details.length > 0 ? `
            <div class="summary-section">
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
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 30px 0; border-right: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">💡 التوصيات</h3>
              <p style="color: #856404; margin: 0;">${report.data.recommendations}</p>
            </div>
          ` : ''}
          
          <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة نظام إدارة بنك الدم</p>
            <p>© ${new Date().getFullYear()} بنك الدم المركزي - درعا. جميع الحقوق محفوظة.</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 40px;">
            <button onclick="window.print()" style="
              padding: 15px 40px;
              background: #DC143C;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              margin: 10px;
              font-family: 'Cairo', sans-serif;
            ">
              🖨️ طباعة التقرير
            </button>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const exportToExcel = (report) => {
    if (!report.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    const wsData = [
      [report.title],
      [`بنك الدم المركزي - درعا`],
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
    const wscols = [
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 }
    ];
    ws['!cols'] = wscols;
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'تقرير');
    
    XLSX.writeFile(wb, `${report.title}.xlsx`);
    alert(`تم تصدير ${report.title} كملف Excel`);
  };

  const exportToCSV = (report) => {
    if (!report.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    const csvData = [
      ['تقرير', report.title],
      ['بنك الدم المركزي - درعا'],
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
    
    alert(`تم تصدير ${report.title} كملف CSV`);
  };

  const printReport = (report) => {
    if (!report.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>${report.title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
            body { 
              font-family: 'Cairo', sans-serif; 
              padding: 30px; 
              background: white;
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
              padding-bottom: 15px;
              border-bottom: 3px solid #DC143C;
            }
            .header h1 { 
              color: #DC143C; 
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              font-size: 14px;
            }
            th { 
              background: #DC143C; 
              color: white; 
              padding: 12px; 
              text-align: right; 
              font-weight: 600;
              border: 1px solid #fff;
            }
            td { 
              padding: 10px 12px; 
              border: 1px solid #ddd; 
              text-align: right;
            }
            tr:nth-child(even) { background: #f9f9f9; }
            @media print { 
              button { display: none; } 
              body { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.data.title}</h1>
            <p style="color: #666; font-size: 14px;">بنك الدم المركزي - درعا</p>
            <p style="color: #888; font-size: 12px;">تاريخ الإنشاء: ${report.data.generatedAt}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">
            <h3 style="color: #1E6BD6; margin-top: 0;">ملخص التقرير</h3>
            ${Object.entries(report.data.summary).map(([key, value]) => `
              <p style="margin: 8px 0;"><strong>${key}:</strong> ${value}</p>
            `).join('')}
          </div>
          
          ${report.data.details && report.data.details.length > 0 ? `
            <h3>التفاصيل</h3>
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
          ` : ''}
          
          <div style="text-align: center; margin-top: 40px;">
            <button onclick="window.print()" style="
              padding: 12px 30px;
              background: #DC143C;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              font-family: 'Cairo', sans-serif;
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
    if (!report.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    const emailSubject = encodeURIComponent(`${report.title} - بنك الدم المركزي - درعا`);
    const emailBody = encodeURIComponent(`
التقرير: ${report.data.title}
تاريخ الإنشاء: ${report.data.generatedAt}
النوع: ${report.type}
الفترة: ${report.period}

الملخص:
${Object.entries(report.data.summary).map(([key, value]) => `• ${key}: ${value}`).join('\n')}

---
تم إنشاء هذا التقرير بواسطة نظام إدارة بنك الدم
بنك الدم المركزي - درعا
© ${new Date().getFullYear()} جميع الحقوق محفوظة.
    `);
    
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  };

  // معاينة التقرير
  const previewReport = (report) => {
    setActiveReport(report);
    setReportPreview(true);
  };

  // معاينة التقرير - إجراءات تصدير
  const handleExportAction = (action) => {
    if (!activeReport) {
      alert('يرجى اختيار تقرير أولاً');
      return;
    }

    if (!activeReport.data) {
      alert('هذا التقرير غير متاح حالياً');
      return;
    }

    switch(action) {
      case 'pdf':
        exportToPDF(activeReport);
        break;
      case 'excel':
        exportToExcel(activeReport);
        break;
      case 'csv':
        exportToCSV(activeReport);
        break;
      case 'print':
        printReport(activeReport);
        break;
      case 'email':
        emailReport(activeReport);
        break;
      default:
        alert('إجراء غير معروف');
    }
  };

  return (
    <div className="reports-page">
      <Header />
      
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div>
            <h1 className="page-title">📊 التقارير</h1>
            <p className="page-subtitle">إدارة التقارير المتاحة والمستقبلية</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleRefreshReports}>
              <span>🔄</span> تحديث التقارير
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="reports-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #DC143C, #FF6B6B)' }}>📈</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalReports}</div>
              <div className="stat-label">تقارير متاحة</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #1E6BD6, #60A5FA)' }}>🩸</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalBloodUnits}</div>
              <div className="stat-label">وحدات الدم</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10B981, #34D399)' }}>👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalDonors}</div>
              <div className="stat-label">متبرعين مكتملين</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>🚀</div>
            <div className="stat-content">
              <div className="stat-value">{stats.futureReports}</div>
              <div className="stat-label">تقارير مستقبلية</div>
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
              start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
              end: new Date().toISOString().split('T')[0]
            });
          }}>
            🗑️ مسح الفلاتر
          </button>
        </div>

        {/* Reports Table */}
        <div className="reports-table-container">
          <div className="table-header">
            <h3>📁 التقارير المتاحة والمستقبلية</h3>
            <div className="table-summary">
              <span>عرض {filteredReports.length} من {reports.length} تقرير</span>
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
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className={report.available === false ? 'future-report-row' : ''}>
                    <td>
                      <div className="report-title-cell">
                        <div className="report-icon-small" style={{
                          background: report.available === false ? '#6B7280' : 
                                    report.type === 'مخزون' ? '#DC143C' : '#1E6BD6'
                        }}>
                          {report.icon}
                        </div>
                        <div>
                          <div className="report-name">
                            {report.title}
                            {report.available === false && (
                              <span className="future-badge">🚀 قادم</span>
                            )}
                          </div>
                          <div className="report-id">ID: {report.id}</div>
                          {report.type === 'متبرعين' && report.data && (
                            <div className="report-desc" style={{ fontSize: '12px', color: '#10B981', marginTop: '3px' }}>
                              عدد المتبرعين: {completedDonors.length}
                            </div>
                          )}
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
                      <div className={`status-badge ${report.status === 'تحت التطوير' ? 'status-development' : 'status-completed'}`}>
                        {report.status}
                      </div>
                    </td>
                    <td>
                      <div className="report-actions">
                        {report.available === false ? (
                          <button 
                            className="action-btn disabled-btn"
                            title="غير متاح حالياً"
                            style={{ opacity: 0.5, cursor: 'not-allowed' }}
                          >
                            🔒
                          </button>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* معاينة التقرير */}
        {reportPreview && activeReport && activeReport.data && (
          <div className="report-preview-modal">
            <div className="preview-header">
              <h3>
                {activeReport.icon} {activeReport.title}
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
                  <span className="info-label">الحالة:</span>
                  <span className="info-value status-completed">مكتمل</span>
                </div>
              </div>
              
              <div className="report-summary">
                <h4>📊 ملخص التقرير</h4>
                <div className="summary-grid">
                  {Object.entries(activeReport.data.summary).map(([key, value]) => (
                    <div key={key} className="summary-item">
                      <span className="summary-label">{key}</span>
                      <span className="summary-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {activeReport.data.details && activeReport.data.details.length > 0 ? (
                <div className="report-details">
                  <h4>📋 التفاصيل</h4>
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
                  <p className="table-summary">
                    عرض {activeReport.data.details.length} سجل
                  </p>
                </div>
              ) : (
                <div className="no-data-message" style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                  <h4 style={{ margin: '0 0 10px 0' }}>لا توجد بيانات</h4>
                  <p style={{ margin: 0 }}>لا توجد سجلات متاحة في هذا التقرير</p>
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
                <button className="export-btn" onClick={() => handleExportAction('pdf')}>
                  <span>📄</span> تصدير PDF
                </button>
                <button className="export-btn" onClick={() => handleExportAction('excel')}>
                  <span>📊</span> تصدير Excel
                </button>
                <button className="export-btn" onClick={() => handleExportAction('csv')}>
                  <span>📑</span> تصدير CSV
                </button>
                <button className="export-btn" onClick={() => handleExportAction('print')}>
                  <span>🖨️</span> طباعة مباشرة
                </button>
                <button className="export-btn" onClick={() => handleExportAction('email')}>
                  <span>📧</span> إرسال بالبريد
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
              <button className="tool-btn" onClick={() => handleExportAction('pdf')}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon excel">
                📊
              </div>
              <h4>تصدير Excel</h4>
              <p>تصدير البيانات بصيغة Excel للتحليل</p>
              <button className="tool-btn" onClick={() => handleExportAction('excel')}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon csv">
                📑
              </div>
              <h4>تصدير CSV</h4>
              <p>حفظ البيانات بصيغة CSV للبرامج الأخرى</p>
              <button className="tool-btn" onClick={() => handleExportAction('csv')}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon print">
                🖨️
              </div>
              <h4>طباعة مباشرة</h4>
              <p>طباعة التقرير مباشرة من المتصفح</p>
              <button className="tool-btn" onClick={() => handleExportAction('print')}>
                استخدام الأداة
              </button>
            </div>
            
            <div className="export-tool-card">
              <div className="tool-icon email">
                📧
              </div>
              <h4>إرسال بالبريد</h4>
              <p>إرسال التقرير عبر البريد الإلكتروني</p>
              <button className="tool-btn" onClick={() => handleExportAction('email')}>
                استخدام الأداة
              </button>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="info-card" style={{ 
          background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)', 
          borderRight: '4px solid #0EA5E9',
          padding: '25px',
          borderRadius: '15px',
          marginTop: '30px'
        }}>
          <h4 style={{ color: '#0369A1', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            ℹ️ معلومات عن التقارير
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h5 style={{ color: '#0EA5E9', margin: '0 0 10px 0' }}>✅ التقارير المتاحة:</h5>
              <ul style={{ margin: 0, paddingRight: '20px', color: '#0369A1', fontSize: '14px' }}>
                <li>تقرير المخزون - تحديث فوري</li>
                <li>تقرير المتبرعين - من المواعيد المكتملة</li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: '#F59E0B', margin: '0 0 10px 0' }}>🚀 التقارير المستقبلية:</h5>
              <ul style={{ margin: 0, paddingRight: '20px', color: '#92400E', fontSize: '14px' }}>
                <li>التقرير الشهري - قيد التطوير</li>
                <li>التقرير السنوي - قيد التطوير</li>
                <li>تقرير التحليل الإحصائي - قيد التطوير</li>
                <li>تقرير المقارنة - قيد التطوير</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;