import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';
import './PersonList.css';

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

    if (loading) return <div className="loading-container">Loading family tree...</div>;
    if (error) return <div className="loading-container error">{error}</div>;

    return (
        <div className="person-list-page">
            <div className="person-list-header">
                <h2>Family Members</h2>
                <button className="btn-add" onClick={() => navigate('/people/new')}>
                    + Add Member
                </button>
            </div>

            <div className="person-grid">
                {people.map(person => (
                    <div
                        key={person.id}
                        className="person-card"
                        onClick={() => navigate(`/people/${person.id}`)}
                    >
                        {person.imageUrl ? (
                            <img src={person.imageUrl} alt={person.fullName} className="person-avatar" />
                        ) : (
                            <div className="person-placeholder">
                                {person.fullName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <h3 className="person-name">{person.fullName}</h3>
                        <div className="person-dates">
                            {formatDate(person.dateOfBirth)}
                            {person.dateOfDeath ? ` - ${formatDate(person.dateOfDeath)}` : ' - Present'}
                        </div>
                        <span className="person-gender">{person.gender}</span>
                    </div>
                ))}

                {people.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
                        No family members found. Start by adding one!
                    </div>
                )}
            </div>
        </div>
    );
}
