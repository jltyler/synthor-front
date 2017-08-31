'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
// require('./knob.min')
require('./third/jquery.knob')
require('./synth/knobify')
const synth = require('./synth/synth')
const authEvents = require('./auth/events')
const synthEvents = require('./synth/events')
const synthUi = require('./synth/ui')
const midi = require('./synth/midi')

$(() => {
  setAPIOrigin(location, config)
  authEvents.attachHandlers()
  synthEvents.attachHandlers()
  // synth.displayValues()
  synthUi.setupKeyboard()
  midi.logMidiInputs()
})

// window.onresize = synthUi.setupKeyboard

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
require('./example')
