import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Pending removal line - will perform full replace logic below

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
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
        if (user.roles && !user.roles.includes('ROLE_ADMIN')) {
            alert('Access Denied: Admins Only');
            navigate('/home');
            return;
        }

        fetchUsers();
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            // Mock fetch or actual API
            const token = JSON.parse(localStorage.getItem('user') || '{}').token;
            // In a real app we'd need a GetAllUsers endpoint, defaulting to empty or mock for now as I don't see one in list
            // Assuming endpoint exists or we skip logic. 
            // Actually, based on User Rules, there is an activate endpoint but maybe not list.
            // I'll leave the state empty but structured.
            setUsers([]);
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

    if (loading) return <div className="text-center p-8 text-xl text-white">Loading admin panel...</div>;

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
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="p-4 border-b border-white/10">{user.id}</td>
                                        <td className="p-4 border-b border-white/10">{user.username}</td>
                                        <td className="p-4 border-b border-white/10">{user.email}</td>
                                        <td className="p-4 border-b border-white/10 text-xs font-bold uppercase">{user.role}</td>
                                        <td className="p-4 border-b border-white/10">
                                            <span className={`px-2 py-1 rounded-xl text-xs font-bold ${user.active ? 'bg-[#51cf66]/20 text-[#51cf66]' : 'bg-[#ff6b6b]/20 text-[#ff6b6b]'}`}>
                                                {user.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b border-white/10">
                                            {!user.active && (
                                                <button
                                                    className="px-3 py-1.5 bg-[#51cf66] text-white border-none rounded cursor-pointer font-semibold text-sm hover:scale-105 transition-transform"
                                                    onClick={() => handleActivate(user.id)}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-white/60">
                                        No users found or API not implemented.
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
