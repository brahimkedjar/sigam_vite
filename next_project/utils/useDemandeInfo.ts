import { useEffect, useState } from 'react';
import { useSearchParams } from '@/src/hooks/useSearchParams';

export const useDemandeInfo = () => {
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const queryCode = searchParams?.get('code');
    const queryId = searchParams?.get('id');

    const localCode = localStorage.getItem('code_demande');
    const localId = localStorage.getItem('id_demande');

    const finalCode = queryCode || localCode;
    const finalId = queryId || localId;

    if (finalCode) localStorage.setItem('code_demande', finalCode);
    if (finalId) localStorage.setItem('id_demande', finalId);

    setCode(finalCode ?? null);
    setId(finalId ?? null);
    setIsReady(true);
  }, [searchParams]);

  return { codeDemande: code, idDemande: id, isReady };
};
