const login = document.querySelector(".user-list__login");
const modalWindow = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__cross-icon");
const overlay = document.querySelector("#overlay-modal");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const inputCheck = document.querySelectorAll(".modal__check-icon");
const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
const PASSWORD_REGEXP = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/iu;

eventListeners();

function eventListeners () {
  login.addEventListener("click", openModalWindow);
  modalClose.addEventListener("click",closeModalWindow);
  document.addEventListener("keydown", closeModal);
  emailInput.addEventListener("input", checkEmail);
  passwordInput.addEventListener("input", checkPassword);
}

function openModalWindow () {
  modalWindow.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(e) {
  if (e.which === 27 || e.which === 13) {
    e.stopPropagation();
    modalWindow.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function closeModalWindow () {
  modalWindow.classList.remove("active");
  overlay.classList.remove("active");
}

function validateEmail(value) {
  return EMAIL_REGEXP.test(value);
}

function validatePassword(value) {
  return PASSWORD_REGEXP.test(value);
}

function checkEmail() {
  let email = emailInput.value;
  if(validateEmail(email)) {
    inputCheck[0].classList.add("active");
  } else {
    inputCheck[0].classList.remove("active");
  }

  email = "";
}

function checkPassword() {
  let password = passwordInput.value;

  if(validatePassword(password) && password.length >= 8) {
    inputCheck[1].classList.add("active");
  } else {
    inputCheck[1].classList.remove("active");
  }
    password = "";
}

