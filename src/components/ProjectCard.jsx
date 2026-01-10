import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar } from 'lucide-react';

export function ProjectCard({ title, description, image, tags, links, date }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            className="group relative bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-colors"
        >
            <div className="aspect-video bg-slate-800 overflow-hidden">
                {image ? (
                    <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-violet-400 transition-colors">{title}</h3>
                    <div className="flex gap-2 text-slate-400">
                        {links?.github && <a href={links.github} target="_blank" rel="noopener noreferrer" className="hover:text-white"><Github size={20} /></a>}
                        {links?.live && <a href={links.live} target="_blank" rel="noopener noreferrer" className="hover:text-white"><ExternalLink size={20} /></a>}
                    </div>
                </div>

                {date && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <Calendar size={14} />
                        <span>{date}</span>
                    </div>
                )}

                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{description}</p>

                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
