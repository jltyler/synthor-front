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
    release: 0.4,
    fattack: 0.1,
    fdecay: 0.1,
    fsustain: 8000,
    frelease: 0.4
  }
]

class Voice {
  constructor (note, oscId = 0) {
    const now = audioCtx.currentTime
    this.options = oscOptions[oscId]

    this.osc = audioCtx.createOscillator()
    this.osc.frequency.value = freqArray[note]
    this.osc.type = this.options.type

    // Gain envelope
    this.env = audioCtx.createGain()
    this.env.gain.setValueAtTime(0.0, now)
    this.env.gain.linearRampToValueAtTime(1, now + this.options.attack)
    this.env.gain.linearRampToValueAtTime(this.options.sustain, now + this.options.attack + this.options.decay)

    // Filter envelope
    this.fenv = audioCtx.createBiquadFilter()
    this.fenv.Q.setValueAtTime(10, now)
    this.fenv.frequency.setValueAtTime(0, now)
    this.fenv.frequency.linearRampToValueAtTime(12000, now + this.options.fattack)
    this.fenv.frequency.linearRampToValueAtTime(this.options.fsustain, now + this.options.fattack + this.options.fdecay)

    // Connect the nodes and start
    this.osc.connect(this.fenv)
    this.fenv.connect(this.env)
    this.env.connect(compressor)
    this.osc.start()
  }

  release () {
    const now = audioCtx.currentTime

    // Stop any values and start release
    this.env.gain.cancelScheduledValues(now)
    this.env.gain.setValueAtTime(this.env.gain.value, now)
    this.env.gain.linearRampToValueAtTime(0.0, now + this.options.release)

    this.fenv.frequency.cancelScheduledValues(now)
    this.fenv.frequency.setValueAtTime(this.fenv.frequency.value, now)
    this.fenv.frequency.linearRampToValueAtTime(0.0, now + this.options.frelease)

    // Once release is finished, we stop the oscillator and remove connections
    setTimeout(() => {
      this.osc.stop()
      this.osc.disconnect()
      this.fenv.disconnect()
      this.env.disconnect()
    }, Math.max(this.options.release, this.options.frelease) * 1000)
  }
}

// Plays a note
const playNote = (note, octave = 3) => {
  // console.log('playNote(', note, ')');
  // Only play on valid note keys
  if (note === undefined) {
    return
  }
  if (!osc1[note]) {
    osc1[note] = [new Voice(note, 0)]
  } else {
    osc1[note].push(new Voice(note, 0))
  }
}

const stopNote = (note, octave = 3) => {
  // console.log('stopNote(', note, ')');
  if (note === undefined) {
    return
  }
  if (osc1[note].length > 0) {
    // console.log('release', note);
    const voice = osc1[note].shift()
    voice.release()
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

$('#osc1-waveform').on('change', e => {
  console.log(e);
  oscOptions[0].type = e.target.value
})

$('#osc1-attack').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].attack = val }
})

$('#osc1-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].decay = val }
})

$('#osc1-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].release = val }
})

$('#osc1-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 1,
  step: 0.05,
  release (val) { oscOptions[0].sustain = val }
})

$('#filter-attack').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].fattack = val }
})

$('#filter-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].fdecay = val }
})

$('#filter-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release (val) { oscOptions[0].frelease = val }
})

$('#filter-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10000,
  step: 50,
  release (val) { oscOptions[0].fsustain = val }
})
// $('#osc1-volume').on('change', (e) => {
//   osc1GainNode.gain.value = e.target.value / 100
// })

const init = () => {
}

module.exports = {
  init
}
