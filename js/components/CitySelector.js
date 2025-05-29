export const initCitySelector = () => {
  const cityButton = document.querySelector(".location__city");
  const cityList = document.querySelector(".location__sublist");
  const cityName = document.querySelector(".location__city-name");
  const cityLinks = document.querySelectorAll(".location__sublink");

  cityButton.addEventListener("click", () => {
    cityButton.classList.toggle("location__city--active");
  });

  document.addEventListener("click", (event) => {
    if (
      !cityList.contains(event.target) &&
      !cityButton.contains(event.target)
    ) {
      cityButton.classList.remove("location__city--active");
    }
  });

  cityLinks.forEach((link) => {
    link.addEventListener("click", () => {
      cityName.textContent = link.textContent;
      cityButton.classList.remove("location__city--active");
    });
  });
};
