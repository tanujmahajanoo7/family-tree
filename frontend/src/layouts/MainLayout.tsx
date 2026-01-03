import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function MainLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Navigation */}
            <nav style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
                background: 'var(--color-surface, #1e1e1e)'
            }}>
                <h1 style={{ margin: 0, marginRight: 'auto', fontSize: '1.5rem', background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Family Tree</h1>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/home" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                    <Link to="/tree" style={{ color: 'inherit', textDecoration: 'none' }}>Tree View</Link>
                    <Link to="/people" style={{ color: 'inherit', textDecoration: 'none' }}>People</Link>
                    <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'inherit',
                            padding: '0.4rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <main style={{ flex: 1, overflow: 'auto', padding: '1rem', position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
}
