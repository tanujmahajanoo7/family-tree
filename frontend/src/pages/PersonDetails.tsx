import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';

export default function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPerson();
    }, [id]);

    const loadPerson = async () => {
        try {
            if (id) {
                const data = await personService.getById(Number(id));
                setPerson(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this person? This cannot be undone.')) {
            try {
                if (id) {
                    await personService.delete(Number(id));
                    navigate('/people');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="flex justify-center p-16 text-lg text-white/80">Loading details...</div>;
    if (!person) return <div className="flex justify-center p-16 text-lg text-white/80">Person not found</div>;

    return (
        <div className="flex justify-center p-8 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-[800px] shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-8 border-b border-white/20 gap-6">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.fullName} className="w-[150px] h-[150px] rounded-full object-cover border-4 border-white/20" />
                        ) : (
                            <div className="w-[150px] h-[150px] rounded-full bg-white/10 flex items-center justify-center text-5xl text-white/50 border-4 border-white/20">
                                {person.fullName.charAt(0)}
                            </div>
                        )}

                        <div>
                            <h2 className="text-4xl font-bold mb-2">{person.fullName}</h2>
                            <div className="text-lg text-white/80 flex flex-col gap-1">
                                <span>{person.gender}</span>
                                <span>{person.isAlive ? 'Alive' : 'Deceased'}</span>
                                <span>{formatDate(person.dateOfBirth)} — {person.isAlive ? 'Present' : formatDate(person.dateOfDeath)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 self-center md:self-start">
                        <button
                            className="px-5 py-2.5 bg-white/20 text-white rounded font-semibold cursor-pointer hover:bg-white/30 transition-colors border-0"
                            onClick={() => navigate(`/people/${id}/edit`)}
                        >
                            Edit
                        </button>
                        <button
                            className="px-5 py-2.5 bg-[#ff6b6b]/20 border border-[#ff6b6b] text-[#ff6b6b] rounded font-semibold cursor-pointer hover:bg-[#ff6b6b] hover:text-white transition-colors"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Parents Section */}
                    <div>
                        <h3 className="text-2xl border-b border-white/10 pb-2 mb-4 font-semibold">Immediate Family</h3>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
                            <div className="flex flex-col gap-1">
                                <label className="text-white/60 text-sm">Father</label>
                                {person.father ? (
                                    <span
                                        className="text-lg font-medium cursor-pointer p-2 rounded hover:bg-white/10 transition-colors -ml-2"
                                        onClick={() => navigate(`/people/${person.father?.id}`)}
                                    >
                                        {person.father.fullName}
                                    </span>
                                ) : <span className="text-lg font-medium text-white/40">Unknown</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-white/60 text-sm">Mother</label>
                                {person.mother ? (
                                    <span
                                        className="text-lg font-medium cursor-pointer p-2 rounded hover:bg-white/10 transition-colors -ml-2"
                                        onClick={() => navigate(`/people/${person.mother?.id}`)}
                                    >
                                        {person.mother.fullName}
                                    </span>
                                ) : <span className="text-lg font-medium text-white/40">Unknown</span>}
                            </div>
                        </div>
                    </div>

                    {/* Other Details can go here */}
                </div>
            </div>
        </div>
    );
}
