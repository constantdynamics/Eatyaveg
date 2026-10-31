/** Instellingen voor geluid en stem, bijgewerkt vanuit de store. */
export interface AudioPrefs {
  sound: boolean;
  speech: boolean;
  voiceURI?: string;
}

let prefs: AudioPrefs = { sound: true, speech: true };

export function setAudioPrefs(next: AudioPrefs): void {
  prefs = next;
}

export function getAudioPrefs(): AudioPrefs {
  return prefs;
}
