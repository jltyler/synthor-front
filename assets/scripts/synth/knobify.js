const synth = require('./synth')

const standardKnobColor = 'rgb(120, 30, 255)'
const standardTextColor = 'rgb(200, 110, 255)'
const greenKnobColor = 'rgb(30, 200, 30)'
const greenTextColor = 'rgb(130, 255, 130)'
const blueKnobColor = 'rgb(20, 20, 230)'
const blueTextColor = 'rgb(100, 100, 255)'
const orangeKnobColor = 'rgb(200, 100, 30)'
const orangeTextColor = 'rgb(255, 127, 60)'
const redKnobColor = 'rgb(230, 20, 20)'
const redTextColor = 'rgb(255, 100, 100)'

// Settings that apply to all knobs
const standardKnob = {
  angleArc: 300,
  angleOffset: -150,
  fgColor: standardKnobColor,
  inputColor: standardTextColor,
  bgColor: '#001'
}

const greenKnob = {
  fgColor: greenKnobColor,
  inputColor: greenTextColor
}

const blueKnob = {
  fgColor: blueKnobColor,
  inputColor: blueTextColor
}

const orangeKnob = {
  fgColor: orangeKnobColor,
  inputColor: orangeTextColor
}

const redKnob = {
  fgColor: redKnobColor,
  inputColor: redTextColor
}

// Standardized sizes for knobs
const bigKnob = Object.assign({
  width: 120,
  height: 120,
  thickness: 0.4
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
  step: 0.05
}, smallKnob)

for (let i = 0; i < 2; i++) {
  // Oscillator 1 main knobs
  $('#osc' + (i + 1) + '-volume').knob(Object.assign({
    change: val => synth.setOscVolume(val / 100, i),
    release: val => synth.setOscVolume(val / 100, i)
  }, bigKnob, greenKnob))

  $('#osc' + (i + 1) + '-detune').knob(Object.assign({
    min: -1200,
    max: 1200,
    // step: 5,
    change: val => synth.setOscDetune(2 ** (val / 1200), i),
    release: val => synth.setOscDetune(2 ** (val / 1200), i)
  }, mediumKnob, blueKnob))

  $('#osc' + (i + 1) + '-octave').knob(Object.assign({
    min: -2,
    max: 2,
    release: val => synth.setOscOctave(2 ** val, i)
  }, mediumKnob, blueKnob))

  // Oscillator 1 second set of knobs
  $('#osc' + (i + 1) + '-waveform').on('change', e => {
    // console.log(e);
    synth.setOscWaveform(e.target.value, i)
  })

  $('#osc' + (i + 1) + '-unison').knob(Object.assign({
    min: 1,
    max: 8,
    release: val => synth.setOscUnison(val, i)
  }, bigKnob, redKnob))

  $('#osc' + (i + 1) + '-pan').knob(Object.assign({
    min: -1.0,
    max: 1.0,
    step: 0.05,
    change: val => synth.setOscPan(val, i),
    release: val => synth.setOscPan(val, i),
  }, bigKnob))

  // Osc1 tremolo
  $('#osc' + (i + 1) + '-trem-waveform').on('change', e => {
    // console.log(e);
    synth.setOscTremoloWaveform(e.target.value, i)
  })

  $('#osc' + (i + 1) + '-trem-amp').knob(Object.assign({
    min: 0,
    max: 80,
    change: val => synth.setOscTremoloAmp(val, i),
    release: val => synth.setOscTremoloAmp(val, i),
  }, bigKnob))

  $('#osc' + (i + 1) + '-trem-freq').knob(Object.assign({
    min: 0,
    max: 25,
    step: 0.1,
    change: val => synth.setOscTremoloFreq(val, i),
    release: val => synth.setOscTremoloFreq(val, i),
  }, bigKnob, greenKnob))

  // Osc1 envelope
  $('#osc' + (i + 1) + '-attack').knob(Object.assign({
    change: val => synth.setOscEnvelopeAttack(val, i),
    release: val => synth.setOscEnvelopeAttack(val, i),
  }, adrKnob, redKnob))

  $('#osc' + (i + 1) + '-decay').knob(Object.assign({
    change: val => synth.setOscEnvelopeDecay(val, i),
    release: val => synth.setOscEnvelopeDecay(val, i),
  }, adrKnob, blueKnob))

  $('#osc' + (i + 1) + '-sustain').knob(Object.assign({
    min: 0,
    max: 1,
    step: 0.05,
    change: val => synth.setOscEnvelopeSustain(val, i),
    release: val => synth.setOscEnvelopeSustain(val, i),
  }, smallKnob, greenKnob))

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
}, bigKnob, greenKnob))

$('#filter-Q').knob(Object.assign({
  min: 0,
  max: 25,
  change: val => synth.setFilterQ(val),
  release: val => synth.setFilterQ(val)
}, mediumKnob, orangeKnob))

$('#filter-env').knob(Object.assign({
  min: 0,
  max: 15000,
  step: 100,
  release: val => synth.setFilterEnv(val)
}, mediumKnob, blueKnob))

// Filter tremolo
$('#filter-trem-waveform').on('change', e => {
  synth.setFilterTremoloWaveform(e.target.value)
})

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
  step: 0.1,
  change: val => synth.setFilterTremoloFreq(val, 0),
  release: val => synth.setFilterTremoloFreq(val, 0),
}, bigKnob))

// Filter Envelope
$('#filter-attack').knob(Object.assign({
  change: synth.setFilterEnvelopeAttack,
  release: synth.setFilterEnvelopeAttack,
}, adrKnob, redKnob))

$('#filter-decay').knob(Object.assign({
  change: synth.setFilterEnvelopeDecay,
  release: synth.setFilterEnvelopeDecay,
}, adrKnob, blueKnob))

$('#filter-sustain').knob(Object.assign({
  min: 0,
  max: 1.0,
  step: 0.05,
  change: synth.setFilterEnvelopeSustain,
  release: synth.setFilterEnvelopeSustain,
}, smallKnob, greenKnob))

$('#filter-release').knob(Object.assign({
  change: synth.setFilterEnvelopeRelease,
  release: synth.setFilterEnvelopeRelease,
}, adrKnob))

// Settings bar
$('#global-volume').knob(Object.assign({
  width: 240,
  height: 240,
  change: val => synth.setGlobalVolume(val / 100),
  release: val => synth.setGlobalVolume(val / 100),
}, standardKnob, greenKnob))
