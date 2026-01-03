import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="relative w-screen h-screen flex justify-center items-center text-white overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] animate-[fadeIn_1s_ease-out]">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-md">
                        Family Tree
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-light">
                        Connect with your roots. Preserve your legacy.<br />
                        A beautiful way to explore and share your family history.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button
                            className="px-10 py-4 text-lg font-semibold text-[#1a472a] bg-white rounded-full hover:-translate-y-1 hover:shadow-xl transition-all uppercase tracking-wide cursor-pointer"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started
                        </button>
                        <button
                            className="px-10 py-4 text-lg font-semibold text-white bg-white/10 border-2 border-white rounded-full hover:bg-white hover:text-[#1a472a] hover:-translate-y-1 transition-all uppercase tracking-wide cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
