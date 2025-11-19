
import { useEffect, useRef } from 'react';
import axios from 'axios';

interface UseActivateEtapeOptions {
  idProc?: number;
  etapeNum: number;
  shouldActivate: boolean;
  onActivationSuccess?: (stepStatus: string) => void;
}

export const useActivateEtape = ({
  idProc,
  etapeNum,
  shouldActivate,
  onActivationSuccess
}: UseActivateEtapeOptions) => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const hasActivated = useRef(false);

  useEffect(() => {
    if (!shouldActivate || !idProc || hasActivated.current) return;

    console.log(`Attempting to activate step ${etapeNum} in procedure ${idProc}`);

    const activate = async () => {
      try {
        // Check the current status of the step on the server
        const procedureResponse = await axios.get(`${apiURL}/api/procedure-etape/procedure/${idProc}`);
        const procedureData = procedureResponse.data;

        // Determine the backend etape ID for this page based on page_route
        let effectiveEtapeId: number | null = null;
        try {
          const pathname = window.location.pathname.replace(/^\/+/, ''); // ex: "demande/step1/page1"
          const phases = (procedureData.ProcedurePhase || []) as any[];
          const allEtapes = phases.flatMap((pp) => (pp.phase?.etapes ?? []));
          const match = allEtapes.find((e: any) => e.page_route === pathname);

          if (match?.id_etape != null) {
            effectiveEtapeId = match.id_etape;
          }
        } catch {
          // Fallback: use the provided etapeNum (legacy behavior)
          effectiveEtapeId = etapeNum;
        }

        if (effectiveEtapeId == null) {
          console.warn('useActivateEtape: unable to resolve etapeId for this page, skipping activation');
          hasActivated.current = true;
          return;
        }

        const stepStatus = procedureData.ProcedureEtape?.find(
          (pe: any) => pe.id_etape === effectiveEtapeId
        )?.statut || 'EN_ATTENTE';

        // If step is TERMINEE, skip activation but call onActivationSuccess
        if (stepStatus === 'TERMINEE') {
          console.log(`Step ${effectiveEtapeId} is already TERMINEE, skipping activation`);
          hasActivated.current = true;
          if (onActivationSuccess) {
            onActivationSuccess(stepStatus);
          }
          return;
        }

        // Only activate if the step is EN_ATTENTE
        if (stepStatus === 'EN_ATTENTE') {
          const currentUrl = window.location.pathname + window.location.search;
          await axios.post(`${apiURL}/api/procedure-etape/start/${idProc}/${effectiveEtapeId}`, {
            link: currentUrl
          });
          
          console.log(`Activated step ${effectiveEtapeId} to EN_COURS`);
        }

        hasActivated.current = true;
        
        if (onActivationSuccess) {
          onActivationSuccess(stepStatus);
        }
      } catch (err) {
        console.error(`Failed to activate step ${etapeNum}`, err);
      }
    };

    activate();
  }, [idProc, etapeNum, shouldActivate, onActivationSuccess, apiURL]);
};
