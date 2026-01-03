import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';

export default function PersonForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Person>>({
        fullName: '',
        gender: 'MALE',
        isAlive: true,
        dateOfBirth: '',
        dateOfDeath: '',
        imageUrl: ''
    });
    const [spouseId, setSpouseId] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAllPeople();
        if (id) {
            loadPerson(Number(id));
        }
    }, [id]);

    const loadAllPeople = async () => {
        try {
            const data = await personService.getAll();
            setPeople(data);
        } catch (err) {
            console.error('Failed to load people list');
        }
    };

    const loadPerson = async (personId: number) => {
        try {
            const data = await personService.getById(personId);
            setFormData(data);

            // Fetch relationships to find spouse
            try {
                const relationships = await import('../services/api').then(m => m.relationshipService.getByPerson(personId));
                const marriage = relationships.find(r => r.relationshipType === 'MARRIED');
                if (marriage) {
                    // Determine which ID is the spouse (not the current person)
                    // Note: Relationship object has person1: Person, person2: Person objects, not just IDs
                    // We need to check IDs. Assuming backend returns full Person objects in Relationship.
                    // Let's check api.ts types. Actually relationshipService returns Relationship[]
                    // We need to match ID.
                    const spouse = marriage.person1.id === personId ? marriage.person2 : marriage.person1;
                    setSpouseId(spouse.id!.toString());
                }
            } catch (relErr) {
                console.log('No spouse found or failed to load relationships', relErr);
            }

        } catch (err) {
            setError('Failed to load person data');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const data = new FormData();
            data.append('file', file);

            setUploading(true);
            try {
                const url = await personService.uploadImage(data);
                setFormData(prev => ({ ...prev, imageUrl: url }));
            } catch (err) {
                console.error('Upload failed', err);
                alert('Failed to upload image');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let savedPerson: Person;
            if (id) {
                savedPerson = await personService.update(Number(id), formData as Person);
            } else {
                savedPerson = await personService.create(formData as Person);
            }

            // Handle Spouse Relationship
            if (spouseId) {
                // Check if we need to update or create
                // For simplicity, we just try to create. 
                // In a real app, we might need to delete old marriage if changed.
                // Here we assume "Adding" for now or basic overwrite/add.
                const { relationshipService } = await import('../services/api');
                await relationshipService.create({
                    person1Id: savedPerson.id!,
                    person2Id: Number(spouseId),
                    relationshipType: 'MARRIED',
                    startDate: new Date().toISOString().split('T')[0] // Default to today
                }).catch(err => console.error("Failed to link spouse", err));
            }

            navigate('/people');
        } catch (err) {
            setError('Failed to save person');
        }
    };

    return (
        <div className="flex justify-center p-8 text-white min-h-screen">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 w-full max-w-[600px] shadow-2xl h-fit">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold">{id ? 'Edit' : 'Add'} Family Member</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Image Upload */}
                    <div className="text-center">
                        <div className="relative border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-white/5 group">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="w-[100px] h-[100px] rounded-full object-cover mx-auto mb-4 border-[3px] border-white/20" />
                            ) : (
                                <div className="w-[100px] h-[100px] rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border-[3px] border-white/20">
                                    <span>Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <p className="text-sm text-white/70 group-hover:text-white transition-colors">{uploading ? 'Uploading...' : 'Click to upload photo'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="MALE" className="bg-gray-800">Male</option>
                            <option value="FEMALE" className="bg-gray-800">Female</option>
                            <option value="OTHER" className="bg-gray-800">Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Is Alive?</label>
                        <div className="flex gap-4 items-center">
                            <label className="flex items-center gap-2 font-normal cursor-pointer">
                                <input
                                    type="radio"
                                    name="isAlive"
                                    checked={formData.isAlive === true}
                                    onChange={() => setFormData({ ...formData, isAlive: true })}
                                    className="accent-[#51cf66]"
                                /> Yes
                            </label>
                            <label className="flex items-center gap-2 font-normal cursor-pointer">
                                <input
                                    type="radio"
                                    name="isAlive"
                                    checked={formData.isAlive === false}
                                    onChange={() => setFormData({ ...formData, isAlive: false })}
                                    className="accent-[#ff6b6b]"
                                /> No
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors [color-scheme:dark]"
                        />
                    </div>

                    {!formData.isAlive && (
                        <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease]">
                            <label className="font-medium text-white/90">Date of Death</label>
                            <input
                                type="date"
                                name="dateOfDeath"
                                value={formData.dateOfDeath}
                                onChange={handleChange}
                                className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors [color-scheme:dark]"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Father</label>
                        <select
                            name="fatherId"
                            value={formData.fatherId || ''}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="" className="bg-gray-800">-- Select Father --</option>
                            {people
                                .filter(p => p.gender === 'MALE' && p.id !== Number(id))
                                .map(p => (
                                    <option key={p.id} value={p.id} className="bg-gray-800">{p.fullName}</option>
                                ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-medium text-white/90">Mother</label>
                        <select
                            name="motherId"
                            value={formData.motherId || ''}
                            onChange={handleChange}
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="" className="bg-gray-800">-- Select Mother --</option>
                            {people
                                .filter(p => p.gender === 'FEMALE' && p.id !== Number(id))
                                .map(p => (
                                    <option key={p.id} value={p.id} className="bg-gray-800">{p.fullName}</option>
                                ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/10 pt-4 mt-2">
                        <label className="font-medium text-white/90">Spouse (Optional)</label>
                        <select
                            name="spouseId"
                            value={spouseId}
                            onChange={(e) => setSpouseId(e.target.value)}
                            className="w-full p-2.5 bg-black/20 border border-white/20 rounded text-white text-base focus:border-white/60 focus:outline-none transition-colors appearance-none"
                        >
                            <option value="" className="bg-gray-800">-- Select Spouse --</option>
                            {people
                                .filter(p => p.id !== Number(id)) // Can marry anyone else for now
                                .map(p => (
                                    <option key={p.id} value={p.id} className="bg-gray-800">{p.fullName}</option>
                                ))}
                        </select>
                    </div>

                    {error && <p className="text-[#ff6b6b] text-sm mt-2">{error}</p>}

                    <div className="mt-4 flex flex-col gap-3">
                        <button type="submit" className="w-full py-3 bg-[#51cf66] text-white rounded font-semibold text-lg cursor-pointer transition-colors hover:bg-[#40c057] border-0">Save Member</button>
                        <button type="button" className="w-full bg-transparent text-white/70 border-0 underline cursor-pointer hover:text-white" onClick={() => navigate('/people')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
