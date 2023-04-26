import "../scss/style.css";
import * as bootstrap from "bootstrap";
("use strict");

import { formatCur, formatMovementDate, createUsernames } from "./utils";
import { accounts } from "./data";
import { startLogOutTimer } from "./authentication";
import { containerApp } from "./main-operations";

// Elements
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");

const containerMovements = document.querySelector(".movements");

const btnSort = document.querySelector(".btn--sort");

export let currentAccount;
export let timer; //global variables
createUsernames(accounts);

export function setCurrentAccount(acc) {
  currentAccount = acc;
}
export function setTimer(t) {
  timer = t;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a.amount - b.amount)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov.amount > 0 ? "deposit" : "withdrawal";

    const date = new Date(mov.dateTime);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov.amount, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amount, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov.amount > 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter((mov) => mov.amount < 0)
    .reduce((acc, mov) => acc + mov.amount, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov.amount > 0)
    .map((mov) => (mov.amount * acc.interestRate) / 100)
    .filter((mov) => mov.amount >= 1)
    .reduce((acc, mov) => acc + mov.amount, 0);

  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

export const updateUserBankSummaryUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
