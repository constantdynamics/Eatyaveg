/** "Zet op beginscherm": vangt de installatievraag van Chromium op en geeft een hint per platform. */
import { useSyncExternalStore } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    emit();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCanInstall(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => deferred !== null,
    () => false,
  );
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  const choice = await deferred.userChoice;
  deferred = null;
  emit();
  return choice.outcome === 'accepted';
}

export type Platform = 'ios' | 'android' | 'other';

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const iPadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  if (/iPhone|iPad|iPod/.test(ua) || iPadOs) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export const INSTALL_HINT: Record<Platform, string> = {
  ios: 'Tik in Safari op het deelicoon en kies "Zet op beginscherm".',
  android: 'Kies in het menu van Chrome "App installeren" of "Toevoegen aan startscherm".',
  other: 'Kies in het menu van je browser "Installeren" of "Toevoegen aan beginscherm".',
};
