// pages/permis-list/index.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PermisListTable from './PermisListTable';
import { Permis } from './PermisDashboard';

export default function PermisListPage() {
  const [permisList, setPermisList] = useState<Permis[]>([]);
  const [loading, setLoading] = useState(true);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const fetchPermisList = useCallback(async () => {
    try {
      const response = await axios.get(`${apiURL}/Permisdashboard`);
      setPermisList(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching permis list:', error);
    } finally {
      setLoading(false);
    }
  }, [apiURL]);

  useEffect(() => {
    fetchPermisList();
  }, [fetchPermisList]);

  return (
    <div>
      <h1>Liste des Permis</h1>
      <PermisListTable 
        permisList={permisList} 
        loading={loading}
        onRefresh={fetchPermisList}
      />
    </div>
  );
}