// Simple synthesizer for UI sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

export const playTick = () => {
  // A short synth pop for ticking through teams
  playTone(800, 'square', 0.05, 0.05);
};

export const playSelect = () => {
  // A higher pitch ding when a team is selected
  playTone(1200, 'sine', 0.2, 0.1);
};

export const playSuccess = () => {
  // A chord or sequence for finishing the draw
  playTone(523.25, 'sine', 0.3, 0.1); // C5
  setTimeout(() => playTone(659.25, 'sine', 0.4, 0.1), 100); // E5
  setTimeout(() => playTone(783.99, 'sine', 0.5, 0.1), 200); // G5
  setTimeout(() => playTone(1046.50, 'square', 0.8, 0.1), 300); // C6
};
