(function() {
  'use strict';

  const getViewport = () => {
    let e = window;
    let a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return { width: e[a + 'Width'], height: e[a + 'Height'] };
  };

  const getScrollPosition = function() {
    if (window.pageYOffset !== undefined) {
      return { left: pageXOffset, top: pageYOffset };
    } else {
      var sx,
        sy,
        d = document,
        r = d.documentElement,
        b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return { left: sx, top: sy };
    }
  };

  const breakpoint = 768;

  let lastWidth = getViewport().width;

  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-header__nav');
  const toggleMenu = document.querySelector('.site-header__toggle-menu');
  const navLinks = nav.querySelectorAll('a');

  const navHiddenClass = 'site-header__nav--hidden';
  const toggleMenuHiddenClass = 'site-header__toggle-menu--hidden';

  if (getViewport().width < breakpoint) {
    nav.classList.add(navHiddenClass);
    toggleMenu.classList.remove(toggleMenuHiddenClass);
  }

  const handleResizeEvent = () => {
    const width = getViewport().width;

    if (width < breakpoint && lastWidth >= breakpoint) {
      nav.classList.add(navHiddenClass);
      toggleMenu.classList.remove(toggleMenuHiddenClass);
    } else if (width >= breakpoint && lastWidth < width) {
      nav.classList.remove(navHiddenClass);
      toggleMenu.classList.add(toggleMenuHiddenClass);
    }
    lastWidth = width;
  };

  let resizeTimeout;

  const resizeThrottler = () => {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;

        handleResizeEvent();
      }, 200);
    }
  };

  window.addEventListener('resize', resizeThrottler);

  const showNav = () => {
    window.addEventListener('click', clickOutside, true);
    nav.classList.remove(navHiddenClass);
  };

  const hideNav = () => {
    const width = getViewport().width;

    if (width < breakpoint) {
      window.removeEventListener('click', clickOutside, true);
      nav.classList.add(navHiddenClass);
    }
  };

  const clickOutside = e => {
    if (!header.contains(e.target)) {
      hideNav();
    }
  };

  toggleMenu.addEventListener('click', e => {
    if (nav.classList.contains(navHiddenClass)) {
      showNav();
    } else {
      hideNav();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      hideNav();
    });
  });

  const heroSection = document.querySelector('.hero-section');
  const borderPos = heroSection.offsetTop + heroSection.offsetHeight;

  const past = {
    down: getScrollPosition().top > borderPos,
    up: getScrollPosition().top < borderPos
  };

  const toggleNarrowHeader = () => {
    const top = getScrollPosition().top;
    if (!past.down && top > borderPos) {
      past.down = true;
      past.up = false;
      header.classList.add('site-header--narrow');
    } else if (!past.up && top < borderPos) {
      past.up = true;
      past.down = false;
      header.classList.remove('site-header--narrow');
    }
  };
  let scrollTimeout;

  const scrollThrottler = () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function() {
        scrollTimeout = null;

        toggleNarrowHeader();
      }, 200);
    }
  };
  window.addEventListener('scroll', scrollThrottler);
  toggleNarrowHeader();

  // Masonry
  window.addEventListener('load', () => {
    const gallery = document.querySelector('.gallery');
    const masonry = new Masonry(gallery, {
      // options
      itemSelector: '.gallery__wrapper',
      columnWidth: '.gallery__wrapper',
      percentPosition: true
    });
  });
})();
