import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './app.css';

// We'll import the designer we copied
import PermisDesigner from './components/PermisDesigner';

const API_URL = (import.meta as any).env?.VITE_API_URL || '';

export default function App() {
  const [permisId, setPermisId] = useState<string>('');
  const [initialData, setInitialData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // expose the api URL for PermisDesigner (which expects NEXT_PUBLIC_API_URL)
    (window as any).process = (window as any).process || { env: {} };
    (window as any).process.env = (window as any).process.env || {};
    (window as any).process.env.NEXT_PUBLIC_API_URL = API_URL;
  }, []);

  const loadPermis = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/permis/${encodeURIComponent(permisId)}`);
      setInitialData(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load permis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16, fontFamily: 'Inter, system-ui, Arial' }}>
      <h2>Titre Minier Designer</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Enter permis ID/code"
          value={permisId}
          onChange={(e) => setPermisId(e.target.value)}
          style={{ padding: 8, minWidth: 240 }}
        />
        <button onClick={loadPermis} disabled={!permisId || loading}>
          {loading ? 'Loading…' : 'Charger Les Donnes Du permis'}
        </button>
        <span style={{ color: '#888' }}>API: {API_URL}</span>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {initialData ? (
        <PermisDesigner
          initialData={initialData}
          onSave={async () => { /* no-op */ }}
          onGeneratePdf={async () => { /* no-op */ }}
          onSavePermis={async () => { /* no-op */ }}
          procedureId={permisId}
        />
      ) : (
        <div style={{ color: '#666' }}>Load a permis to start designing.</div>
      )}
    </div>
  );
}
