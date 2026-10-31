import { Link } from 'react-router';
import { Settings } from 'lucide-react';

export function SettingsLink() {
  return (
    <Link
      to="/instellingen"
      aria-label="Instellingen"
      title="Instellingen"
      className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-sand"
    >
      <Settings size={24} aria-hidden="true" />
    </Link>
  );
}
