import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag } from 'lucide-react';


export default function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await blogService.getPublishedBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Failed to load blogs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-slate-950 to-fuchsia-900/10" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            Engineering & Essence
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto"
                    >
                        A collection of thoughts on software architecture, AI experiments, and the subtle art of building things.
                    </motion.p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="container mx-auto px-6 pb-24">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-slate-900/50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/blogs/${blog.slug}`} className="group block bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 h-full flex flex-col">
                                    {/* Cover Image */}
                                    <div className="bg-slate-800 h-48 overflow-hidden relative">
                                        {blog.coverImage && (
                                            <img
                                                src={blog.coverImage}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {blog.tags && blog.tags[0] && (
                                                <span className="px-3 py-1 text-xs font-semibold bg-black/50 backdrop-blur-md text-white rounded-full border border-white/10 uppercase tracking-wide">
                                                    {blog.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 font-mono">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {blog.publishedAt ? format(blog.publishedAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {blog.readingTime} min read
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                                            {blog.title}
                                        </h2>
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                                            {blog.subtitle || "Read more about this topic..."}
                                        </p>

                                        <div className="flex items-center text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            Read Article &rarr;
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && blogs.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl text-slate-500 font-medium">No articles published yet.</h3>
                        <p className="text-slate-600 mt-2">Check back soon for updates.</p>
                    </div>
                )}
            </section>
        </div>

    );
}
