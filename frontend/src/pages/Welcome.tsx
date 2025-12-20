import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="welcome-content">
                <div className="hero-box">
                    <h1 className="hero-title">Family Tree</h1>
                    <p className="hero-subtitle">
                        Connect with your roots. Preserve your legacy.<br />
                        A beautiful way to explore and share your family history.
                    </p>
                    <div className="action-buttons">
                        <button className="btn-primary" onClick={() => navigate('/signup')}>
                            Get Started
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
