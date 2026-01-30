import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ImageWithLoader({ src, alt, className, style, onClick }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`} style={style} onClick={onClick}>
            {/* Skeleton Loader */}
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-slate-800 animate-pulse z-10"
                    />
                )}
            </AnimatePresence>

            {/* Actual Image */}
            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full ${className}`}
                loading="lazy"
            />
        </div>
    );
}
