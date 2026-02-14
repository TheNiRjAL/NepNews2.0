// Simple synth based sound effects to avoid external assets and reduce latency
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const playSound = (type: 'card' | 'shuffle' | 'win' | 'turn' | 'bid') => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'card') {
      // Swish/Click sound - High pitch short burst
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
      gain.gain.setValueAtTime(0.05, t); // Lower volume
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'win') {
      // Ding/Chime - Two tones
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    } else if (type === 'shuffle') {
      // Noise-like shh-shh (Approximated with Sawtooth)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(50, t + 0.15);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
      
      // Play a second one slightly delayed
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(120, t + 0.1);
        gain2.gain.setValueAtTime(0.05, t + 0.1);
        gain2.gain.linearRampToValueAtTime(0, t + 0.25);
        osc2.start(t + 0.1);
        osc2.stop(t + 0.25);
      }, 100);

    } else if (type === 'bid') {
      // Soft interaction blip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  } catch (e) {
    // Ignore audio errors
    console.error(e);
  }
};