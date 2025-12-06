// Main script: simple, no uploads. Populate project tiles from an array of image paths.
// Replace the strings in projectImages with file paths or URLs to show your screenshots.
// Also replace the profile image path in index.html <img id="profilePic"> or change it here.

(() => {
  const $ = s => document.querySelector(s);

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // PROFILE
  // If you prefer to set the profile image from JS instead of editing HTML, set this path.
  // Leave empty to use the src already in index.html.
  const profilePath = ''; // e.g. 'assets/me.jpg' or '/images/profile.jpg'
  if (profilePath) {
    const p = $('#profilePic');
    if (p) p.src = profilePath;
  }

  // PROJECTS: add your image paths here. Use local paths (assets/...) or remote URLs.
  // Example:
  // const projectImages = ['assets/proj1.png', 'assets/proj2.png', '', 'assets/proj4.png'];
  // Leave empty string for placeholder tile.
  const projectImages = [
    '', '', '', '',
    '', '', '', ''
  ];

  const projectTitles = [
    'Project One','Project Two','Project Three','Project Four',
    'Project Five','Project Six','Project Seven','Project Eight'
  ];

  const grid = $('#projectsGrid');

  function buildTiles() {
    grid.innerHTML = '';
    projectImages.forEach((src, i) => {
      const tile = document.createElement('div');
      tile.className = 'project-tile';

      if (src) {
        const img = document.createElement('div');
        img.className = 'project-img';
        img.style.backgroundImage = `url('${src}')`;
        tile.appendChild(img);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'project-placeholder';
        placeholder.textContent = String(i + 1).padStart(2, '0');
        tile.appendChild(placeholder);
      }

      const info = document.createElement('div');
      info.className = 'project-info';
      const h = document.createElement('h4');
      h.textContent = projectTitles[i] || `Project ${i + 1}`;
      info.appendChild(h);
      tile.appendChild(info);

      // subtle parallax on pointer move
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const imgEl = tile.querySelector('.project-img');
        tile.style.transform = `translateY(-6px) rotateX(${ -y * 4 }deg) rotateY(${ x * 6 }deg)`;
        if (imgEl) imgEl.style.transform = `scale(1.06) translate(${x * 8}px, ${y * 8}px)`;
      });
      tile.addEventListener('mouseleave', () => {
        tile.style.transform = '';
        const imgEl = tile.querySelector('.project-img');
        if (imgEl) imgEl.style.transform = '';
      });

      grid.appendChild(tile);
    });
  }

  buildTiles();

  // Small reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        reveal.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  const targets = document.querySelectorAll('.project-tile, .contact-info, .contact-form');
  targets.forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(18px)';
    reveal.observe(t);
  });

  // Parallax blobs & profile following scroll for a luxe feel
  const blobs = document.querySelectorAll('.blob');
  const portrait = document.querySelector('.portrait-wrap');
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    blobs.forEach((b, idx) => {
      b.style.transform = `translateY(${sc * (0.03 + idx * 0.02)}px)`;
    });
    if (portrait) portrait.style.transform = `translateX(${Math.min(20, sc * 0.02)}px)`;
  }, {passive: true});

  // Contact form simple UI handling (no backend)
  const form = $('#contactForm');
  const formToast = $('#formToast');
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').trim(), email = data.get('email').trim(), msg = data.get('message').trim();
    if (!name || !email || !msg) {
      showToast('Please fill all fields', true);
      return;
    }
    showToast('Sending message...', false);
    setTimeout(() => {
      form.reset();
      showToast('Message sent — thanks!', false);
    }, 900);
  });

  function showToast(msg, isError = false) {
    formToast.textContent = msg;
    formToast.style.color = isError ? '#ffb4b4' : '#bfe6d5';
    setTimeout(() => {
      if (formToast.textContent === msg) formToast.textContent = '';
    }, 3500);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });
})();