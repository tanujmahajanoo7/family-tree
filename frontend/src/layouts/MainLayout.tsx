import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="main-layout">
            {/* Navigation will go here */}
            <nav style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h1>Family Tree</h1>
            </nav>
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
        </div>
    );
}
