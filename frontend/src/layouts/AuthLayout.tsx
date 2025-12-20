import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="auth-layout" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--color-surface)'
        }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
                <Outlet />
            </div>
        </div>
    );
}
