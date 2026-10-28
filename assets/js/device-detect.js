/**
 * CAEA Device Detection & Mobile Format System (device-detect.js)
 * 
 * Automatically detects whether the user is on PC (Desktop/Laptop) or Mobile (Phone/Tablet).
 * Immediately attaches device classes to <html> & <body> to prevent flash of desktop format,
 * manages mobile navigation drawer, and ensures touch-friendly layouts.
 */

(function () {
  'use strict';

  // Automatically remove index.html from browser URL address bar
  if (typeof window !== 'undefined' && window.location && window.location.pathname) {
    if (window.location.pathname.endsWith('/index.html')) {
      const cleanUrl = window.location.pathname.replace(/\/index\.html$/, '/') + window.location.search + window.location.hash;
      window.history.replaceState(null, '', cleanUrl);
    }
  }

  // 1. Detection Core
  function detectDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const isCoarsePointer = window.matchMedia ? window.matchMedia('(pointer: coarse)').matches : false;
    
    // Width thresholds
    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    const height = window.innerHeight || document.documentElement.clientHeight || 768;
    const isNarrow = width <= 900;
    const isPhoneWidth = width <= 600;

    // A user is on mobile if mobile UA OR touch screen + narrow width, or simply narrow width
    const isMobile = isMobileUA || (hasTouch && width <= 1024) || isNarrow;
    const isPhone = isMobile && isPhoneWidth;
    const isTablet = isMobile && !isPhone;
    const isDesktop = !isMobile;

    let platform = 'desktop';
    if (/iPhone|iPad|iPod/i.test(ua)) platform = 'ios';
    else if (/Android/i.test(ua)) platform = 'android';

    return {
      isMobile,
      isDesktop,
      isPhone,
      isTablet,
      hasTouch,
      isCoarsePointer,
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
      platform
    };
  }

  // 2. Class & Attribute Synchronizer
  function applyClasses(info) {
    const doc = document.documentElement;
    const body = document.body;

    // Attributes
    doc.setAttribute('data-device', info.isMobile ? 'mobile' : 'desktop');
    doc.setAttribute('data-device-type', info.isPhone ? 'phone' : (info.isTablet ? 'tablet' : 'desktop'));
    doc.setAttribute('data-touch', info.hasTouch ? 'true' : 'false');
    doc.setAttribute('data-orientation', info.orientation);

    // Classes to add/remove
    const add = [];
    const remove = [];

    if (info.isMobile) {
      add.push('is-mobile', 'device-mobile');
      remove.push('is-desktop', 'device-desktop');
    } else {
      add.push('is-desktop', 'device-desktop');
      remove.push('is-mobile', 'device-mobile');
    }

    if (info.isPhone) {
      add.push('device-phone');
      remove.push('device-tablet');
    } else if (info.isTablet) {
      add.push('device-tablet');
      remove.push('device-phone');
    } else {
      remove.push('device-phone', 'device-tablet');
    }

    if (info.hasTouch) {
      add.push('has-touch');
      remove.push('no-touch');
    } else {
      add.push('no-touch');
      remove.push('has-touch');
    }

    add.push('platform-' + info.platform);

    remove.forEach(c => doc.classList.remove(c));
    add.forEach(c => doc.classList.add(c));

    if (body) {
      remove.forEach(c => body.classList.remove(c));
      add.forEach(c => body.classList.add(c));
    }
  }

  // Execute synchronously right now in <head>
  let currentInfo = detectDevice();
  applyClasses(currentInfo);

  // Global Device API
  window.CAEADevice = {
    get current() { return currentInfo; },
    isMobile: () => currentInfo.isMobile,
    isDesktop: () => currentInfo.isDesktop,
    isPhone: () => currentInfo.isPhone,
    isTablet: () => currentInfo.isTablet,
    hasTouch: () => currentInfo.hasTouch,
    recheck: () => {
      const prev = currentInfo.isMobile;
      currentInfo = detectDevice();
      applyClasses(currentInfo);
      if (prev !== currentInfo.isMobile) {
        window.dispatchEvent(new CustomEvent('devicemodechange', { detail: currentInfo }));
      }
      return currentInfo;
    }
  };

  // Re-check on resize and orientation change
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) cancelAnimationFrame(resizeTimer);
    resizeTimer = requestAnimationFrame(() => {
      window.CAEADevice.recheck();
    });
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      window.CAEADevice.recheck();
    }, 150);
  }, { passive: true });

  // 3. Mobile Navigation & UI Initialization on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    // Re-apply to body once body is in the DOM
    applyClasses(currentInfo);

    initMobileNavigation();
  });

  /* ============================================================
     Mobile Navigation Drawer System
     ============================================================ */
  function initMobileNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Check if toggle button already exists, if not create it
    let navEnd = navbar.querySelector('.nav-col-end');
    if (!navEnd) {
      navEnd = document.createElement('div');
      navEnd.className = 'nav-col nav-col-end';
      navbar.appendChild(navEnd);
    }

    let toggleBtn = document.getElementById('caea-mobile-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.id = 'caea-mobile-toggle';
      toggleBtn.className = 'mobile-menu-toggle-btn';
      toggleBtn.setAttribute('aria-label', 'Toggle mobile navigation menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `
        <span class="hamburger-box" aria-hidden="true">
          <span class="hamburger-line line-1"></span>
          <span class="hamburger-line line-2"></span>
          <span class="hamburger-line line-3"></span>
        </span>
      `;
      navEnd.appendChild(toggleBtn);
    }

    // Determine current active page
    const currentPath = window.location.pathname.toLowerCase();
    const isStories = currentPath.includes('our-story');
    const isWork = currentPath.includes('our-work');
    const isAnalytics = currentPath.includes('our-analytics');
    const isInvolved = currentPath.includes('get-involved');
    const isHome = !isStories && !isWork && !isAnalytics && !isInvolved;

    // Determine relative paths based on folder depth
    const isSubPage = currentPath.includes('/pages/');
    const basePath = isSubPage ? '../' : './';
    const pagesPath = isSubPage ? './' : 'pages/';

    // Create or locate the mobile navigation drawer
    let drawer = document.getElementById('caea-mobile-drawer');
    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'caea-mobile-drawer';
      drawer.className = 'mobile-nav-drawer';
      drawer.setAttribute('aria-label', 'Mobile Navigation Drawer');
      drawer.setAttribute('aria-hidden', 'true');

      drawer.innerHTML = `
        <div class="mobile-drawer-backdrop" id="caea-drawer-backdrop"></div>
        <div class="mobile-drawer-panel" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div class="mobile-drawer-header">
            <a href="${basePath}" class="mobile-drawer-brand">
              <img src="${basePath}assets/CAEA-Navbar-Logo.png" alt="CAEA Logo" class="mobile-drawer-logo" onerror="this.src='/assets/CAEA-Navbar-Logo.png'" />
            </a>
            <button type="button" class="mobile-drawer-close-btn" id="caea-drawer-close" aria-label="Close navigation menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav class="mobile-drawer-nav">
            <ul class="mobile-nav-list">
              <li class="mobile-nav-item">
                <a href="${basePath}" class="mobile-nav-link ${isHome ? 'active' : ''}">
                  <span class="mobile-nav-text">Home</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li class="mobile-nav-item">
                <a href="${pagesPath}our-story.html" class="mobile-nav-link ${isStories ? 'active' : ''}">
                  <span class="mobile-nav-text">Our Story</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li class="mobile-nav-item mobile-nav-has-sub">
                <div class="mobile-nav-link-row">
                  <a href="${pagesPath}our-work.html" class="mobile-nav-link ${isWork ? 'active' : ''}">
                    <span class="mobile-nav-text">Our Work</span>
                    <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                  </a>
                  <button type="button" class="mobile-subnav-toggle ${isWork ? 'is-open' : ''}" id="caea-work-subnav-toggle" aria-label="Toggle Our Work sections" aria-expanded="${isWork ? 'true' : 'false'}">
                    <svg class="mobile-subnav-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <ul class="mobile-subnav-list ${isWork ? 'is-open' : ''}" id="caea-work-subnav-list">
                  <li>
                    <a href="${pagesPath}our-work.html#banner-fossil-fuel" class="mobile-subnav-link" data-mobile-banner="banner-fossil-fuel">
                      <span class="mobile-subnav-bullet dot-fossil"></span>
                      Fossil Fuel Phaseout
                    </a>
                  </li>
                  <li>
                    <a href="${pagesPath}our-work.html#banner-climate-justice" class="mobile-subnav-link" data-mobile-banner="banner-climate-justice">
                      <span class="mobile-subnav-bullet dot-climate"></span>
                      Climate Justice
                    </a>
                  </li>
                  <li>
                    <a href="${pagesPath}our-work.html#banner-textile" class="mobile-subnav-link" data-mobile-banner="banner-textile">
                      <span class="mobile-subnav-bullet dot-fashion"></span>
                      Fast Fashion
                    </a>
                  </li>
                  <li>
                    <a href="${pagesPath}our-work.html#banner-activities" class="mobile-subnav-link" data-mobile-banner="banner-activities">
                      <span class="mobile-subnav-bullet dot-activities"></span>
                      Activities &amp; Gatherings
                    </a>
                  </li>
                </ul>
              </li>
              <li class="mobile-nav-item">
                <a href="${pagesPath}our-analytics.html" class="mobile-nav-link ${isAnalytics ? 'active' : ''}">
                  <span class="mobile-nav-text">Our Analytics</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li class="mobile-nav-item">
                <a href="${pagesPath}get-involved.html" class="mobile-nav-link ${isInvolved ? 'active' : ''}">
                  <span class="mobile-nav-text">Get Involved</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
            </ul>
          </nav>

          <div class="mobile-drawer-footer">
            <a href="${pagesPath}get-involved.html" class="mobile-drawer-cta">
              JOIN THE MOVEMENT
            </a>

            <div class="mobile-drawer-socials">
              <span class="drawer-socials-label">Connect with CAEA</span>
              <div class="drawer-social-icons">
                <a href="https://www.linkedin.com/company/climate-action-energy-access/" class="drawer-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.68 1.68 0 1 0 0 3.36 1.68 1.68 0 0 0 0-3.36Z"/></svg>
                </a>
                <a href="https://www.instagram.com/climateactionenergyaccess?stkn=MWRueXdsZTRxZzdlMg%3D%3D&utm_source=qr" class="drawer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    // Event Handling
    function openMenu() {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-nav-locked');
    }

    function closeMenu() {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-nav-locked');
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    const backdrop = document.getElementById('caea-drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    const closeBtn = document.getElementById('caea-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on clicking any link inside the drawer (with special handling for mobile subnav on Our Work)
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const mobileBanner = link.getAttribute('data-mobile-banner');
        if (mobileBanner && isWork) {
          e.preventDefault();
          closeMenu();
          window.location.hash = '#' + mobileBanner;
          if (typeof window.expandBannerByTarget === 'function') {
            window.expandBannerByTarget(mobileBanner);
          }
          return;
        }
        closeMenu();
      });
    });

    // Mobile Subnav Toggle Accordion
    const workSubToggle = drawer.querySelector('#caea-work-subnav-toggle');
    const workSubList = drawer.querySelector('#caea-work-subnav-list');
    if (workSubToggle && workSubList) {
      workSubToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = workSubList.classList.contains('is-open');
        if (isOpen) {
          workSubList.classList.remove('is-open');
          workSubToggle.classList.remove('is-open');
          workSubToggle.setAttribute('aria-expanded', 'false');
        } else {
          workSubList.classList.add('is-open');
          workSubToggle.classList.add('is-open');
          workSubToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // Touch Swipe Gesture Support for Navigation Drawer
    const drawerPanel = drawer.querySelector('.mobile-drawer-panel');
    if (drawerPanel && window.CAEAGestures) {
      // Swipe right on drawer panel to close
      window.CAEAGestures.onSwipe(drawerPanel, (g) => {
        if (g.direction === 'swiperight') {
          closeMenu();
        }
      }, { threshold: 35 });
    }

    // Edge-swipe from right edge to open drawer on mobile
    let edgeStartX = 0;
    let edgeStartY = 0;
    let edgeStartTime = 0;

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      edgeStartX = t.clientX;
      edgeStartY = t.clientY;
      edgeStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!currentInfo.isMobile || drawer.classList.contains('is-open')) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const deltaX = t.clientX - edgeStartX;
      const deltaY = t.clientY - edgeStartY;
      const elapsed = Date.now() - edgeStartTime;

      const isRightEdge = edgeStartX >= (window.innerWidth - 45);
      if (isRightEdge && deltaX < -45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && elapsed < 500) {
        openMenu();
      }
    }, { passive: true });
  }

  /* ============================================================
     4. Universal Touch Gesture Engine (window.CAEAGestures)
     ============================================================ */
  const CAEAGestures = {
    /**
     * Attach a multi-directional swipe gesture listener to any element
     * @param {HTMLElement|Window|Document} target
     * @param {Function} handler ({ direction, deltaX, deltaY, distance, velocity, target, originalEvent })
     * @param {Object} options { threshold: 40, maxDuration: 650, lockAxis: true }
     */
    onSwipe(target, handler, options = {}) {
      if (!target) return () => {};
      const threshold = options.threshold || 38;
      const maxDuration = options.maxDuration || 650;
      const lockAxis = options.lockAxis !== false;

      let startX = 0;
      let startY = 0;
      let startTime = 0;
      let isTracking = false;

      function onTouchStart(e) {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        isTracking = true;
      }

      function onTouchEnd(e) {
        if (!isTracking) return;
        isTracking = false;

        const touch = e.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const elapsed = Date.now() - startTime;

        if (elapsed > maxDuration) return;

        let direction = null;

        if (lockAxis) {
          if (absX >= threshold && absX > absY * 1.25) {
            direction = deltaX > 0 ? 'swiperight' : 'swipeleft';
          } else if (absY >= threshold && absY > absX * 1.25) {
            direction = deltaY > 0 ? 'swipedown' : 'swipeup';
          }
        } else {
          if (absX >= threshold || absY >= threshold) {
            if (absX > absY) {
              direction = deltaX > 0 ? 'swiperight' : 'swipeleft';
            } else {
              direction = deltaY > 0 ? 'swipedown' : 'swipeup';
            }
          }
        }

        if (direction) {
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const velocity = distance / Math.max(1, elapsed);
          handler({
            direction,
            deltaX,
            deltaY,
            distance,
            velocity,
            target: e.target,
            originalEvent: e
          });
        }
      }

      target.addEventListener('touchstart', onTouchStart, { passive: true });
      target.addEventListener('touchend', onTouchEnd, { passive: true });

      return () => {
        target.removeEventListener('touchstart', onTouchStart);
        target.removeEventListener('touchend', onTouchEnd);
      };
    },

    /**
     * Enable smooth momentum swipe & drag for horizontal tabs and carousels
     */
    enableTouchDragScroll(container) {
      if (!container) return;
      container.style.webkitOverflowScrolling = 'touch';
    }
  };

  window.CAEAGestures = CAEAGestures;

  // 5. Global Modal & Popup Touch Gesture Dismissal System
  document.addEventListener('DOMContentLoaded', () => {
    // Delegated swipe-down handler for all open modals across all pages
    let modalTouchStartY = 0;
    let modalTouchStartX = 0;
    let modalTouchStartTime = 0;
    let activeModalTarget = null;

    document.addEventListener('touchstart', (e) => {
      const modal = e.target.closest('.caea-modal-overlay.is-active, .caea-modal-card, .caea-video-modal-card, dialog.admin-modal[open], .city-marker.is-open .city-popup');
      if (!modal) {
        activeModalTarget = null;
        return;
      }
      activeModalTarget = modal;
      modalTouchStartX = e.touches[0].clientX;
      modalTouchStartY = e.touches[0].clientY;
      modalTouchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!activeModalTarget) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - modalTouchStartX;
      const deltaY = touch.clientY - modalTouchStartY;
      const elapsed = Date.now() - modalTouchStartTime;

      // Swiped down with high vertical component
      if (deltaY > 55 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3 && elapsed < 600) {
        // If the inner card is scrolled down, only dismiss if scrolled near top
        const scrollable = activeModalTarget.closest('.caea-modal-card, .caea-modal-body, .admin-modal, .city-popup') || activeModalTarget;
        if (scrollable && scrollable.scrollTop > 20) {
          activeModalTarget = null;
          return;
        }

        // Trigger close
        const closeBtn = activeModalTarget.querySelector('.caea-modal-close-btn, #caea-modal-close-btn, #video-modal-close-btn, .modal-close-btn, .popup-badge');
        if (closeBtn) {
          closeBtn.click();
        } else if (activeModalTarget.classList.contains('city-popup')) {
          const parentMarker = activeModalTarget.closest('.city-marker');
          if (parentMarker) {
            parentMarker.classList.remove('is-open');
            parentMarker.setAttribute('aria-expanded', 'false');
          }
        }
      }
      activeModalTarget = null;
    }, { passive: true });
  });

})();


