// Раскрытие разделов по клику на заголовок
document.querySelectorAll(".acc__toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.closest(".acc").classList.toggle("is-open", open);
    document.getElementById(button.getAttribute("aria-controls")).inert = !open;
    updateNav();
  });
});

// Пока ссылки не заданы (href="#"), клик не должен прокручивать страницу наверх
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

// Подсветка текущего раздела в нижней навигации
const cases = document.getElementById("cases");
const aboutLink = document.querySelector('.nav a[href="#about"]');
const casesLink = document.querySelector('.nav a[href="#cases"]');

function updateNav() {
  const inCases = cases.getBoundingClientRect().top < window.innerHeight / 2;
  [[aboutLink, !inCases], [casesLink, inCases]].forEach(([link, active]) => {
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
}

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("resize", updateNav);
document.querySelector(".sections").addEventListener("transitionend", updateNav);
updateNav();

// Перед переходом в кейс запоминаем место и открытые разделы, чтобы вернуться ровно туда
document.querySelectorAll("a[data-case]").forEach((link) => {
  link.addEventListener("click", () => {
    const open = [...document.querySelectorAll('.acc__toggle[aria-expanded="true"]')]
      .map((button) => button.getAttribute("aria-controls"));
    sessionStorage.setItem("returnTo", JSON.stringify({ y: window.scrollY, open }));
  });
});

function restorePosition() {
  const saved = sessionStorage.getItem("returnTo");
  const fromHistory = performance.getEntriesByType("navigation")[0]?.type === "back_forward";
  if (!saved || !(sessionStorage.getItem("restore") || fromHistory)) return;
  sessionStorage.removeItem("restore");

  const { y, open } = JSON.parse(saved);
  const root = document.documentElement;
  root.classList.add("no-motion"); // открываем разделы и прокручиваем без анимации
  open.forEach((id) => {
    const button = document.querySelector(`.acc__toggle[aria-controls="${id}"]`);
    if (button && button.getAttribute("aria-expanded") !== "true") button.click();
  });
  window.scrollTo(0, y);
  updateNav();
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("no-motion")));
}

window.addEventListener("load", restorePosition);

// Мобильная версия: показать остальные задачи в карточке кейса
document.querySelectorAll(".table-more").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.closest(".table-wrap").classList.toggle("is-expanded");
    button.setAttribute("aria-expanded", String(open));
    button.textContent = open ? "Свернуть задачи" : button.dataset.more;
  });
});