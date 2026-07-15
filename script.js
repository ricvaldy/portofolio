const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("navPanel");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const revealItems = document.querySelectorAll(".section-reveal, .skill-card, .timeline-item, .achievement-card, .project-card, .petrocup-card, .mini-card, .project-feature, .contact-method, .certificate-card");

document.documentElement.classList.add("reveal-ready");

function getSavedTheme() {
  try {
    return localStorage.getItem("portfolio-theme");
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    return;
  }
}

function closeMenu() {
  if (!navPanel || !menuToggle) return;

  navPanel.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navPanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("open");

    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

const currentPage = document.body.dataset.page;
navLinks.forEach((link) => {
  link.classList.toggle("active", link.dataset.page === currentPage);
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const savedTheme = getSavedTheme();
const initialTheme = savedTheme || "light";

document.documentElement.dataset.theme = initialTheme;

function syncThemeToggle(theme) {
  if (!themeToggle) return;

  const isDark = theme === "dark";
  const nextLabel = isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap";

  themeToggle.classList.toggle("is-dark", isDark);
  themeToggle.dataset.mode = theme;
  themeToggle.setAttribute("aria-label", nextLabel);
  themeToggle.setAttribute("title", nextLabel);
}

if (themeToggle) {
  themeToggle.innerHTML = `
    <span class="theme-toggle-track" aria-hidden="true">
      <span class="theme-toggle-glow"></span>
      <span class="theme-toggle-symbol theme-toggle-sun">&#9728;</span>
      <span class="theme-toggle-symbol theme-toggle-moon">&#9790;</span>
      <span class="theme-toggle-thumb"><span></span></span>
    </span>
    <span class="theme-toggle-label">Theme</span>
  `;

  syncThemeToggle(initialTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    saveTheme(nextTheme);
    syncThemeToggle(nextTheme);

    themeToggle.classList.remove("is-animating");
    window.requestAnimationFrame(() => themeToggle.classList.add("is-animating"));
  });
}
if (navPanel && themeToggle) {
  const jakartaClock = document.createElement("div");
  jakartaClock.className = "jakarta-clock";
  jakartaClock.setAttribute("aria-label", "Waktu Jakarta, Indonesia");
  jakartaClock.innerHTML = `
    <span>Jakarta</span>
    <strong id="jakartaClockTime">--:--:--</strong>
    <small>WIB</small>
  `;
  navPanel.insertBefore(jakartaClock, themeToggle);

  const jakartaClockTime = document.getElementById("jakartaClockTime");
  const jakartaTimeFormatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  function updateJakartaClock() {
    if (!jakartaClockTime) return;

    jakartaClockTime.textContent = jakartaTimeFormatter.format(new Date()).replace(/\./g, ":");
  }

  updateJakartaClock();
  window.setInterval(updateJakartaClock, 1000);
}

function updateBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 500);
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", updateBackToTop);
  updateBackToTop();
}

function shouldAnimateNavigation(link, event) {
  if (!link || event.defaultPrevented) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return false;
  if (link.target === "_blank" || link.hasAttribute("download")) return false;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === window.location.pathname && url.hash) return false;

  return true;
}

const pageTransition = document.createElement("div");
pageTransition.className = "page-transition";
pageTransition.setAttribute("aria-hidden", "true");
pageTransition.innerHTML = `
  <div class="page-transition-panel">
    <span class="page-transition-kicker">Opening</span>
    <strong class="page-transition-title">Portfolio</strong>
    <span class="page-transition-line"></span>
  </div>
`;
document.body.appendChild(pageTransition);

const pageTransitionTitle = pageTransition.querySelector(".page-transition-title");

function getTransitionLabel(link) {
  const label = link.textContent.trim();
  if (label) return label;

  return "Portfolio";
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!shouldAnimateNavigation(link, event)) return;

  event.preventDefault();
  closeMenu();

  if (pageTransitionTitle) {
    pageTransitionTitle.textContent = getTransitionLabel(link);
  }

  pageTransition.classList.add("is-active");
  document.body.classList.add("page-is-leaving");

  window.setTimeout(() => {
    window.location.href = link.href;
  }, 780);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}


const heroPhotoSlider = document.getElementById("heroPhotoSlider");
const heroProfilePhoto = document.getElementById("heroProfilePhoto");
const heroPhotoCaption = document.getElementById("heroPhotoCaption");
const heroPhotoDots = document.getElementById("heroPhotoDots");

const heroPhotoSlides = [
  {
    src: "assets/images/profile-photo.jpg",
    alt: "Ricvaldy Timotius Tarigan saat kegiatan lapangan berbasis teknologi",
    caption: "Field learning and engineering practice."
  },
  {
    src: "assets/images/petrocup-award.jpg",
    alt: "Ricvaldy memegang penghargaan Juara 1 PETROCUP Paper Competition 2025",
    caption: "PETROCUP Paper Competition 2025."
  },
  {
    src: "assets/images/research-school-award.jpg",
    alt: "Ricvaldy memegang piala dan sertifikat Juara 2 Research School 2 FK 2025",
    caption: "Research School 2 FK 2025."
  },
  {
    src: "assets/images/ews-final-collaboration.jpg",
    alt: "Tim proyek EWS bersama penjahit setelah implementasi alat sensor",
    caption: "EWS assistive sensor project."
  },
  {
    src: "assets/images/ews-pic-session.jpg",
    alt: "Ricvaldy sebagai PIC EWS dalam diskusi proyek sensor",
    caption: "Project coordination and discussion."
  }
];

if (heroPhotoSlider && heroProfilePhoto && heroPhotoCaption && heroPhotoDots && heroPhotoSlides.length > 1) {
  let activeHeroPhoto = 0;
  let heroPhotoTimer = null;

  heroPhotoSlides.slice(1).forEach((slide) => {
    const image = new Image();
    image.src = slide.src;
  });

  heroPhotoSlides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("active", index === activeHeroPhoto);
    heroPhotoDots.appendChild(dot);
  });

  function updateHeroPhotoDots() {
    heroPhotoDots.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("active", index === activeHeroPhoto);
    });
  }

  function showHeroPhoto(nextIndex) {
    if (nextIndex === activeHeroPhoto) return;

    const nextSlide = heroPhotoSlides[nextIndex];
    heroPhotoSlider.classList.add("is-changing");

    window.setTimeout(() => {
      heroProfilePhoto.src = nextSlide.src;
      heroProfilePhoto.alt = nextSlide.alt;
      heroPhotoCaption.textContent = nextSlide.caption;
      activeHeroPhoto = nextIndex;
      updateHeroPhotoDots();
      heroPhotoSlider.classList.remove("is-changing");
    }, 260);
  }

  function startHeroPhotoSlider() {
    if (heroPhotoTimer) return;

    heroPhotoTimer = window.setInterval(() => {
      const nextIndex = (activeHeroPhoto + 1) % heroPhotoSlides.length;
      showHeroPhoto(nextIndex);
    }, 4200);
  }

  function stopHeroPhotoSlider() {
    window.clearInterval(heroPhotoTimer);
    heroPhotoTimer = null;
  }

  heroPhotoSlider.addEventListener("mouseenter", stopHeroPhotoSlider);
  heroPhotoSlider.addEventListener("mouseleave", startHeroPhotoSlider);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroPhotoSlider();
    } else {
      startHeroPhotoSlider();
    }
  });

  startHeroPhotoSlider();
}




const VISITOR_NAME_KEY = "portfolio-visitor-name";
const VISITOR_LIST_KEY = "portfolio-visitor-list";

function readVisitorList() {
  try {
    const storedVisitors = JSON.parse(localStorage.getItem(VISITOR_LIST_KEY) || "[]");
    return Array.isArray(storedVisitors) ? storedVisitors : [];
  } catch (error) {
    return [];
  }
}

function saveVisitorList(visitors) {
  try {
    localStorage.setItem(VISITOR_LIST_KEY, JSON.stringify(visitors));
  } catch (error) {
    return;
  }
}

function cleanVisitorName(name) {
  return name.replace(/\s+/g, " ").trim().slice(0, 28);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function registerVisitor(name) {
  const cleanName = cleanVisitorName(name);
  if (!cleanName) return [];

  const visitors = readVisitorList();
  const existingVisitor = visitors.find((visitor) => visitor.name.toLowerCase() === cleanName.toLowerCase());

  if (existingVisitor) {
    existingVisitor.lastSeenAt = new Date().toISOString();
  } else {
    visitors.unshift({
      name: cleanName,
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString()
    });
  }

  const limitedVisitors = visitors.slice(0, 12);
  saveVisitorList(limitedVisitors);
  return limitedVisitors;
}

function getSavedVisitorName() {
  try {
    return cleanVisitorName(localStorage.getItem(VISITOR_NAME_KEY) || "");
  } catch (error) {
    return "";
  }
}

function saveVisitorName(name) {
  try {
    localStorage.setItem(VISITOR_NAME_KEY, name);
  } catch (error) {
    return;
  }
}

function formatVisitorTime(isoDate) {
  if (!isoDate) return "Baru saja";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(isoDate)).replace(/\./g, ":");
  } catch (error) {
    return "Baru saja";
  }
}

function renderVisitorBoard(currentVisitorName) {
  if (document.body.dataset.page !== "home") return;

  const heroActions = document.querySelector(".hero-actions");
  if (!heroActions) return;

  const visitors = readVisitorList();
  const existingBoard = document.getElementById("visitorBoard");
  const visitorBoard = existingBoard || document.createElement("aside");
  visitorBoard.className = "visitor-board";
  visitorBoard.id = "visitorBoard";

  const visitorItems = visitors.length
    ? visitors.map((visitor) => `<li><span>${escapeHtml(visitor.name)}</span><small>${escapeHtml(formatVisitorTime(visitor.lastSeenAt))}</small></li>`).join("")
    : "<li><span>Belum ada nama</span><small>-</small></li>";

  visitorBoard.innerHTML = `
    <div>
      <span class="visitor-board-label">Visitor Log</span>
      <strong>${visitors.length} orang pernah masuk</strong>
      <p>Halo, ${escapeHtml(currentVisitorName)}. Daftar ini tersimpan di browser ini.</p>
    </div>
    <ul aria-label="Daftar nama pengunjung">
      ${visitorItems}
    </ul>
  `;

  if (!existingBoard) {
    heroActions.insertAdjacentElement("afterend", visitorBoard);
  }
}

function showVisitorGate() {
  if (document.getElementById("visitorGate")) return;

  const visitorGate = document.createElement("section");
  visitorGate.className = "visitor-gate";
  visitorGate.id = "visitorGate";
  visitorGate.setAttribute("aria-modal", "true");
  visitorGate.setAttribute("role", "dialog");
  visitorGate.setAttribute("aria-labelledby", "visitorGateTitle");
  visitorGate.innerHTML = `
    <form class="visitor-gate-card" id="visitorGateForm">
      <span class="visitor-gate-kicker">Welcome</span>
      <h2 id="visitorGateTitle">Masuk sebagai siapa?</h2>
      <p>Tulis nama singkat kamu dulu sebelum melihat portofolio ini.</p>
      <label for="visitorNameInput">Nama</label>
      <div class="visitor-gate-input-row">
        <input id="visitorNameInput" name="visitorName" type="text" maxlength="28" autocomplete="name" placeholder="Contoh: Ricvaldy" required />
        <button type="submit">Masuk</button>
      </div>
      <small>Data nama disimpan di browser pengunjung.</small>
    </form>
  `;

  document.body.appendChild(visitorGate);
  document.body.classList.add("visitor-gate-open");

  const visitorNameInput = document.getElementById("visitorNameInput");
  const visitorGateForm = document.getElementById("visitorGateForm");

  window.setTimeout(() => visitorNameInput?.focus(), 100);

  visitorGateForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(visitorGateForm);
    const visitorName = cleanVisitorName(String(formData.get("visitorName") || ""));
    if (!visitorName) return;

    saveVisitorName(visitorName);
    registerVisitor(visitorName);
    renderVisitorBoard(visitorName);

    visitorGate.classList.add("is-leaving");
    window.setTimeout(() => {
      visitorGate.remove();
      document.body.classList.remove("visitor-gate-open");
    }, 420);
  });
}

const savedVisitorName = getSavedVisitorName();
if (savedVisitorName) {
  registerVisitor(savedVisitorName);
  renderVisitorBoard(savedVisitorName);
} else {
  showVisitorGate();
}

