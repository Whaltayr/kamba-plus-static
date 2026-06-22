const btnPT = document.getElementById("lang-pt");
const btnEN = document.getElementById("lang-en");

let currentLang = localStorage.getItem("language") || "pt";

/* =========================
   UI DOS BOTÕES
========================= */
function setActiveLanguage(lang) {
  if (!btnPT || !btnEN) return;

  btnPT.classList.remove("is-active");
  btnEN.classList.remove("is-active");
  btnPT.classList.remove("on");
  btnEN.classList.remove("on");

  btnPT.setAttribute("aria-pressed", "false");
  btnEN.setAttribute("aria-pressed", "false");

  if (lang === "pt") {
    btnPT.classList.add("is-active");
    btnPT.classList.add("on");
    btnPT.setAttribute("aria-pressed", "true");
  } else {
    btnEN.classList.add("is-active");
    btnEN.classList.add("on");
    btnEN.setAttribute("aria-pressed", "true");
  }
}

/* =========================
   CARREGAR TRADUÇÃO
========================= */
async function loadLanguage(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    const translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");

      if (!el.dataset.i18nOriginal) {
        el.dataset.i18nOriginal = el.textContent;
      }

      if (translations[key]) {
        el.textContent = translations[key];
      } else {
        el.textContent = el.dataset.i18nOriginal;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");

      if (!el.dataset.i18nOriginalHtml) {
        el.dataset.i18nOriginalHtml = el.innerHTML;
      }

      if (translations[key]) {
        el.innerHTML = translations[key].replace(/\n/g, "<br>");
      } else {
        el.innerHTML = el.dataset.i18nOriginalHtml;
      }
    });

    setActiveLanguage(lang);

    currentLang = lang;
    localStorage.setItem("language", lang);

  } catch (error) {
    console.error("Erro ao carregar idioma:", error);
  }
}

/* =========================
   EVENTOS DOS BOTÕES
========================= */
if (btnPT) {
  btnPT.addEventListener("click", () => {
    loadLanguage("pt");
  });
}

if (btnEN) {
  btnEN.addEventListener("click", () => {
    loadLanguage("en");
  });
}

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
});
