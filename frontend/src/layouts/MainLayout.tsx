import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function MainLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="flex flex-col h-screen bg-[#0e1116] text-gray-100 font-sans">
            {/* Navigation */}
            <nav className="px-8 py-4 border-b border-white/10 flex gap-8 items-center bg-[#161b22] shadow-sm">
                <h1 className="m-0 mr-auto text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
                    Family Tree
                </h1>

                <div className="flex gap-6 items-center text-sm font-medium">
                    <Link to="/home" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link to="/tree" className="text-gray-400 hover:text-white transition-colors">Tree View</Link>
                    <Link to="/people" className="text-gray-400 hover:text-white transition-colors">People</Link>
                    <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link>
                    <Link to="/api-explorer" className="text-gray-400 hover:text-white transition-colors">API</Link>
                    <button
                        onClick={handleLogout}
                        className="bg-transparent border border-white/20 text-gray-300 px-4 py-1.5 rounded hover:bg-white/5 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main className="flex-1 overflow-auto p-6 relative">
                <Outlet />
            </main>
        </div>
    );
}
