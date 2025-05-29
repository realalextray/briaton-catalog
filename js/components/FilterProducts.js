// filterProducts.js

export function initFilters(data, onFilterChange) {
  const filterForm = document.querySelector(".catalog-form");
  const resetButton = document.querySelector(".catalog-form__reset");
  const typeFilters = document.querySelectorAll(
    '.custom-checkbox__field[name="type"]'
  );
  const statusFilters = document.querySelectorAll(
    '.custom-radio__field[name="status"]'
  );

  function updateFilterCounts(products) {
    typeFilters.forEach((filter) => {
      const type = filter.value;
      const countElement = filter
        .closest(".custom-checkbox")
        ?.querySelector(".custom-checkbox__count");

      

      const count = products.filter((product) => {
        const matchesType = product.type.includes(type);
        const matchesOtherFilters = checkOtherFilters(product);
        return matchesType && matchesOtherFilters;
      }).length;

      countElement.textContent = count;
    });
  }

  function checkOtherFilters(product) {
    const selectedStatus = Array.from(statusFilters).find(
      (filter) => filter.checked
    )?.value;
    const isAvailable =
      selectedStatus === "all-item" ||
      checkAvailability(product, selectedStatus === "instock");
    return isAvailable;
  }

  filterForm.addEventListener("change", () => {
    const filteredData = filterProducts(data);
    onFilterChange(filteredData);
    updateFilterCounts(data);
  });

  resetButton.addEventListener("click", () => {
    typeFilters.forEach((filter) => (filter.checked = false));
    statusFilters.forEach((filter) => {
      if (filter.value === "all-item") filter.checked = true;
    });

    onFilterChange(data);
    updateFilterCounts(data);
  });

  function filterProducts(products) {
    return products.filter((product) => {
      const selectedTypes = Array.from(typeFilters)
        .filter((filter) => filter.checked)
        .map((filter) => filter.value);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) => product.type.includes(type));

      const selectedStatus = Array.from(statusFilters).find(
        (filter) => filter.checked
      )?.value;
      const isAvailable =
        selectedStatus === "all-item" ||
        checkAvailability(product, selectedStatus === "instock");

      return matchesType && isAvailable;
    });
  }

  function checkAvailability(product, checkStock) {
    if (!checkStock) return true;
    const selectedCity =
      document.querySelector(".city-selector")?.value || "moscow";
    return product.availability[selectedCity] > 0;
  }

  updateFilterCounts(data);
}
