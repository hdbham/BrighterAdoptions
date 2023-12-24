(function() {

	var window = this,
	  document = window.document;
  
	var $window = document.querySelector(window),
	  $head = document.querySelector('head'),
	  $body = document.querySelector('body');
  
	// Breakpoints.
	window.breakpoints({
	  xlarge: ['1281px', '1680px'],
	  large: ['981px', '1280px'],
	  medium: ['737px', '980px'],
	  small: ['481px', '736px'],
	  xsmall: ['361px', '480px'],
	  xxsmall: [null, '360px'],
	  'xlarge-to-max': '(min-width: 1681px)',
	  'small-to-xlarge': '(min-width: 481px) and (max-width: 1680px)'
	});
  
	// Stops animations/transitions until the page has ...
  
	// ... loaded.
	window.addEventListener('load', function() {
	  window.setTimeout(function() {
		$body.classList.remove('is-preload');
	  }, 100);
	});
  
	// ... stopped resizing.
	var resizeTimeout;
  
	window.addEventListener('resize', function() {
  
	  // Mark as resizing.
	  $body.classList.add('is-resizing');
  
	  // Unmark after delay.
	  clearTimeout(resizeTimeout);
  
	  resizeTimeout = setTimeout(function() {
		$body.classList.remove('is-resizing');
	  }, 100);
  
	});
  
	// Fixes.
  
	// Object fit images.
	var objectFitImages = document.querySelectorAll('.image.object');
  
	if (!browser.canUse('object-fit') || browser.name == 'safari') {
	  objectFitImages.forEach(function(element) {
  
		var $this = element,
		  $img = $this.querySelector('img');
  
		// Hide original image.
		$img.style.opacity = '0';
  
		// Set background.
		$this.style.backgroundImage = 'url("' + $img.getAttribute('src') + '")';
		$this.style.backgroundSize = $img.style.objectFit ? $img.style.objectFit : 'cover';
		$this.style.backgroundPosition = $img.style.objectPosition ? $img.style.objectPosition : 'center';
	  });
	}
  
	// Sidebar.
	var $sidebar = document.querySelector('#sidebar'),
	  $sidebar_inner = $sidebar.querySelector('.inner');
  
	// Inactive by default on <= large.
	window.breakpoints.on('<=large', function() {
	  $sidebar.classList.add('inactive');
	});
  
	window.breakpoints.on('>large', function() {
	  $sidebar.classList.remove('inactive');
	});
  
	// Hack: Workaround for Chrome/Android scrollbar position bug.
	if (browser.os == 'android' && browser.name == 'chrome') {
	  var style = document.createElement('style');
	  style.textContent = '#sidebar .inner::-webkit-scrollbar { display: none; }';
	  $head.appendChild(style);
	}
  
	// Toggle.
	var toggle = document.createElement('a');
	toggle.setAttribute('href', '#sidebar');
	toggle.classList.add('toggle');
	toggle.textContent = 'Toggle';
	$sidebar.appendChild(toggle);
  
	toggle.addEventListener('click', function(event) {
  
	  // Prevent default.
	  event.preventDefault();
	  event.stopPropagation();
  
	  // Toggle.
	  $sidebar.classList.toggle('inactive');
	});
  
	// Events.
	// Link clicks.
	$sidebar.addEventListener('click', function(event) {
  
	  // >large? Bail.
	  if (window.breakpoints.active('>large')) return;
  
	  var $a = event.target.closest('a'),
		href = $a.getAttribute('href'),
		target = $a.getAttribute('target');
  
	  // Prevent default.
	  event.preventDefault();
	  event.stopPropagation();
  
	  // Check URL.
	  if (!href || href == '#' || href == '') return;
  
	  // Hide sidebar.
	  $sidebar.classList.add('inactive');
  
	  // Redirect to href.
	  setTimeout(function() {
  
		if (target == '_blank') window.open(href);
		else window.location.href = href;
  
	  }, 500);
  
	});
  
	// Prevent certain events inside the panel from bubbling.
	$sidebar.addEventListener('click', function(event) {
  
	  // >large? Bail.
	  if (window.breakpoints.active('>large')) return;
  
	  // Prevent propagation.
	  event.stopPropagation();
  
	});
  
	// Hide panel on body click/tap.
	$body.addEventListener('click', function(event) {
  
	  // >large? Bail.
	  if (window.breakpoints.active('>large')) return;
  
	  // Deactivate.
	  $sidebar.classList.add('inactive');
  
	});
  
	// Scroll lock.
	window.addEventListener('load.sidebar-lock', function() {
  
	  var sh, wh, st;
  
	  // Reset scroll position to 0 if it's 1.
	  if ($window.scrollTop() == 1) $window.scrollTop(0);
  
	  window.addEventListener('scroll.sidebar-lock', function() {
  
		var x, y;
  
		// <=large? Bail.
		if (window.breakpoints.active('<=large')) {
  
		  $sidebar_inner.dataset.locked = 0;
		  $sidebar_inner.style.position = '';
		  $sidebar_inner.style.top = '';
		  return;
  
		}
  
		// Calculate positions.
		x = Math.max(sh - wh, 0);
		y = Math.max(0, $window.scrollTop() - x);
  
		// Lock/unlock.
		if ($sidebar_inner.dataset.locked == 1) {
  
		  if (y <= 0) {
			$sidebar_inner.dataset.locked = 0;
			$sidebar_inner.style.position = '';
			$sidebar_inner.style.top = '';
		  } else {
			$sidebar_inner.style.top = -1 * x + 'px';
		  }
  
		} else {
  
		  if (y > 0) {
			$sidebar_inner.dataset.locked = 1;
			$sidebar_inner.style.position = 'fixed';
			$sidebar_inner.style.top = -1 * x + 'px';
		  }
  
		}
  
	  });
  
	  window.addEventListener('resize.sidebar-lock', function() {
  
		// Calculate heights.
		wh = $window.clientHeight;
		sh = $sidebar_inner.offsetHeight + 30;
  
		// Trigger scroll.
		window.dispatchEvent(new Event('scroll.sidebar-lock'));
  
	  });
  
	  window.dispatchEvent(new Event('resize.sidebar-lock'));
  
	});
  
	// Menu.
	var $menu = document.querySelector('#menu'),
	  $menu_openers = $menu.querySelectorAll('ul .opener');
  
	$menu_openers.forEach(function(opener) {
	  opener.addEventListener('click', function(event) {
  
		// Prevent default.
		event.preventDefault();
  
		// Toggle.
		$menu_openers.forEach(function(el) {
		  if (el !== opener) el.classList.remove('active');
		});
		opener.classList.toggle('active');
  
		// Trigger resize (sidebar lock).
		window.dispatchEvent(new Event('resize.sidebar-lock'));
  
	  });
	});
  
  })();
  