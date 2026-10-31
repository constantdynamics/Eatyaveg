/** Dev-acties die de app met ?dev=1 op window zet (zie src/features/dev/dev-actions.ts). */
export {};

declare global {
  interface Window {
    __fvDev?: {
      addEvents(childId: string, veggieId: string, count: number): void;
      setPhase(childId: string, veggieId: string, phase: number): void;
      showcase(childId: string): void;
      replay(childId: string): void;
    };
  }
}
