import { accounts } from "./data";
import { formatDateByLocaleTime } from "./utils";
import {
  currentAccount,
  setCurrentAccount,
  timer,
  setTimer,
  updateUserBankSummaryUI,
} from "./app";

const loginForm = document.querySelector("#logged");
const btnLogin = document.querySelector(".login__btn");
const btnLogout = document.querySelector("#logout__btn");

const containerApp = document.querySelector(".app");

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelTimer = document.querySelector(".timer");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");

btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from submitting

  const currAcc = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  setCurrentAccount(currAcc);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Clear input fields
    inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    }

    setTimer(startLogOutTimer());

    // Update UI
    updateUIAfterLogin(currentAccount);
    updateUserBankSummaryUI(currentAccount);
  }
});

export const startLogOutTimer = function () {
  let time = 120;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); //remainder(rest)

    labelTimer.textContent = `${min}:${sec}`; //template literals//

    if (time === 0) {
      clearInterval(timer); //->set opacity back to 0 === log_out
      updateNavAfterLogout();
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogout.addEventListener("click", updateNavAfterLogout);

function updateUIAfterLogin(currentAccount) {
  const userFirstName = currentAccount.owner.split(" ")[0];

  labelDate.textContent = formatDateByLocaleTime(currentAccount.locale);
  labelWelcome.textContent = `Welcome back, ${userFirstName}`;

  containerApp.style.opacity = 100;
  loginForm.classList.remove("visible");
  loginForm.classList.add("hidden");
  btnLogout.classList.remove("hidden");
  btnLogout.classList.add("visible");
}

function updateNavAfterLogout() {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
  btnLogout.classList.remove("visible");
  btnLogout.classList.add("hidden");
  loginForm.classList.remove("hidden");
  loginForm.classList.add("visible");
}
