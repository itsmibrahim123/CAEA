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
     Activities Page Gallery & Video Interactivity
     ============================================================ */
  const thumbs = document.querySelectorAll('.activities-gallery-thumbs .thumb-item');
  const prevBtn = document.getElementById('prev-hero-slide');
  const nextBtn = document.getElementById('next-hero-slide');
  let currentSlide = 0;

  function updateGallerySlide(index) {
    if (!thumbs.length) return;
    thumbs.forEach((t, idx) => {
      if (idx === index) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    currentSlide = index;
  }

  if (thumbs.length) {
    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        updateGallerySlide(idx);
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let newIdx = currentSlide - 1;
      if (newIdx < 0) newIdx = thumbs.length - 1;
      updateGallerySlide(newIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let newIdx = (currentSlide + 1) % thumbs.length;
      updateGallerySlide(newIdx);
    });
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

    activitiesContainer.innerHTML = activities.map(item => `
      <article class="activity-card" data-id="${item.id}">
        <div class="activity-media-box">
          <img src="${item.image || 'Assets/Hero-image.png'}" alt="" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'" />
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
          </div>
        </div>
      </article>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderDynamicActivities();
  window.addEventListener('caea-datastore-update', renderDynamicActivities);
});

