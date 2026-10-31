import { Suspense, useState, type ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router';
import { BookOpen, Plus, ShoppingBasket, Sprout, Sun } from 'lucide-react';
import { nl } from '../i18n/nl';
import { useAppStore } from '../store/app-store';
import { SnackbarHost } from '../components/SnackbarHost';
import { ChildPickerDialog } from './ChildPickerDialog';
import { useOpenGarden } from './useOpenGarden';

const ICON = { size: 24, strokeWidth: 2, 'aria-hidden': true } as const;

/** Elk icoon in een even groot vak, zodat de labels op één lijn staan. */
function IconBox({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-8 w-8 items-center justify-center">{children}</span>;
}

function navClass({ isActive }: { isActive: boolean }) {
  return `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-card px-1 text-sm font-bold transition-colors duration-200 ease-out md:flex-none md:flex-row md:justify-start md:gap-3 md:px-4 md:text-base ${
    isActive ? 'text-accent-strong md:bg-accent-soft' : 'text-ink-soft hover:text-ink'
  }`;
}

function GardenNavButton() {
  const childrenList = useAppStore((s) => s.children);
  const selected = useAppStore((s) => s.meta.selectedChildId);
  const openGarden = useOpenGarden();
  const [picking, setPicking] = useState(false);

  return (
    <>
      <button
        type="button"
        className={navClass({ isActive: false })}
        onClick={() => {
          if (childrenList.length === 1 && childrenList[0]) openGarden(childrenList[0].id);
          else if (childrenList.length > 1) setPicking(true);
          else if (selected) openGarden(selected);
        }}
      >
        <IconBox>
          <Sprout {...ICON} />
        </IconBox>
        <span>{nl.nav.garden}</span>
      </button>
      <ChildPickerDialog
        open={picking}
        onClose={() => setPicking(false)}
        onPick={(id) => {
          setPicking(false);
          openGarden(id);
        }}
      />
    </>
  );
}

/** Ouder-app: rustige onderbalk op de telefoon, zijbalk op de tablet (§6). */
export function ParentLayout() {
  return (
    <div className="min-h-dvh md:flex">
      <nav
        aria-label={nl.nav.main}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-r md:border-t-0 md:bg-paper"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
      >
        <p className="hidden px-6 pb-6 pt-8 font-heading text-lg font-extrabold text-accent-strong md:block">
          {nl.appName}
        </p>
        <ul className="mx-auto flex h-[var(--nav-height)] max-w-xl items-stretch gap-1 px-2 md:h-auto md:flex-col md:px-3">
          <li className="flex flex-1 md:flex-none">
            <NavLink to="/" end className={navClass}>
              <IconBox>
                <Sun {...ICON} />
              </IconBox>
              <span>{nl.nav.today}</span>
            </NavLink>
          </li>
          <li className="flex flex-1 md:flex-none">
            <NavLink to="/recepten" className={navClass}>
              <IconBox>
                <BookOpen {...ICON} />
              </IconBox>
              <span>{nl.nav.recipes}</span>
            </NavLink>
          </li>
          <li className="flex flex-1 md:order-first md:mb-2 md:flex-none">
            <NavLink to="/gegeten" className={navClass}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                <Plus size={22} strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span>{nl.nav.logged}</span>
            </NavLink>
          </li>
          <li className="flex flex-1 md:flex-none">
            <NavLink to="/boodschappen" className={navClass}>
              <IconBox>
                <ShoppingBasket {...ICON} />
              </IconBox>
              <span>{nl.nav.shopping}</span>
            </NavLink>
          </li>
          <li className="flex flex-1 md:flex-none">
            <GardenNavButton />
          </li>
        </ul>
      </nav>
      <main
        id="main"
        className="mx-auto w-full max-w-3xl px-4 pt-[calc(var(--safe-top)+8px)] md:px-8 md:pt-6 lg:max-w-5xl"
        style={{ paddingBottom: 'calc(var(--nav-height) + var(--safe-bottom) + 24px)' }}
      >
        <Suspense fallback={<div className="min-h-[60dvh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <SnackbarHost />
    </div>
  );
}
