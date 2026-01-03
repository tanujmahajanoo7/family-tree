import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';
import './FamilyTree.css';

interface TreeNode extends Person {
    children: TreeNode[];
    spouses: Person[];
}

export default function FamilyTree() {
    const navigate = useNavigate();
    const [roots, setRoots] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await personService.getAll();
            const builtRoots = buildTree(data);
            setRoots(builtRoots);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const buildTree = (allPeople: Person[]): TreeNode[] => {
        // 1. Create Map for easy access
        const map = new Map<number, TreeNode>();
        allPeople.forEach(p => {
            map.set(p.id!, { ...p, children: [], spouses: [] });
        });

        const roots: TreeNode[] = [];

        // 2. Link Children to Parents
        // We only link to Father to avoid duplication in simple view, 
        // or we need more complex logic. For 'Tree' view, usually following paternal or maternal line.
        // Let's try to link to *both* if possible, but that creates a graph, not a tree.
        // Standard approach: Link to Father (or "Head").

        allPeople.forEach(p => {
            const node = map.get(p.id!)!;
            // If has father, add to father's children
            if (p.father && map.has(p.father.id!)) {
                map.get(p.father.id!)!.children.push(node);
            }
            // If has mother but no father (unlikely but possible), add to mother
            else if (p.mother && map.has(p.mother.id!)) {
                // Determine if we should show under mother.
                // If mother has a husband/partner key, we might already show her there.
                // Simplify: Just roots are those without parents in the list.
                map.get(p.mother.id!)!.children.push(node);
            }
            else {
                roots.push(node);
            }
        });

        // Dedup roots (in case added to both, though logic above tries to be exclusive-ish)
        // Also, this logic is basic. A better one updates 'spouses' too.
        // But for MVP, let's just show descendants of Roots.
        return Array.from(new Set(roots));
    };

    const renderNode = (node: TreeNode) => (
        <li key={node.id}>
            <div className="node-card" onClick={() => navigate(`/people/${node.id}`)}>
                {node.imageUrl ? (
                    <img src={node.imageUrl} alt="" className="node-image" />
                ) : (
                    <div className="node-placeholder">{node.fullName.charAt(0)}</div>
                )}
                <span className="node-name">{node.fullName}</span>
                <span className="node-dates">{node.dateOfBirth?.split('-')[0]}</span>
            </div>

            {node.children.length > 0 && (
                <ul>
                    {node.children.map(child => renderNode(child))}
                </ul>
            )}
        </li>
    );

    if (loading) return <div className="loading-container">Growing tree...</div>;

    return (
        <div className="person-list-page" style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="person-list-header">
                <h2>Family Tree</h2>
                <button className="btn-add" onClick={() => navigate('/people')}>List View</button>
            </div>

            <div className="tree-container">
                <div className="tree">
                    <ul>
                        {roots.map(root => renderNode(root))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
