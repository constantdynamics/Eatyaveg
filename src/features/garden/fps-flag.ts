export function fpsEnabled(): boolean {
  try {
    return localStorage.getItem('fv:dev:fps') === '1';
  } catch {
    return false;
  }
}
