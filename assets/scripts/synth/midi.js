const SimpleMidiInput = require('simple-midi-input')
const synth = require('./synth')
const smi = new SimpleMidiInput()

// console.log('typeof navigator.requestMIDIAccess');
// console.log(typeof navigator.requestMIDIAccess);

if (typeof navigator.requestMIDIAccess === 'function') {
  // console.log('supports MIDI');
  navigator.requestMIDIAccess()
    .then(midi => {
      smi.attach(midi)
      // console.log('attached');
    })
    .then(() => {
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
    })
    .catch(err => {
      // console.log('errir!');
      // console.log(err)
  })
}

const logMidiInputs = () => {
  // console.log('easymidi.getInputs()')
  // console.log(easymidi.getInputs())
}

module.exports = {
  logMidiInputs
}
