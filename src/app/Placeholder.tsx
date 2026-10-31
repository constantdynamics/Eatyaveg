import { PageHeader } from '../components/PageHeader';

export function Placeholder({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <p className="text-ink-soft">Komt eraan.</p>
    </>
  );
}
