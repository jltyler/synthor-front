const store = require('../store')

// Helper funcs so I can type less
const hide = b => b.addClass('hidden')
const show = b => b.removeClass('hidden')

// Buttons
const showSaveFormButton = $('#show-save-form-button')
const saveNewButton = $('#save-new-button')
const cancelSaveNewButton = $('#cancel-save-new-button')
const saveUpdateButton = $('#save-update-button')
const confirmSaveUpdateButton = $('#confirm-save-update-button')
const cancelSaveUpdateButton = $('#cancel-save-update-button')

// Inputs
const patchNameInput = $('#patch-name-input')

// Display elements
const patchNameDisplay = $('#patch-name-display')
const confirmPatchActionDisplay = $('#confirm-patch-action-display')

const showSaveForm = () => {
  hide(showSaveFormButton)
  hide(patchNameDisplay)
  hide(saveUpdateButton)
  show(saveNewButton)
  show(patchNameInput)
  show(cancelSaveNewButton)
}

const hideSaveForm = () => {
  hide(saveNewButton)
  hide(patchNameInput)
  hide(cancelSaveNewButton)
  show(showSaveFormButton)
  show(patchNameDisplay)
}

const showUpdateConfirm = () => {
  show(confirmSaveUpdateButton)
  show(cancelSaveUpdateButton)
  show(confirmPatchActionDisplay)
  hide(patchNameDisplay)
  hide(showSaveFormButton)
  hide(saveUpdateButton)
}

const hideUpdateConfirm = () => {
  hide(confirmSaveUpdateButton)
  hide(cancelSaveUpdateButton)
  hide(confirmPatchActionDisplay)
  show(saveUpdateButton)
  show(patchNameDisplay)
  show(showSaveFormButton)
}

const loadPatch = patch => {
  patchNameDisplay.text(patch.name)
}

const createPatchSuccess = res => {
  console.log('createPatchSuccess')
  console.log(res)
  store.patch = res.patch
  patchNameDisplay.text(store.patch.name)
  hideSaveForm()
  show(saveUpdateButton)
}
const createPatchError = res => {
  console.log('createPatchError')
  console.log(res)
}

const updatePatchSuccess = res => {
  console.log('updatePatchSuccess')
  console.log(res)
  hideUpdateConfirm()
}
const updatePatchError = res => {
  console.log('updatePatchError')
  console.log(res)
}

module.exports = {
  showSaveForm,
  hideSaveForm,
  showUpdateConfirm,
  hideUpdateConfirm,

  createPatchSuccess,
  createPatchError,
  updatePatchSuccess,
  updatePatchError
}
