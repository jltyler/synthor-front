const synth = require('./synth')

// Settings that apply to all knobs
const standardKnob = {
  angleArc: 300,
  angleOffset: -150,
  fgColor: 'rgb(90, 0, 255)',
  inputColor: 'rgb(180, 90, 255)',
  bgColor: '#111'
}

// Standardized sizes for knobs
const bigKnob = Object.assign({
  width: 80,
  height: 80
}, standardKnob)

const mediumKnob = Object.assign({
  width: 60,
  height: 60
}, standardKnob)

const smallKnob = Object.assign({
  width: 50,
  height: 50
}, standardKnob)

// Oscillator 1 main knobs
$('#osc1-volume').knob(Object.assign({
  change: val => synth.setOscVolume(val / 100, 0)
}, bigKnob))

$('#osc1-detune').knob(Object.assign({
  min: -1200,
  max: 1200,
  step: 5,
  change: val => synth.setOscDetune(2 ** (val / 1200), 0),
  release: val => synth.setOscDetune(2 ** (val / 1200), 0)
}, mediumKnob))

$('#osc1-octave').knob(Object.assign({
  min: -2,
  max: 2,
  release: val => synth.setOscOctave(2 ** val, 0)
}, mediumKnob))

// Oscillator 1 second set of knobs
$('#osc1-waveform').on('change', e => {
  // console.log(e);
  synth.setOscWaveform(e.target.value, 0)
})

$('#osc1-unison').knob(Object.assign({
  min: 1,
  max: 4,
  change: val => synth.setOscUnison(val, 0)
}, bigKnob))

$('#osc1-pan').knob(Object.assign({
  min: -1.0,
  max: 1.0,
  step: 0.05,
  change: val => synth.setOscPan(val, 0)
}, bigKnob))

// Osc1 tremolo
$('#osc1-trem-amp').knob(Object.assign({
  min: 0,
  max: 25,
  change: val => synth.setOscTremoloAmp(val, 0)
}, bigKnob))

$('#osc1-trem-freq').knob(Object.assign({
  min: 0,
  max: 25,
  change: val => synth.setOscTremoloFreq(val, 0)
}, bigKnob))

// Standard Attack Decay Release knob
const adrKnob = Object.assign({
  min: 0,
  max: 10,
  step: 0.1
}, smallKnob)

// Osc1 envelope
$('#osc1-attack').knob(Object.assign({
  change: val => synth.setOscEnvelopeAttack(val, 0)
}, adrKnob))

$('#osc1-decay').knob(Object.assign({
  change: val => synth.setOscEnvelopeDecay(val, 0)
}, adrKnob))

$('#osc1-release').knob(Object.assign({
  change: val => synth.setOscEnvelopeRelease(val, 0)
}, adrKnob))

$('#osc1-sustain').knob(Object.assign({
  min: 0,
  max: 1,
  step: 0.05,
  change: val => synth.setOscEnvelopeSustain(val, 0)
}, smallKnob))

// Filter knobs
// Envelope
$('#filter-attack').knob(Object.assign({
  change: synth.setFilterEnvelopeAttack
}, adrKnob))

$('#filter-decay').knob(Object.assign({
  change: synth.setFilterEnvelopeDecay
}, adrKnob))

$('#filter-release').knob(Object.assign({
  change: synth.setFilterEnvelopeRelease
}, adrKnob))

$('#filter-sustain').knob(Object.assign({
  min: 0,
  max: 10000,
  step: 50,
  change: synth.setFilterEnvelopeSustain
}, smallKnob))
