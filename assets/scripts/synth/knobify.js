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
  width: 100,
  height: 100
}, standardKnob)

const mediumKnob = Object.assign({
  width: 90,
  height: 90
}, standardKnob)

const smallKnob = Object.assign({
  width: 75,
  height: 75
}, standardKnob)

// Standard Attack Decay Release knob
const adrKnob = Object.assign({
  min: 0,
  max: 10,
  step: 0.1
}, smallKnob)

for (let i = 0; i < 2; i++) {
  // Oscillator 1 main knobs
  $('#osc' + (i + 1) + '-volume').knob(Object.assign({
    change: val => synth.setOscVolume(val / 100, i),
    release: val => synth.setOscVolume(val / 100, i)
  }, bigKnob))

  $('#osc' + (i + 1) + '-detune').knob(Object.assign({
    min: -1200,
    max: 1200,
    step: 5,
    change: val => synth.setOscDetune(2 ** (val / 1200), i),
    release: val => synth.setOscDetune(2 ** (val / 1200), i)
  }, mediumKnob))

  $('#osc' + (i + 1) + '-octave').knob(Object.assign({
    min: -2,
    max: 2,
    release: val => synth.setOscOctave(2 ** val, i)
  }, mediumKnob))

  // Oscillator 1 second set of knobs
  $('#osc' + (i + 1) + '-waveform').on('change', e => {
    // console.log(e);
    synth.setOscWaveform(e.target.value, i)
  })

  $('#osc' + (i + 1) + '-unison').knob(Object.assign({
    min: 1,
    max: 4,
    release: val => synth.setOscUnison(val, i)
  }, bigKnob))

  $('#osc' + (i + 1) + '-pan').knob(Object.assign({
    min: -1.0,
    max: 1.0,
    step: 0.05,
    change: val => synth.setOscPan(val, i),
    release: val => synth.setOscPan(val, i),
  }, bigKnob))

  // Osc1 tremolo
  $('#osc' + (i + 1) + '-trem-amp').knob(Object.assign({
    min: 0,
    max: 25,
    change: val => synth.setOscTremoloAmp(val, i),
    release: val => synth.setOscTremoloAmp(val, i),
  }, bigKnob))

  $('#osc' + (i + 1) + '-trem-freq').knob(Object.assign({
    min: 0,
    max: 25,
    change: val => synth.setOscTremoloFreq(val, i),
    release: val => synth.setOscTremoloFreq(val, i),
  }, bigKnob))

  // Osc1 envelope
  $('#osc' + (i + 1) + '-attack').knob(Object.assign({
    change: val => synth.setOscEnvelopeAttack(val, i),
    release: val => synth.setOscEnvelopeAttack(val, i),
  }, adrKnob))

  $('#osc' + (i + 1) + '-decay').knob(Object.assign({
    change: val => synth.setOscEnvelopeDecay(val, i),
    release: val => synth.setOscEnvelopeDecay(val, i),
  }, adrKnob))

  $('#osc' + (i + 1) + '-sustain').knob(Object.assign({
    min: 0,
    max: 1,
    step: 0.05,
    change: val => synth.setOscEnvelopeSustain(val, i),
    release: val => synth.setOscEnvelopeSustain(val, i),
  }, smallKnob))

  $('#osc' + (i + 1) + '-release').knob(Object.assign({
    change: val => synth.setOscEnvelopeRelease(val, i),
    release: val => synth.setOscEnvelopeRelease(val, i),
}, adrKnob))
}

// Filter knobs
// Filter main knobs
$('#filter-freq').knob(Object.assign({
  min: 0,
  max: 15000,
  step: 100,
  change: val => synth.setFilterFreq(val),
  release: val => synth.setFilterFreq(val)
}, bigKnob))

$('#filter-Q').knob(Object.assign({
  min: 0,
  max: 40,
  change: val => synth.setFilterQ(val),
  release: val => synth.setFilterQ(val)
}, mediumKnob))

$('#filter-env').knob(Object.assign({
  min: 0,
  max: 15000,
  step: 100,
  release: val => synth.setFilterEnv(val)
}, mediumKnob))

// Filter tremolo
$('#filter-trem-amp').knob(Object.assign({
  min: 0,
  max: 2000,
  step: 50,
  change: val => synth.setFilterTremoloAmp(val, 0),
  release: val => synth.setFilterTremoloAmp(val, 0),
}, bigKnob))

$('#filter-trem-freq').knob(Object.assign({
  min: 0,
  max: 25,
  change: val => synth.setFilterTremoloFreq(val, 0),
  release: val => synth.setFilterTremoloFreq(val, 0),
}, bigKnob))


// Filter Envelope
$('#filter-attack').knob(Object.assign({
  change: synth.setFilterEnvelopeAttack,
  release: synth.setFilterEnvelopeAttack,
}, adrKnob))

$('#filter-decay').knob(Object.assign({
  change: synth.setFilterEnvelopeDecay,
  release: synth.setFilterEnvelopeDecay,
}, adrKnob))

$('#filter-sustain').knob(Object.assign({
  min: 0,
  max: 1.0,
  step: 0.05,
  change: synth.setFilterEnvelopeSustain,
  release: synth.setFilterEnvelopeSustain,
}, smallKnob))

$('#filter-release').knob(Object.assign({
  change: synth.setFilterEnvelopeRelease,
  release: synth.setFilterEnvelopeRelease,
}, adrKnob))
