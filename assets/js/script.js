/* -------------------------------------------------
   script.js – shared behaviours
   ------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- AOS ----------
  AOS.init({ once:true, duration:800, easing:'ease-out-cubic' });

  // ---------- Dark‑mode toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement; // <html>

  // Load saved preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    htmlEl.setAttribute('data-bs-theme', saved);
    updateIcon(saved);
  }

  themeToggle.addEventListener('click', () => {
    const newTheme = htmlEl.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
  });

  function updateIcon(theme) {
    const i = themeToggle.querySelector('i');
    if (theme === 'dark') {
      i.classList.remove('fa-moon');
      i.classList.add('fa-sun');
    } else {
      i.classList.remove('fa-sun');
      i.classList.add('fa-moon');
    }
  }

  // ---------- Scroll‑to‑top button ----------
  const scrollBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = (window.scrollY > 200) ? 'flex' : 'none';
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  // ---------- OPTIONAL: YouTube API video loader ----------
  // -------------------------------------------------
  // 1. Get a YouTube Data API v3 key from Google Cloud Console.
  // 2. Replace the placeholder below with your real key and channel ID.
  // 3. The script will replace every placeholder card in #videoGrid
  //    with the latest 12 videos from your channel.
  // -------------------------------------------------
  const API_KEY = 'YOUR_API_KEY_HERE';          // <-- replace!
  const CHANNEL_ID = 'UCYOURCHANNELID';         // <-- replace!
  const MAX_RESULTS = 12;

  if (API_KEY !== 'YOUR_API_KEY_HERE') {
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`)
      .then(r => r.json())
      .then(data => {
        const grid = document.getElementById('videoGrid');
        if (!grid) return; // safety – some pages (e.g., contact) don’t have this element
        grid.innerHTML = ''; // clear placeholders

        data.items.forEach(item => {
          if (item.id.kind !== 'youtube#video') return; // skip playlists, etc.
          const vidId = item.id.videoId;
          const title = item.snippet.title;
          const thumb = item.snippet.thumbnails.high.url;

          const col = document.createElement('div');
          col.className = 'col-sm-6 col-md-4 col-lg-3';
          col.innerHTML = `
            <div class="card video-card h-100 shadow-sm">
              <img src="${thumb}" class="card-img-top" alt="${title}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title small">${title}</h5>
                <p class="card-text text-muted mb-2"><i class="far fa-clock me-1"></i>—</p>
                <a href="https://www.youtube.com/watch?v=${vidId}" target="_blank"
                   class="mt-auto btn btn-primary btn-sm"><i class="fab fa-youtube me-1"></i>Watch</a>
              </div>
            </div>
          `;
          grid.appendChild(col);
        });
      })
      .catch(err => console.error('YouTube API error:', err));
  }
});