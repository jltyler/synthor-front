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

const onDeletePatch = e => {
  e.preventDefault()
  if (store.user && store.patch) {
    api.deletePatch(store.patch.id)
      .then(ui.deletePatchSuccess)
      .catch(ui.deletePatchError)
  } else {
    console.log('No user (maybe?!)')
    console.log(store.user)
    console.log('No patch (maybe?!)')
    console.log(store.patch)
  }
}

const onIndexPatch = e => {
  // e.preventDefault()
  if (store.user) {
    api.indexPatch()
      .then(ui.indexPatchSuccess)
      .catch(ui.indexPatchError)
  } else {
    api.indexPatchPublic()
      .then(ui.indexPatchSuccess)
      .catch(ui.indexPatchError)
  }
}

const attachHandlers = () => {
  $('#save-new-button').on('click', onCreatePatch)
  $('#confirm-save-update-button').on('click', onUpdatePatch)
  // $('#show-patches-bar').on('click', onIndexPatch)
  $('#patches-bar').on('show.bs.modal', onIndexPatch)
  $('#confirm-delete-button').on('click', onDeletePatch)

  $('#cancel-save-update-button').on('click', ui.hideUpdateConfirm)
  $('#save-update-button').on('click', ui.showUpdateConfirm)
  $('#show-save-form-button').on('click', ui.showSaveForm)
  $('#cancel-save-new-button').on('click', ui.hideSaveForm)
  $('#delete-button').on('click', ui.showDeleteConfirm)
  $('#cancel-delete-button').on('click', ui.hideDeleteConfirm)
  $('#hide-patches-bar').on('click', ui.hidePatchesBar)
}

module.exports = {
  attachHandlers
}
