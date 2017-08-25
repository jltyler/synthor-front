const synth = require('./synth')

// Oscillator 1 main knobs
$('#osc1-volume').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  change: val => synth.setOscVolume(val / 100, 0)
})

$('#osc1-detune').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 60,
  height: 60,
  min: -1200,
  max: 1200,
  step: 5,
  change: val => synth.setOscDetune(2 ** (val / 1200), 0)
})

$('#osc1-octave').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 60,
  height: 60,
  min: -2,
  max: 2,
  change: val => synth.setOscOctave(2 ** val, 0)
})

// Oscillator 1 second set of knobs
$('#osc1-waveform').on('change', e => {
  // console.log(e);
  synth.setOscWaveform(e.target.value, 0)
})

$('#osc1-unison').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  min: 1,
  max: 4,
  change: val => synth.setOscUnison(val, 0)
})

$('#osc1-pan').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  min: -1.0,
  max: 1.0,
  steo: 0.1,
  change: val => synth.setOscPan(val, 0)
})

// Osc1 tremolo
$('#osc1-trem-amp').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  min: 0,
  max: 25,
  change: val => synth.setOscTremoloAmp(val, 0)
})

$('#osc1-trem-freq').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 80,
  height: 80,
  min: 0,
  max: 25,
  change: val => synth.setOscTremoloFreq(val, 0)
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
  change: val => synth.setOscEnvelopeAttack(val, 0)
})

$('#osc1-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  change: val => synth.setOscEnvelopeDecay(val, 0)
})

$('#osc1-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  change: val => synth.setOscEnvelopeRelease(val, 0)
})

$('#osc1-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 1,
  step: 0.05,
  change: val => synth.setOscEnvelopeSustain(val, 0)
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
  change: synth.setFilterEnvelopeAttack
})

$('#filter-decay').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  change: synth.setFilterEnvelopeDecay
})

$('#filter-release').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10,
  step: 0.1,
  change: synth.setFilterEnvelopeRelease
})

$('#filter-sustain').knob({
  angleArc: 300,
  angleOffset: -150,
  width: 50,
  height: 50,
  min: 0,
  max: 10000,
  step: 50,
  change: synth.setFilterEnvelopeSustain
})
