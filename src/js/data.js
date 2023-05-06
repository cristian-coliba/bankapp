import { startLogOutTimer } from "./authentication";

export const account1 = {
  owner: "Jonas Schmedtmann",
  userName: "jss",
  interestRate: 1.2, // %
  pin: 1111,
  movements: [
    { amount: 200, dateTime: "2019-11-18T21:31:17.178Z" },
    { amount: 455.23, dateTime: "2019-12-23T07:42:02.383Z" },
    { amount: -306.5, dateTime: "2020-01-28T09:15:04.904Z" },
    { amount: 25000, dateTime: "2020-04-01T10:17:24.185Z" },
    { amount: -642.21, dateTime: "2020-05-08T14:11:59.604Z" },
    { amount: -133.9, dateTime: "2022-09-29T17:01:17.194Z" },
    { amount: 79.97, dateTime: "2022-10-01T23:36:17.929Z" },
    { amount: 1300, dateTime: "2022-10-03T10:51:36.790Z" },
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
  email: "js@gmail.com",
};

export const account2 = {
  owner: "Jessica Davis",
  userName: "jdd",
  interestRate: 1.5,
  pin: 2222,
  movements: [
    { amount: 5000, dateTime: "2019-10-18T21:31:17.178Z" },
    { amount: 3400, dateTime: "2019-12-20T07:42:02.383Z" },
    { amount: -150, dateTime: "2020-01-28T09:15:04.904Z" },
    { amount: -790, dateTime: "2020-02-01T10:17:24.185Z" },
    { amount: -3210, dateTime: "2020-04-08T14:11:59.604Z" },
    { amount: -1000, dateTime: "2022-09-29T17:01:17.194Z" },
    { amount: 8500, dateTime: "2022-11-01T23:36:17.929Z" },
    { amount: -30, dateTime: "2022-07-03T10:51:36.790Z" },
  ],
  currency: "USD",
  locale: "en-US",
  email: "jd@gmail.com",
};

// first check from local storage if there is a key 'accounts'
const storageAccounts = localStorage.getItem("accounts");
const parsedAccounts = JSON.parse(storageAccounts);
export let accounts = [];
if (parsedAccounts && parsedAccounts.length > 0) {
  accounts = parsedAccounts;
} else {
  accounts = [account1, account2];
  localStorage.setItem("accounts", JSON.stringify(accounts));
}
