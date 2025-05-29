import { addToCart, getProductById } from './Cart.js';

// Функция для создания карточки товара
const createProductCard = (product) => {
  return `
    <li class="day-products__item swiper-slide">
      <div class="product-card product-card--small" data-product-id="${product.id}">
        <div class="product-card__visual">
          <img class="product-card__img" src="${product.image}" height="344" width="290" alt="${product.name}">
          <div class="product-card__more">
            <button class="product-card__link btn btn--icon" data-id="${product.id}">
              <span class="btn__text">В корзину</span>
              <svg width="24" height="24" aria-hidden="true">
                <use xlink:href="images/sprite.svg#icon-basket"></use>
              </svg>
            </button>
            <a href="#" class="product-card__link btn btn--secondary">
              <span class="btn__text">Подробнее</span>
            </a>
          </div>
        </div>
        <div class="product-card__info">
          <h2 class="product-card__title">${product.name}</h2>
          <span class="product-card__old">
            <span class="product-card__old-number">${product.price.old.toLocaleString()}</span>
            <span class="product-card__old-add">₽</span>
          </span>
          <span class="product-card__price">
            <span class="product-card__price-number">${product.price.new.toLocaleString()}</span>
            <span class="product-card__price-add">₽</span>
          </span>
          <div class="product-card__tooltip tooltip">
            <button class="tooltip__btn" aria-label="Показать подсказку">
              <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
                <use xlink:href="images/sprite.svg#icon-i"></use>
              </svg>
            </button>
            <div class="tooltip__content">
              <span class="tooltip__text">Наличие товара по городам:</span>
              <ul class="tooltip__list">
                <li class="tooltip__item">Москва: <span class="tooltip__count">${product.availability.moscow}</span></li>
                <li class="tooltip__item">Оренбург: <span class="tooltip__count">${product.availability.orenburg}</span></li>
                <li class="tooltip__item">Санкт-Петербург: <span class="tooltip__count">${product.availability.saintPetersburg}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
};

// Функция для инициализации тултипов (показ при наведении)
const initializeTooltips = () => {
  document.querySelectorAll(".tooltip").forEach((tooltip) => {
    const btn = tooltip.querySelector(".tooltip__btn");
    const content = tooltip.querySelector(".tooltip__content");

    if (btn && content) {
      btn.addEventListener("mouseover", () => {
        content.classList.add("visible");
      });

      btn.addEventListener("mouseleave", () => {
        content.classList.remove("visible");
      });

      // Дополнительно: скрываем тултип, если курсор уходит с контента
      content.addEventListener("mouseleave", () => {
        content.classList.remove("visible");
      });
    }
  });
};

// Функция для инициализации слайдера
export const initDayProductsSlider = () => {
  const sliderContainer = document.querySelector('.day-products__slider');
  const sliderList = document.querySelector('.day-products__list');

  if (sliderContainer && sliderList) {
    fetch('./data/data.json')
      .then((response) => response.json())
      .then((data) => {
        const dayProducts = data.filter((product) => product.goodsOfDay);

        sliderList.innerHTML = '';
        dayProducts.forEach((product) => {
          sliderList.insertAdjacentHTML('beforeend', createProductCard(product));
        });

        // Инициализация Swiper
        const swiper = new Swiper(sliderContainer, {
          loop: false,
          slidesPerView: 4,
          spaceBetween: 20,
          navigation: {
            nextEl: '.day-products__navigation-btn--next',
            prevEl: '.day-products__navigation-btn--prev',
          },
          breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          },
        });

        swiper.on('slideChange', () => {
          const prevButton = document.querySelector('.day-products__navigation-btn--prev');
          const nextButton = document.querySelector('.day-products__navigation-btn--next');

          prevButton.disabled = swiper.isBeginning;
          nextButton.disabled = swiper.isEnd;
        });

        // Добавляем обработчик для кнопок "В корзину"
        document.querySelectorAll('.product-card__link.btn--icon').forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = parseInt(button.getAttribute('data-id'), 10);
            const product = getProductById(productId, data);
            if (product) {
              addToCart(product);
            }
          });
        });

        // Инициализируем тултипы после загрузки товаров
        initializeTooltips();
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error);
      });
  }
};

// Запускаем инициализацию тултипов при загрузке страницы
document.addEventListener("DOMContentLoaded", initializeTooltips);
