import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FiUsers, FiKey, FiCheck, FiX, FiPlus, FiShield, FiMail, FiTrash2, FiChevronRight } from 'react-icons/fi';
import styles from './AdminPanel.module.css';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import router from 'next/router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ViewType } from '../../src/types/viewtype';
import { useViewNavigator } from '../../src/hooks/useViewNavigator';

type Role = {
  id: number;
  name: string;
  permissions: Permission[];
};

type Permission = {
  id: number;
  name: string;
};

type Group = {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
};

type User = {
  id: number;
  email: string;
  role: Role | null;
  groups: Group[]; 
};

export default function AdminPanel() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [newRole, setNewRole] = useState('');
  const [newPermission, setNewPermission] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoleForUser, setSelectedRoleForUser] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('roles');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRoles, setEditingRoles] = useState<{ [id: number]: boolean }>({});
  const [editingPermissions, setEditingPermissions] = useState<{ [id: number]: boolean }>({});
  const [roleInputs, setRoleInputs] = useState<{ [id: number]: string }>({});
  const [permissionInputs, setPermissionInputs] = useState<{ [id: number]: string }>({});
  const [userSearch, setUserSearch] = useState('');
  const { currentView, navigateTo } = useViewNavigator('manage_users');
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedGroupForUser, setSelectedGroupForUser] = useState<number | null>(null);
  const [editingGroups, setEditingGroups] = useState<{ [id: number]: boolean }>({});
  const [selectedGroupsForUser, setSelectedGroupsForUser] = useState<number[]>([]);
  const [groupInputs, setGroupInputs] = useState<{ [id: number]: { name: string, description: string } }>({});
  const auth = useAuthStore.getState().auth;
  const toggleAllPermissions = () => {
  if (selectedPermissions.length === permissions.length) {
    // Deselect all
    setSelectedPermissions([]);
  } else {
    // Select all
    setSelectedPermissions(permissions.map(p => p.id));
  }
};


const isAllSelected = selectedPermissions.length === permissions.length && permissions.length > 0;
const isSomeSelected = selectedPermissions.length > 0 && !isAllSelected;

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({message, type});
    setTimeout(() => setNotification(null), 5000);
  };

  const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-User-Id': auth?.id, 
    'X-User-Name': auth?.username || auth?.email 
  }
});

  const assignPermissionsToGroup = async (groupId: number, permissionIds: number[]) => {
  if (!groupId || permissionIds.length === 0) return;
  try {
    await apiClient.post(`${API_URL}/admin/group/assign-permissions`, {
      groupId,
      permissionIds,
    });
    setSelectedGroup(null);
    setSelectedPermissions([]);
    showNotification('Permissions assigned to group successfully', 'success');
    fetchAll();
  } catch (error) {
    showNotification('Failed to assign permissions to group', 'error');
  }
};

  const fetchAll = useCallback(async () => {
  setIsLoading(true);
  try {
    const [rolesRes, permissionsRes, usersRes, groupsRes] = await Promise.all([
      axios.get(`${API_URL}/admin/roles`),
      axios.get(`${API_URL}/admin/permissions`),
      axios.get(`${API_URL}/admin/users`),
      axios.get(`${API_URL}/admin/groups`)
    ]);
    
    setRoles(rolesRes.data);
    setPermissions(permissionsRes.data);
    
    // Process users data with multiple groups and permissions
    const processedUsers = usersRes.data.map((user: any) => {
      // Extract role permissions
      const rolePermissions = user.role?.rolePermissions?.flatMap((rp: any) => rp.permission) || [];
      
      // Extract group permissions
      const groupPermissions = user.userGroups?.flatMap((ug: any) => 
        ug.group?.groupPermissions?.flatMap((gp: any) => gp.permission) || []
      ) || [];
      
      return {
        ...user,
        role: user.role ? {
          ...user.role,
          permissions: rolePermissions
        } : null,
        groups: user.userGroups?.map((ug: any) => ({
          ...ug.group,
          permissions: ug.group?.groupPermissions?.map((gp: any) => gp.permission) || []
        })) || []
      };
    });
    
    setUsers(processedUsers);
    
    setGroups(groupsRes.data.map((group: any) => ({
      ...group,
      permissions: group.groupPermissions?.map((gp: any) => gp.permission) || []
    })));
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    showNotification("Failed to load data", 'error');
  } finally {
    setIsLoading(false);
  }
}, [API_URL]);

const createGroup = async () => {
  if (!newGroup.trim()) return;
  try {
    await apiClient.post(`${API_URL}/admin/group`, { 
      name: newGroup,
      description: groupDescription,
    });
    setNewGroup('');
    setGroupDescription('');
    showNotification('Group created successfully', 'success');
    fetchAll();
  } catch (error) {
    showNotification('Failed to create group', 'error');
  }
};


const assignGroupsToUser = async () => {
  if (!selectedUser || selectedGroupsForUser.length === 0) return;
  
  try {
    await apiClient.post(`${API_URL}/admin/user/assign-groups`, {
      userId: selectedUser,
      groupIds: selectedGroupsForUser,
  
    });
    setSelectedUser(null);
    setSelectedGroupsForUser([]);
    showNotification('Groups assigned to user successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to assign groups to user', 'error');
  }
};


const deleteGroup = async (id: number) => {
  try {
    await apiClient.delete(`${API_URL}/admin/group/${id}`);
    showNotification('Group deleted successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to delete group', 'error');
  }
};

const updateGroup = async (id: number, name: string, description?: string) => {
  try {
    await apiClient.put(`${API_URL}/admin/group/${id}`, { name, description});
    showNotification('Group updated successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to update group', 'error');
  }
};


  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

const createRole = async () => {
  if (!newRole.trim()) return;
  try {
    await apiClient.post(`${API_URL}/admin/role`, { name: newRole  });
    setNewRole('');
    showNotification('Role created successfully', 'success');
    fetchAll();
  }catch (error: any) {
    showNotification('Failed to create role', 'error');
  }
};

const deleteRole = async (id: number) => {
  try {
    const auth = useAuthStore.getState().auth;
    await apiClient.delete(`${API_URL}/admin/role/${id}`);
    showNotification('Role deleted successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to delete role', 'error');
  }
};

const updateRole = async (id: number, name: string) => {
  try {
    const auth = useAuthStore.getState().auth;
    await apiClient.put(`${API_URL}/admin/role/${id}`, { name }
    );
    showNotification('Role updated successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to update role', 'error');
  }
};

  const createPermission = async () => {
  if (!newPermission.trim()) return;
  
  try {
    await apiClient.post(`${API_URL}/admin/permission`, { name: newPermission });
    
    setNewPermission('');
    showNotification('Permission created successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to create permission', 'error');
  }
};

const assignPermissions = async () => {
  if (!selectedRole || selectedPermissions.length === 0) return;
  
  try { 
    await apiClient.post(`${API_URL}/admin/role/assign-permissions`, {
      roleId: selectedRole,
      permissionIds: selectedPermissions,

    });
    setSelectedRole(null);
    setSelectedPermissions([]);
    showNotification('Permissions assigned successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to assign permissions', 'error');
  }
};


  const assignRoleToUser = async () => {
  if (!selectedUser || !selectedRoleForUser) return;
  
  try {  
    await apiClient.post(`${API_URL}/admin/user/assign-role`, {
      userId: selectedUser,
      roleId: selectedRoleForUser
    });
    setSelectedUser(null);
    setSelectedRoleForUser(null);
    showNotification('Role assigned to user successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to assign role to user', 'error');
  }
};

  const handlePermissionToggle = (permissionId: number) => {
  setSelectedPermissions(prev =>
    prev.includes(permissionId)
      ? prev.filter(id => id !== permissionId)
      : [...prev, permissionId]
  );
};

const deletePermission = async (id: number) => {
  try {
    await apiClient.delete(`${API_URL}/admin/permission/${id}`);
    showNotification('Permission deleted successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to delete permission', 'error');
  }
};

const updatePermission = async (id: number, name: string) => {
  try {
    await apiClient.put(`${API_URL}/admin/permission/${id}`, { name });
    showNotification('Permission updated successfully', 'success');
    fetchAll();
  } catch (error: any) {
    showNotification('Failed to update permission', 'error');
  }
};
return (
  <div className={styles['app-container']}>
    <Navbar />
    <div className={styles['app-content']}>
      <Sidebar currentView={currentView} navigateTo={navigateTo} />
      <main className={styles['main-content']}>
        <div className={styles['breadcrumb']}>
          <span>SIGAM</span>
          <FiChevronRight className={styles['breadcrumb-arrow']} />
          <span>Manage Users</span>
        </div>

        <div className={styles['admin-container']}>
          {notification && (
  <div className={`${styles.notification} ${notification.type === 'success' ? styles.notificationSuccess : styles.notificationError}`}>
    {notification.type === 'success' ? <FiCheck /> : <FiX />}
    <span>{notification.message}</span>
  </div>
)}

          <div className={styles['admin-header']}>
            <h1><FiShield /> Administration Panel</h1>
            <div className={styles['admin-tabs']}>
              <button
                className={`${styles['admin-tabs-button']} ${activeTab === 'roles' ? styles.active : ''}`}
                onClick={() => setActiveTab('roles')}
              >
                <FiKey /> Roles & Permissions
              </button>
              <button
                className={`${styles['admin-tabs-button']} ${activeTab === 'users' ? styles.active : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <FiUsers /> User Management
              </button>
              <button
                className={`${styles['admin-tabs-button']} ${activeTab === 'groups' ? styles.active : ''}`}
                onClick={() => setActiveTab('groups')}
              >
                <FiUsers /> Group Management
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className={styles['loading-spinner']}></div>
          ) : (
            <>
              {activeTab === 'roles' && (
                <div className={styles['admin-content']}>
                  <div className={styles['admin-card']}>
                    <h2><FiPlus /> Create New Role</h2>
                    <div className={`${styles['form-group']} ${styles['form-scope']}`}>
                      <input
                        type="text"
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        placeholder="Enter role name"
                        onKeyPress={e => e.key === 'Enter' && createRole()}
                      />
                      <button onClick={createRole} className={styles.primary}>
                        Create Role
                      </button>
                    </div>
                  </div>

                  <div className={styles['admin-card']}>
                    <h2><FiPlus /> Create New Permission</h2>
                    <div className={`${styles['form-group']} ${styles['form-scope']}`}>
                      <input
                        type="text"
                        value={newPermission}
                        onChange={e => setNewPermission(e.target.value)}
                        placeholder="Enter permission name"
                        onKeyPress={e => e.key === 'Enter' && createPermission()}
                      />
                      <button onClick={createPermission} className={styles.primary}>
                        Create Permission
                      </button>
                    </div>
                  </div>

                  <div className={styles['admin-card']}>
                    <h2>🛠️ Manage Existing Roles</h2>
                    {roles.map(role => (
                      <div key={role.id} className={`${styles['form-inline']} ${styles['form-scope']}`}>
                        <input
                          value={roleInputs[role.id] ?? role.name}
                          disabled={!editingRoles[role.id]}
                          onChange={(e) =>
                            setRoleInputs(prev => ({ ...prev, [role.id]: e.target.value }))
                          }
                        />
                        {editingRoles[role.id] ? (
                          <button
                            className={styles.success}
                            onClick={() => {
                              updateRole(role.id, roleInputs[role.id]);
                              setEditingRoles(prev => ({ ...prev, [role.id]: false }));
                            }}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className={styles.warning}
                            onClick={() => {
                              setEditingRoles(prev => ({ ...prev, [role.id]: true }));
                              setRoleInputs(prev => ({ ...prev, [role.id]: role.name }));
                            }}
                          >
                            Modify
                          </button>
                        )}
                        <button onClick={() => deleteRole(role.id)} className={styles.danger}>
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles['admin-card']}>
                    <h2>🛠️ Manage Existing Permissions</h2>
                    {permissions.map(permission => (
                      <div key={permission.id} className={`${styles['form-inline']} ${styles['form-scope']}`}>
                        <input
                          value={permissionInputs[permission.id] ?? permission.name}
                          disabled={!editingPermissions[permission.id]}
                          onChange={(e) =>
                            setPermissionInputs(prev => ({
                              ...prev,
                              [permission.id]: e.target.value,
                            }))
                          }
                        />
                        {editingPermissions[permission.id] ? (
                          <button
                            className={styles.success}
                            onClick={() => {
                              updatePermission(permission.id, permissionInputs[permission.id]);
                              setEditingPermissions(prev => ({ ...prev, [permission.id]: false }));
                            }}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className={styles.warning}
                            onClick={() => {
                              setEditingPermissions(prev => ({
                                ...prev,
                                [permission.id]: true,
                              }));
                              setPermissionInputs(prev => ({
                                ...prev,
                                [permission.id]: permission.name,
                              }));
                            }}
                          >
                            Modify
                          </button>
                        )}
                        <button onClick={() => deletePermission(permission.id)} className={styles.danger}>
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={`${styles['admin-card']} ${styles['form-scope']}`}>
                    <h2><FiKey /> Assign Permissions to Role</h2>
                    <div className={styles['form-group']}>
                      <select
                        value={selectedRole || ''}
                        onChange={e => setSelectedRole(e.target.value ? Number(e.target.value) : null)}
                        className={styles['full-width']}
                      >
                        <option value="">Select a role</option>
                        {roles?.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles['permissions-grid']}>
  <div className={styles['permissions-header']}>
    <h3>Available Permissions ({permissions.length})</h3>
    <button 
      onClick={toggleAllPermissions}
      className={styles['select-all-button']}
    >
      {isAllSelected ? 'Deselect All' : 'Select All'}
    </button>
  </div>
  
  <div className={styles['permissions-container']}>
    {permissions?.map(p => (
      <div
        key={p.id}
        className={`${styles['permission-item']} ${
          selectedPermissions.includes(p.id) ? styles.selected : ''
        }`}
        onClick={() => handlePermissionToggle(p.id)}
      >
        <div className={styles['permission-checkbox']}>
          {selectedPermissions.includes(p.id) && <FiCheck />}
        </div>
        <span>{p.name}</span>
      </div>
    ))}
  </div>
</div>

                    <button
                      onClick={assignPermissions}
                      className={`${styles.primary} ${styles['full-width']}`}
                      disabled={!selectedRole || selectedPermissions.length === 0}
                    >
                      Assign Selected Permissions
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className={styles['admin-content']}>
                  <div className={`${styles['admin-card']} ${styles['form-scope']}`}>
                    <h2><FiUsers /> Assign Role to User</h2>

                    <div className={styles['form-group']}>
                      <label>Select User</label>
                      <input
                        type="text"
                        placeholder="Search by email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className={styles['full-width']}
                      />
                      <select
                        value={selectedUser || ''}
                        onChange={e => setSelectedUser(e.target.value ? Number(e.target.value) : null)}
                        className={styles['full-width']}
                      >
                        <option value="">-- Choose a user --</option>
                        {users
                          .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
                          .map(u => (
                            <option key={u.id} value={u.id}>
                              {u.email} {u.role ? `(${u.role.name})` : ''}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className={styles['form-group']}>
                      <label>Select Role</label>
                      <select
                        value={selectedRoleForUser || ''}
                        onChange={e => setSelectedRoleForUser(e.target.value ? Number(e.target.value) : null)}
                        className={styles['full-width']}
                      >
                        <option value="">-- Choose a role --</option>
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={assignRoleToUser}
                      className={`${styles.primary} ${styles['full-width']}`}
                      disabled={!selectedUser || !selectedRoleForUser}
                    >
                      Assign Role to User
                    </button>
                  </div>

                  <div className={styles['admin-card']}>
                    <h2><FiUsers /> User List</h2>
                    <div className={styles['users-table-container']}>
  <table className={styles['users-table']}>
    <thead className={styles['table-header']}>
      <tr>
        <th>Email</th>
        <th>Role</th>
        <th>Groups</th>
        <th>Permissions</th>
      </tr>
    </thead>
    <tbody>
      {users
        .filter(user => user.email.toLowerCase().includes(userSearch.toLowerCase()))
        .map(user => (
          <tr key={user.id} className={styles['table-row']}>
            <td>
              <div className={styles['user-email']}>
                <FiMail className={styles['email-icon']} />
                {user.email}
              </div>
            </td>
            <td>
              <span className={user.role ? styles['has-value'] : styles['no-value']}>
                {user.role?.name || 'No role'}
              </span>
            </td>
            <td>
              <div className={styles['groups-list']}>
                {user.groups?.length ? (
                  user.groups.map(group => (
                    <span key={group.id} className={styles['group-badge']}>
                      {group.name}
                    </span>
                  ))
                ) : (
                  <span className={styles['no-value']}>No groups</span>
                )}
              </div>
            </td>
            <td>
              <td>
  <div className={styles['permissions-list']}>
    {[
      ...(user.role?.permissions || []),
      ...(user.groups?.flatMap(g => g.permissions || []) || [])
    ].length > 0 ? (
      [
        ...new Set([
          ...(user.role?.permissions?.map(p => p?.name).filter(Boolean) || []),
          ...(user.groups?.flatMap(g => 
            g.permissions?.map(p => p?.name).filter(Boolean) || []
          ) || [])
        ])
      ].map((name, i) => (
        name ? <span key={i} className={styles['permission-badge']}>{name}</span> : null
      ))
    ) : (
      <span className={styles['no-permission']}>None</span>
    )}
  </div>
</td>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
  <div className={styles['admin-content']}>
    <div className={styles['admin-card']}>
      <h2><FiPlus /> Create New Group</h2>
      <div className={`${styles['form-group']} ${styles['form-scope']}`}>
        <input
          type="text"
          value={newGroup}
          onChange={e => setNewGroup(e.target.value)}
          placeholder="Enter group name"
        />
        <input
          type="text"
          value={groupDescription}
          onChange={e => setGroupDescription(e.target.value)}
          placeholder="Enter group description (optional)"
        />
        <button onClick={createGroup} className={styles.primary}>
          Create Group
        </button>
      </div>
    </div>

    <div className={styles['admin-card']}>
      <h2>🛠️ Manage Existing Groups</h2>
      {groups.map(group => (
        <div key={group.id} className={`${styles['form-inline']} ${styles['form-scope']}`}>
          <input
            value={groupInputs[group.id]?.name ?? group.name}
            disabled={!editingGroups[group.id]}
            onChange={(e) =>
              setGroupInputs(prev => ({ 
                ...prev, 
                [group.id]: { 
                  ...prev[group.id], 
                  name: e.target.value 
                } 
              }))
            }
          />
          <input
            value={groupInputs[group.id]?.description ?? group.description ?? ''}
            disabled={!editingGroups[group.id]}
            onChange={(e) =>
              setGroupInputs(prev => ({ 
                ...prev, 
                [group.id]: { 
                  ...prev[group.id], 
                  description: e.target.value 
                } 
              }))
            }
            placeholder="Description"
          />
          {editingGroups[group.id] ? (
            <button
              className={styles.success}
              onClick={() => {
                updateGroup(
                  group.id, 
                  groupInputs[group.id].name,
                  groupInputs[group.id].description
                );
                setEditingGroups(prev => ({ ...prev, [group.id]: false }));
              }}
            >
              Save
            </button>
          ) : (
            <button
              className={styles.warning}
              onClick={() => {
                setEditingGroups(prev => ({ ...prev, [group.id]: true }));
                setGroupInputs(prev => ({ 
                  ...prev, 
                  [group.id]: { 
                    name: group.name, 
                    description: group.description || '' 
                  } 
                }));
              }}
            >
              Modify
            </button>
          )}
          <button onClick={() => deleteGroup(group.id)} className={styles.danger}>
            <FiTrash2 />
          </button>
        </div>
      ))}
    </div>

    <div className={`${styles['admin-card']} ${styles['form-scope']}`}>
      <h2><FiKey /> Assign Permissions to Group</h2>
      <div className={styles['form-group']}>
        <select
          value={selectedGroup || ''}
          onChange={e => setSelectedGroup(e.target.value ? Number(e.target.value) : null)}
          className={styles['full-width']}
        >
          <option value="">Select a group</option>
          {groups?.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className={styles['permissions-grid']}>
        {permissions?.map(p => (
          <div
            key={p.id}
            className={`${styles['permission-item']} ${
              selectedPermissions.includes(p.id) ? styles.selected : ''
            }`}
            onClick={() => handlePermissionToggle(p.id)}
          >
            <div className={styles['permission-checkbox']}>
              {selectedPermissions.includes(p.id) && <FiCheck />}
            </div>
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      <button
  onClick={() => {
    if (selectedGroup) {
      assignPermissionsToGroup(selectedGroup, selectedPermissions);
    }
  }}
  className={`${styles.primary} ${styles['full-width']}`}
  disabled={!selectedGroup || selectedPermissions.length === 0}
>
  Assign Selected Permissions to Group
</button>
    </div>

    <div className={`${styles['admin-card']} ${styles['form-scope']}`}>
  <h2><FiUsers /> Assign Groups to User</h2>
  <div className={styles['form-group']}>
    <label>Select User</label>
    <input
      type="text"
      placeholder="Search by email..."
      value={userSearch}
      onChange={(e) => setUserSearch(e.target.value)}
      className={styles['full-width']}
    />
    <select
      value={selectedUser || ''}
      onChange={(e) => setSelectedUser(e.target.value ? Number(e.target.value) : null)}
      className={styles['full-width']}
    >
      <option value="">-- Choose a user --</option>
      {users
        .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
        .map(u => (
          <option key={u.id} value={u.id}>
            {u.email}
          </option>
        ))}
    </select>
  </div>

  <div className={styles['form-group']}>
    <label>Select Groups (multiple)</label>
    <select
  multiple
  value={selectedGroupsForUser.map(String)} // Convert numbers to strings
  onChange={(e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(Number(options[i].value)); // Convert back to numbers
      }
    }
    setSelectedGroupsForUser(selected);
  }}
  className={styles['full-width']}
  size={5}
>
  {groups.map(g => (
    <option key={g.id} value={g.id}>{g.name}</option>
  ))}
</select>
  </div>

  <button
    onClick={assignGroupsToUser}
    className={`${styles.primary} ${styles['full-width']}`}
    disabled={!selectedUser || selectedGroupsForUser.length === 0}
  >
    Assign Groups to User
  </button>
</div>
  </div>
)}
            </>
          )}
        </div>
      </main>
    </div>
  </div>
);

}