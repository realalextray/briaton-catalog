// sortProducts.js

// Функция для сортировки товаров
export function sortProducts(products, sortType) {
    switch (sortType) {
      case 'price-min':
        // Сортировка по возрастанию цены (new price)
        return [...products].sort((a, b) => a.price.new - b.price.new);
      case 'price-max':
        // Сортировка по убыванию цены (new price)
        return [...products].sort((a, b) => b.price.new - a.price.new);
      case 'rating-max':
        // Сортировка по убыванию рейтинга
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        // Если тип сортировки не указан, возвращаем исходный массив
        return products;
    }
  }
  
  // Функция для инициализации сортировки
  export function initSort(data, onSortChange) {
    const sortSelect = document.querySelector('.catalog__sort-select');
  
    // Обработчик изменения сортировки
    sortSelect.addEventListener('change', (event) => {
      const sortType = event.target.value; // Получаем выбранный тип сортировки
      const sortedData = sortProducts(data, sortType); // Сортируем данные
      onSortChange(sortedData); // Вызываем callback с отсортированными данными
    });
  }