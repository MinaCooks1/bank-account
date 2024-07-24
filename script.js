'use strict'
console.log('app start');

const account1 = {
  owner: 'Fatima Pashayeva', //fp
  movements: [300, 1200, -200, 3000, -1500, -800],
  interestRate: 1.2,
  pin: '1111'
}
const account2 = {
  owner: 'Said Huseynli', //sh
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: '2222'
}
const account3 = {
  owner: 'Ruslan Ismayilov', // ri
  movements: [200, -200, 340, -300, -20, 50, 400, -460, 5000],
  interestRate: 0.7,
  pin: '3333'
}
const account4 = {
  owner: 'Ismail Teymurzada', // it
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: '4444'
}


const users = [account1, account2, account3, account4]


const welcomeEl = document.querySelector('.welcome')
const mainEl = document.querySelector('main')
const btnLogin = document.querySelector('.login-btn')
const inputUsername = document.querySelector('#username')
const inputPin = document.querySelector('#pin')
const movementsContainer = document.querySelector('.movements')
const balanceValue = document.querySelector('.balance-value')
const balanceDate = document.querySelector('.balance-date')
const summaryValueIn = document.querySelector('.summary-value-in')
const summaryValueOut = document.querySelector('.summary-value-out')
const summaryValueInterest = document.querySelector('.summary-value-interest')



const btnSort = document.querySelector('.btn-sort')
const btnLoan = document.querySelector('.form-btn-loan')
const btnTransfer = document.querySelector('.form-btn-transfer')


const inputLoanAmount = document.querySelector('.loan-amount');
const inputTransferTo = document.querySelector('.form-input-to')
const inputTransferAmount = document.querySelector('.form-input-amount')

let user = null


function createUsername(users) {
  users.forEach(user => {
    const firstLetterOfUserName = user.owner.split(' ')[0][0]
    const firstLetterOfUserSurname = user.owner.split(' ')[1][0]
    user.username = [firstLetterOfUserName, firstLetterOfUserSurname].join('').toLowerCase()
  });
}
createUsername(users)

function displayMovements(movements, sort = false) {
  movementsContainer.innerHTML = ''

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements

  movs.forEach((mov, index) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
      <div class="movement">
        <div class="movement-info">
          <p class="movement-index">${ index + 1 }</p>
          <p class="movement-type type-${type}">${type}</p>
        </div>
        <p class="movement-value">${mov}€</p>
      </div>
    `
    movementsContainer.insertAdjacentHTML('afterbegin', html)
  })
}

function calcDisplayBalance(user) {
  const balance = user.movements.reduce((acc, mov) => acc + mov, 0)
  user.balance = balance
  balanceValue.textContent = `${balance}€`
}

function displayDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const today = `${day}/${month}/${year}`
  balanceDate.textContent = `as of ${today}`
}

function calcDisplaySummary(user) {
  const positiveMovs = user.movements.filter(mov => mov > 0)
  const incomes = positiveMovs.reduce((acc, mov) => acc + mov, 0)
  summaryValueIn.textContent = `${incomes}€`

  const negativeMovs = user.movements.filter(mov => mov < 0)
  const outcomes = negativeMovs.reduce((acc, mov) => acc + mov, 0)
  summaryValueOut.textContent = `${Math.abs(outcomes)}€`

  const interest = positiveMovs
    .map(mov => (mov * user.interestRate)/100)
    .filter(int => int >= 1)
    .reduce((acc, mov) => acc + mov, 0)

    summaryValueInterest.textContent = `${interest}€`
}



function updateUI(user) {

  displayMovements(user.movements)

  calcDisplayBalance(user)

  displayDate()


  calcDisplaySummary(user);
}

btnLogin.addEventListener('click', (event) => {
  event.preventDefault()

  user = users.find(u => u.username === inputUsername.value)
  if(!user) return alert('User can not be found!')

  if(user.pin === inputPin.value) {
    alert('Congrats')
    console.log('Congrats', user);

    welcomeEl.textContent =`'Welcome, ${user.owner.split(' ')[0]}`


    mainEl.classList.remove('hidden')

    updateUI(user)

  } else {
    alert('Pin is incorrect.');
    console.log('Pin is incorrect.');
  }
})

let sorted = false
btnSort.addEventListener('click', function(e) {
  e.preventDefault()
  console.log('let sort!', user);
  displayMovements(user.movements, !sorted)
  sorted = !sorted
})

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault()

  const receiverAcc = users.find(user => user.username === inputTransferTo.value)
  const amount = +inputTransferAmount.value

  if(amount > 0 && 
    amount < user.balance && 
    receiverAcc && 
    receiverAcc.username !== user.username) {
      console.log('transfer can happen');

      user.movements.push(-amount)
      receiverAcc.movements.push(amount)

      updateUI(user)

      inputTransferTo.value = inputTransferAmount.value = ''
  }
})



btnLoan.addEventListener('click', function(e) {
  e.preventDefault()
  const amount = +inputLoanAmount.value
  if(amount > 0) {
    user.movements.push(amount)

    updateUI(user)
  }

  inputLoanAmount.value = "";
})