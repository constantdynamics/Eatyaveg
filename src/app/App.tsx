import { lazy, Suspense, type ReactNode } from 'react';
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
import { VeggieDetailPage } from '../features/veggie/VeggieDetailPage';
import { RecipesPage } from '../features/recipes/RecipesPage';
import { RecipeDetailPage } from '../features/recipes/RecipeDetailPage';
import { ShoppingPage } from '../features/shopping/ShoppingPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { HelpPage } from '../features/help/HelpPage';
import { AboutPage } from '../features/help/AboutPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';

const GardenPage = lazy(() => import('../features/garden/GardenPage'));
const CookPage = lazy(() => import('../features/cook/CookPage'));
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
