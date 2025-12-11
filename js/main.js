// Тема
const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
  });
}

// ============= РАБОЧИЙ GOOGLE TRANSLATE =============

// Функция установки языка Google Translate
function setGoogleTranslateLanguage(lang) {
  const select = document.querySelector(".goog-te-combo");
  if (!select) {
    // Если переводчик не загрузился – пробуем снова
    setTimeout(() => setGoogleTranslateLanguage(lang), 300);
    return;
  }

  select.value = lang; // Выбираем язык
  select.dispatchEvent(new Event("change")); // Запускаем перевод
}

// Когда меняется наш селектор языков
document.querySelector(".language-select").addEventListener("change", (e) => {
  let lang = e.target.value;

  if (lang === "cn") lang = "zh-CN"; // фикс китайского

  setGoogleTranslateLanguage(lang);
});

// Принудительная загрузка Google Translate заранее
window.addEventListener("load", () => {
  setTimeout(() => {
    setGoogleTranslateLanguage("en"); // чтобы всё инициализировалось
  }, 1000);
});


function translatePage(lang) {
  const url = window.location.href;
  window.location.href =
    "https://translate.google.com/translate?sl=auto&tl=" +
    lang +
    "&u=" +
    encodeURIComponent(url);
}

document.querySelector(".language-select").addEventListener("change", (e) => {
  let lang = e.target.value;

  if (lang === "cn") lang = "zh-CN";

  translatePage(lang);
});
