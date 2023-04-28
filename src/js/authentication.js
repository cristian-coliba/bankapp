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
  let ownerValue =
    `${inputSignupFirstName.value} ${inputSignupLastName.value}`.trim();
  let emailValue = inputSignupEmail.value.trim();
  let pinValue = inputSignupPin.value.trim();

  // To-DO: Validate inputs
  // const isFormValid = validateSignUpForm();
  // if (!isFormValid) {
  //   return;
  // }

  modalSignupForm.checkValidity();
  modalSignupForm.reportValidity();
  const isValidEmail = validateEmail(emailValue);
  if (ownerValue.length < 7 || pinValue.length !== 4 || !isValidEmail) {
    return;
  }
  // Check if an account already exists with owner or email key
  const doesUserExist = checkIfUserAlreadyExists(ownerValue, emailValue);

  if (doesUserExist) {
    return;
  } else {
    // handle successful signup
    handleSignupSuccess(ownerValue, pinValue, emailValue);
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

  // todo: hide modal only if login was successfully validated
  modalLogin.classList.remove("show");
  modalSignup.classList.remove("show");

  btnLogout.classList.remove("hidden");
  btnLogout.classList.add("visible");
  authenticationButtons.classList.remove("visible");
  authenticationButtons.classList.add("hidden");
}
function validateSignUpForm() {
  // validate firstName, (check for min length (trim before) and alphabetical characters)
  // (if not then update (signupErrorMessage.textContent) with the specific description of error) and also return false so that it doesn't validate beyond it
  // validate lastName,
  // validate email,
  // validate pincode
  // return true or false
}
function checkIfUserAlreadyExists(owner, email) {
  const currAcc = accounts.find(
    (acc) => acc.owner === owner || acc.email === email
  );
  if (currAcc) {
    if (currAcc.owner === ownerValue) {
      signupErrorMessage.textContent = `Account with name ${ownerValue} already exists!`;
    } else if (currAcc.email === emailValue) {
      signupErrorMessage.textContent = `Account with email ${emailValue} already exists!`;
    }
  }
  return Boolean(currAcc);
}
function handleSignupSuccess(owner, pin, email) {
  signupSuccessMessage.textContent = "Successfully signed up!";
  const username = owner
    .split(" ")
    .map((elem) => elem[0].toLowerCase())
    .join("");

  const newUser = {
    owner: owner,
    username: username,
    interestRate: 1,
    pin: Number(pin),
    movements: [{ amount: 100, dateTime: new Date().toISOString() }],
    currency: "EUR",
    locale: "pt-PT",
    email: email,
  };

  setTimeout(() => {
    inputSignupFirstName.value = "";
    inputSignupLastName.value = "";
    inputSignupEmail.value = "";
    inputSignupPin.value = "";
    signupErrorMessage.textContent = "";
    signupSuccessMessage.textContent = "";

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
}

function updateNavAfterLogout() {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
  btnLogout.classList.remove("visible");
  btnLogout.classList.add("hidden");
  authenticationButtons.classList.remove("hidden");
  authenticationButtons.classList.add("visible");
}
