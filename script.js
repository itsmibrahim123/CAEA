document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     Map Markers & Interactive Locations on Pakistan Map
     ============================================================ */
  function bindMapMarkerListeners() {
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

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.city-marker')) {
        closeAllPopups();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    });
  }

  function renderPakistanMapPins() {
    const container = document.getElementById('map-pins-container');
    if (!container) return;

    const pins = window.DataStore ? window.DataStore.get('mapPins') : [];
    if (!pins || pins.length === 0) {
      bindMapMarkerListeners();
      return;
    }

    // Retain or recreate the map background image
    const bgImg = container.querySelector('.map-bg');
    container.innerHTML = '';
    if (bgImg) {
      container.appendChild(bgImg);
    } else {
      const newBg = document.createElement('img');
      newBg.src = '/Assets/Pak-map.png';
      newBg.alt = 'Map of Pakistan highlighting CAEA project locations';
      newBg.className = 'map-bg';
      newBg.setAttribute('aria-hidden', 'true');
      container.appendChild(newBg);
    }

    pins.forEach(pin => {
      const markerEl = document.createElement('div');
      markerEl.className = 'city-marker';
      markerEl.id = `marker-${pin.id || pin.city.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      markerEl.style.left = pin.left || '50%';
      markerEl.style.top = pin.top || '50%';
      markerEl.setAttribute('role', 'button');
      markerEl.setAttribute('tabindex', '0');
      markerEl.setAttribute('aria-expanded', 'false');
      markerEl.setAttribute('aria-label', `${escapeHtml(pin.city)} project location`);
      markerEl.setAttribute('data-pin-id', pin.id || pin.city.toLowerCase().replace(/[^a-z0-9]/g, ''));

      markerEl.innerHTML = `
        <div class="city-ripples" aria-hidden="true">
          <span class="ripple r1"></span>
          <span class="ripple r2"></span>
          <span class="ripple r3"></span>
        </div>
        <img src="/Assets/Map-leaf.png" alt="" class="city-leaf" aria-hidden="true" />
        <div class="city-label">${escapeHtml(pin.city)}</div>
        <div class="city-popup" aria-hidden="true">
          <span class="popup-badge">${escapeHtml(pin.badge || pin.city)}</span>
          <p class="popup-text">${escapeHtml(pin.description || '')}</p>
        </div>
      `;

      container.appendChild(markerEl);
    });

    bindMapMarkerListeners();
  }

  /* ============================================================
     Core Team Accordion Interaction & Dynamic Rendering
     ============================================================ */
  function bindAccordionListeners() {
    const accordionItems = document.querySelectorAll('[data-accordion-item]');

    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');

      if (!header || !content) return;
      if (header._hasAccordionListener) return;
      header._hasAccordionListener = true;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close other accordion items for clean accordion behavior
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
  }

  function renderDynamicTeamAccordions() {
    const container = document.getElementById('team-accordion');
    if (!container || !window.DataStore) return;

    const people = window.DataStore.get('people');
    if (!people || !people.length) return;

    container.innerHTML = people.map(person => {
      const bioParagraphs = (person.bio || '')
        .split(/\n\s*\n|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');

      const imgSrc = resolveImagePath(person.image || 'Assets/Team/sanaa-muhammad.jpg');

      return `
        <div class="accordion-item" data-accordion-item data-person-id="${escapeHtml(person.id || '')}">
          <button class="accordion-header" type="button" aria-expanded="false">
            <span class="accordion-name">${escapeHtml(person.name || '')}</span>
            <span class="accordion-role-group">
              <span class="accordion-role">${escapeHtml((person.role || '').toUpperCase())}</span>
              <svg class="accordion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          <div class="accordion-content" aria-hidden="true">
            <div class="accordion-inner">
              <div class="accordion-photo-box">
                <img src="${imgSrc}" alt="${escapeHtml(person.name || '')}" class="accordion-photo" loading="lazy" onerror="this.src='/Assets/Team/sanaa-muhammad.jpg'" />
              </div>
              <div class="accordion-bio">
                ${bioParagraphs || `<p>${escapeHtml(person.bio || '')}</p>`}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    bindAccordionListeners();
  }

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

  function renderHeroThumbnails() {
    const thumbsContainers = document.querySelectorAll('.activities-gallery-thumbs');
    if (!thumbsContainers.length) return;
    const activities = getHeroActivities();
    if (!activities.length) return;

    thumbsContainers.forEach(container => {
      container.innerHTML = activities.map((item, idx) => `
        <div class="thumb-item ${idx === currentHeroEventIndex ? 'active' : ''}" data-index="${idx}" data-id="${item.id}" title="${escapeHtml(item.title)}">
          <img src="${resolveImagePath(item.image)}" alt="${escapeHtml(item.title)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='/Assets/Hero-image.png'" />
        </div>
      `).join('');

      const thumbs = container.querySelectorAll('.thumb-item');
      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          setHeroEvent(idx);
          startHeroAutoCycling();
        });
      });
    });
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

    // Elements - supports both universal and work page IDs
    const quoteEl = document.getElementById('hero-event-quote') || document.getElementById('work-act-quote');
    const authorEl = document.getElementById('hero-event-author') || document.getElementById('work-act-author');
    const headingEl = document.getElementById('hero-event-heading') || document.getElementById('hero-event-title') || document.getElementById('work-act-title');
    const descEl = document.getElementById('hero-event-description') || document.getElementById('work-act-desc');
    const tagEl = document.getElementById('hero-event-tag');
    const dateEl = document.getElementById('hero-event-date');
    const counterEl = document.getElementById('hero-event-counter') || document.getElementById('work-act-counter');
    const mainImgEl = document.getElementById('hero-gallery-img') || document.getElementById('work-gallery-img');
    const thumbs = document.querySelectorAll('.activities-gallery-thumbs .thumb-item');

    // Update text with soft transition
    if (quoteEl) quoteEl.textContent = currentEvent.quote || `“${currentEvent.title}”`;
    if (authorEl) authorEl.textContent = currentEvent.quoteAuthor || currentEvent.location || 'Climate Action Energy Access';
    if (headingEl) headingEl.textContent = currentEvent.title ? currentEvent.title.toUpperCase() : 'WORKING TOWARDS CLEAN ENERGY';
    if (descEl) descEl.textContent = currentEvent.description || '';
    if (tagEl) tagEl.textContent = currentEvent.category || 'RETREAT';
    if (dateEl) dateEl.textContent = currentEvent.dateFormatted || currentEvent.date || '';
    if (counterEl) counterEl.textContent = `Event ${targetIndex + 1} of ${activities.length}`;

    if (mainImgEl && currentEvent.image) {
      mainImgEl.style.opacity = '0.5';
      setTimeout(() => {
        mainImgEl.src = resolveImagePath(currentEvent.image);
        mainImgEl.alt = currentEvent.title;
        mainImgEl.style.opacity = '1';
      }, 100);
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
    const prevBtn = document.getElementById('prev-hero-slide') || document.getElementById('btn-work-prev-slide');
    const nextBtn = document.getElementById('next-hero-slide') || document.getElementById('btn-work-next-slide');
    const switchHeroBtn = document.getElementById('btn-next-hero-event') || document.getElementById('btn-work-next-event');

    if (switchHeroBtn && !switchHeroBtn.dataset.bound) {
      switchHeroBtn.dataset.bound = 'true';
      switchHeroBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex + 1);
        startHeroAutoCycling();
      });
    }

    if (nextBtn && !nextBtn.dataset.bound) {
      nextBtn.dataset.bound = 'true';
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex + 1);
        startHeroAutoCycling();
      });
    }

    if (prevBtn && !prevBtn.dataset.bound) {
      prevBtn.dataset.bound = 'true';
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroEvent(currentHeroEventIndex - 1);
        startHeroAutoCycling();
      });
    }

    // Swipe Gestures for Hero Gallery & Slideshow on Mobile Touch
    const heroElements = document.querySelectorAll('.activities-page-section, .activities-gallery-wrapper, #hero-gallery-img, #work-gallery-img, .activities-upcoming-card');
    heroElements.forEach(el => {
      if (el && window.CAEAGestures && !el.dataset.gestureBound) {
        el.dataset.gestureBound = 'true';
        window.CAEAGestures.onSwipe(el, (g) => {
          if (g.direction === 'swipeleft') {
            setHeroEvent(currentHeroEventIndex + 1);
            startHeroAutoCycling();
          } else if (g.direction === 'swiperight') {
            setHeroEvent(currentHeroEventIndex - 1);
            startHeroAutoCycling();
          }
        }, { threshold: 35 });
      }
    });

    renderHeroThumbnails();

    // Determine initial featured event
    let initialIdx = activities.findIndex(a => a.featured === true);
    if (initialIdx === -1) initialIdx = 0;
    setHeroEvent(initialIdx);

    setupHeroHoverPause();
    startHeroAutoCycling();
  }

  /* ============================================================
     Dynamic Video Management & Modal System
     ============================================================ */
  function ensureVideoModalExists() {
    let modalOverlay = document.getElementById('caea-video-modal-overlay');
    if (modalOverlay) return modalOverlay;

    modalOverlay = document.createElement('div');
    modalOverlay.id = 'caea-video-modal-overlay';
    modalOverlay.className = 'caea-modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-hidden', 'true');

    modalOverlay.innerHTML = `
      <div class="caea-video-modal-card" id="caea-video-modal-card">
        <div class="video-modal-header">
          <h3 class="video-modal-title" id="video-modal-title">Featured Documentary</h3>
          <button type="button" class="caea-modal-close-btn" id="video-modal-close-btn" aria-label="Close Video">&times;</button>
        </div>
        <div class="video-modal-container" id="video-modal-media-container">
          <!-- Video Player or Iframe injected here -->
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const closeBtn = modalOverlay.querySelector('#video-modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeVideoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
        closeVideoModal();
      }
    });

    return modalOverlay;
  }

  function formatVideoEmbed(url) {
    if (!url) return null;
    const trimmed = url.trim();

    // YouTube
    if (trimmed.includes('youtube.com/watch')) {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `<iframe src="https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([^?&]+)/);
      if (match && match[1]) {
        return `<iframe src="https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    // Vimeo
    if (trimmed.includes('vimeo.com/')) {
      const match = trimmed.match(/vimeo\.com\/(\d+)/);
      if (match && match[1]) {
        return `<iframe src="https://player.vimeo.com/video/${match[1]}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    // HTML5 Video file or data URI
    return `<video controls autoplay playsinline style="width:100%; height:100%; object-fit:contain; background:#000;">
      <source src="${trimmed}" type="video/mp4" />
      Your browser does not support HTML5 video.
    </video>`;
  }

  function openVideoModal(title, videoUrl) {
    const overlay = ensureVideoModalExists();
    const titleEl = document.getElementById('video-modal-title');
    const mediaContainer = document.getElementById('video-modal-media-container');

    if (titleEl) titleEl.textContent = title || 'More than a retreat (CAEA Community Documentary)';

    if (mediaContainer) {
      if (videoUrl && videoUrl.trim()) {
        mediaContainer.innerHTML = formatVideoEmbed(videoUrl);
      } else {
        mediaContainer.innerHTML = `
          <div style="text-align:center; padding:36px 20px; color:#fff; display:flex; flex-direction:column; align-items:center; gap:16px;">
            <div style="width:64px; height:64px; border-radius:50%; background:rgba(77,100,216,0.2); border:1px solid #4d64d8; display:flex; align-items:center; justify-content:center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#4d64d8"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <h4 style="margin:0; font-size:18px;">${escapeHtml(title || 'More than a retreat')}</h4>
            <p style="margin:0; max-width:480px; font-size:13.5px; color:#9da5b4; line-height:1.5;">
              This documentary explores community experiences from the Lake Manchhar and Tarbela Dam delegations. Add or upload a custom video link via the Admin Panel under <strong>Page Settings &amp; Media</strong>.
            </p>
          </div>
        `;
      }
    }

    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    const overlay = document.getElementById('caea-video-modal-overlay');
    if (!overlay) return;

    const mediaContainer = document.getElementById('video-modal-media-container');
    if (mediaContainer) {
      const videoEl = mediaContainer.querySelector('video');
      if (videoEl) videoEl.pause();
      mediaContainer.innerHTML = '';
    }

    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function applyActivitiesVideoSettings() {
    const videoSection = document.getElementById('activities-video-section');
    const videoBtn = document.getElementById('activities-video-btn');
    const videoTitleEl = document.getElementById('activities-video-title');
    const videoDescEl = document.getElementById('activities-video-desc');
    const videoCoverEl = document.getElementById('activities-video-cover');

    if (!videoBtn && !videoSection) return;

    const settings = window.DataStore ? window.DataStore.getPageSettings('activities') : {
      showVideo: true,
      videoTitle: 'More than a retreat (CAEA Community Documentary)',
      videoDescription: 'No experience needed. Just a willingness to show up and act. Reconnecting with nature, exploring movement building, and building resilience against climate burnout.',
      videoUrl: '',
      videoThumbnail: 'Assets/how-water-became-power-ai.jpg'
    };

    if (!settings.showVideo) {
      if (videoSection) videoSection.style.display = 'none';
      if (videoBtn) videoBtn.style.display = 'none';
    } else {
      if (videoSection) videoSection.style.display = 'block';
      if (videoBtn) videoBtn.style.display = 'flex';
      if (videoTitleEl && settings.videoTitle) videoTitleEl.textContent = settings.videoTitle;
      if (videoDescEl && settings.videoDescription) videoDescEl.textContent = settings.videoDescription;
      if (videoCoverEl && settings.videoThumbnail) {
        videoCoverEl.src = resolveImagePath(settings.videoThumbnail);
      }
    }

    // Rebind video click
    if (videoBtn && !videoBtn.dataset.bound) {
      videoBtn.dataset.bound = 'true';
      videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentSettings = window.DataStore ? window.DataStore.getPageSettings('activities') : settings;
        openVideoModal(currentSettings.videoTitle, currentSettings.videoUrl);
      });
    }
  }

  /* ============================================================
     Automatic Hero Slideshow Cycling
     ============================================================ */
  let heroCycleTimer = null;
  let isHeroHovered = false;

  function startHeroAutoCycling() {
    stopHeroAutoCycling();
    if (!window.DataStore) return;

    const settings = window.DataStore.getPageSettings('activities');
    if (!settings || settings.autoplayImages === false) return;

    const interval = Math.max(2000, settings.imageCycleInterval || 5000);

    heroCycleTimer = setInterval(() => {
      if (!isHeroHovered) {
        const activities = getHeroActivities();
        if (activities && activities.length > 1) {
          setHeroEvent(currentHeroEventIndex + 1);
        }
      }
    }, interval);
  }

  function stopHeroAutoCycling() {
    if (heroCycleTimer) {
      clearInterval(heroCycleTimer);
      heroCycleTimer = null;
    }
  }

  function setupHeroHoverPause() {
    const heroSection = document.querySelector('.activities-page-section');
    if (!heroSection || heroSection.dataset.hoverBound) return;
    heroSection.dataset.hoverBound = 'true';

    heroSection.addEventListener('mouseenter', () => {
      isHeroHovered = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      isHeroHovered = false;
    });
  }

  function applyHomePageSettings() {
    if (!window.DataStore) return;
    const homeSettings = window.DataStore.getPageSettings('home');
    if (!homeSettings) return;

    const latestSection = document.getElementById('latest-section');
    const latestTitle = document.getElementById('latest-section-title');
    const latestDesc = document.getElementById('latest-section-desc');
    const videoWrap = document.getElementById('latest-video-preview-wrapper');
    const videoBtn = document.getElementById('home-latest-video-btn');
    const videoCover = document.getElementById('home-latest-video-cover');
    const videoTitle = document.getElementById('home-latest-video-title');
    const videoSummary = document.getElementById('home-latest-video-desc');
    const heroQuoteEl = document.querySelector('.hero-quote');

    if (latestSection && homeSettings.showLatestSection === false) {
      latestSection.style.display = 'none';
    } else if (latestSection) {
      latestSection.style.display = 'block';
    }

    if (latestTitle && homeSettings.latestTitle) {
      latestTitle.textContent = homeSettings.latestTitle;
    }
    if (latestDesc && homeSettings.latestSubtitle) {
      latestDesc.textContent = homeSettings.latestSubtitle;
    }

    if (videoWrap) {
      if (homeSettings.showLatestVideo === false) {
        videoWrap.style.display = 'none';
      } else {
        videoWrap.style.display = 'block';
        if (videoCover && homeSettings.latestVideoThumbnail) {
          videoCover.src = resolveImagePath(homeSettings.latestVideoThumbnail);
        }
        if (videoTitle && homeSettings.latestVideoTitle) {
          videoTitle.textContent = homeSettings.latestVideoTitle;
        }
        if (videoSummary && homeSettings.latestVideoDescription) {
          videoSummary.textContent = homeSettings.latestVideoDescription;
        }
      }
    }

    if (videoBtn && !videoBtn.dataset.bound) {
      videoBtn.dataset.bound = 'true';
      videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const curSettings = window.DataStore ? window.DataStore.getPageSettings('home') : homeSettings;
        openVideoModal(curSettings.latestVideoTitle || 'Featured Video', curSettings.latestVideoUrl || '');
      });
      videoBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          videoBtn.click();
        }
      });
    }

    if (heroQuoteEl && homeSettings.heroQuote) {
      let quoteHtml = escapeHtml(homeSettings.heroQuote);
      if (quoteHtml.includes('good for something')) {
        quoteHtml = quoteHtml.replace('good for something', '<em>good for something.</em>');
      }
      heroQuoteEl.innerHTML = quoteHtml;
    }
  }

  function applyOurStoryPageSettings() {
    if (!window.DataStore) return;
    const settings = window.DataStore.getPageSettings('ourStory');
    if (!settings) return;

    const teamHeader = document.querySelector('.team-card-header .team-header-title');
    const teamQuote = document.querySelector('.team-narrative-col .team-quote em');
    const quoteAuthor = document.querySelector('.team-narrative-col .team-quote-author');

    if (teamHeader && settings.teamHeaderTitle) teamHeader.textContent = settings.teamHeaderTitle;
    if (teamQuote && settings.quoteText) teamQuote.textContent = settings.quoteText;
    if (quoteAuthor && settings.quoteAuthor) quoteAuthor.textContent = settings.quoteAuthor;
  }

  /* ============================================================
     Dynamic Activities Feed Rendering (DataStore)
     ============================================================ */
  function getActivityImages(item) {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    if (item.image) {
      // If single image provided, provide known fallbacks from the same event folder if applicable
      const img = item.image;
      if (img.includes('contested-waters')) {
        return [
          'Assets/media/events/contested-waters/RAY00190.JPG',
          'Assets/media/events/contested-waters/RAY00059.JPG',
          'Assets/media/events/contested-waters/RAY00118.JPG',
          'Assets/media/events/contested-waters/RAY00212.JPG'
        ];
      }
      if (img.includes('retreat')) {
        return [
          'Assets/media/events/retreat/DSCF4154.JPG',
          'Assets/media/events/retreat/DSCF3966.JPG',
          'Assets/media/events/retreat/DSCF4356.JPG',
          'Assets/media/events/retreat/DSCF4512.JPG'
        ];
      }
      if (img.includes('manchar')) {
        return [
          'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM.jpeg',
          'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (1).jpeg',
          'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.18 PM (2).jpeg',
          'Assets/media/events/manchar/WhatsApp Image 2026-08-27 at 12.08.28 PM.jpeg'
        ];
      }
      if (img.includes('exposure-visit')) {
        return [
          'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.56 PM.jpeg',
          'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.57 PM (1).jpeg',
          'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.58 PM (2).jpeg',
          'Assets/media/events/exposure-visit/WhatsApp Image 2026-08-27 at 12.16.59 PM.jpeg'
        ];
      }
      return [item.image];
    }
    return ['/Assets/Hero-image.png'];
  }

  function renderDynamicActivities() {
    const activitiesContainer = document.querySelector('.activities-list');
    if (!activitiesContainer || !window.DataStore) return;

    const activities = window.DataStore.get('activities');
    if (!activities || !activities.length) return;

    activitiesContainer.innerHTML = activities.map((item) => {
      const imgList = getActivityImages(item);
      const initialImg = imgList[0] || item.image || '/Assets/Hero-image.png';

      return `
        <article class="activity-card" data-id="${item.id}">
          <div class="activity-media-box" data-act-id="${item.id}" data-current-index="0">
            <img class="activity-card-img" src="${resolveImagePath(initialImg)}" alt="${escapeHtml(item.title)}" onerror="this.src='/Assets/how-water-became-power.jpg'" />
            <button type="button" class="act-card-arrow prev-act-img" aria-label="Previous photo">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button type="button" class="act-card-arrow next-act-img" aria-label="Next photo">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div class="activity-content">
            <div>
              <h3 class="activity-item-title">${escapeHtml(item.title)}</h3>
              <p class="activity-item-desc">${escapeHtml(item.description)}</p>
            </div>
            <div class="activity-card-footer">
              <span class="activity-date">${item.dateFormatted || item.date || ''}</span>
              <span class="activity-tag">${escapeHtml(item.category || 'RETREAT')}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card image arrow listeners
    const cards = activitiesContainer.querySelectorAll('.activity-card');
    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const actItem = activities.find(a => a.id === cardId);
      if (!actItem) return;

      const imgList = getActivityImages(actItem);
      const mediaBox = card.querySelector('.activity-media-box');
      const imgEl = card.querySelector('.activity-card-img');
      const prevBtn = card.querySelector('.prev-act-img');
      const nextBtn = card.querySelector('.next-act-img');

      let currentIdx = 0;

      function updateCardImage(newIdx) {
        currentIdx = ((newIdx % imgList.length) + imgList.length) % imgList.length;
        if (mediaBox) mediaBox.setAttribute('data-current-index', currentIdx);
        if (imgEl) {
          imgEl.style.opacity = '0.4';
          setTimeout(() => {
            imgEl.src = resolveImagePath(imgList[currentIdx]);
            imgEl.style.opacity = '1';
          }, 120);
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          updateCardImage(currentIdx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          updateCardImage(currentIdx + 1);
        });
      }

      // Mobile Touch Swipe Gesture for Card Media Photo Carousel
      if (mediaBox && window.CAEAGestures && !mediaBox.dataset.gestureBound) {
        mediaBox.dataset.gestureBound = 'true';
        window.CAEAGestures.onSwipe(mediaBox, (g) => {
          if (g.direction === 'swipeleft') {
            updateCardImage(currentIdx + 1);
          } else if (g.direction === 'swiperight') {
            updateCardImage(currentIdx - 1);
          }
        }, { threshold: 30 });
      }
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
              <input type="text" id="apply-name" name="fullName" class="caea-form-input" placeholder="e.g. Jane Doe" required />
            </div>

            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-email">
                Email Address <span class="required-star">*</span>
              </label>
              <input type="email" id="apply-email" name="email" class="caea-form-input" placeholder="e.g. name@gmail.com" required />
            </div>
          </div>

          <div class="caea-form-row">
            <div class="caea-form-group">
              <label class="caea-form-label" for="apply-phone">
                Phone / WhatsApp <span class="required-star">*</span>
              </label>
              <input type="tel" id="apply-phone" name="phone" class="caea-form-input" placeholder="e.g. +92 300 0000000" required />
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

  /* ============================================================
     Our Work Page (Expandable Banners & Articles)
     ============================================================ */
  function applyOurWorkPageSettings() {
    if (!window.DataStore) return;
    const settings = window.DataStore.getPageSettings('ourWork');
    if (!settings) return;

    // 1. Fossil Fuel Phaseout
    const fossil = settings.fossilFuel || {};
    const fossilSection = document.getElementById('fossil-fuel-phaseout');
    const fossilBanner = document.getElementById('banner-fossil-fuel');
    const fossilDrawer = document.getElementById('drawer-fossil-fuel');
    const fossilTitle = document.getElementById('fossil-title');
    const fossilSub = document.getElementById('fossil-subtitle');
    const fossilDesc = document.getElementById('fossil-description');
    const fossilBtn = document.getElementById('fossil-join-btn');

    if (fossil.visible === false) {
      if (fossilSection) fossilSection.style.display = 'none';
      if (fossilBanner) fossilBanner.style.display = 'none';
      if (fossilDrawer) fossilDrawer.style.display = 'none';
    } else {
      if (fossilSection) fossilSection.style.display = '';
      if (fossilBanner) fossilBanner.style.display = '';
      if (fossilDrawer) fossilDrawer.style.display = '';
    }

    if (fossilTitle && fossil.title) fossilTitle.textContent = fossil.title;
    if (fossilSub && fossil.subtitle) fossilSub.textContent = fossil.subtitle;
    if (fossilDesc && fossil.description) {
      const paras = fossil.description.split('\n').filter(Boolean);
      fossilDesc.innerHTML = paras.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
    if (fossilBtn) {
      if (fossil.joinBtnText) fossilBtn.textContent = fossil.joinBtnText;
      if (fossil.opportunityTitle) fossilBtn.setAttribute('data-opportunity-title', fossil.opportunityTitle);
    }
    if (fossilBanner) {
      const bTitle = fossilBanner.querySelector('.bar-title');
      const bSub = fossilBanner.querySelector('.bar-subtitle');
      const bBtn = fossilBanner.querySelector('.btn-bar-action');
      if (bTitle && fossil.bannerTitle) bTitle.textContent = fossil.bannerTitle;
      if (bSub && fossil.bannerSubtitle) bSub.textContent = fossil.bannerSubtitle;
      if (bBtn && fossil.bannerBtnText) bBtn.textContent = fossil.bannerBtnText;
    }

    // 2. Textile & Fast Fashion
    const tex = settings.textile || {};
    const texBanner = document.getElementById('banner-textile');
    const texDrawer = document.getElementById('drawer-textile');
    const texBannerTitle = document.getElementById('textile-banner-title');
    const texBannerSub = document.getElementById('textile-banner-sub');
    const texTitle = document.getElementById('textile-title');
    const texSub = document.getElementById('textile-subtitle');
    const texDesc = document.getElementById('textile-description');
    const texBtn = document.getElementById('textile-join-btn');
    const texSecHeading = document.getElementById('textile-section-heading');
    const texSecIntro = document.getElementById('textile-section-intro');
    const texCardsGrid = document.getElementById('textile-cards-grid');

    if (tex.visible === false) {
      if (texBanner) texBanner.style.display = 'none';
      if (texDrawer) texDrawer.style.display = 'none';
    } else {
      if (texBanner) texBanner.style.display = '';
      if (texDrawer) texDrawer.style.display = '';
    }

    if (texBannerTitle && tex.bannerTitle) texBannerTitle.textContent = tex.bannerTitle;
    if (texBannerSub && tex.bannerSubtitle) texBannerSub.textContent = tex.bannerSubtitle;
    if (texBanner) {
      const bBtn = texBanner.querySelector('.btn-bar-action');
      if (bBtn && tex.bannerBtnText) bBtn.textContent = tex.bannerBtnText;
    }
    if (texTitle && tex.title) texTitle.textContent = tex.title;
    if (texSub && tex.subtitle) texSub.textContent = tex.subtitle;
    if (texDesc && tex.description) {
      const paras = tex.description.split('\n').filter(Boolean);
      texDesc.innerHTML = paras.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
    if (texBtn) {
      if (tex.joinBtnText) texBtn.textContent = tex.joinBtnText;
      if (tex.opportunityTitle) texBtn.setAttribute('data-opportunity-title', tex.opportunityTitle);
    }
    if (texSecHeading && tex.sectionHeading) texSecHeading.textContent = tex.sectionHeading;
    if (texSecIntro && tex.sectionIntro) texSecIntro.textContent = tex.sectionIntro;

    const cards = window.DataStore.get('textileCards') || tex.cards || [];
    if (texCardsGrid && Array.isArray(cards) && cards.length > 0) {
      texCardsGrid.innerHTML = cards.map(c => `
        <div class="insta-card">
          <div>
            <h4 class="insta-card-title">${escapeHtml(c.title || 'Fashion and Fossil Fuels')}</h4>
            <p class="insta-card-desc">
              ${escapeHtml(c.description || '')}
            </p>
          </div>
          <a href="${c.videoUrl ? escapeHtml(c.videoUrl) : '#video-modal'}" class="btn-watch-now" data-apply-btn data-opportunity-title="${escapeHtml(c.targetOpportunity || 'Textile Watch')}">
            <span>${escapeHtml(c.btnText || 'WATCH NOW')}</span>
            <span>&gt;</span>
          </a>
        </div>
      `).join('');
    }

    // 3. Climate Justice
    const cj = settings.climateJustice || {};
    const cjBanner = document.getElementById('banner-climate-justice');
    const cjDrawer = document.getElementById('drawer-climate-justice');
    const cjBannerTitle = document.getElementById('climate-banner-title');
    const cjBannerSub = document.getElementById('climate-banner-sub');
    const cjTitle = document.getElementById('climate-title');
    const cjSub = document.getElementById('climate-subtitle');
    const cjDesc = document.getElementById('climate-description');
    const cjBtn = document.getElementById('climate-join-btn');

    if (cj.visible === false) {
      if (cjBanner) cjBanner.style.display = 'none';
      if (cjDrawer) cjDrawer.style.display = 'none';
    } else {
      if (cjBanner) cjBanner.style.display = '';
      if (cjDrawer) cjDrawer.style.display = '';
    }

    if (cjBannerTitle && cj.bannerTitle) cjBannerTitle.textContent = cj.bannerTitle;
    if (cjBannerSub && cj.bannerSubtitle) cjBannerSub.textContent = cj.bannerSubtitle;
    if (cjBanner) {
      const bBtn = cjBanner.querySelector('.btn-bar-action');
      if (bBtn && cj.bannerBtnText) bBtn.textContent = cj.bannerBtnText;
    }
    if (cjTitle && cj.title) cjTitle.textContent = cj.title;
    if (cjSub && cj.subtitle) cjSub.textContent = cj.subtitle;
    if (cjDesc && cj.description) {
      const paras = cj.description.split('\n').filter(Boolean);
      cjDesc.innerHTML = paras.map(p => `<p>${escapeHtml(p)}</p>`).join('');
    }
    if (cjBtn) {
      if (cj.joinBtnText) cjBtn.textContent = cj.joinBtnText;
      if (cj.opportunityTitle) cjBtn.setAttribute('data-opportunity-title', cj.opportunityTitle);
    }

    // 4. Activities & Gatherings
    const actBanner = settings.activitiesBanner || {};
    const actBannerTitle = document.getElementById('activities-banner-title');
    const actBannerSub = document.getElementById('activities-banner-sub');
    const actBannerEl = document.getElementById('banner-activities');
    const heroQuote = document.getElementById('hero-event-quote');
    const heroAuthor = document.getElementById('hero-event-author');
    const heroHeading = document.getElementById('hero-event-heading');
    const heroDesc = document.getElementById('hero-event-description');

    if (actBannerTitle && actBanner.bannerTitle) actBannerTitle.textContent = actBanner.bannerTitle;
    if (actBannerSub && actBanner.bannerSubtitle) actBannerSub.textContent = actBanner.bannerSubtitle;
    if (actBannerEl) {
      const bBtn = actBannerEl.querySelector('.btn-bar-action');
      if (bBtn && actBanner.bannerBtnText) bBtn.textContent = actBanner.bannerBtnText;
    }

    if (heroQuote && actBanner.heroQuote) heroQuote.textContent = actBanner.heroQuote;
    if (heroAuthor && actBanner.heroAuthor) heroAuthor.textContent = actBanner.heroAuthor;
    if (heroHeading && actBanner.heroHeading) heroHeading.textContent = actBanner.heroHeading;
    if (heroDesc && actBanner.heroDescription) heroDesc.textContent = actBanner.heroDescription;

    if (actBanner.upcomingGathering) {
      const gTitle = document.querySelector('.activities-upcoming-title');
      const gSub = document.querySelector('.activities-upcoming-subtitle');
      const gLink = document.querySelector('.activities-upcoming-body .btn-see-more');
      if (gTitle && actBanner.upcomingGathering.title) gTitle.textContent = actBanner.upcomingGathering.title;
      if (gSub && actBanner.upcomingGathering.date) gSub.textContent = actBanner.upcomingGathering.date;
      if (gLink && actBanner.upcomingGathering.link) gLink.setAttribute('href', actBanner.upcomingGathering.link);
    }
  }

  function initOurWorkPage() {
    applyOurWorkPageSettings();
    const barBanners = document.querySelectorAll('.expandable-bar-banner');

    function getScrollOffset() {
      const fixedHeaderHeight = 72;
      return fixedHeaderHeight + 16;
    }

    // Expandable Bar Banners Accordion
    barBanners.forEach(banner => {
      banner.addEventListener('click', (e) => {
        // Don't toggle if clicking directly on a button inside bar
        if (e.target.closest('.btn-bar-action')) return;
        const targetId = banner.getAttribute('data-target');
        const drawer = document.getElementById(targetId);
        if (!drawer) return;

        const isExpanded = banner.classList.contains('is-expanded');
        if (isExpanded) {
          banner.classList.remove('is-expanded');
          banner.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('is-open');
        } else {
          banner.classList.add('is-expanded');
          banner.setAttribute('aria-expanded', 'true');
          drawer.classList.add('is-open');

          // Scroll neatly into view
          const bannerTop = banner.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = bannerTop - getScrollOffset();
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      });

      // Handle button inside banner specifically
      const btnAction = banner.querySelector('.btn-bar-action');
      if (btnAction) {
        btnAction.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = banner.getAttribute('data-target');
          const drawer = document.getElementById(targetId);
          if (drawer) {
            const willExpand = !banner.classList.contains('is-expanded');
            banner.classList.toggle('is-expanded');
            drawer.classList.toggle('is-open');
            banner.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
            if (willExpand) {
              const bannerTop = banner.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = bannerTop - getScrollOffset();
              window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
              });
            }
          }
        });
      }
    });

    // Fossil Fuel Phaseout Articles Filter & Search
    renderOurWorkArticles();
  }

  function renderOurWorkArticles() {
    const listContainer = document.getElementById('fossil-articles-list');
    if (!listContainer || !window.DataStore) return;

    let articles = window.DataStore.get('articles') || [];
    if (!articles.length) return;

    const filterBtns = document.querySelectorAll('#fossil-filters .filter-pill');
    const searchInput = document.getElementById('fossil-search-input');

    let currentFilter = 'all';
    let searchQuery = '';

    function filterAndRender() {
      let filtered = articles.filter(art => {
        // Filter tag matching
        const categoryMatch = currentFilter === 'all' || 
          (art.category && art.category.toLowerCase().includes(currentFilter.replace('-', ''))) ||
          (art.kicker && art.kicker.toLowerCase().includes(currentFilter.replace('-', '')));
        
        // Search query matching
        const queryMatch = !searchQuery || 
          art.title.toLowerCase().includes(searchQuery) || 
          (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery)) ||
          (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery));

        return categoryMatch && queryMatch;
      });

      if (!filtered.length) {
        filtered = articles; // Fallback
      }

      listContainer.innerHTML = filtered.map((item, idx) => `
        <div class="article-list-card article-item-card ${idx === 0 ? 'active is-active' : ''}" data-id="${item.id}">
          <div class="article-card-header article-item-meta">
            <span class="article-badge">${escapeHtml(item.kicker || item.category || 'KACHERI')}</span>
            <span class="article-date-str">${escapeHtml(item.dateFormatted || item.date || '20.05.2026')}</span>
          </div>
          <h4 class="article-card-title article-item-title">${escapeHtml(item.title)}</h4>
          <p class="article-card-sublabel article-item-sub">${escapeHtml(item.subtitle || '')}</p>
          <p class="article-card-excerpt">${escapeHtml(item.excerpt || item.description || '')}</p>
        </div>
      `).join('') + `
        <a href="/pages/our-analytics.html" class="btn-more-work">
          <span>MORE WORK</span>
          <span>&gt;</span>
        </a>
      `;

      // Add click listener to load item in reader
      const cards = listContainer.querySelectorAll('.article-list-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          cards.forEach(c => {
            c.classList.remove('active');
            c.classList.remove('is-active');
          });
          card.classList.add('active');
          card.classList.add('is-active');
          const id = card.getAttribute('data-id');
          const selectedArticle = articles.find(a => a.id === id);
          if (selectedArticle) {
            loadArticleInReader(selectedArticle);
          }
        });
      });

      // Mobile Touch Swipe Gesture for Article Reader
      const readerContainer = document.querySelector('.article-view-column, .article-reader-container');
      if (readerContainer && window.CAEAGestures && !readerContainer.dataset.gestureBound) {
        readerContainer.dataset.gestureBound = 'true';
        window.CAEAGestures.onSwipe(readerContainer, (g) => {
          const currentActive = listContainer.querySelector('.article-list-card.active, .article-list-card.is-active');
          if (!currentActive) return;
          if (g.direction === 'swipeleft') {
            const nextCard = currentActive.nextElementSibling;
            if (nextCard && nextCard.classList.contains('article-list-card')) {
              nextCard.click();
            }
          } else if (g.direction === 'swiperight') {
            const prevCard = currentActive.previousElementSibling;
            if (prevCard && prevCard.classList.contains('article-list-card')) {
              prevCard.click();
            }
          }
        }, { threshold: 45 });
      }

      // Load initial item
      if (filtered.length > 0) {
        loadArticleInReader(filtered[0]);
      }
    }

    function loadArticleInReader(item) {
      const titleEl = document.getElementById('reader-title');
      const subEl = document.getElementById('reader-subtitle');
      const authorEl = document.getElementById('reader-author');
      const dateEl = document.getElementById('reader-date');
      const imgEl = document.getElementById('reader-img');
      const contentEl = document.getElementById('reader-content');

      if (titleEl) titleEl.textContent = item.title;
      if (subEl) subEl.textContent = item.subtitle || item.excerpt || '';
      if (authorEl) authorEl.textContent = item.author ? `BY ${item.author.toUpperCase()}` : 'BY HAMNA ANWAR';
      if (dateEl) dateEl.textContent = item.dateFormatted || item.date || '';
      if (imgEl) imgEl.src = resolveImagePath(item.image || 'Assets/how-water-became-power.jpg');

      if (contentEl) {
        const paras = (item.content || item.excerpt || '').split('\n').filter(Boolean);
        if (paras.length > 0) {
          contentEl.innerHTML = paras.map(p => `<p>${escapeHtml(p)}</p>`).join('');
        } else {
          contentEl.innerHTML = `
            <p>The kacheri was based on the case of Lake Manchar. The discussion focused on the ecological destruction of the lake, and how large development projects have affected the people, culture, and livelihoods connected to it.</p>
            <p>Lake Manchar is located in Sindh between the Khirthar mountain range and the River Sindhu. The lake is 360 miles long and 170 miles wide. It is the biggest natural sweet water lake in Asia.</p>
          `;
        }
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        filterAndRender();
      });
    });

    // Textile filter buttons
    const textileFilterBtns = document.querySelectorAll('#textile-filters .filter-pill');
    textileFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        textileFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterAndRender();
      });
    }

    filterAndRender();
  }

  // Initial dynamic renders & event switcher
  renderPakistanMapPins();
  applyHomePageSettings();
  initHeroEventSwitcher();
  renderDynamicActivities();
  renderDynamicOpportunities();
  renderDynamicTeamAccordions();
  applyActivitiesVideoSettings();
  applyOurStoryPageSettings();
  initOurWorkPage();

  function syncAllViews() {
    renderPakistanMapPins();
    applyHomePageSettings();
    initHeroEventSwitcher();
    renderDynamicActivities();
    renderDynamicOpportunities();
    renderDynamicTeamAccordions();
    applyActivitiesVideoSettings();
    applyOurStoryPageSettings();
    initOurWorkPage();
  }

  // Listen to DataStore updates to keep everything in sync
  window.addEventListener('caea-datastore-update', () => {
    syncAllViews();
  });

  // Cross-tab synchronization via localStorage storage event
  window.addEventListener('storage', (e) => {
    if (e.key && (e.key.startsWith('caea_') || e.key === 'caea_page_settings')) {
      syncAllViews();
    }
  });
});



