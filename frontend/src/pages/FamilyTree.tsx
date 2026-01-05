import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { personService } from '../services/api';
import type { Person } from '../types';

interface TreeNode extends Person {
    children: TreeNode[];
    spouses: Person[];
}

export default function FamilyTree() {
    const navigate = useNavigate();
    const [roots, setRoots] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    // Center the view when data loads
    useEffect(() => {
        if (!loading && roots.length > 0 && containerRef.current) {
            // Small timeout to ensure rendering is complete and widths are correct
            setTimeout(() => {
                if (containerRef.current) {
                    const { scrollWidth, clientWidth } = containerRef.current;
                    const centerPos = (scrollWidth - clientWidth) / 2;
                    containerRef.current.scrollLeft = centerPos;
                }
            }, 100);
        }
    }, [loading, roots]);

    const loadData = async () => {
        try {
            const [peopleData, relationshipsData] = await Promise.all([
                personService.getAll(),
                import('../services/api').then(m => m.relationshipService.getAll())
            ]);
            const builtRoots = buildTree(peopleData, relationshipsData);
            setRoots(builtRoots);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const buildTree = (allPeople: Person[], allRelationships: import('../types').Relationship[] = []): TreeNode[] => {
        const relationshipMap = new Map<number, number>();

        allRelationships.forEach(rel => {
            if (rel.relationshipType === 'MARRIED' && rel.person1.id && rel.person2.id) {
                const p1 = rel.person1.id;
                const p2 = rel.person2.id;
                relationshipMap.set(p1, p2);
                relationshipMap.set(p2, p1);
            }
        });

        const map = new Map<number, TreeNode>();
        const processedSpouses = new Set<number>();

        allPeople.forEach(p => {
            map.set(p.id!, { ...p, children: [], spouses: [] });
        });

        // Link Spouses
        allPeople.forEach(p => {
            if (relationshipMap.has(p.id!) && !processedSpouses.has(p.id!)) {
                const spouseId = relationshipMap.get(p.id!)!;
                if (map.has(spouseId) && !processedSpouses.has(spouseId)) {
                    const node = map.get(p.id!)!;
                    const spouseNode = map.get(spouseId)!;
                    node.spouses.push(spouseNode);
                    processedSpouses.add(spouseId);
                }
            }
        });

        const roots: TreeNode[] = [];

        // Link Children
        allPeople.forEach(p => {
            if (processedSpouses.has(p.id!)) return;

            const node = map.get(p.id!)!;
            let parentFound = false;

            if (p.father && map.has(p.father.id!)) {
                const fatherNode = map.get(p.father.id!)!;
                if (!processedSpouses.has(p.father.id!)) {
                    fatherNode.children.push(node);
                    parentFound = true;
                } else {
                    const spouseId = relationshipMap.get(p.father.id!);
                    if (spouseId && map.has(spouseId)) {
                        map.get(spouseId)!.children.push(node);
                        parentFound = true;
                    }
                }
            }

            if (!parentFound && p.mother && map.has(p.mother.id!)) {
                const motherNode = map.get(p.mother.id!)!;
                if (!processedSpouses.has(p.mother.id!)) {
                    motherNode.children.push(node);
                    parentFound = true;
                } else {
                    const spouseId = relationshipMap.get(p.mother.id!);
                    if (spouseId && map.has(spouseId)) {
                        map.get(spouseId)!.children.push(node);
                        parentFound = true;
                    }
                }
            }

            if (!parentFound) {
                roots.push(node);
            }
        });

        return Array.from(new Set(roots));
    };

    const NodeCard = ({ node }: { node: Person }) => (
        <div
            onClick={(e) => { e.stopPropagation(); navigate(`/people/${node.id}`); }}
            className="inline-block border border-white/20 p-2.5 no-underline text-white text-[11px] rounded-[5px] transition-all duration-500 bg-white/10 backdrop-blur-[5px] w-[120px] cursor-pointer hover:bg-white/30 hover:border-white/50 hover:scale-105 hover:z-10 relative z-20"
        >
            {node.imageUrl ? (
                <img src={node.imageUrl} alt="" className="w-[50px] h-[50px] rounded-full object-cover mb-[5px] border-2 border-white/30 mx-auto" />
            ) : (
                <div className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center mx-auto mb-[5px] text-xl border-2 border-white/20">
                    {node.fullName.charAt(0)}
                </div>
            )}
            <span className="block font-bold mb-[2px] truncate">{node.fullName}</span>
            <span className="text-[0.8em] opacity-70">{node.dateOfBirth?.split('-')[0]}</span>
        </div>
    );

    const renderNode = (node: TreeNode) => {
        const hasSpouse = node.spouses && node.spouses.length > 0;

        return (
            <li key={node.id} className="float-left text-center list-none relative p-5 px-8 transition-all duration-500
                before:content-[''] before:absolute before:top-0 before:right-1/2 before:w-1/2 before:h-5 before:border-t before:border-white/50
                after:content-[''] after:absolute after:top-0 after:left-1/2 after:w-1/2 after:h-5 after:border-l after:border-t after:border-white/50
                only:pt-0 only:before:hidden only:after:hidden
                first:before:border-0 last:after:border-0
                last:before:border-r last:before:rounded-tr-[5px]
                first:after:border-l first:after:rounded-tl-[5px]
            ">
                {/* Content Wrapper */}
                <div className="flex justify-center items-start gap-2 relative pt-5">

                    {/* Connector Bridge for Spouses */}
                    {hasSpouse && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-120px)] h-5 border-t border-l border-r border-white/50 rounded-t-lg pointer-events-none" />
                    )}

                    <NodeCard node={node} />

                    {hasSpouse && node.spouses.map(spouse => (
                        <NodeCard key={spouse.id} node={spouse} />
                    ))}
                </div>

                {node.children.length > 0 && (
                    <ul className="pt-5 relative transition-all duration-500 flex justify-center
                        before:content-[''] before:absolute before:top-0 before:left-1/2 before:border-l before:border-white/50 before:w-0 before:h-5"
                    >
                        {node.children.map(child => renderNode(child))}
                    </ul>
                )}
            </li>
        );
    };

    if (loading) return <div className="flex justify-center p-16 text-lg text-white/80">Growing tree...</div>;

    return (
        <div className="flex flex-col h-screen overflow-hidden p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-shadow-sm">Family Tree</h2>
                <button
                    className="bg-[#51cf66] text-white border-0 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-[#40c057] hover:-translate-y-0.5"
                    onClick={() => navigate('/people')}
                >
                    List View
                </button>
            </div>

            <div
                ref={containerRef}
                className="w-full flex-1 overflow-auto p-8 relative scroll-smooth"
            >
                <div className="min-w-fit w-full flex justify-center absolute top-8 left-0">
                    <div className="flex flex-col items-center">
                        <ul className="pt-5 relative transition-all duration-500 flex justify-center">
                            {roots.map(root => renderNode(root))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
