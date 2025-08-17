
document.addEventListener("DOMContentLoaded", function () {
  const sidePanel = document.getElementById("sidePanel");
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const overlay = document.getElementById("overlay");
  const navLinks = document.querySelectorAll(".nav-link");
  const yearEl = document.getElementById("year");

  
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  function openPanel() {
    sidePanel.classList.add("open");
    overlay.classList.add("show");
    overlay.hidden = false;
    sidePanel.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closePanel() {
    sidePanel.classList.remove("open");
    overlay.classList.remove("show");
    // keep overlay in DOM briefly to allow transition
    setTimeout(() => overlay.hidden = true, 250);
    sidePanel.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanel();
  });

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // Smooth scroll to anchors
      e.preventDefault();
      const href = e.target.getAttribute("href");
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      closePanel();
    });
  });

  
  const header = document.querySelector(".site-header");
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const sc = window.scrollY;
    if (sc > 8) {
      header.style.boxShadow = "0 6px 20px rgba(0,0,0,0.45)";
    } else {
      header.style.boxShadow = "none";
    }
    lastScroll = sc;
  });
});
