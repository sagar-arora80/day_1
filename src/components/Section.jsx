import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Section({ children, className, id, title }) {
    return (
        <section id={id} className={twMerge(clsx('py-8 px-4 md:px-8 max-w-7xl mx-auto', className))}>
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-8"
                >
                    {title}
                </motion.h2>
            )}
            {children}
        </section>
    );
}
