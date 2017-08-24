const synth = require('./synth')

// Oscillator 1 knobs
$('#osc1-volume').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  release: val => synth.setOscVolume(val / 100, 0)
})

$('#osc1-waveform').on('change', e => {
  // console.log(e);
  synth.setOscWaveform(e.target.value, 0)
})

// Osc1 envelope
$('#osc1-attack').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: val => synth.setOscEnvelopeAttack(val, 0)
})

$('#osc1-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: val => synth.setOscEnvelopeDecay(val, 0)
})

$('#osc1-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: val => synth.setOscEnvelopeRelease(val, 0)
})

$('#osc1-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 1,
  step: 0.05,
  release: val => synth.setOscEnvelopeSustain(val, 0)
})

// Filter knobs
// Envelope
$('#filter-attack').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: synth.setFilterEnvelopeAttack
})

$('#filter-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: synth.setFilterEnvelopeDecay
})

$('#filter-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  release: synth.setFilterEnvelopeRelease
})

$('#filter-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10000,
  step: 50,
  release: synth.setFilterEnvelopeSustain
})
