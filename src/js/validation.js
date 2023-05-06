const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export function validateSignUpForm(firstName, lastName, email, pin) {
  if (firstName.length === 0) {
    return `Please enter your first name`;
  } else if (firstName.length < 3) {
    return `First name must be three or more characters`;
  } else if (firstName.length > 16) {
    return `First name must contain less than 16 characters`;
  }

  if (lastName.length === 0) {
    return `Please enter your last name`;
  } else if (lastName.length < 3) {
    return `Last name must be three or more characters`;
  } else if (lastName.length > 16) {
    return `Last name must contain less than 16 characters`;
  }

  const isValidEmail = validateEmail(email);
  if (!isValidEmail) {
    return `Please enter a valid email address`;
  }
  if (pin.length !== 4) {
    return `Pin code must be 4 characters long`;
  }

  return "";
}

export function validateIfUserAlreadyExists(accounts, owner, email) {
  const currAcc = accounts.find(
    (acc) => acc.owner === owner || acc.email === email
  );
  if (currAcc) {
    if (currAcc.owner === owner) {
      return `Account with name ${owner} already exists!`;
    } else if (currAcc.email === email) {
      return `Account with email ${email} already exists!`;
    }
  }
  return "";
}
