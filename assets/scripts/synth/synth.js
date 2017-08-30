// Main context
const audioCtx = new window.AudioContext()

// Ends up being objects of arrays so I can have multiple of the same note playing
const osc1 = {}

// Main gain node for osc1
const osc1GainNode = audioCtx.createGain()
osc1GainNode.gain.value = 0.8
osc1GainNode.connect(audioCtx.destination)

// Compressor to clamp the max output for polyphony
const osc1Compressor = audioCtx.createDynamicsCompressor()
osc1Compressor.connect(osc1GainNode)

const filterOptions = {
  freq: 7500,
  q: 5,
  env: 0,
  tremAmp: 0,
  tremFreq: 0,
  attack: 0.1,
  decay: 0.1,
  sustain: 0.7,
  release: 0.3,
}

const oscOptions = [
  {
    type: 'sawtooth',
    attack: 0.1,
    decay: 0.1,
    sustain: 1.0,
    release: 0.3,
    detune: 1.0,
    octave: 1.0,
    unison: 1,
    pan: 0,
    tremAmp: 0,
    tremFreq: 0
  }
]

const newOscillator = (frequency, oscId) => {
  // console.log('newOscillator');
  const o = audioCtx.createOscillator()
  o.frequency.value = frequency
  o.type = oscOptions[oscId].type
  return o
}

class Voice {
  constructor (frequency, oscId = 0) {
    const now = audioCtx.currentTime
    this.opt = oscOptions[oscId]

    // Osc Tremolo
    this.tremOsc = audioCtx.createOscillator()
    this.tremOsc.frequency.value = this.opt.tremFreq
    this.tremGain = audioCtx.createGain()
    this.tremGain.gain.value = this.opt.tremAmp
    this.tremOsc.connect(this.tremGain)
    this.tremOsc.start()

    // Pan
    this.pan = audioCtx.createStereoPanner()
    this.pan.pan.setValueAtTime(this.opt.pan, now)

    // Gain envelope
    this.env = audioCtx.createGain()
    this.env.gain.setValueAtTime(0.0, now)
    this.env.gain.linearRampToValueAtTime(1, now + this.opt.attack)
    this.env.gain.linearRampToValueAtTime(this.opt.sustain, now + this.opt.attack + this.opt.decay)

    // Filter envelope
    this.fenv = audioCtx.createBiquadFilter()
    this.fenv.Q.setValueAtTime(filterOptions.q, now)
    this.fenv.frequency.setValueAtTime(filterOptions.freq, now)
    this.fenv.frequency.linearRampToValueAtTime(filterOptions.freq + filterOptions.env, now + filterOptions.attack)
    this.fenv.frequency.linearRampToValueAtTime(filterOptions.freq + filterOptions.sustain * filterOptions.env, now + filterOptions.attack + filterOptions.decay)

    // Filter Tremolo
    this.filterTremOsc = audioCtx.createOscillator()
    this.filterTremOsc.frequency.value = filterOptions.tremFreq
    this.filterTremGain = audioCtx.createGain()
    this.filterTremGain.gain.value = filterOptions.tremAmp
    this.filterTremOsc.connect(this.filterTremGain)
    this.filterTremGain.connect(this.fenv.frequency)
    this.filterTremOsc.start()

    // Oscillator(s) and settings
    // Oscillators are created last so I only have to hit the loop once in the
    // case of a unison and starting the oscillators
    this.oscs = []
    const baseFreq = frequency * this.opt.octave * this.opt.detune
    const unisonSpread = 2
    // Create unisons
    if (this.opt.unison > 1) {
      const minFreq = (unisonSpread / 2) * -1
      const inc = unisonSpread / (this.opt.unison - 1)
      for (let i = 0; i < this.opt.unison; i++) {
        const uFreq = minFreq + i * inc
        const o = newOscillator(baseFreq + uFreq, oscId)
        this.tremGain.connect(o.frequency)
        o.connect(this.fenv)
        o.start()
        this.oscs.push(o)
      }
    } else {
      const o = newOscillator(baseFreq, oscId)
      this.tremGain.connect(o.frequency)
      o.connect(this.fenv)
      o.start()
      this.oscs.push(o)
    }

    // Connect the nodes and start
    this.fenv.connect(this.env)
    this.env.connect(this.pan)
    this.pan.connect(osc1Compressor)
  }

  release () {
    const now = audioCtx.currentTime

    // Stop any values and start release
    this.env.gain.cancelScheduledValues(now)
    this.env.gain.setValueAtTime(this.env.gain.value, now)
    this.env.gain.linearRampToValueAtTime(0.0, now + this.opt.release)

    this.fenv.frequency.cancelScheduledValues(now)
    this.fenv.frequency.setValueAtTime(this.fenv.frequency.value, now)
    this.fenv.frequency.linearRampToValueAtTime(filterOptions.freq, now + filterOptions.release)

    // Once release is finished, we stop the oscillator and remove connections
    setTimeout(() => {
      // this.osc.stop()
      // this.osc.disconnect()
      this.oscs.forEach(o => {
        o.stop()
        o.disconnect()
      })
      this.fenv.disconnect()
      this.env.disconnect()
      this.pan.disconnect()
      this.tremOsc.stop()
      this.filterTremOsc.stop()
      this.tremOsc.disconnect()
      this.tremGain.disconnect()
      this.filterTremOsc.disconnect()
      this.filterTremGain.disconnect()
    }, Math.max(this.opt.release, filterOptions.release) * 1000)
  }
}

// Plays a note
const playNote = (note, frequency) => {
  if (!osc1[note]) {
    osc1[note] = [new Voice(frequency, 0)]
  } else {
    osc1[note].push(new Voice(frequency, 0))
  }
}

// Release a note
const stopNote = (note, frequency) => {
  if (osc1[note].length > 0) {
    const voice = osc1[note].shift()
    voice.release()
  }
}

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

const setFilterFreq = value => {
  filterOptions.freq = value
}

const setFilterQ = value => {
  filterOptions.q = value
}

const setFilterEnv = value => {
  filterOptions.env = value
}

const setFilterTremoloAmp = value => {
  filterOptions.tremAmp = value
}

const setFilterTremoloFreq = value => {
  filterOptions.tremFreq = value
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

const displayValues = () => {
  console.log('filterOptions', filterOptions)
  console.log('oscOptions', oscOptions)
}

module.exports = {
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
  setFilterFreq,
  setFilterQ,
  setFilterEnv,
  setFilterTremoloAmp,
  setFilterTremoloFreq,
  setFilterEnvelopeAttack,
  setFilterEnvelopeDecay,
  setFilterEnvelopeSustain,
  setFilterEnvelopeRelease,
  playNote,
  stopNote,
  displayValues
}
