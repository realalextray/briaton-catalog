// pagination.js

export function initPagination(data, onPageChange, itemsPerPage = 9) {
  const paginationContainer = document.querySelector(".catalog__pagination");
  const catalogSection = document.querySelector(".catalog"); // Находим секцию "catalog"
  let currentPage = 1;

  // Функция для обновления пагинации
  function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = ""; // Очищаем контейнер пагинации

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = `
          <li class="catalog__pagination-item">
            <button class="catalog__pagination-link ${
              i === currentPage ? "active" : ""
            }" data-page="${i}">${i}</button>
          </li>
        `;
      paginationContainer.insertAdjacentHTML("beforeend", pageButton);
    }

    // Добавляем обработчики событий для кнопок пагинации
    const paginationButtons = document.querySelectorAll(
      ".catalog__pagination-link"
    );
    paginationButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        currentPage = parseInt(event.target.dataset.page, 10);
        onPageChange(currentPage);

        // Плавная прокрутка к секции "catalog"
        if (catalogSection) {
          catalogSection.scrollIntoView({
            behavior: "smooth", // Плавная прокрутка
            block: "start", // Прокрутка к началу элемента
          });
        }

        updatePagination(totalItems); // Обновляем активную страницу
      });
    });
  }

  // Функция для получения данных для текущей страницы
  function getPaginatedData(data, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Инициализация пагинации
  updatePagination(data.length);

  // Возвращаем функцию для получения данных текущей страницы
  return {
    getPaginatedData,
    updatePagination,
  };
}
