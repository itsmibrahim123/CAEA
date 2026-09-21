document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     Map Markers Dropdown Popups
     ============================================================ */
  const markers = document.querySelectorAll('.city-marker');

  function closeAllPopups() {
    markers.forEach(marker => {
      marker.classList.remove('is-open');
      marker.setAttribute('aria-expanded', 'false');
      const popup = marker.querySelector('.city-popup');
      if (popup) {
        popup.setAttribute('aria-hidden', 'true');
      }
    });
  }

  markers.forEach(marker => {
    marker.addEventListener('click', (e) => {
      const isPopup = e.target.closest('.city-popup');
      const isOpen = marker.classList.contains('is-open');

      // If clicking on the badge inside the popup, close it
      if (isPopup && e.target.closest('.popup-badge')) {
        closeAllPopups();
        e.stopPropagation();
        return;
      }

      // If clicking inside popup content, do not propagate
      if (isPopup) {
        e.stopPropagation();
        return;
      }

      e.stopPropagation();

      if (isOpen) {
        marker.classList.remove('is-open');
        marker.setAttribute('aria-expanded', 'false');
        const popup = marker.querySelector('.city-popup');
        if (popup) popup.setAttribute('aria-hidden', 'true');
      } else {
        closeAllPopups();
        marker.classList.add('is-open');
        marker.setAttribute('aria-expanded', 'true');
        const popup = marker.querySelector('.city-popup');
        if (popup) popup.setAttribute('aria-hidden', 'false');
      }
    });

    marker.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        marker.click();
      }
    });
  });

  // Close map popup when clicking anywhere outside of a marker
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.city-marker')) {
      closeAllPopups();
    }
  });

  // Close map popup on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });

  /* ============================================================
     Core Team Accordion Interaction
     ============================================================ */
  const accordionItems = document.querySelectorAll('[data-accordion-item]');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Optional: Close other accordion items for clean accordion behavior
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });

  /* ============================================================
     Activities Page Hero Event Switcher & Gallery Interactivity
     ============================================================ */
  let currentHeroEventIndex = 0;

  function resolveImagePath(img) {
    if (!img) return '/Assets/Hero-image.png';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) return img;
    if (img.startsWith('../Assets/')) return img.replace('../Assets/', '/Assets/');
    if (img.startsWith('Assets/')) return '/' + img;
    return '/' + img;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getHeroActivities() {
    if (window.DataStore) {
      const stored = window.DataStore.get('activities');
      if (stored && stored.length > 0) return stored;
    }
    return [
      {
        id: 'act-1',
        title: 'Contested Waters: Rivers, Power and Resistance',
        category: 'WORKSHOP',
        date: '2026-01-23',
        dateFormatted: '23.01.2026',
        description: 'Examines how colonial and modern systems of water control through dams, barrages, and canals have transformed river ecosystems, displaced communities, and disrupted cultural relationships with water.',
        image: '/Assets/media/events/contested-waters/RAY00190.JPG',
        quote: '“Those least responsible for climate change are worst affected by it”',
        quoteAuthor: 'Waseem Ul Haq'
      },
      {
        id: 'act-2',
        title: 'Climate Justice Gathering & Retreat',
        category: 'RETREAT',
        date: '2026-04-23',
        dateFormatted: '23.04.2026',
        description: 'A 3-day retreat for climate activists and community organizers across Pakistan to reflect, reconnect with nature, and discuss energy, climate stories, burnout, and movement building.',
        image: '/Assets/media/events/retreat/DSCF4154.JPG',
        quote: '“Reconnecting with land and community to build resilience against climate burnout”',
        quoteAuthor: 'CAEA Movement Gathering'
      },
      {
        id: 'act-3',
        title: 'Kacheri: Manchar Sunvai',
        category: 'COMMUNITY KACHERI',
        date: '2026-05-20',
        dateFormatted: '20.05.2026',
        description: 'Discussion on the ecological destruction of Lake Manchhar, changes in water flow, infrastructure development, agricultural wastewater, and community-led resistance.',
        image: '/Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
        quote: '“Manchhar is a mindful lake, yet it bears the heaviest burden of industrial discharge”',
        quoteAuthor: 'Lake Manchhar Fisherman Community'
      },
      {
        id: 'act-4',
        title: 'Exposure Visit to Tarbela Dam',
        category: 'EXPOSURE VISIT',
        date: '2026-07-28',
        dateFormatted: '28.07.2026',
        description: 'Brought together perspectives from WAPDA and displaced communities to examine Tarbela\'s promises of power vs. its costs on land, livelihoods, culture, and ecosystems.',
        image: '/Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
        quote: '“Uncovering the true human and ecological costs behind megastructures of power”',
        quoteAuthor: 'Tarbela Exposure Delegation'
      }
    ];
  }

  function setHeroEvent(indexOrId) {
    const activities = getHeroActivities();
    if (!activities.length) return;

    let targetIndex = 0;
    if (typeof indexOrId === 'number') {
      targetIndex = ((indexOrId % activities.length) + activities.length) % activities.length;
    } else if (typeof indexOrId === 'string') {
      const foundIdx = activities.findIndex(a => a.id === indexOrId);
      targetIndex = foundIdx !== -1 ? foundIdx : 0;
    }

    currentHeroEventIndex = targetIndex;
    const currentEvent = activities[targetIndex];
    if (!currentEvent) return;

    // Elements
    const quoteEl = document.getElementById('hero-event-quote');
    const authorEl = document.getElementById('hero-event-author');
    const titleEl = document.getElementById('hero-event-title');
    const descEl = document.getElementById('hero-event-description');
    const tagEl = document.getElementById('hero-event-tag');
    const dateEl = document.getElementById('hero-event-date');
    const counterEl = document.getElementById('hero-event-counter');
    const mainImgEl = document.getElementById('hero-gallery-img');
    const thumbs = document.querySelectorAll('.activities-gallery-thumbs .thumb-item');

    // Update text with soft transition
    if (quoteEl) quoteEl.textContent = currentEvent.quote || `“${currentEvent.title}”`;
    if (authorEl) authorEl.textContent = currentEvent.quoteAuthor || currentEvent.location || 'Climate Action Energy Access';
    if (titleEl) titleEl.textContent = currentEvent.title || 'Working Towards Clean Energy';
    if (descEl) descEl.textContent = currentEvent.description || '';
    if (tagEl) tagEl.textContent = currentEvent.category || 'RETREAT';
    if (dateEl) dateEl.textContent = currentEvent.dateFormatted || currentEvent.date || '';
    if (counterEl) counterEl.textContent = `Event ${targetIndex + 1} of ${activities.length}`;

    if (mainImgEl && currentEvent.image) {
      mainImgEl.src = resolveImagePath(currentEvent.image);
      mainImgEl.alt = currentEvent.title;
    }

    // Sync Thumbnails
    if (thumbs.length) {
      thumbs.forEach((thumb, idx) => {
        if (idx === targetIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
    }

    // Highlight active card in feed list
    const allCards = document.querySelectorAll('.activities-list .activity-card');
    allCards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      if (cardId === currentEvent.id) {
        card.classList.add('is-hero-active');
      } else {
        card.classList.remove('is-hero-active');
      }
    });
  }

  function initHeroEventSwitcher() {
    const activities = getHeroActivities();
    const prevBtn = document.getElementById('prev-hero-slide');
    const nextBtn = document.getElementById('next-hero-slide');
    const switchHeroBtn = document.getElementById('btn-next-hero-event');
    const thumbs = document.querySelectorAll('.activities-gallery-thumbs .thumb-item');

    if (switchHeroBtn) {
      switchHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex + 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex - 1);
      });
    }

    if (thumbs.length) {
      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          const customId = thumb.getAttribute('data-id');
          if (customId) {
            setHeroEvent(customId);
          } else {
            setHeroEvent(idx);
          }
        });
      });
    }

    // Determine initial featured event
    let initialIdx = activities.findIndex(a => a.featured === true);
    if (initialIdx === -1) initialIdx = 0;
    setHeroEvent(initialIdx);
  }

  // Video Modal Trigger
  const videoBtn = document.getElementById('activities-video-btn');
  if (videoBtn) {
    videoBtn.addEventListener('click', () => {
      alert('Playing: More than a retreat (CAEA Community Documentary)');
    });
  }

  /* ============================================================
     Dynamic Activities Feed Rendering (DataStore)
     ============================================================ */
  function renderDynamicActivities() {
    const activitiesContainer = document.querySelector('.activities-list');
    if (!activitiesContainer || !window.DataStore) return;

    const activities = window.DataStore.get('activities');
    if (!activities || !activities.length) return;

    activitiesContainer.innerHTML = activities.map((item, idx) => `
      <article class="activity-card ${idx === currentHeroEventIndex ? 'is-hero-active' : ''}" data-id="${item.id}">
        <div class="activity-media-box">
          <img src="${resolveImagePath(item.image)}" alt="" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
          <div class="activities-placeholder-visual">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        </div>
        <div class="activity-content">
          <div>
            <h3 class="activity-item-title">${escapeHtml(item.title)}</h3>
            <p class="activity-item-desc">${escapeHtml(item.description)}</p>
          </div>
          <div class="activity-card-footer">
            <span class="activity-date">${item.dateFormatted || item.date || ''}</span>
            <span class="activity-tag">${escapeHtml(item.category || 'RETREAT')}</span>
            <button class="btn-feature-hero" data-id="${item.id}" type="button" title="Feature this event in the hero section">
              <span>Show in Hero</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17l9.2-9.2M17 17V8H8"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach click handlers to "Show in Hero" buttons
    const featureBtns = activitiesContainer.querySelectorAll('.btn-feature-hero');
    featureBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actId = btn.getAttribute('data-id');
        setHeroEvent(actId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     Dynamic Get Involved (Opportunities / Categories) Rendering
     ============================================================ */
  function renderDynamicOpportunities() {
    const causeGrid = document.querySelector('.cause-grid');
    if (!causeGrid || !window.DataStore) return;

    const opportunities = window.DataStore.get('opportunities');
    if (!opportunities || !opportunities.length) return;

    causeGrid.innerHTML = opportunities.map((item, index) => {
      const cardNum = index + 1;
      const themeClass = item.theme === 'black' ? 'cause-card-black' : 'cause-card-blue';
      const areaClass = item.gridArea ? `cause-card-${item.gridArea.replace('card', '')}` : `cause-card-${cardNum}`;
      const hasImage = !!item.image;

      if (hasImage) {
        return `
          <div class="cause-card ${themeClass} ${areaClass}" data-opportunity-id="${item.id}">
            <div class="cause-card-4-inner">
              <div class="cause-card-graphic-box">
                <img src="${resolveImagePath(item.image)}" alt="${escapeHtml(item.title)}" class="cause-card-graphic" onerror="this.src='/Assets/how-water-became-power.jpg'" />
              </div>
              <div class="cause-card-4-content">
                <h2 class="cause-card-title">${escapeHtml(item.title).replace(/:\s*/g, ':<br />')}</h2>
                <span class="cause-card-subtitle">${escapeHtml(item.subtitle || 'UPCOMING')}</span>
                <p class="cause-card-desc">${escapeHtml(item.description || '')}</p>
                <a href="#apply" class="cause-card-btn" data-apply-btn data-opportunity-id="${item.id}" data-opportunity-title="${escapeHtml(item.title)}" data-category="${escapeHtml(item.category || '')}">
                  APPLY NOW <span class="btn-arrow">&gt;</span>
                </a>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div class="cause-card ${themeClass} ${areaClass}" data-opportunity-id="${item.id}">
          <div class="cause-card-top">
            <h2 class="cause-card-title">${escapeHtml(item.title).replace(/:\s*/g, ':<br />')}</h2>
            <span class="cause-card-subtitle">${escapeHtml(item.subtitle || 'UPCOMING')}</span>
            <p class="cause-card-desc">${escapeHtml(item.description || '')}</p>
          </div>
          <a href="#apply" class="cause-card-btn" data-apply-btn data-opportunity-id="${item.id}" data-opportunity-title="${escapeHtml(item.title)}" data-category="${escapeHtml(item.category || '')}">
            APPLY NOW <span class="btn-arrow">&gt;</span>
          </a>
        </div>
      `;
    }).join('');
  }

  /* ============================================================
     Universal Apply Now Popup Modal System
     ============================================================ */
  function ensureApplyModalExists() {
    let modalOverlay = document.getElementById('caea-apply-modal-overlay');
    if (modalOverlay) return modalOverlay;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'caea-apply-modal-overlay';
    modalOverlay.className = 'caea-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-hidden', 'true');

    modalOverlay.innerHTML = `
      <div class="caea-modal-card" id="caea-apply-modal-card">
        <div class="caea-modal-header">
          <span class="caea-modal-kicker">GET INVOLVED WITH CAEA</span>
          <h2 class="caea-modal-title">Join the Movement</h2>
          <p class="caea-modal-subtitle">Fill in your details below to apply for an active role, gathering, or volunteer opportunity.</p>
          <button type="button" class="caea-modal-close-btn" id="caea-modal-close-btn" aria-label="Close form">&times;</button>
        </div>

        <form id="caea-apply-form" class="caea-modal-body" novalidate>
          <div class="caea-form-group">
            <label class="caea-form-label" for="apply-opportunity">
              Activity / Opportunity Category <span class="required-star">*</span>
            </label>
            <select id="apply-opportunity" name="opportunity" class="caea-form-select" required>
              <!-- Dynamically Populated -->
            </select>
          </div>

          <div class="caea-form-row">
            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-name">
                Full Name <span class="required-star">*</span>
              </label>
              <input type="text" id="apply-name" name="fullName" class="caea-form-input" placeholder="e.g. Sanaa Muhammad" required />
            </div>

            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-email">
                Email Address <span class="required-star">*</span>
              </label>
              <input type="email" id="apply-email" name="email" class="caea-form-input" placeholder="e.g. sanaa@example.com" required />
            </div>
          </div>

          <div class="caea-form-row">
            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-phone">
                Phone / WhatsApp <span class="required-star">*</span>
              </label>
              <input type="tel" id="apply-phone" name="phone" class="caea-form-input" placeholder="e.g. +92 300 1234567" required />
            </div>

            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-city">
                City / Region <span class="required-star">*</span>
              </label>
              <input type="text" id="apply-city" name="city" class="caea-form-input" placeholder="e.g. Karachi, Sindh" required />
            </div>
          </div>

          <div class="caea-form-group">
            <label class="caea-form-label" for="apply-commitment">
              Availability / Time Commitment <span class="required-star">*</span>
            </label>
            <select id="apply-commitment" name="commitment" class="caea-form-select" required>
              <option value="Full-Time">Full-Time (40+ hrs/week)</option>
              <option value="Part-Time">Part-Time (15-20 hrs/week)</option>
              <option value="Internship">Internship (3-6 Months)</option>
              <option value="Volunteering / Flexible">Volunteering / Event-based / Flexible</option>
            </select>
          </div>

          <div class="caea-form-group">
            <label class="caea-form-label" for="apply-message">
              Statement of Interest / Motivation <span class="required-star">*</span>
            </label>
            <textarea id="apply-message" name="message" class="caea-form-textarea" rows="3" placeholder="Why do you want to get involved with CAEA? What issues matter to you most?" required></textarea>
          </div>

          <div class="caea-form-group">
            <label class="caea-form-label" for="apply-experience">
              Relevant Background, Skills or Portfolio Link
            </label>
            <textarea id="apply-experience" name="experience" class="caea-form-textarea" rows="2" placeholder="Briefly describe your education, previous projects, or paste your LinkedIn / portfolio link..."></textarea>
          </div>

          <div class="caea-modal-footer">
            <button type="button" class="caea-btn-cancel" id="caea-modal-cancel-btn">Cancel</button>
            <button type="submit" class="caea-btn-submit" id="caea-modal-submit-btn">
              Submit Application
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </form>

        <div id="caea-apply-success" class="caea-modal-success" style="display:none;">
          <div class="caea-success-icon-wrap">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 class="caea-success-title">Application Submitted!</h3>
          <p class="caea-success-desc" id="caea-success-msg">
            Thank you for applying. We have received your submission and our team will review your application shortly.
          </p>
          <button type="button" class="caea-btn-submit" id="caea-success-done-btn">Done</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);
    setupModalEvents(modalOverlay);
    return modalOverlay;
  }

  function populateOpportunityDropdown(targetSelectedTitle = null) {
    const select = document.getElementById('apply-opportunity');
    if (!select || !window.DataStore) return;

    const opportunities = window.DataStore.get('opportunities') || [];
    const activities = window.DataStore.get('activities') || [];

    let optionsHtml = '';

    if (opportunities.length > 0) {
      optionsHtml += `<optgroup label="Get Involved Opportunities">`;
      opportunities.forEach(opp => {
        const isSelected = targetSelectedTitle && (opp.title.toLowerCase().trim() === targetSelectedTitle.toLowerCase().trim() || targetSelectedTitle.toLowerCase().includes(opp.title.toLowerCase()));
        optionsHtml += `<option value="${escapeHtml(opp.title)}" data-id="${opp.id}" data-category="${escapeHtml(opp.category || '')}" ${isSelected ? 'selected' : ''}>${escapeHtml(opp.title)} (${escapeHtml(opp.category || opp.type || 'Open')})</option>`;
      });
      optionsHtml += `</optgroup>`;
    }

    if (activities.length > 0) {
      optionsHtml += `<optgroup label="Activities & Gatherings">`;
      activities.forEach(act => {
        const isSelected = targetSelectedTitle && (act.title.toLowerCase().trim() === targetSelectedTitle.toLowerCase().trim());
        optionsHtml += `<option value="${escapeHtml(act.title)}" data-id="${act.id}" data-category="${escapeHtml(act.category || '')}" ${isSelected ? 'selected' : ''}>${escapeHtml(act.title)} [${escapeHtml(act.category || 'Activity')}]</option>`;
      });
      optionsHtml += `</optgroup>`;
    }

    optionsHtml += `<optgroup label="Other">
      <option value="General Volunteer / Open Application" data-id="general" data-category="General">General Volunteer / Open Application</option>
    </optgroup>`;

    select.innerHTML = optionsHtml;
  }

  function openApplyModal(preselectedTitle = null) {
    const overlay = ensureApplyModalExists();
    populateOpportunityDropdown(preselectedTitle);

    // Reset view
    const form = document.getElementById('caea-apply-form');
    const successScreen = document.getElementById('caea-apply-success');
    if (form) {
      form.style.display = 'flex';
      form.reset();
    }
    if (successScreen) {
      successScreen.style.display = 'none';
    }

    if (preselectedTitle) {
      populateOpportunityDropdown(preselectedTitle);
    }

    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstInput = document.getElementById('apply-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeApplyModal() {
    const overlay = document.getElementById('caea-apply-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setupModalEvents(overlay) {
    const closeBtn = document.getElementById('caea-modal-close-btn');
    const cancelBtn = document.getElementById('caea-modal-cancel-btn');
    const doneBtn = document.getElementById('caea-success-done-btn');
    const form = document.getElementById('caea-apply-form');
    const successScreen = document.getElementById('caea-apply-success');
    const successMsg = document.getElementById('caea-success-msg');

    if (closeBtn) closeBtn.addEventListener('click', closeApplyModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeApplyModal);
    if (doneBtn) doneBtn.addEventListener('click', closeApplyModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeApplyModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
        closeApplyModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const select = document.getElementById('apply-opportunity');
        const selectedOption = select.options[select.selectedIndex];
        const opportunityTitle = select.value;
        const opportunityId = selectedOption ? selectedOption.getAttribute('data-id') : 'opp-custom';
        const category = selectedOption ? selectedOption.getAttribute('data-category') : 'General';

        const fullName = (document.getElementById('apply-name').value || '').trim();
        const email = (document.getElementById('apply-email').value || '').trim();
        const phone = (document.getElementById('apply-phone').value || '').trim();
        const city = (document.getElementById('apply-city').value || '').trim();
        const commitment = document.getElementById('apply-commitment').value;
        const message = (document.getElementById('apply-message').value || '').trim();
        const experience = (document.getElementById('apply-experience').value || '').trim();

        if (!fullName || !email || !phone || !city || !message) {
          alert('Please fill out all required fields marked with *.');
          return;
        }

        const newApplication = {
          fullName,
          email,
          phone,
          city,
          opportunityId,
          opportunityTitle,
          category: category || 'General',
          commitment,
          message,
          experience,
          status: 'Pending',
          notes: ''
        };

        if (window.DataStore) {
          window.DataStore.add('applications', newApplication);
        }

        // Show success screen
        form.style.display = 'none';
        if (successMsg) {
          successMsg.textContent = `Thank you, ${fullName}! We have received your application for "${opportunityTitle}". Our team will review your submission and contact you via ${email} shortly.`;
        }
        if (successScreen) {
          successScreen.style.display = 'flex';
        }
      });
    }
  }

  // Global delegation for any Apply button click across any page
  document.addEventListener('click', (e) => {
    const applyBtn = e.target.closest('.cause-card-btn, .join-team-btn, [data-apply-btn]');
    if (applyBtn) {
      e.preventDefault();
      let oppTitle = applyBtn.getAttribute('data-opportunity-title');
      if (!oppTitle) {
        // Try to find opportunity title in parent card
        const parentCard = applyBtn.closest('.cause-card, .join-team-container, article');
        if (parentCard) {
          const titleEl = parentCard.querySelector('.cause-card-title, .join-team-heading, .activity-item-title');
          if (titleEl) oppTitle = titleEl.textContent.trim().replace(/\s+/g, ' ');
        }
      }
      openApplyModal(oppTitle);
    }
  });

  // Initial dynamic renders & event switcher
  initHeroEventSwitcher();
  renderDynamicActivities();
  renderDynamicOpportunities();

  // Listen to DataStore updates to keep everything in sync
  window.addEventListener('caea-datastore-update', () => {
    initHeroEventSwitcher();
    renderDynamicActivities();
    renderDynamicOpportunities();
  });
});


