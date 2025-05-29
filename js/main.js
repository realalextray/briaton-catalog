// main.js
import { initBurgerMenu } from "./components/BurgerMenu.js";
import { initCitySelector } from "./components/CitySelector.js";
import { renderProducts } from "./components/RenderProducts.js";
import { initFilters } from "./components/FilterProducts.js";
import { initSort } from "./components/SortProducts.js";
import { initCart } from "./components/Cart.js";
import { initAccordion } from "./components/Accordion.js";
import { initDayProductsSlider } from "./components/DayProductsSlider.js";
import { validateForm } from "./components/ValidateForm.js";
import { initPagination } from "./components/Pagination.js"; // Импорт пагинации


let currentData = [];

initBurgerMenu();
initCitySelector();

window.addEventListener("DOMContentLoaded", () => {
  fetch("./data/data.json")
    .then((response) => response.json())
    .then((data) => {
      currentData = data;

      // Инициализация пагинации
      const { getPaginatedData } = initPagination(currentData, (page) => {
        const paginatedData = getPaginatedData(currentData, page);
        renderProducts(paginatedData);
      });

      // Первоначальная отрисовка товаров
      renderProducts(getPaginatedData(currentData, 1));

      // Инициализация фильтров
      initFilters(currentData, (filteredData) => {
        currentData = filteredData;

        // Обновление пагинации при изменении фильтров
        const { getPaginatedData } = initPagination(currentData, (page) => {
          const paginatedData = getPaginatedData(currentData, page);
          renderProducts(paginatedData);
        });

        // Отображение первой страницы после фильтрации
        renderProducts(getPaginatedData(currentData, 1));
      });

      // Инициализация сортировки
      initSort(currentData, (sortedData) => {
        currentData = sortedData;

        // Обновление пагинации при изменении сортировки
        const { getPaginatedData } = initPagination(currentData, (page) => {
          const paginatedData = getPaginatedData(currentData, page);
          renderProducts(paginatedData);
        });

        // Отображение первой страницы после сортировки
        renderProducts(getPaginatedData(currentData, 1));
      });

      initCart(currentData);
      initAccordion();
      initDayProductsSlider();
      validateForm(); // Инициализация валидации формы
    })
    .catch((error) => {
      console.error("Ошибка загрузки данных:", error);
    });
});
