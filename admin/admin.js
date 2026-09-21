/**
 * CAEA Admin Dashboard Controller (admin/admin.js)
 * Connects UI interactions to DataStore API.
 */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_PASSCODE = 'caea2024';

  // State
  let activeTab = 'activities';
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
  const statPeople = document.getElementById('stat-people-count');
  const statArticles = document.getElementById('stat-articles-count');
  const statApplications = document.getElementById('stat-applications-count');
  const statOpportunities = document.getElementById('stat-opportunities-count');
  const statMedia = document.getElementById('stat-media-count');
  const tabBadgeApplications = document.getElementById('tab-badge-applications');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.admin-panel');

  // Tables & Grids
  const tableActivitiesBody = document.getElementById('table-activities-body');
  const tablePeopleBody = document.getElementById('table-people-body');
  const tableArticlesBody = document.getElementById('table-articles-body');
  const tableApplicationsBody = document.getElementById('table-applications-body');
  const tableOpportunitiesBody = document.getElementById('table-opportunities-body');
  const tableMediaBody = document.getElementById('table-media-body');
  const mediaGridView = document.getElementById('media-grid-view');
  const mediaTableView = document.getElementById('media-table-view');
  const mediaLibraryCountText = document.getElementById('media-library-count-text');

  // Filters & Search
  const searchActivities = document.getElementById('search-activities');
  const filterActivitiesTag = document.getElementById('filter-activities-tag');

  const searchPeople = document.getElementById('search-people');
  const filterPeopleCategory = document.getElementById('filter-people-category');

  const searchArticles = document.getElementById('search-articles');

  const searchApplications = document.getElementById('search-applications');
  const filterApplicationsStatus = document.getElementById('filter-applications-status');
  const filterApplicationsCategory = document.getElementById('filter-applications-category');
  const btnExportApplicationsCSV = document.getElementById('btn-export-applications-csv');

  const searchOpportunities = document.getElementById('search-opportunities');
  const filterOpportunitiesStatus = document.getElementById('filter-opportunities-status');

  const searchMedia = document.getElementById('search-media');
  const filterMediaCategory = document.getElementById('filter-media-category');
  const mediaBulkUploadInput = document.getElementById('media-bulk-upload-input');
  const btnAddMediaUrl = document.getElementById('btn-add-media-url');
  const btnViewMediaGrid = document.getElementById('btn-view-media-grid');
  const btnViewMediaTable = document.getElementById('btn-view-media-table');

  // Media Modals
  const dialogAddMedia = document.getElementById('admin-add-media-dialog');
  const formAddMediaUrl = document.getElementById('form-add-media-url');
  const btnCloseAddMedia = document.getElementById('btn-close-add-media');
  const btnCancelAddMedia = document.getElementById('btn-cancel-add-media');

  const dialogMediaDetail = document.getElementById('admin-media-detail-dialog');
  const btnCloseMediaDetail = document.getElementById('btn-close-media-detail');
  const btnDeleteMediaItem = document.getElementById('btn-delete-media-item');
  const btnCopyMediaPath = document.getElementById('btn-copy-media-path');

  const dialogMediaPicker = document.getElementById('admin-media-picker-dialog');
  const btnCloseMediaPicker = document.getElementById('btn-close-media-picker');
  const btnCancelMediaPicker = document.getElementById('btn-cancel-media-picker');
  const searchMediaPicker = document.getElementById('search-media-picker');
  const filterMediaPickerCategory = document.getElementById('filter-media-picker-category');
  const mediaPickerGrid = document.getElementById('media-picker-grid');

  let activeMediaPickerTargetInput = null;
  let activeMediaPickerTargetPreview = null;
  let activeDetailMediaId = null;

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

  // Buttons
  const btnAddActivity = document.getElementById('btn-add-activity');
  const btnAddPerson = document.getElementById('btn-add-person');
  const btnAddArticle = document.getElementById('btn-add-article');
  const btnAddOpportunity = document.getElementById('btn-add-opportunity');
  const btnExportData = document.getElementById('btn-export-data');
  const inputImportFile = document.getElementById('input-import-file');
  const btnResetData = document.getElementById('btn-reset-data');

  /* ============================================================
     1. Authentication Gate
     ============================================================ */
  function checkAuth() {
    const isAuth = sessionStorage.getItem('caea_admin_auth');
    if (isAuth === 'true') {
      authGate.classList.add('hidden');
      initConsole();
    } else {
      authGate.classList.remove('hidden');
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = authPasscode.value.trim();
      if (val === DEFAULT_PASSCODE || val === 'admin') {
        sessionStorage.setItem('caea_admin_auth', 'true');
        authError.textContent = '';
        authGate.classList.add('hidden');
        showToast('Console unlocked successfully');
        initConsole();
      } else {
        authError.textContent = 'Invalid administrative passcode. Please try again.';
      }
    });
  }

  if (btnLock) {
    btnLock.addEventListener('click', () => {
      sessionStorage.removeItem('caea_admin_auth');
      authPasscode.value = '';
      authGate.classList.remove('hidden');
      showToast('Console locked');
    });
  }

  /* ============================================================
     2. Main Console Initialization
     ============================================================ */
  function initConsole() {
    updateStats();
    renderAllTables();
    populateApplicationCategoryFilter();
  }

  function updateStats() {
    if (!window.DataStore) return;
    const activitiesCount = window.DataStore.get('activities').length;
    const peopleCount = window.DataStore.get('people').length;
    const articlesCount = window.DataStore.get('articles').length;
    const applicationsCount = window.DataStore.get('applications').length;
    const opportunitiesCount = window.DataStore.get('opportunities').length;
    const mediaCount = (window.DataStore.get('media') || []).length;

    if (statActivities) statActivities.textContent = activitiesCount;
    if (statPeople) statPeople.textContent = peopleCount;
    if (statArticles) statArticles.textContent = articlesCount;
    if (statApplications) statApplications.textContent = applicationsCount;
    if (statOpportunities) statOpportunities.textContent = opportunitiesCount;
    if (statMedia) statMedia.textContent = mediaCount;
    if (tabBadgeApplications) tabBadgeApplications.textContent = applicationsCount;
  }

  /* ============================================================
     3. Tab Switching
     ============================================================ */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      activeTab = targetTab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === `panel-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  /* ============================================================
     4. Table & Media Rendering
     ============================================================ */
  function renderAllTables() {
    renderActivitiesTable();
    renderPeopleTable();
    renderArticlesTable();
    renderApplicationsTable();
    renderOpportunitiesTable();
    renderMediaLibrary();
  }

  // Activities Table
  window.setActivityAsHero = function(actId) {
    if (!window.DataStore) return;
    const items = window.DataStore.get('activities');
    let title = '';
    items.forEach(item => {
      if (item.id === actId) {
        item.featured = true;
        title = item.title;
      } else {
        item.featured = false;
      }
    });
    localStorage.setItem('caea_activities_data', JSON.stringify(items));
    window.DataStore.dispatchUpdate('activities');
    renderActivitiesTable();
    showToast(`"${title}" is now the Main Hero Event!`);
  };

  function renderActivitiesTable() {
    if (!tableActivitiesBody || !window.DataStore) return;
    let items = window.DataStore.get('activities');
    const query = searchActivities ? searchActivities.value.toLowerCase().trim() : '';
    const tag = filterActivitiesTag ? filterActivitiesTag.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.location && i.location.toLowerCase().includes(query)) ||
        (i.description && i.description.toLowerCase().includes(query))
      );
    }
    if (tag) {
      items = items.filter(i => i.category === tag);
    }

    if (items.length === 0) {
      tableActivitiesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No activities found matching criteria.</td></tr>`;
      return;
    }

    tableActivitiesBody.innerHTML = items.map(item => `
      <tr style="${item.featured ? 'background: rgba(163, 216, 141, 0.05);' : ''}">
        <td style="font-family:monospace; font-size:11px; color:#888;">${item.id}</td>
        <td>
          <img src="../${item.image || 'Assets/Hero-image.png'}" alt="" class="table-media-thumb" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <strong>${escapeHtml(item.title)}</strong>
            ${item.featured ? '<span style="display:inline-flex; align-items:center; gap:3px; padding:2px 7px; border-radius:4px; font-size:10.5px; font-weight:700; background:rgba(163,216,141,0.2); color:#a3d88d; border:1px solid #a3d88d;">⭐ Main Hero</span>' : ''}
          </div>
          <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.location || 'N/A')}</div>
        </td>
        <td>
          <span class="table-badge ${ (item.category || '').toLowerCase() }">${item.category || 'RETREAT'}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
            <button class="action-icon-btn ${item.featured ? 'active' : ''}" style="${item.featured ? 'color:#a3d88d; border-color:#a3d88d;' : ''}" onclick="setActivityAsHero('${item.id}')" title="${item.featured ? 'Currently Featured Main Hero Event' : 'Click to Set as Main Hero Event'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="${item.featured ? '#a3d88d' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
            <button class="action-icon-btn edit-btn" onclick="openEditModal('activities', '${item.id}')" title="Edit Activity">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-icon-btn delete-btn" onclick="confirmDelete('activities', '${item.id}')" title="Delete Activity">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // People Table
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

    tablePeopleBody.innerHTML = items.map(item => `
      <tr>
        <td style="font-family:monospace; font-size:11px; color:#888;">${item.id}</td>
        <td>
          <img src="../${item.image || 'Assets/Team/grid-1-2-Sanaa.png'}" alt="" class="table-media-thumb" style="border-radius:50%; width:36px; height:36px;" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
          <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.role || 'N/A')}</div>
        </td>
        <td>
          <span class="table-badge">${item.category || 'Core Team'}</span>
        </td>
        <td style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#9da5b4;">
          ${escapeHtml(item.bio || 'N/A')}
        </td>
        <td class="text-right">
          <div class="table-actions">
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

  // Articles Table
  function renderArticlesTable() {
    if (!tableArticlesBody || !window.DataStore) return;
    let items = window.DataStore.get('articles');
    const query = searchArticles ? searchArticles.value.toLowerCase().trim() : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.author && i.author.toLowerCase().includes(query)) ||
        (i.excerpt && i.excerpt.toLowerCase().includes(query))
      );
    }

    if (items.length === 0) {
      tableArticlesBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:#888;">No articles found matching criteria.</td></tr>`;
      return;
    }

    tableArticlesBody.innerHTML = items.map(item => `
      <tr>
        <td style="font-family:monospace; font-size:11px; color:#888;">${item.id}</td>
        <td>
          <img src="../${item.image || 'Assets/how-water-became-power.jpg'}" alt="" class="table-media-thumb" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <div style="font-size:12px; color:#9da5b4;">By ${escapeHtml(item.author || 'CAEA Team')}</div>
        </td>
        <td>
          <span class="table-badge">${item.kicker || 'CASE STUDY'}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
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

  // 4. Applied Fields (Applications) Table
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
              <button class="action-icon-btn edit-btn" onclick="openAppDetailModal('${item.id}')" title="Review Submission & Notes">
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
    const apps = window.DataStore.get('applications') || [];
    const opps = window.DataStore.get('opportunities') || [];

    const categoriesSet = new Set();
    apps.forEach(a => {
      if (a.opportunityTitle) categoriesSet.add(a.opportunityTitle);
    });
    opps.forEach(o => {
      if (o.title) categoriesSet.add(o.title);
    });

    let html = `<option value="">All Categories / Roles</option>`;
    categoriesSet.forEach(cat => {
      html += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
    });
    filterApplicationsCategory.innerHTML = html;
  }

  // 5. Get Involved Positions Table (Original Structure)
  function renderOpportunitiesTable() {
    if (!tableOpportunitiesBody || !window.DataStore) return;
    let items = window.DataStore.get('opportunities');
    const query = searchOpportunities ? searchOpportunities.value.toLowerCase().trim() : '';
    const statusFilter = filterOpportunitiesStatus ? filterOpportunitiesStatus.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(query)) ||
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

    tableOpportunitiesBody.innerHTML = items.map(item => {
      const statusClass = `status-${(item.status || 'open').toLowerCase()}`;
      const themeBadge = item.theme === 'black' ?
        `<span style="display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; background:#000; border:1px solid #333; color:#fff;">Black Card</span>` :
        `<span style="display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; background:#4D64D8; color:#fff;">Blue Card</span>`;

      return `
        <tr>
          <td style="font-family:monospace; font-size:11px; color:#888;">${item.id}</td>
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

  // 6. Media Library Renderer & Manager
  function renderMediaLibrary() {
    if (!mediaGridView || !window.DataStore) return;
    let items = window.DataStore.get('media') || [];
    const query = searchMedia ? searchMedia.value.toLowerCase().trim() : '';
    const cat = filterMediaCategory ? filterMediaCategory.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.path && i.path.toLowerCase().includes(query)) ||
        (i.category && i.category.toLowerCase().includes(query)) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(query)))
      );
    }
    if (cat) {
      items = items.filter(i => i.category === cat);
    }

    if (mediaLibraryCountText) {
      mediaLibraryCountText.textContent = `Showing ${items.length} media ${items.length === 1 ? 'asset' : 'assets'}`;
    }

    // Render Grid View
    if (items.length === 0) {
      mediaGridView.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:48px; color:#888;">No media assets found matching criteria.</div>`;
    } else {
      mediaGridView.innerHTML = items.map(item => {
        const fullSrc = item.path.startsWith('data:') || item.path.startsWith('http') ? item.path : '../' + item.path;
        return `
          <div class="media-card" data-id="${item.id}">
            <div class="media-card-img-wrap">
              <img src="${fullSrc}" alt="${escapeHtml(item.title)}" class="media-card-img" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
              <div class="media-card-overlay">
                <button class="media-overlay-btn" onclick="openMediaDetailModal('${item.id}')" title="Inspect & Full View">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="media-overlay-btn" onclick="copyMediaPath('${item.path}')" title="Copy Path/URL">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button class="media-overlay-btn delete-btn" onclick="confirmDelete('media', '${item.id}')" title="Delete Asset">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div class="media-card-body">
              <span class="media-card-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</span>
              <div class="media-card-footer">
                <span class="media-card-tag">${escapeHtml(item.category || 'General')}</span>
                <span class="media-card-date">${item.dateFormatted || item.date || ''}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Table View
    if (tableMediaBody) {
      if (items.length === 0) {
        tableMediaBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:28px; color:#888;">No media found.</td></tr>`;
      } else {
        tableMediaBody.innerHTML = items.map(item => {
          const fullSrc = item.path.startsWith('data:') || item.path.startsWith('http') ? item.path : '../' + item.path;
          return `
            <tr>
              <td>
                <img src="${fullSrc}" alt="" class="table-media-thumb" style="width:48px; height:36px; border-radius:4px; object-fit:cover;" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
              </td>
              <td>
                <strong>${escapeHtml(item.title)}</strong>
                <div style="font-family:monospace; font-size:11px; color:#888;">${item.id}</div>
              </td>
              <td><span class="table-badge">${escapeHtml(item.category || 'General')}</span></td>
              <td style="font-family:monospace; font-size:11.5px; color:#a0aec0; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                ${escapeHtml(item.path)}
              </td>
              <td>${item.dateFormatted || item.date || 'N/A'}</td>
              <td class="text-right">
                <div class="table-actions">
                  <button class="action-icon-btn" onclick="openMediaDetailModal('${item.id}')" title="View Details">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button class="action-icon-btn" onclick="copyMediaPath('${item.path}')" title="Copy Path">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button class="action-icon-btn delete-btn" onclick="confirmDelete('media', '${item.id}')" title="Delete Asset">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  // Media Helpers
  window.copyMediaPath = function(path) {
    if (!path) return;
    navigator.clipboard.writeText(path).then(() => {
      showToast(`Copied "${path}" to clipboard!`);
    }).catch(() => {
      showToast(`Path: ${path}`);
    });
  };

  window.openMediaDetailModal = function(id) {
    activeDetailMediaId = id;
    const item = window.DataStore.getById('media', id);
    if (!item || !dialogMediaDetail) return;

    const fullSrc = item.path.startsWith('data:') || item.path.startsWith('http') ? item.path : '../' + item.path;
    const imgEl = document.getElementById('media-detail-img');
    const nameEl = document.getElementById('media-detail-name');
    const catEl = document.getElementById('media-detail-category');
    const pathEl = document.getElementById('media-detail-path-input');
    const dateEl = document.getElementById('media-detail-date');

    if (imgEl) imgEl.src = fullSrc;
    if (nameEl) nameEl.textContent = item.title || 'Untitled Asset';
    if (catEl) catEl.textContent = item.category || 'General';
    if (pathEl) pathEl.value = item.path || '';
    if (dateEl) dateEl.textContent = item.dateFormatted || item.date || 'N/A';

    dialogMediaDetail.showModal();
  };

  if (btnCloseMediaDetail) btnCloseMediaDetail.addEventListener('click', () => dialogMediaDetail.close());
  if (btnCopyMediaPath) {
    btnCopyMediaPath.addEventListener('click', () => {
      const pathEl = document.getElementById('media-detail-path-input');
      if (pathEl) copyMediaPath(pathEl.value);
    });
  }
  if (btnDeleteMediaItem) {
    btnDeleteMediaItem.addEventListener('click', () => {
      if (activeDetailMediaId) {
        dialogMediaDetail.close();
        confirmDelete('media', activeDetailMediaId);
      }
    });
  }

  // Media Picker Logic
  window.openMediaPicker = function(targetInputId, targetPreviewId) {
    activeMediaPickerTargetInput = document.getElementById(targetInputId);
    activeMediaPickerTargetPreview = document.getElementById(targetPreviewId);
    renderMediaPickerGrid();
    if (dialogMediaPicker) dialogMediaPicker.showModal();
  };

  function renderMediaPickerGrid() {
    if (!mediaPickerGrid || !window.DataStore) return;
    let items = window.DataStore.get('media') || [];
    const query = searchMediaPicker ? searchMediaPicker.value.toLowerCase().trim() : '';
    const cat = filterMediaPickerCategory ? filterMediaPickerCategory.value : '';

    if (query) {
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(query)) ||
        (i.path && i.path.toLowerCase().includes(query))
      );
    }
    if (cat) {
      items = items.filter(i => i.category === cat);
    }

    if (items.length === 0) {
      mediaPickerGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:#888;">No matching media assets found.</div>`;
      return;
    }

    mediaPickerGrid.innerHTML = items.map(item => {
      const fullSrc = item.path.startsWith('data:') || item.path.startsWith('http') ? item.path : '../' + item.path;
      return `
        <div class="media-picker-item" onclick="selectMediaForInput('${escapeHtml(item.path)}')" title="${escapeHtml(item.title)}">
          <img src="${fullSrc}" alt="" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
          <span class="media-picker-item-label">${escapeHtml(item.title)}</span>
        </div>
      `;
    }).join('');
  }

  window.selectMediaForInput = function(mediaPath) {
    if (activeMediaPickerTargetInput) {
      activeMediaPickerTargetInput.value = mediaPath;
    }
    if (activeMediaPickerTargetPreview) {
      activeMediaPickerTargetPreview.src = mediaPath.startsWith('data:') || mediaPath.startsWith('http') ? mediaPath : '../' + mediaPath;
    }
    if (dialogMediaPicker) dialogMediaPicker.close();
    showToast(`Media selected: ${mediaPath}`);
  };

  if (btnCloseMediaPicker) btnCloseMediaPicker.addEventListener('click', () => dialogMediaPicker.close());
  if (btnCancelMediaPicker) btnCancelMediaPicker.addEventListener('click', () => dialogMediaPicker.close());
  if (searchMediaPicker) searchMediaPicker.addEventListener('input', renderMediaPickerGrid);
  if (filterMediaPickerCategory) filterMediaPickerCategory.addEventListener('change', renderMediaPickerGrid);

  // View Switcher (Grid vs Table)
  if (btnViewMediaGrid && btnViewMediaTable) {
    btnViewMediaGrid.addEventListener('click', () => {
      btnViewMediaGrid.classList.add('active');
      btnViewMediaTable.classList.remove('active');
      if (mediaGridView) mediaGridView.style.display = 'grid';
      if (mediaTableView) mediaTableView.style.display = 'none';
    });
    btnViewMediaTable.addEventListener('click', () => {
      btnViewMediaTable.classList.add('active');
      btnViewMediaGrid.classList.remove('active');
      if (mediaGridView) mediaGridView.style.display = 'none';
      if (mediaTableView) mediaTableView.style.display = 'block';
    });
  }

  // Bulk Upload Images to Media Library
  if (mediaBulkUploadInput) {
    mediaBulkUploadInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      let processed = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          window.DataStore.add('media', {
            title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            category: 'Uploads',
            path: dataUrl,
            tags: ['upload', cleanName.toLowerCase()]
          });
          processed++;
          if (processed === files.length) {
            updateStats();
            renderMediaLibrary();
            showToast(`Uploaded ${files.length} new ${files.length === 1 ? 'image' : 'images'} to Media Library!`);
            mediaBulkUploadInput.value = '';
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Add Media URL Form
  if (btnAddMediaUrl && dialogAddMedia) {
    btnAddMediaUrl.addEventListener('click', () => {
      if (formAddMediaUrl) formAddMediaUrl.reset();
      dialogAddMedia.showModal();
    });
  }
  if (btnCloseAddMedia) btnCloseAddMedia.addEventListener('click', () => dialogAddMedia.close());
  if (btnCancelAddMedia) btnCancelAddMedia.addEventListener('click', () => dialogAddMedia.close());

  if (formAddMediaUrl) {
    formAddMediaUrl.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('add-media-title').value.trim();
      const category = document.getElementById('add-media-category').value;
      const path = document.getElementById('add-media-path').value.trim();
      const tagsStr = document.getElementById('add-media-tags').value.trim();
      const tags = tagsStr ? tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

      if (!title || !path) return;

      window.DataStore.add('media', {
        title,
        category,
        path,
        tags
      });

      updateStats();
      renderMediaLibrary();
      dialogAddMedia.close();
      showToast(`Added "${title}" to Media Library!`);
    });
  }

  // Filter Listeners
  if (searchActivities) searchActivities.addEventListener('input', renderActivitiesTable);
  if (filterActivitiesTag) filterActivitiesTag.addEventListener('change', renderActivitiesTable);

  if (searchPeople) searchPeople.addEventListener('input', renderPeopleTable);
  if (filterPeopleCategory) filterPeopleCategory.addEventListener('change', renderPeopleTable);

  if (searchArticles) searchArticles.addEventListener('input', renderArticlesTable);

  if (searchApplications) searchApplications.addEventListener('input', renderApplicationsTable);
  if (filterApplicationsStatus) filterApplicationsStatus.addEventListener('change', renderApplicationsTable);
  if (filterApplicationsCategory) filterApplicationsCategory.addEventListener('change', renderApplicationsTable);

  if (searchOpportunities) searchOpportunities.addEventListener('input', renderOpportunitiesTable);
  if (filterOpportunitiesStatus) filterOpportunitiesStatus.addEventListener('change', renderOpportunitiesTable);

  if (searchMedia) searchMedia.addEventListener('input', renderMediaLibrary);
  if (filterMediaCategory) filterMediaCategory.addEventListener('change', renderMediaLibrary);

  /* ============================================================
     5. Universal CRUD Form Dialog (Activities, People, Articles, Opportunities)
     ============================================================ */
  window.openEditModal = function(collection, id = null) {
    activeEditId = id;
    formCollectionInput.value = collection;
    formRecordIdInput.value = id || '';

    const isEdit = !!id;
    const item = isEdit ? window.DataStore.getById(collection, id) : {};

    const collectionName = collection === 'opportunities' ? 'Get Involved Position' :
                           collection === 'activities' ? 'Activity / Work Item' :
                           collection === 'people' ? 'Team Member' :
                           collection === 'articles' ? 'Article' : collection;

    modalTitle.textContent = `${isEdit ? 'Edit' : 'Add New'} ${collectionName}`;

    // Render Dynamic Form Fields based on Collection
    let fieldsHtml = '';

    const currentImg = item.image || (collection === 'activities' ? 'Assets/Hero-image.png' : collection === 'people' ? 'Assets/Team/sanaa-muhammad.jpg' : 'Assets/how-water-became-power.jpg');
    const imageFieldHtml = `
      <div class="form-group">
        <label class="form-label">Media / Image Asset</label>
        <div class="image-upload-wrapper">
          <div class="image-preview-container">
            <img id="form-image-preview" src="${currentImg.startsWith('data:') || currentImg.startsWith('http') ? currentImg : '../' + currentImg}" alt="Preview" class="form-img-preview" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
          </div>
          <div class="image-upload-controls">
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <label class="admin-btn admin-btn-secondary upload-file-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload File
                <input type="file" id="form-file-input" accept="image/*" style="display:none;" />
              </label>
              <button type="button" class="btn-open-media-picker" onclick="openMediaPicker('form-image-url', 'form-image-preview')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Choose from Media Library
              </button>
            </div>
            <input type="text" name="image" id="form-image-url" class="admin-input" value="${escapeHtml(item.image || '')}" placeholder="Or paste external URL or file path..." />
          </div>
        </div>
      </div>
    `;

    if (collection === 'activities') {
      fieldsHtml = `
        <div class="form-group" style="display:flex; align-items:center; gap:10px; background:rgba(163,216,141,0.08); padding:12px 14px; border-radius:6px; border:1px solid rgba(163,216,141,0.3);">
          <input type="checkbox" name="featured" id="act-featured-cb" value="true" ${item.featured ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;" />
          <label for="act-featured-cb" style="margin:0; cursor:pointer; color:#a3d88d; font-weight:600; font-size:13.5px;">
            ⭐ Set as Main Hero Event on Website
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">Activity / Work Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Hero Banner Quote (Optional)</label>
          <input type="text" name="quote" class="admin-input" value="${escapeHtml(item.quote || '')}" placeholder="“Quote to display when featured in hero”" />
        </div>
        <div class="form-group">
          <label class="form-label">Hero Quote Speaker / Author (Optional)</label>
          <input type="text" name="quoteAuthor" class="admin-input" value="${escapeHtml(item.quoteAuthor || '')}" placeholder="e.g. Waseem Ul Haq" />
        </div>
        <div class="form-group">
          <label class="form-label">Category / Tag</label>
          <select name="category" class="admin-input">
            <option value="RETREAT" ${item.category === 'RETREAT' ? 'selected' : ''}>RETREAT</option>
            <option value="WORKSHOP" ${item.category === 'WORKSHOP' ? 'selected' : ''}>WORKSHOP</option>
            <option value="COMMUNITY KACHERI" ${item.category === 'COMMUNITY KACHERI' ? 'selected' : ''}>COMMUNITY KACHERI</option>
            <option value="EXPOSURE VISIT" ${item.category === 'EXPOSURE VISIT' ? 'selected' : ''}>EXPOSURE VISIT</option>
            <option value="RESEARCH" ${item.category === 'RESEARCH' ? 'selected' : ''}>RESEARCH</option>
            <option value="FIELD PROJECT" ${item.category === 'FIELD PROJECT' ? 'selected' : ''}>FIELD PROJECT</option>
            <option value="POLICY" ${item.category === 'POLICY' ? 'selected' : ''}>POLICY</option>
            <option value="CASE STUDY" ${item.category === 'CASE STUDY' ? 'selected' : ''}>CASE STUDY</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" name="date" class="admin-input" value="${item.date || ''}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" name="location" class="admin-input" value="${escapeHtml(item.location || '')}" placeholder="e.g. Lake Manchhar, Sindh" />
        </div>
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea name="description" class="admin-textarea" rows="4" required>${escapeHtml(item.description || '')}</textarea>
        </div>
      `;
    } else if (collection === 'people') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" name="name" class="admin-input" value="${escapeHtml(item.name || '')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Role / Title</label>
          <input type="text" name="role" class="admin-input" value="${escapeHtml(item.role || '')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Team Category</label>
          <select name="category" class="admin-input">
            <option value="Executive" ${item.category === 'Executive' ? 'selected' : ''}>Executive</option>
            <option value="Core Team" ${item.category === 'Core Team' ? 'selected' : ''}>Core Team</option>
            <option value="Fellows" ${item.category === 'Fellows' ? 'selected' : ''}>Fellows</option>
          </select>
        </div>
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Biography</label>
          <textarea name="bio" class="admin-textarea" rows="4" required>${escapeHtml(item.bio || '')}</textarea>
        </div>
      `;
    } else if (collection === 'articles') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Article Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitle</label>
          <input type="text" name="subtitle" class="admin-input" value="${escapeHtml(item.subtitle || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Kicker / Tag</label>
          <input type="text" name="kicker" class="admin-input" value="${escapeHtml(item.kicker || 'CASE STUDY')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Author</label>
          <input type="text" name="author" class="admin-input" value="${escapeHtml(item.author || 'CAEA Team')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" name="date" class="admin-input" value="${item.date || ''}" required />
        </div>
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Excerpt</label>
          <textarea name="excerpt" class="admin-textarea" rows="2" required>${escapeHtml(item.excerpt || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Full Article Content</label>
          <textarea name="content" class="admin-textarea" rows="5">${escapeHtml(item.content || '')}</textarea>
        </div>
      `;
    } else if (collection === 'opportunities') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Opportunity / Position Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" placeholder="e.g. Climate Justice Junior Associate" required />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitle / Banner Tag</label>
          <input type="text" name="subtitle" class="admin-input" value="${escapeHtml(item.subtitle || 'UPCOMING')}" placeholder="e.g. FULL TIME · APPLICATIONS OPEN or UPCOMING" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category Name</label>
          <input type="text" name="category" class="admin-input" value="${escapeHtml(item.category || '')}" placeholder="e.g. Core Team & Field Research, Volunteering, Fellowship" required />
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
        ${imageFieldHtml}
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea name="description" class="admin-textarea" rows="4" required>${escapeHtml(item.description || '')}</textarea>
        </div>
      `;
    }

    dynamicFieldsContainer.innerHTML = fieldsHtml;

    // Attach File Upload Event Listener
    const fileInput = document.getElementById('form-file-input');
    const imageUrlInput = document.getElementById('form-image-url');
    const imagePreview = document.getElementById('form-image-preview');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const dataUrl = evt.target.result;
            imageUrlInput.value = dataUrl;
            if (imagePreview) {
              imagePreview.src = dataUrl;
            }
            showToast(`File "${file.name}" uploaded to preview!`);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (imageUrlInput) {
      imageUrlInput.addEventListener('input', () => {
        if (imagePreview) {
          const val = imageUrlInput.value.trim();
          imagePreview.src = val.startsWith('data:') || val.startsWith('http') ? val : '../' + val;
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

      if (collection === 'activities') {
        dataObj.featured = formData.get('featured') === 'true';
        if (dataObj.featured) {
          // Unset all other activities' featured status
          const allActs = window.DataStore.get('activities');
          allActs.forEach(a => {
            if (a.id !== recordId) a.featured = false;
          });
          localStorage.setItem('caea_activities_data', JSON.stringify(allActs));
        }
      }

      if (recordId) {
        window.DataStore.update(collection, recordId, dataObj);
        showToast(`Updated ${collection.slice(0, -1)} successfully`);
      } else {
        window.DataStore.add(collection, dataObj);
        showToast(`Added new ${collection.slice(0, -1)} successfully`);
      }

      updateStats();
      renderAllTables();
      populateApplicationCategoryFilter();
      closeModal();
    });
  }

  /* ============================================================
     6. Application Review & Details Modal
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
        showToast(`Updated application for status: ${status}`);
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
     7. CSV Export for Applications
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
  if (btnAddPerson) btnAddPerson.addEventListener('click', () => openEditModal('people'));
  if (btnAddArticle) btnAddArticle.addEventListener('click', () => openEditModal('articles'));
  if (btnAddOpportunity) btnAddOpportunity.addEventListener('click', () => openEditModal('opportunities'));

  // Delete Action
  window.confirmDelete = function(collection, id) {
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
     8. Export & Import Utilities
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
  });

  /* ============================================================
     9. Toast Notification Helper
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
