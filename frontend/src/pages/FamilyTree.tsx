import { useEffect, useState } from 'react';
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
        const map = new Map<number, TreeNode>();
        allPeople.forEach(p => {
            map.set(p.id!, { ...p, children: [], spouses: [] });
        });

        const roots: TreeNode[] = [];

        allPeople.forEach(p => {
            const node = map.get(p.id!)!;
            if (p.father && map.has(p.father.id!)) {
                map.get(p.father.id!)!.children.push(node);
            }
            else if (p.mother && map.has(p.mother.id!)) {
                map.get(p.mother.id!)!.children.push(node);
            }
            else {
                roots.push(node);
            }
        });

        return Array.from(new Set(roots));
    };

    const renderNode = (node: TreeNode) => (
        <li key={node.id} className="float-left text-center list-none relative p-5 pt-5 px-1 transition-all duration-500
            before:content-[''] before:absolute before:top-0 before:right-1/2 before:w-1/2 before:h-5 before:border-t before:border-white/50
            after:content-[''] after:absolute after:top-0 after:left-1/2 after:w-1/2 after:h-5 after:border-l after:border-t after:border-white/50
            only:pt-0 only:before:hidden only:after:hidden
            first:before:border-0 last:after:border-0
            last:before:border-r last:before:rounded-tr-[5px]
            first:after:border-l first:after:rounded-tl-[5px]
        ">
            <div
                onClick={() => navigate(`/people/${node.id}`)}
                className="inline-block border border-white/20 p-2.5 no-underline text-white text-[11px] rounded-[5px] transition-all duration-500 bg-white/10 backdrop-blur-[5px] w-[120px] cursor-pointer hover:bg-white/30 hover:border-white/50 hover:scale-105 hover:z-10 relative"
            >
                {node.imageUrl ? (
                    <img src={node.imageUrl} alt="" className="w-[50px] h-[50px] rounded-full object-cover mb-[5px] border-2 border-white/30 mx-auto" />
                ) : (
                    <div className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center mx-auto mb-[5px] text-xl border-2 border-white/20">
                        {node.fullName.charAt(0)}
                    </div>
                )}
                <span className="block font-bold mb-[2px]">{node.fullName}</span>
                <span className="text-[0.8em] opacity-70">{node.dateOfBirth?.split('-')[0]}</span>
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

            <div className="w-full min-h-full overflow-auto p-8 flex justify-center items-start">
                <div className="flex flex-col items-center">
                    <ul className="pt-5 relative transition-all duration-500 flex justify-center">
                        {roots.map(root => renderNode(root))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
