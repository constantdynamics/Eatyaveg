import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router';
import { useAppStore } from '../store/app-store';
import { ErrorBoundary } from './ErrorBoundary';
import { HydrationGate } from './HydrationGate';
import { ParentLayout } from './ParentLayout';
import { UpdatePrompt } from './UpdatePrompt';
import { NotFound } from './NotFound';
import { isDevPanelEnabled } from '../features/dev/dev-flag';
import { TodayPage } from '../features/today/TodayPage';
import { LoggingPage } from '../features/logging/LoggingPage';

// Minder gebruikte schermen pas laden als ze nodig zijn (Vandaag en Gegeten blijven direct).
const load = {
  veggie: () => import('../features/veggie/VeggieDetailPage'),
  recipes: () => import('../features/recipes/RecipesPage'),
  recipe: () => import('../features/recipes/RecipeDetailPage'),
  shopping: () => import('../features/shopping/ShoppingPage'),
  settings: () => import('../features/settings/SettingsPage'),
  help: () => import('../features/help/HelpPage'),
  about: () => import('../features/help/AboutPage'),
  onboarding: () => import('../features/onboarding/OnboardingPage'),
  garden: () => import('../features/garden/GardenPage'),
  cook: () => import('../features/cook/CookPage'),
};
const VeggieDetailPage = lazy(() => load.veggie().then((m) => ({ default: m.VeggieDetailPage })));
const RecipesPage = lazy(() => load.recipes().then((m) => ({ default: m.RecipesPage })));
const RecipeDetailPage = lazy(() => load.recipe().then((m) => ({ default: m.RecipeDetailPage })));
const ShoppingPage = lazy(() => load.shopping().then((m) => ({ default: m.ShoppingPage })));
const SettingsPage = lazy(() => load.settings().then((m) => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => load.help().then((m) => ({ default: m.HelpPage })));
const AboutPage = lazy(() => load.about().then((m) => ({ default: m.AboutPage })));
const OnboardingPage = lazy(() => load.onboarding().then((m) => ({ default: m.OnboardingPage })));

/** Na het opstarten, als de browser even niets te doen heeft: alvast inladen. */
function prefetchRoutes() {
  const run = () => Object.values(load).forEach((fn) => void fn().catch(() => undefined));
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}

const GardenPage = lazy(load.garden);
const CookPage = lazy(load.cook);
const DevPanel = lazy(() => import('../features/dev/DevPanel'));
const CharacterGallery = lazy(() => import('../features/dev/CharacterGallery'));

function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
      <p className="font-heading text-lg font-bold text-ink-soft">Even laden…</p>
    </div>
  );
}

/** Eerste keer → onboarding; daarna nooit meer. */
function OnboardingGuard({ children }: { children: ReactNode }) {
  const onboarded = useAppStore((s) => s.meta.onboarded);
  const hasChildren = useAppStore((s) => s.children.length > 0);
  const location = useLocation();
  const atWelcome = location.pathname === '/welkom';
  if (location.pathname.startsWith('/dev/')) return <>{children}</>;
  if ((!onboarded || !hasChildren) && !atWelcome) return <Navigate to="/welkom" replace />;
  if (onboarded && hasChildren && atWelcome) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  useEffect(prefetchRoutes, []);
  return (
    <ErrorBoundary>
      <HashRouter>
        <HydrationGate>
          <OnboardingGuard>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/welkom" element={<OnboardingPage />} />
                {isDevPanelEnabled() && (
                  <Route path="/dev/vriendjes" element={<CharacterGallery />} />
                )}
                <Route path="/tuin/:kindId" element={<GardenPage />} />
                <Route path="/recepten/:id/koken" element={<CookPage />} />
                <Route element={<ParentLayout />}>
                  <Route index element={<TodayPage />} />
                  <Route path="gegeten" element={<LoggingPage />} />
                  <Route path="groenten/:id" element={<VeggieDetailPage />} />
                  <Route path="recepten" element={<RecipesPage />} />
                  <Route path="recepten/:id" element={<RecipeDetailPage />} />
                  <Route path="boodschappen" element={<ShoppingPage />} />
                  <Route path="instellingen" element={<SettingsPage />} />
                  <Route path="hulp" element={<HelpPage />} />
                  <Route path="over" element={<AboutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </OnboardingGuard>
          {isDevPanelEnabled() && (
            <Suspense fallback={null}>
              <DevPanel />
            </Suspense>
          )}
        </HydrationGate>
      </HashRouter>
      <UpdatePrompt />
    </ErrorBoundary>
  );
}
