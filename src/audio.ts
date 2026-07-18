type Waveform = (time: number, duration: number, sample: number) => number;

const writeAscii = (view: DataView, offset: number, value: string) => {
  for (let index = 0; index < value.length; index++) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
};

const toBase64 = (bytes: Uint8Array) => {
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
};

const createWavDataUri = (
  duration: number,
  waveform: Waveform,
  volume: number,
  sampleRate = 8000,
) => {
  const sampleCount = Math.floor(duration * sampleRate);
  const bytes = new Uint8Array(44 + sampleCount);
  const view = new DataView(bytes.buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + sampleCount, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, sampleCount, true);

  for (let sample = 0; sample < sampleCount; sample++) {
    const time = sample / sampleRate;
    const value = Math.max(-1, Math.min(1, waveform(time, duration, sample) * volume));
    bytes[44 + sample] = Math.round((value + 1) * 127.5);
  }

  return `data:audio/wav;base64,${toBase64(bytes)}`;
};

const musicWave: Waveform = (time) => {
  const chords = [
    [220, 277.18, 329.63],
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [196, 246.94, 329.63],
  ];
  const chordLength = 3.75;
  const chord = chords[Math.floor(time / chordLength) % chords.length];
  const localTime = time % chordLength;
  const envelope = Math.max(0, Math.min(1, localTime / 0.12, (chordLength - localTime) / 0.3));
  const pad = chord.reduce((sum, frequency) => sum + Math.sin(Math.PI * 2 * frequency * time), 0) / chord.length;
  const bass = Math.sin(Math.PI * chord[0] * time) * 0.35;
  return envelope * (pad * 0.45 + bass);
};

const whooshWave: Waveform = (time, duration, sample) => {
  const progress = time / duration;
  const envelope = Math.sin(Math.PI * progress) ** 1.4;
  const frequency = 160 + 1500 * progress ** 1.5;
  const pseudoNoise = ((Math.sin(sample * 12.9898) * 43758.5453) % 1) * 2 - 1;
  return envelope * (Math.sin(Math.PI * 2 * frequency * time) * 0.7 + pseudoNoise * 0.18);
};

const popWave: Waveform = (time, duration) => {
  const progress = time / duration;
  const envelope = Math.exp(-10 * progress);
  return envelope * (
    Math.sin(Math.PI * 2 * (420 - 200 * progress) * time) +
    Math.sin(Math.PI * 2 * 800 * time) * 0.2
  );
};

export const musicDataUri = createWavDataUri(15, musicWave, 0.22);
export const whooshDataUri = createWavDataUri(0.6, whooshWave, 0.45);
export const popDataUri = createWavDataUri(0.45, popWave, 0.55);
