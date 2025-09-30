export function cleanLocalStorageForNewDemande() {
  const previousId = localStorage.getItem('id_demande');
  const previousCode = localStorage.getItem('code_demande');

  if (previousId || previousCode) {
    // ✅ Supprimer uniquement si on est sûr que c'est une nouvelle demande
    localStorage.removeItem('id_detenteur');
    localStorage.removeItem('societe_data');
    localStorage.removeItem('capacites_form');
  }

}
