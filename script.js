const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const contactButton = document.getElementById("contactButton");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

contactButton.addEventListener("click", () => {
  alert("Terima kasih! Kamu bisa mengganti pesan ini dengan email atau link WhatsApp.");
});
