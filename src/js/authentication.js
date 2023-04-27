import { accounts } from "./data";
import { formatDateByLocaleTime, validateEmail } from "./utils";
import {
  currentAccount,
  setCurrentAccount,
  timer,
  setTimer,
  updateUserBankSummaryUI,
} from "./app";

const authenticationButtons = document.querySelector(
  "#authentication__buttons"
);
const modalLogin = document.querySelector("#modal__login");

const modalSignup = document.querySelector("#modal__signup");
const btnSignup = document.querySelector(".signup__btn");

const btnLogin = document.querySelector(".login__btn");
const btnLogout = document.querySelector("#logout__btn");

const containerApp = document.querySelector(".app");

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelTimer = document.querySelector(".timer");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");

const inputSignupFirstName = document.querySelector(
  ".signup__input--firstName"
);
const inputSignupLastName = document.querySelector(".signup__input--lastName");
const inputSignupEmail = document.querySelector(".signup__input--email");
const inputSignupPin = document.querySelector(".signup__input--pin");
const signupErrorMessage = document.querySelector("#signup_error");
const signupSuccessMessage = document.querySelector("#signup_success");
const modalSignupContainer = document.getElementById("modal__signup");
const modalSignupForm = document.getElementById("signup__form");

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

btnSignup.addEventListener("click", function (e) {
  e.preventDefault(); // Prevent form from submitting
  let ownerValue = `${inputSignupFirstName.value} ${inputSignupLastName.value}`;
  let emailValue = inputSignupEmail.value;
  let pinValue = inputSignupPin.value;

  // Validate inputs
  modalSignupForm.checkValidity();
  modalSignupForm.reportValidity();
  const isValidEmail = validateEmail(emailValue);
  if (ownerValue.length < 7 || pinValue.length !== 4 || !isValidEmail) {
    return;
  }
  // Check if an account already exists with owner or email key
  const currAcc = accounts.find(
    (acc) => acc.owner === ownerValue || acc.email === emailValue
  );
  if (currAcc) {
    if (currAcc.owner === ownerValue) {
      signupErrorMessage.textContent = `Account with name ${ownerValue} already exists!`;
    } else if (currAcc.email === emailValue) {
      signupErrorMessage.textContent = `Account with email ${emailValue} already exists!`;
    }
    return;
  }

  // handle successful signup
  signupSuccessMessage.textContent = "Successfully signed up!";

  let usernameValue =
    inputSignupFirstName.value[0]?.toLowerCase() +
    inputSignupLastName.value[0]?.toLowerCase();

  const newUser = {
    owner: ownerValue,
    username: usernameValue,
    interestRate: 1,
    pin: Number(pinValue),
    movements: [{ amount: 100, dateTime: new Date().toISOString() }],
    currency: "EUR",
    locale: "pt-PT",
    email: emailValue,
  };

  setTimeout(() => {
    accounts.push(newUser);
    setCurrentAccount(newUser);
    const modalBackdrop = document.querySelector(".modal-backdrop");
    modalBackdrop.classList.remove("show");
    modalBackdrop.style.display = "none";
    modalSignupContainer.classList.remove("show");
    modalSignupContainer.style.display = "none";

    //TO-DO: clear input fields after successfully signing up

    updateUIAfterLogin(currentAccount);
    updateUserBankSummaryUI(currentAccount);
  }, 2750);
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

  // todo: hide modal only if login was successfully validated
  modalLogin.classList.remove("show");
  modalSignup.classList.remove("show");

  btnLogout.classList.remove("hidden");
  btnLogout.classList.add("visible");
  authenticationButtons.classList.remove("visible");
  authenticationButtons.classList.add("hidden");
}

function updateNavAfterLogout() {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
  btnLogout.classList.remove("visible");
  btnLogout.classList.add("hidden");
  authenticationButtons.classList.remove("hidden");
  authenticationButtons.classList.add("visible");
}
