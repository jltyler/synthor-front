module.exports = () => {
  // console.log('getPatchInfo');
  return {
    patch: {
      name: $('#patch-name-input').val(),
      isPrivate: $('#patch-private').val() === 't',
      osc1Volume: +$('#osc1-volume').val() / 100,
      osc1Octave: +$('#osc1-octave').val(),
      osc1Detune: +$('#osc1-detune').val(),
      osc1Waveform: $('#osc1-waveform').val(),
      osc1Unison: +$('#osc1-unison').val(),
      osc1Panning: +$('#osc1-pan').val(),
      osc1TremoloWaveform: $('#osc1-trem-waveform').val(),
      osc1TremoloAmp: +$('#osc1-trem-amp').val(),
      osc1TremoloFreq: +$('#osc1-trem-freq').val(),
      osc1Attack: +$('#osc1-attack').val(),
      osc1Decay: +$('#osc1-decay').val(),
      osc1Sustain: +$('#osc1-sustain').val(),
      osc1Release: +$('#osc1-release').val(),
      osc2Volume: +$('#osc2-volume').val() / 100,
      osc2Octave: +$('#osc2-octave').val(),
      osc2Detune: +$('#osc2-detune').val(),
      osc2Waveform: $('#osc2-waveform').val(),
      osc2Unison: +$('#osc2-unison').val(),
      osc2Panning: +$('#osc2-pan').val(),
      osc2TremoloWaveform: $('#osc2-trem-waveform').val(),
      osc2TremoloAmp: +$('#osc2-trem-amp').val(),
      osc2TremoloFreq: +$('#osc2-trem-freq').val(),
      osc2Attack: +$('#osc2-attack').val(),
      osc2Decay: +$('#osc2-decay').val(),
      osc2Sustain: +$('#osc2-sustain').val(),
      osc2Release: +$('#osc2-release').val(),
      filterFrequency: +$('#filter-freq').val(),
      filterQ: +$('#filter-Q').val(),
      filterEnv: +$('#filter-env').val(),
      filterTremoloWaveform: $('#filter-trem-waveform').val(),
      filterTremoloAmp: +$('#filter-trem-amp').val(),
      filterTremoloFreq: +$('#filter-trem-freq').val(),
      filterAttack: +$('#filter-attack').val(),
      filterDecay: +$('#filter-decay').val(),
      filterSustain: +$('#filter-sustain').val(),
      filterRelease: +$('#filter-release').val(),
    }
  }
}
