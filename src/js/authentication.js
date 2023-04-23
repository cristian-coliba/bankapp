import { accounts } from "./data";
import {
  currentAccount,
  setCurrentAccount,
  timer,
  setTimer,
  updateUI,
} from "./app";

const loggedIn = document.querySelector("#logged");
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
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    loggedIn.style.opacity = 0;

    btnLogout.classList.remove("hidden");
    btnLogout.classList.add("visible");

    const now01 = new Date();

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric", //'long' for display luna in litere, gen November; can set also -> '2-digit'
      year: "numeric", //or '2-digit' can be set
    };

    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now01);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) {
      clearInterval(timer);
    }

    setTimer(startLogOutTimer());

    // Update UI
    updateUI(currentAccount);
  }
});

export const startLogOutTimer = function () {
  let time = 100;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0); //remainder(rest)

    //in each call,print remaining time in UI
    labelTimer.textContent = `${min}:${sec}`; //template literals//

    //When time is at positio 0 -> stop timer and log out user
    if (time === 0) {
      clearInterval(timer); //->set opacity back to 0 === log_out
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      loggedIn.style.opacity = 100;
    }
    //Decrease 1 sec
    time--;
  };
  //Set time to 5 min
  //Call the time every sec(tikTak)
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

btnLogout.addEventListener("click", function () {
  containerApp.style.opacity = 0;
  loggedIn.style.opacity = 100;
  btnLogout.classList.remove("visible");
  btnLogout.classList.add("hidden");
});
