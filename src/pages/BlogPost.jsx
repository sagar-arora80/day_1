import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { format } from 'date-fns';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import 'highlight.js/styles/github-dark.css';

export default function BlogPost() {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const data = await blogService.getBlogBySlug(slug);
                if (data) {
                    setBlog(data);
                    // Update Page Title
                    document.title = `${data.title} | Sagar.dev`;
                }
            } catch (error) {
                console.error("Failed to load blog", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlog();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
            <div className="animate-pulse">Loading Article...</div>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white text-center p-6">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-slate-400 mb-8">Article not found.</p>
            <Link to="/blogs" className="text-violet-400 hover:text-white flex items-center gap-2">
                <ArrowLeft size={20} /> Back to Blogs
            </Link>
        </div>
    );

    return (
        <>
            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 origin-left z-50"
                style={{ scaleX }}
            />

            <article className="min-h-screen bg-slate-950 text-slate-200">
                {/* Hero Section */}
                <div className="relative w-full h-[50vh] min-h-[400px]">
                    <div className="absolute inset-0">
                        {blog.coverImage ? (
                            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800" />
                        )}
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    </div>

                    <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-end pb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl"
                        >
                            <Link to="/blogs" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 uppercase tracking-wider text-xs font-bold transition-all hover:-translate-x-1">
                                <ArrowLeft size={14} /> Back to All Posts
                            </Link>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-violet-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                {blog.title}
                            </h1>

                            {blog.subtitle && (
                                <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl font-light">
                                    {blog.subtitle}
                                </p>
                            )}

                            <div className="flex items-center gap-6 text-sm text-slate-400 font-mono border-t border-slate-800/50 pt-6">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} className="text-violet-500" />
                                    {blog.publishedAt ? format(blog.publishedAt.toDate(), 'MMMM d, yyyy') : 'Draft'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={16} className="text-fuchsia-500" />
                                    {blog.readingTime} min read
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="container mx-auto px-6 py-12">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="prose prose-invert prose-lg max-w-none 
                                prose-headings:text-white prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h3:text-2xl
                                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                                prose-strong:text-white prose-em:text-slate-200
                                prose-li:text-slate-300
                                prose-blockquote:border-violet-500 prose-blockquote:bg-slate-900/50 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-400
                                prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300 hover:prose-a:underline
                                prose-code:text-fuchsia-300 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-light
                                prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl
                                prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-slate-800
                                "
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </motion.div>

                        {/* Footer/Share */}
                        <div className="mt-20 pt-10 border-t border-slate-800 flex justify-between items-center">
                            <Link to="/blogs" className="text-slate-400 hover:text-white font-medium flex items-center gap-2">
                                <ArrowLeft size={18} /> More Articles
                            </Link>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium"
                            >
                                <Share2 size={18} /> Share this
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
