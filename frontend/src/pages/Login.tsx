import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data));
                setMessage('Login successful!');
                setTimeout(() => navigate('/home'), 1000);
            } else {
                setMessage('Invalid username or password');
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

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 w-[90%] max-w-[400px] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] text-center text-white">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold tracking-wide">Login</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative text-left">
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your email"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-3 bg-transparent border-b border-white/50 py-2.5 text-base text-white placeholder-white/90 outline-none focus:border-white transition-colors rounded-full"
                        />
                    </div>
                    <div className="relative text-left">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 bg-transparent border-b border-white/50 py-2.5 text-base text-white placeholder-white/90 outline-none focus:border-white transition-colors rounded-full"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm text-white/80">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" className="accent-white" /> Remember me
                        </label>
                        <Link to="/forgot-password" className="hover:text-white hover:underline transition-colors">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-gray-800 py-3 text-base font-semibold rounded hover:bg-gray-100 hover:-translate-y-0.5 transition-all mt-2 cursor-pointer shadow-md"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-sm text-white/80">
                    Don't have an account? <Link to="/signup" className="text-white font-semibold ml-1 hover:underline">Register</Link>
                </div>

                {message && (
                    <p className={`mt-4 text-sm font-medium ${message === 'Login successful!' ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
