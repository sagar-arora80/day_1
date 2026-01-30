import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { ImageWithLoader } from '../ImageWithLoader';

export function Bookshelf({ books }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Handle Keyboard Navigation
    const handleKeyDown = useCallback((e) => {
        if (selectedIndex === null) return;
        if (e.key === 'ArrowRight') handleNext(e);
        if (e.key === 'ArrowLeft') handlePrev(e);
        if (e.key === 'Escape') setSelectedIndex(null);
    }, [selectedIndex, books]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Preload Next/Prev Images
    useEffect(() => {
        if (selectedIndex !== null && books) {
            const nextIdx = (selectedIndex + 1) % books.length;
            const prevIdx = (selectedIndex - 1 + books.length) % books.length;

            if (books[nextIdx].image) {
                const nextImg = new Image();
                nextImg.src = books[nextIdx].image;
            }
            if (books[prevIdx].image) {
                const prevImg = new Image();
                prevImg.src = books[prevIdx].image;
            }
        }
    }, [selectedIndex, books]);

    if (!books || books.length === 0) return null;

    const handleNext = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % books.length);
    };

    const handlePrev = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + books.length) % books.length);
    };

    const currentBook = selectedIndex !== null ? books[selectedIndex] : null;

    return (
        <div className="w-full mb-12">
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Mind (Reading List)
            </h3>

            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x snap-mandatory">
                {books.map((book, i) => (
                    <motion.div
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                        className="relative flex-shrink-0 w-32 md:w-40 aspect-[2/3] rounded-lg group cursor-pointer snap-start"
                        whileHover={{
                            y: -10,
                            rotateX: 5,
                            rotateY: 5,
                            transition: { type: "spring", stiffness: 300 }
                        }}
                    >
                        {/* Book Cover */}
                        <div className="absolute inset-0 rounded-lg overflow-hidden shadow-lg shadow-black/50 group-hover:shadow-violet-900/20 transition-shadow duration-300 bg-slate-800">
                            {book.image ? (
                                <ImageWithLoader
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-800 border border-slate-700">
                                    <span className="text-xs font-bold text-slate-200">{book.title}</span>
                                    <span className="text-[10px] text-slate-500 mt-1">{book.description}</span>
                                </div>
                            )}

                            {/* Spine/Page Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>

                        {/* Hover Details Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl z-20 pointer-events-none text-center"
                        >
                            <div className="text-sm font-bold text-white mb-0.5">{book.title}</div>
                            <div className="text-xs text-slate-400 mb-2">{book.description}</div>
                            {book.tags && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${(Array.isArray(book.tags) ? book.tags.join(' ') : (book.tags || '')).toLowerCase().includes('finish')
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                    }`}>
                                    {Array.isArray(book.tags) ? book.tags.join(', ') : book.tags}
                                </span>
                            )}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Book Gallery Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIndex(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedIndex(null)}
                            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-20 backdrop-blur-sm"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 hidden md:flex z-20 backdrop-blur-sm"
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 hidden md:flex z-20 backdrop-blur-sm"
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Content Container */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.9, x: 0 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 0 }} // Simple exit to prevent layout jump
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                if (swipe < -100 || (swipe < -50 && velocity.x < -100)) {
                                    handleNext();
                                } else if (swipe > 100 || (swipe > 50 && velocity.x > 100)) {
                                    handlePrev();
                                }
                            }}
                            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl touch-pan-y"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Left: Huge Book Cover */}
                            <div className="w-full md:w-1/2 h-[400px] md:h-[500px] bg-slate-950 flex items-center justify-center p-8">
                                <div className="relative h-full aspect-[2/3] shadow-2xl shadow-black rounded-lg overflow-hidden">
                                    <ImageWithLoader
                                        src={currentBook.image}
                                        alt={currentBook.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Spine */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/20 to-transparent"></div>
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <div className="mb-2">
                                    {currentBook.tags && (
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${(Array.isArray(currentBook.tags) ? currentBook.tags.join(' ') : (currentBook.tags || '')).toLowerCase().includes('finish')
                                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                                : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                                            }`}>
                                            {Array.isArray(currentBook.tags) ? currentBook.tags.join(', ') : currentBook.tags}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-3xl font-bold text-white mb-2">{currentBook.title}</h2>
                                <h3 className="text-xl text-slate-400 mb-6 font-medium">{currentBook.description}</h3>

                                {currentBook.link && (
                                    <a
                                        href={currentBook.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-colors w-fit"
                                    >
                                        View Book <ExternalLink size={18} />
                                    </a>
                                )}

                                <div className="mt-8 text-sm text-slate-500 flex items-center gap-4">
                                    <button onClick={handlePrev} className="hover:text-white transition-colors flex items-center gap-1"><ChevronLeft size={16} /> Prev</button>
                                    <span>{selectedIndex + 1} / {books.length}</span>
                                    <button onClick={handleNext} className="hover:text-white transition-colors flex items-center gap-1">Next <ChevronRight size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
