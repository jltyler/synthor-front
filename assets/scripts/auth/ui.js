const store = require('../store')

// Helper funcs so I can type less
const hide = b => b.addClass('hidden')
const show = b => b.removeClass('hidden')

// Store all the buttons for easy access when hiding or showing
// Functional buttons
const loginButton = $('#login-button')
const signupButton = $('#signup-button')
const signoutButton = $('#signout-button')
const changepwdButton = $('#changepwd-button')

// Forms
const credentialsForm = $('#credentials-form')
const changepwdForm = $('#changepwd-form')

// UI hide / show buttons
const showChangepwdButton = $('#show-changepwd-button')
const cancelChangepwdButton = $('#cancel-changepwd-button')

const signUpSuccess = res => {
  console.log('XX-=signUpSuccess=-XX')
  hide(signupButton)
}
const signUpError = res => {
  console.log('signUpError')
  console.log(res)
}

const logInSuccess = res => {
  console.log('XX-=logInSuccess=-XX')
  console.log(res)
  store.user = res.user
  console.log('res.user:', res.user)
  hide(signupButton)
  hide(loginButton)
  hide(credentialsForm)
  show(signoutButton)
  show(showChangepwdButton)
}
const logInError = res => {
  console.log('logInError')
  console.log(res)
}

const signOutSuccess = res => {
  console.log('signOutSuccess')
  store.user = null
  hide(signoutButton)
  hide(showChangepwdButton)
  show(signupButton)
  show(loginButton)
  show(credentialsForm)
}
const signOutError = res => {
  console.log('signOutError')
  console.log(res)
}

const changepwdSuccess = res => {
  console.log('changepwdSuccess')
  hideChangepwdForm()
}
const changepwdError = res => {
  console.log('changepwdError')
  console.log(res)
}

const showChangepwdForm = () => {
  show(changepwdForm)
  show(changepwdButton)
  show(cancelChangepwdButton)
  hide(showChangepwdButton)
}

const hideChangepwdForm = () => {
  hide(changepwdForm)
  hide(changepwdButton)
  hide(cancelChangepwdButton)
  show(showChangepwdButton)
}

module.exports = {
  signUpSuccess,
  signUpError,
  logInSuccess,
  logInError,
  signOutSuccess,
  signOutError,
  changepwdSuccess,
  changepwdError,
  showChangepwdForm,
  hideChangepwdForm
}
