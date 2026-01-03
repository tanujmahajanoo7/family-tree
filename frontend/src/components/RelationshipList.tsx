import { useEffect, useState } from 'react';
import { relationshipService, personService } from '../services/api';
import type { Relationship, Person } from '../types';

interface Props {
    personId: number;
}

export default function RelationshipList({ personId }: Props) {
    const [relationships, setRelationships] = useState<Relationship[]>([]);
    const [people, setPeople] = useState<Person[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newRel, setNewRel] = useState({
        person2Id: 0,
        relationshipType: 'MARRIED'
    });

    useEffect(() => {
        loadData();
    }, [personId]);

    const loadData = async () => {
        const [rels, allPeople] = await Promise.all([
            relationshipService.getByPerson(personId),
            personService.getAll()
        ]);
        setRelationships(rels);
        setPeople(allPeople);
    };

    const handleAdd = async () => {
        if (!newRel.person2Id) return;
        try {
            await relationshipService.create({
                person1: { id: personId } as any, // Only ID needed usually
                person2: { id: newRel.person2Id } as any,
                relationshipType: newRel.relationshipType as any
            });
            setIsAdding(false);
            loadData();
        } catch (err) {
            alert('Failed to add relationship');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Remove relationship?')) return;
        try {
            await relationshipService.delete(id);
            loadData();
        } catch (err) {
            alert('Failed to delete relationship');
        }
    };

    const getOtherPerson = (rel: Relationship) => {
        return rel.person1.id === personId ? rel.person2 : rel.person1;
    };

    return (
        <div className="info-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="section-title" style={{ margin: 0, border: 'none' }}>Partners / Spouses</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {isAdding ? 'Cancel' : '+ Add'}
                </button>
            </div>

            {isAdding && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <select
                            style={{ flex: 1, padding: '5px' }}
                            onChange={e => setNewRel({ ...newRel, person2Id: Number(e.target.value) })}
                        >
                            <option value="">Select Partner...</option>
                            {people
                                .filter(p => p.id !== personId)
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.fullName}</option>
                                ))}
                        </select>
                        <select
                            style={{ padding: '5px' }}
                            value={newRel.relationshipType}
                            onChange={e => setNewRel({ ...newRel, relationshipType: e.target.value })}
                        >
                            <option value="MARRIED">Married</option>
                            <option value="PARTNER">Partner</option>
                            <option value="DIVORCED">Divorced</option>
                        </select>
                    </div>
                    <button onClick={handleAdd} className="btn-activate">Save</button>
                </div>
            )}

            <div className="info-grid">
                {relationships.map(rel => {
                    const other = getOtherPerson(rel);
                    return (
                        <div key={rel.id} className="info-item" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                            <button
                                onClick={() => handleDelete(rel.id!)}
                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                            <label>{rel.relationshipType}</label>
                            <span>{other.fullName}</span>
                        </div>
                    );
                })}
                {relationships.length === 0 && !isAdding && <p style={{ color: 'rgba(255,255,255,0.5)' }}>No relationships found.</p>}
            </div>
        </div>
    );
}
