/** R7: mai il civico esatto in chiaro sulla pagina pubblica. */
export function maskCivico(civico: string | null | undefined): string {
  if (!civico || !civico.trim()) return '';
  return 'civ. ●●';
}
