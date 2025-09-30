'use client';
import { useSessionLoader } from '../src/hooks/useSessionLoader';
import { useAuthStore } from '../src/store/useAuthStore';
import { useState, useEffect } from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useSessionLoader();
  const isLoaded = useAuthStore(state => state.isLoaded);
  const [opacity, setOpacity] = useState(0);
  const [yPos, setYPos] = useState(20);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [dotY, setDotY] = useState([0, 0, 0]);
  const [dotOpacity, setDotOpacity] = useState([0.6, 0.6, 0.6]);

  useEffect(() => {
    // Fade-in animation
    setOpacity(1);
    setYPos(0);
    
    // Rotating loader animation
    const rotateInterval = setInterval(() => {
      setRotate(prev => (prev + 2) % 360);
      setScale(prev => {
        const cycle = (prev - 1) * 10;
        return 1 + Math.abs(Math.sin(cycle * Math.PI / 5)) * 0.1;
      });
    }, 16);
    
    // Dot animation
    const dotInterval = setInterval(() => {
      setDotY(prev => prev.map((_, i) => Math.sin(Date.now()/500 + i * 0.6) * 10));
      setDotOpacity(prev => prev.map((_, i) => 0.6 + Math.abs(Math.sin(Date.now()/500 + i * 0.6)) * 0.4));
    }, 16);
    
    return () => {
      clearInterval(rotateInterval);
      clearInterval(dotInterval);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{
          opacity: opacity,
          transform: `translateY(${yPos}px)`,
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 24px',
            transform: `rotate(${rotate}deg) scale(${scale})`,
            transition: 'transform 0.1s linear'
          }} />
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '8px'
          }}>Initializing Session</h1>
          <p style={{
            color: '#9ca3af',
            marginBottom: '24px'
          }}>Securing your connection...</p>
          <div style={{
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px'
          }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'inline-block',
                  transform: `translateY(${dotY[i]}px)`,
                  opacity: dotOpacity[i],
                  transition: 'transform 0.2s ease, opacity 0.2s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      opacity: opacity,
      transition: 'opacity 0.3s ease',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {children}
    </div>
  );
}