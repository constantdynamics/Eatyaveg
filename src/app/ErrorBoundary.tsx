import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error?: Error;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6">
        <h1 className="text-2xl">Oeps, hier ging iets mis</h1>
        <p className="text-ink-soft">
          Je gegevens zijn veilig: ze staan nog op dit apparaat. Laad de app opnieuw om verder te
          gaan.
        </p>
        <button
          type="button"
          className="min-h-14 rounded-card bg-accent px-5 font-heading text-lg font-bold text-white"
          onClick={() => {
            window.location.hash = '#/';
            window.location.reload();
          }}
        >
          Opnieuw laden
        </button>
      </div>
    );
  }
}
