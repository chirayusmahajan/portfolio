const body = document.body;
const header = document.querySelector(".site-header");
const progress = document.querySelector(".progress span");
const topButton = document.querySelector(".to-top");
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
const dialog = document.querySelector(".command-dialog");
const dialogInput = dialog.querySelector("input");

function setTheme(theme) {
  body.classList.toggle("light", theme === "light");
  themeButton.textContent = theme === "light" ? "☾" : "☼";
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${theme === "light" ? "dark" : "light"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "light" ? "#f7f9fc" : "#0b1020";
  localStorage.setItem("portfolio-theme", theme);
}
setTheme(localStorage.getItem("portfolio-theme") || "light");
themeButton.addEventListener("click", () =>
  setTheme(body.classList.contains("light") ? "dark" : "light"),
);

addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
    header.classList.toggle("scrolled", scrollY > 10);
    topButton.classList.toggle("show", scrollY > 650);
  },
  { passive: true },
);
topButton.addEventListener("click", () =>
  scrollTo({ top: 0, behavior: "smooth" }),
);

menuButton.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }),
);

document.querySelectorAll(".details-toggle").forEach((button) =>
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    const open = details.classList.toggle("open");
    button.setAttribute("aria-expanded", open);
    button.firstChild.textContent = open
      ? "Hide key outcomes "
      : "View key outcomes ";
    button.querySelector("span").textContent = open ? "−" : "+";
  }),
);

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

const metricObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      metricObserver.unobserve(el);
      const target = +el.dataset.count,
        duration = 900,
        start = performance.now();
      const update = (now) => {
        const amount = Math.min(1, (now - start) / duration);
        el.textContent = `${el.dataset.prefix || ""}${Math.round(target * amount)}${el.dataset.suffix || ""}`;
        if (amount < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }),
  { threshold: 0.7 },
);
document
  .querySelectorAll("[data-count]")
  .forEach((item) => metricObserver.observe(item));

const typed = document.querySelector("#typed");
const phrases = [
  "I design cloud-native systems.",
  "I build product architecture.",
  "I improve developer workflows.",
];
let word = 0,
  letter = 0,
  deleting = false;
function type() {
  const phrase = phrases[word];
  typed.textContent = phrase.slice(0, letter);
  if (!deleting && letter < phrase.length) {
    letter++;
    setTimeout(type, 48);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1700);
  } else if (letter) {
    letter--;
    setTimeout(type, 28);
  } else {
    deleting = false;
    word = (word + 1) % phrases.length;
    setTimeout(type, 320);
  }
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) type();
else typed.textContent = phrases[0];

function openDialog() {
  dialog.classList.add("open");
  dialog.setAttribute("aria-hidden", "false");
  setTimeout(() => dialogInput.focus(), 20);
}
function closeDialog() {
  dialog.classList.remove("open");
  dialog.setAttribute("aria-hidden", "true");
}
document.querySelector(".command-hint").addEventListener("click", openDialog);
addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    dialog.classList.contains("open") ? closeDialog() : openDialog();
  }
  if (event.key === "Escape") closeDialog();
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeDialog));
dialogInput.addEventListener("input", (event) => {
  const q = event.target.value.toLowerCase();
  dialog
    .querySelectorAll(".command-options a")
    .forEach(
      (link) => (link.hidden = !link.textContent.toLowerCase().includes(q)),
    );
});
document.querySelector("#year").textContent = new Date().getFullYear();
