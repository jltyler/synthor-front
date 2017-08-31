// Main context
const audioCtx = new window.AudioContext()

// Ends up being objects of arrays so I can have multiple of the same note playing
const osc1 = {}
const osc2 = {}

// Global Compressor
const globalCompressor = audioCtx.createDynamicsCompressor()
globalCompressor.connect(audioCtx.destination)

// Global volume node
const globalVolumeGain = audioCtx.createGain()
globalVolumeGain.gain.value = 1.0
globalVolumeGain.connect(globalCompressor)

// Main gain node for osc1
const osc1GainNode = audioCtx.createGain()
osc1GainNode.gain.value = 0.5
osc1GainNode.connect(globalVolumeGain)

// Compressor to clamp the max output for polyphony
const osc1Compressor = audioCtx.createDynamicsCompressor()
osc1Compressor.connect(osc1GainNode)

// Main gain node for osc2
const osc2GainNode = audioCtx.createGain()
osc2GainNode.gain.value = 0.5
osc2GainNode.connect(globalVolumeGain)

// Compressor to clamp the max output for polyphony
const osc2Compressor = audioCtx.createDynamicsCompressor()
osc2Compressor.connect(osc2GainNode)

const compressors = [osc1Compressor, osc2Compressor]

const filterOptions = {
  freq: 7500,
  q: 5,
  env: 0,
  tremWaveform: 'sine',
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
    tremWaveform: 'sine',
    tremAmp: 0,
    tremFreq: 0
  },
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
    tremWaveform: 'sine',
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
    this.tremOsc.type = this.opt.tremWaveform
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
    this.filterTremOsc.type = filterOptions.tremWaveform
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
    this.pan.connect(compressors[oscId])
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

const frequencyFromNum = function (note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

// Plays a note
const playNote = (note, frequency) => {
  // console.log('synth.playNote', note, frequency);
  if (!osc1[note]) {
    osc1[note] = [new Voice(frequencyFromNum(note), 0)]
  } else {
    osc1[note].push(new Voice(frequencyFromNum(note), 0))
  }
  if (!osc2[note]) {
    osc2[note] = [new Voice(frequencyFromNum(note), 1)]
  } else {
    osc2[note].push(new Voice(frequencyFromNum(note), 1))
  }
}

// Release a note
const stopNote = (note, frequency) => {
  if (osc1[note] && osc1[note].length > 0) {
    const voice = osc1[note].shift()
    voice.release()
  }
  if (osc2[note] && osc2[note].length > 0) {
    const voice = osc2[note].shift()
    voice.release()
  }
}

const setOscVolume = (value, osc = 0) => {
  if (osc === 0) {
    osc1GainNode.gain.value = value
  } else {
    osc2GainNode.gain.value = value
  }
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

const setOscTremoloWaveform = (value, osc = 0) => {
  oscOptions[osc].tremWaveform = value
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

const setFilterTremoloWaveform = value => {
  filterOptions.tremWaveform = value
}

const setFilterTremoloAmp = value => {
  filterOptions.tremAmp = value
}

const setFilterTremoloFreq = value => {
  filterOptions.tremFreq = value
}

const setFilterEnvelopeAttack = value => {
  filterOptions.attack = value
}

const setFilterEnvelopeDecay = value => {
  filterOptions.decay = value
}

const setFilterEnvelopeSustain = value => {
  filterOptions.sustain = value
}

const setFilterEnvelopeRelease = value => {
  filterOptions.release = value
}

const setGlobalVolume = value => {
  globalVolumeGain.gain.value = value
}

const displayValues = () => {
  // console.log('filterOptions', filterOptions)
  // console.log('oscOptions', oscOptions)
}

module.exports = {
  setOscVolume,
  setOscDetune,
  setOscOctave,
  setOscWaveform,
  setOscUnison,
  setOscPan,
  setOscTremoloWaveform,
  setOscTremoloAmp,
  setOscTremoloFreq,
  setOscEnvelopeAttack,
  setOscEnvelopeDecay,
  setOscEnvelopeSustain,
  setOscEnvelopeRelease,
  setFilterFreq,
  setFilterQ,
  setFilterEnv,
  setFilterTremoloWaveform,
  setFilterTremoloAmp,
  setFilterTremoloFreq,
  setFilterEnvelopeAttack,
  setFilterEnvelopeDecay,
  setFilterEnvelopeSustain,
  setFilterEnvelopeRelease,
  playNote,
  stopNote,
  setGlobalVolume,
  displayValues,
}
