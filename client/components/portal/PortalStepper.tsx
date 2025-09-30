import React from 'react';
import styles from '../../pages/portail/Portail.module.css';

type Step = { key: string; label: string; href: string };

export default function PortalStepper({ steps, current }: { steps: Step[]; current: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0 16px' }}>
      {steps.map((s, idx) => (
        <a
          key={s.key}
          href={s.href}
          className={styles.btn}
          style={{
            background: s.key === current ? '#2563eb' : '#fff',
            color: s.key === current ? '#fff' : '#0f172a',
            borderColor: s.key === current ? '#1d4ed8' : '#e2e8f0',
          }}
        >
          {idx + 1}. {s.label}
        </a>
      ))}
    </div>
  );
}

