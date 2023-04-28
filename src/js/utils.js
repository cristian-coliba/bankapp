//re-Usable function for currencies
export const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); //convert mlsec. in days

export const formatMovementDate = function (date, locale) {
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday ";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
  // ex: it returns '18/11/2019' updating every time displayMovements
};

export const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

export const formatDateByLocaleTime = function (locale) {
  const dateNow = new Date();

  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric", //'long' for display luna in litere, gen November; can set also -> '2-digit'
    year: "numeric", //or '2-digit' can be set
  };

  const dateFormatted = Intl.DateTimeFormat(locale, options).format(dateNow);

  return dateFormatted;
};
