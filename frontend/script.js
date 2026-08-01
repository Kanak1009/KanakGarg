document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav toggle (mobile) ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- endpoint accordions ---------- */
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    const body = btn.nextElementSibling;

    const setState = (expanded) => {
      btn.setAttribute('aria-expanded', String(expanded));
      if (expanded) {
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = '0px';
      }
    };

    // initial state
    setState(btn.getAttribute('aria-expanded') === 'true');

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      setState(!expanded);
    });

    // keep open cards correctly sized on resize
    window.addEventListener('resize', () => {
      if (btn.getAttribute('aria-expanded') === 'true') {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- command palette ---------- */
  const cmdkTrigger = document.getElementById('cmdkTrigger');
  const cmdkOverlay = document.getElementById('cmdkOverlay');
  const cmdkInput = document.getElementById('cmdkInput');
  const cmdkList = document.getElementById('cmdkList');
  const cmdkKbdMod = document.getElementById('cmdkKbdMod');

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  if (cmdkKbdMod) cmdkKbdMod.textContent = isMac ? '⌘' : 'Ctrl';

  const commands = [
    { label: 'Go to overview', hint: 'GET /', action: () => scrollToId('top') },
    { label: 'Go to experience', hint: 'GET /experience', action: () => scrollToId('experience') },
    { label: 'Go to projects', hint: 'GET /projects', action: () => scrollToId('projects') },
    { label: 'Go to skills', hint: 'GET /skills', action: () => scrollToId('skills') },
    { label: 'Go to contact', hint: 'POST /contact', action: () => scrollToId('contact') },
    { label: 'Download resume', hint: 'GET /resume.pdf', action: () => triggerDownload('Kanak_Garg_Resume.pdf') },
    { label: 'Email Kanak', hint: 'kanakgarg109@gmail.com', action: () => window.location.href = 'mailto:kanakgarg109@gmail.com' },
    { label: 'Copy email address', hint: 'clipboard', action: () => copyText('kanakgarg109@gmail.com', 'Email copied') },
    { label: 'Open GitHub', hint: 'github.com/Kanak1009', action: () => window.open('https://github.com/Kanak1009', '_blank', 'noopener') },
    { label: 'Open LinkedIn', hint: 'linkedin.com/in/kanak-garg', action: () => window.open('https://www.linkedin.com/in/kanak-garg-a339a3293/', '_blank', 'noopener') },
    { label: 'View BioVote source', hint: 'GET /projects/biovote', action: () => window.open('https://github.com/MidhunManu/BioVote', '_blank', 'noopener') },
    { label: 'View Coupon Engine source', hint: 'GET /projects/coupon-engine', action: () => window.open('https://github.com/Kanak1009/Smart-Coupon-Recommendation', '_blank', 'noopener') },
    { label: 'View Toxic Comment Flagger source', hint: 'GET /projects/toxic-comment-flagger', action: () => window.open('https://github.com/Kanak1009/Toxic-Comment-Flagger-ML', '_blank', 'noopener') },
  ];

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function triggerDownload(path) {
    const a = document.createElement('a');
    a.href = path; a.download = ''; a.click();
  }

  function copyText(text, msg) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  }

  let activeIndex = 0;
  let filtered = commands;

  function renderList() {
    cmdkList.innerHTML = '';
    if (filtered.length === 0) {
      cmdkList.innerHTML = '<li class="cmdk-empty">No matching command</li>';
      return;
    }
    filtered.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item' + (i === activeIndex ? ' active' : '');
      li.dataset.index = String(i);
      li.innerHTML = `<span class="cmdk-item-label">${cmd.label}</span><span class="cmdk-item-hint">${cmd.hint}</span>`;
      cmdkList.appendChild(li);
    });
  }

  // Only toggle the 'active' class on existing nodes — never rebuild the
  // list here. Rebuilding on hover was destroying the element mid-click.
  function highlightActive() {
    Array.from(cmdkList.children).forEach((li) => {
      if (!li.dataset) return;
      const i = Number(li.dataset.index);
      li.classList.toggle('active', i === activeIndex);
    });
  }

  cmdkList.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (!item || item.dataset.index === undefined) return;
    const i = Number(item.dataset.index);
    if (i !== activeIndex) {
      activeIndex = i;
      highlightActive();
    }
  });

  // Single delegated click handler — works even if the list is re-rendered
  // for other reasons (filtering), since we always look up the current node.
  cmdkList.addEventListener('click', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (!item || item.dataset.index === undefined) return;
    const cmd = filtered[Number(item.dataset.index)];
    if (cmd) runCommand(cmd);
  });

  function runCommand(cmd) {
    closeCmdk();
    setTimeout(() => cmd.action(), 80);
  }

  function filterCommands(query) {
    const q = query.trim().toLowerCase();
    filtered = !q ? commands : commands.filter(c =>
      c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
    activeIndex = 0;
    renderList();
  }

  function openCmdk() {
    cmdkOverlay.hidden = false;
    cmdkInput.value = '';
    filterCommands('');
    setTimeout(() => cmdkInput.focus(), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeCmdk() {
    cmdkOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  if (cmdkTrigger) cmdkTrigger.addEventListener('click', openCmdk);

  if (cmdkOverlay) {
    cmdkOverlay.addEventListener('click', (e) => {
      if (e.target === cmdkOverlay) closeCmdk();
    });
  }

  if (cmdkInput) {
    cmdkInput.addEventListener('input', (e) => filterCommands(e.target.value));
    cmdkInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        highlightActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        highlightActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) runCommand(filtered[activeIndex]);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdkOverlay.hidden ? openCmdk() : closeCmdk();
    } else if (e.key === 'Escape' && !cmdkOverlay.hidden) {
      closeCmdk();
    }
  });

  /* ---------- terminal typewriter ---------- */
  const cmdEl = document.getElementById('typedCommand');
  const cursorEl = document.getElementById('typeCursor');
  const responseEl = document.getElementById('terminalResponse');
  const terminalEl = document.getElementById('terminal');
  const statusEl = document.getElementById('terminalStatus');
  const statusTextEl = document.getElementById('terminalStatusText');

  // Swap this for your deployed backend's URL (see /backend in the project root).
  // Until it's deployed, the fetch below fails silently and the terminal falls
  // back to the bundled JSON — so the page works perfectly either way.
  const API_BASE = 'https://kanakgarg.onrender.com';

  function jsonToColoredHTML(obj) {
    const entries = Object.entries(obj).map(([k, v]) => {
      const val = typeof v === 'string' ? `<span class="js">"${v}"</span>`
        : Array.isArray(v) ? `[${v.map(x => `<span class="js">"${x}"</span>`).join(', ')}]`
        : `<span class="jb">${v}</span>`;
      return `  <span class="jk">"${k}"</span><span class="jp">:</span> ${val}`;
    });
    return `<span class="jp">{</span>\n${entries.join('<span class="jp">,</span>\n')}\n<span class="jp">}</span>`;
  }

  async function fetchLiveProfile() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`${API_BASE}/api/v1/profile`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      return data;
    } catch (err) {
      return null; // deploy /backend to make this live — see backend/README.md
    }
  }

  function setStatus(state) {
    if (!statusEl || !statusTextEl) return;
    statusEl.classList.remove('is-live', 'is-cached');
    if (state === 'live') {
      statusEl.classList.add('is-live');
      statusTextEl.textContent = 'live';
    } else if (state === 'cached') {
      statusEl.classList.add('is-cached');
      statusTextEl.textContent = 'cached';
    } else {
      statusTextEl.textContent = 'connecting…';
    }
  }

  const requests = [
    {
      command: 'curl -s https://kanakgarg.dev/api/v1/profile',
      html:
`<span class="jp">{</span>
  <span class="jk">"name"</span><span class="jp">:</span> <span class="js">"Kanak Garg"</span><span class="jp">,</span>
  <span class="jk">"role"</span><span class="jp">:</span> <span class="js">"Backend Developer"</span><span class="jp">,</span>
  <span class="jk">"stack"</span><span class="jp">:</span> <span class="jp">[</span><span class="js">"Python"</span><span class="jp">,</span> <span class="js">"FastAPI"</span><span class="jp">,</span> <span class="js">"PostgreSQL"</span><span class="jp">]</span><span class="jp">,</span>
  <span class="jk">"location"</span><span class="jp">:</span> <span class="js">"Pune, India"</span><span class="jp">,</span>
  <span class="jk">"available_for_hire"</span><span class="jp">:</span> <span class="jb">true</span>
<span class="jp">}</span>`
    },
    {
      command: 'curl -s https://kanakgarg.dev/api/v1/status',
      html:
`<span class="jp">{</span>
  <span class="jk">"endpoints_shipped"</span><span class="jp">:</span> <span class="jb">20</span><span class="jp">,</span>
  <span class="jk">"perf_improvement"</span><span class="jp">:</span> <span class="js">"110%"</span><span class="jp">,</span>
  <span class="jk">"currently"</span><span class="jp">:</span> <span class="js">"MSc Computer Science"</span><span class="jp">,</span>
  <span class="jk">"open_to_work"</span><span class="jp">:</span> <span class="jb">true</span>
<span class="jp">}</span>`
    }
  ];

  function typeCommand(text, el, onDone, speed = 38) {
    let i = 0;
    (function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else if (onDone) {
        onDone();
      }
    })();
  }

  function runRequest(index) {
    const req = requests[index % requests.length];
    responseEl.classList.remove('show');
    cmdEl.textContent = '';
    typeCommand(req.command, cmdEl, async () => {
      let html = req.html;
      if (index % requests.length === 0) {
        setStatus('connecting');
        const live = await fetchLiveProfile();
        if (live) {
          html = jsonToColoredHTML(live);
          setStatus('live');
        } else {
          setStatus('cached');
        }
      }
      setTimeout(() => {
        responseEl.innerHTML = html;
        requestAnimationFrame(() => responseEl.classList.add('show'));
        // queue the next request after a pause, only while the terminal is visible
        setTimeout(() => {
          if (terminalVisible) runRequest(index + 1);
        }, 3800);
      }, 300);
    });
  }

  let terminalVisible = false;
  let hasStarted = false;

  if (cmdEl && responseEl) {
    if (prefersReducedMotion) {
      cmdEl.textContent = requests[0].command;
      responseEl.innerHTML = requests[0].html;
      responseEl.classList.add('show');
      if (cursorEl) cursorEl.style.display = 'none';
      setStatus('cached');
    } else if (terminalEl && 'IntersectionObserver' in window) {
      const termObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          terminalVisible = entry.isIntersecting;
          if (entry.isIntersecting && !hasStarted) {
            hasStarted = true;
            setTimeout(() => runRequest(0), 400);
          }
        });
      }, { threshold: 0.4 });
      termObserver.observe(terminalEl);
    } else {
      setTimeout(() => { terminalVisible = true; runRequest(0); }, 500);
    }
  }

});