import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Pending removal line - will perform full replace logic below

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    roles: string[];
    active: boolean;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.roles && !user.roles.includes('ADMIN') && !user.roles.includes('SUPERADMIN')) {
            alert('Access Denied: Admins Only');
            navigate('/home');
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            const response = await fetch('http://localhost:8080/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            // Map backend response (roles array) to frontend interface (role string)
            const mappedUsers = data.map((u: any) => ({
                ...u,
                roles: u.roles || [],
                role: u.roles ? u.roles.join(', ') : 'USER'
            }));
            setUsers(mappedUsers);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (userId: number) => {
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            await fetch(`http://localhost:8080/api/admin/users/${userId}/activate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Refresh list
            setUsers(users.map(u => u.id === userId ? { ...u, active: true } : u));
        } catch (err) {
            alert('Failed to activate user');
        }
    };

    const handleDeactivate = async (userId: number) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            await fetch(`http://localhost:8080/api/admin/users/${userId}/deactivate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Refresh list
            setUsers(users.map(u => u.id === userId ? { ...u, active: false } : u));
        } catch (err) {
            alert('Failed to deactivate user');
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        if (!window.confirm(`Are you sure you want to make this user a ${newRole}?`)) return;
        try {
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // Important for sending string body
                },
                body: newRole // Send role directly as string
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update role');
            }

            // Refresh list
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, roles: [newRole] } : u));
        } catch (err: any) {
            alert(err.message || 'Failed to update role');
        }
    };

    if (loading) return <div className="text-center p-8 text-xl text-white">Loading admin panel...</div>;

    const currentUserId = JSON.parse(localStorage.getItem('user') || '{}').id;

    return (
        <div className="relative w-screen h-screen flex justify-center p-8 overflow-hidden text-white">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-[1000px] h-fit max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
                    <h2 className="text-3xl font-bold">Admin Dashboard</h2>
                    <button
                        className="px-4 py-2 bg-white/20 text-white border-0 rounded cursor-pointer hover:bg-white/30 transition-colors"
                        onClick={() => navigate('/home')}
                    >
                        Back to Home
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">ID</th>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">Username</th>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">Email</th>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">Role</th>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">Status</th>
                                <th className="p-4 text-left border-b border-white/10 font-semibold uppercase text-xs text-white/70">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => {
                                    const isSuperAdmin = user.roles && user.roles.includes('SUPERADMIN');
                                    // Admin check: true if ADMIN is present (even if SUPERADMIN is also there, strict check handled by hierarchy below)
                                    const isAdmin = user.roles && user.roles.includes('ADMIN');
                                    const isSelf = user.id === currentUserId;
                                    // Protect ID 1 explicitly as fallback
                                    const isProtected = user.id === 1 || isSuperAdmin;

                                    return (
                                        <tr key={user.id}>
                                            <td className="p-4 border-b border-white/10">{user.id}</td>
                                            <td className="p-4 border-b border-white/10">{user.username}</td>
                                            <td className="p-4 border-b border-white/10">{user.email}</td>
                                            <td className="p-4 border-b border-white/10 text-xs font-bold uppercase">
                                                <span className={`px-2 py-1 rounded-sm ${isSuperAdmin ? 'bg-indigo-500/20 text-indigo-300' :
                                                    isAdmin ? 'bg-purple-500/20 text-purple-300' :
                                                        'text-gray-300'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-white/10">
                                                <span className={`px-2 py-1 rounded-xl text-xs font-bold ${user.active ? 'bg-[#51cf66]/20 text-[#51cf66]' : 'bg-[#ff6b6b]/20 text-[#ff6b6b]'}`}>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 border-b border-white/10 flex gap-2 items-center">
                                                {isProtected ? (
                                                    <span className="text-xs text-gray-400 italic bg-white/5 px-2 py-1 rounded">Protected</span>
                                                ) : (
                                                    <>
                                                        {/* Status Toggle Button */}
                                                        {!user.active ? (
                                                            <button
                                                                className="px-3 py-1.5 bg-[#51cf66] text-white border-none rounded cursor-pointer font-semibold text-sm hover:scale-105 transition-transform"
                                                                onClick={() => handleActivate(user.id)}
                                                            >
                                                                Activate
                                                            </button>
                                                        ) : (
                                                            !isSelf && (
                                                                <button
                                                                    className="px-3 py-1.5 bg-[#ff6b6b] text-white border-none rounded cursor-pointer font-semibold text-sm hover:scale-105 transition-transform"
                                                                    onClick={() => handleDeactivate(user.id)}
                                                                >
                                                                    Deactivate
                                                                </button>
                                                            )
                                                        )}

                                                        {/* Role Toggle Button */}
                                                        {!isSelf && (
                                                            isAdmin ? (
                                                                <button
                                                                    className="px-3 py-1.5 bg-yellow-600/80 text-white border-none rounded cursor-pointer font-semibold text-sm hover:scale-105 transition-transform"
                                                                    onClick={() => handleRoleChange(user.id, 'USER')}
                                                                >
                                                                    Dismiss Admin
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="px-3 py-1.5 bg-purple-600/80 text-white border-none rounded cursor-pointer font-semibold text-sm hover:scale-105 transition-transform"
                                                                    onClick={() => handleRoleChange(user.id, 'ADMIN')}
                                                                >
                                                                    Make Admin
                                                                </button>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-white/60">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
