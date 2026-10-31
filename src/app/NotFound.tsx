import { LinkButton } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { nl } from '../i18n/nl';

export function NotFound() {
  return (
    <EmptyState
      title="Niet gevonden"
      text={nl.errors.notFound}
      action={
        <LinkButton to="/" variant="primary">
          Naar Vandaag
        </LinkButton>
      }
    />
  );
}
