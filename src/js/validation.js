const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export function validateSignUpForm(firstName, lastName, email, pin) {
  const errorElement = document.getElementById("signup_error");

  if (firstName.length === 0) {
    errorElement.textContent = `Please enter your first name`;
    return false;
  } else if (firstName.length < 3) {
    errorElement.textContent = `First name must be three or more characters`;
    return false;
  } else if (firstName.length > 16) {
    errorElement.textContent = `First name must contain less than 16 characters`;
    return false;
  }

  if (lastName.length === 0) {
    errorElement.textContent = `Please enter your last name`;
    return false;
  } else if (lastName.length < 3) {
    errorElement.textContent = `Last name must be three or more characters`;
    return false;
  } else if (lastName.length > 16) {
    errorElement.textContent = `Last name must contain less than 16 characters`;
    return false;
  }

  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    errorElement.textContent = `Please enter a valid email address`;
    return false;
  }
  if (pin.length !== 4) {
    errorElement.textContent = `Pin code must be 4 characters long`;
    return false;
  }

  errorElement.textContent = "";
  return true;
}

export function validateIfUserAlreadyExists(accounts, owner, email) {
  const errorElement = document.getElementById("signup_error");

  const currAcc = accounts.find(
    (acc) => acc.owner === owner || acc.email === email
  );
  if (currAcc) {
    if (currAcc.owner === owner) {
      errorElement.textContent = `Account with name ${owner} already exists!`;
    } else if (currAcc.email === email) {
      errorElement.textContent = `Account with email ${email} already exists!`;
    }
  }
  return Boolean(currAcc);
}
