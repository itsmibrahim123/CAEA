/**
 * CAEA Device Detection & Mobile Format System (device-detect.js)
 * 
 * Automatically detects whether the user is on PC (Desktop/Laptop) or Mobile (Phone/Tablet).
 * Immediately attaches device classes to <html> & <body> to prevent flash of desktop format,
 * manages mobile navigation drawer, and ensures touch-friendly layouts.
 */

(function () {
  'use strict';

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
            <a href="${basePath}index.html" class="mobile-drawer-brand">
              <img src="${basePath}Assets/CAEA-Navbar-Logo.png" alt="CAEA Logo" class="mobile-drawer-logo" onerror="this.src='/Assets/CAEA-Navbar-Logo.png'" />
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
                <a href="${basePath}index.html" class="mobile-nav-link ${isHome ? 'active' : ''}">
                  <span class="mobile-nav-text">Home</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li class="mobile-nav-item">
                <a href="${pagesPath}our-story.html" class="mobile-nav-link ${isStories ? 'active' : ''}">
                  <span class="mobile-nav-text">Our Stories</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li class="mobile-nav-item">
                <a href="${pagesPath}our-work.html" class="mobile-nav-link ${isWork ? 'active' : ''}">
                  <span class="mobile-nav-text">Our Work</span>
                  <span class="mobile-nav-arrow" aria-hidden="true">&rarr;</span>
                </a>
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
                <a href="#" class="drawer-social-link" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.68 1.68 0 1 0 0 3.36 1.68 1.68 0 0 0 0-3.36Z"/></svg>
                </a>
                <a href="#" class="drawer-social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                </a>
                <a href="#" class="drawer-social-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10Z"/></svg>
                </a>
                <a href="#" class="drawer-social-link" aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24Zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.24.25-.4.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z"/></svg>
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

    // Close on clicking any link inside the drawer
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

})();

