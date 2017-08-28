module.exports = (useFormName = true) => {
  return {
    patch: {
      name: useFormName ? $('#patch-name-input').val() : $('#patch-name-display').text(),
      osc1Volume: +$('#osc1-volume').val() / 100,
      osc1Octave: +$('#osc1-octave').val(),
      osc1Detune: +$('#osc1-detune').val(),
      osc1Waveform: $('#osc1-waveform').val(),
      osc1Unison: +$('#osc1-unison').val(),
      osc1Panning: +$('#osc1-pan').val(),
      osc1TremoloAmp: +$('#osc1-trem-amp').val(),
      osc1TremoloFreq: +$('#osc1-trem-freq').val(),
      osc1Attack: +$('#osc1-attack').val(),
      osc1Decay: +$('#osc1-decay').val(),
      osc1Sustain: +$('#osc1-sustain').val(),
      osc1Release: +$('#osc1-release').val(),
    }
  }
}
