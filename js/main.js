/* Preloader */
window.addEventListener('load', function () {

  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    // Добавляем специальный класс только для прелоадера (не трогаем глобальный .hidden)
    preloader.classList.add('preloader--hidden');
    // Удалим элемент из DOM после окончания анимации opacity
    preloader.addEventListener(
      'transitionend',
      (e) => {
        if (e.propertyName !== 'opacity') return;
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
      },
      { once: true }
    );
  }, 1000);

});

// Тема
const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
  });
}

// Подгоняем отступ у body под фиксированный header, чтобы контент не уходил под него
function adjustBodyPaddingForHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const height = header.offsetHeight;
  document.body.style.paddingTop = height + 'px';
}

window.addEventListener('load', adjustBodyPaddingForHeader);
window.addEventListener('resize', adjustBodyPaddingForHeader);

const elements = {
  about: document.querySelector('a[href="#header"]'),
  skills: document.querySelector('a[href="#mySkills"]'),
  contact: document.querySelector('a[href="#footer"]'),
  welcome: document
    .querySelector(".text-user-name")
    .parentNode.querySelector("h1"),
  profession: document.querySelector(".main-welcome h2"),
  learnMore: document.querySelector(".btn-primary"),
};

async function loadTranslation(lang) {
  if (lang === "🇨🇳") lang = "cn";
  const res = await fetch(`translations/${lang}.json`);
  const translations = await res.json();

  for (let key in elements) {
    elements[key].textContent = translations[key];
  }
}

document.querySelector(".language-select").addEventListener("change", (e) => {
  loadTranslation(e.target.value);
});

// Загрузка языка по умолчанию
loadTranslation("en");


// Эффект печатающей машинки
const element = document.querySelector("#typeWriter .text-user-name");
const text = element.textContent.trim();
element.textContent = ""; // очищаем span для анимации
let index = 0;

function typeWriter() {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    index++;
    setTimeout(typeWriter, 100); // скорость печати
  }
}

typeWriter();



// Функция для создания частиц в заданном контейнере
function createParticles(containerId, particleCount = 100, opts = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Случайная позиция
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Случайная задержка анимации
    particle.style.animationDelay = `${Math.random() * (opts.maxDelay || 5)}s`;

    // Размер
    const minSize = opts.minSize || 1;
    const maxSize = opts.maxSize || 4;
    const size = minSize + Math.random() * (maxSize - minSize);
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    if (opts.className) particle.classList.add(opts.className);
    container.appendChild(particle);
  }
}

// Создаем частицы для прелоадера и для фонового слоя
window.addEventListener('load', function () {
  createParticles('particles', 150, { minSize: 2, maxSize: 5, maxDelay: 5 });
  createParticles('bg-particles', 80, { minSize: 1, maxSize: 3, maxDelay: 8 });
});

/*
const btnLearnMore = document.getElementById('btnLearnMore');

btnLearnMore.addEventListener('click', function() {
  
})
*/