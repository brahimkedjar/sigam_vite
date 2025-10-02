'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../src/store/useAuthStore';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';
import styles from './login.module.css';
import Link from 'next/link';
import router from 'next/router';
import { useLoading } from '@/components/globalspinner/LoadingContext';

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const login = useAuthStore((s) => s.login); 
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthStore.getState().auth;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': auth?.id, 
      'X-User-Name': auth?.username || auth?.email 
    }
  });
  const handleLogin = async () => {
    startLoading();
    setError(null);
    
    try {
      const response = await apiClient.post(
        `${apiURL}/auth/login`, 
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      useAuthStore.getState().login(response.data);
      router.push('/permis_dashboard/PermisDashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Email ou mot de passe invalide');
    } finally {
      stopLoading();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* GlobalSpinner is handled at App level via LoadingProvider */}

      {/* Left side - Branding/Illustration */}
      <div className={`${styles.brandSection} ${isLoading ? styles.blurred : ''}`}>
        <div className={styles.brandLogo}>
          <Image 
            src="/logo-white.png" 
            alt="SIGAM Logo" 
            width={400} 
            height={200} 
          />
        </div>
        <h1 className={styles.brandTitle}>Bienvenue sur SIGAM</h1>
        <p className={styles.brandSubtitle}>
          Système Intégré de Gestion des Autorisations Minières
        </p>
        <div className={styles.brandIllustration}>
          <Image 
            src="/auth-illustration.png" 
            alt="Authentication Illustration" 
            width={500} 
            height={400} 
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className={`${styles.loginFormSection} ${isLoading ? styles.blurred : ''}`}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Connexion</h2>
            <p className={styles.loginSubtitle}>Entrez vos identifiants pour accéder à votre compte</p>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <FiAlertCircle className={styles.errorIcon} />
              <div>{error}</div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              Adresse email
            </label>
            <div className={styles.inputContainer}>
              <FiMail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Mot de passe
            </label>
            <div className={styles.inputContainer}>
              <FiLock className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className={styles.forgotPassword}>
              <a href="#" className={styles.forgotPasswordLink}>
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={styles.submitButton}
          >
            Se connecter
          </button>

          <div className={styles.loginFooter}>
            <p>
              Vous n'avez pas de compte ?{' '}
              <Link href="/Signup/page" className={styles.footerLink}>
               Sign Up
              </Link>
            </p>
            <a href="/admin_panel/page" className={styles.footerLink}>
              Admin Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
