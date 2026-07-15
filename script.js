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
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

document.documentElement.dataset.theme = initialTheme;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    saveTheme(nextTheme);
  });
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

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (!shouldAnimateNavigation(link, event)) return;

  event.preventDefault();
  closeMenu();
  document.body.classList.add("page-is-leaving");

  window.setTimeout(() => {
    window.location.href = link.href;
  }, 320);
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
