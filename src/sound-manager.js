export class SoundManager {
    constructor() {
        this.laserSoundPath = 'assets/Laser-pew-sound-effect.mp3';
        this.lazerBeamSoundPath = 'assets/482280__seanporio__lazer-pluck-9.wav';
        this.audioContext = null;
        this.sounds = {};
        this.loopingLazerSound = null;
    }

    playSound(soundPath) {
        try {
            const audio = new Audio(soundPath);
            audio.volume = 0.5;
            audio.play().catch(error => {
                console.warn('Could not play sound:', error);
            });
        } catch (error) {
            console.warn('Sound play error:', error);
        }
    }

    playLaserSound() {
        this.playSound(this.laserSoundPath);
    }

    playLoopingLazerSound() {
        try {
            if (this.loopingLazerSound) {
                this.loopingLazerSound.pause();
                this.loopingLazerSound.currentTime = 0;
            }

            const audio = new Audio(this.lazerBeamSoundPath);
            audio.volume = 0.5;
            audio.loop = true;
            audio.play().catch(error => {
                console.warn('Could not play looping lazer sound:', error);
            });
            this.loopingLazerSound = audio;
        } catch (error) {
            console.warn('Looping lazer sound play error:', error);
        }
    }

    stopLoopingLazerSound() {
        if (this.loopingLazerSound) {
            this.loopingLazerSound.pause();
            this.loopingLazerSound.currentTime = 0;
            this.loopingLazerSound = null;
        }
    }
}

export const soundManager = new SoundManager();
