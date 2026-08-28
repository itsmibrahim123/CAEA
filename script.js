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
});
