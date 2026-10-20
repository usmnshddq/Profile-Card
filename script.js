const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

// Navigasi tab
function showPanel(panelId) {
  panels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });

  tabs.forEach((tab) => {
    const isActive = tab.dataset.panel === panelId;

    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showPanel(tab.dataset.panel);
  });
});

// Tahun copyright otomatis
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ==================================
// BACKGROUND MUSIC
// ==================================

const music = document.getElementById("backgroundMusic");

// Pengaturan musik
const START_MINUTE = 0;
const START_SECOND = 30;
const FADE_IN_DURATION = 30;
const TARGET_VOLUME = 0.3;

const START_TIME = START_MINUTE * 60 + START_SECOND;

let fadeTimer = null;

// Efek fade-in
function fadeInMusic() {
  if (fadeTimer) {
    clearInterval(fadeTimer);
  }

  const steps = 40;
  const interval = (FADE_IN_DURATION * 1000) / steps;
  let step = 0;

  music.volume = 0;

  fadeTimer = setInterval(() => {
    step++;

    music.volume = Math.min(
      TARGET_VOLUME,
      (step / steps) * TARGET_VOLUME
    );

    if (step >= steps) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  }, interval);
}

// Putar musik otomatis saat halaman dibuka
async function startBackgroundMusic() {
  if (!music) return;

  try {
    music.currentTime = START_TIME;
    music.volume = 0;

    await music.play();
    fadeInMusic();
  } catch (error) {
    console.info(
      "Autoplay diblokir browser. Musik mungkin perlu dimulai setelah interaksi pengguna."
    );
  }
}

// Setelah lagu selesai, ulang dari awal (00:00)
if (music) {
  music.loop = false;

  music.addEventListener("ended", async () => {
    if (fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }

    music.currentTime = 0;
    music.volume = TARGET_VOLUME;

    try {
      await music.play();
    } catch (error) {
      console.info("Browser memblokir pemutaran ulang musik.");
    }
  });

  startBackgroundMusic();
}

const avatar = document.querySelector(".avatar");
const photoMessage = document.querySelector("#photoMessage");

let messageTimer;

avatar.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;

  avatar.classList.add("photo-pressed");
});

function showPhotoMessage() {
  avatar.classList.remove("photo-pressed");

  photoMessage.classList.remove("show");

  // Memulai ulang animasi jika foto diklik berkali-kali
  void photoMessage.offsetWidth;

  photoMessage.classList.add("show");

  clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    photoMessage.classList.remove("show");
  }, 1000);
}

avatar.addEventListener("pointerup", (event) => {
  if (event.button !== 0) return;
  showPhotoMessage();
});

avatar.addEventListener("pointercancel", showPhotoMessage);
