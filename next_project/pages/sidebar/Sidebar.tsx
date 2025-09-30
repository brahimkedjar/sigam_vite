'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../src/store/useAuthStore';
import { FiHome, FiFile, FiMap, FiSettings, FiUsers, FiChevronRight, 
         FiLogOut, FiChevronLeft, FiActivity, FiBriefcase, FiClipboard, 
         FiDollarSign, FiFileText, FiLayers, FiLock, FiShield, FiChevronDown, 
         FiMessageSquare} from 'react-icons/fi';
import styles from './sidebar.module.css';
import type { ViewType } from '../../src/types/viewtype';

interface MenuItemBase {
  id: ViewType;
  icon: React.ReactNode;
  label: string;
  permission: string;
}

interface MenuItemWithSubItems extends MenuItemBase {
  subItems: MenuItemBase[];
}


type MenuItem = MenuItemBase | MenuItemWithSubItems;

function hasSubItems(item: MenuItem): item is MenuItemWithSubItems {
  return 'subItems' in item;
}

interface SidebarProps {
  currentView: ViewType;
  navigateTo: (view: ViewType) => void;
}

export default function Sidebar({ currentView, navigateTo }: SidebarProps) {
  const { auth, logout, hasPermission, isLoaded } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<ViewType | null>(null);
 
  if (!isLoaded) return (
    <aside className={styles.sidebarLoading}>
      <div className={styles.loadingSpinner}></div>
    </aside>
  );

  const menuItems: MenuItem[] = [
    { id: 'dashboard', icon: <FiActivity />, label: 'Tableau de bord', permission: 'dashboard' },
    { id: 'Permis', icon: <FiFileText />, label: 'permis lists', permission: 'dashboard' },
    { id: 'Chat', icon: <FiMessageSquare />, label: 'Chat', permission: 'dashboard' },
    { id: 'procedures', icon: <FiClipboard />, label: 'Procédures', permission: 'view_procedures' },
    { id: 'nouvelle-demande', icon: <FiFileText />, label: 'Nouvelle demande', permission: 'create_demande' },
    { id: 'gestion-permis', icon: <FiLayers />, label: 'Gestion des permis', permission: 'manage_permits' },
    { id: 'instruction-cadastrale', icon: <FiMap />, label: 'Instruction cadastrale', permission: 'view_cadastre' },
    { id: 'generateur-permis', icon: <FiBriefcase />, label: 'Générateur permis', permission: 'generate_permits' },
    { id: 'parametres', icon: <FiSettings />, label: 'Paramètres', permission: 'manage_settings' },
    { 
      id: 'Admin-Panel', 
      icon: <FiLock />, 
      label: 'Admin Panel', 
      permission: 'Admin-Panel',
      subItems: [
        { id: 'manage_users', icon: <FiUsers />, label: 'Manage Users', permission: 'manage_users' },
        { id: 'manage_documents', icon: <FiFile />, label: 'Manage Documents', permission: 'manage_documents' },
        { id: 'Audit_Logs', icon: <FiFile />, label: 'Audit Logs', permission: 'Audit_Logs' },
        { id: 'gestion_experts', icon: <FiUsers />, label: 'gestion experts', permission: 'manage_documents' },
        { id: 'Configurations', icon: <FiSettings />, label: 'Configurations', permission: 'Admin-Panel' },

      ]
    },
    { id: 'Payments', icon: <FiDollarSign />, label: 'Paiements', permission: 'Payments' },
    { id: 'controle_minier', icon: <FiShield />, label: 'Contrôle minier', permission: 'controle_minier' },
    { id: 'Gestion_seances', icon: <FiHome />, label: 'Gestion_seances', permission: 'dashboard' }

  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.sidebarToggle} onClick={toggleSidebar}>
        {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
      
      <nav className={styles.sidebarNav}>
        <ul className={styles.navMenu}>
          {menuItems.map(item => (
            hasPermission(item.permission) && (
              <li 
                key={item.id} 
                className={styles.navItem}
                onMouseEnter={() => hasSubItems(item) && setHoveredMenu(item.id)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  className={`${styles.navLink} ${currentView === item.id ? styles.active : ''}`}
                  onClick={() => !hasSubItems(item) && navigateTo(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className={styles.navLabel}>{item.label}</span>
                      {hasSubItems(item) && (
                        <span className={styles.navArrow}>
                          <FiChevronDown />
                        </span>
                      )}
                    </>
                  )}
                </button>

                {!isCollapsed && hasSubItems(item) && (
                  <ul className={`${styles.subMenu} ${hoveredMenu === item.id ? styles.visible : ''}`}>
                    {item.subItems.map(subItem => (
                      hasPermission(subItem.permission) && (
                        <li 
                          key={subItem.id} 
                          className={styles.subItem}
                          onMouseEnter={() => setHoveredMenu(item.id)}
                        >
                          <button
                            className={`${styles.subLink} ${currentView === subItem.id ? styles.active : ''}`}
                            onClick={() => navigateTo(subItem.id)}
                          >
                            <span className={styles.subIcon}>{subItem.icon}</span>
                            <span className={styles.subLabel}>{subItem.label}</span>
                          </button>
                        </li>
                      )
                    ))}
                  </ul>
                )}
              </li>
            )
          ))}
        </ul>
      </nav>

      <div className={styles.sidebarFooter}>
        {!isCollapsed && (
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {auth.role?.split(' ').map(w => w[0]).join('').toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userRole}>{auth.role || 'Utilisateur'}</span>
              <span className={styles.userStatus}>En ligne</span>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={logout} title={isCollapsed ? "Déconnexion" : undefined}>
          <FiLogOut />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}