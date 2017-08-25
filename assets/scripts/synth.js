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

// Convert note number to proper note frequency
// 57 = A4
const frequencyFromNum = function (note) {
  return 440 * Math.pow(2, (note - 69) / 12)
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

// Main gain node for osc1
const osc1GainNode = audioCtx.createGain()
osc1GainNode.gain.value = 0.8
osc1GainNode.connect(audioCtx.destination)

// Compressor to clamp the max output for polyphony
const compressor = audioCtx.createDynamicsCompressor()
compressor.connect(osc1GainNode)

const filterOptions = {
  attack: 0.1,
  decay: 0.1,
  sustain: 8000,
  release: 0.4,
  peak: 12000,
  q: 10
}

const oscOptions = [
  {
    type: 'sawtooth',
    attack: 0.1,
    decay: 0.1,
    sustain: 1.0,
    release: 0.4,
    detune: 1.0,
    octave: 1.0,
    unison: 1,
    pan: 0,
    tremAmp: 0,
    tremFreq: 0
  }
]

class Voice {
  constructor (note, oscId = 0) {
    const now = audioCtx.currentTime
    this.options = oscOptions[oscId]

    // Oscillator and settings
    this.osc = audioCtx.createOscillator()
    this.osc.frequency.value = freqArray[note] * this.options.octave * this.options.detune
    this.osc.type = this.options.type

    // Pan
    this.pan = audioCtx.createStereoPanner()
    this.pan.pan.setValueAtTime(this.options.pan, now)

    // Gain envelope
    this.env = audioCtx.createGain()
    this.env.gain.setValueAtTime(0.0, now)
    this.env.gain.linearRampToValueAtTime(1, now + this.options.attack)
    this.env.gain.linearRampToValueAtTime(this.options.sustain, now + this.options.attack + this.options.decay)

    // Filter envelope
    this.fenv = audioCtx.createBiquadFilter()
    this.fenv.Q.setValueAtTime(filterOptions.q, now)
    this.fenv.frequency.setValueAtTime(0, now)
    this.fenv.frequency.linearRampToValueAtTime(filterOptions.peak, now + filterOptions.attack)
    this.fenv.frequency.linearRampToValueAtTime(filterOptions.sustain, now + filterOptions.attack + filterOptions.decay)

    // Connect the nodes and start
    this.osc.connect(this.fenv)
    this.fenv.connect(this.env)
    this.env.connect(this.pan)
    this.pan.connect(compressor)
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
    this.fenv.frequency.linearRampToValueAtTime(0.0, now + filterOptions.release)

    // Once release is finished, we stop the oscillator and remove connections
    setTimeout(() => {
      this.osc.stop()
      this.osc.disconnect()
      this.fenv.disconnect()
      this.env.disconnect()
    }, Math.max(this.options.release, filterOptions.release) * 1000)
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

const setOscVolume = (value, osc = 0) => {
  osc1GainNode.gain.value = value
}

const setOscDetune = (value, osc = 0) => {
  oscOptions[osc].detune = value
}

const setOscOctave = (value, osc = 0) => {
  oscOptions[osc].octave = value
}

const setOscWaveform = (value, osc = 0) => {
  oscOptions[osc].type = value
}

const setOscUnison = (value, osc = 0) => {
  oscOptions[osc].unison = value
}

const setOscPan = (value, osc = 0) => {
  oscOptions[osc].pan = value
}

const setOscTremoloAmp = (value, osc = 0) => {
  oscOptions[osc].tremAmp = value
}

const setOscTremoloFreq = (value, osc = 0) => {
  oscOptions[osc].tremFreq = value
}

const setOscEnvelopeAttack = (value, osc = 0) => {
  oscOptions[osc].attack = value
}

const setOscEnvelopeDecay = (value, osc = 0) => {
  oscOptions[osc].decay = value
}

const setOscEnvelopeSustain = (value, osc = 0) => {
  oscOptions[osc].sustain = value
}

const setOscEnvelopeRelease = (value, osc = 0) => {
  oscOptions[osc].release = value
}

const setFilterEnvelopeAttack = (value) => {
  filterOptions.attack = value
}

const setFilterEnvelopeDecay = (value) => {
  filterOptions.decay = value
}

const setFilterEnvelopeSustain = (value) => {
  filterOptions.sustain = value
}

const setFilterEnvelopeRelease = (value) => {
  filterOptions.release = value
}

const init = () => {
}

module.exports = {
  init,
  setOscVolume,
  setOscDetune,
  setOscOctave,
  setOscWaveform,
  setOscUnison,
  setOscPan,
  setOscTremoloAmp,
  setOscTremoloFreq,
  setOscEnvelopeAttack,
  setOscEnvelopeDecay,
  setOscEnvelopeSustain,
  setOscEnvelopeRelease,
  setFilterEnvelopeAttack,
  setFilterEnvelopeDecay,
  setFilterEnvelopeSustain,
  setFilterEnvelopeRelease
}
