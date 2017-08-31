const SimpleMidiInput = require('simple-midi-input')
const synth = require('./synth')
const smi = new SimpleMidiInput()

navigator.requestMIDIAccess()
  .then(midi => {
    smi.attach(midi)
  })
  .catch(err => {
    // console.log(err)
  })

const logMidiInputs = () => {
  // console.log('easymidi.getInputs()')
  // console.log(easymidi.getInputs())
}

smi.on('noteOn', data => {
  // console.log('noteOn')
  // console.log(data)
  synth.playNote(data.key)
})

smi.on('noteOff', data => {
  // console.log('noteOff')
  // console.log(data)
  synth.stopNote(data.key)
})

module.exports = {
  logMidiInputs
}
