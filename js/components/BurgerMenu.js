export const initBurgerMenu = () => {
  const catalogButton = document.querySelector(".header__catalog-btn");
  const mainMenu = document.querySelector(".main-menu");
  const closeButton = document.querySelector(".main-menu__close");

  catalogButton.addEventListener("click", () => {
    mainMenu.classList.toggle("main-menu--active");
  });

  document.addEventListener("click", (event) => {
    if (
      !mainMenu.contains(event.target) &&
      !catalogButton.contains(event.target)
    ) {
      mainMenu.classList.remove("main-menu--active");
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      mainMenu.classList.remove("main-menu--active");
    });
  }
};
