//로그인 버튼

const loginBtn = document.querySelector(".loginBtn");
const loginclose = document.querySelector(".btn-close");
const loginPopup = document.querySelector(".login__popup");

loginBtn.addEventListener("click", () => {
    loginPopup.classList.add("open");
})

loginclose.addEventListener("click", () => {
    loginPopup.classList.remove("open");
})