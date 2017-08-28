// const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')
const getPatchInfo = require('./get-patch-info')
const api = require('./api')
const ui = require('./ui')

const onCreatePatch = e => {
  e.preventDefault()
  const data = getPatchInfo(true)
  console.log(data)
  if (store.user) {
    api.createPatch(data)
      .then(ui.createPatchSuccess)
      .catch(ui.createPatchError)
  } else {
    console.log('No user!')
    console.log(store.user)
  }
}

const onUpdatePatch = e => {
  e.preventDefault()
  const data = getPatchInfo(true)
  console.log(data)
  if (store.user && store.patch) {
    delete data.patch.name
    api.updatePatch(data)
      .then(ui.updatePatchSuccess)
      .catch(ui.updatePatchError)
  } else {
    console.log('No user (maybe?!)')
    console.log(store.user)
    console.log('No patch (maybe?!)')
    console.log(store.patch)
  }
}

const attachHandlers = () => {
  $('#save-new-button').on('click', onCreatePatch)
  $('#confirm-save-update-button').on('click', onUpdatePatch)

  $('#cancel-save-update-button').on('click', ui.hideUpdateConfirm)
  $('#save-update-button').on('click', ui.showUpdateConfirm)
  $('#show-save-form-button').on('click', ui.showSaveForm)
  $('#cancel-save-new-button').on('click', ui.hideSaveForm)
}

module.exports = {
  attachHandlers
}
