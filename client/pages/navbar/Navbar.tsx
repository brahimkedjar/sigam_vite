// components/Navbar.tsx
'use client';
import { FiSearch, FiBell, FiUser, FiChevronDown, FiLogOut, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  priority: string;
  expert?: {
    id_expert: number;
    nom_expert: string;
    num_agrement: string;
  };
}

export default function Navbar() {
  const { auth, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchNotifications();
    const cleanup = setupSSE();
    return cleanup;
  }, []);

  const fetchNotifications = async () => {
  try {
    const response = await fetch(`${apiURL}/notifications?unreadOnly=true`);
    const data = await response.json();

    // If backend wraps notifications in an object
    const notificationsArray = Array.isArray(data) ? data : data.notifications;

    setNotifications(notificationsArray);
    setUnreadCount(notificationsArray?.filter((n: Notification) => !n.isRead).length);
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};


  const setupSSE = () => {
    let reconnectTimer: number | undefined;
    const es = new EventSource(`${apiURL}/notifications/sse`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data?.count === 'number') {
          setUnreadCount(data.count);
        }
      } catch {}

      if (isNotificationsOpen) {
        fetchNotifications();
      }
    };

    es.onerror = (error) => {
      console.error('SSE connection error:', error);
      try { es.close(); } catch {}
      // Lazy reconnect
      reconnectTimer = window.setTimeout(() => {
        setupSSE();
      }, 5000);
    };

    return () => {
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      try { es.close(); } catch {}
    };
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`${apiURL}/notifications/${notificationId}/read`, { method: 'POST' });
      setNotifications(prev => prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${apiURL}/notifications/read-all`, { method: 'POST' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (role: string) => {
    return role
      .split(' ')
      .filter(Boolean)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const initials = auth.role ? getInitials(auth.role) : '';
  const displayRole = auth.role ?? '';
  const displayUsername = auth.username ?? '';
  const displayEmail = auth.email ?? '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav className={styles['navbar']}>
      <div className={styles['navbar-header']}>
        <div className={styles['app-logo']}>
          <span>SIGAM</span>
          <span className={styles['app-version']}>v2.0</span>
        </div>
      </div>

      <div className={styles['navbar-search']}>
        <div className={styles['search-container']}>
          <FiSearch className={styles['search-icon']} />
          <input
            type="text"
            className={styles['search-input']}
            placeholder="Rechercher..."
          />
        </div>
      </div>

      <div className={styles['navbar-user']}>
        <div className={styles['notification-container']} ref={notificationsRef}>
          <div
            className={styles['notification-icon']}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={3}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1.7em"
              width="1.7em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && (
              <span className={styles['notification-badge']}>{unreadCount}</span>
            )}
          </div>

          {isNotificationsOpen && (
            <div className={styles['notifications-dropdown']}>
              <div className={styles['notifications-header']}>
                <h3>Notifications ({unreadCount} non lues)</h3>
                {unreadCount > 0 && (
                  <button
                    className={styles['mark-all-read']}
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className={styles['notifications-list']}>
                {notifications?.length === 0 ? (
                  <div className={styles['no-notifications']}>
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications?.map(notification => (
                    <div
                      key={notification.id}
                      className={`${styles['notification-item']} ${!notification.isRead ? styles['unread'] : ''}`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className={styles['notification-content']}>
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className={styles['notification-time']}>
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.isRead && (
                        <div className={styles['unread-dot']}></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles['profile-dropdown']} ref={dropdownRef}>
          <button
            className={styles['profile-button']}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles['user-avatar']}>
              <span className={styles['avatar-initials']}>{initials}</span>
            </div>
            <div className={styles['user-info']}>
              <span className={styles['user-name']}>{displayUsername}</span>
              <span className={styles['user-email']}>{displayEmail}</span>
            </div>
            <FiChevronDown className={`${styles['dropdown-arrow']} ${isDropdownOpen ? styles['open'] : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className={styles['dropdown-menu']}>
              <div className={styles['dropdown-header']}>
                <div className={styles['dropdown-avatar']}>
                  <span className={styles['avatar-initials']}>{initials}</span>
                </div>
                <div>
                  <p className={styles['dropdown-name']}>Role : {displayRole}</p>
                  <p className={styles['dropdown-name']}>{displayUsername}</p>
                  <p className={styles['dropdown-email']}>{displayEmail}</p>
                </div>
              </div>

              <div className={styles['dropdown-divider']}></div>

              <Link href="/profile" className={styles['dropdown-item']}>
                <FiUser className={styles['dropdown-icon']} />
                <span>Mon profil</span>
              </Link>

              <Link href="/settings" className={styles['dropdown-item']}>
                <FiSettings className={styles['dropdown-icon']} />
                <span>Paramètres</span>
              </Link>

              <Link href="/help" className={styles['dropdown-item']}>
                <FiHelpCircle className={styles['dropdown-icon']} />
                <span>Aide & Support</span>
              </Link>

              <div className={styles['dropdown-divider']}></div>

              <button onClick={logout} className={`${styles['dropdown-item']} ${styles['logout']}`}>
                <FiLogOut className={styles['dropdown-icon']} />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
