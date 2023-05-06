import { accounts } from "./data";
import {
  currentAccount,
  timer,
  setTimer,
  updateUserBankSummaryUI,
} from "./app";
import { startLogOutTimer } from "./authentication";

export const containerApp = document.querySelector(".app");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // transferring from
    currentAccount.movements.push({
      amount: -amount,
      dateTime: new Date().toISOString(),
    });
    // transferring to
    receiverAcc.movements.push({
      amount: amount,
      dateTime: new Date().toISOString(),
    });

    // Update localStorage
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Update UI
    updateUserBankSummaryUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    setTimer(startLogOutTimer());
  }
});

//////////////////////////////////////////////////////////////////////////////
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov.amount >= amount * 0.1)
  ) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push({
        amount: amount,
        dateTime: new Date().toISOString(),
      });
      // Update localStorage
      localStorage.setItem("accounts", JSON.stringify(accounts));

      // Update UI
      updateUserBankSummaryUI(currentAccount);
      //Reset timer
      clearInterval(timer);
      setTimer(startLogOutTimer());
    }, 2500);
  }
  inputLoanAmount.value = "";
});

//////////////////////////////////////////////////////////////////////////////
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);
    // Update localStorage
    localStorage.setItem("accounts", JSON.stringify(accounts));

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});
