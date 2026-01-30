import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithLoader } from '../ImageWithLoader';

export function PhotoGallery({ photos }) {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Handle Keyboard Navigation
    const handleKeyDown = useCallback((e) => {
        if (selectedIndex === null) return;
        if (e.key === 'ArrowRight') handleNext(e);
        if (e.key === 'ArrowLeft') handlePrev(e);
        if (e.key === 'Escape') setSelectedIndex(null);
    }, [selectedIndex, photos]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Preload Next/Prev Images
    useEffect(() => {
        if (selectedIndex !== null && photos) {
            const nextIdx = (selectedIndex + 1) % photos.length;
            const prevIdx = (selectedIndex - 1 + photos.length) % photos.length;

            const nextImg = new Image();
            nextImg.src = photos[nextIdx].image;

            const prevImg = new Image();
            prevImg.src = photos[prevIdx].image;
        }
    }, [selectedIndex, photos]);

    if (!photos || photos.length === 0) return null;

    const handleNext = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrev = (e) => {
        e?.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const currentPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <span className="text-2xl">🏔️</span> Soul (Adventures)
            </h3>

            {/* Standard Grid Layout (Fixed Height) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photos.map((photo, i) => (
                    <motion.div
                        key={i}
                        layoutId={`photo-${i}`}
                        className="relative group rounded-2xl overflow-hidden cursor-zoom-in h-64 border border-slate-800 bg-slate-900"
                        onClick={() => setSelectedIndex(i)}
                        whileHover={{ y: -5 }}
                    >
                        <div className="w-full h-full relative">
                            <ImageWithLoader
                                src={photo.image}
                                alt={photo.title}
                                className="object-cover group-hover:scale-110 transition-transform duration-700 w-full h-full"
                            />
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                                    <MapPin size={14} className="text-violet-400" />
                                    {photo.title}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                                    <Calendar size={12} />
                                    {photo.year || photo.date}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Carousel Lightbox Modal */}
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

                        {/* Navigation Buttons (Desktop) */}
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

                        {/* Main Image Container */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
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
                            className="relative max-w-7xl max-h-[85vh] flex flex-col items-center justify-center p-2 touch-pan-y"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="max-h-[75vh] w-auto rounded-md shadow-2xl relative">
                                <ImageWithLoader
                                    src={currentPhoto.image}
                                    alt={currentPhoto.title}
                                    className="max-h-[75vh] w-auto object-contain rounded-md"
                                />
                            </div>

                            <div className="mt-6 text-center">
                                <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                    {currentPhoto.title}
                                    <span className="text-sm font-normal text-slate-400 px-2 py-0.5 border border-slate-700 rounded-full bg-slate-900">
                                        {selectedIndex + 1} / {photos.length}
                                    </span>
                                </h3>
                                <p className="text-slate-400 text-sm max-w-2xl mx-auto">{currentPhoto.description}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
