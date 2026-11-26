// «Обо мне»: вернуться на главную, в то место, откуда открыли кейс
document.querySelectorAll(".cs-back").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!sessionStorage.getItem("returnTo")) return; // кейс открыли напрямую — идём к блоку «Кейсы»
    event.preventDefault();
    sessionStorage.setItem("restore", "1");
    location.href = "index.html";
  });
});

// Пока ссылка не задана, клик не должен прокручивать страницу наверх
document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

// Плавающая стрелка появляется после начала прокрутки и поднимает наверх
const toTop = document.querySelector(".to-top");
const update = () => toTop.classList.toggle("is-visible", window.scrollY > 300);

toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));
window.addEventListener("scroll", update, { passive: true });
update();
