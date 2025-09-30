'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './register.module.css';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: '',
    nom: '',
    Prenom: '',
    username: '',
  });

  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${apiURL}/admin/roles`);
        const fetchedRoles = response.data;
        setRoles(fetchedRoles);
        if (fetchedRoles.length > 0) {
          setForm((prev) => ({ ...prev, role: fetchedRoles[0].name }));
        }
      } catch (error) {
        console.error('❌ Failed to fetch roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiURL}/auth/register`, form);
      setMessage('✅ Inscription réussie !');
    } catch {
      setMessage('❌ Échec de l\'inscription.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <h2 className={styles.title}>Créer un compte</h2>

        {message && <p className={styles.message}>{message}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="Prenom">Prénom</label>
          <input
            type="text"
            id="Prenom"
            required
            value={form.Prenom}
            onChange={(e) => setForm({ ...form, Prenom: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role">Rôle</label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className={styles.button}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}
