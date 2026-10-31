import { useCallback } from 'react';
import { useOpenGarden } from '../../app/useOpenGarden';
import { VEGGIE_BY_ID } from '../../content/veggies';
import type { Child, VeggieId } from '../../domain/types';
import { nl } from '../../i18n/nl';
import { useAppStore } from '../../store/app-store';
import { useUiStore } from '../../store/ui-store';

/** Plusknop: één registratie, met Ongedaan maken en Toon aan [naam] in de snackbar. */
export function useQuickRegister() {
  const register = useAppStore((s) => s.registerEats);
  const removeEvents = useAppStore((s) => s.removeEvents);
  const dailyCap = useAppStore((s) => s.settings.dailyCap);
  const showSnackbar = useUiStore((s) => s.showSnackbar);
  const openGarden = useOpenGarden();

  return useCallback(
    (child: Child, veggieId: VeggieId) => {
      const veggie = VEGGIE_BY_ID[veggieId];
      const result = register({ childIds: [child.id], veggieIds: [veggieId], source: 'plus' });
      if (result.added.length === 0) {
        showSnackbar({
          text: `${veggie.name} telde vandaag al ${dailyCap} keer mee voor ${child.name}. Morgen weer een kans!`,
        });
        return;
      }
      const ids = result.added.map((e) => e.id);
      showSnackbar({
        text: `${veggie.name} aangetikt voor ${child.name}.`,
        actions: [
          { label: nl.common.undo, onClick: () => removeEvents(ids) },
          { label: nl.common.showTo(child.name), onClick: () => openGarden(child.id) },
        ],
      });
    },
    [register, removeEvents, dailyCap, showSnackbar, openGarden],
  );
}
