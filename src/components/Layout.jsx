import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Terminal, Shield, Linkedin, Twitter, Github } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function Layout({ children }) {
    const [settings, setSettings] = useState({
        brandName: 'Sagar.dev',
        linkedin: '',
        twitter: '',
        github: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <NavLink to="/" className="flex items-center gap-2 font-bold text-xl text-slate-100 hover:text-violet-400 transition-colors">
                        <Terminal className="text-violet-500" />
                        <span>{settings.brandName.split('.')[0]}<span className="text-slate-500">.{settings.brandName.split('.')[1] || 'dev'}</span></span>
                    </NavLink>

                    <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
                        {settings.linkedin && (
                            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-blue-400 hover:text-white hover:border-violet-500 hover:bg-violet-600 transition-all shadow-sm">
                                <Linkedin size={18} />
                            </a>
                        )}
                        {settings.twitter && (
                            <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-sky-400 hover:text-white hover:border-violet-500 hover:bg-violet-600 transition-all shadow-sm">
                                <Twitter size={18} />
                            </a>
                        )}
                        {settings.github && (
                            <a href={settings.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-violet-500 hover:bg-violet-600 transition-all shadow-sm">
                                <Github size={18} />
                            </a>
                        )}
                        {!settings.linkedin && !settings.twitter && !settings.github && (
                            <span className="text-xs text-slate-600 hidden sm:block">Add socials in Admin</span>
                        )}

                        <div className="h-6 w-px bg-slate-800 mx-2"></div>

                        <NavLink to="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-violet-500 hover:bg-violet-600 transition-all shadow-sm" title="Admin Login">
                            <Shield size={18} />
                        </NavLink>
                    </div>
                </div>
            </nav>

            <main className="pt-16">
                {children}
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-20" id="contact">
                <p>© {new Date().getFullYear()} {settings.brandName}. Built with React & Tailwind.</p>
            </footer>
        </div>
    );
}
