/**
 * Geluid en stem voor de tuin. Ontgrendel altijd binnen een tik-handler (browsers blokkeren
 * autoplay). Zonder Nederlandse stem: geen spraak, wel geluid en animatie.
 */
export { unlockAudio } from './unlock';
export { playSound, type SoundName } from './sounds';
export { speak, cancelSpeech, estimateSpeechMs } from './voice';
export { setAudioPrefs, getAudioPrefs } from './prefs';
