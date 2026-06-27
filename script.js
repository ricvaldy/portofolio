const menuToggle = document.getElementById("menuToggle");
const navPanel = document.getElementById("navPanel");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const revealItems = document.querySelectorAll(".section-reveal, .skill-card, .timeline-item, .achievement-card, .project-card");
const sections = document.querySelectorAll("main section[id]");

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
  navPanel.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
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

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  saveTheme(nextTheme);
});

function updateBackToTop() {
  backToTop.classList.toggle("show", window.scrollY > 500);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

window.addEventListener("scroll", updateBackToTop);
updateBackToTop();

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

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);

        navLinks.forEach((link) => link.classList.remove("active"));
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
