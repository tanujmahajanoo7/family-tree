import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRoleSelect = (role: string) => {
        setFormData({ ...formData, role });
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('User registered successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const data = await response.json();
                setMessage(data.message || 'Error registering user');
            }
        } catch (error) {
            setMessage('Network error');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Sign Up</h2>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group custom-select-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="custom-select-trigger">
                            {formData.role === 'USER' ? 'User' : 'Admin'}
                            <span className="arrow">▼</span>
                        </div>
                        {isDropdownOpen && (
                            <div className="custom-options">
                                <div
                                    className={`custom-option ${formData.role === 'USER' ? 'selected' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleRoleSelect('USER'); }}
                                >
                                    User
                                </div>
                                <div
                                    className={`custom-option ${formData.role === 'ADMIN' ? 'selected' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleRoleSelect('ADMIN'); }}
                                >
                                    Admin
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="auth-button">Sign Up</button>
                </form>

                <div className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>

                {message && <p className={message.startsWith('Error') || message === 'Network error' ? 'error-message' : 'success-message'}>{message}</p>}
            </div>
        </div>
    );
}
