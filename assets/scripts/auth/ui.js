const store = require('../store')
const synthUi = require('../synth/ui')

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

const authErrorDisplay = $('#auth-error-display')

const resetAuthArea = () => {
  show(signupButton)
  show(loginButton)
  show(credentialsForm)
  hide(signoutButton)
  hide(changepwdButton)
  hide(showChangepwdButton)
  hide(cancelChangepwdButton)
  hide(changepwdForm)
}

const showError = res => {
  authErrorDisplay.html('An error has occured.<br />Please try again.')
  // authErrorDisplay.removeClass('error-display-fade')
  setTimeout(() => {
    authErrorDisplay.html('')
  }, 3000)
}

const signUpSuccess = res => {
  console.log('signUpSuccess')
}
const signUpError = res => {
  console.log('signUpError')
  console.log(res)
  showError()
}

const logInSuccess = res => {
  console.log('logInSuccess')
  console.log(res)
  store.user = res.user
  console.log('res.user:', res.user)
  hide(signupButton)
  hide(loginButton)
  hide(credentialsForm)
  show(signoutButton)
  show(showChangepwdButton)
  show($('#synth-auth-div'))
}
const logInError = res => {
  console.log('logInError')
  console.log(res)
  showError()
}

const signOutSuccess = res => {
  console.log('signOutSuccess')
  store.user = null
  resetAuthArea()
  synthUi.resetPatchSaveArea()
  hide($('#synth-auth-div'))
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
  showError()
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
