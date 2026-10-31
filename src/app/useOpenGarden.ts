import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { unlockAudio } from '../audio';
import { enterFullscreen } from '../lib/fullscreen';

/**
 * Opent de tuin van een kind. Moet vanuit een tik-handler worden aangeroepen: daar mogen
 * geluid, spraak en volledig scherm worden ontgrendeld.
 */
export function useOpenGarden() {
  const navigate = useNavigate();
  return useCallback(
    (childId: string, focus?: string) => {
      unlockAudio();
      enterFullscreen();
      const query = focus ? `?focus=${encodeURIComponent(focus)}` : '';
      void navigate(`/tuin/${encodeURIComponent(childId)}${query}`);
    },
    [navigate],
  );
}
