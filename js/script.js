document.documentElement.classList.add("js");

// Interações leves: menu, linha do tempo, animações e progresso de leitura.
const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu");
  });
});

// Linha do tempo: mantém um item aberto por vez.
document.querySelectorAll(".timeline-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const currentItem = trigger.closest(".timeline-item");
    const detail = currentItem.querySelector(".timeline-detail");
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";

    document.querySelectorAll(".timeline-trigger").forEach((other) => {
      other.setAttribute("aria-expanded", "false");
      other.querySelector(".timeline-plus").textContent = "+";
      other.closest(".timeline-item").querySelector(".timeline-detail").hidden = true;
    });

    if (willOpen) {
      trigger.setAttribute("aria-expanded", "true");
      trigger.querySelector(".timeline-plus").textContent = "−";
      detail.hidden = false;
    }
  });
});

// Revelação progressiva respeitando a preferência por movimento reduzido.
const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

// Barra de progresso da leitura.
const progressBar = document.querySelector("#progress-bar");
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
}, { passive: true });
