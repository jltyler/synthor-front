const api = require('./api')
const ui = require('./ui')
const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')

const onSignUp = e => {
  e.preventDefault()
  const data = getFormFields(document.getElementById('credentials-form'))
  if (!data.credentials.email || !data.credentials.password) {
    ui.showError('Enter a username and a password!')
    return
  }
  ui.showAuthLoader()
  console.log('data:', data)
  api.signUp(data)
    .then(ui.signUpSuccess)
    .then(() => api.logIn(data))
    .then(ui.logInSuccess)
    .catch(ui.signUpError)
}

const onLogIn = e => {
  e.preventDefault()
  const data = getFormFields(document.getElementById('credentials-form'))
  if (!data.credentials.email || !data.credentials.password) {
    ui.showError('Enter a username and a password!')
    return
  }
  ui.showAuthLoader()
  console.log('data:', data)
  api.logIn(data)
    .then(ui.logInSuccess)
    .catch(ui.logInError)
}

const onSignOut = e => {
  e.preventDefault()
  if (store.user) {
    api.signOut()
      .then(ui.signOutSuccess)
      .catch(ui.signOutError)
  } else {
    console.log('No user!')
    console.log(store.user)
  }
}

const onChangepwd = e => {
  e.preventDefault()
  const data = getFormFields(document.getElementById('changepwd-form'))
  if (!data.passwords.old || !data.passwords.new) {
    ui.showError('Enter your old password and your new password!')
    return
  }
  ui.showAuthLoader()
  if (store.user) {
    api.changepwd(data)
      .then(ui.changepwdSuccess)
      .catch(ui.changepwdError)
  } else {
    console.log('No user!')
    console.log(store.user)
  }
}

const onShowChangepwdForm = e => {
  ui.showChangepwdForm()
}

const onCancelChangepwd = e => {
  ui.hideChangepwdForm()
}

const attachHandlers = () => {
  $('#signup-button').on('click', onSignUp)
  $('#login-button').on('click', onLogIn)
  $('#credentials-form').on('submit', onLogIn)
  $('#signout-button').on('click', onSignOut)
  $('#changepwd-button').on('click', onChangepwd)
  $('#changepwd-form').on('submit', onChangepwd)

  $('#show-changepwd-button').on('click', onShowChangepwdForm)
  $('#cancel-changepwd-button').on('click', onCancelChangepwd)
}

module.exports = {
  attachHandlers
}
