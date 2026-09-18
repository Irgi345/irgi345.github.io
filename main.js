/* ================================================================
   IRGXYMODS — SHARED JAVASCRIPT (Multi-Page Version)
   ================================================================ */
(function () {
  'use strict';

  // ===== AOS INIT =====
  if (window.AOS) AOS.init({ duration: 650, easing: 'ease-out-expo', once: true, offset: 30 });

  // ===== TOAST =====
  function showToast(message, type) {
    type = type || 'success';
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast-item ' + type;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
  }
  window.showToast = showToast;

  // ===== SETTINGS DROPDOWN =====
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsDropdown = document.getElementById('settingsDropdown');
  if (settingsToggle && settingsDropdown) {
    settingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => settingsDropdown.classList.remove('active'));
    settingsDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    showToast('Tema diubah', 'info');
    settingsDropdown?.classList.remove('active');
  });
  document.getElementById('helpBtn')?.addEventListener('click', () => {
    showToast('Bantuan: Hubungi kami di Telegram @irgxyzmods', 'info');
    settingsDropdown?.classList.remove('active');
  });

  // ===== LOGIN MODAL =====
  const loginModal = document.getElementById('loginModal');
  const loginModalClose = document.getElementById('loginModalClose');
  const loginDropdownBtn = document.getElementById('loginDropdownBtn');
  if (loginDropdownBtn && loginModal) {
    loginDropdownBtn.addEventListener('click', () => {
      loginModal.classList.add('active');
      settingsDropdown?.classList.remove('active');
    });
  }
  loginModalClose?.addEventListener('click', () => loginModal.classList.remove('active'));
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('active');
  });
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
      showToast('Login berhasil!', 'success');
      loginModal.classList.remove('active');
    }, 1500);
  });

  // ===== PROFILE MODAL =====
  const profileModal = document.getElementById('profileModal');
  const profileModalClose = document.getElementById('profileModalClose');
  const profileDropdownBtn = document.getElementById('profileDropdownBtn');
  if (profileDropdownBtn && profileModal) {
    profileDropdownBtn.addEventListener('click', () => {
      profileModal.classList.add('active');
      settingsDropdown?.classList.remove('active');
    });
  }
  profileModalClose?.addEventListener('click', () => profileModal.classList.remove('active'));
  window.addEventListener('click', (e) => {
    if (e.target === profileModal) profileModal.classList.remove('active');
  });
  document.querySelector('.edit-profile')?.addEventListener('click', () =>
    showToast('Fitur edit profil akan segera hadir!', 'info'));
  document.querySelector('.upgrade-premium')?.addEventListener('click', () =>
    showToast('Anda sudah menggunakan paket premium!', 'success'));
  document.querySelector('.logout')?.addEventListener('click', () => {
    showToast('Anda berhasil keluar', 'success');
    setTimeout(() => profileModal.classList.remove('active'), 1000);
  });

  // ===== ACTIVITY SYSTEM =====
  let userActivities = [];
  try {
    const saved = localStorage.getItem('irgxy_activities');
    if (saved) userActivities = JSON.parse(saved);
  } catch (e) {}

  function addActivity(type, title) {
    userActivities.unshift({ id: Date.now(), type, title, timeAgo: 'Baru saja' });
    if (userActivities.length > 10) userActivities = userActivities.slice(0, 10);
    localStorage.setItem('irgxy_activities', JSON.stringify(userActivities));
    updateActivityUI();
    updateProfileStats();
  }
  window.addActivity = addActivity;

  function updateActivityUI() {
    const timeline = document.getElementById('activityTimeline');
    if (!timeline) return;
    timeline.innerHTML = '';
    if (!userActivities.length) {
      timeline.innerHTML = '<div class="no-activity"><i class="fas fa-history"></i><p>Belum ada aktivitas</p><small>Riwayat aktivitas Anda akan muncul di sini</small></div>';
      return;
    }
    userActivities.forEach((act) => {
      const div = document.createElement('div');
      div.className = 'activity-item';
      let iconClass = 'primary';
      if (act.type === 'download') iconClass = 'success';
      else if (act.type === 'share') iconClass = 'warning';
      else if (act.type === 'copy_link') iconClass = 'secondary';
      else if (act.type === 'cheat_download') iconClass = 'warning';
      const icon = act.type === 'download' ? 'download' :
        act.type === 'share' ? 'share-alt' :
        act.type === 'copy_link' ? 'link' :
        act.type === 'cheat_download' ? 'gamepad' : 'circle';
      div.innerHTML = `<div class="activity-icon ${iconClass}"><i class="fas fa-${icon}"></i></div>
        <div class="activity-content"><div class="activity-title">${act.title}</div><div class="activity-time">${act.timeAgo}</div></div>`;
      timeline.appendChild(div);
    });
  }

  function updateProfileStats() {
    const downloads = userActivities.filter(a => a.type === 'download' || a.type === 'cheat_download').length;
    const days = userActivities.length > 0 ? Math.ceil((Date.now() - Math.min(...userActivities.map(a => a.id))) / (1000 * 60 * 60 * 24)) : 0;
    const el1 = document.getElementById('statDownloads');
    const el2 = document.getElementById('statDays');
    if (el1) el1.textContent = downloads || 0;
    if (el2) el2.textContent = days || 0;
  }
  updateActivityUI();
  updateProfileStats();

  // ===== reCAPTCHA MODAL (download) =====
  let currentDownloadUrl = '';
  let currentDownloadAppName = '';

  function showRecaptchaModal() {
    const modal = document.getElementById('recaptchaModal');
    if (!modal) {
      if (currentDownloadUrl && currentDownloadUrl !== '#') {
        window.open(currentDownloadUrl, '_blank');
        showToast('Download ' + currentDownloadAppName + ' dimulai!', 'success');
      }
      return;
    }
    modal.style.display = 'flex';
    const st = document.getElementById('downloadRecaptchaStatus');
    if (st) st.style.display = 'none';
    const btn = document.getElementById('downloadVerifiedBtn');
    if (btn) btn.disabled = true;
    if (window.grecaptcha && window.grecaptcha.reset) window.grecaptcha.reset();
  }

  window.onDownloadRecaptchaSuccess = function () {
    const btn = document.getElementById('downloadVerifiedBtn');
    if (btn) btn.disabled = false;
    const status = document.getElementById('downloadRecaptchaStatus');
    if (status) {
      status.textContent = 'Verifikasi berhasil! Anda dapat melanjutkan download.';
      status.style.display = 'block';
    }
  };
  window.onDownloadRecaptchaExpired = function () {
    const btn = document.getElementById('downloadVerifiedBtn');
    if (btn) btn.disabled = true;
    const status = document.getElementById('downloadRecaptchaStatus');
    if (status) {
      status.textContent = 'Verifikasi telah kedaluwarsa. Silakan verifikasi ulang.';
      status.style.display = 'block';
    }
  };

  document.getElementById('recaptchaModalClose')?.addEventListener('click', () => {
    document.getElementById('recaptchaModal').style.display = 'none';
  });
  window.addEventListener('click', (e) => {
    const m = document.getElementById('recaptchaModal');
    if (e.target === m) m.style.display = 'none';
  });
  document.getElementById('downloadVerifiedBtn')?.addEventListener('click', () => {
    document.getElementById('recaptchaModal').style.display = 'none';
    if (currentDownloadUrl && currentDownloadUrl !== '#') {
      window.open(currentDownloadUrl, '_blank');
      showToast('Download ' + currentDownloadAppName + ' dimulai!', 'success');
      addActivity('download', 'Mengunduh ' + currentDownloadAppName);
    } else {
      showToast('Link download tidak tersedia', 'error');
    }
  });

  // ===== DOWNLOAD / SHARE / COPY =====
  document.addEventListener('click', (e) => {
    const downloadBtn = e.target.closest('.download-btn');
    if (downloadBtn) {
      e.preventDefault();
      currentDownloadUrl = downloadBtn.getAttribute('data-appurl');
      currentDownloadAppName = downloadBtn.getAttribute('data-appname');
      const section = downloadBtn.closest('section');
      if (section && section.id === 'cheat-section') {
        addActivity('cheat_download', 'Mengunduh cheat ' + currentDownloadAppName);
      } else {
        addActivity('download', 'Mengunduh ' + currentDownloadAppName);
      }
      showRecaptchaModal();
      return;
    }
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      const appName = shareBtn.getAttribute('data-appname');
      const appUrl = shareBtn.getAttribute('data-appurl');
      if (navigator.share) {
        navigator.share({ title: appName, text: 'Download ' + appName + ' dari irgxymods.my.id', url: appUrl }).catch(() => {});
      } else { prompt('Salin link ini:', appUrl); }
      addActivity('share', 'Membagikan ' + appName);
      return;
    }
    const copyBtn = e.target.closest('.copy-link-btn');
    if (copyBtn) {
      const url = copyBtn.getAttribute('data-appurl');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => showToast('Link berhasil disalin!', 'success')).catch(() => prompt('Salin link:', url));
      } else { prompt('Salin link:', url); }
      const appName = copyBtn.closest('.app-card')?.querySelector('h3')?.textContent || 'Aplikasi';
      addActivity('copy_link', 'Menyalin link ' + appName);
    }
  });

  // ===== SEARCH (per-page) =====
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const searchTerm = document.getElementById('searchTerm');
  const noResults = document.getElementById('noResults');

  function resetSearch() {
    if (searchResultsInfo) searchResultsInfo.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    document.querySelectorAll('.app-card,.luxury-card,.portfolio-card,.testimonial-card,.feature-card,.stat-card,.tagline-item,.link-card').forEach(c => { c.style.display = ''; });
  }
  function performSearch() {
    if (!searchInput) return;
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return resetSearch();
    const container = document.querySelector('main');
    if (!container) return;
    let found = 0;
    container.querySelectorAll('.app-card,.luxury-card,.portfolio-card,.testimonial-card,.feature-card,.stat-card,.tagline-item,.link-card').forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) { item.style.display = ''; found++; }
      else { item.style.display = 'none'; }
    });
    if (found > 0) {
      if (searchResultsInfo) searchResultsInfo.style.display = 'block';
      if (searchTerm) searchTerm.textContent = '"' + q + '"';
      if (noResults) noResults.style.display = 'none';
    } else {
      if (searchResultsInfo) searchResultsInfo.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
    }
  }
  searchBtn?.addEventListener('click', performSearch);
  searchInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
  clearSearchBtn?.addEventListener('click', () => { searchInput.value = ''; resetSearch(); });

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== CONTACT FORM =====
  window.handleContactForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]')?.value?.trim() || '';
    const email = form.querySelector('input[type="email"]')?.value?.trim() || '';
    const msg = form.querySelector('textarea')?.value?.trim() || '';
    if (name && email && msg) {
      alert('✅ Terima kasih, ' + name + '!\n\nPesan Anda telah diterima. Irgi akan segera menghubungi Anda melalui email: ' + email);
      form.reset();
    } else { showToast('Harap isi semua field', 'error'); }
  };

  // ===== SKILL BARS =====
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if (skillBars.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          if (width) bar.style.width = width;
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });
    skillBars.forEach((b) => obs.observe(b));
  }

  // ===== GOLD PARTICLES =====
  (function createGoldParticles() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
    document.body.appendChild(container);
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.cssText = `position:fixed;width:${2 + Math.random()*6}px;height:${2 + Math.random()*6}px;background:radial-gradient(circle at center,#FFD700 0%,#D4AF37 50%,transparent 70%);border-radius:50%;box-shadow:0 0 20px 5px rgba(255,215,0,0.7),0 0 40px 10px rgba(255,215,0,0.3);pointer-events:none;z-index:-1;animation:floatGold ${15 + Math.random()*25}s linear ${Math.random()*10}s infinite;left:${Math.random()*100}vw;top:${Math.random()*100}vh;`;
      container.appendChild(p);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes floatGold{0%{transform:translateY(100vh) translateX(0) rotate(0deg);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(-100px) translateX(100px) rotate(360deg);opacity:0}}`;
    document.head.appendChild(style);
  })();

  // ===== PORTFOLIO GRID (only on portofolio.html) =====
  const portfolioItems = [
    { id:1, title:'Landing Page Startup Fintech', desc:'Desain modern dengan animasi scroll, dark mode, dan integrasi form booking.', category:'web', emoji:'🏢', tech:['HTML','CSS','JS','Figma'] },
    { id:2, title:'Dashboard Analytics SaaS', desc:'UI kompleks dengan grafik real-time, filter dinamis, dan role-based access.', category:'web', emoji:'📊', tech:['React','Chart.js','Node.js'] },
    { id:3, title:'Game UI Concept — RPG', desc:'Konsep antarmuka game RPG dengan inventory system, skill tree, dan minimap.', category:'uiux', emoji:'🎮', tech:['Figma','Illustrator'] },
    { id:4, title:'APK Mod Legal — Premium Unlocker', desc:'Modifikasi aplikasi open-source dengan fitur premium terbuka secara legal.', category:'apk', emoji:'📱', tech:['Android Studio','Java','Patch'] },
    { id:5, title:'Custom Tool — APK Patcher', desc:'Alat bantu patch legal untuk modifikasi ringan aplikasi Android secara aman.', category:'tools', emoji:'🔧', tech:['Python','ADB','Shell'] },
    { id:6, title:'UI/UX Design — Mobile App', desc:'Desain antarmuka aplikasi mobile modern dengan prinsip UX terbaik.', category:'uiux', emoji:'🖌️', tech:['Figma','Prototyping'] },
    { id:7, title:'Template Website Portfolio', desc:'Desain website portfolio responsif menggunakan HTML, CSS, dan JavaScript murni.', category:'web', emoji:'🎨', tech:['HTML','CSS','JS'] },
    { id:8, title:'Sistem Autentikasi 2FA', desc:'Microservice autentikasi dengan JWT, 2FA, reset password, dan social login.', category:'tools', emoji:'🔐', tech:['Node.js','JWT','MongoDB'] },
  ];

  function renderPortfolioGrid(filter) {
    filter = filter || 'all';
    const grid = document.getElementById('portfolioGridPage');
    const no = document.getElementById('portfolioNoResultsPage');
    if (!grid || !no) return;
    grid.innerHTML = '';
    const filtered = filter === 'all' ? portfolioItems : portfolioItems.filter(i => i.category === filter);
    if (!filtered.length) { grid.classList.add('hidden'); no.classList.remove('hidden'); return; }
    grid.classList.remove('hidden'); no.classList.add('hidden');
    filtered.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'portfolio-item';
      div.style.animation = 'fadeSlideIn 0.4s ease forwards';
      div.style.animationDelay = (idx * 0.06) + 's';
      const techTags = item.tech.map(t => '<span class="tech-tag">' + t + '</span>').join('');
      div.innerHTML = `
        <div class="item-thumb"><span style="font-size:2.8rem;">${item.emoji}</span><span class="item-badge">${item.category.toUpperCase()}</span></div>
        <div class="item-info"><h4>${item.title}</h4><div class="item-desc">${item.desc}</div><div class="item-tech">${techTags}</div>
        <a href="#" class="item-link" onclick="event.preventDefault();alert('Detail: ${item.title}');">🔗 Lihat Detail →</a></div>`;
      div.addEventListener('click', (e) => {
        if (e.target.closest('.item-link')) return;
        alert('📌 ' + item.title + '\n' + item.desc + '\n🛠️ ' + item.tech.join(', '));
      });
      grid.appendChild(div);
    });
  }
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderPortfolioGrid(this.getAttribute('data-filter'));
    });
  });
  if (document.getElementById('portfolioGridPage')) renderPortfolioGrid('all');

  // ===== SHOP RENDERING (proyek.html) =====
  const ecommerceProducts = [
    { id:1, name:'Smartphone Pro X', category:'Elektronik', price:8999000, rating:4.8, emoji:'📱', badge:'terlaris', oldPrice:null },
    { id:2, name:'Laptop UltraSlim 15', category:'Elektronik', price:15499000, rating:4.7, emoji:'💻', badge:'hot', oldPrice:17999000 },
    { id:3, name:'Wireless Headphone ANC', category:'Elektronik', price:1299000, rating:4.5, emoji:'🎧', badge:null, oldPrice:null },
    { id:4, name:'Smartwatch Sport Pro', category:'Elektronik', price:3799000, rating:4.6, emoji:'⌚', badge:'sale', oldPrice:4999000 },
    { id:5, name:'Tablet Draw Pro 12"', category:'Elektronik', price:7299000, rating:4.4, emoji:'📋', badge:null, oldPrice:null },
    { id:6, name:'Kamera Mirrorless 4K', category:'Elektronik', price:12999000, rating:4.9, emoji:'📸', badge:'terlaris', oldPrice:14999000 },
    { id:7, name:'Tas Ransel Premium', category:'Fashion', price:599000, rating:4.3, emoji:'🎒', badge:null, oldPrice:null },
    { id:8, name:'Sepatu Lari Pro Running', category:'Fashion', price:899000, rating:4.6, emoji:'👟', badge:'hot', oldPrice:1199000 },
  ];
  const cuacaProducts = [
    { id:1, name:'Payung Lipat Premium', category:'Aksesoris Hujan', price:149000, rating:4.7, emoji:'☂️', badge:'terlaris', oldPrice:null },
    { id:2, name:'Jas Hujan Fashionable', category:'Aksesoris Hujan', price:299000, rating:4.5, emoji:'🧥', badge:'sale', oldPrice:399000 },
    { id:3, name:'Jaket Waterproof Pro', category:'Pakaian Outdoor', price:499000, rating:4.8, emoji:'🧥', badge:'hot', oldPrice:null },
    { id:4, name:'Sepatu Boot Hujan', category:'Alas Kaki', price:349000, rating:4.4, emoji:'👢', badge:null, oldPrice:null },
    { id:5, name:'Kacamata Hitam UV400', category:'Aksesoris Panas', price:199000, rating:4.6, emoji:'🕶️', badge:'terlaris', oldPrice:null },
    { id:6, name:'Sunblock SPF 50+', category:'Perawatan Kulit', price:89000, rating:4.9, emoji:'🧴', badge:null, oldPrice:null },
  ];
  const portfolioShopProducts = [
    { id:1, name:'Template Portfolio Premium', category:'Template Website', price:299000, rating:4.9, emoji:'🎨', badge:'terlaris', oldPrice:499000 },
    { id:2, name:'Jasa Desain UI/UX Pro', category:'Jasa Kreatif', price:1499000, rating:4.8, emoji:'🎯', badge:'premium', oldPrice:null },
    { id:3, name:'Paket Website Portfolio', category:'Paket Bundling', price:2499000, rating:4.7, emoji:'📦', badge:'hot', oldPrice:3499000 },
    { id:4, name:'Asset Ilustrasi Digital', category:'Aset Digital', price:149000, rating:4.6, emoji:'🖼️', badge:null, oldPrice:null },
  ];
  const authShopProducts = [
    { id:1, name:'Kemeja Flanel Premium', category:'Atasan Pria', price:299000, rating:4.7, emoji:'👔', badge:'terlaris', oldPrice:399000 },
    { id:2, name:'Dress Brokat Elegan', category:'Dress Wanita', price:599000, rating:4.9, emoji:'👗', badge:'hot', oldPrice:null },
    { id:3, name:'Kaos Polos Cotton 30s', category:'Atasan Pria', price:89000, rating:4.5, emoji:'👕', badge:'sale', oldPrice:129000 },
    { id:4, name:'Blouse Kantor Elegan', category:'Atasan Wanita', price:249000, rating:4.6, emoji:'👚', badge:'new', oldPrice:null },
  ];

  function formatPrice(p) { return 'Rp ' + p.toLocaleString('id-ID'); }
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let html = '';
    for (let i = 0; i < full; i++) html += '<span class="star-shop full">★</span>';
    if (half) html += '<span class="star-shop half">★</span>';
    for (let i = 0; i < empty; i++) html += '<span class="star-shop empty">★</span>';
    return html;
  }
  function renderShopProducts(gridId, noId, counterId, data, buyBtnClass) {
    const grid = document.getElementById(gridId);
    const no = document.getElementById(noId);
    const counter = document.getElementById(counterId);
    if (!grid || !no || !counter) return;
    grid.innerHTML = '';
    if (!data.length) { grid.classList.add('hidden'); no.classList.remove('hidden'); counter.textContent = ''; return; }
    grid.classList.remove('hidden'); no.classList.add('hidden');
    counter.textContent = 'Menampilkan ' + data.length + ' produk';
    data.forEach((product, idx) => {
      const card = document.createElement('div');
      card.className = 'product-card-shop';
      card.style.animation = 'fadeSlideIn 0.4s ease forwards';
      card.style.animationDelay = (idx * 0.04) + 's';
      let badgeHTML = '';
      if (product.badge === 'terlaris') badgeHTML = '<span class="product-badge-shop">⭐ Terlaris</span>';
      else if (product.badge === 'hot') badgeHTML = '<span class="product-badge-shop hot">🔥 Hot</span>';
      else if (product.badge === 'sale') badgeHTML = '<span class="product-badge-shop sale">💸 Diskon</span>';
      else if (product.badge === 'premium') badgeHTML = '<span class="product-badge-shop" style="background:linear-gradient(135deg,#ffd700,#ff8f00);color:#1a1a2e;">💎 Premium</span>';
      else if (product.badge === 'new') badgeHTML = '<span class="product-badge-shop" style="background:linear-gradient(135deg,#43e97b,#38f9d7);color:#1a1a2e;">🆕 Baru</span>';
      let priceHTML = '<span class="product-price-shop">' + formatPrice(product.price) + '</span>';
      if (product.oldPrice) priceHTML = '<span class="product-price-shop">' + formatPrice(product.price) + '<span class="old-price-shop">' + formatPrice(product.oldPrice) + '</span></span>';
      card.innerHTML = `
        <div class="product-image-shop" style="background:linear-gradient(135deg,rgba(201,169,110,0.06),transparent);">${badgeHTML}<span class="product-image-emoji">${product.emoji}</span></div>
        <div class="product-info-shop">
          <span class="product-category-shop">${product.category}</span>
          <span class="product-name-shop">${product.name}</span>
          <div class="product-rating-shop"><span class="stars-container-shop">${renderStars(product.rating)}</span><span class="rating-number-shop">${product.rating}</span></div>
          ${priceHTML}
          <button class="${buyBtnClass}"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>Beli</button>
        </div>`;
      card.querySelector('.' + buyBtnClass)?.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('✅ ' + product.name + ' ditambahkan ke keranjang!', 'success');
      });
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        alert('📦 ' + product.name + '\n💰 ' + formatPrice(product.price) + '\n⭐ ' + product.rating + '/5.0');
      });
      grid.appendChild(card);
    });
  }
  function filterShopData(query, data) {
    const q = query.trim().toLowerCase();
    if (!q) return [...data];
    return data.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  window.renderEcommerceProducts = (d) => renderShopProducts('ecommerceProductGrid', 'ecommerceNoResults', 'ecommerceResultsCounter', d, 'buy-btn-shop');
  window.renderCuacaProducts = (d) => renderShopProducts('cuacaProductGrid', 'cuacaNoResults', 'cuacaResultsCounter', d, 'weather-buy-btn');
  window.renderPortfolioShopProducts = (d) => renderShopProducts('portfolioShopProductGrid', 'portfolioShopNoResults', 'portfolioShopResultsCounter', d, 'portfolio-buy-btn');
  window.renderAuthShopProducts = (d) => renderShopProducts('authShopProductGrid', 'authShopNoResults', 'authShopResultsCounter', d, 'auth-buy-btn');

  function bindShopSearch(inputId, clearId, renderFn, data) {
    const inp = document.getElementById(inputId);
    const clr = document.getElementById(clearId);
    if (!inp || !clr) return;
    inp.addEventListener('input', function () {
      clr.classList.toggle('visible', this.value.trim().length > 0);
      renderFn(filterShopData(this.value, data));
    });
    clr.addEventListener('click', () => {
      inp.value = ''; clr.classList.remove('visible'); inp.focus(); renderFn([...data]);
    });
  }
  bindShopSearch('ecommerceSearchInput', 'ecommerceSearchClear', window.renderEcommerceProducts, ecommerceProducts);
  bindShopSearch('cuacaSearchInput', 'cuacaSearchClear', window.renderCuacaProducts, cuacaProducts);
  bindShopSearch('portfolioShopSearchInput', 'portfolioShopSearchClear', window.renderPortfolioShopProducts, portfolioShopProducts);
  bindShopSearch('authShopSearchInput', 'authShopSearchClear', window.renderAuthShopProducts, authShopProducts);

  // Initialize shop on proyek.html if present
  if (document.getElementById('ecommerceProductGrid')) window.renderEcommerceProducts(ecommerceProducts);
  if (document.getElementById('cuacaProductGrid')) window.renderCuacaProducts(cuacaProducts);
  if (document.getElementById('portfolioShopProductGrid')) window.renderPortfolioShopProducts(portfolioShopProducts);
  if (document.getElementById('authShopProductGrid')) window.renderAuthShopProducts(authShopProducts);

// ===== LOGIN STATUS HELPER =====
window.isUserLoggedIn = function () {
  try {
    return localStorage.getItem('irgxy_logged_in') === 'true';
  } catch (e) {
    return false;
  }
};

window.getLoggedInUser = function () {
  try {
    return localStorage.getItem('irgxy_username') || null;
  } catch (e) {
    return null;
  }
};

window.logoutUser = function () {
  try {
    localStorage.removeItem('irgxy_logged_in');
    localStorage.removeItem('irgxy_username');
    showToast('Anda berhasil logout', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } catch (e) {}
};

// Update profile dropdown button: jika sudah login → tampilkan nama, jika belum → redirect login
const profileDropdownBtnEl = document.getElementById('profileDropdownBtn');
if (profileDropdownBtnEl) {
  // Clone untuk remove listener lama
  const newBtn = profileDropdownBtnEl.cloneNode(true);
  profileDropdownBtnEl.parentNode.replaceChild(newBtn, profileDropdownBtnEl);

  newBtn.addEventListener('click', () => {
    if (window.isUserLoggedIn()) {
      // Buka modal profil
      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.add('active');
    } else {
      // Redirect ke halaman login
      window.location.href = 'login.html';
    }
    settingsDropdown?.classList.remove('active');
  });
}

// Intercept tombol login dropdown lama → arahkan ke login.html
const loginDropdownBtnEl = document.getElementById('loginDropdownBtn');
if (loginDropdownBtnEl) {
  const newLoginBtn = loginDropdownBtnEl.cloneNode(true);
  loginDropdownBtnEl.parentNode.replaceChild(newLoginBtn, loginDropdownBtnEl);
  newLoginBtn.addEventListener('click', () => {
    if (window.isUserLoggedIn()) {
      showToast('Anda sudah login sebagai ' + window.getLoggedInUser(), 'info');
    } else {
      window.location.href = 'login.html';
    }
    settingsDropdown?.classList.remove('active');
  });
}

// ===== LOGOUT BUTTON (modal profil) =====
document.querySelector('.profile-action-btn.logout')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.logoutUser();
});

  console.log('✅ IRGXYMODS shared script loaded');
})();