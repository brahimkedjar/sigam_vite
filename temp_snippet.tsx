const computeBusinessDeadlineInfo = () => {
    if (!demandeMeta?.duree_instruction) {
      return null;
    }

    const total = demandeMeta.duree_instruction;

    // Point de départ = début de procédure, sinon date_demande.
    const startRaw = (procedureD
