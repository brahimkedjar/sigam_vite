
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
        
        const stepStatus = procedureData.ProcedureEtape?.find(
          (pe: any) => pe.id_etape === etapeNum
        )?.statut || 'EN_ATTENTE';

        // If step is TERMINEE, skip activation but call onActivationSuccess
        if (stepStatus === 'TERMINEE') {
          console.log(`Step ${etapeNum} is already TERMINEE, skipping activation`);
          hasActivated.current = true;
          if (onActivationSuccess) {
            onActivationSuccess(stepStatus);
          }
          return;
        }

        // Only activate if the step is EN_ATTENTE
        if (stepStatus === 'EN_ATTENTE') {
          const currentUrl = window.location.pathname + window.location.search;
          await axios.post(`${apiURL}/api/procedure-etape/start/${idProc}/${etapeNum}`, {
            link: currentUrl
          });
          
          console.log(`Activated step ${etapeNum} to EN_COURS`);
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
