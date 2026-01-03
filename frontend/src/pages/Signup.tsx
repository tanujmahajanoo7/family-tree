import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="relative w-screen h-screen flex justify-center items-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                }}
            >
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 w-[90%] max-w-[400px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center text-white my-8 overflow-y-auto max-h-[90vh]">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-wide">Sign Up</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative text-left">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-white/50 py-2.5 text-base text-white placeholder-white/90 outline-none focus:border-white transition-colors"
                        />
                    </div>
                    <div className="relative text-left">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-white/50 py-2.5 text-base text-white placeholder-white/90 outline-none focus:border-white transition-colors"
                        />
                    </div>
                    <div className="relative text-left">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-white/50 py-2.5 text-base text-white placeholder-white/90 outline-none focus:border-white transition-colors"
                        />
                    </div>

                    {/* Custom Dropdown */}
                    <div className="relative text-left cursor-pointer select-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <div className="flex justify-between items-center py-2.5 border-b border-white/50 text-white transition-colors hover:border-white">
                            {formData.role === 'USER' ? 'User' : 'Admin'}
                            <span className={`text-xs transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 bg-black/60 backdrop-blur-md rounded mt-1 z-20 overflow-hidden shadow-lg border border-white/10">
                                <div
                                    className={`p-3 hover:bg-white/20 transition-colors ${formData.role === 'USER' ? 'bg-white/10 font-bold' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleRoleSelect('USER'); }}
                                >
                                    User
                                </div>
                                <div
                                    className={`p-3 hover:bg-white/20 transition-colors ${formData.role === 'ADMIN' ? 'bg-white/10 font-bold' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleRoleSelect('ADMIN'); }}
                                >
                                    Admin
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="w-full bg-white text-gray-800 py-3 text-base font-semibold rounded hover:bg-gray-100 hover:-translate-y-0.5 transition-all mt-2 cursor-pointer shadow-md">
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-sm text-white/80">
                    Already have an account? <Link to="/login" className="text-white font-semibold ml-1 hover:underline">Login</Link>
                </div>

                {message && (
                    <p className={`mt-4 text-sm font-medium ${message.startsWith('Error') || message === 'Network error' ? 'text-red-400' : 'text-green-400'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
