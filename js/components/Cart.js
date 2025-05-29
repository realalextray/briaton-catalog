// Глобальная переменная для хранения товаров в корзине
let cartItems = [];

// Функция загрузки корзины из localStorage
function loadCartFromStorage() {
  try {
    const storedCart = localStorage.getItem('cart');
    cartItems = storedCart ? JSON.parse(storedCart) : [];
    
    // Если данные не в массиве, сбрасываем их
    if (!Array.isArray(cartItems)) {
      cartItems = [];
      localStorage.removeItem('cart'); // Удаляем битые данные
    }
  } catch (error) {
    console.error('Ошибка при загрузке корзины:', error);
    cartItems = [];
    localStorage.removeItem('cart'); // Очищаем поврежденные данные
  }
}

// Функция сохранения корзины в localStorage
function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Функция добавления товара в корзину
export function addToCart(product) {
  const cartItem = {
    ...product,
    cartId: Date.now(), // Уникальный идентификатор товара
  };

  cartItems.push(cartItem);
  saveCartToStorage();
  updateCartUI();
}

// Функция удаления товара из корзины
export function removeFromCart(cartId) {
  cartItems = cartItems.filter((item) => item.cartId !== cartId);
  saveCartToStorage();
  updateCartUI();
}

// Функция обновления интерфейса корзины
function updateCartUI() {
  const cartCount = document.querySelector('.header__user-count');
  const basketList = document.querySelector('.basket__list');
  const emptyBlock = document.querySelector('.basket__empty-block');
  const basketLink = document.querySelector('.basket__link');

  if (!basketList || !cartCount || !emptyBlock || !basketLink) return;

  // Обновляем счетчик товаров в корзине
  cartCount.textContent = cartItems.length;

  // Очищаем список перед добавлением товаров
  basketList.innerHTML = '';

  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      const basketItem = document.createElement('li');
      basketItem.classList.add('basket__item');

      basketItem.innerHTML = `
        <div class="basket__img">
          <img src="${item.image}" alt="${item.name}" height="60" width="60">
        </div>
        <span class="basket__name">${item.name}</span>
        <span class="basket__price">${item.price.new} руб</span>
        <button class="basket__item-close" type="button" data-cart-id="${item.cartId}">
          <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
            <use xlink:href="images/sprite.svg#icon-close"></use>
          </svg>
        </button>
      `;

      basketList.appendChild(basketItem);
    });

    emptyBlock.style.display = 'none';
    basketLink.style.display = 'block';
  } else {
    emptyBlock.style.display = 'block';
    basketLink.style.display = 'none';
  }

  // Подключаем обработчики удаления
  reconnectRemoveButtons();
}

// Функция подключения обработчиков кнопок удаления
function reconnectRemoveButtons() {
  document.querySelectorAll('.basket__item-close').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const cartId = parseInt(event.currentTarget.dataset.cartId, 10);

      if (!isNaN(cartId)) {
        removeFromCart(cartId);
      }
    });
  });
}

// Функция открытия/закрытия корзины
function toggleCart() {
  const basket = document.querySelector('.basket');
  if (basket) {
    basket.classList.toggle('basket--active');
  }
}

// Функция инициализации корзины
export function initCart(currentData) {
  loadCartFromStorage();
  updateCartUI();

  // Кнопка открытия/закрытия корзины
  const cartToggle = document.querySelector('#cart-toggle');
  if (cartToggle) {
    cartToggle.addEventListener('click', (event) => {
      event.preventDefault();
      toggleCart();
    });
  }

  // Кнопки добавления товара в корзину
  document.querySelectorAll('.product-card__link.btn--icon').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();

      const productCard = button.closest('.product-card');
      const productId = parseInt(productCard.dataset.productId, 10);
      const product = getProductById(productId, currentData);

      if (product) {
        addToCart(product);
      }
    });
  });
}

// Функция поиска товара по ID
export function getProductById(productId, currentData) {
  return currentData.find((product) => product.id === productId);
}
