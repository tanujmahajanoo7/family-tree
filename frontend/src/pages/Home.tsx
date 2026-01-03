import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-full flex flex-col items-center justify-center text-white relative">
            <div className="z-10 text-center max-w-2xl px-6">
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent drop-shadow-md">
                    Welcome Back
                </h2>
                <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
                    Explore your family history, manage relationships, and discover your roots through our interactive visualization tools.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mx-auto">
                    <div
                        onClick={() => navigate('/tree')}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/30 group"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌳</div>
                        <h3 className="text-xl font-semibold mb-2">View Tree</h3>
                        <p className="text-sm text-gray-400">Visualize family connections in an interactive tree.</p>
                    </div>

                    <div
                        onClick={() => navigate('/people')}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/30 group"
                    >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                        <h3 className="text-xl font-semibold mb-2">Manage People</h3>
                        <p className="text-sm text-gray-400">Add, edit, and organize family members.</p>
                    </div>
                </div>
            </div>

            {/* Soft decorative background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}