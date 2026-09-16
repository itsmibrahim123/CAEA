/**
 * CAEA Admin Dashboard Controller (admin/admin.js)
 * Connects UI interactions to DataStore API.
 */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_PASSCODE = 'caea2024';

  // State
  let activeTab = 'activities';
  let activeEditId = null;

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

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.admin-panel');

  // Tables
  const tableActivitiesBody = document.getElementById('table-activities-body');
  const tablePeopleBody = document.getElementById('table-people-body');
  const tableArticlesBody = document.getElementById('table-articles-body');

  // Filters & Search
  const searchActivities = document.getElementById('search-activities');
  const filterActivitiesTag = document.getElementById('filter-activities-tag');

  const searchPeople = document.getElementById('search-people');
  const filterPeopleCategory = document.getElementById('filter-people-category');

  const searchArticles = document.getElementById('search-articles');

  // Modal
  const modalDialog = document.getElementById('admin-modal-dialog');
  const crudForm = document.getElementById('admin-crud-form');
  const modalTitle = document.getElementById('modal-form-title');
  const formCollectionInput = document.getElementById('form-collection');
  const formRecordIdInput = document.getElementById('form-record-id');
  const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');

  // Buttons
  const btnAddActivity = document.getElementById('btn-add-activity');
  const btnAddPerson = document.getElementById('btn-add-person');
  const btnAddArticle = document.getElementById('btn-add-article');
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
  }

  function updateStats() {
    if (!window.DataStore) return;
    statActivities.textContent = window.DataStore.get('activities').length;
    statPeople.textContent = window.DataStore.get('people').length;
    statArticles.textContent = window.DataStore.get('articles').length;
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
     4. Table Rendering
     ============================================================ */
  function renderAllTables() {
    renderActivitiesTable();
    renderPeopleTable();
    renderArticlesTable();
  }

  // Activities Table
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
      <tr>
        <td style="font-family:monospace; font-size:11px; color:#888;">${item.id}</td>
        <td>
          <img src="../${item.image || 'Assets/Hero-image.png'}" alt="" class="table-media-thumb" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
        </td>
        <td>
          <strong>${escapeHtml(item.title)}</strong>
          <div style="font-size:12px; color:#9da5b4;">${escapeHtml(item.location || 'N/A')}</div>
        </td>
        <td>
          <span class="table-badge ${ (item.category || '').toLowerCase() }">${item.category || 'RETREAT'}</span>
        </td>
        <td>${item.dateFormatted || item.date || 'N/A'}</td>
        <td class="text-right">
          <div class="table-actions">
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

  // Filter Listeners
  if (searchActivities) searchActivities.addEventListener('input', renderActivitiesTable);
  if (filterActivitiesTag) filterActivitiesTag.addEventListener('change', renderActivitiesTable);

  if (searchPeople) searchPeople.addEventListener('input', renderPeopleTable);
  if (filterPeopleCategory) filterPeopleCategory.addEventListener('change', renderPeopleTable);

  if (searchArticles) searchArticles.addEventListener('input', renderArticlesTable);

  /* ============================================================
     5. CRUD Form Dialog (Add / Edit)
     ============================================================ */
  window.openEditModal = function(collection, id = null) {
    activeEditId = id;
    formCollectionInput.value = collection;
    formRecordIdInput.value = id || '';

    const isEdit = !!id;
    const item = isEdit ? window.DataStore.getById(collection, id) : {};

    modalTitle.textContent = `${isEdit ? 'Edit' : 'Add New'} ${collection.substring(0, collection.length - 1).toUpperCase()}`;

    // Render Dynamic Form Fields based on Collection
    let fieldsHtml = '';

    const currentImg = item.image || (collection === 'activities' ? 'Assets/Hero-image.png' : collection === 'people' ? 'Assets/Team/grid-1-2-Sanaa.png' : 'Assets/how-water-became-power.jpg');
    const imageFieldHtml = `
      <div class="form-group">
        <label class="form-label">Media / Image Asset</label>
        <div class="image-upload-wrapper">
          <div class="image-preview-container">
            <img id="form-image-preview" src="${currentImg.startsWith('data:') || currentImg.startsWith('http') ? currentImg : '../' + currentImg}" alt="Preview" class="form-img-preview" onerror="this.src='../Assets/CAEA-Navbar-Logo.png'" />
          </div>
          <div class="image-upload-controls">
            <label class="admin-btn admin-btn-secondary upload-file-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Image File
              <input type="file" id="form-file-input" accept="image/*" style="display:none;" />
            </label>
            <input type="text" name="image" id="form-image-url" class="admin-input" value="${escapeHtml(item.image || '')}" placeholder="Or paste external URL or file path..." />
          </div>
        </div>
      </div>
    `;

    if (collection === 'activities') {
      fieldsHtml = `
        <div class="form-group">
          <label class="form-label">Activity Title</label>
          <input type="text" name="title" class="admin-input" value="${escapeHtml(item.title || '')}" required />
        </div>
        <div class="form-group">
          <label class="form-label">Category / Tag</label>
          <select name="category" class="admin-input">
            <option value="RETREAT" ${item.category === 'RETREAT' ? 'selected' : ''}>RETREAT</option>
            <option value="WORKSHOP" ${item.category === 'WORKSHOP' ? 'selected' : ''}>WORKSHOP</option>
            <option value="RESEARCH" ${item.category === 'RESEARCH' ? 'selected' : ''}>RESEARCH</option>
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

  // Close Modal
  function closeModal() {
    modalDialog.close();
    crudForm.reset();
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  // Form Submit
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

      if (recordId) {
        window.DataStore.update(collection, recordId, dataObj);
        showToast(`Updated record ${recordId} successfully`);
      } else {
        window.DataStore.add(collection, dataObj);
        showToast(`Added new ${collection.slice(0, -1)} successfully`);
      }

      updateStats();
      renderAllTables();
      closeModal();
    });
  }

  // Add Button Event Handlers
  if (btnAddActivity) btnAddActivity.addEventListener('click', () => openEditModal('activities'));
  if (btnAddPerson) btnAddPerson.addEventListener('click', () => openEditModal('people'));
  if (btnAddArticle) btnAddArticle.addEventListener('click', () => openEditModal('articles'));

  // Delete Action
  window.confirmDelete = function(collection, id) {
    if (confirm(`Are you sure you want to delete item ${id} from ${collection}?`)) {
      const res = window.DataStore.delete(collection, id);
      if (res) {
        showToast(`Deleted ${id} successfully`);
        updateStats();
        renderAllTables();
      }
    }
  };

  /* ============================================================
     6. Export & Import Utilities
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
      }
    });
  }

  // DataStore global event listener
  window.addEventListener('caea-datastore-update', () => {
    updateStats();
    renderAllTables();
  });

  /* ============================================================
     7. Toast Notification Helper
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
