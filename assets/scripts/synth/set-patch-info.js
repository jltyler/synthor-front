module.exports = (patch) => {
  $('#osc1-volume').val(patch.osc1Volume * 100).trigger('change')
  $('#osc1-octave').val(patch.osc1Octave).trigger('change')
  $('#osc1-detune').val(patch.osc1Detune).trigger('change')
  $('#osc1-waveform').val(patch.osc1Waveform).trigger('change')
  $('#osc1-unison').val(patch.osc1Unison).trigger('change')
  $('#osc1-pan').val(patch.osc1Panning).trigger('change')
  $('#osc1-trem-amp').val(patch.osc1TremoloAmp).trigger('change')
  $('#osc1-trem-freq').val(patch.osc1TremoloFreq).trigger('change')
  $('#osc1-attack').val(patch.osc1Attack).trigger('change')
  $('#osc1-decay').val(patch.osc1Decay).trigger('change')
  $('#osc1-sustain').val(patch.osc1Sustain).trigger('change')
  $('#osc1-release').val(patch.osc1Release).trigger('change')
}
