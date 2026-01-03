import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';
import RelationshipList from '../components/RelationshipList';
import './PersonDetails.css';

export default function PersonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);
    const [children, setChildren] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) loadPerson(Number(id));
    }, [id]);

    const loadPerson = async (personId: number) => {
        try {
            const [data, allPeople] = await Promise.all([
                personService.getById(personId),
                personService.getAll()
            ]);
            setPerson(data);
            setChildren(allPeople.filter(p => (p.father && p.father.id === personId) || (p.mother && p.mother.id === personId)));
        } catch (err) {
            setError('Failed to load person details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!person || !window.confirm('Are you sure you want to delete this person? This cannot be undone.')) return;

        try {
            await personService.delete(person.id!);
            navigate('/people');
        } catch (err) {
            alert('Failed to delete person');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (error || !person) return <div className="loading-container error">{error || 'Person not found'}</div>;

    return (
        <div className="person-details-page">
            <div className="details-container">
                <div className="details-header">
                    <div className="profile-section">
                        {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.fullName} className="large-avatar" />
                        ) : (
                            <div className="large-avatar" style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                {person.fullName.charAt(0)}
                            </div>
                        )}
                        <div className="profile-info">
                            <h2>{person.fullName}</h2>
                            <div className="profile-meta">
                                <span>{person.gender}</span>
                                <span>
                                    {person.dateOfBirth}
                                    {person.dateOfDeath ? ` - ${person.dateOfDeath}` : ' - Present'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="btn-edit" onClick={() => navigate(`/people/${person.id}/edit`)}>Edit</button>
                        <button className="btn-delete" onClick={handleDelete}>Delete</button>
                    </div>
                </div>

                <div className="details-content">
                    <div className="info-block">
                        <h3 className="section-title">Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Email</label>
                                <span>{person.email || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Contact Number</label>
                                <span>{person.contactNumber || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <label>Status</label>
                                <span>{person.isAlive ? 'Alive' : 'Deceased'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-block">
                        <h3 className="section-title">Parents</h3>
                        <div className="info-grid">
                            <div className="info-item clickable" onClick={() => person.father && navigate(`/people/${person.father.id}`)}>
                                <label>Father</label>
                                <span>{person.father ? person.father.fullName : 'Unknown'}</span>
                            </div>
                            <div className="info-item clickable" onClick={() => person.mother && navigate(`/people/${person.mother.id}`)}>
                                <label>Mother</label>
                                <span>{person.mother ? person.mother.fullName : 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <RelationshipList personId={person.id!} />

                    <div className="info-block">
                        <h3 className="section-title">Children</h3>
                        <div className="info-grid">
                            {children.map(child => (
                                <div key={child.id} className="info-item clickable" onClick={() => navigate(`/people/${child.id}`)}>
                                    <label>{child.gender === 'MALE' ? 'Son' : 'Daughter'}</label>
                                    <span>{child.fullName}</span>
                                </div>
                            ))}
                            {children.length === 0 && <p style={{ color: 'rgba(255,255,255,0.5)' }}>No children found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
