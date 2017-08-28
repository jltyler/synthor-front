'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
// require('./knob.min')
require('./third/jquery.knob')
require('./synth/ui')
const synth = require('./synth/synth')
const authEvents = require('./auth/events')

$(() => {
  setAPIOrigin(location, config)
  authEvents.attachHandlers()
  synth.init()
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
require('./example')
