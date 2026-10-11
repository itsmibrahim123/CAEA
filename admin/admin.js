/**
 * CAEA Admin Dashboard Controller (admin/admin.js)
 * Connects UI interactions to DataStore API.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let activeTab = 'applications';
  let activeEditId = null;
  let activeAppDetailId = null;

  // DOM Elements
  const authGate = document.getElementById('admin-auth-gate');
  const authForm = document.getElementById('auth-form');
  const authPasscode = document.getElementById('auth-passcode');
  const authError = document.getElementById('auth-error');
  const btnLock = document.getElementById('btn-lock-console');

  // Stats
  const statActivities = document.getElementById('stat-activities-count');
  const statMapPins = document.getElementById('stat-mappins-count');
  const statPeople = document.getElementById('stat-people-count');
  const statArticles = document.getElementById('stat-articles-count');
  const statApplications = document.getElementById('stat-applications-count');
  const statOpportunities = document.getElementById('stat-opportunities-count');
  const tabBadgeApplications = document.getElementById('tab-badge-applications');
  const tabBadgeMapPins = document.getElementById('tab-badge-mappins');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.admin-panel');
  const subtabBtns = document.querySelectorAll('.subtab-btn');
  const subtabContents = document.querySelectorAll('.subtab-content');

  // Tables
  const tableActivitiesBody = document.getElementById('table-activities-body');
  const tableFossilArticlesBody = document.getElementById('table-fossil-articles-body');
  const tableTextileCardsBody = document.getElementById('table-textile-cards-body');
  const tableClimateReportsBody = document.getElementById('table-climate-reports-body');
  const tableMapPinsBody = document.getElementById('table-mappins-body');
  const tablePeopleBody = document.getElementById('table-people-body');
  const tableArticlesBody = document.getElementById('table-articles-body');
  const tableApplicationsBody = document.getElementById('table-applications-body');
  const tableOpportunitiesBody = document.getElementById('table-opportunities-body');

  // Filters & Search
  const searchActivities = document.getElementById('search-activities');
  const filterActivitiesTag = document.getElementById('filter-activities-tag');

  const searchFossilArticles = document.getElementById('search-fossil-articles');
  const filterFossilArticlesTag = document.getElementById('filter-fossil-articles-tag');
  const btnAddFossilArticle = document.getElementById('btn-add-fossil-article');

  const searchTextileCards = document.getElementById('search-textile-cards');
  const filterTextileTag = document.getElementById('filter-textile-tag');
  const btnAddTextileCard = document.getElementById('btn-add-textile-card');

  const searchClimateReports = document.getElementById('search-climate-reports');
  const filterClimateTag = document.getElementById('filter-climate-tag');
  const btnAddClimateReport = document.getElementById('btn-add-climate-report');

  const searchMapPins = document.getElementById('search-mappins');
  const btnAddMapPin = document.getElementById('btn-add-map-pin');

  const searchPeople = document.getElementById('search-people');
  const filterPeopleCategory = document.getElementById('filter-people-category');

  const searchArticles = document.getElementById('search-articles');
  const filterArticlesTag = document.getElementById('filter-articles-tag');

  const searchApplications = document.getElementById('search-applications');
  const filterApplicationsStatus = document.getElementById('filter-applications-status');
  const filterApplicationsCategory = document.getElementById('filter-applications-category');
  const btnExportApplicationsCSV = document.getElementById('btn-export-applications-csv');

  const searchOpportunities = document.getElementById('search-opportunities');
  const filterOpportunitiesStatus = document.getElementById('filter-opportunities-status');

  // Universal CRUD Modal
  const modalDialog = document.getElementById('admin-modal-dialog');
  const crudForm = document.getElementById('admin-crud-form');
  const modalTitle = document.getElementById('modal-form-title');
  const formCollectionInput = document.getElementById('form-collection');
  const formRecordIdInput = document.getElementById('form-record-id');
  const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');

  // Application Detail Modal
  const appDetailDialog = document.getElementById('admin-app-detail-dialog');
  const appStatusForm = document.getElementById('app-status-form');
  const btnCloseAppDetail = document.getElementById('btn-close-app-detail');
  const btnCancelAppDetail = document.getElementById('btn-cancel-app-detail');
  const btnDeleteApp = document.getElementById('btn-delete-app');

  // Action Buttons
  const btnAddActivity = document.getElementById('btn-add-activity');
  const btnAddPerson = document.getElementById('btn-add-person');
  const btnAddArticle = document.getElementById('btn-add-article');
  const btnAddOpportunity = document.getElementById('btn-add-opportunity');
  const btnExportData = document.getElementById('btn-export-data');
  const inputImportFile = document.getElementById('input-import-file');
  const btnResetData = document.getElementById('btn-reset-data');

  // Sub-Tab 1: Fossil Fuel Phaseout Elements
  const btnSaveFossilSettings = document.getElementById('btn-save-fossil-settings');
  const settingWorkFossilVisible = document.getElementById('setting-work-fossil-visible');
  const settingWorkFossilTitle = document.getElementById('setting-work-fossil-title');
  const settingWorkFossilSubtitle = document.getElementById('setting-work-fossil-subtitle');
  const settingWorkFossilDesc = document.getElementById('setting-work-fossil-desc');
  const settingWorkFossilBtnText = document.getElementById('setting-work-fossil-btn-text');
  const settingWorkFossilOppTitle = document.getElementById('setting-work-fossil-opp-title');
  const settingWorkFossilBannerTitle = document.getElementById('setting-work-fossil-banner-title');
  const settingWorkFossilBannerSub = document.getElementById('setting-work-fossil-banner-sub');
  const settingWorkFossilBannerBtnText = document.getElementById('setting-work-fossil-banner-btn-text');

  // Sub-Tab 2: Textile & Fast Fashion Elements
  const btnSaveTextileSettings = document.getElementById('btn-save-textile-settings');
  const settingWorkTextileVisible = document.getElementById('setting-work-textile-visible');
  const settingWorkTextileBannerTitle = document.getElementById('setting-work-textile-banner-title');
  const settingWorkTextileBannerSub = document.getElementById('setting-work-textile-banner-sub');
  const settingWorkTextileBannerBtnText = document.getElementById('setting-work-textile-banner-btn-text');
  const settingWorkTextileIconStyle = document.getElementById('setting-work-textile-icon-style');
  const settingWorkTextileTitle = document.getElementById('setting-work-textile-title');
  const settingWorkTextileSubtitle = document.getElementById('setting-work-textile-subtitle');
  const settingWorkTextileArchPattern = document.getElementById('setting-work-textile-arch-pattern');
  const settingWorkTextileDesc = document.getElementById('setting-work-textile-desc');
  const settingWorkTextileBtnText = document.getElementById('setting-work-textile-btn-text');
  const settingWorkTextileOppTitle = document.getElementById('setting-work-textile-opp-title');
  const settingWorkTextileSecHeading = document.getElementById('setting-work-textile-sec-heading');
  const settingWorkTextileSecIntro = document.getElementById('setting-work-textile-sec-intro');

  // Sub-Tab 3: Climate Justice Elements
  const btnSaveClimateSettings = document.getElementById('btn-save-climate-settings');
  const settingWorkClimateVisible = document.getElementById('setting-work-climate-visible');
  const settingWorkClimateBannerTitle = document.getElementById('setting-work-climate-banner-title');
  const settingWorkClimateBannerSub = document.getElementById('setting-work-climate-banner-sub');
  const settingWorkClimateBannerBtnText = document.getElementById('setting-work-climate-banner-btn-text');
  const settingWorkClimateTitle = document.getElementById('setting-work-climate-title');
  const settingWorkClimateSubtitle = document.getElementById('setting-work-climate-subtitle');
  const settingWorkClimateDesc = document.getElementById('setting-work-climate-desc');
  const settingWorkClimateBtnText = document.getElementById('setting-work-climate-btn-text');
  const settingWorkClimateOppTitle = document.getElementById('setting-work-climate-opp-title');

  // Sub-Tab 4: Activities & Gatherings Elements
  const btnSaveActivitiesSettings = document.getElementById('btn-save-activities-settings');
  const btnSaveGatheringCallout = document.getElementById('btn-save-gathering-callout');
  const settingWorkActBannerTitle = document.getElementById('setting-work-act-banner-title');
  const settingWorkActBannerSub = document.getElementById('setting-work-act-banner-sub');
  const settingWorkActBannerBtnText = document.getElementById('setting-work-act-banner-btn-text');
  const settingWorkActHeroQuote = document.getElementById('setting-work-act-hero-quote');
  const settingWorkActHeroAuthor = document.getElementById('setting-work-act-hero-author');
  const settingWorkActHeroHeading = document.getElementById('setting-work-act-hero-heading');
  const settingWorkActHeroDesc = document.getElementById('setting-work-act-hero-desc');
  const settingWorkActGatheringVisible = document.getElementById('setting-work-act-gathering-visible');
  const settingWorkActGatheringTitle = document.getElementById('setting-work-act-gathering-title');
  const settingWorkActGatheringDesc = document.getElementById('setting-work-act-gathering-desc');
  const settingWorkActGatheringDate = document.getElementById('setting-work-act-gathering-date');
  const settingWorkActGatheringBtnText = document.getElementById('setting-work-act-gathering-btn-text');
  const settingWorkActGatheringLink = document.getElementById('setting-work-act-gathering-link');
  const settingWorkActGatheringModal = document.getElementById('setting-work-act-gathering-modal');
  const tabBadgeActivities = document.getElementById('tab-badge-activities');

  /* ============================================================
     1. Image Resolution Helper
     ============================================================ */
  function resolveAdminImg(path, fallback = 'Assets/CAEA-Navbar-Logo.png') {
    if (!path) return '../' + fallback;
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path;
    }
    if (path.startsWith('../')) {
      return path;
    }
    if (path.startsWith('/')) {
      return '..' + path;
    }
    return '../' + path;
  }

  // Security Master Hashes (SHA-256)
  // Primary Master Key: 'CAEA@Admin#2026!'
  const MASTER_HASH = '0bd52dc00fb3e853b13ee73b111a4d1e7ff453ed865812db6a11a6cee533f221';
  // Legacy Key Support: 'caea2024'
  const LEGACY_HASH = 'f8ce72e90f230559f515ee0420e6a4b1b369c733364f849ecb13bd600fae24be';

  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_MS = 60 * 1000; // 60 seconds
  let lockoutTimerInterval = null;

  async function sha256Hex(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const btnTogglePwd = document.getElementById('btn-toggle-pwd');
  const btnUnlockAuth = document.getElementById('btn-unlock-auth');

  if (btnTogglePwd && authPasscode) {
    btnTogglePwd.addEventListener('click', () => {
      const isPassword = authPasscode.type === 'password';
      authPasscode.type = isPassword ? 'text' : 'password';
      const eyeOpen = btnTogglePwd.querySelector('.eye-open');
      const eyeClosed = btnTogglePwd.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  function checkLockout() {
    const lockoutUntil = parseInt(sessionStorage.getItem('caea_auth_lockout_until') || '0', 10);
    const now = Date.now();
    if (lockoutUntil && lockoutUntil > now) {
      const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
      setLockoutState(remainingSec);
      return true;
    }
    clearLockoutState();
    return false;
  }

  function setLockoutState(seconds) {
    if (btnUnlockAuth) btnUnlockAuth.disabled = true;
    if (authPasscode) authPasscode.disabled = true;
    if (authError) {
      authError.classList.add('lockout-active');
      authError.textContent = `Security lockout active. Too many failed attempts. Try again in ${seconds}s.`;
    }

    if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
    lockoutTimerInterval = setInterval(() => {
      const lockoutUntil = parseInt(sessionStorage.getItem('caea_auth_lockout_until') || '0', 10);
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(lockoutTimerInterval);
        clearLockoutState();
      } else if (authError) {
        authError.textContent = `Security lockout active. Too many failed attempts. Try again in ${remaining}s.`;
      }
    }, 1000);
  }

  function clearLockoutState() {
    if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
    sessionStorage.removeItem('caea_auth_lockout_until');
    sessionStorage.setItem('caea_auth_failed_attempts', '0');
    if (btnUnlockAuth) btnUnlockAuth.disabled = false;
    if (authPasscode) authPasscode.disabled = false;
    if (authError) {
      authError.classList.remove('lockout-active');
      authError.textContent = '';
    }
  }

  /* ============================================================
     2. Authentication Gate
     ============================================================ */
  function checkAuth() {
    const isAuth = sessionStorage.getItem('caea_admin_auth');
    if (isAuth === 'true') {
      authGate.classList.add('hidden');
      initConsole();
    } else {
      authGate.classList.remove('hidden');
      checkLockout();
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (checkLockout()) return;

      const inputVal = authPasscode.value.trim();
      if (!inputVal) return;

      const inputHash = await sha256Hex(inputVal);
      const customHash = localStorage.getItem('caea_admin_custom_passhash');

      // Server-side authentication when connected
      if (window.DataStore && window.DataStore.apiBase) {
        try {
          const sAuth = await window.DataStore.login(inputVal, inputHash);
          if (sAuth && sAuth.success) {
            sessionStorage.setItem('caea_admin_auth', 'true');
            sessionStorage.setItem('caea_auth_failed_attempts', '0');
            authError.textContent = '';
            authGate.classList.add('hidden');
            showToast('Console unlocked successfully (PHP Session Verified)');
            initConsole();
            return;
          }
        } catch (err) {
          console.warn('Server auth check encountered issue, verifying client fallback:', err);
        }
      }

      if (inputHash === MASTER_HASH || inputHash === LEGACY_HASH || (customHash && inputHash === customHash)) {
        sessionStorage.setItem('caea_admin_auth', 'true');
        sessionStorage.setItem('caea_auth_failed_attempts', '0');
        authError.textContent = '';
        authGate.classList.add('hidden');
        showToast('Console unlocked successfully');
        initConsole();
      } else {
        const failed = parseInt(sessionStorage.getItem('caea_auth_failed_attempts') || '0', 10) + 1;
        sessionStorage.setItem('caea_auth_failed_attempts', failed.toString());

        if (failed >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_MS;
          sessionStorage.setItem('caea_auth_lockout_until', lockoutUntil.toString());
          setLockoutState(60);
        } else {
          const remainingAttempts = MAX_FAILED_ATTEMPTS - failed;
          authError.textContent = `Invalid administrative passcode. (${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining)`;
        }
      }
    });
  }

  if (btnLock) {
    btnLock.addEventListener('click', () => {
      if (window.DataStore && window.DataStore.apiBase) {
        window.DataStore.logout();
      }
      sessionStorage.removeItem('caea_admin_auth');
      authPasscode.value = '';
      authGate.classList.remove('hidden');
      checkLockout();
      showToast('Console locked');
    });
  }

  /* ============================================================
     3. Main Console Initialization
     ============================================================ */
  function initConsole() {
    updateStats();
    renderAllTables();
    populateApplicationCategoryFilter();
    loadPageSettingsIntoUI();
  }

  function updateStats() {
    if (!window.DataStore) return;
    const activitiesCount = window.DataStore.get('activities').length;
    const mapPinsCount = window.DataStore.get('mapPins').length;
    const peopleCount = window.DataStore.get('people').length;
    const articlesCount = window.DataStore.get('articles').length;
    const applicationsCount = window.DataStore.get('applications').length;
    const opportunitiesCount = window.DataStore.get('opportunities').length;

    if (statActivities) statActivities.textContent = activitiesCount;
    if (statMapPins) statMapPins.textContent = mapPinsCount;
    if (statPeople) statPeople.textContent = peopleCount;
    if (statArticles) statArticles.textContent = articlesCount;
    if (statApplications) statApplications.textContent = applicationsCount;
    if (statOpportunities) statOpportunities.textContent = opportunitiesCount;
    if (tabBadgeApplications) tabBadgeApplications.textContent = applicationsCount;
    if (tabBadgeMapPins) tabBadgeMapPins.textContent = mapPinsCount;
    if (tabBadgeActivities) tabBadgeActivities.textContent = activitiesCount;
  }

  /* ============================================================
     4. Tab Switching
     ============================================================ */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      activeTab = targetTab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (targetTab === 'activities') {
        // Direct jump to Activities & Gatherings in Our Work panel
        panels.forEach(panel => {
          panel.classList.toggle('active', panel.id === 'panel-our-work');
        });
        subtabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-subtab') === 'activities'));
        subtabContents.forEach(c => c.classList.toggle('active', c.id === 'subtab-activities'));
        return;
      }

      panels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  const statCardActivities = statActivities ? statActivities.closest('.stat-card') : null;
  if (statCardActivities) {
    statCardActivities.style.cursor = 'pointer';
    statCardActivities.title = 'Click to open Activities & Gatherings';
    statCardActivities.addEventListener('click', () => {
      const actBtn = document.querySelector('.tab-btn[data-tab="activities"]');
      if (actBtn) actBtn.click();
    });
  }

  // Sub-Tab Switching (for Our Work panel)
  subtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-subtab');
      subtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      subtabContents.forEach(c => c.classList.toggle('active', c.id === `subtab-${target}`));
    });
  });

  /* ============================================================
     5. Table Rendering Functions
     ============================================================ */
  function renderAllTables() {
    renderApplicationsTable();
    renderMapPinsTable();
    renderPeopleTable();
    renderActivitiesTable();
    renderFossilArticlesTable();
    renderTextileCardsTable();
    renderClimateReportsTable();
    renderArticlesTable();
    renderOpportunitiesTable();
  }

  // 5.1 Pakistan Map Location Pins Table
  function renderMapPinsTable() {
    if (!tableMapPinsBody || !window.DataStore) return;
    let items = window.DataStore.get('mapPins');
    const query = searchMapPins ? searchMapPins.value.toLowerCase().trim() : '';

    if (query) {
      items = items.filter(i =>
        (i.city && i.city.toLowerCase().includes(query)) ||
        (i.badge && i.badge.toLowerCase().includes(query)) ||
        (i.description && i.description.toLowerCase().includes(query))
      );
    }

    if (items.length === 0) {
      tableMapPinsBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No map pins found matching criteria.</td></tr>`;
      return;
    }

    tableMapPinsBody.innerHTML = items.map((item, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${item.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#a3d88d; box-shadow:0 0 6px rgba(163,216,141,0.6);"></span>
            <strong style="color:#ffffff;">${escapeHtml(item.city)}</strong>
          </div>
        </td>
        <td>
          <span style="font-family:monospace; font-size:12px; color:#798dff; background:rgba(79,103,237,0.1); padding:3px 8px; border-radius:4px;">
            Left: ${escapeHtml(item.left || '50%')}, Top: ${escapeHtml(item.top || '50%')}
          </span>
        </td>
        <td>
          <span class="table-badge" style="background:rgba(163,216,141,0.15); color:#a3d88d; border:1px solid rgba(163,216,141,0.3);">
            ${escapeHtml(item.badge || item.city)}
          </span>
        </td>
        <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#9da5b4;">
          ${escapeHtml(item.description || '—')}
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('mapPins', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('mapPins', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('mapPins', '${item.id}')" title="Edit Map Pin">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('mapPins', '${item.id}')" title="Delete Map Pin">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.2 Activities & Our Work Table

  function renderActivitiesTable() {
    if (!tableActivitiesBody || !window.DataStore) return;
    let items = window.DataStore.get('activities');
    const query = searchActivities ? searchActivities.value.toLowerCase().trim() : '';
    const tag = filterActivitiesTag ? filterActivitiesTag.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.location && i.location.toLowerCase().includes(query)) ||
        (i.description && i.description.toLowerCase().includes(query)) ||
        (i.quote && i.quote.toLowerCase().includes(query)) ||
        (i.quoteAuthor && i.quoteAuthor.toLowerCase().includes(query))
      );
    }
    if (tag) {
      items = items.filter(i => (i.category || '').toUpperCase() === tag.toUpperCase());
    }

    if (items.length === 0) {
      tableActivitiesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No activities or gatherings found matching criteria.</td></tr>`;
      return;
    }

    tableActivitiesBody.innerHTML = items.map((item, index) => {
      const isFeatured = item.featured === true || item.featured === 1 || item.featured === '1' || item.featured === 'true';
      const galleryCount = Array.isArray(item.images) ? item.images.length : (item.images ? 1 : 0);
      const catClass = (item.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

      return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${item.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </div>
        </td>
        <td>
          <div style="position:relative; width:48px; height:36px;">
            <img src="${resolveAdminImg(item.image, 'Assets/Hero-image.png')}" alt="" class="table-media-thumb" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
            ${galleryCount > 1 ? `<span style="position:absolute; bottom:-3px; right:-3px; background:#4b68ff; color:#fff; font-size:9.5px; font-weight:700; border-radius:10px; padding:1px 4px; line-height:1;" title="${galleryCount} slideshow photos">📷${galleryCount}</span>` : ''}
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <strong>${escapeHtml(item.title)}</strong>
            ${isFeatured ? `<span class="table-badge featured-star" style="font-size:10px; padding:2px 7px;">★ HERO FEATURED</span>` : ''}
          </div>
          <div style="font-size:12px; color:#9da5b4; margin-top:2px;">
            📍 ${escapeHtml(item.location || 'Pakistan')}
            ${item.quote ? `<span style="margin-left:8px; color:#8ba0ff; font-style:italic;">“${escapeHtml(item.quote.slice(0, 45))}${item.quote.length > 45 ? '...' : ''}”</span>` : ''}
          </div>
        </td>
        <td>
          <span class="table-badge ${catClass}">${escapeHtml(item.category || 'RETREAT')}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn star-btn ${isFeatured ? 'is-featured' : ''}" onclick="toggleFeaturedActivity('${item.id}')" title="${isFeatured ? 'Currently Featured in Hero' : 'Set as Featured in Hero'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${isFeatured ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('activities', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('activities', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('activities', '${item.id}')" title="Edit Activity / Gathering">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('activities', '${item.id}')" title="Delete Activity / Gathering">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
      `;
    }).join('');
  }

  window.toggleFeaturedActivity = function(id) {
    if (!window.DataStore) return;
    const items = window.DataStore.get('activities');
    const target = items.find(i => i.id === id);
    if (!target) return;

    const currentFeatured = target.featured === true || target.featured === 1 || target.featured === '1' || target.featured === 'true';
    const newFeatured = !currentFeatured;

    items.forEach(i => {
      const isThis = i.id === id;
      const featVal = isThis ? newFeatured : false;
      i.featured = featVal;
      window.DataStore.update('activities', i.id, { featured: featVal });
    });

    renderActivitiesTable();
    showToast(newFeatured ? `Set "${target.title}" as Hero Featured!` : `Removed Hero Featured from "${target.title}"`);
  };

  // 5.2 People & Team Table
  function renderPeopleTable() {
    if (!tablePeopleBody || !window.DataStore) return;
    let items = window.DataStore.get('people');
    const query = searchPeople ? searchPeople.value.toLowerCase().trim() : '';
    const cat = filterPeopleCategory ? filterPeopleCategory.value : '';

    if (query) {
      items = items.filter(i =>
        (i.name && i.name.toLowerCase().includes(query)) ||
        (i.role && i.role.toLowerCase().includes(query)) ||
        (i.bio && i.bio.toLowerCase().includes(query))
      );
    }
    if (cat) {
      items = items.filter(i => i.category === cat);
    }

    if (items.length === 0) {
      tablePeopleBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No team members found matching criteria.</td></tr>`;
      return;
    }

    tablePeopleBody.innerHTML = items.map((item, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${item.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </div>
        </td>
        <td>
          <img src="${resolveAdminImg(item.image, 'Assets/Team/grid-1-2-Sanaa.png')}" alt="" class="table-media-thumb" style="border-radius:50%; width:36px; height:36px; object-fit:cover;" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.role || 'N/A')}</div>
          ${item.email ? `<div style="font-size:11px; color:#718096; margin-top:2px;">${escapeHtml(item.email)}</div>` : ''}
        </td>
        <td>
          <span class="table-badge">${escapeHtml(item.category || 'Core Team')}</span>
        </td>
        <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#9da5b4;">
          ${escapeHtml(item.bio || 'N/A')}
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('people', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('people', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('people', '${item.id}')" title="Edit Person">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('people', '${item.id}')" title="Delete Person">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.2b Fossil Fuel Phaseout Articles & Reader Grid Table
  function renderFossilArticlesTable() {
    if (!tableFossilArticlesBody || !window.DataStore) return;
    let items = window.DataStore.get('articles');
    const query = searchFossilArticles ? searchFossilArticles.value.toLowerCase().trim() : '';
    const tagFilter = filterFossilArticlesTag ? filterFossilArticlesTag.value.toUpperCase().trim() : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.author && i.author.toLowerCase().includes(query)) ||
        (i.excerpt && i.excerpt.toLowerCase().includes(query))
      );
    }

    if (tagFilter) {
      items = items.filter(i => {
        const k = (i.kicker || '').toUpperCase();
        const c = (i.category || '').toUpperCase();
        return k.includes(tagFilter) || c.includes(tagFilter);
      });
    }

    if (items.length === 0) {
      tableFossilArticlesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No fossil fuel articles found matching criteria.</td></tr>`;
      return;
    }

    tableFossilArticlesBody.innerHTML = items.map((item, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${item.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </div>
        </td>
        <td>
          <img src="${resolveAdminImg(item.image, 'Assets/how-water-became-power.jpg')}" alt="" class="table-media-thumb" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <div style="font-size:12px; color:#9da5b4;">By ${escapeHtml(item.author || 'CAEA Team')}</div>
        </td>
        <td>
          <span class="table-badge">${escapeHtml(item.kicker || item.category || 'CASE STUDY')}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('articles', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('articles', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('articles', '${item.id}')" title="Edit Article">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('articles', '${item.id}')" title="Delete Article">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.2c Textile Investigation Spotlight Cards Table
  function renderTextileCardsTable() {
    if (!tableTextileCardsBody || !window.DataStore) return;
    let cards = window.DataStore.get('textileCards');
    if (!cards || !cards.length) {
      const settings = window.DataStore.getPageSettings();
      cards = settings.ourWork?.textile?.cards || [];
    }
    const query = searchTextileCards ? searchTextileCards.value.toLowerCase().trim() : '';
    const tagFilter = filterTextileTag ? filterTextileTag.value.toLowerCase().trim() : '';

    if (query) {
      cards = cards.filter(c =>
        (c.title && c.title.toLowerCase().includes(query)) ||
        (c.description && c.description.toLowerCase().includes(query)) ||
        (c.targetOpportunity && c.targetOpportunity.toLowerCase().includes(query))
      );
    }
    if (tagFilter) {
      cards = cards.filter(c => {
        const cat = (c.category || c.targetOpportunity || '').toLowerCase();
        return cat.includes(tagFilter);
      });
    }

    if (!cards.length) {
      tableTextileCardsBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px; color:#888;">No textile investigation cards found. Click "Add Investigation Card" to create one.</td></tr>`;
      return;
    }

    tableTextileCardsBody.innerHTML = cards.map((c, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${c.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${c.id}</span>
          </div>
        </td>
        <td><strong>${escapeHtml(c.title || 'Investigation')}</strong></td>
        <td style="max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(c.description || '')}">${escapeHtml(c.description || '')}</td>
        <td><span class="table-badge" style="background:rgba(149,220,111,0.15); color:#95dc6f; border:1px solid rgba(149,220,111,0.3);">${escapeHtml(c.category || 'WATER')}</span></td>
        <td><span class="table-badge">${escapeHtml(c.btnText || 'WATCH NOW')}</span></td>
        <td style="font-family:monospace; font-size:11px; color:#9da5b4; max-width:140px; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(c.videoUrl || '—')}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('textileCards', '${c.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('textileCards', '${c.id}', 'down')" title="Move Down" ${index === cards.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('textileCards', '${c.id}')" title="Edit Card">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('textileCards', '${c.id}')" title="Delete Card">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.2d Climate Justice Legal Reports & Case Studies Table
  function renderClimateReportsTable() {
    if (!tableClimateReportsBody || !window.DataStore) return;
    let reports = window.DataStore.get('climateReports') || [];
    const query = searchClimateReports ? searchClimateReports.value.toLowerCase().trim() : '';
    const tagFilter = filterClimateTag ? filterClimateTag.value.toLowerCase().trim() : '';

    if (query) {
      reports = reports.filter(r =>
        (r.title && r.title.toLowerCase().includes(query)) ||
        (r.author && r.author.toLowerCase().includes(query)) ||
        (r.summary && r.summary.toLowerCase().includes(query)) ||
        (r.category && r.category.toLowerCase().includes(query))
      );
    }
    if (tagFilter) {
      reports = reports.filter(r => {
        const cat = (r.category || '').toLowerCase().replace(/[\s_]+/g, '-');
        return cat.includes(tagFilter.replace(/[\s_]+/g, '-'));
      });
    }

    if (!reports.length) {
      tableClimateReportsBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:24px; color:#888;">No climate justice reports or case studies found. Click "Add Legal Report" to create one.</td></tr>`;
      return;
    }

    tableClimateReportsBody.innerHTML = reports.map((r, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${r.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${r.id}</span>
          </div>
        </td>
        <td>
          <strong>${escapeHtml(r.title)}</strong>
          <div style="font-size:12px; color:#9da5b4; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(r.summary || '')}</div>
        </td>
        <td>
          <div style="font-weight:500;">${escapeHtml(r.author || 'CAEA Legal Team')}</div>
          <div style="font-size:12px; color:#9da5b4;">${escapeHtml(r.dateFormatted || r.date || '2026')}</div>
        </td>
        <td>
          <span class="table-badge" style="background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.3);">${escapeHtml(r.category || 'Loss and Damage')}</span>
        </td>
        <td>
          <span style="font-size:12px; color:#798dff;">${escapeHtml(r.pdfUrl || r.downloadUrl || 'PDF Brief')}</span>
        </td>
        <td>
          <span class="table-badge status-published">${escapeHtml(r.status || 'Published')}</span>
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('climateReports', '${r.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('climateReports', '${r.id}', 'down')" title="Move Down" ${index === reports.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('climateReports', '${r.id}')" title="Edit Legal Report">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('climateReports', '${r.id}')" title="Delete Legal Report">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.3 Articles & Publications Table
  function renderArticlesTable() {
    if (!tableArticlesBody || !window.DataStore) return;
    let items = window.DataStore.get('articles');
    const query = searchArticles ? searchArticles.value.toLowerCase().trim() : '';
    const tagFilter = filterArticlesTag ? filterArticlesTag.value.toUpperCase().trim() : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.author && i.author.toLowerCase().includes(query)) ||
        (i.excerpt && i.excerpt.toLowerCase().includes(query))
      );
    }

    if (tagFilter) {
      items = items.filter(i => {
        const k = (i.kicker || '').toUpperCase();
        const c = (i.category || '').toUpperCase();
        return k.includes(tagFilter) || c.includes(tagFilter);
      });
    }

    if (items.length === 0) {
      tableArticlesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No articles found matching criteria.</td></tr>`;
      return;
    }

    tableArticlesBody.innerHTML = items.map((item, index) => `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="order-badge">#${item.sortOrder || index + 1}</span>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </div>
        </td>
        <td>
          <img src="${resolveAdminImg(item.image, 'Assets/how-water-became-power.jpg')}" alt="" class="table-media-thumb" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <div style="font-size:12px; color:#9da5b4;">By ${escapeHtml(item.author || 'CAEA Team')}</div>
        </td>
        <td>
          <span class="table-badge">${escapeHtml(item.kicker || 'CASE STUDY')}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('articles', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
            </button>
            <button class="action-icon-btn move-btn" onclick="moveItemOrder('articles', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('articles', '${item.id}')" title="Edit Article">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('articles', '${item.id}')" title="Delete Article">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // 5.4 Applied Fields (Applications) Table
  function renderApplicationsTable() {
    if (!tableApplicationsBody || !window.DataStore) return;
    let items = window.DataStore.get('applications');
    const query = searchApplications ? searchApplications.value.toLowerCase().trim() : '';
    const statusFilter = filterApplicationsStatus ? filterApplicationsStatus.value : '';
    const categoryFilter = filterApplicationsCategory ? filterApplicationsCategory.value : '';

    if (query) {
      items = items.filter(i =>
        (i.fullName && i.fullName.toLowerCase().includes(query)) ||
        (i.email && i.email.toLowerCase().includes(query)) ||
        (i.phone && i.phone.toLowerCase().includes(query)) ||
        (i.city && i.city.toLowerCase().includes(query)) ||
        (i.opportunityTitle && i.opportunityTitle.toLowerCase().includes(query)) ||
        (i.category && i.category.toLowerCase().includes(query)) ||
        (i.message && i.message.toLowerCase().includes(query)) ||
        (i.notes && i.notes.toLowerCase().includes(query))
      );
    }

    if (statusFilter) {
      items = items.filter(i => i.status === statusFilter);
    }

    if (categoryFilter) {
      items = items.filter(i => (i.opportunityTitle === categoryFilter || i.category === categoryFilter));
    }

    if (items.length === 0) {
      tableApplicationsBody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding:28px; color:#888;">No applications found matching criteria.</td></tr>`;
      return;
    }

    tableApplicationsBody.innerHTML = items.map(item => {
      const statusClass = `status-${(item.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`;
      return `
        <tr>
          <td>
            <div style="font-weight:600; color:#ffffff;">${item.dateFormatted || item.date || 'N/A'}</div>
            <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
          </td>
          <td>
            <strong>${escapeHtml(item.fullName)}</strong>
            <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.city || 'Pakistan')}</div>
          </td>
          <td>
            <div><a href="mailto:${escapeHtml(item.email)}" style="color:#798dff; text-decoration:none;">${escapeHtml(item.email)}</a></div>
            <div style="font-size:12px; color:#9da5b4;"><a href="tel:${escapeHtml(item.phone)}" style="color:#9da5b4; text-decoration:none;">${escapeHtml(item.phone)}</a></div>
          </td>
          <td>
            <strong>${escapeHtml(item.opportunityTitle || 'General')}</strong>
            <div style="font-size:12px; color:#a3d88d;">${escapeHtml(item.category || 'Open')}</div>
          </td>
          <td>
            <span style="font-size:12.5px; color:#e2e8f0;">${escapeHtml(item.commitment || 'Flexible')}</span>
          </td>
          <td>
            <span class="table-badge ${statusClass}">${escapeHtml(item.status || 'Pending')}</span>
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="action-icon-btn edit-btn" onclick="openAppDetailModal('${item.id}')" title="Review &amp; Update Application">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="action-icon-btn delete-btn" onclick="confirmDelete('applications', '${item.id}')" title="Delete Application">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function populateApplicationCategoryFilter() {
    if (!filterApplicationsCategory || !window.DataStore) return;
    const opps = window.DataStore.get('opportunities') || [];
    const activities = window.DataStore.get('activities') || [];
    const existingVal = filterApplicationsCategory.value;

    let options = '<option value="">All Categories / Roles</option>';
    const added = new Set();

    opps.forEach(o => {
      if (o.title && !added.has(o.title)) {
        added.add(o.title);
        options += `<option value="${escapeHtml(o.title)}">${escapeHtml(o.title)}</option>`;
      }
    });

    activities.forEach(a => {
      if (a.title && !added.has(a.title)) {
        added.add(a.title);
        options += `<option value="${escapeHtml(a.title)}">[Activity] ${escapeHtml(a.title)}</option>`;
      }
    });

    filterApplicationsCategory.innerHTML = options;
    filterApplicationsCategory.value = existingVal;
  }

  // 5.5 Get Involved Positions / Opportunities Table
  function renderOpportunitiesTable() {
    if (!tableOpportunitiesBody || !window.DataStore) return;
    let items = window.DataStore.get('opportunities');
    const query = searchOpportunities ? searchOpportunities.value.toLowerCase().trim() : '';
    const statusFilter = filterOpportunitiesStatus ? filterOpportunitiesStatus.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.category && i.category.toLowerCase().includes(query)) ||
        (i.description && i.description.toLowerCase().includes(query))
      );
    }

    if (statusFilter) {
      items = items.filter(i => i.status === statusFilter);
    }

    if (items.length === 0) {
      tableOpportunitiesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:28px; color:#888;">No positions/categories found.</td></tr>`;
      return;
    }

    tableOpportunitiesBody.innerHTML = items.map((item, index) => {
      const statusClass = `status-${(item.status || 'open').toLowerCase()}`;
      const themeBadge = item.theme === 'black' ?
        `<span style="display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; background:#000; border:1px solid #333; color:#fff;">Black Card</span>` :
        `<span style="display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; background:#4D64D8; color:#fff;">Blue Card</span>`;

      return `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="order-badge">#${item.sortOrder || index + 1}</span>
              <span style="font-family:monospace; font-size:11px; color:#888;">${item.id}</span>
            </div>
          </td>
          <td>${themeBadge}</td>
          <td>
            <strong>${escapeHtml(item.title)}</strong>
            <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.subtitle || '')}</div>
          </td>
          <td>
            <div>${escapeHtml(item.category || 'General')}</div>
            <span style="font-size:11.5px; color:#798dff;">${escapeHtml(item.type || 'Open')}</span>
          </td>
          <td>
            <span class="table-badge ${statusClass}">${escapeHtml(item.status || 'Open')}</span>
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="action-icon-btn move-btn" onclick="moveItemOrder('opportunities', '${item.id}', 'up')" title="Move Up" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
              </button>
              <button class="action-icon-btn move-btn" onclick="moveItemOrder('opportunities', '${item.id}', 'down')" title="Move Down" ${index === items.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              <button class="action-icon-btn edit-btn" onclick="openEditModal('opportunities', '${item.id}')" title="Edit Position Structure">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="action-icon-btn delete-btn" onclick="confirmDelete('opportunities', '${item.id}')" title="Delete Position">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* ============================================================
     5.6 Move Item Order (▲ Up / ▼ Down)
     ============================================================ */
  window.moveItemOrder = async function(collection, id, direction) {
    if (!window.DataStore) return;
    let allItems = [];
    let isNestedTextile = false;
    let isNestedClimate = false;

    if (collection === 'textileCards') {
      allItems = window.DataStore.get('textileCards');
      if (!allItems || !allItems.length) {
        const s = window.DataStore.getPageSettings();
        allItems = s.ourWork?.textile?.cards || [];
      }
      isNestedTextile = true;
    } else if (collection === 'climateReports') {
      allItems = window.DataStore.get('climateReports');
      if (!allItems || !allItems.length) {
        const s = window.DataStore.getPageSettings();
        allItems = s.ourWork?.climateJustice?.reports || [];
      }
      isNestedClimate = true;
    } else {
      allItems = window.DataStore.get(collection);
    }

    if (!Array.isArray(allItems) || allItems.length === 0) return;

    const idx = allItems.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= allItems.length) return;

    // Swap items
    const temp = allItems[idx];
    allItems[idx] = allItems[targetIdx];
    allItems[targetIdx] = temp;

    // Normalize 1-based sequential sortOrder
    allItems.forEach((item, i) => {
      item.sortOrder = i + 1;
      item.orderIndex = i + 1;
    });

    if (isNestedTextile) {
      window.DataStore.set('textileCards', allItems);
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      if (!ourWork.textile) ourWork.textile = {};
      ourWork.textile.cards = allItems;
      window.DataStore.savePageSettings('ourWork', ourWork);
      renderTextileCardsTable();
    } else if (isNestedClimate) {
      window.DataStore.set('climateReports', allItems);
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      if (!ourWork.climateJustice) ourWork.climateJustice = {};
      ourWork.climateJustice.reports = allItems;
      window.DataStore.savePageSettings('ourWork', ourWork);
      renderClimateReportsTable();
    } else {
      window.DataStore.set(collection, allItems);
      if (window.DataStore.apiBase) {
        try {
          await Promise.all([
            window.DataStore.update(collection, allItems[idx].id, { sortOrder: allItems[idx].sortOrder }),
            window.DataStore.update(collection, allItems[targetIdx].id, { sortOrder: allItems[targetIdx].sortOrder })
          ]);
        } catch (e) {
          console.warn('API sortOrder sync warning:', e);
        }
      }
      renderAllTables();
    }
    showToast(`Order updated (${direction === 'up' ? '▲ Moved Up' : '▼ Moved Down'})`);
  };

  // Filter & Add Listeners
  if (searchActivities) searchActivities.addEventListener('input', renderActivitiesTable);
  if (filterActivitiesTag) filterActivitiesTag.addEventListener('change', renderActivitiesTable);

  if (searchFossilArticles) searchFossilArticles.addEventListener('input', renderFossilArticlesTable);
  if (filterFossilArticlesTag) filterFossilArticlesTag.addEventListener('change', renderFossilArticlesTable);
  if (btnAddFossilArticle) btnAddFossilArticle.addEventListener('click', () => openEditModal('articles'));

  if (searchTextileCards) searchTextileCards.addEventListener('input', renderTextileCardsTable);
  if (filterTextileTag) filterTextileTag.addEventListener('change', renderTextileCardsTable);

  if (searchClimateReports) searchClimateReports.addEventListener('input', renderClimateReportsTable);
  if (filterClimateTag) filterClimateTag.addEventListener('change', renderClimateReportsTable);
  if (btnAddClimateReport) btnAddClimateReport.addEventListener('click', () => openEditModal('climateReports'));

  if (searchMapPins) searchMapPins.addEventListener('input', renderMapPinsTable);
  if (btnAddMapPin) btnAddMapPin.addEventListener('click', () => openEditModal('mapPins'));

  if (searchPeople) searchPeople.addEventListener('input', renderPeopleTable);
  if (filterPeopleCategory) filterPeopleCategory.addEventListener('change', renderPeopleTable);

  if (searchArticles) searchArticles.addEventListener('input', renderArticlesTable);
  if (filterArticlesTag) filterArticlesTag.addEventListener('change', renderArticlesTable);

  if (searchApplications) searchApplications.addEventListener('input', renderApplicationsTable);
  if (filterApplicationsStatus) filterApplicationsStatus.addEventListener('change', renderApplicationsTable);
  if (filterApplicationsCategory) filterApplicationsCategory.addEventListener('change', renderApplicationsTable);

  if (searchOpportunities) searchOpportunities.addEventListener('input', renderOpportunitiesTable);
  if (filterOpportunitiesStatus) filterOpportunitiesStatus.addEventListener('change', renderOpportunitiesTable);

  /* ============================================================
     6. Universal CRUD Form Dialog with Direct File Upload
     ============================================================ */
  window.openEditModal = function(collection, id = null) {
    activeEditId = id;
    const isEdit = Boolean(id);
    formCollectionInput.value = collection;
    formRecordIdInput.value = id || '';

    const collectionName = collection === 'opportunities' ? 'Get Involved Position' :
                           collection === 'activities' ? 'Activity / Work Item' :
                           collection === 'textileCards' ? 'Textile Investigation Card' :
                           collection === 'climateReports' ? 'Climate Justice Report / Case Study' :
                           collection === 'people' ? 'Team Member' :
                           collection === 'articles' ? 'Article' :
                           collection === 'mapPins' || collection === 'mappins' ? 'Pakistan Map Location Pin' : collection;

    let item = {};
    if (isEdit) {
      if (collection === 'textileCards') {
        const directItem = window.DataStore.getById('textileCards', id);
        if (directItem) {
          item = directItem;
        } else {
          const settings = window.DataStore.getPageSettings();
          const cards = settings.ourWork?.textile?.cards || [];
          item = cards.find(c => c.id === id) || {};
        }
      } else {
        item = window.DataStore.getById(collection, id) || {};
      }
    }

    modalTitle.textContent = `${isEdit ? 'Edit' : 'Add New'} ${collectionName}`;

    const orderFieldHtml = `
      <div class="form-group">
        <label class="form-label">Display Order Index (sortOrder)</label>
        <input type="number" name="sortOrder" class="admin-input" value="${item.sortOrder !== undefined && item.sortOrder !== null ? item.sortOrder : (item.orderIndex !== undefined ? item.orderIndex : '')}" placeholder="e.g. 1, 2, 3 (Leave blank for auto-order)" min="1" />
        <div style="font-size:11.5px; color:#888; margin-top:4px;">Determines sequential order on public pages and admin lists.</div>
      </div>
    `;

    // Image preview resolution
    const currentImg = item.image || (collection === 'activities' ? 'Assets/Hero-image.png' : collection === 'people' ? 'Assets/Team/grid-1-2-Sanaa.png' : 'Assets/how-water-became-power.jpg');
    const previewSrc = resolveAdminImg(currentImg);

    const imageFieldHtml = `
      <div class="form-group">
        <label class="form-label">Media / Image Asset</label>
        <div class="image-upload-wrapper" id="modal-image-dropzone">
          <div class="image-preview-container">
            <img id="form-image-preview" src="${previewSrc}" alt="Preview" class="form-img-preview" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
          </div>
          <div class="image-upload-controls">
            <div class="upload-actions-row">
              <label class="upload-file-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload File</span>
                <input type="file" id="form-file-input" accept="image/*" style="display:none;" />
              </label>
              <button type="button" class="btn-clear-img" id="btn-clear-form-image" title="Clear image">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Clear
              </button>
              <span class="upload-filename-badge" id="upload-filename-badge" style="display:none;"></span>
            </div>
            <input type="text" name="image" id="form-image-url" class="admin-input" value="${escapeHtml(item.image || '')}" placeholder="Or paste image path / URL (e.g. Assets/Team/member-photo.jpg or https://...)" />
          </div>
        </div>
      </div>
    `;

    // Render Dynamic Form Fields based on Collection
    let fieldsHtml = '';

    if (collection === 'mapPins' || collection === 'mappins') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">City / Region Name</label>
          <input type="text" name="city" class="admin-input" value="${escapeHtml(item.city || '')}" placeholder="e.g. HUNZA, JALALPUR, MANCHHAR, THAR" required />
        </div>
        <div class="form-group">
          <label class="form-label">Popup Badge Label</label>
          <input type="text" name="badge" class="admin-input" value="${escapeHtml(item.badge || item.city || '')}" placeholder="e.g. HUNZA" required />
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Position Left % (X Coordinate)</label>
            <input type="text" name="left" class="admin-input" value="${escapeHtml(item.left || '50%')}" placeholder="e.g. 53%" required />
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Position Top % (Y Coordinate)</label>
            <input type="text" name="top" class="admin-input" value="${escapeHtml(item.top || '50%')}" placeholder="e.g. 19%" required />
          </div>
        </div>
        ${orderFieldHtml}
        <div class="form-group">
          <label class="form-label">Location Story / Popup Description</label>
          <textarea name="description" class="admin-textarea" rows="4" placeholder="Story, background, or community initiative details shown on pin click..." required>${escapeHtml(item.description || '')}</textarea>
        </div>
        <div style="font-size:12px; color:#9da5b4; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:6px; border:1px solid rgba(255,255,255,0.08); line-height:1.4;">
          <strong style="color:#a3d88d;">Coordinates Guide:</strong> Northern GB: ~53% Left, 19% Top &bull; Punjab: ~62% Left, 41% Top &bull; Sindh: ~45% Left, 60% Top &bull; Thar: ~33% Left, 78% Top &bull; Balochistan: ~22% Left, 50% Top.
        </div>
      `;
    } else if (collection === 'activities') {
      const isFeatured = item.featured === true || item.featured === 1 || item.featured === '1' || item.featured === 'true';
      const imagesVal = Array.isArray(item.images) ? item.images.join('\n') : (item.images || '');

      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Activity / Gathering Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Climate Justice Gathering &amp; Retreat" required />
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Category / Event Type</label>
            <select name="category" class="admin-input">
              <option value="RETREAT" ${item.category === 'RETREAT' ? 'selected' : ''}>RETREAT</option>
              <option value="GATHERING" ${item.category === 'GATHERING' ? 'selected' : ''}>GATHERING</option>
              <option value="COMMUNITY GATHERING" ${item.category === 'COMMUNITY GATHERING' ? 'selected' : ''}>COMMUNITY GATHERING</option>
              <option value="COMMUNITY KACHERI" ${item.category === 'COMMUNITY KACHERI' ? 'selected' : ''}>COMMUNITY KACHERI</option>
              <option value="WORKSHOP" ${item.category === 'WORKSHOP' ? 'selected' : ''}>WORKSHOP</option>
              <option value="EXPOSURE VISIT" ${item.category === 'EXPOSURE VISIT' ? 'selected' : ''}>EXPOSURE VISIT</option>
              <option value="RESEARCH" ${item.category === 'RESEARCH' ? 'selected' : ''}>RESEARCH</option>
              <option value="FIELD PROJECT" ${item.category === 'FIELD PROJECT' ? 'selected' : ''}>FIELD PROJECT</option>
              <option value="POLICY" ${item.category === 'POLICY' ? 'selected' : ''}>POLICY</option>
              <option value="CASE STUDY" ${item.category === 'CASE STUDY' ? 'selected' : ''}>CASE STUDY</option>
            </select>
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Location / City</label>
            <input type="text" name="location" class="admin-input" value="${escapeHtml(item.location || '')}" placeholder="e.g. Lake Manchhar, Sindh or Pakistan" />
          </div>
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Event Date</label>
            <input type="date" name="date" class="admin-input" value="${item.date || ''}" required />
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Formatted Date Display</label>
            <input type="text" name="dateFormatted" class="admin-input" value="${escapeHtml(item.dateFormatted || '')}" placeholder="e.g. 23.04.2026 (Leave blank to auto-format)" />
          </div>
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-2" style="flex:2;">
            <label class="form-label">Hero Callout Quote</label>
            <input type="text" name="quote" class="admin-input" value="${escapeHtml(item.quote || '')}" placeholder="e.g. “Reconnecting with land and community to build resilience”" />
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Quote Speaker / Attribution</label>
            <input type="text" name="quoteAuthor" class="admin-input" value="${escapeHtml(item.quoteAuthor || '')}" placeholder="e.g. CAEA Movement Gathering" />
          </div>
        </div>
        <div class="form-group" style="background:rgba(75, 104, 255, 0.06); padding:10px 14px; border-radius:6px; border:1px solid rgba(75, 104, 255, 0.15);">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:600; color:#fff; user-select:none;">
            <input type="checkbox" name="featured" ${isFeatured ? 'checked' : ''} style="width:16px; height:16px; accent-color:#4b68ff;" />
            <span>★ Feature in Top Hero Slideshow &amp; Gallery (Live on Our Work page)</span>
          </label>
          <div style="font-size:11.5px; color:#9da5b4; margin-top:4px; margin-left:26px;">When enabled, this activity is displayed prominently in the top quote box and interactive gallery.</div>
        </div>
        ${orderFieldHtml}
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Photo Gallery / Multi-Image Slideshow (One image path or URL per line)</label>
          <textarea name="imagesList" class="admin-textarea" rows="3" placeholder="Assets/media/events/retreat/DSCF4154.JPG&#10;Assets/media/events/retreat/DSCF3966.JPG&#10;Assets/media/events/retreat/DSCF4356.JPG&#10;Assets/media/events/retreat/DSCF4512.JPG">${escapeHtml(imagesVal)}</textarea>
          <div style="font-size:11.5px; color:#9da5b4; margin-top:4px;">These images power the cycling photo arrows (&lt; &gt;) on the live activity card. If left blank, the primary image will be used.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Narrative Summary / Key Highlights</label>
          <textarea name="description" class="admin-textarea" rows="4" placeholder="Enter activity and gathering summary, background, and movement impact..." required>${escapeHtml(item.description || '')}</textarea>
        </div>
      `;
    } else if (collection === 'people') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" name="name" class="admin-input" value="${escapeHtml(item.name || '')}" placeholder="e.g. Team Member Name" required />
        </div>
        <div class="form-group">
          <label class="form-label">Role / Title</label>
          <input type="text" name="role" class="admin-input" value="${escapeHtml(item.role || '')}" placeholder="e.g. Climate Research Associate" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" name="email" class="admin-input" value="${escapeHtml(item.email || '')}" placeholder="e.g. member@climateactionenergyaccess.org" />
        </div>
        <div class="form-group">
          <label class="form-label">Team Category</label>
          <select name="category" class="admin-input">
            <option value="Executive" ${item.category === 'Executive' ? 'selected' : ''}>Executive</option>
            <option value="Core Team" ${item.category === 'Core Team' || !item.category ? 'selected' : ''}>Core Team</option>
            <option value="Fellows" ${item.category === 'Fellows' ? 'selected' : ''}>Fellows</option>
          </select>
        </div>
        ${orderFieldHtml}
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Biography</label>
          <textarea name="bio" class="admin-textarea" rows="5" placeholder="Brief biographical overview and focus areas..." required>${escapeHtml(item.bio || '')}</textarea>
        </div>
      `;
    } else if (collection === 'articles') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Article Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Energy Transition &amp; Community Power" required />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitle</label>
          <input type="text" name="subtitle" class="admin-input" value="${escapeHtml(item.subtitle || '')}" placeholder="e.g. Policy analysis and field findings" />
        </div>
        <div class="form-group">
          <label class="form-label">Kicker / Tag</label>
          <input type="text" name="kicker" class="admin-input" value="${escapeHtml(item.kicker || 'CASE STUDY')}" placeholder="e.g. CASE STUDY, REPORT, DISPATCH" />
        </div>
        <div class="form-group">
          <label class="form-label">Author</label>
          <input type="text" name="author" class="admin-input" value="${escapeHtml(item.author || 'CAEA Team')}" placeholder="e.g. CAEA Team / Author Name" required />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" name="date" class="admin-input" value="${item.date || ''}" required />
        </div>
        ${orderFieldHtml}
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Excerpt</label>
          <textarea name="excerpt" class="admin-textarea" rows="2" placeholder="Brief summary of the article..." required>${escapeHtml(item.excerpt || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Full Article Content</label>
          <textarea name="content" class="admin-textarea" rows="5" placeholder="Full article body content...">${escapeHtml(item.content || '')}</textarea>
        </div>
      `;
    } else if (collection === 'opportunities') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Opportunity / Position Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Climate Research Associate" required />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitle / Banner Tag</label>
          <input type="text" name="subtitle" class="admin-input" value="${escapeHtml(item.subtitle || 'UPCOMING')}" placeholder="e.g. FULL TIME · APPLICATIONS OPEN" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category Name</label>
          <input type="text" name="category" class="admin-input" value="${escapeHtml(item.category || '')}" placeholder="e.g. Core Team, Volunteering, Fellowship" required />
        </div>
        <div class="form-group">
          <label class="form-label">Role Type</label>
          <select name="type" class="admin-input">
            <option value="Full-Time" ${item.type === 'Full-Time' ? 'selected' : ''}>Full-Time</option>
            <option value="Part-Time" ${item.type === 'Part-Time' ? 'selected' : ''}>Part-Time</option>
            <option value="Volunteering" ${item.type === 'Volunteering' ? 'selected' : ''}>Volunteering</option>
            <option value="Internship" ${item.type === 'Internship' ? 'selected' : ''}>Internship</option>
            <option value="Event / Gathering" ${item.type === 'Event / Gathering' ? 'selected' : ''}>Event / Gathering</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Card Theme Style</label>
          <select name="theme" class="admin-input">
            <option value="blue" ${item.theme === 'blue' ? 'selected' : ''}>Blue Card Theme (#4D64D8)</option>
            <option value="black" ${item.theme === 'black' ? 'selected' : ''}>Black Card Theme (#000000)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select name="status" class="admin-input">
            <option value="Open" ${item.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Upcoming" ${item.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
            <option value="Closed" ${item.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </div>
        ${orderFieldHtml}
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea name="description" class="admin-textarea" rows="4" required>${escapeHtml(item.description || '')}</textarea>
        </div>
      `;
    } else if (collection === 'textileCards') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Investigation Card Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Fashion and Fossil Fuels" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category / Pillar Tag</label>
          <select name="category" class="admin-input">
            <option value="WATER" ${item.category === 'WATER' ? 'selected' : ''}>WATER</option>
            <option value="LAND" ${item.category === 'LAND' ? 'selected' : ''}>LAND</option>
            <option value="HYDROPOWER" ${item.category === 'HYDROPOWER' ? 'selected' : ''}>HYDROPOWER</option>
            <option value="ENERGY" ${item.category === 'ENERGY' ? 'selected' : ''}>ENERGY</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Description / Investigation Brief</label>
          <textarea name="description" class="admin-textarea" rows="4" placeholder="Brief summary of the investigation or field report..." required>${escapeHtml(item.description || '')}</textarea>
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Action Button Text</label>
            <input type="text" name="btnText" class="admin-input" value="${escapeHtml(item.btnText || 'WATCH NOW')}" placeholder="e.g. WATCH NOW" required />
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Target Opportunity / Modal Tag</label>
            <input type="text" name="targetOpportunity" class="admin-input" value="${escapeHtml(item.targetOpportunity || 'Textile Watch')}" placeholder="e.g. Textile Watch" required />
          </div>
        </div>
        ${orderFieldHtml}
        <div class="form-group">
          <label class="form-label">Video or Media URL (Optional)</label>
          <input type="text" name="videoUrl" class="admin-input" value="${escapeHtml(item.videoUrl || '')}" placeholder="e.g. https://youtube.com/... or Assets/video.mp4" />
        </div>
      `;
    } else if (collection === 'climateReports') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Report / Case Study Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Legal Frameworks for Climate Loss &amp; Damage" required />
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Author / Legal Team</label>
            <input type="text" name="author" class="admin-input" value="${escapeHtml(item.author || 'CAEA Legal &amp; Policy Team')}" placeholder="e.g. CAEA Legal Research" required />
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Date</label>
            <input type="date" name="date" class="admin-input" value="${item.date || ''}" required />
          </div>
        </div>
        <div class="form-row" style="display:flex; gap:16px;">
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Category</label>
            <select name="category" class="admin-input">
              <option value="Loss and Damage" ${item.category === 'Loss and Damage' ? 'selected' : ''}>Loss and Damage</option>
              <option value="Community Rights" ${item.category === 'Community Rights' ? 'selected' : ''}>Community Rights</option>
              <option value="Legal Claims" ${item.category === 'Legal Claims' ? 'selected' : ''}>Legal Claims</option>
              <option value="Policy Brief" ${item.category === 'Policy Brief' ? 'selected' : ''}>Policy Brief</option>
            </select>
          </div>
          <div class="form-group flex-1" style="flex:1;">
            <label class="form-label">Status</label>
            <select name="status" class="admin-input">
              <option value="Published" ${item.status === 'Published' ? 'selected' : ''}>Published</option>
              <option value="Draft" ${item.status === 'Draft' ? 'selected' : ''}>Draft</option>
              <option value="Archived" ${item.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">PDF / Download URL</label>
          <input type="text" name="pdfUrl" class="admin-input" value="${escapeHtml(item.pdfUrl || item.downloadUrl || '')}" placeholder="e.g. /docs/loss-and-damage-2026.pdf or https://..." />
        </div>
        ${orderFieldHtml}
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Executive Summary</label>
          <textarea name="summary" class="admin-textarea" rows="3" placeholder="Brief summary of legal arguments and evidence..." required>${escapeHtml(item.summary || item.excerpt || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Full Case Study Content (Optional)</label>
          <textarea name="content" class="admin-textarea" rows="4" placeholder="Full report content or key recommendations...">${escapeHtml(item.content || '')}</textarea>
        </div>
      `;
    }

    dynamicFieldsContainer.innerHTML = fieldsHtml;

    // Attach File Upload, Drag & Drop, and Preview Listeners
    const fileInput = document.getElementById('form-file-input');
    const imageUrlInput = document.getElementById('form-image-url');
    const imagePreview = document.getElementById('form-image-preview');
    const filenameBadge = document.getElementById('upload-filename-badge');
    const btnClearImage = document.getElementById('btn-clear-form-image');
    const dropzone = document.getElementById('modal-image-dropzone');

    async function handleUploadedFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
        return;
      }
      if (filenameBadge) {
        filenameBadge.textContent = file.name + ' (Uploading...)';
        filenameBadge.style.display = 'inline-block';
      }
      if (window.DataStore && window.DataStore.apiBase) {
        try {
          const uploaded = await window.DataStore.uploadMedia(file, { category: 'Admin Upload', title: file.name });
          if (uploaded && uploaded.path) {
            if (imageUrlInput) imageUrlInput.value = uploaded.path;
            if (imagePreview) imagePreview.src = uploaded.path.startsWith('http') || uploaded.path.startsWith('/') ? uploaded.path : `../${uploaded.path}`;
            if (filenameBadge) {
              filenameBadge.textContent = file.name + ' (Server Stored)';
            }
            showToast(`Uploaded "${file.name}" to server!`);
            return;
          }
        } catch (err) {
          console.warn('Server upload failed, falling back to data URL:', err);
        }
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (imageUrlInput) imageUrlInput.value = dataUrl;
        if (imagePreview) imagePreview.src = dataUrl;
        if (filenameBadge) {
          filenameBadge.textContent = file.name;
          filenameBadge.style.display = 'inline-block';
        }
        showToast(`Uploaded "${file.name}" to preview!`);
      };
      reader.readAsDataURL(file);
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleUploadedFile(file);
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = '#a3d88d';
          dropzone.style.background = 'rgba(163, 216, 141, 0.08)';
        });
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          dropzone.style.background = '#14171d';
        });
      });
      dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          handleUploadedFile(files[0]);
        }
      });
    }

    if (btnClearImage) {
      btnClearImage.addEventListener('click', () => {
        if (imageUrlInput) imageUrlInput.value = '';
        if (imagePreview) imagePreview.src = '../Assets/CAEA-Navbar-Logo.png';
        if (fileInput) fileInput.value = '';
        if (filenameBadge) {
          filenameBadge.textContent = '';
          filenameBadge.style.display = 'none';
        }
        showToast('Image cleared');
      });
    }

    if (imageUrlInput) {
      imageUrlInput.addEventListener('input', () => {
        if (imagePreview) {
          const val = imageUrlInput.value.trim();
          imagePreview.src = resolveAdminImg(val);
        }
      });
    }

    modalDialog.showModal();
  };

  function closeModal() {
    modalDialog.close();
    crudForm.reset();
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (crudForm) {
    crudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const collection = formCollectionInput.value;
      const recordId = formRecordIdInput.value;

      const formData = new FormData(crudForm);
      const dataObj = {};
      formData.forEach((val, key) => {
        dataObj[key] = val;
      });

      if (dataObj.sortOrder !== undefined && dataObj.sortOrder !== '') {
        dataObj.sortOrder = parseInt(dataObj.sortOrder, 10);
        dataObj.orderIndex = dataObj.sortOrder;
      }

      if (collection === 'textileCards') {
        const currentSettings = window.DataStore.getPageSettings();
        const ourWork = currentSettings.ourWork || {};
        if (!ourWork.textile) ourWork.textile = {};
        if (!Array.isArray(ourWork.textile.cards)) ourWork.textile.cards = [];

        if (recordId) {
          const idx = ourWork.textile.cards.findIndex(c => c.id === recordId);
          if (idx !== -1) {
            ourWork.textile.cards[idx] = {
              ...ourWork.textile.cards[idx],
              title: dataObj.title,
              description: dataObj.description,
              btnText: dataObj.btnText || 'WATCH NOW',
              targetOpportunity: dataObj.targetOpportunity || 'Textile Watch',
              videoUrl: dataObj.videoUrl || '',
              sortOrder: dataObj.sortOrder !== undefined ? dataObj.sortOrder : ourWork.textile.cards[idx].sortOrder,
              orderIndex: dataObj.sortOrder !== undefined ? dataObj.sortOrder : ourWork.textile.cards[idx].sortOrder
            };
          }
          showToast('Updated textile investigation card successfully');
        } else {
          const newCardOrder = dataObj.sortOrder !== undefined ? dataObj.sortOrder : ourWork.textile.cards.length + 1;
          ourWork.textile.cards.push({
            id: `tex-${Date.now()}`,
            title: dataObj.title,
            description: dataObj.description,
            btnText: dataObj.btnText || 'WATCH NOW',
            targetOpportunity: dataObj.targetOpportunity || 'Textile Watch',
            videoUrl: dataObj.videoUrl || '',
            sortOrder: newCardOrder,
            orderIndex: newCardOrder
          });
          showToast('Added new textile investigation card successfully');
        }

        window.DataStore.set('textileCards', ourWork.textile.cards);
        window.DataStore.savePageSettings('ourWork', ourWork);
        renderTextileCardsTable();
        closeModal();
        return;
      }

      if (collection === 'activities' || collection === 'gatherings') {
        const imagesText = dataObj.imagesList || '';
        const parsedImages = imagesText
          .split(/[\n,]+/)
          .map(s => s.trim())
          .filter(Boolean);

        if (dataObj.image && (!parsedImages.length || !parsedImages.includes(dataObj.image))) {
          if (!parsedImages.length) {
            parsedImages.push(dataObj.image);
          }
        }
        dataObj.images = parsedImages.length > 0 ? parsedImages : (dataObj.image ? [dataObj.image] : []);
        delete dataObj.imagesList;

        dataObj.featured = (dataObj.featured === 'on' || dataObj.featured === true || dataObj.featured === '1' || dataObj.featured === 'true');

        if (dataObj.date && !dataObj.dateFormatted) {
          const parts = dataObj.date.split('-');
          if (parts.length === 3) {
            dataObj.dateFormatted = `${parts[2]}.${parts[1]}.${parts[0]}`;
          }
        }

        if (dataObj.featured) {
          const allActivities = window.DataStore.get('activities');
          allActivities.forEach(act => {
            if (act.id !== recordId && (act.featured === true || act.featured === 1 || act.featured === '1')) {
              act.featured = false;
              window.DataStore.update('activities', act.id, { featured: false });
            }
          });
        }
      }

      const label = collection === 'mapPins' || collection === 'mappins' ? 'location pin' :
                    collection === 'opportunities' ? 'position' :
                    collection === 'activities' || collection === 'gatherings' ? 'activity / gathering' :
                    collection === 'people' ? 'team member' :
                    collection.slice(0, -1);

      if (recordId) {
        window.DataStore.update(collection, recordId, dataObj);
        showToast(`Updated ${label} successfully`);
      } else {
        window.DataStore.add(collection, dataObj);
        showToast(`Added new ${label} successfully`);
      }

      updateStats();
      renderAllTables();
      populateApplicationCategoryFilter();
      closeModal();
    });
  }

  /* ============================================================
     7. Application Review & Details Modal
     ============================================================ */
  window.openAppDetailModal = function(id) {
    activeAppDetailId = id;
    const app = window.DataStore.getById('applications', id);
    if (!app) return;

    document.getElementById('detail-app-id').value = app.id;
    document.getElementById('detail-app-name').textContent = app.fullName || 'N/A';
    document.getElementById('detail-app-email').textContent = app.email || 'N/A';
    document.getElementById('detail-app-phone').textContent = app.phone || 'N/A';
    document.getElementById('detail-app-city').textContent = app.city || 'N/A';
    document.getElementById('detail-app-opp').textContent = `${app.opportunityTitle || 'General'} (${app.category || 'Open'})`;
    document.getElementById('detail-app-commitment').textContent = app.commitment || 'Flexible';
    document.getElementById('detail-app-date').textContent = `${app.dateFormatted || app.date || ''} [ID: ${app.id}]`;

    const statusClass = `status-${(app.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`;
    document.getElementById('detail-app-status-badge').innerHTML = `<span class="table-badge ${statusClass}">${escapeHtml(app.status || 'Pending')}</span>`;

    document.getElementById('detail-app-message').textContent = app.message || 'No statement provided.';
    document.getElementById('detail-app-experience').textContent = app.experience || 'No previous background or portfolio provided.';

    document.getElementById('detail-status-select').value = app.status || 'Pending';
    document.getElementById('detail-admin-notes').value = app.notes || '';

    appDetailDialog.showModal();
  };

  function closeAppDetailModal() {
    if (appDetailDialog) appDetailDialog.close();
    activeAppDetailId = null;
  }

  if (btnCloseAppDetail) btnCloseAppDetail.addEventListener('click', closeAppDetailModal);
  if (btnCancelAppDetail) btnCancelAppDetail.addEventListener('click', closeAppDetailModal);

  if (appStatusForm) {
    appStatusForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('detail-app-id').value;
      const status = document.getElementById('detail-status-select').value;
      const notes = document.getElementById('detail-admin-notes').value.trim();

      if (id && window.DataStore) {
        window.DataStore.update('applications', id, { status, notes });
        showToast(`Updated application status to ${status}`);
        updateStats();
        renderApplicationsTable();
        closeAppDetailModal();
      }
    });
  }

  if (btnDeleteApp) {
    btnDeleteApp.addEventListener('click', () => {
      const id = document.getElementById('detail-app-id').value;
      if (id && confirm(`Are you sure you want to permanently delete application ${id}?`)) {
        window.DataStore.delete('applications', id);
        showToast(`Deleted application ${id}`);
        updateStats();
        renderApplicationsTable();
        closeAppDetailModal();
      }
    });
  }

  /* ============================================================
     8. CSV Export for Applications
     ============================================================ */
  function exportApplicationsToCSV() {
    const apps = window.DataStore.get('applications');
    if (!apps || !apps.length) {
      alert('No application submissions available to export.');
      return;
    }

    const headers = ['Application ID', 'Date', 'Full Name', 'Email', 'Phone', 'City', 'Opportunity Title', 'Category', 'Commitment', 'Status', 'Motivation / Message', 'Experience / Links', 'Admin Notes'];
    const rows = apps.map(a => [
      `"${(a.id || '').replace(/"/g, '""')}"`,
      `"${(a.dateFormatted || a.date || '').replace(/"/g, '""')}"`,
      `"${(a.fullName || '').replace(/"/g, '""')}"`,
      `"${(a.email || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.city || '').replace(/"/g, '""')}"`,
      `"${(a.opportunityTitle || '').replace(/"/g, '""')}"`,
      `"${(a.category || '').replace(/"/g, '""')}"`,
      `"${(a.commitment || '').replace(/"/g, '""')}"`,
      `"${(a.status || 'Pending').replace(/"/g, '""')}"`,
      `"${(a.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(a.experience || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(a.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caea-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported applications to CSV');
  }

  if (btnExportApplicationsCSV) {
    btnExportApplicationsCSV.addEventListener('click', exportApplicationsToCSV);
  }

  // Add Button Event Handlers
  if (btnAddActivity) btnAddActivity.addEventListener('click', () => openEditModal('activities'));
  if (btnAddTextileCard) btnAddTextileCard.addEventListener('click', () => openEditModal('textileCards'));
  if (btnAddPerson) btnAddPerson.addEventListener('click', () => openEditModal('people'));
  if (btnAddArticle) btnAddArticle.addEventListener('click', () => openEditModal('articles'));
  if (btnAddOpportunity) btnAddOpportunity.addEventListener('click', () => openEditModal('opportunities'));

  // Delete Action
  window.confirmDelete = function(collection, id) {
    if (collection === 'textileCards') {
      if (confirm(`Are you sure you want to delete this textile investigation card (${id})?`)) {
        const currentSettings = window.DataStore.getPageSettings();
        const ourWork = currentSettings.ourWork || {};
        if (ourWork.textile && Array.isArray(ourWork.textile.cards)) {
          ourWork.textile.cards = ourWork.textile.cards.filter(c => c.id !== id);
          window.DataStore.savePageSettings('ourWork', ourWork);
          renderTextileCardsTable();
          showToast(`Deleted textile card ${id} successfully`);
        }
      }
      return;
    }

    const itemLabel = collection === 'applications' ? 'application' : collection.slice(0, -1);
    if (confirm(`Are you sure you want to delete this ${itemLabel} (${id})?`)) {
      const res = window.DataStore.delete(collection, id);
      if (res) {
        showToast(`Deleted ${id} successfully`);
        updateStats();
        renderAllTables();
        populateApplicationCategoryFilter();
      }
    }
  };

  /* ============================================================
     9. Export & Import Utilities
     ============================================================ */
  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      const json = window.DataStore.exportJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caea-database-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported database backup');
    });
  }

  if (inputImportFile) {
    inputImportFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const success = window.DataStore.importJSON(evt.target.result);
        if (success) {
          showToast('Database imported successfully!');
          updateStats();
          renderAllTables();
          populateApplicationCategoryFilter();
        } else {
          alert('Failed to import file. Make sure it is valid JSON.');
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnResetData) {
    btnResetData.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data back to factory defaults? This will overwrite local changes.')) {
        window.DataStore.reset();
        showToast('Reset data back to seed defaults');
        updateStats();
        renderAllTables();
        populateApplicationCategoryFilter();
      }
    });
  }

  // DataStore global event listener
  window.addEventListener('caea-datastore-update', () => {
    updateStats();
    renderAllTables();
    populateApplicationCategoryFilter();
    loadPageSettingsIntoUI();
  });

  /* ============================================================
     10. Page Content & Media Settings Management
     ============================================================ */
  // 10.1 Home Page Settings
  const settingHomeLatestTitle = document.getElementById('setting-home-latest-title');
  const settingHomeLatestSubtitle = document.getElementById('setting-home-latest-subtitle');
  const settingHomeShowVideo = document.getElementById('setting-home-show-video');
  const settingsHomeVideoGroup = document.getElementById('settings-home-video-group');
  const settingHomeVideoTitle = document.getElementById('setting-home-video-title');
  const settingHomeVideoDesc = document.getElementById('setting-home-video-desc');
  const settingHomeVideoUrl = document.getElementById('setting-home-video-url');
  const settingHomeVideoFile = document.getElementById('setting-home-video-file');
  const settingHomeVideoFilename = document.getElementById('setting-home-video-filename');
  const btnClearHomeVideo = document.getElementById('btn-clear-home-video');

  const settingHomeThumbUrl = document.getElementById('setting-home-thumb-url');
  const settingHomeThumbFile = document.getElementById('setting-home-thumb-file');
  const settingHomeThumbPreview = document.getElementById('setting-home-thumb-preview');
  const settingHomeThumbFilename = document.getElementById('setting-home-thumb-filename');
  const btnClearHomeThumb = document.getElementById('btn-clear-home-thumb');
  const settingHomeThumbDropzone = document.getElementById('setting-home-thumb-dropzone');

  const settingHomeHeroQuote = document.getElementById('setting-home-hero-quote');
  const settingHomeHeroAuthor = document.getElementById('setting-home-hero-author');
  const btnSaveHomeSettings = document.getElementById('btn-save-home-settings');

  // 10.2 Activities Page Settings
  const settingActShowVideo = document.getElementById('setting-act-show-video');
  const settingsVideoGroup = document.getElementById('settings-video-details-group');
  const settingActVideoTitle = document.getElementById('setting-act-video-title');
  const settingActVideoDesc = document.getElementById('setting-act-video-desc');
  const settingActVideoUrl = document.getElementById('setting-act-video-url');
  const settingActVideoFile = document.getElementById('setting-act-video-file');
  const settingActVideoFilename = document.getElementById('setting-act-video-filename');
  const btnClearActVideo = document.getElementById('btn-clear-act-video');

  const settingActThumbUrl = document.getElementById('setting-act-thumb-url');
  const settingActThumbFile = document.getElementById('setting-act-thumb-file');
  const settingActThumbPreview = document.getElementById('setting-act-thumb-preview');
  const settingActThumbFilename = document.getElementById('setting-act-thumb-filename');
  const btnClearActThumb = document.getElementById('btn-clear-act-thumb');
  const settingVideoThumbDropzone = document.getElementById('setting-video-thumb-dropzone');

  const settingActAutoplay = document.getElementById('setting-act-autoplay');
  const settingActInterval = document.getElementById('setting-act-interval');

  // 10.3 Our Story Page Settings
  const settingStoryHeader = document.getElementById('setting-story-header');
  const settingStoryQuote = document.getElementById('setting-story-quote');
  const settingStoryAuthor = document.getElementById('setting-story-author');
  const btnSavePageSettings = document.getElementById('btn-save-page-settings');

  function loadPageSettingsIntoUI() {
    if (!window.DataStore) return;
    const settings = window.DataStore.getPageSettings();
    const home = settings.home || {};
    const act = settings.activities || {};
    const story = settings.ourStory || {};

    // Home Page
    if (settingHomeLatestTitle) settingHomeLatestTitle.value = home.latestTitle || '';
    if (settingHomeLatestSubtitle) settingHomeLatestSubtitle.value = home.latestSubtitle || '';
    if (settingHomeShowVideo) {
      settingHomeShowVideo.checked = home.showLatestVideo !== false;
      if (settingsHomeVideoGroup) {
        settingsHomeVideoGroup.style.display = settingHomeShowVideo.checked ? 'flex' : 'none';
      }
    }
    if (settingHomeVideoTitle) settingHomeVideoTitle.value = home.latestVideoTitle || '';
    if (settingHomeVideoDesc) settingHomeVideoDesc.value = home.latestVideoDescription || '';
    if (settingHomeVideoUrl) settingHomeVideoUrl.value = home.latestVideoUrl || home.heroVideoUrl || 'Assets/Video/Hero.mov';
    if (settingHomeThumbUrl) settingHomeThumbUrl.value = home.latestVideoThumbnail || '';
    if (settingHomeThumbPreview) {
      settingHomeThumbPreview.src = resolveAdminImg(home.latestVideoThumbnail || 'Assets/how-water-became-power.jpg');
    }
    if (settingHomeHeroQuote) settingHomeHeroQuote.value = home.heroQuote || '';
    if (settingHomeHeroAuthor) settingHomeHeroAuthor.value = home.heroQuoteAuthor || '';

    adminQuotesList = Array.isArray(home.quotes) ? JSON.parse(JSON.stringify(home.quotes)) : [];
    renderAdminQuotesList();

    // Activities Page
    if (settingActShowVideo) {
      settingActShowVideo.checked = act.showVideo !== false;
      if (settingsVideoGroup) {
        settingsVideoGroup.style.display = settingActShowVideo.checked ? 'flex' : 'none';
      }
    }
    if (settingActVideoTitle) settingActVideoTitle.value = act.videoTitle || '';
    if (settingActVideoDesc) settingActVideoDesc.value = act.videoDescription || '';
    if (settingActVideoUrl) settingActVideoUrl.value = act.videoUrl || '';
    if (settingActThumbUrl) settingActThumbUrl.value = act.videoThumbnail || '';
    if (settingActThumbPreview) {
      settingActThumbPreview.src = resolveAdminImg(act.videoThumbnail || 'Assets/how-water-became-power-ai.jpg');
    }
    if (settingActAutoplay) settingActAutoplay.checked = act.autoplayImages !== false;
    if (settingActInterval) {
      const sec = Math.round((act.imageCycleInterval || 5000) / 1000);
      settingActInterval.value = sec > 0 ? sec : 5;
    }

    // Story Page
    if (settingStoryHeader) settingStoryHeader.value = story.teamHeaderTitle || '';
    if (settingStoryQuote) settingStoryQuote.value = story.quoteText || '';
    if (settingStoryAuthor) settingStoryAuthor.value = story.quoteAuthor || '';

    // Our Work Page Pillars (4 Sub-Tabs)
    const work = settings.ourWork || {};
    const fossil = work.fossilFuel || {};
    const tex = work.textile || {};
    const cj = work.climateJustice || {};
    const actBanner = work.activitiesBanner || {};

    // Sub-Tab 1: Fossil Fuel Phaseout
    if (settingWorkFossilVisible) settingWorkFossilVisible.checked = fossil.visible !== false;
    if (settingWorkFossilTitle) settingWorkFossilTitle.value = fossil.title || '';
    if (settingWorkFossilSubtitle) settingWorkFossilSubtitle.value = fossil.subtitle || '';
    if (settingWorkFossilDesc) settingWorkFossilDesc.value = fossil.description || '';
    if (settingWorkFossilBtnText) settingWorkFossilBtnText.value = fossil.joinBtnText || '';
    if (settingWorkFossilOppTitle) settingWorkFossilOppTitle.value = fossil.opportunityTitle || '';
    if (settingWorkFossilBannerTitle) settingWorkFossilBannerTitle.value = fossil.bannerTitle || '';
    if (settingWorkFossilBannerSub) settingWorkFossilBannerSub.value = fossil.bannerSubtitle || '';
    if (settingWorkFossilBannerBtnText) settingWorkFossilBannerBtnText.value = fossil.bannerBtnText || '';

    // Sub-Tab 2: Textile & Fast Fashion
    if (settingWorkTextileVisible) settingWorkTextileVisible.checked = tex.visible !== false;
    if (settingWorkTextileBannerTitle) settingWorkTextileBannerTitle.value = tex.bannerTitle || '';
    if (settingWorkTextileBannerSub) settingWorkTextileBannerSub.value = tex.bannerSubtitle || '';
    if (settingWorkTextileBannerBtnText) settingWorkTextileBannerBtnText.value = tex.bannerBtnText || '';
    if (settingWorkTextileIconStyle) settingWorkTextileIconStyle.value = tex.iconStyle || 'double-blue';
    if (settingWorkTextileTitle) settingWorkTextileTitle.value = tex.title || '';
    if (settingWorkTextileSubtitle) settingWorkTextileSubtitle.value = tex.subtitle || '';
    if (settingWorkTextileArchPattern) settingWorkTextileArchPattern.value = tex.archPattern || 'white-semicircle';
    if (settingWorkTextileDesc) settingWorkTextileDesc.value = tex.description || '';
    if (settingWorkTextileBtnText) settingWorkTextileBtnText.value = tex.joinBtnText || '';
    if (settingWorkTextileOppTitle) settingWorkTextileOppTitle.value = tex.opportunityTitle || '';
    if (settingWorkTextileSecHeading) settingWorkTextileSecHeading.value = tex.sectionHeading || '';
    if (settingWorkTextileSecIntro) settingWorkTextileSecIntro.value = tex.sectionIntro || '';

    // Sub-Tab 3: Climate Justice
    if (settingWorkClimateVisible) settingWorkClimateVisible.checked = cj.visible !== false;
    if (settingWorkClimateBannerTitle) settingWorkClimateBannerTitle.value = cj.bannerTitle || '';
    if (settingWorkClimateBannerSub) settingWorkClimateBannerSub.value = cj.bannerSubtitle || '';
    if (settingWorkClimateBannerBtnText) settingWorkClimateBannerBtnText.value = cj.bannerBtnText || '';
    if (settingWorkClimateTitle) settingWorkClimateTitle.value = cj.title || '';
    if (settingWorkClimateSubtitle) settingWorkClimateSubtitle.value = cj.subtitle || '';
    if (settingWorkClimateDesc) settingWorkClimateDesc.value = cj.description || '';
    if (settingWorkClimateBtnText) settingWorkClimateBtnText.value = cj.joinBtnText || '';
    if (settingWorkClimateOppTitle) settingWorkClimateOppTitle.value = cj.opportunityTitle || '';

    // Sub-Tab 4: Activities & Gatherings
    if (settingWorkActBannerTitle) settingWorkActBannerTitle.value = actBanner.bannerTitle || '';
    if (settingWorkActBannerSub) settingWorkActBannerSub.value = actBanner.bannerSubtitle || '';
    if (settingWorkActBannerBtnText) settingWorkActBannerBtnText.value = actBanner.bannerBtnText || '';
    if (settingWorkActHeroQuote) settingWorkActHeroQuote.value = actBanner.heroQuote || '';
    if (settingWorkActHeroAuthor) settingWorkActHeroAuthor.value = actBanner.heroAuthor || '';
    if (settingWorkActHeroHeading) settingWorkActHeroHeading.value = actBanner.heroHeading || '';
    if (settingWorkActHeroDesc) settingWorkActHeroDesc.value = actBanner.heroDescription || '';

    const gathering = actBanner.upcomingGathering || {};
    if (settingWorkActGatheringVisible) settingWorkActGatheringVisible.checked = gathering.visible !== false;
    if (settingWorkActGatheringTitle) settingWorkActGatheringTitle.value = gathering.title || '';
    if (settingWorkActGatheringDate) settingWorkActGatheringDate.value = gathering.date || '';
    if (settingWorkActGatheringDesc) settingWorkActGatheringDesc.value = gathering.subtitle || '';
    if (settingWorkActGatheringBtnText) settingWorkActGatheringBtnText.value = gathering.btnText || 'SEE MORE';
    if (settingWorkActGatheringLink) settingWorkActGatheringLink.value = gathering.link || '/pages/get-involved.html';
    if (settingWorkActGatheringModal) settingWorkActGatheringModal.checked = Boolean(gathering.openModal);

    updateGatheringCalloutPreview();
  }

  // Home Page Video Toggle
  if (settingHomeShowVideo && settingsHomeVideoGroup) {
    settingHomeShowVideo.addEventListener('change', () => {
      settingsHomeVideoGroup.style.display = settingHomeShowVideo.checked ? 'flex' : 'none';
    });
  }

  // Home Page Video File Upload
  if (settingHomeVideoFile) {
    settingHomeVideoFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (settingHomeVideoFilename) {
        settingHomeVideoFilename.textContent = file.name + ' (Uploading...)';
        settingHomeVideoFilename.style.display = 'inline-block';
      }

      if (window.DataStore && window.DataStore.apiBase) {
        try {
          const uploaded = await window.DataStore.uploadMedia(file, { category: 'Video', title: file.name });
          if (uploaded && uploaded.path) {
            if (settingHomeVideoUrl) settingHomeVideoUrl.value = uploaded.path;
            if (settingHomeVideoFilename) {
              settingHomeVideoFilename.textContent = file.name + ' (Server Stored)';
            }
            showToast(`Uploaded video "${file.name}" to server`);
            return;
          }
        } catch (err) {
          console.warn('Server video upload failed, using FileReader fallback:', err);
        }
      }

      if (file.size > 25 * 1024 * 1024) {
        alert('Notice: Large video files (>25MB) may exceed browser localStorage limits. Consider using a direct video URL or uploading via PHP server.');
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (settingHomeVideoUrl) settingHomeVideoUrl.value = dataUrl;
        if (settingHomeVideoFilename) {
          settingHomeVideoFilename.textContent = file.name;
          settingHomeVideoFilename.style.display = 'inline-block';
        }
        showToast(`Loaded home video "${file.name}"`);
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnClearHomeVideo) {
    btnClearHomeVideo.addEventListener('click', () => {
      if (settingHomeVideoUrl) settingHomeVideoUrl.value = '';
      if (settingHomeVideoFile) settingHomeVideoFile.value = '';
      if (settingHomeVideoFilename) {
        settingHomeVideoFilename.textContent = '';
        settingHomeVideoFilename.style.display = 'none';
      }
      showToast('Cleared home video source');
    });
  }

  // Home Video Thumbnail File Upload
  async function handleUploadedHomeThumb(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (settingHomeThumbFilename) {
      settingHomeThumbFilename.textContent = file.name + ' (Uploading...)';
      settingHomeThumbFilename.style.display = 'inline-block';
    }

    if (window.DataStore && window.DataStore.apiBase) {
      try {
        const uploaded = await window.DataStore.uploadMedia(file, { category: 'Thumbnail', title: file.name });
        if (uploaded && uploaded.path) {
          if (settingHomeThumbUrl) settingHomeThumbUrl.value = uploaded.path;
          if (settingHomeThumbPreview) settingHomeThumbPreview.src = uploaded.path.startsWith('http') || uploaded.path.startsWith('/') ? uploaded.path : `../${uploaded.path}`;
          if (settingHomeThumbFilename) {
            settingHomeThumbFilename.textContent = file.name + ' (Server Stored)';
          }
          showToast(`Uploaded home thumbnail "${file.name}" to server`);
          return;
        }
      } catch (err) {
        console.warn('Server thumb upload failed, falling back to local FileReader:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      if (settingHomeThumbUrl) settingHomeThumbUrl.value = dataUrl;
      if (settingHomeThumbPreview) settingHomeThumbPreview.src = dataUrl;
      if (settingHomeThumbFilename) {
        settingHomeThumbFilename.textContent = file.name;
        settingHomeThumbFilename.style.display = 'inline-block';
      }
      showToast(`Loaded home thumbnail "${file.name}"`);
    };
    reader.readAsDataURL(file);
  }

  if (settingHomeThumbFile) {
    settingHomeThumbFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedHomeThumb(file);
    });
  }

  if (btnClearHomeThumb) {
    btnClearHomeThumb.addEventListener('click', () => {
      if (settingHomeThumbUrl) settingHomeThumbUrl.value = '';
      if (settingHomeThumbPreview) settingHomeThumbPreview.src = '../Assets/CAEA-Navbar-Logo.png';
      if (settingHomeThumbFile) settingHomeThumbFile.value = '';
      if (settingHomeThumbFilename) {
        settingHomeThumbFilename.textContent = '';
        settingHomeThumbFilename.style.display = 'none';
      }
      showToast('Cleared home video thumbnail');
    });
  }

  if (settingHomeThumbUrl) {
    settingHomeThumbUrl.addEventListener('input', () => {
      if (settingHomeThumbPreview) {
        const val = settingHomeThumbUrl.value.trim();
        settingHomeThumbPreview.src = resolveAdminImg(val);
      }
    });
  }

  if (settingHomeThumbDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      settingHomeThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        settingHomeThumbDropzone.style.borderColor = '#a3d88d';
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      settingHomeThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        settingHomeThumbDropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    });
    settingHomeThumbDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleUploadedHomeThumb(files[0]);
      }
    });
  }

  let adminQuotesList = [];

  function renderAdminQuotesList() {
    const container = document.getElementById('admin-quotes-container');
    if (!container) return;
    container.innerHTML = '';

    if (!adminQuotesList || adminQuotesList.length === 0) {
      container.innerHTML = '<p style="color: var(--admin-text-muted); font-size: 13px; margin: 4px 0;">No quotes added yet. Add your first quote below.</p>';
      return;
    }

    adminQuotesList.forEach((quote, index) => {
      const row = document.createElement('div');
      row.className = 'form-row quote-row-item';
      row.style.cssText = 'background: rgba(0,0,0,0.2); padding: 10px 14px; border-radius: 6px; border: 1px solid var(--admin-card-border); align-items: center;';

      row.innerHTML = `
        <div class="form-group flex-2" style="margin:0;">
          <input type="text" class="admin-input quote-input-text" data-index="${index}" value="${escapeHtml(quote.text || '')}" placeholder="Quote text" />
        </div>
        <div class="form-group flex-1" style="margin:0;">
          <input type="text" class="admin-input quote-input-author" data-index="${index}" value="${escapeHtml(quote.author || '')}" placeholder="Author" />
        </div>
        <button type="button" class="btn-clear-img btn-delete-quote" data-index="${index}" style="color: #ff6b6b; padding: 6px 12px; border-color: rgba(255,107,107,0.3);" title="Remove quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Delete
        </button>
      `;

      container.appendChild(row);
    });

    container.querySelectorAll('.btn-delete-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        if (!isNaN(idx)) {
          adminQuotesList.splice(idx, 1);
          renderAdminQuotesList();
        }
      });
    });

    container.querySelectorAll('.quote-input-text').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        if (!isNaN(idx) && adminQuotesList[idx]) {
          adminQuotesList[idx].text = e.target.value;
        }
      });
    });

    container.querySelectorAll('.quote-input-author').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        if (!isNaN(idx) && adminQuotesList[idx]) {
          adminQuotesList[idx].author = e.target.value;
        }
      });
    });
  }

  const btnAddQuote = document.getElementById('btn-add-quote');
  if (btnAddQuote) {
    btnAddQuote.addEventListener('click', () => {
      const textEl = document.getElementById('new-quote-text');
      const authorEl = document.getElementById('new-quote-author');
      const text = textEl ? textEl.value.trim() : '';
      const author = authorEl ? authorEl.value.trim() : '';

      if (!text) {
        showToast('Please enter quote text first');
        return;
      }

      adminQuotesList.push({ text, author });
      if (textEl) textEl.value = '';
      if (authorEl) authorEl.value = '';
      renderAdminQuotesList();
      showToast('Added quote to list');
    });
  }

  // Save Home Page Settings
  if (btnSaveHomeSettings) {
    btnSaveHomeSettings.addEventListener('click', () => {
      if (!window.DataStore) return;

      const videoUrlVal = (settingHomeVideoUrl ? settingHomeVideoUrl.value : '').trim();

      const homeSettings = {
        latestTitle: (settingHomeLatestTitle ? settingHomeLatestTitle.value : '').trim(),
        latestSubtitle: (settingHomeLatestSubtitle ? settingHomeLatestSubtitle.value : '').trim(),
        showLatestVideo: settingHomeShowVideo ? settingHomeShowVideo.checked : true,
        latestVideoTitle: (settingHomeVideoTitle ? settingHomeVideoTitle.value : '').trim(),
        latestVideoDescription: (settingHomeVideoDesc ? settingHomeVideoDesc.value : '').trim(),
        latestVideoUrl: videoUrlVal || 'Assets/Video/Hero.mov',
        heroVideoUrl: videoUrlVal || 'Assets/Video/Hero.mov',
        latestVideoThumbnail: (settingHomeThumbUrl ? settingHomeThumbUrl.value : '').trim(),
        heroQuote: adminQuotesList.length > 0 ? adminQuotesList[0].text : (settingHomeHeroQuote ? settingHomeHeroQuote.value : '').trim(),
        heroQuoteAuthor: adminQuotesList.length > 0 ? adminQuotesList[0].author : (settingHomeHeroAuthor ? settingHomeHeroAuthor.value : '').trim(),
        quotes: adminQuotesList
      };

      window.DataStore.savePageSettings('home', homeSettings);
      showToast('Home page settings & quotes saved successfully!');
    });
  }

  // Toggle Activities video details visibility
  if (settingActShowVideo && settingsVideoGroup) {
    settingActShowVideo.addEventListener('change', () => {
      settingsVideoGroup.style.display = settingActShowVideo.checked ? 'flex' : 'none';
    });
  }

  // Activities Video File Upload
  if (settingActVideoFile) {
    settingActVideoFile.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (settingActVideoFilename) {
        settingActVideoFilename.textContent = file.name + ' (Uploading...)';
        settingActVideoFilename.style.display = 'inline-block';
      }

      if (window.DataStore && window.DataStore.apiBase) {
        try {
          const uploaded = await window.DataStore.uploadMedia(file, { category: 'Video', title: file.name });
          if (uploaded && uploaded.path) {
            if (settingActVideoUrl) settingActVideoUrl.value = uploaded.path;
            if (settingActVideoFilename) {
              settingActVideoFilename.textContent = file.name + ' (Server Stored)';
            }
            showToast(`Uploaded video "${file.name}" to server`);
            return;
          }
        } catch (err) {
          console.warn('Server video upload failed, using FileReader fallback:', err);
        }
      }

      if (file.size > 25 * 1024 * 1024) {
        alert('Notice: Large video files (>25MB) may exceed browser localStorage limits. Consider using a direct video URL or uploading to server.');
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (settingActVideoUrl) settingActVideoUrl.value = dataUrl;
        if (settingActVideoFilename) {
          settingActVideoFilename.textContent = file.name;
          settingActVideoFilename.style.display = 'inline-block';
        }
        showToast(`Loaded video file "${file.name}"`);
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnClearActVideo) {
    btnClearActVideo.addEventListener('click', () => {
      if (settingActVideoUrl) settingActVideoUrl.value = '';
      if (settingActVideoFile) settingActVideoFile.value = '';
      if (settingActVideoFilename) {
        settingActVideoFilename.textContent = '';
        settingActVideoFilename.style.display = 'none';
      }
      showToast('Cleared video source');
    });
  }

  // Video Thumbnail File Upload
  async function handleUploadedVideoThumb(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    if (settingActThumbFilename) {
      settingActThumbFilename.textContent = file.name + ' (Uploading...)';
      settingActThumbFilename.style.display = 'inline-block';
    }

    if (window.DataStore && window.DataStore.apiBase) {
      try {
        const uploaded = await window.DataStore.uploadMedia(file, { category: 'Thumbnail', title: file.name });
        if (uploaded && uploaded.path) {
          if (settingActThumbUrl) settingActThumbUrl.value = uploaded.path;
          if (settingActThumbPreview) settingActThumbPreview.src = uploaded.path.startsWith('http') || uploaded.path.startsWith('/') ? uploaded.path : `../${uploaded.path}`;
          if (settingActThumbFilename) {
            settingActThumbFilename.textContent = file.name + ' (Server Stored)';
          }
          showToast(`Loaded thumbnail "${file.name}" to server`);
          return;
        }
      } catch (err) {
        console.warn('Server thumb upload failed, falling back to FileReader:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      if (settingActThumbUrl) settingActThumbUrl.value = dataUrl;
      if (settingActThumbPreview) settingActThumbPreview.src = dataUrl;
      if (settingActThumbFilename) {
        settingActThumbFilename.textContent = file.name;
        settingActThumbFilename.style.display = 'inline-block';
      }
      showToast(`Loaded thumbnail "${file.name}"`);
    };
    reader.readAsDataURL(file);
  }

  if (settingActThumbFile) {
    settingActThumbFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedVideoThumb(file);
    });
  }

  if (btnClearActThumb) {
    btnClearActThumb.addEventListener('click', () => {
      if (settingActThumbUrl) settingActThumbUrl.value = '';
      if (settingActThumbPreview) settingActThumbPreview.src = '../Assets/CAEA-Navbar-Logo.png';
      if (settingActThumbFile) settingActThumbFile.value = '';
      if (settingActThumbFilename) {
        settingActThumbFilename.textContent = '';
        settingActThumbFilename.style.display = 'none';
      }
      showToast('Cleared video thumbnail');
    });
  }

  if (settingActThumbUrl) {
    settingActThumbUrl.addEventListener('input', () => {
      if (settingActThumbPreview) {
        const val = settingActThumbUrl.value.trim();
        settingActThumbPreview.src = resolveAdminImg(val);
      }
    });
  }

  if (settingVideoThumbDropzone) {
    ['dragenter', 'dragover'].forEach(eventName => {
      settingVideoThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        settingVideoThumbDropzone.style.borderColor = '#a3d88d';
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      settingVideoThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        settingVideoThumbDropzone.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    });
    settingVideoThumbDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleUploadedVideoThumb(files[0]);
      }
    });
  }

  if (btnSavePageSettings) {
    btnSavePageSettings.addEventListener('click', () => {
      if (!window.DataStore) return;

      const intervalSec = parseFloat(settingActInterval.value) || 5;
      const intervalMs = Math.max(2000, Math.round(intervalSec * 1000));

      const activitiesSettings = {
        showVideo: settingActShowVideo ? settingActShowVideo.checked : true,
        videoTitle: (settingActVideoTitle.value || '').trim(),
        videoDescription: (settingActVideoDesc.value || '').trim(),
        videoUrl: (settingActVideoUrl.value || '').trim(),
        videoThumbnail: (settingActThumbUrl.value || '').trim(),
        autoplayImages: settingActAutoplay ? settingActAutoplay.checked : true,
        imageCycleInterval: intervalMs
      };

      const ourStorySettings = {
        teamHeaderTitle: (settingStoryHeader.value || '').trim(),
        quoteText: (settingStoryQuote.value || '').trim(),
        quoteAuthor: (settingStoryAuthor.value || '').trim()
      };

      window.DataStore.savePageSettings('activities', activitiesSettings);
      window.DataStore.savePageSettings('ourStory', ourStorySettings);

      showToast('Page content & media settings saved successfully!');
    });
  }

  // 10.4 Sub-Tab 1: Save Fossil Fuel Phaseout Settings
  if (btnSaveFossilSettings) {
    btnSaveFossilSettings.addEventListener('click', () => {
      if (!window.DataStore) return;
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      const fossil = ourWork.fossilFuel || {};

      ourWork.fossilFuel = {
        ...fossil,
        visible: settingWorkFossilVisible ? settingWorkFossilVisible.checked : true,
        title: (settingWorkFossilTitle ? settingWorkFossilTitle.value : '').trim() || 'FOSSIL FUEL PHASEOUT',
        subtitle: (settingWorkFossilSubtitle ? settingWorkFossilSubtitle.value : '').trim(),
        description: (settingWorkFossilDesc ? settingWorkFossilDesc.value : '').trim(),
        joinBtnText: (settingWorkFossilBtnText ? settingWorkFossilBtnText.value : '').trim() || 'JOIN US',
        opportunityTitle: (settingWorkFossilOppTitle ? settingWorkFossilOppTitle.value : '').trim() || 'Fossil Fuel Phaseout Fellow',
        bannerTitle: (settingWorkFossilBannerTitle ? settingWorkFossilBannerTitle.value : '').trim() || 'The Life Story of Manchhar Lake',
        bannerSubtitle: (settingWorkFossilBannerSub ? settingWorkFossilBannerSub.value : '').trim(),
        bannerBtnText: (settingWorkFossilBannerBtnText ? settingWorkFossilBannerBtnText.value : '').trim() || 'READ MORE'
      };

      window.DataStore.savePageSettings('ourWork', ourWork);
      showToast('Fossil Fuel Phaseout narrative & banner settings saved!');
    });
  }

  // 10.5 Sub-Tab 2: Save Textile & Fast Fashion Settings
  if (btnSaveTextileSettings) {
    btnSaveTextileSettings.addEventListener('click', () => {
      if (!window.DataStore) return;
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      const tex = ourWork.textile || {};
      const cards = tex.cards || window.DataStore.get('textileCards') || [];

      ourWork.textile = {
        ...tex,
        visible: settingWorkTextileVisible ? settingWorkTextileVisible.checked : true,
        bannerTitle: (settingWorkTextileBannerTitle ? settingWorkTextileBannerTitle.value : '').trim() || 'TEXTILE & FAST FASHION',
        bannerSubtitle: (settingWorkTextileBannerSub ? settingWorkTextileBannerSub.value : '').trim(),
        bannerBtnText: (settingWorkTextileBannerBtnText ? settingWorkTextileBannerBtnText.value : '').trim() || 'EXPLORE WORK',
        iconStyle: (settingWorkTextileIconStyle ? settingWorkTextileIconStyle.value : 'double-blue'),
        title: (settingWorkTextileTitle ? settingWorkTextileTitle.value : '').trim() || 'TEXTILE & FAST FASHION',
        subtitle: (settingWorkTextileSubtitle ? settingWorkTextileSubtitle.value : '').trim(),
        archPattern: (settingWorkTextileArchPattern ? settingWorkTextileArchPattern.value : 'white-semicircle'),
        description: (settingWorkTextileDesc ? settingWorkTextileDesc.value : '').trim(),
        joinBtnText: (settingWorkTextileBtnText ? settingWorkTextileBtnText.value : '').trim() || 'JOIN US',
        opportunityTitle: (settingWorkTextileOppTitle ? settingWorkTextileOppTitle.value : '').trim() || 'Textile Sector Researcher',
        sectionHeading: (settingWorkTextileSecHeading ? settingWorkTextileSecHeading.value : '').trim() || 'Working towards a future for sustainable textile practices',
        sectionIntro: (settingWorkTextileSecIntro ? settingWorkTextileSecIntro.value : '').trim(),
        cards: cards
      };

      window.DataStore.savePageSettings('ourWork', ourWork);
      showToast('Textile & Fast Fashion settings & banner saved!');
    });
  }

  // 10.6 Sub-Tab 3: Save Climate Justice Settings
  if (btnSaveClimateSettings) {
    btnSaveClimateSettings.addEventListener('click', () => {
      if (!window.DataStore) return;
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      const cj = ourWork.climateJustice || {};

      ourWork.climateJustice = {
        ...cj,
        visible: settingWorkClimateVisible ? settingWorkClimateVisible.checked : true,
        bannerTitle: (settingWorkClimateBannerTitle ? settingWorkClimateBannerTitle.value : '').trim() || 'CLIMATE JUSTICE',
        bannerSubtitle: (settingWorkClimateBannerSub ? settingWorkClimateBannerSub.value : '').trim(),
        bannerBtnText: (settingWorkClimateBannerBtnText ? settingWorkClimateBannerBtnText.value : '').trim() || 'LEARN MORE',
        title: (settingWorkClimateTitle ? settingWorkClimateTitle.value : '').trim() || 'CLIMATE JUSTICE',
        subtitle: (settingWorkClimateSubtitle ? settingWorkClimateSubtitle.value : '').trim(),
        description: (settingWorkClimateDesc ? settingWorkClimateDesc.value : '').trim(),
        joinBtnText: (settingWorkClimateBtnText ? settingWorkClimateBtnText.value : '').trim() || 'JOIN US',
        opportunityTitle: (settingWorkClimateOppTitle ? settingWorkClimateOppTitle.value : '').trim() || 'Climate Justice Organizer'
      };

      window.DataStore.savePageSettings('ourWork', ourWork);
      showToast('Climate Justice policy narrative & banner saved!');
    });
  }

  // Sub-Tab 4: Live Gathering Banner Preview Updater
  function updateGatheringCalloutPreview() {
    const prevDate = document.getElementById('preview-gathering-date');
    const prevTitle = document.getElementById('preview-gathering-title');
    const prevDesc = document.getElementById('preview-gathering-desc');
    const prevBtn = document.getElementById('preview-gathering-btn');
    const prevCard = document.querySelector('.gathering-preview-card');

    const dateVal = settingWorkActGatheringDate ? settingWorkActGatheringDate.value.trim() : '';
    const titleVal = settingWorkActGatheringTitle ? settingWorkActGatheringTitle.value.trim() : '';
    const descVal = settingWorkActGatheringDesc ? settingWorkActGatheringDesc.value.trim() : '';
    const btnVal = settingWorkActGatheringBtnText ? settingWorkActGatheringBtnText.value.trim() : '';
    const isVisible = settingWorkActGatheringVisible ? settingWorkActGatheringVisible.checked : true;

    if (prevDate) prevDate.textContent = dateVal || 'OCTOBER 2026 · REGISTRATION OPEN';
    if (prevTitle) prevTitle.textContent = titleVal || 'CATCH THE UPCOMING GATHERING';
    if (prevDesc) prevDesc.textContent = descVal || 'No experience needed. Just a willingness to show up and act.';
    if (prevBtn) prevBtn.textContent = btnVal || 'SEE MORE';
    if (prevCard) {
      prevCard.style.opacity = isVisible ? '1' : '0.45';
      prevCard.style.filter = isVisible ? 'none' : 'grayscale(60%)';
    }
  }

  [
    settingWorkActGatheringVisible,
    settingWorkActGatheringTitle,
    settingWorkActGatheringDate,
    settingWorkActGatheringDesc,
    settingWorkActGatheringBtnText,
    settingWorkActGatheringLink,
    settingWorkActGatheringModal
  ].forEach(inputEl => {
    if (inputEl) {
      inputEl.addEventListener('input', updateGatheringCalloutPreview);
      inputEl.addEventListener('change', updateGatheringCalloutPreview);
    }
  });

  // Save only the Upcoming Gathering Callout
  if (btnSaveGatheringCallout) {
    btnSaveGatheringCallout.addEventListener('click', () => {
      if (!window.DataStore) return;
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      const act = ourWork.activitiesBanner || {};

      const upcomingGathering = {
        visible: settingWorkActGatheringVisible ? settingWorkActGatheringVisible.checked : true,
        title: (settingWorkActGatheringTitle ? settingWorkActGatheringTitle.value : '').trim() || 'CATCH THE UPCOMING GATHERING',
        subtitle: (settingWorkActGatheringDesc ? settingWorkActGatheringDesc.value : '').trim() || 'No experience needed. Just a willingness to show up and act.',
        date: (settingWorkActGatheringDate ? settingWorkActGatheringDate.value : '').trim() || 'OCTOBER 2026 · REGISTRATION OPEN',
        btnText: (settingWorkActGatheringBtnText ? settingWorkActGatheringBtnText.value : '').trim() || 'SEE MORE',
        link: (settingWorkActGatheringLink ? settingWorkActGatheringLink.value : '').trim() || '/pages/get-involved.html',
        openModal: settingWorkActGatheringModal ? settingWorkActGatheringModal.checked : false
      };

      ourWork.activitiesBanner = {
        ...act,
        upcomingGathering
      };

      window.DataStore.savePageSettings('ourWork', ourWork);
      updateGatheringCalloutPreview();
      showToast('Upcoming Gathering Callout Banner saved!');
    });
  }

  // 10.7 Sub-Tab 4: Save All Activities & Gatherings Page Settings
  if (btnSaveActivitiesSettings) {
    btnSaveActivitiesSettings.addEventListener('click', () => {
      if (!window.DataStore) return;
      const currentSettings = window.DataStore.getPageSettings();
      const ourWork = currentSettings.ourWork || {};
      const act = ourWork.activitiesBanner || {};

      ourWork.activitiesBanner = {
        ...act,
        bannerTitle: (settingWorkActBannerTitle ? settingWorkActBannerTitle.value : '').trim() || 'ACTIVITIES & GATHERINGS',
        bannerSubtitle: (settingWorkActBannerSub ? settingWorkActBannerSub.value : '').trim(),
        bannerBtnText: (settingWorkActBannerBtnText ? settingWorkActBannerBtnText.value : '').trim() || 'SEE MORE',
        heroQuote: (settingWorkActHeroQuote ? settingWorkActHeroQuote.value : '').trim(),
        heroAuthor: (settingWorkActHeroAuthor ? settingWorkActHeroAuthor.value : '').trim(),
        heroHeading: (settingWorkActHeroHeading ? settingWorkActHeroHeading.value : '').trim(),
        heroDescription: (settingWorkActHeroDesc ? settingWorkActHeroDesc.value : '').trim(),
        upcomingGathering: {
          visible: settingWorkActGatheringVisible ? settingWorkActGatheringVisible.checked : true,
          title: (settingWorkActGatheringTitle ? settingWorkActGatheringTitle.value : '').trim() || 'CATCH THE UPCOMING GATHERING',
          subtitle: (settingWorkActGatheringDesc ? settingWorkActGatheringDesc.value : '').trim() || 'No experience needed. Just a willingness to show up and act.',
          date: (settingWorkActGatheringDate ? settingWorkActGatheringDate.value : '').trim() || 'OCTOBER 2026 · REGISTRATION OPEN',
          btnText: (settingWorkActGatheringBtnText ? settingWorkActGatheringBtnText.value : '').trim() || 'SEE MORE',
          link: (settingWorkActGatheringLink ? settingWorkActGatheringLink.value : '').trim() || '/pages/get-involved.html',
          openModal: settingWorkActGatheringModal ? settingWorkActGatheringModal.checked : false
        }
      };

      window.DataStore.savePageSettings('ourWork', ourWork);
      updateGatheringCalloutPreview();
      showToast('Activities & Gatherings banner, hero story & upcoming callout saved!');
    });
  }

  /* ============================================================
     11. Toast Notification & String Helpers
     ============================================================ */
  function showToast(msg) {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a3d88d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${escapeHtml(msg)}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Initial Check
  checkAuth();
});
