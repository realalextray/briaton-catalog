// js/components/accordion.js

export const initAccordion = () => {
  const accordionElements = document.querySelectorAll(".accordion__element");

  if (accordionElements.length > 0) {
    accordionElements.forEach((element) => {
      const btn = element.querySelector(".accordion__btn");
      const content = element.querySelector(".accordion__content");

      if (!btn || !content) {
        console.error("Не найдены кнопка или контент аккордеона");
        return;
      }

      btn.addEventListener("click", () => {
        // Закрываем все открытые элементы аккордеона, кроме текущего
        accordionElements.forEach((el) => {
          if (el !== element) {
            el.classList.remove("active");
            el.querySelector(".accordion__content").style.maxHeight = "0";
            el.querySelector(".accordion__content").style.opacity = "0";
          }
        });

        // Открываем/закрываем текущий элемент
        if (element.classList.contains("active")) {
          // Закрываем текущий элемент
          element.classList.remove("active");
          content.style.maxHeight = "0";
          content.style.opacity = "0";
        } else {
          // Открываем текущий элемент
          element.classList.add("active");
          content.style.maxHeight = `${content.scrollHeight}px`;
          content.style.opacity = "1";
        }
      });
    });
  } else {
    console.error("Элементы аккордеона не найдены");
  }
};
