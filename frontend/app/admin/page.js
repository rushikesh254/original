"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search, Filter } from "lucide-react";

export default function AdminDashboard() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesRes = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes`
                );
                const recipesData = await recipesRes.json();
                setRecipes(recipesData.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                toast.error("Failed to load data");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteRecipe = async (id) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes/${id}`, {
                method: "DELETE" // We added this support in backend
            });
            if (res.ok) {
                setRecipes(recipes.filter(r => r.id !== id));
                toast.success("Deleted successfully");
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#32324d] mb-2">Recipes</h1>
                    <p className="text-[#666687]">Calculated ( {recipes.length} entries )</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded font-medium flex items-center gap-2 transition-colors">
                    <Plus size={18} />
                    Create new entry
                </button>
            </div>

            {/* Filters Bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500 text-sm"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-700 rounded bg-purple-50 hover:bg-purple-100 font-medium text-sm">
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Table Section */}
            {loading ? (
                <div className="flex justify-center items-center h-64 bg-white rounded shadow-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f6f6f9] text-[#666687] text-xs font-bold uppercase tracking-wider border-b border-neutral-200">
                            <tr>
                                <th className="p-4 w-16">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Cuisine</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-[#32324d] text-sm">
                            {recipes.map((recipe, index) => (
                                <tr key={recipe.id} className="border-b border-neutral-100 hover:bg-[#f6f6f9] transition-colors">
                                    <td className="p-4 text-gray-500">#{index + 1}</td>
                                    <td className="p-4 font-semibold">{recipe.title}</td>
                                    <td className="p-4">
                                        <span className="capitalize px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-medium">
                                            {recipe.category}
                                        </span>
                                    </td>
                                    <td className="p-4 capitalize">{recipe.cuisine}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded border text-xs font-medium ${recipe.isPublic ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                            {recipe.isPublic ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRecipe(recipe.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {recipes.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-400">
                                        No entries found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
