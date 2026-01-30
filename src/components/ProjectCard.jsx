import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export function ProjectCard({ title, description, image, tags, links, date }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const targetLink = links?.live || links?.github;
        if (targetLink) {
            if (targetLink.startsWith('/') || targetLink.includes(window.location.origin)) {
                // Internal Link
                const path = targetLink.replace(window.location.origin, '');
                navigate(path);
            } else {
                // External Link
                window.open(targetLink, '_blank', 'noopener,noreferrer');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            onClick={handleCardClick}
            className={`group relative bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-colors ${links?.live || links?.github ? 'cursor-pointer' : ''}`}
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

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-violet-400 transition-colors">{title}</h3>
                    <div className="flex gap-2 text-slate-400">
                        {links?.github && (
                            <a
                                href={links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white relative z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github size={18} />
                            </a>
                        )}
                        {links?.live && (
                            <a
                                href={links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white relative z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {date && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar size={12} />
                        <span>{date}</span>
                    </div>
                )}

                <p className="text-slate-400 text-sm mb-3 line-clamp-3 leading-relaxed">{description}</p>

                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
