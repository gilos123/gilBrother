export class AudioFeedback {
  constructor() {
    this.audioContext = null;
  }

  async initAudioContext() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      return this.audioContext;
    } catch (error) {
      console.error("Error initializing audio context:", error);
      return null;
    }
  }

  async playCorrectSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Error playing correct sound:", error);
    }
  }

  async playIncorrectSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
      oscillator.frequency.setValueAtTime(196, this.audioContext.currentTime + 0.2); // G3

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.4);
    } catch (error) {
      console.error("Error playing incorrect sound:", error);
    }
  }

  async playTriumphSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      // Play a triumphant chord progression
      const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const startTime = this.audioContext.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, startTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.2, startTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.0);

        oscillator.start(startTime + index * 0.1);
        oscillator.stop(startTime + 1.0);
      });
    } catch (error) {
      console.error("Error playing triumph sound:", error);
    }
  }

  async playSuccessSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4
      oscillator.frequency.setValueAtTime(554.37, this.audioContext.currentTime + 0.15); // C#5

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing success sound:", error);
    }
  }

  async playLevelUpSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      // Play an ascending scale
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      const startTime = this.audioContext.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(freq, startTime + index * 0.1);
        gainNode.gain.setValueAtTime(0.2, startTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.1 + 0.15);

        oscillator.start(startTime + index * 0.1);
        oscillator.stop(startTime + index * 0.1 + 0.15);
      });
    } catch (error) {
      console.error("Error playing level up sound:", error);
    }
  }

  async playFailureSound() {
    try {
      await this.initAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(196, this.audioContext.currentTime); // G3
      oscillator.frequency.setValueAtTime(174.61, this.audioContext.currentTime + 0.2); // F3
      oscillator.frequency.setValueAtTime(146.83, this.audioContext.currentTime + 0.4); // D3

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.6);
    } catch (error) {
      console.error("Error playing failure sound:", error);
    }
  }
}