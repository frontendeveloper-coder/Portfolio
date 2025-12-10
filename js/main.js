const toggle = document.getElementById("theme-toggle");

// Добавляем слушатель события 'change' (когда переключили)
toggle.addEventListener("change", () => {
  // При каждом изменении состояния, переключаем класс 'dark-theme' на body
  document.body.classList.toggle("dark-theme");
});
