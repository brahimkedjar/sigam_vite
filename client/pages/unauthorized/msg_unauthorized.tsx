'use client';

import { useRouter } from 'next/router';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import styles from './MsgUnauthorized.module.css';

type ReasonKey = 'not_authenticated' | 'insufficient_role' | 'missing_permissions';

const FALLBACK_MESSAGE = 'Acces refuse. Veuillez verifier vos autorisations.';
const REASON_MESSAGES: Record<ReasonKey, string> = {
  not_authenticated: 'Vous devez etre connecte pour acceder a cette page.',
  insufficient_role: "Vous n'avez pas le role necessaire pour acceder a cette page.",
  missing_permissions: "Vous n'avez pas les permissions requises pour acceder a cette page.",
};

export default function Unauthorized() {
  const router = useRouter();
  const reasonParam = router.query.reason;
  const reason = Array.isArray(reasonParam) ? reasonParam[0] : reasonParam;
  const message = (reason ? REASON_MESSAGES[reason as ReasonKey] : undefined) ?? FALLBACK_MESSAGE;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.homeIcon}
        onClick={() => router.push('/')}
        aria-label="Revenir a l'accueil"
      >
        <FiHome size={26} />
      </button>

      <div className={styles.box}>
        <FiAlertTriangle size={36} color="#FFA500" />
        <h1>403 - Acces refuse</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}