import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './app/App';
import { setAudioPrefs } from './audio';
import { useAppStore } from './store/app-store';

// Geluid en stem volgen de instellingen.
const syncAudio = (s: ReturnType<typeof useAppStore.getState>) =>
  setAudioPrefs({
    sound: s.settings.sound,
    speech: s.settings.speech,
    voiceURI: s.settings.voiceURI,
  });
syncAudio(useAppStore.getState());
useAppStore.subscribe(syncAudio);

const root = document.getElementById('root');
if (!root) throw new Error('Root-element ontbreekt');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
