const store = require('../store')
const api = require('./api')
const QwertyHancock = require('qwerty-hancock')
const synth = require('./synth')

// Helpers and templates
const patchTemplate = require('../templates/patch.hbs')
const setPatchInfo = require('./set-patch-info')
const hide = b => b.addClass('hidden')
const show = b => b.removeClass('hidden')

// Buttons
const showSaveFormButton = $('#show-save-form-button')
const saveNewButton = $('#save-new-button')
const cancelSaveNewButton = $('#cancel-save-new-button')
const saveUpdateButton = $('#save-update-button')
const confirmSaveUpdateButton = $('#confirm-save-update-button')
const cancelSaveUpdateButton = $('#cancel-save-update-button')
const deleteButton = $('#delete-button')
const cancelDeleteButton = $('#cancel-delete-button')
const confirmDeleteButton = $('#confirm-delete-button')

// Inputs
const patchNameInput = $('#patch-name-input')

// Display elements
const patchNameDisplay = $('#patch-name-display')
const confirmPatchActionDisplay = $('#confirm-patch-action-display')
const patchesBar = $('#patches-bar')
const patchesList = $('#patches-list')

const resetPatchSaveArea = () => {
  show(showSaveFormButton)
  show(patchNameDisplay)
  patchNameDisplay.text('New Patch')
  hide(saveUpdateButton)
  hide(patchNameInput)
  hide(saveNewButton)
  hide(cancelSaveNewButton)
  hide(confirmSaveUpdateButton)
  hide(cancelSaveUpdateButton)
  hide(confirmPatchActionDisplay)
  hide(deleteButton)
  hide(cancelDeleteButton)
  hide(confirmDeleteButton)
}

const showSaveForm = () => {
  hide(showSaveFormButton)
  hide(patchNameDisplay)
  hide(saveUpdateButton)
  hide(deleteButton)
  show(saveNewButton)
  show(patchNameInput)
  show(cancelSaveNewButton)
}

const hideSaveForm = () => {
  show(showSaveFormButton)
  show(patchNameDisplay)
  hide(saveNewButton)
  hide(patchNameInput)
  hide(cancelSaveNewButton)
  checkPatchOwnership()
}

const showUpdateConfirm = () => {
  show(confirmSaveUpdateButton)
  show(cancelSaveUpdateButton)
  show(confirmPatchActionDisplay)
  hide(saveUpdateButton)
  hide(deleteButton)
  hide(patchNameDisplay)
  hide(showSaveFormButton)
}

const hideUpdateConfirm = () => {
  hide(confirmSaveUpdateButton)
  hide(cancelSaveUpdateButton)
  hide(confirmPatchActionDisplay)
  show(saveUpdateButton)
  show(deleteButton)
  show(patchNameDisplay)
  show(showSaveFormButton)
}

const showDeleteConfirm = () => {
  show(confirmDeleteButton)
  show(cancelDeleteButton)
  show(confirmPatchActionDisplay)
  hide(saveUpdateButton)
  hide(deleteButton)
  hide(patchNameDisplay)
  hide(showSaveFormButton)
}

const hideDeleteConfirm = () => {
  hide(confirmDeleteButton)
  hide(cancelDeleteButton)
  hide(confirmPatchActionDisplay)
  show(saveUpdateButton)
  show(deleteButton)
  show(patchNameDisplay)
  show(showSaveFormButton)
}

const showPatchesBar = () => {
  patchesBar.addClass('patches-popout')
}

const hidePatchesBar = () => {
  patchesBar.removeClass('patches-popout')
}

const checkPatchOwnership = () => {
  if (store.patch && store.user) {
    if (store.patch._owner === store.user.id) {
      show(saveUpdateButton)
      show(deleteButton)
    } else {
      hide(saveUpdateButton)
      hide(deleteButton)
    }
  } else {
    hide(saveUpdateButton)
    hide(deleteButton)
  }
}

const populatePatchesBar = (patches) => {
  patchesList.html('')
  const patchesHTML = patchTemplate({patches})
  patchesList.append(patchesHTML)
  $('.load-patch-button').on('click', e => {
    const parent = $(e.target).closest('.patch-item')[0]
    console.log('parent:', parent)
    const id = parent.dataset.id
    console.log('id:', id)
    if (store.user) {
      api.showPatch(id)
        .then(showPatchSuccess)
        .then(() => $('#patches-bar').modal('hide'))
        .catch(showPatchError)
    } else {
      api.showPatchPublic(id)
        .then(showPatchSuccess)
        .then(() => $('#patches-bar').modal('hide'))
        .catch(showPatchError)
    }
  })
}

const loadPatch = () => {
  patchNameDisplay.text(store.patch.name)
  show(saveUpdateButton)
  setPatchInfo(store.patch)
  checkPatchOwnership()
}

const createPatchSuccess = res => {
  console.log('createPatchSuccess')
  console.log(res)
  store.patch = res.patch
  patchNameDisplay.text(store.patch.name)
  hideSaveForm()
  show(saveUpdateButton)
  show(deleteButton)
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

const indexPatchSuccess = res => {
  console.log('indexPatchSuccess')
  console.log(res)
  populatePatchesBar(res.patches)
  // showPatchesBar()
}
const indexPatchError = res => {
  console.log('indexPatchError')
  console.log(res)
}

const showPatchSuccess = res => {
  console.log('showPatchSuccess')
  console.log(res)
  // hidePatchesBar()
  store.patch = res.patch
  loadPatch()
}
const showPatchError = res => {
  console.log('showPatchError')
  console.log(res)
}

const deletePatchSuccess = res => {
  console.log('deletePatchSuccess')
  console.log(res)
  store.patch = null
  resetPatchSaveArea()
}
const deletePatchError = res => {
  console.log('deletePatchError')
  console.log(res)
}

const keyboard = new QwertyHancock({
  id: 'virtual-keyboard',
  width: 750,
  height: 180,
  octaves: 2,
  startNote: 'C3',
  whiteNotesColour: 'white',
  blackNotesColour: 'black',
  hoverColour: '#9900ff'
})

keyboard.keyDown = function (note, frequency) {
  console.log('kbnotepress:', note, '|', frequency)
  synth.playNote(note, frequency)
}

keyboard.keyUp = function (note, frequency) {
  console.log('kbnoterelease:', note, '|', frequency)
  synth.stopNote(note, frequency)
}

module.exports = {
  showSaveForm,
  hideSaveForm,
  showUpdateConfirm,
  hideUpdateConfirm,
  showDeleteConfirm,
  hideDeleteConfirm,
  showPatchesBar,
  hidePatchesBar,
  resetPatchSaveArea,

  createPatchSuccess,
  createPatchError,
  updatePatchSuccess,
  updatePatchError,
  indexPatchSuccess,
  indexPatchError,
  deletePatchSuccess,
  deletePatchError,
}
