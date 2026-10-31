import { listDutchVoices, pickVoice, speak } from '../../src/audio/voice';
import { setAudioPrefs } from '../../src/audio/prefs';

function voice(name: string, lang: string, local: boolean): SpeechSynthesisVoice {
  return {
    name,
    lang,
    localService: local,
    voiceURI: name,
    default: false,
  } as SpeechSynthesisVoice;
}

function installSynth(voices: SpeechSynthesisVoice[]) {
  const speakSpy = vi.fn();
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: () => voices,
      speak: speakSpy,
      cancel: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  return speakSpy;
}

describe('stem kiezen (§8.5)', () => {
  beforeEach(() => setAudioPrefs({ sound: true, speech: true }));

  it('alleen Nederlandse stemmen, eerst nl-NL op het apparaat, dan nl-BE, dan via internet', () => {
    installSynth([
      voice('Samantha', 'en-US', true),
      voice('Google Nederlands', 'nl-NL', false),
      voice('Ellen', 'nl-BE', true),
      voice('Xander', 'nl-NL', true),
    ]);
    expect(listDutchVoices().map((v) => v.name)).toEqual(['Xander', 'Ellen', 'Google Nederlands']);
    expect(pickVoice()?.name).toBe('Xander');
  });

  it('een stem via internet alleen als de ouder die zelf kiest', () => {
    installSynth([voice('Google Nederlands', 'nl-NL', false)]);
    expect(pickVoice()).toBeUndefined();
    setAudioPrefs({ sound: true, speech: true, voiceURI: 'Google Nederlands' });
    expect(pickVoice()?.name).toBe('Google Nederlands');
  });

  it('nooit een anderstalige stem: zonder Nederlandse stem geen spraak', async () => {
    const spy = installSynth([voice('Samantha', 'en-US', true)]);
    vi.useFakeTimers();
    const done = speak('Hoi Noor!');
    vi.runAllTimers();
    await done;
    vi.useRealTimers();
    expect(spy).not.toHaveBeenCalled();
  });

  it('spreekt met een Nederlandse stem, iets langzamer en hoger', () => {
    const spy = installSynth([voice('Xander', 'nl-NL', true)]);
    class FakeUtterance {
      text: string;
      voice: unknown;
      lang = '';
      rate = 1;
      pitch = 1;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
    void speak('Hoi Noor!');
    const u = spy.mock.calls[0]![0] as FakeUtterance;
    expect(u.lang).toBe('nl-NL');
    expect(u.rate).toBeLessThan(1);
    expect(u.pitch).toBeGreaterThan(1);
    vi.unstubAllGlobals();
  });
});
