'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
// require('./knob.min')
require('./jquery.knob')
const synth = require('./synth')

$(() => {
  setAPIOrigin(location, config)
  synth.init()
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
require('./example')
