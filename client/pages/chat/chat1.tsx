import React, { useEffect } from 'react';
import { ChatContainer } from '../../components/chat/ChatContainer';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { useViewNavigator } from '@/src/hooks/useViewNavigator';
import styles from './chatsid.module.css'

const ChatPage: React.FC = () => {
  const { auth, isLoaded } = useAuthStore();
  const router = useRouter();
  const { currentView, navigateTo } = useViewNavigator("Chat");

  useEffect(() => {
    if (!isLoaded) return;

    if (!auth?.role && auth?.permissions?.length === 0) {
      router.push('/');
    }
  }, [isLoaded, auth, router]);

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
          <p>Loading Messenger...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Messenger | Real-time Chat</title>
        <meta name="description" content="Connect and chat with your team in real-time" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
<div className={styles['app-container']}>
      <Navbar />
      <div className={styles['app-content']}>
        <Sidebar currentView={currentView} navigateTo={navigateTo} />
        <main className={styles['main-content']}>
          <div className={styles.headerContainer}></div>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <header>
            <h1 style={{
              fontSize: '1.7rem',
              fontWeight: 700,
              color: 'white',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              💬 Messenger
            </h1>

          </header>

          {/* ✅ No more prop needed */}
          <ChatContainer />
        </div>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      </main>
      </div>
      </div>
    </>
  );
};

export default ChatPage;
