// Функция для создания модального окна
const createModal = (message, isSuccess) => {
  const existingModal = document.querySelector(".modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal__content";

  const closeButton = document.createElement("button");
  closeButton.className = "modal__close";
  closeButton.textContent = "×";
  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  const iconId = isSuccess ? "icon-done" : "icon-error";
  const iconColor = isSuccess ? "#40BB71" : "#D53A3A";

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("class", "modal__icon");
  icon.setAttribute("fill", iconColor);
  icon.setAttribute("width", "40");
  icon.setAttribute("height", "40");
  icon.setAttribute("aria-hidden", "true");

  const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
  useElement.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `images/sprite.svg#${iconId}`);

  icon.appendChild(useElement);
  modalContent.appendChild(icon);

  const messageTitle = document.createElement("p");
  messageTitle.className = "modal__message";
  messageTitle.textContent = isSuccess ? "Благодарим за обращение!" : "Не удалось отправить обращение";

  const messageDesc = document.createElement("p");
  messageDesc.className = "modal__message-alert";
  messageDesc.textContent = isSuccess ? "Мы получили вашу заявку и свяжемся с вами в ближайшее время." : "Что-то пошло не так, попробуйте отправить форму ещё раз. Если ошибка повторится — свяжитесь со службой поддержки.";

  modalContent.appendChild(closeButton);
  modalContent.appendChild(messageTitle);
  modalContent.appendChild(messageDesc);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  setTimeout(() => {
    modal.remove();
  }, 5000);
};

// Функция для валидации и отправки формы
export const validateForm = () => {
  const form = document.querySelector(".questions__form");
  if (!form) {
    console.error("Форма .questions__form не найдена!");
    return;
  }

  if (form.dataset.validated) {
    return; // Предотвращаем повторную инициализацию
  }
  form.dataset.validated = "true";

  const validator = new JustValidate(form, {
    errorFieldCssClass: "custom-input__field--error",
    errorLabelCssClass: "custom-input__label--error",
    successFieldCssClass: "custom-input__field--success",
    successLabelCssClass: "custom-input__label--success",
    focusInvalidField: true,
    lockForm: true,
    validateBeforeSubmitting: true,
  });

  validator
    .addField("#name", [
      { rule: "required", errorMessage: "Пожалуйста, введите ваше имя" },
      { rule: "minLength", value: 3, errorMessage: "Имя должно содержать минимум три символа" },
      { rule: "maxLength", value: 20, errorMessage: "Имя должно содержать максимум двадцать символов" },
    ])
    .addField("#email", [
      { rule: "required", errorMessage: "Пожалуйста, введите вашу почту" },
      { rule: "email", errorMessage: "Пожалуйста, введите корректный email" },
    ])
    .addField("#agree", [
      { rule: "required", errorMessage: "Необходимо согласие с политикой конфиденциальности" },
    ])
    .onSuccess(async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);

      try {
        const response = await fetch("https://httpbin.org/post", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        createModal("Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.", true);
        event.target.reset();
      } catch (error) {
        console.error("Ошибка отправки формы:", error);
        createModal("Не удалось отправить форму. Попробуйте ещё раз.", false);
      }
    });

  form.addEventListener("submit", (event) => {
    if (!validator.isValid) {
      event.preventDefault();
    }
  });
};

// Вызываем валидацию формы после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  validateForm();
});
