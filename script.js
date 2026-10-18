const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("siswa-soft-theme");
let audioContext;

function playClickSound(type = "soft") {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const settings = type === "card" ? { start: 392, end: 523, duration: .12 } : { start: 523, end: 659, duration: .09 };
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(settings.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(settings.end, now + settings.duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.045, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + settings.duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + settings.duration + .02);
  } catch (error) {
    // Audio bersifat opsional; interaksi tetap berjalan jika browser memblokir suara.
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode pagi" : "Aktifkan mode malam");
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-label").textContent = isDark ? "Mode pagi" : "Mode malam";
}

applyTheme(savedTheme || "dark");
themeToggle.addEventListener("click", () => {
  playClickSound();
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("siswa-soft-theme", nextTheme);
  applyTheme(nextTheme);
});

const heroChibi = document.querySelector(".hero-chibi");
if (heroChibi) {
  heroChibi.addEventListener("click", () => {
    playClickSound("card");
    heroChibi.classList.remove("is-waving");
    void heroChibi.offsetWidth;
    heroChibi.classList.add("is-waving");
  });
}

const cards = document.querySelectorAll(".profile-card");
cards.forEach((card) => {
  const favoriteButton = card.querySelector(".favorite-button");
  const detailButton = card.querySelector(".detail-button");
  const hiddenStory = card.querySelector(".hidden-story");

  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--tilt-x", `${(y * -3).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
  favoriteButton.addEventListener("click", () => {
    playClickSound();
    const isFavorite = favoriteButton.getAttribute("aria-pressed") === "true";
    favoriteButton.setAttribute("aria-pressed", String(!isFavorite));
    favoriteButton.textContent = isFavorite ? "♡" : "♥";
  });
  detailButton.addEventListener("click", () => {
    playClickSound();
    const isOpen = card.classList.toggle("is-open");
    detailButton.setAttribute("aria-expanded", String(isOpen));
    hiddenStory.setAttribute("aria-hidden", String(!isOpen));
    detailButton.childNodes[0].textContent = isOpen ? `Tutup deskripsi ${card.dataset.name} ` : `Lihat deskripsi ${card.dataset.name} `;
  });
  card.addEventListener("click", (event) => {
    if (event.target.closest("button, a")) return;
    playClickSound("card");
    card.classList.remove("tap-bounce");
    void card.offsetWidth;
    card.classList.add("tap-bounce");
  });
});

const revealItems = document.querySelectorAll(".profile-card, .learning-note, .stats-strip");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("reveal-ready", "is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}


// Snowfall dibuat ringan dan tanpa gambar eksternal agar aman untuk mobile.
const snowfall = document.createElement("div");
snowfall.className = "snowfall";
snowfall.setAttribute("aria-hidden", "true");
const snowCount = window.matchMedia("(max-width: 560px)").matches ? 16 : 28;
for (let index = 0; index < snowCount; index += 1) {
  const flake = document.createElement("span");
  flake.className = "snowflake";
  flake.style.setProperty("--snow-left", `${Math.random() * 100}%`);
  flake.style.setProperty("--snow-size", `${2 + Math.random() * 4}px`);
  flake.style.setProperty("--snow-duration", `${9 + Math.random() * 8}s`);
  flake.style.setProperty("--snow-delay", `${Math.random() * -16}s`);
  flake.style.setProperty("--snow-opacity", `${.25 + Math.random() * .6}`);
  snowfall.appendChild(flake);
}
document.body.prepend(snowfall);
