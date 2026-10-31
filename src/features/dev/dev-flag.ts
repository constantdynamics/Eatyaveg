/** Dev-paneel: alleen in development of met ?dev=1 in de URL (§11.5). */
export function isDevPanelEnabled(): boolean {
  if (import.meta.env.DEV) return true;
  try {
    const search = new URLSearchParams(window.location.search);
    if (search.get('dev') === '1') {
      sessionStorage.setItem('fv:dev', '1');
      return true;
    }
    const hashQuery = window.location.hash.split('?')[1];
    if (hashQuery && new URLSearchParams(hashQuery).get('dev') === '1') {
      sessionStorage.setItem('fv:dev', '1');
      return true;
    }
    return sessionStorage.getItem('fv:dev') === '1';
  } catch {
    return false;
  }
}
