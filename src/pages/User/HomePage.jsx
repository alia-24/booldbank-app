/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [stats] = useState({
    donors: 2847,
    lives: 15231
  });
  const [animatedStats, setAnimatedStats] = useState({
    donors: 0,
    lives: 0
  });
  const statsAnimatedRef = useRef(false);

  // إحصائيات المتبرعين حسب الفئة العمرية
  const ageGroupStats = [
    { ageGroup: '18-25 سنة', percentage: 42, donors: 1196 },
    { ageGroup: '26-35 سنة', percentage: 35, donors: 997 },
    { ageGroup: '36-45 سنة', percentage: 15, donors: 427 },
    { ageGroup: '46-55 سنة', percentage: 6, donors: 171 },
    { ageGroup: '56-65 سنة', percentage: 2, donors: 57 }
  ];

  useEffect(() => {
    // تحديث التحية حسب الوقت
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour >= 5 && hour < 12) {
      newGreeting = 'صباح الخير';
    } else if (hour >= 12 && hour < 18) {
      newGreeting = 'مساء الخير';
    } else {
      newGreeting = 'مساء الخير';
    }
    
    setGreeting(newGreeting);

    // تشغيل العدادات مباشرة بدون تأخير
    animateStats();
  }, []);

  const animateStats = () => {
    if (statsAnimatedRef.current) return;
    statsAnimatedRef.current = true;

    const duration = 6000; // 6 ثواني (بطيء جداً)
    
    // easing function بطيئة جداً مع تأخير في البداية والنهاية
    const slowEaseInOut = (t) => {
      // تأخير في البداية ثم حركة بطيئة
      if (t < 0.1) return 0;
      if (t > 0.9) return 1;
      
      // حركة خطية بطيئة في المنتصف
      return (t - 0.1) / 0.8;
    };

    let startTime = null;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = slowEaseInOut(progress);

      const donors = Math.floor(stats.donors * easedProgress);
      const lives = Math.floor(stats.lives * easedProgress);
      
      setAnimatedStats({
        donors,
        lives
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // التأكد من الوصول للقيم النهائية
        setAnimatedStats(stats);
      }
    };

    requestAnimationFrame(animate);
  };

  // دالة للحصول على لون حسب النسبة
  const getPercentageColor = (percentage) => {
    if (percentage >= 35) return 'var(--primary)';
    if (percentage >= 15) return 'var(--daraa-green)';
    if (percentage >= 6) return 'var(--secondary)';
    if (percentage >= 2) return 'var(--warning)';
    return 'var(--info)';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-elements">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className={`floating-element element-${i + 1}`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  background: i % 3 === 0 ? 'var(--primary)' : 
                             i % 3 === 1 ? 'var(--daraa-green)' : 
                             'var(--secondary)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="badge badge-primary">
                  <i className="fas fa-heartbeat"></i> بنك الدم المركزي
                </span>
              </div>
              
              <h1 className="hero-title">
                <span className="text-gradient">{greeting}</span>
                <br />
                <span className="hero-subtitle">
                  كل قطرة دم <span className="text-primary">تنقذ حياة</span>
                </span>
              </h1>
              
              <p className="hero-description">
                ساعدنا في بناء شبكة إنقاذ لأهل المحافظة.
              </p>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card card-primary">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">
                      {animatedStats.donors.toLocaleString()}
                    </h3>
                    <p className="stat-label">متبرع في درعا</p>
                  </div>
                </div>

                <div className="stat-card card-success">
                  <div className="stat-icon">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">
                      {animatedStats.lives.toLocaleString()}
                    </h3>
                    <p className="stat-label">شخص مستفيد</p>
                  </div>
                </div>
              </div>

              {/* Hero Actions */}
              <div className="hero-actions">
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/donate')}
                >
                  <i className="fas fa-heart"></i>
                  <span>سجل كمتبرع</span>
                </button>
                <button 
                  className="btn btn-outline btn-lg"
                  onClick={() => navigate('/guide')}
                >
                  <i className="fas fa-book-medical"></i>
                  <span>تعرف على التبرع</span>
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="heart-animation">
                <i className="fas fa-heart"></i>
              </div>
              <div className="hands-animation">
                <i className="fas fa-hands-helping"></i>
              </div>
              <div className="pulse-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - جدول الإحصائيات حسب العمر */}
      <section className="statistics-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">إحصائيات المتبرعين في درعا</h2>
            <p className="section-subtitle">توزيع المتبرعين حسب الفئة العمرية</p>
          </div>

          <div className="statistics-container">
            {/* جدول الفئات العمرية */}
            <div className="stats-table-section">
              <div className="table-header">
                <h3>
                  <i className="fas fa-user-clock text-primary"></i>
                  توزيع المتبرعين حسب الفئة العمرية
                </h3>
                <p className="table-subtitle">التحليل العمري لمجتمع المتبرعين في درعا</p>
              </div>

              <div className="table-responsive">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>الفئة العمرية</th>
                      <th>النسبة المئوية</th>
                      <th>عدد المتبرعين</th>
                      <th>التمثيل البياني</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageGroupStats.map((stat, index) => (
                      <tr key={index}>
                        <td>
                          <div className="age-group-cell">
                            <i className="fas fa-user-circle"></i>
                            <span className="age-group-text">{stat.ageGroup}</span>
                          </div>
                        </td>
                        <td>
                          <div className="percentage-cell">
                            <span className="percentage-value">{stat.percentage}%</span>
                            <div className="percentage-bar">
                              <div 
                                className="percentage-fill"
                                style={{ 
                                  width: `${stat.percentage}%`,
                                  backgroundColor: getPercentageColor(stat.percentage)
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="donors-count">
                            {stat.donors.toLocaleString()} متبرع
                          </span>
                        </td>
                        <td>
                          <div className="chart-cell">
                            <div className="mini-chart">
                              <div 
                                className="mini-chart-bar"
                                style={{ 
                                  height: `${stat.percentage}%`,
                                  backgroundColor: getPercentageColor(stat.percentage)
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="table-footer">
                        <div className="footer-content">
                          <i className="fas fa-chart-line"></i>
                          <span>إجمالي عدد المتبرعين المسجلين: <strong>2,847</strong> متبرع</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ملاحظات إحصائية */}
            <div className="statistics-notes">
              <div className="notes-card">
                <div className="notes-icon">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <div className="notes-content">
                  <h4>ملاحظات إحصائية</h4>
                  <ul className="notes-list">
                    <li>
                      <i className="fas fa-check text-success"></i>
                      <span>فئة الشباب (18-25 سنة) تشكل <strong>42%</strong> من مجتمع المتبرعين</span>
                    </li>
                    <li>
                      <i className="fas fa-check text-success"></i>
                      <span>فئة البالغين (26-35 سنة) تمثل <strong>35%</strong> من المتبرعين</span>
                    </li>
                    <li>
                      <i className="fas fa-check text-success"></i>
                      <span>الفئتان معاً (18-35 سنة) تشكلان <strong>77%</strong> من مجتمع المتبرعين</span>
                    </li>
                    <li>
                      <i className="fas fa-check text-success"></i>
                      <span>أكبر فئة عمرية (56-65 سنة) تمثل <strong>2%</strong> فقط من المتبرعين</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center mb-4">
            <h2 className="section-title">لماذا تختار بنك الدم درعا؟</h2>
            <p className="section-subtitle">نقدم أفضل تجربة تبرع لك</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>آمن تماماً</h3>
              <p>جميع المعدات معقمة والعمليات تحت إشراف أطباء مختصين</p>
              <div className="feature-badge badge-success">معتمد</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>مواعيد مرنة</h3>
              <p>اختر الموعد المناسب لك من الأحد إلى الخميس</p>
              <div className="feature-badge badge-primary">مريح</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>مجاني بالكامل</h3>
              <p>التبرع بالدم مجاني دون أي رسوم إضافية</p>
              <div className="feature-badge badge-success">مجاني</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-award"></i>
              </div>
              <h3>شهادات تقدير</h3>
              <p>احصل على شهادة تقديرية لكل تبرع</p>
              <div className="feature-badge badge-warning">مميز</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-title">جاهز لإنقاذ حياة؟</h2>
            <p className="cta-text mb-4">
              تبرعك يمكن أن ينقذ 3 أشخاص. سجل الآن وانضم لمجتمع المتبرعين
            </p>
            <div className="cta-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/donate')}
              >
                <i className="fas fa-hand-holding-heart"></i>
                <span>ابدأ التبرع الآن</span>
              </button>
              <button 
                className="btn btn-outline btn-lg"
                onClick={() => navigate('/centers')}
              >
                <i className="fas fa-map-marker-alt"></i>
                <span>اعرف أقرب مركز</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;