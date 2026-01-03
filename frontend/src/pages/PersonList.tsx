import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';

export default function PersonList() {
    const navigate = useNavigate();
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPeople();
    }, []);

    const loadPeople = async () => {
        try {
            const data = await personService.getAll();
            setPeople(data);
        } catch (err) {
            setError('Failed to load family members');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="flex justify-center p-16 text-lg text-white/80">Loading family tree...</div>;
    if (error) return <div className="flex justify-center p-16 text-lg text-[#ff6b6b]">{error}</div>;

    return (
        <div className="p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold drop-shadow-md">Family Members</h2>
                <button
                    className="bg-[#51cf66] text-white border-none px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[#40c057] hover:-translate-y-0.5"
                    onClick={() => navigate('/people/new')}
                >
                    + Add Member
                </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8">
                {people.map(person => (
                    <div
                        key={person.id}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:border-white/40"
                        onClick={() => navigate(`/people/${person.id}`)}
                    >
                        {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.fullName} className="w-[100px] h-[100px] rounded-full object-cover mb-4 border-[3px] border-white/20 bg-black/20" />
                        ) : (
                            <div className="w-[100px] h-[100px] rounded-full bg-white/10 flex items-center justify-center text-4xl text-white/50 mb-4 border-[3px] border-white/20">
                                {person.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h3 className="text-xl font-semibold mb-2">{person.fullName}</h3>
                        <div className="text-sm text-white/70 mb-2">
                            {formatDate(person.dateOfBirth)}
                            {person.dateOfDeath ? ` - ${formatDate(person.dateOfDeath)}` : ' - Present'}
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-white/10 uppercase tracking-wider">
                            {person.gender}
                        </span>
                    </div>
                ))}

                {people.length === 0 && (
                    <div className="col-span-full text-center opacity-70">
                        No family members found. Start by adding one!
                    </div>
                )}
            </div>
        </div>
    );
}
