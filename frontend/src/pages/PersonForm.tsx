import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';
import './PersonForm.css';

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
                // Upload and get URL
                // Note: The backend returns the URL as text
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
            if (id) {
                await personService.update(Number(id), formData as Person);
            } else {
                await personService.create(formData as Person);
            }
            navigate('/people');
        } catch (err) {
            setError('Failed to save person');
        }
    };

    return (
        <div className="person-form-page">
            <div className="person-form-container">
                <div className="form-header">
                    <h2>{id ? 'Edit' : 'Add'} Family Member</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Image Upload */}
                    <div className="form-group" style={{ textAlign: 'center' }}>
                        <div className="file-upload-wrapper">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="file-preview" />
                            ) : (
                                <div className="file-preview" style={{ background: 'rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                            <p>{uploading ? 'Uploading...' : 'Click to upload photo'}</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Is Alive?</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                <input
                                    type="radio"
                                    name="isAlive"
                                    checked={formData.isAlive === true}
                                    onChange={() => setFormData({ ...formData, isAlive: true })}
                                /> Yes
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                                <input
                                    type="radio"
                                    name="isAlive"
                                    checked={formData.isAlive === false}
                                    onChange={() => setFormData({ ...formData, isAlive: false })}
                                /> No
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>

                    {!formData.isAlive && (
                        <div className="form-group">
                            <label>Date of Death</label>
                            <input
                                type="date"
                                name="dateOfDeath"
                                value={formData.dateOfDeath}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Father</label>
                        <select
                            name="fatherId"
                            value={formData.fatherId || ''}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Father --</option>
                            {people
                                .filter(p => p.gender === 'MALE' && p.id !== Number(id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.fullName}</option>
                                ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Mother</label>
                        <select
                            name="motherId"
                            value={formData.motherId || ''}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Mother --</option>
                            {people
                                .filter(p => p.gender === 'FEMALE' && p.id !== Number(id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.fullName}</option>
                                ))}
                        </select>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="btn-submit">Save Member</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/people')}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
