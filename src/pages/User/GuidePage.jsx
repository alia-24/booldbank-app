import React, { useState } from 'react';
import './GuidePage.css';

function GuidePage() {
  const [activeSection, setActiveSection] = useState('conditions');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');

  // معلومات فصائل الدم
  const bloodTypesInfo = [
    {
      type: 'O+',
      name: 'O موجب',
      percentage: '38%',
      description: 'الفصيلة الأكثر شيوعاً في العالم العربي',
      canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
      canReceiveFrom: ['O+', 'O-'],
      importance: 'الأكثر شيوعاً',
      rarity: 'شائع',
      color: '#dc2626'
    },
    {
      type: 'O-',
      name: 'O سالب',
      percentage: '7%',
      description: 'فصيلة الدم الوحيدة التي يمكن نقلها لأي شخص في حالات الطوارئ',
      canDonateTo: ['جميع الفصائل'],
      canReceiveFrom: ['O- فقط'],
      importance: 'المانح العالمي',
      rarity: 'نادر جداً',
      color: '#b91c1c'
    },
    {
      type: 'A+',
      name: 'A موجب',
      percentage: '34%',
      description: 'ثاني أكثر فصيلة دم شيوعاً',
      canDonateTo: ['A+', 'AB+'],
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      importance: 'شائع جداً',
      rarity: 'شائع',
      color: '#1e40af'
    },
    {
      type: 'A-',
      name: 'A سالب',
      percentage: '6%',
      description: 'مطلوب بشكل خاص للعمليات الجراحية المخططة',
      canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
      canReceiveFrom: ['A-', 'O-'],
      importance: 'مهم للعمليات الجراحية',
      rarity: 'نادر نسبياً',
      color: '#1d4ed8'
    },
    {
      type: 'B+',
      name: 'B موجب',
      percentage: '9%',
      description: 'منتشر في منطقة الشرق الأوسط',
      canDonateTo: ['B+', 'AB+'],
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      importance: 'مهم في منطقتك',
      rarity: 'متوسط',
      color: '#7c3aed'
    },
    {
      type: 'B-',
      name: 'B سالب',
      percentage: '2%',
      description: 'من أندر فصائل الدم',
      canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
      canReceiveFrom: ['B-', 'O-'],
      importance: 'نادر جداً',
      rarity: 'نادر جداً',
      color: '#8b5cf6'
    },
    {
      type: 'AB+',
      name: 'AB موجب',
      percentage: '3%',
      description: 'يمكنه استقبال الدم من أي فصيلة',
      canDonateTo: ['AB+ فقط'],
      canReceiveFrom: ['جميع الفصائل'],
      importance: 'المتلقي العالمي',
      rarity: 'نادر',
      color: '#0d9488'
    },
    {
      type: 'AB-',
      name: 'AB سالب',
      percentage: '1%',
      description: 'أندر فصيلة دم في العالم',
      canDonateTo: ['AB+', 'AB-'],
      canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
      importance: 'الأندر',
      rarity: 'نادر للغاية',
      color: '#0891b2'
    }
  ];

  // تصنيف الفصائل حسب الندرة
  const rareTypes = ['O-', 'B-', 'AB-'];
  const commonTypes = ['O+', 'A+'];

  // فلترة الفصائل حسب الندرة
  const filteredBloodTypes = bloodTypesInfo.filter(type => {
    if (bloodTypeFilter === 'all') return true;
    if (bloodTypeFilter === 'rare') return rareTypes.includes(type.type);
    if (bloodTypeFilter === 'common') return commonTypes.includes(type.type);
    return true;
  });

  // فوائد التبرع
  const benefits = [
    {
      icon: 'fas fa-heartbeat',
      title: 'إنقاذ حياة',
      description: 'كل تبرع يمكن أن ينقذ حتى 3 أشخاص'
    },
    {
      icon: 'fas fa-heart',
      title: 'صحة القلب',
      description: 'الحد من مخاطر الإصابة بأمراض القلب والأوعية الدموية'
    },
    {
      icon: 'fas fa-recycle',
      title: 'تجديد الخلايا',
      description: 'يحفز إنتاج خلايا دم جديدة وصحية'
    },
    {
      icon: 'fas fa-stethoscope',
      title: 'فحص صحي مجاني',
      description: 'فحص طبي شامل قبل كل تبرع'
    },
    {
      icon: 'fas fa-burn',
      title: 'حرق السعرات',
      description: 'التبرع يحرق حوالي 650 سعرة حرارية'
    },
    {
      icon: 'fas fa-smile',
      title: 'سعادة نفسية',
      description: 'الشعور بالإنجاز والمساهمة في المجتمع'
    }
  ];

  // موانع التبرع
  const contraindications = {
    permanent: [
      'الإصابة بفيروس نقص المناعة البشرية (الإيدز)',
      'التهاب الكبد الوبائي B أو C',
      'أمراض القلب المزمنة غير المستقرة',
      'السرطان النشط',
      'أمراض الدم المزمنة (الثلاسيميا، فقر الدم المنجلي)',
      'الصرع غير المتحكم به'
    ],
    temporary: [
      'نزلات البرد والإنفلونزا',
      'العلاج بالمضادات الحيوية',
      'الإجراءات الجراحية الحديثة',
      'الوشم أو الثقب خلال آخر 6 أشهر',
      'السفر إلى مناطق موبوءة',
      'الحمل والرضاعة'
    ]
  };

  // نصائح قبل وبعد التبرع
  const tips = {
    before: [
      'احصل على قسط كافٍ من النوم ليلة التبرع',
      'تناول وجبة صحية قبل 2-3 ساعات من التبرع',
      'اشرب الكثير من الماء والسوائل',
      'تجنب الأطعمة الدهنية قبل 24 ساعة',
      'ارتداء ملابس واسعة وذات أكمام قصيرة',
      'إحضار بطاقة الهوية معك'
    ],
    after: [
      'استرح لمدة 10-15 دقيقة بعد التبرع',
      'اشرب سوائل إضافية خلال الـ 24 ساعة التالية',
      'تجنب النشاط البدني الشاق لمدة 24 ساعة',
      'لا تدخن لمدة ساعتين بعد التبرع',
      'تجنب الكحول لمدة 24 ساعة',
      'تناول وجبة خفيفة غنية بالحديد'
    ]
  };

  // الأسئلة الشائعة
  const faqs = [
    {
      question: 'كم مرة يمكنني التبرع بالدم؟',
      answer: 'يمكن للرجال التبرع كل 3 أشهر (4 مرات سنوياً)، والنساء كل 4 أشهر (3 مرات سنوياً).'
    },
    {
      question: 'هل التبرع بالدم مؤلم؟',
      answer: 'يشعر معظم المتبرعين بوخز بسيط عند إدخال الإبرة فقط، ولا يشعرون بأي ألم أثناء عملية التبرع.'
    },
    {
      question: 'كم تستغرق عملية التبرع؟',
      answer: 'تستغرق عملية التبرع الفعلية 10-15 دقيقة، بالإضافة إلى وقت التسجيل والفحص الطبي.'
    },
    {
      question: 'هل هناك أي مخاطر من التبرع؟',
      answer: 'التبرع بالدم آمن تماماً، حيث تستخدم معدات معقمة لمرة واحدة فقط.'
    },
    {
      question: 'هل يمكنني التبرع إذا كنت مدخناً؟',
      answer: 'نعم، ولكن يجب التوقف عن التدخين لمدة 12 ساعة قبل التبرع وساعتين بعده.'
    },
    {
      question: 'ما هو حجم الدم الذي يتم التبرع به؟',
      answer: 'يتم التبرع بحوالي 450 مل من الدم، وهو ما يمثل 8-10% من حجم الدم الكلي للشخص البالغ.'
    }
  ];

  return (
    <div className="guide-page">
      <div className="container">
        {/* عنوان الصفحة */}
        <div className="page-header">
          <h1 className="page-title">
            <i className="fas fa-book-medical"></i>
            دليل التبرع بالدم
          </h1>
          <p className="page-subtitle">
            كل ما تحتاج معرفته عن التبرع بالدم في درعا
          </p>
        </div>

        {/* قائمة التنقل السريع */}
        <div className="quick-nav">
          <button 
            className={`nav-btn ${activeSection === 'conditions' ? 'active' : ''}`}
            onClick={() => setActiveSection('conditions')}
          >
            <i className="fas fa-check-circle"></i>
            شروط التبرع
          </button>
          <button 
            className={`nav-btn ${activeSection === 'blood-types' ? 'active' : ''}`}
            onClick={() => setActiveSection('blood-types')}
          >
            <i className="fas fa-tint"></i>
            فصائل الدم
          </button>
          <button 
            className={`nav-btn ${activeSection === 'benefits' ? 'active' : ''}`}
            onClick={() => setActiveSection('benefits')}
          >
            <i className="fas fa-heart"></i>
            فوائد التبرع
          </button>
          <button 
            className={`nav-btn ${activeSection === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveSection('tips')}
          >
            <i className="fas fa-lightbulb"></i>
            نصائح وإرشادات
          </button>
        </div>

        {/* المحتوى حسب القسم النشط */}
        <div className="guide-content">
          {/* قسم شروط التبرع */}
          {activeSection === 'conditions' && (
            <div className="section-content fade-in">
              <h2 className="section-title">
                <i className="fas fa-check-circle"></i>
                شروط وموانع التبرع
              </h2>
              
              {/* شروط التبرع */}
              <div className="conditions-section">
                <div className="conditions-card">
                  <h3>
                    <i className="fas fa-thumbs-up"></i>
                    شروط التبرع بالدم
                  </h3>
                  <ul className="conditions-list">
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>العمر:</strong> من 18 إلى 65 سنة</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>الوزن:</strong> 50 كيلوغراماً على الأقل</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>الصحة العامة:</strong> عدم الإصابة بأمراض معدية أو مزمنة</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>مستوى الهيموجلوبين:</strong> 12.5 غرام/ديسيلتر للنساء، 13.5 للرجال</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>المدة بين التبرعات:</strong> 3 أشهر للرجال، 4 أشهر للنساء</span>
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      <span><strong>ضغط الدم:</strong> بين 90/60 و 180/100 مم زئبق</span>
                    </li>
                  </ul>
                </div>

                {/* موانع التبرع */}
                <div className="contraindications-section">
                  <div className="contraindications-card permanent">
                    <h3>
                      <i className="fas fa-ban"></i>
                      موانع دائمة للتبرع
                    </h3>
                    <ul>
                      {contraindications.permanent.map((item, index) => (
                        <li key={index}>
                          <i className="fas fa-times-circle"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="contraindications-card temporary">
                    <h3>
                      <i className="fas fa-clock"></i>
                      موانع مؤقتة للتبرع
                    </h3>
                    <ul>
                      {contraindications.temporary.map((item, index) => (
                        <li key={index}>
                          <i className="fas fa-hourglass-half"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* جدول الأهليات */}
              <div className="eligibility-table">
                <h3>
                  <i className="fas fa-table"></i>
                  جدول الأهليات للتبرع
                </h3>
                <table>
                  <thead>
                    <tr>
                      <th>الحالة</th>
                      <th>فترة الانتظار</th>
                      <th>ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>نزلة برد أو إنفلونزا</td>
                      <td>أسبوع بعد الشفاء</td>
                      <td>يجب أن تكون بدون حرارة</td>
                    </tr>
                    <tr>
                      <td>علاج بالمضادات الحيوية</td>
                      <td>أسبوع بعد آخر جرعة</td>
                      <td>إذا كانت العدوى نشطة</td>
                    </tr>
                    <tr>
                      <td>عملية جراحية</td>
                      <td>6 أشهر</td>
                      <td>تتوقف على نوع العملية</td>
                    </tr>
                    <tr>
                      <td>تطعيم (لقاح)</td>
                      <td>تختلف حسب اللقاح</td>
                      <td>24 ساعة إلى 4 أسابيع</td>
                    </tr>
                    <tr>
                      <td>حمل</td>
                      <td>6 أشهر بعد الولادة</td>
                      <td>و 3 أشهر بعد الإجهاض</td>
                    </tr>
                    <tr>
                      <td>سفر دولي</td>
                      <td>تختلف حسب البلد</td>
                      <td>من شهر إلى سنة</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* قسم فصائل الدم */}
          {activeSection === 'blood-types' && (
            <div className="section-content fade-in">
              <h2 className="section-title">
                <i className="fas fa-tint"></i>
                فصائل الدم ومعلوماتها
              </h2>

              {/* فلتر الفصائل */}
              <div className="blood-type-filters">
                <button 
                  className={`filter-btn ${bloodTypeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setBloodTypeFilter('all')}
                >
                  جميع الفصائل
                </button>
                <button 
                  className={`filter-btn ${bloodTypeFilter === 'common' ? 'active' : ''}`}
                  onClick={() => setBloodTypeFilter('common')}
                >
                  الفصائل الشائعة
                </button>
                <button 
                  className={`filter-btn ${bloodTypeFilter === 'rare' ? 'active' : ''}`}
                  onClick={() => setBloodTypeFilter('rare')}
                >
                  الفصائل النادرة
                </button>
              </div>

              {/* معلومات عن التوافق */}
              <div className="compatibility-info">
                <h3>
                  <i className="fas fa-heart"></i>
                  توافق فصائل الدم
                </h3>
                <p>
                  <strong>المانح العام:</strong> O- يمكنه التبرع لأي شخص<br />
                  <strong>المتلقي العام:</strong> AB+ يمكنه استقبال الدم من أي شخص<br />
                  <strong>الأهمية:</strong> الفصائل النادرة مطلوبة بشدة في بنوك الدم
                </p>
              </div>

              {/* شبكة فصائل الدم */}
              <div className="blood-types-grid">
                {filteredBloodTypes.map((bloodType) => (
                  <div 
                    key={bloodType.type} 
                    className="blood-type-card"
                    style={{ borderTopColor: bloodType.color }}
                  >
                    <div className="blood-type-header">
                      <h3>{bloodType.type}</h3>
                      <span className="blood-percentage">{bloodType.percentage}</span>
                    </div>
                    
                    <div className="blood-type-info">
                      <p className="blood-name">{bloodType.name}</p>
                      <p className="blood-description">{bloodType.description}</p>
                      
                      <div className="blood-details">
                        <div className="detail-item">
                          <span className="detail-label">الندرة:</span>
                          <span className={`detail-value rarity-${bloodType.rarity}`}>
                            {bloodType.rarity}
                          </span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">الأهمية:</span>
                          <span className="detail-value">{bloodType.importance}</span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">يتبرع لـ:</span>
                          <span className="detail-value">
                            {Array.isArray(bloodType.canDonateTo) 
                              ? bloodType.canDonateTo.join(', ')
                              : bloodType.canDonateTo}
                          </span>
                        </div>
                        
                        <div className="detail-item">
                          <span className="detail-label">يستقبل من:</span>
                          <span className="detail-value">
                            {Array.isArray(bloodType.canReceiveFrom) 
                              ? bloodType.canReceiveFrom.join(', ')
                              : bloodType.canReceiveFrom}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="blood-type-footer">
                      {rareTypes.includes(bloodType.type) ? (
                        <span className="badge badge-rare">
                          <i className="fas fa-gem"></i> نادر جداً
                        </span>
                      ) : (
                        <span className="badge badge-common">
                          <i className="fas fa-users"></i> شائع
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* جدول التوافق */}
              <div className="compatibility-table">
                <h3>
                  <i className="fas fa-exchange-alt"></i>
                  جدول توافق فصائل الدم
                </h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>فصيلة الدم</th>
                        <th>يمكنها التبرع لـ</th>
                        <th>يمكنها الاستقبال من</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bloodTypesInfo.map((bloodType) => (
                        <tr key={bloodType.type}>
                          <td>
                            <span className="blood-type-cell" style={{ color: bloodType.color }}>
                              <strong>{bloodType.type}</strong> ({bloodType.name})
                            </span>
                          </td>
                          <td>
                            <div className="compatibility-list">
                              {Array.isArray(bloodType.canDonateTo) 
                                ? bloodType.canDonateTo.join(', ')
                                : bloodType.canDonateTo}
                            </div>
                          </td>
                          <td>
                            <div className="compatibility-list">
                              {Array.isArray(bloodType.canReceiveFrom) 
                                ? bloodType.canReceiveFrom.join(', ')
                                : bloodType.canReceiveFrom}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* قسم فوائد التبرع */}
          {activeSection === 'benefits' && (
            <div className="section-content fade-in">
              <h2 className="section-title">
                <i className="fas fa-heart"></i>
                فوائد التبرع بالدم
              </h2>

              {/* فوائد التبرع */}
              <div className="benefits-section">
                <div className="benefits-intro">
                  <p>
                    التبرع بالدم ليس فقط عملاً إنسانياً ينقذ حياة الآخرين، بل له أيضاً فوائد صحية كثيرة للمتبرع.
                    كل تبرع دم هو فرصة للحصول على فحص صحي مجاني وتنشيط الجسم.
                  </p>
                </div>

                <div className="benefits-grid">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="benefit-card">
                      <div className="benefit-icon" style={{ background: `linear-gradient(135deg, ${index % 2 === 0 ? '#dc2626' : '#16a34a'}, ${index % 2 === 0 ? '#b91c1c' : '#0d9488'})` }}>
                        <i className={benefit.icon}></i>
                      </div>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* إحصائيات فوائد التبرع */}
                <div className="benefits-stats">
                  <div className="stat-card">
                    <div className="stat-number">650</div>
                    <div className="stat-label">سعرة حرارية يتم حرقها</div>
                    <div className="stat-description">في كل تبرع</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">3</div>
                    <div className="stat-label">أشخاص يمكن إنقاذهم</div>
                    <div className="stat-description">من كل تبرع</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">88%</div>
                    <div className="stat-label">انخفاض خطر النوبات القلبية</div>
                    <div className="stat-description">للمتبرعين المنتظمين</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">1</div>
                    <div className="stat-label">فحص صحي مجاني</div>
                    <div className="stat-description">في كل زيارة</div>
                  </div>
                </div>

                {/* فوائد للمجتمع */}
                <div className="community-benefits">
                  <h3>
                    <i className="fas fa-hands-helping"></i>
                    فوائد للمجتمع
                  </h3>
                  <div className="community-list">
                    <div className="community-item">
                      <i className="fas fa-hospital"></i>
                      <div>
                        <h4>دعم المستشفيات</h4>
                        <p>توفير الدم للمستشفيات والمراكز الصحية</p>
                      </div>
                    </div>
                    <div className="community-item">
                      <i className="fas fa-ambulance"></i>
                      <div>
                        <h4>الطوارئ والحوادث</h4>
                        <p>تجهيز بنوك الدم لحالات الطوارئ</p>
                      </div>
                    </div>
                    <div className="community-item">
                      <i className="fas fa-user-md"></i>
                      <div>
                        <h4>العمليات الجراحية</h4>
                        <p>توفير الدم اللازم للعمليات المخططة</p>
                      </div>
                    </div>
                    <div className="community-item">
                      <i className="fas fa-baby"></i>
                      <div>
                        <h4>الأطفال والرضع</h4>
                        <p>مساعدة الأطفال المرضى والمواليد</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* قسم النصائح والإرشادات */}
          {activeSection === 'tips' && (
            <div className="section-content fade-in">
              <h2 className="section-title">
                <i className="fas fa-lightbulb"></i>
                نصائح وإرشادات للتبرع
              </h2>

              {/* نصائح قبل وبعد التبرع */}
              <div className="tips-section">
                <div className="tips-before">
                  <h3>
                    <i className="fas fa-clock"></i>
                    قبل التبرع
                  </h3>
                  <ul>
                    {tips.before.map((tip, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tips-after">
                  <h3>
                    <i className="fas fa-check-circle"></i>
                    بعد التبرع
                  </h3>
                  <ul>
                    {tips.after.map((tip, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* عملية التبرع خطوة بخطوة */}
              <div className="donation-process">
                <h3>
                  <i className="fas fa-list-ol"></i>
                  خطوات عملية التبرع
                </h3>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>التسجيل</h4>
                      <p>تقديم المعلومات الشخصية والموافقة على التبرع</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>الفحص الطبي</h4>
                      <p>فحص الضغط، النبض، الهيموجلوبين، والوزن</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>التبرع</h4>
                      <p>عملية سحب الدم تستغرق 10-15 دقيقة</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>الراحة والتغذية</h4>
                      <p>استراحة قصيرة مع مشروب ووجبة خفيفة</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* الأسئلة الشائعة */}
              <div className="faq-section">
                <h3>
                  <i className="fas fa-question-circle"></i>
                  أسئلة شائعة عن التبرع
                </h3>
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <div className="faq-question">
                        <i className="fas fa-question"></i>
                        <h4>{faq.question}</h4>
                      </div>
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* نصائح للمدخنين */}
              <div className="smoking-tips">
                <h3>
                  <i className="fas fa-smoking"></i>
                  نصائح خاصة للمدخنين
                </h3>
                <div className="smoking-content">
                  <div className="smoking-warning">
                    <h4>
                      <i className="fas fa-exclamation-triangle"></i>
                      تحذيرات مهمة
                    </h4>
                    <ul>
                      <li>التدخين قبل التبرع قد يسبب الدوخة والغثيان</li>
                      <li>النيكوتين يؤثر على تدفق الدم</li>
                      <li>يجب التوقف عن التدخين 12 ساعة قبل التبرع</li>
                      <li>تجنب التدخين لمدة ساعتين بعد التبرع</li>
                    </ul>
                  </div>
                  <div className="smoking-benefits">
                    <h4>
                      <i className="fas fa-heart"></i>
                      فوائد التوقف عن التدخين قبل التبرع
                    </h4>
                    <ul>
                      <li>تحسن تدفق الدم</li>
                      <li>تقليل مخاطر الدوخة</li>
                      <li>سرعة الشفاء بعد التبرع</li>
                      <li>تحسين جودة الدم المتبرع به</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* معلومات الاتصال */}
        <div className="contact-info-section">
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="contact-content">
              <h3>للأسئلة والاستفسارات</h3>
              <p>اتصل بنا على الأرقام التالية:</p>
              <div className="contact-numbers">
                <div className="contact-number">
                  <span className="number-label">بنك الدم المركزي:</span>
                  <span className="number-value">6778610</span>
                </div>
                <div className="contact-number">
                  <span className="number-label">طوارئ:</span>
                  <span className="number-value">112</span>
                </div>
                <div className="contact-number">
                  <span className="number-label">البريد الإلكتروني:</span>
                  <span className="number-value">bloodbank@daraa.gov.sy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuidePage;