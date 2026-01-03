import { useEffect, useState } from 'react';

interface Endpoint {
    method: string;
    path: string;
    summary?: string;
}

export default function ApiExplorer() {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEndpoints();
    }, []);

    const fetchEndpoints = async () => {
        try {
            // Fetch OpenAPI JSON from backend (requires backend to have springdoc-openapi)
            const response = await fetch('http://localhost:8080/v3/api-docs');
            if (!response.ok) {
                throw new Error('Failed to fetch API documentation. Ensure backend is running and Swagger is enabled.');
            }
            const data = await response.json();

            const paths: Endpoint[] = [];
            Object.keys(data.paths).forEach(path => {
                Object.keys(data.paths[path]).forEach(method => {
                    paths.push({
                        method: method.toUpperCase(),
                        path: path,
                        summary: data.paths[path][method].summary || 'No description'
                    });
                });
            });

            setEndpoints(paths);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'POST': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'PUT': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
            case 'DELETE': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="p-8 text-white max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">API Explorer</span>
                <span className="text-sm px-3 py-1 bg-white/10 rounded-full border border-white/10 font-normal text-gray-300">Live Backend Status</span>
            </h2>

            {loading && <div className="text-center p-12 text-gray-400 animate-pulse">Scanning endpoints...</div>}

            {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 mb-8">
                    <p className="font-semibold mb-2">Connection Failed</p>
                    <p className="text-sm opacity-80">{error}</p>
                    <p className="text-sm mt-4 text-white/50">Tip: Make sure the Spring Boot backend is running and `springdoc-openapi` dependency is added.</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid gap-4">
                    {endpoints.map((ep, idx) => (
                        <div key={idx} className="bg-[#161b22]/50 border border-white/5 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-[#161b22] hover:border-white/10 transition-colors">
                            <div className={`px-3 py-1.5 rounded text-xs font-bold border w-20 text-center uppercase tracking-wider ${getMethodColor(ep.method)}`}>
                                {ep.method}
                            </div>
                            <div className="flex-1 font-mono text-sm text-gray-300">
                                {ep.path}
                            </div>
                            <div className="text-sm text-gray-500 italic">
                                {ep.summary}
                            </div>
                        </div>
                    ))}

                    {endpoints.length === 0 && (
                        <div className="text-center p-8 text-gray-500">No endpoints found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
