import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, roleService } from '../services/api';
import type { User } from '../types';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newRoleName, setNewRoleName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [usersData, rolesData] = await Promise.all([
                adminService.getAllUsers(),
                roleService.getAll()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            setError('Failed to load data. Are you an Admin?');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            await adminService.activateUser(userId);
            setUsers(users.map(u => u.id === userId ? { ...u, active: true } : u));
        } catch (err) {
            alert('Failed to activate user');
        }
    };

    const handleCreateRole = async () => {
        if (!newRoleName) return;
        try {
            await roleService.createRole(newRoleName);
            setNewRoleName('');
            // Reload roles
            const updatedRoles = await roleService.getAll();
            setRoles(updatedRoles);
        } catch (err) {
            alert('Failed to create role');
        }
    };

    const handleAssignRole = async (userId: number, roleId: string) => {
        if (!roleId) return;
        try {
            await roleService.assignRole(Number(roleId), userId);
            // Reload users to show new role
            const updatedUsers = await adminService.getAllUsers();
            setUsers(updatedUsers);
        } catch (err) {
            alert('Failed to assign role');
        }
    };

    if (loading) return <div className="admin-dashboard"><div className="loading">Loading users...</div></div>;
    if (error) return <div className="admin-dashboard"><div className="error">{error} <button onClick={() => navigate('/home')}>Go Back</button></div></div>;

    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h2>User Management</h2>
                    <button className="btn-back" onClick={() => navigate('/home')}>Back to Home</button>
                </div>

                <div className="role-management" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <h3>Role Management</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="New Role Name (e.g. ROLE_MODERATOR)"
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '4px', border: 'none' }}
                        />
                        <button onClick={handleCreateRole} className="btn-activate">Create Role</button>
                    </div>
                </div>

                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Assign Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.roles?.map(r => typeof r === 'string' ? r : (r as any).name).join(', ')}</td>
                                <td>
                                    <select
                                        onChange={(e) => handleAssignRole(user.id, e.target.value)}
                                        value=""
                                        style={{ padding: '0.3rem', borderRadius: '4px' }}
                                    >
                                        <option value="">+ Assign...</option>
                                        {roles.map((r: any) => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <span className={`status-badge ${user.active ? 'status-active' : 'status-inactive'}`}>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    {!user.active && (
                                        <button
                                            className="btn-activate"
                                            onClick={() => handleActivate(user.id)}
                                        >
                                            Activate
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
