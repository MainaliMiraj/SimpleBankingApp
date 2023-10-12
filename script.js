'use strict';

const account1 = {
  owner: 'Miraj Mainali',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Mark Zukerberg',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2020-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-07-26T17:01:17.194Z',
    '2023-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
};

const account3 = {
  owner: 'Elon Musk',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2021-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
};
const account4 = {
  owner: 'Issac Newton',
  movements: [430, 1000, 700, -200, 50, 90, 400, 200, -130],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-07-26T17:01:17.194Z',
    '2022-07-28T23:36:17.929Z',
    '2023-08-01T10:51:36.790Z',
  ],
};

const accounts = [account1, account2, account3, account4];
const transfer = document.querySelector('.transfer');
const requestLoan = document.querySelector('.request');
const close = document.querySelector('.close');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
containerMovements.innerHTML = '';
const now = new Date();

// Function to diplay Movements
const diplayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((accountMovement, index) => {
    const transactionType = accountMovement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[index]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${transactionType}">${
      index + 1
    }. ${transactionType}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">$${Math.abs(accountMovement)}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//function to create the username
const finalUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
};
finalUserName(accounts);

const updateUI = function (acc) {
  diplayMovements(acc);
  calculateDisplaySummary(acc);
  calcPrintBalance(acc);
};

//---CALCULATE THE DISPLAY SUMMARY----
const calculateDisplaySummary = function (acc) {
  //for Income
  const income = acc.movements
    .filter(values => values > 0)
    .reduce((accu, total) => accu + total);
  labelSumIn.textContent = `$${income}`;

  //For expenditure
  const expenditure = acc.movements
    .filter(values => values < 0)
    .reduce((accu, total) => accu + total);
  labelSumOut.textContent = `$${Math.abs(expenditure)}`;

  //calculate Intrest
  const intrest = acc.movements
    .filter(values => values > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((accu, value) => accu + value, 0);
  labelSumInterest.textContent = `$${intrest.toFixed(2)}`;
};

//printing the total balanace
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accu, currentValue) => accu + currentValue,
    0
  );

  labelBalance.textContent = `$${acc.balance}`;
};

const startLogoutTimer = function () {
  //set time time first
  let time = 120;

  //use setinterval for the timer
  const timer = setInterval(() => {
    const min = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);
    //each time the fucntion is called print the remaining time to to the userInterface
    labelTimer.textContent = `${min}:${sec}`;

    //on zero second,stop the timer and log the user out
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Welcome to CitiBank';
      containerApp.style.opacity = 0;
    }
    time--;
  }, 1000);
  return timer;
};

//Adding the login functionality
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const day = `${now.getDay()}`.padStart(2, 0);
  const month = `${now.getMonth()}`.padStart(2, 0);
  const year = now.getFullYear();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 100;

    //Calling all the functions to show the data once the username and the password are matched
    labelDate.textContent = `As of ${now.getDate()}/${
      now.getMonth() + 1
    }/${now.getFullYear()}`;
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI(currentAccount);

    ////////
  }
});

//IMPLEMENTING TRANSFER
function transferMessage() {
  transfer.style.color = 'darkred';
  transfer.textContent = 'Transfering the money';
  setTimeout(() => (transfer.textContent = 'Transfering the money.'), 500);
  setTimeout(() => (transfer.textContent = 'Transfering the money..'), 800);
  setTimeout(() => (transfer.textContent = 'Transfering the money...'), 1000);
  setTimeout(() => {
    transfer.textContent = 'Transfer Completed.';
    transfer.textContent = 'Transfer money.';
    transfer.style.color = 'black';
  }, 2500);
  setTimeout(() => {
    transfer.textContent = 'Transfer money.';
    transfer.style.color = 'black';
  }, 4000);
}

function invalidMessage() {
  transfer.style.color = 'red';
  transfer.textContent = 'Invalid input or you have not login.';
  setTimeout(() => {
    transfer.textContent = 'Transfer money';
    transfer.style.color = 'black';
  }, 2000);
}
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAccoutName = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  //Doing the transfer
  if (inputTransferAmount.value && inputTransferTo.value) {
    invalidMessage();
  } else {
    if (
      transferAmount > 0 &&
      receiverAccoutName &&
      currentAccount.balance >= transferAmount &&
      receiverAccoutName?.username !== currentAccount.username
    ) {
      transferMessage();
      currentAccount.movements.push(-transferAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAccoutName.movements.push(transferAmount);
      receiverAccoutName.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    } else {
      transfer.style.color = 'red';
      transfer.textContent =
        'Invalid data, enter the first character of first and last names.';
      setTimeout(() => {
        transfer.textContent = 'Transfer money';
        transfer.style.color = 'black';
      }, 3000);
    }
    //add Transfer
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccoutName.movementsDates.push(new Date().toISOString());
    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//closing the account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //closing account logic
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Welcome, please login`;
  } else {
    close.textContent = 'invalid username or the pin.';
    close.style.color = 'white';
    setTimeout(() => {
      close.textContent = 'Close account.';
      close.style.color = 'black';
    }, 2000);
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  } else {
    requestLoan.textContent = 'No input or Invalid amount.';
    requestLoan.style.color = 'red';
    inputLoanAmount.value = '';

    setTimeout(() => {
      requestLoan.textContent = 'Request loan.';
      requestLoan.style.color = 'black';
    }, 1000);
  }
  currentAccount.movementsDates.push(new Date().toISOString());
  updateUI(currentAccount);

  clearInterval(timer);
  timer = startLogoutTimer();
});

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   diplayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });
///////////////////////////////////////////////////////
const details = document.querySelector('.ins');
const exit = document.querySelector('.exit');

details.addEventListener('click', function () {
  document.querySelector('.para').classList.remove('hid');
  document.querySelector('.exit').classList.toggle('hid');
});

exit.addEventListener('click', function () {
  document.querySelector('.para').classList.add('hid');
  exit.classList.add('hid');
});

function closePopup() {
  document.querySelector('.para').classList.add('hid');
  exit.classList.add('hid');
  details.blur();
}
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closePopup();
  }
});

/////////////////////////////////////////////////////////
