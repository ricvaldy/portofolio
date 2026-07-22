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
  const isCurrentPage = link.dataset.page === currentPage;

  link.classList.toggle("active", isCurrentPage);
  if (isCurrentPage) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
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

let backToTopFrame = null;

function updateBackToTop() {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 500);
  backToTopFrame = null;
}

function scheduleBackToTopUpdate() {
  if (backToTopFrame !== null) return;
  backToTopFrame = window.requestAnimationFrame(updateBackToTop);
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", scheduleBackToTopUpdate, { passive: true });
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
  if (url.pathname === window.location.pathname && !url.hash) return false;

  return true;
}

const transitionDestinations = {
  "index.html": { label: "Home", index: "01", color: "#0066cc" },
  "about.html": { label: "About", index: "02", color: "#147d64" },
  "skills.html": { label: "Skills", index: "03", color: "#5669c9" },
  "experience.html": { label: "Experience", index: "04", color: "#0f7f8a" },
  "achievements.html": { label: "Achievements", index: "05", color: "#9a6700" },
  "projects.html": { label: "Projects", index: "06", color: "#b44d3f" },
  "contact.html": { label: "Contact", index: "07", color: "#59636f" }
};

const pageTransition = document.createElement("div");
pageTransition.className = "page-transition";
pageTransition.setAttribute("aria-hidden", "true");
pageTransition.innerHTML = `
  <div class="page-transition-panel">
    <span class="page-transition-kicker">Menuju halaman</span>
    <strong class="page-transition-title">Portfolio</strong>
    <span class="page-transition-meta">
      <span class="page-transition-index">01</span>
      <span>Ricvaldy Portfolio</span>
    </span>
  </div>
`;
document.body.appendChild(pageTransition);

const pageTransitionTitle = pageTransition.querySelector(".page-transition-title");
const pageTransitionIndex = pageTransition.querySelector(".page-transition-index");

function getTransitionDestination(link) {
  const url = new URL(link.href, window.location.href);
  const fileName = url.pathname.split("/").pop() || "index.html";
  const fallbackLabel = link.textContent.trim() || "Portfolio";

  return transitionDestinations[fileName] || {
    label: fallbackLabel,
    index: "RT",
    color: "#0066cc"
  };
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!shouldAnimateNavigation(link, event)) return;

  event.preventDefault();
  closeMenu();

  const destination = getTransitionDestination(link);
  const pointerX = event.clientX > 0 ? event.clientX : window.innerWidth / 2;
  const pointerY = event.clientY > 0 ? event.clientY : window.innerHeight / 2;

  pageTransition.style.setProperty("--transition-x", `${pointerX}px`);
  pageTransition.style.setProperty("--transition-y", `${pointerY}px`);
  pageTransition.style.setProperty("--transition-color", destination.color);

  if (pageTransitionTitle) {
    pageTransitionTitle.textContent = destination.label;
  }

  if (pageTransitionIndex) {
    pageTransitionIndex.textContent = destination.index;
  }

  pageTransition.classList.add("is-active");
  document.body.classList.add("page-is-leaving");

  const transitionDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 720;

  window.setTimeout(() => {
    window.location.href = link.href;
  }, transitionDelay);
});

window.addEventListener("pageshow", () => {
  pageTransition.classList.remove("is-active");
  document.body.classList.remove("page-is-leaving");
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
    caption: "Pembelajaran lapangan dan praktik engineering."
  },
  {
    src: "assets/images/petrocup-award.jpg",
    alt: "Ricvaldy memegang penghargaan Juara 1 PETROCUP Paper Competition 2025",
    caption: "Juara 1 PETROCUP Paper Competition 2025."
  },
  {
    src: "assets/images/research-school-award.jpg",
    alt: "Ricvaldy memegang piala dan sertifikat Juara 2 Research School 2 FK 2025",
    caption: "Juara 2 Research School 2 FK 2025."
  },
  {
    src: "assets/images/ews-final-collaboration.jpg",
    alt: "Tim proyek EWS bersama penjahit setelah implementasi alat sensor",
    caption: "Proyek sensor asistif bersama EWS."
  },
  {
    src: "assets/images/ews-pic-session.jpg",
    alt: "Ricvaldy sebagai PIC EWS dalam diskusi proyek sensor",
    caption: "Koordinasi dan diskusi proyek EWS."
  }
];

if (heroPhotoSlider && heroProfilePhoto && heroPhotoCaption && heroPhotoDots && heroPhotoSlides.length > 1) {
  let activeHeroPhoto = 0;
  let heroPhotoTimer = null;
  let heroPhotoLoading = false;

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
    if (nextIndex === activeHeroPhoto || heroPhotoLoading) return;

    const nextSlide = heroPhotoSlides[nextIndex];
    heroPhotoLoading = true;

    const nextImage = new Image();

    nextImage.addEventListener("load", () => {
      heroPhotoSlider.classList.add("is-changing");

      window.setTimeout(() => {
        heroProfilePhoto.src = nextSlide.src;
        heroProfilePhoto.alt = nextSlide.alt;
        heroPhotoCaption.textContent = nextSlide.caption;
        activeHeroPhoto = nextIndex;
        updateHeroPhotoDots();
        heroPhotoSlider.classList.remove("is-changing");
        heroPhotoLoading = false;
      }, 220);
    }, { once: true });

    nextImage.addEventListener("error", () => {
      heroPhotoLoading = false;
    }, { once: true });

    nextImage.src = nextSlide.src;
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
      if (!document.body.classList.contains("visitor-gate-open")) startHeroPhotoSlider();
    }
  });

  document.addEventListener("portfolio:visitor-ready", startHeroPhotoSlider);
}




const VISITOR_NAME_KEY = "portfolio-visitor-name";
const VISITOR_EMAIL_KEY = "portfolio-visitor-email";
const VISITOR_LIST_KEY = "portfolio-visitor-list";
const PENDING_VISITOR_NAME_KEY = "portfolio-pending-visitor-name";
const PENDING_VISITOR_EMAIL_KEY = "portfolio-pending-visitor-email";
const FIREBASE_VISITOR_COLLECTION = "portfolioVisitors";

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
  return String(name).replace(/\s+/g, " ").trim().slice(0, 28);
}

function cleanVisitorEmail(email) {
  return String(email).replace(/\s+/g, "").trim().toLowerCase().slice(0, 80);
}

function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function maskEmail(email) {
  const cleanEmail = cleanVisitorEmail(email);
  const [name, domain] = cleanEmail.split("@");
  if (!name || !domain) return "email terverifikasi";

  const visibleName = name.length <= 2 ? name[0] || "" : `${name[0]}${name[1]}`;
  return `${visibleName}${"*".repeat(Math.min(Math.max(name.length - visibleName.length, 2), 6))}@${domain}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function readLocalVisitorPayload() {
  const visitors = readVisitorList();

  return {
    visitors,
    count: visitors.length,
    source: "browser ini"
  };
}

function registerLocalVisitor(name, email) {
  const cleanName = cleanVisitorName(name);
  const cleanEmail = cleanVisitorEmail(email);
  if (!cleanName || !isValidEmailFormat(cleanEmail)) return readLocalVisitorPayload();

  const visitors = readVisitorList();
  const existingVisitor = visitors.find((visitor) => cleanVisitorEmail(visitor.email) === cleanEmail);

  if (existingVisitor) {
    existingVisitor.name = cleanName;
    existingVisitor.email = cleanEmail;
    existingVisitor.lastSeenAt = new Date().toISOString();
  } else {
    visitors.unshift({
      name: cleanName,
      email: cleanEmail,
      lastSeenAt: new Date().toISOString()
    });
  }

  const limitedVisitors = visitors.slice(0, 12);
  saveVisitorList(limitedVisitors);
  return readLocalVisitorPayload();
}

function getSavedVisitorName() {
  try {
    return cleanVisitorName(localStorage.getItem(VISITOR_NAME_KEY) || "");
  } catch (error) {
    return "";
  }
}

function getSavedVisitorEmail() {
  try {
    return cleanVisitorEmail(localStorage.getItem(VISITOR_EMAIL_KEY) || "");
  } catch (error) {
    return "";
  }
}

function saveVerifiedVisitorIdentity(name, email) {
  try {
    localStorage.setItem(VISITOR_NAME_KEY, cleanVisitorName(name));
    localStorage.setItem(VISITOR_EMAIL_KEY, cleanVisitorEmail(email));
  } catch (error) {
    return;
  }
}

function savePendingVisitorIdentity(name, email) {
  try {
    localStorage.setItem(PENDING_VISITOR_NAME_KEY, cleanVisitorName(name));
    localStorage.setItem(PENDING_VISITOR_EMAIL_KEY, cleanVisitorEmail(email));
  } catch (error) {
    return;
  }
}

function getPendingVisitorIdentity() {
  try {
    return {
      name: cleanVisitorName(localStorage.getItem(PENDING_VISITOR_NAME_KEY) || ""),
      email: cleanVisitorEmail(localStorage.getItem(PENDING_VISITOR_EMAIL_KEY) || "")
    };
  } catch (error) {
    return { name: "", email: "" };
  }
}

function clearPendingVisitorIdentity() {
  try {
    localStorage.removeItem(PENDING_VISITOR_NAME_KEY);
    localStorage.removeItem(PENDING_VISITOR_EMAIL_KEY);
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

function normalizeVisitorPayload(payload) {
  if (!payload) return readLocalVisitorPayload();
  if (Array.isArray(payload)) {
    return {
      visitors: payload,
      count: payload.length,
      source: "browser ini"
    };
  }

  return {
    visitors: Array.isArray(payload.visitors) ? payload.visitors : [],
    count: Number.isFinite(payload.count) ? payload.count : 0,
    source: payload.source || "browser ini"
  };
}

function renderVisitorBoard(currentVisitorName, payload) {
  if (document.body.dataset.page !== "home") return;

  const heroActions = document.querySelector(".hero-actions");
  if (!heroActions) return;

  const visitorPayload = normalizeVisitorPayload(payload || readLocalVisitorPayload());
  const visitors = visitorPayload.visitors;
  const existingBoard = document.getElementById("visitorBoard");
  const visitorBoard = existingBoard || document.createElement("aside");
  visitorBoard.className = "visitor-board";
  visitorBoard.id = "visitorBoard";

  const visitorItems = visitors.length
    ? visitors.map((visitor) => {
      const meta = visitor.email
        ? `${maskEmail(visitor.email)} - ${formatVisitorTime(visitor.lastSeenAt)}`
        : formatVisitorTime(visitor.lastSeenAt);
      return `<li><span>${escapeHtml(visitor.name)}</span><small>${escapeHtml(meta)}</small></li>`;
    }).join("")
    : "<li><span>Belum ada nama</span><small>-</small></li>";

  visitorBoard.innerHTML = `
    <div>
      <span class="visitor-board-label">Verified Visitor Log</span>
      <strong>${visitorPayload.count} email aktif pernah masuk</strong>
      <p>Halo, ${escapeHtml(currentVisitorName)}. Data pengunjung tersimpan di ${escapeHtml(visitorPayload.source)}.</p>
    </div>
    <ul aria-label="Daftar nama pengunjung terverifikasi">
      ${visitorItems}
    </ul>
  `;

  if (!existingBoard) {
    heroActions.insertAdjacentElement("afterend", visitorBoard);
  }
}

const localVisitorStore = {
  source: "browser ini",
  requiresEmailVerification: false,
  async register(name, email) {
    return registerLocalVisitor(name, email);
  },
  async read() {
    return readLocalVisitorPayload();
  }
};

function getCleanReturnUrl() {
  const returnUrl = new URL(window.location.href);
  returnUrl.search = "";
  returnUrl.hash = "";
  return returnUrl.toString();
}

async function createFirebaseVisitorStore() {
  try {
    const configModule = await import("./firebase-config.js");
    const firebaseConfig = configModule.firebaseConfig;
    const firebaseEnabled = configModule.firebaseEnabled !== false
      && firebaseConfig
      && firebaseConfig.apiKey
      && firebaseConfig.projectId
      && !String(firebaseConfig.apiKey).startsWith("ISI_");

    if (!firebaseEnabled) return null;

    const [appModule, firestoreModule, authModule] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js")
    ]);

    const app = appModule.initializeApp(firebaseConfig);
    const auth = authModule.getAuth(app);
    const db = firestoreModule.getFirestore(app);
    const visitorsCollection = firestoreModule.collection(db, FIREBASE_VISITOR_COLLECTION);

    function getCurrentUserOnce() {
      return new Promise((resolve) => {
        const timeoutId = window.setTimeout(() => {
          unsubscribe();
          resolve(auth.currentUser);
        }, 1500);

        const unsubscribe = authModule.onAuthStateChanged(auth, (user) => {
          window.clearTimeout(timeoutId);
          unsubscribe();
          resolve(user);
        }, () => {
          window.clearTimeout(timeoutId);
          unsubscribe();
          resolve(auth.currentUser);
        });
      });
    }

    async function readFirebaseVisitors() {
      const latestVisitorsQuery = firestoreModule.query(
        visitorsCollection,
        firestoreModule.orderBy("lastSeenAt", "desc"),
        firestoreModule.limit(12)
      );

      const [latestSnapshot, countSnapshot] = await Promise.all([
        firestoreModule.getDocs(latestVisitorsQuery),
        firestoreModule.getCountFromServer(visitorsCollection)
      ]);

      const visitors = latestSnapshot.docs.map((visitorDocument) => {
        const data = visitorDocument.data();
        const lastSeenValue = data.lastSeenAt;
        const lastSeenAt = lastSeenValue && typeof lastSeenValue.toDate === "function"
          ? lastSeenValue.toDate().toISOString()
          : new Date().toISOString();

        return {
          name: cleanVisitorName(String(data.name || "Pengunjung")),
          email: cleanVisitorEmail(String(data.email || "")),
          lastSeenAt
        };
      });

      return {
        visitors,
        count: countSnapshot.data().count || visitors.length,
        source: "Firebase Firestore"
      };
    }

    async function saveFirebaseVisitor(user, name) {
      const cleanName = cleanVisitorName(name);
      const cleanEmail = cleanVisitorEmail(user.email || "");
      if (!user.uid || !cleanName || !isValidEmailFormat(cleanEmail)) {
        throw new Error("Data pengunjung belum valid.");
      }

      const visitorDocument = firestoreModule.doc(db, FIREBASE_VISITOR_COLLECTION, user.uid);
      await firestoreModule.setDoc(visitorDocument, {
        name: cleanName,
        email: cleanEmail,
        lastSeenAt: firestoreModule.serverTimestamp()
      }, { merge: true });

      saveVerifiedVisitorIdentity(cleanName, cleanEmail);
      return readFirebaseVisitors();
    }

    async function sendVisitorEmailLink(name, email) {
      const cleanName = cleanVisitorName(name);
      const cleanEmail = cleanVisitorEmail(email);
      if (!cleanName || !isValidEmailFormat(cleanEmail)) {
        throw new Error("Masukkan nama dan email yang valid.");
      }

      const actionCodeSettings = {
        url: getCleanReturnUrl(),
        handleCodeInApp: true
      };

      await authModule.sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
      savePendingVisitorIdentity(cleanName, cleanEmail);

      return {
        pendingVerification: true,
        email: cleanEmail,
        source: "Firebase Authentication"
      };
    }

    async function completeEmailLinkSignIn() {
      if (!authModule.isSignInWithEmailLink(auth, window.location.href)) return null;

      const pendingVisitor = getPendingVisitorIdentity();
      if (!pendingVisitor.email || !isValidEmailFormat(pendingVisitor.email)) {
        throw new Error("Email verifikasi tidak ditemukan di browser ini. Ulangi proses masuk dari halaman utama.");
      }

      const result = await authModule.signInWithEmailLink(auth, pendingVisitor.email, window.location.href);
      const visitorName = pendingVisitor.name || cleanVisitorName(pendingVisitor.email.split("@")[0]);
      const payload = await saveFirebaseVisitor(result.user, visitorName);
      clearPendingVisitorIdentity();
      window.history.replaceState({}, document.title, window.location.pathname);

      return {
        name: visitorName,
        email: pendingVisitor.email,
        payload
      };
    }

    return {
      source: "Firebase Firestore",
      requiresEmailVerification: true,
      completeEmailLinkSignIn,
      async register(name, email) {
        const cleanEmail = cleanVisitorEmail(email);
        const currentUser = await getCurrentUserOnce();

        if (currentUser && cleanVisitorEmail(currentUser.email || "") === cleanEmail) {
          return saveFirebaseVisitor(currentUser, name);
        }

        return sendVisitorEmailLink(name, email);
      },
      read: readFirebaseVisitors
    };
  } catch (error) {
    console.warn("Firebase visitor verification belum aktif, menggunakan penyimpanan lokal.", error);
    return null;
  }
}

async function hasFirebaseVisitorConfig() {
  try {
    const configModule = await import("./firebase-config.js");
    const firebaseConfig = configModule.firebaseConfig;
    return configModule.firebaseEnabled !== false
      && firebaseConfig
      && firebaseConfig.apiKey
      && firebaseConfig.projectId
      && !String(firebaseConfig.apiKey).startsWith("ISI_");
  } catch (error) {
    return false;
  }
}

let firebaseVisitorStorePromise = null;

async function getFirebaseVisitorStore() {
  if (!firebaseVisitorStorePromise) {
    firebaseVisitorStorePromise = createFirebaseVisitorStore();
  }

  const store = await firebaseVisitorStorePromise;
  if (!store) throw new Error("Layanan verifikasi email sedang tidak tersedia. Coba lagi beberapa saat.");
  return store;
}

const lazyFirebaseVisitorStore = {
  source: "Firebase Firestore",
  requiresEmailVerification: true,
  async completeEmailLinkSignIn() {
    return (await getFirebaseVisitorStore()).completeEmailLinkSignIn();
  },
  async register(name, email) {
    return (await getFirebaseVisitorStore()).register(name, email);
  },
  async read() {
    return (await getFirebaseVisitorStore()).read();
  }
};

let activeVisitorStore = localVisitorStore;

function announceVisitorReady() {
  document.dispatchEvent(new CustomEvent("portfolio:visitor-ready"));
}

function hasEmailLinkParameters() {
  const parameters = new URLSearchParams(window.location.search);
  return parameters.get("mode") === "signIn" && parameters.has("oobCode");
}

async function registerAndRenderVisitor(visitorName, visitorEmail) {
  try {
    const payload = await activeVisitorStore.register(visitorName, visitorEmail);
    if (payload && payload.pendingVerification) return payload;

    renderVisitorBoard(visitorName, payload);
    return { completed: true, payload };
  } catch (error) {
    console.warn("Gagal memproses visitor.", error);
    throw error;
  }
}

function updateVisitorGateStatus(message, tone = "info") {
  const status = document.getElementById("visitorGateStatus");
  if (!status) return;

  status.textContent = message;
  status.hidden = false;
  status.dataset.tone = tone;
}

function showVisitorGate() {
  if (document.getElementById("visitorGate")) return;

  const firebaseMode = activeVisitorStore.requiresEmailVerification;
  const visitorGate = document.createElement("section");
  visitorGate.className = "visitor-gate";
  visitorGate.id = "visitorGate";
  visitorGate.setAttribute("aria-modal", "true");
  visitorGate.setAttribute("role", "dialog");
  visitorGate.setAttribute("aria-labelledby", "visitorGateTitle");
  visitorGate.innerHTML = `
    <form class="visitor-gate-card" id="visitorGateForm">
      <span class="visitor-gate-kicker">Verified Entry</span>
      <h2 id="visitorGateTitle">Masuk dengan email aktif</h2>
      <p>${firebaseMode ? "Isi nama dan email aktif. Link verifikasi akan dikirim ke email kamu sebelum website terbuka." : "Firebase belum aktif, jadi email hanya dicek formatnya di browser ini."}</p>
      <div class="visitor-gate-fields">
        <label for="visitorNameInput">Nama</label>
        <input id="visitorNameInput" name="visitorName" type="text" maxlength="28" autocomplete="name" placeholder="Contoh: Ricvaldy" required />
        <label for="visitorEmailInput">Email aktif</label>
        <input id="visitorEmailInput" name="visitorEmail" type="email" maxlength="80" autocomplete="email" placeholder="nama@email.com" required />
      </div>
      <button class="visitor-gate-submit" type="submit">${firebaseMode ? "Kirim Link Verifikasi" : "Masuk"}</button>
      <p class="visitor-gate-status" id="visitorGateStatus" hidden></p>
      <small>${firebaseMode ? "Email asal-asalan tidak bisa masuk karena harus membuka link dari inbox." : "Aktifkan Firebase Authentication Email Link agar email benar-benar diverifikasi."}</small>
    </form>
  `;

  document.body.appendChild(visitorGate);
  document.body.classList.add("visitor-gate-open");

  const visitorNameInput = document.getElementById("visitorNameInput");
  const visitorGateForm = document.getElementById("visitorGateForm");
  const submitButton = visitorGateForm?.querySelector("button[type='submit']");

  window.setTimeout(() => visitorNameInput?.focus(), 100);

  visitorGateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(visitorGateForm);
    const visitorName = cleanVisitorName(String(formData.get("visitorName") || ""));
    const visitorEmail = cleanVisitorEmail(String(formData.get("visitorEmail") || ""));

    if (!visitorName || !isValidEmailFormat(visitorEmail)) {
      updateVisitorGateStatus("Nama dan email harus valid.", "error");
      return;
    }

    submitButton.disabled = true;
    updateVisitorGateStatus(firebaseMode ? "Mengirim link verifikasi ke email..." : "Memproses data pengunjung...", "info");

    try {
      const result = await registerAndRenderVisitor(visitorName, visitorEmail);

      if (result && result.pendingVerification) {
        updateVisitorGateStatus(`Link verifikasi sudah dikirim ke ${maskEmail(visitorEmail)}. Buka email itu untuk masuk.`, "success");
        submitButton.disabled = false;
        return;
      }

      saveVerifiedVisitorIdentity(visitorName, visitorEmail);
      visitorGate.classList.add("is-leaving");
      window.setTimeout(() => {
        visitorGate.remove();
        document.body.classList.remove("visitor-gate-open");
        announceVisitorReady();
      }, 420);
    } catch (error) {
      updateVisitorGateStatus(error.message || "Gagal memverifikasi email. Coba lagi.", "error");
      submitButton.disabled = false;
    }
  });
}

async function initializeVisitorFeature() {
  const firebaseMode = await hasFirebaseVisitorConfig();
  activeVisitorStore = firebaseMode ? lazyFirebaseVisitorStore : localVisitorStore;

  if (firebaseMode && hasEmailLinkParameters()) {
    try {
      const emailLinkResult = await activeVisitorStore.completeEmailLinkSignIn();
      if (emailLinkResult) {
        renderVisitorBoard(emailLinkResult.name, emailLinkResult.payload);
        announceVisitorReady();
        return;
      }
    } catch (error) {
      showVisitorGate();
      updateVisitorGateStatus(error.message || "Link verifikasi tidak valid. Ulangi proses masuk.", "error");
      return;
    }
  }

  const savedVisitorName = getSavedVisitorName();
  const savedVisitorEmail = getSavedVisitorEmail();

  if (savedVisitorName && isValidEmailFormat(savedVisitorEmail)) {
    if (firebaseMode) {
      renderVisitorBoard(savedVisitorName, readLocalVisitorPayload());
      announceVisitorReady();

      window.setTimeout(async () => {
        try {
          const payload = await activeVisitorStore.read();
          renderVisitorBoard(savedVisitorName, payload);
        } catch (error) {
          console.warn("Daftar pengunjung belum dapat diperbarui.", error);
        }
      }, 2500);
    } else {
      await registerAndRenderVisitor(savedVisitorName, savedVisitorEmail);
      announceVisitorReady();
    }
  } else {
    showVisitorGate();
  }
}

initializeVisitorFeature();
