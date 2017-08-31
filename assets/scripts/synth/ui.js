const store = require('../store')
const api = require('./api')
const QwertyHancock = require('qwerty-hancock')
const synth = require('./synth')

// Helpers and templates
const patchTemplate = require('../templates/patch.hbs')
const patchPublicTemplate = require('../templates/patch-public.hbs')
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
const patchPrivate = $('#patch-private')

// Display elements
const patchNameDisplay = $('#patch-name-display')
const confirmPatchActionDisplay = $('#confirm-patch-action-display')
const patchesBar = $('#patches-bar')
const patchesList = $('#patches-list')
const authErrorDisplay = $('#auth-error-display')
const patchesBarLoader = $('#patches-bar-loader')

const showError = message => {
  authErrorDisplay.html(message || 'An error has occured.<br />Please try again.')
  // authErrorDisplay.removeClass('error-display-fade')
  setTimeout(() => {
    authErrorDisplay.html('')
  }, 3000)
}

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
  hide(patchPrivate)
}

const showSaveForm = () => {
  hide(showSaveFormButton)
  hide(patchNameDisplay)
  hide(saveUpdateButton)
  hide(deleteButton)
  show(saveNewButton)
  show(patchNameInput)
  show(cancelSaveNewButton)
  show(patchPrivate)
  if (store.patch) {
    patchNameInput.val(store.patch.name)
  }
}

const hideSaveForm = () => {
  show(showSaveFormButton)
  show(patchNameDisplay)
  hide(saveNewButton)
  hide(patchNameInput)
  hide(cancelSaveNewButton)
  hide(patchPrivate)
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

const showPatchesBarLoader = () => {
  show(patchesBarLoader)
}

const hidePatchesBarLoader = () => {
  hide(patchesBarLoader)
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
  patches.sort((a, b) => a.name.localeCompare(b.name))
  const myPatches = []
  const pubPatches = []
  let patchesHTML = ''
  if (store.user) {
    patches.forEach(p => {
      if (p._owner.toString() === store.user.id.toString()) {
        // console.log('pushing myPatch:', p._id)
        myPatches.push(p)
      } else {
        // console.log('pushing pubPatch:', p._id)
        pubPatches.push(p)
      }
    })
    patchesHTML = patchTemplate({myPatches, pubPatches})
  } else {
    patchesHTML = patchPublicTemplate({patches})
  }
  patchesList.append(patchesHTML)
  $('.load-patch-button').on('click', e => {
    const parent = $(e.target).closest('.patch-item')[0]
    // console.log('parent:', parent)
    const id = parent.dataset.id
    // console.log('id:', id)
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
  setPatchInfo(store.patch)
  checkPatchOwnership()
}

const createPatchSuccess = res => {
  // console.log('createPatchSuccess')
  // console.log(res)
  store.patch = res.patch
  patchNameDisplay.text(store.patch.name)
  hideSaveForm()
  show(saveUpdateButton)
  show(deleteButton)
  patchNameInput.val('')
}
const createPatchError = res => {
  // console.log('createPatchError')
  // console.log(res)
  showError()
}

const updatePatchSuccess = res => {
  // console.log('updatePatchSuccess')
  // console.log(res)
  hideUpdateConfirm()
}
const updatePatchError = res => {
  // console.log('updatePatchError')
  // console.log(res)
  showError()
}

const indexPatchSuccess = res => {
  // console.log('indexPatchSuccess')
  // console.log(res)
  populatePatchesBar(res.patches)
  hidePatchesBarLoader()
  // showPatchesBar()
}
const indexPatchError = res => {
  // console.log('indexPatchError')
  // console.log(res)
  showError()
  hidePatchesBarLoader()
}

const showPatchSuccess = res => {
  // console.log('showPatchSuccess')
  // console.log(res)
  // hidePatchesBar()
  store.patch = res.patch
  loadPatch()
  synth.displayValues()
}
const showPatchError = res => {
  // console.log('showPatchError')
  // console.log(res)
  showError()
}

const deletePatchSuccess = res => {
  // console.log('deletePatchSuccess')
  // console.log(res)
  store.patch = null
  resetPatchSaveArea()
}
const deletePatchError = res => {
  // console.log('deletePatchError')
  // console.log(res)
}

const noteMap = {
  'C3': 36,
  'C#3': 37,
  'D3': 38,
  'D#3': 39,
  'E3': 40,
  'F3': 41,
  'F#3': 42,
  'G3': 43,
  'G#3': 44,
  'A3': 45,
  'A#3': 46,
  'B3': 47,
  'C4': 48,
  'C#4': 49,
  'D4': 50,
  'D#4': 51,
  'E4': 52,
  'F4': 53,
  'F#4': 54,
  'G4': 55,
  'G#4': 56,
  'A4': 57,
  'A#4': 58,
  'B4': 59,
}

const noteMapKeys = Object.keys(noteMap)
// Convert note number to proper note frequency
// 57 = A4
const frequencyFromNum = function (note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

const setupKeyboard = () => {
  // console.log(window.innerWidth)
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
    // console.log('kbnotepress:', note, '|', frequency)
    if (noteMapKeys.includes(note)) {
      synth.playNote(noteMap[note], frequency)
    }
    // synth.playNote(note, frequency)
  }

  keyboard.keyUp = function (note, frequency) {
    // console.log('kbnoterelease:', note, '|', frequency)
    // synth.stopNote(note, frequency)
    if (noteMapKeys.includes(note)) {
      synth.stopNote(noteMap[note], frequency)
    }
  }
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
  showPatchesBarLoader,

  createPatchSuccess,
  createPatchError,
  updatePatchSuccess,
  updatePatchError,
  indexPatchSuccess,
  indexPatchError,
  deletePatchSuccess,
  deletePatchError,
  showError,
  setupKeyboard
}
