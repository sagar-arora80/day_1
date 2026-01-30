import React, { useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import { Plus, Edit2, Trash2, Eye, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBlogList({ onEdit, onCreate }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await blogService.getAllBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Failed to load blogs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await blogService.deleteBlog(id);
                setBlogs(blogs.filter(b => b.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete blog");
            }
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-violet-500" size={32} /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Blog Posts</h2>
                    <p className="text-slate-400 text-sm">Manage your thoughts and tutorials</p>
                </div>
                <button
                    onClick={onCreate}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} /> Write New
                </button>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No blogs yet</h3>
                    <p className="text-slate-400 mb-6">Start writing your first article now.</p>
                    <button onClick={onCreate} className="text-violet-400 hover:text-violet-300 font-medium">Create one now &rarr;</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {blogs.map(blog => (
                        <div key={blog.id} className="group bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all">
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                                    {blog.coverImage ? (
                                        <img src={blog.coverImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600"><FileText size={20} /></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1">{blog.title || 'Untitled'}</h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full border ${blog.status === 'published'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                            }`}>
                                            {blog.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                        <span>{blog.readingTime || 0} min read</span>
                                        <span>• {blog.createdAt ? format(blog.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(blog)} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(blog.id, blog.title)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
