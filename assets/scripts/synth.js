// Select usable control elements
const osc1WaveForm = $('#osc1-waveform')

// Main context
const audioCtx = new window.AudioContext()

// Pressing and holding a key will repeaet it so we need to use this array to
// prevent it from repeating
const keyArray = new Array(255, false)

// Frequency array to use for notes (I should just calculate them later)
const freqArray = {
  octave: 3,
  C: 130.813,
  CS: 138.591,
  D: 146.832,
  DS: 155.563,
  E: 164.814,
  F: 174.614,
  FS: 184.997,
  G: 195.998,
  GS: 207.652,
  A: 220.000,
  AS: 233.082,
  B: 246.942
}

// Map keycodes to the note they play
const keyMap = {
  90: 'C',
  83: 'CS',
  88: 'D',
  68: 'DS',
  67: 'E',
  86: 'F',
  71: 'FS',
  66: 'G',
  72: 'GS',
  78: 'A',
  74: 'AS',
  77: 'B'
}

// Ends up being objects of arrays so I can have multiple of the same note playing
const osc1 = {}
const gain1 = {}

// Main gain node for osc1
const osc1GainNode = audioCtx.createGain()
osc1GainNode.gain.value = 0.8
osc1GainNode.connect(audioCtx.destination)

// Compressor to clamp the max output for polyphony
const compressor = audioCtx.createDynamicsCompressor()
compressor.connect(osc1GainNode)

const oscOptions = [
  {
    type: 'sawtooth',
    attack: 0.1,
    decay: 0.1,
    sustain: 1.0,
    release: 0.4
  }
]

let OSC1ATTACK = 0.1
let OSC1DECAY = 0.1
let OSC1SUSTAIN = 1.0
let OSC1RELEASE = 0.4

class Voice {
  constructor (note, oscId = 0) {
    const now = audioCtx.currentTime
    const options = oscOptions[oscId]
    this.osc = audioCtx.createOscillator()
    this.osc.frequency.value = freqArray[note]
    this.osc.type = options.type
    this.env = audioCtx.createGain()
    this.env.gain.setValueAtTime(0.0, now)
    this.env.gain.linearRampToValueAtTime(1, now + options.attack)
    this.env.gain.linearRampToValueAtTime(options.sustain, now + options.attack + options.decay)
  }
}

// Plays a note
const playNote = (note, octave = 3) => {
  console.log('playNote(', note, ')');
  // Only play on valid note keys
  if (note === undefined) {
    return
  }
  // For use in scheduling value changes
  const now = audioCtx.currentTime
  // Oscillator
  const newOsc = audioCtx.createOscillator()
  newOsc.frequency.value = freqArray[note]
  newOsc.type = osc1WaveForm.val()
  // Tremolo
  const modOsc = audioCtx.createOscillator()
  modOsc.frequency.value = 5.0
  modOsc.start()
  const modGain = audioCtx.createGain()
  modGain.gain.value = 1.0
  modOsc.connect(modGain)
  modGain.connect(newOsc.frequency)
  // modOsc.connect(newOsc.frequency)
  // Gain envelope
  const gainEnv = audioCtx.createGain()
  // We'll need these values for when the key is released
  gainEnv.gain.setValueAtTime(0.0, now)
  // Set attack and decay for gain envelope
  gainEnv.gain.linearRampToValueAtTime(1, now + OSC1ATTACK)
  gainEnv.gain.linearRampToValueAtTime(OSC1SUSTAIN, now + OSC1ATTACK + OSC1DECAY)
  // If osc1 for note is already played push the new one into the array,
  // otherwise create a new array to use
  if (!osc1[note]) {
    osc1[note] = [newOsc]
    gain1[note] = [gainEnv]
  } else {
    osc1[note].push(newOsc)
    gain1[note].push(gainEnv)
  }
  // Connect the osc to the gain and the gain to the compressor and start e up
  newOsc.connect(gainEnv)
  gainEnv.connect(compressor)
  newOsc.start()
}

const stopNote = (note, octave = 3) => {
  console.log('stopNote(', note, ')');
  if (note === undefined) {
    return
  }
  if (osc1[note] && osc1[note].length > 0) {
    const now = audioCtx.currentTime
    const osc = osc1[note].shift()
    const gain = gain1[note].shift()
    // console.log('osc1[' + note + ']:', osc1[note])

    gain.gain.cancelScheduledValues(now)
    // console.log('sustain:', gain.sustain);
    // console.log('release:', gain.release);
    gain.gain.setValueAtTime(gain.gain.value, now)
    // console.log(gain.gain.value);
    gain.gain.linearRampToValueAtTime(0.0, now + OSC1RELEASE)
    // console.log(gain.gain.value);
    setTimeout(() => {
      osc.disconnect()
      gain.disconnect()
      osc.stop()
      // delete osc1[note]
      // delete gain1[note]
    }, OSC1RELEASE * 1000)
  }
}

// Key pressed event
$(document).on('keydown', e => {
  if (!keyArray[e.which]) {
    playNote(keyMap[e.which.toString()])
    keyArray[e.which] = true
    // console.log('keydown', e.which)
  }
})

// Key released event
$(document).on('keyup', e => {
  stopNote(keyMap[e.which.toString()])
  keyArray[e.which] = false
  // console.log('keyup', e.which)
})

$('#osc1-volume').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  release (val) { osc1GainNode.gain.value = val / 100 }
})

$('#osc1-attack').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { OSC1ATTACK = val }
})

$('#osc1-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { OSC1DECAY = val }
})

$('#osc1-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { OSC1RELEASE = val }
})

$('#osc1-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 1,
  step: 0.05,
  release (val) { OSC1SUSTAIN = val }
})
// $('#osc1-volume').on('change', (e) => {
//   osc1GainNode.gain.value = e.target.value / 100
// })

const init = () => {
}

module.exports = {
  init
}
