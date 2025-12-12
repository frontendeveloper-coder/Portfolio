// Тема
const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");
  });
}

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

/* -- курсор -- */

class ElegantCursor {
  constructor() {
    this.cursor = null;
    this.cursorDot = null;
    this.cursorHint = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;

    this.isClicking = false;
    this.hintTimeout = null;
    this.lastHintText = '';

    this.init();
  }

  init() {
    // Проверяем, нужно ли включать кастомный курсор
    if (this.shouldDisableCursor()) return;

    this.createCursor();
    this.bindEvents();
    this.animate();

    // Добавляем класс для body
    document.body.classList.add('has-custom-cursor');
  }

  shouldDisableCursor() {
    // Отключаем на мобильных устройствах
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return true;
    }

    // Отключаем если пользователь предпочитает уменьшенное движение
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }

    return false;
  }

  createCursor() {
    // Создаем элементы курсора
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';

    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'cursor-dot';

    this.cursorHint = document.createElement('div');
    this.cursorHint.className = 'cursor-hint';

    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorDot);
    document.body.appendChild(this.cursorHint);
  }

  bindEvents() {
    // Движение мыши
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      // Точечный курсор следует точно за мышью
      this.cursorDot.style.left = this.mouseX + 'px';
      this.cursorDot.style.top = this.mouseY + 'px';

      // Позиция подсказки
      this.cursorHint.style.left = (this.mouseX + 15) + 'px';
      this.cursorHint.style.top = this.mouseY + 'px';
    });

    // Клики
    document.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.cursor.classList.add('click');
      this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1.3)';
    });

    document.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.cursor.classList.remove('click');
      this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Наведение на элементы
    this.setupElementHover();

    // Выход за пределы окна
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.cursorDot.style.opacity = '1';
    });
  }

  setupElementHover() {
    const observer = new MutationObserver(() => {
      this.bindHoverEvents();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальная привязка
    this.bindHoverEvents();
  }

  bindHoverEvents() {
    // Ссылки
    document.querySelectorAll('a').forEach(link => {
      this.setupHover(link, 'link', link.title || (link.href ? 'Перейти' : 'Ссылка'));
    });

    // Кнопки
    document.querySelectorAll('button, [role="button"], .btn, input[type="submit"], input[type="button"]').forEach(btn => {
      this.setupHover(btn, 'hover', btn.title || 'Кнопка');
    });

    // Поля ввода
    document.querySelectorAll('input:not([type="submit"]):not([type="button"]), textarea, select').forEach(input => {
      this.setupHover(input, 'text', 'Введите текст');
    });

    // Изображения
    document.querySelectorAll('img, picture, figure').forEach(img => {
      this.setupHover(img, 'image', img.alt || 'Изображение');
    });

    // Отключенные элементы
    document.querySelectorAll('[disabled], .disabled, :disabled').forEach(el => {
      this.setupHover(el, 'disabled', 'Недоступно');
    });
  }

  setupHover(element, cursorClass, hintText) {
    // Удаляем старые обработчики
    element._mouseEnterHandler && element.removeEventListener('mouseenter', element._mouseEnterHandler);
    element._mouseLeaveHandler && element.removeEventListener('mouseleave', element._mouseLeaveHandler);

    element._mouseEnterHandler = () => {
      this.cursor.classList.add(cursorClass);
      if (hintText && hintText !== '') {
        this.showHint(hintText);
      }
    };

    element._mouseLeaveHandler = () => {
      this.cursor.classList.remove(cursorClass);
      this.hideHint();
    };

    element.addEventListener('mouseenter', element._mouseEnterHandler);
    element.addEventListener('mouseleave', element._mouseLeaveHandler);
  }

  showHint(text) {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
    }

    // Не показываем ту же подсказку снова
    if (this.lastHintText === text && this.cursorHint.classList.contains('visible')) {
      return;
    }

    this.lastHintText = text;
    this.cursorHint.textContent = text;

    // Небольшая задержка перед показом
    this.hintTimeout = setTimeout(() => {
      this.cursorHint.classList.add('visible');
    }, 300);
  }

  hideHint() {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
    }

    this.cursorHint.classList.remove('visible');

    // Очищаем текст после анимации
    setTimeout(() => {
      if (!this.cursorHint.classList.contains('visible')) {
        this.cursorHint.textContent = '';
        this.lastHintText = '';
      }
    }, 200);
  }

  animate() {
    // Плавное следование основного курсора
    const diffX = this.mouseX - this.cursorX;
    const diffY = this.mouseY - this.cursorY;

    // Динамическая скорость следования (быстрее при больших расстояниях)
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const speed = Math.min(0.15, 0.05 + distance * 0.001);

    this.cursorX += diffX * speed;
    this.cursorY += diffY * speed;

    this.cursor.style.left = this.cursorX + 'px';
    this.cursor.style.top = this.cursorY + 'px';

    requestAnimationFrame(() => this.animate());
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Небольшая задержка для лучшего UX
  setTimeout(() => {
    new ElegantCursor();
  }, 100);
});

// Также инициализируем если страница уже загружена
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    new ElegantCursor();
  }, 100);
}


/* Preloader */
window.addEventListener('load', function () {

  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
  }, 1000);

});

// Создаём частицы
window.addEventListener('load', function () {
  const container = document.getElementById('particles');
  const particleCount = 150;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Случайная позиция
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Случайная задержка анимации
    particle.style.animationDelay = `${Math.random() * 5}s`;

    // Случайный размер
    const size = 2 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    container.appendChild(particle);
  }
});

/*
const btnLearnMore = document.getElementById('btnLearnMore');

btnLearnMore.addEventListener('click', function() {
  
})
*/