import { createAppStore } from '../../src/store/app-store';
import { createMemoryRepos } from '../../src/store/repos';
import { clock } from '../../src/lib/clock';
import { DAY } from './helpers';

function freshStore() {
  return createAppStore(createMemoryRepos());
}

describe('app-store', () => {
  afterEach(() => clock.setOffset(0));

  it('onboarding maakt kinderen en start bekende groenten op fase 1', () => {
    const { useAppStore } = freshStore();
    useAppStore.getState().completeOnboarding([
      { name: ' Noor ', color: 'child-1', known: ['wortel', 'tomaat'] },
      { name: 'Sem', color: 'child-2' },
    ]);
    const s = useAppStore.getState();
    expect(s.meta.onboarded).toBe(true);
    expect(s.children.map((c) => c.name)).toEqual(['Noor', 'Sem']);
    expect(s.eatEvents.map((e) => [e.veggieId, e.source])).toEqual([
      ['wortel', 'start'],
      ['tomaat', 'start'],
    ]);
    expect(s.meta.selectedChildId).toBe(s.children[0]!.id);
  });

  it('registreert voor meerdere kinderen en groenten, met daglimiet', () => {
    const { useAppStore } = freshStore();
    const a = useAppStore.getState().addChild({ name: 'Noor', color: 'child-1' });
    const b = useAppStore.getState().addChild({ name: 'Sem', color: 'child-2' });
    const reg = () =>
      useAppStore.getState().registerEats({
        childIds: [a.id, b.id],
        veggieIds: ['wortel', 'broccoli'],
        source: 'raster',
      });
    expect(reg().added).toHaveLength(4);
    expect(reg().added).toHaveLength(4);
    const third = reg();
    expect(third.added).toHaveLength(0);
    expect(third.capped).toHaveLength(4);
    clock.setOffset(DAY);
    expect(reg().added).toHaveLength(4);
  });

  it('ongedaan maken verwijdert precies de toegevoegde registraties', () => {
    const { useAppStore } = freshStore();
    const a = useAppStore.getState().addChild({ name: 'Noor', color: 'child-1' });
    const first = useAppStore
      .getState()
      .registerEats({ childIds: [a.id], veggieIds: ['prei'], source: 'plus' });
    const second = useAppStore
      .getState()
      .registerEats({ childIds: [a.id], veggieIds: ['prei'], source: 'plus' });
    useAppStore.getState().removeEvents(second.added.map((e) => e.id));
    expect(useAppStore.getState().eatEvents.map((e) => e.id)).toEqual(first.added.map((e) => e.id));
  });

  it('een kind verwijderen haalt ook zijn registraties en tuin weg', () => {
    const { useAppStore } = freshStore();
    const a = useAppStore.getState().addChild({ name: 'Noor', color: 'child-1' });
    const b = useAppStore.getState().addChild({ name: 'Sem', color: 'child-2' });
    useAppStore
      .getState()
      .registerEats({ childIds: [a.id, b.id], veggieIds: ['wortel'], source: 'plus' });
    useAppStore.getState().markSeen(a.id, 'wortel', { phase: 1, drops: 0, count: 1 });
    useAppStore.getState().removeChild(a.id);
    const s = useAppStore.getState();
    expect(s.eatEvents.every((e) => e.childId === b.id)).toBe(true);
    expect(s.snapshots[a.id]).toBeUndefined();
    expect(s.meta.selectedChildId).toBe(b.id);
  });

  it('bewaart en laadt opnieuw via de repositories', async () => {
    const repos = createMemoryRepos();
    const first = createAppStore(repos);
    await first.useAppStore.persist.rehydrate();
    first.useAppStore
      .getState()
      .completeOnboarding([{ name: 'Noor', color: 'child-3', known: ['prei'] }]);
    first.useAppStore.getState().toggleFavorite('wortel-tomatensaus');
    await first.storage.flush();

    const second = createAppStore(repos);
    await second.useAppStore.persist.rehydrate();
    const s = second.useAppStore.getState();
    expect(s.children[0]?.name).toBe('Noor');
    expect(s.eatEvents).toHaveLength(1);
    expect(s.settings.favoriteRecipeIds).toEqual(['wortel-tomatensaus']);
    expect(s.meta.onboarded).toBe(true);
  });

  it('boodschappen: recept vervangen, afgevinkte weghalen, leegmaken', () => {
    const { useAppStore } = freshStore();
    const st = () => useAppStore.getState();
    st().addRecipeToShopping('r1', 4, 'verstopt');
    st().addRecipeToShopping('r1', 6, 'zichtbaar');
    expect(st().shopping.recipes).toMatchObject([
      { recipeId: 'r1', servings: 6, variant: 'zichtbaar' },
    ]);
    st().addManualItem('koffie');
    const manualKey = `manual:${st().shopping.manual[0]!.id}`;
    st().setShoppingItemState(manualKey, { bought: true });
    st().setShoppingItemState('wortel|mass', { bought: true });
    st().removeBoughtItems([manualKey, 'wortel|mass']);
    expect(st().shopping.manual).toHaveLength(0);
    expect(st().shopping.items['wortel|mass']).toMatchObject({ hidden: true, bought: false });
    st().clearShopping();
    expect(st().shopping).toEqual({ recipes: [], manual: [], items: {} });
  });
});
