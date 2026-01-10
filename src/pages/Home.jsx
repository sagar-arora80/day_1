import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/Section';
import { ProjectCard } from '../components/ProjectCard';
import { ArrowRight, Cpu, Code, BookOpen } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
    const [data, setData] = useState({
        employment: [],
        weekend: [],
        ai: [],
        blog: []
    });

    const [settings, setSettings] = useState({
        heroTitle: '',
        heroSubtitle: '',
        contactBtnText: '',
        contactBtnUrl: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Projects
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const items = querySnapshot.docs.map(doc => doc.data());

                setData({
                    employment: items.filter(i => i.category === 'employment'),
                    weekend: items.filter(i => i.category === 'weekend'),
                    ai: items.filter(i => i.category === 'ai'),
                    blog: items.filter(i => i.category === 'blog')
                });

                // Fetch Settings
                const docRef = doc(db, 'settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <section id="about" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    {/* Only show content when title is loaded to prevent FOUC */}
                    {settings.heroTitle && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium backdrop-blur-sm">
                                Available for new opportunities
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent whitespace-pre-line">
                                {settings.heroTitle}
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
                                {settings.heroSubtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a href="#projects" className="px-8 py-3 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors flex items-center gap-2">
                                    View Work <ArrowRight size={18} />
                                </a>
                                <a
                                    href={settings.contactBtnUrl || "#contact"}
                                    target={settings.contactBtnUrl?.startsWith('http') ? "_blank" : "_self"}
                                    rel={settings.contactBtnUrl?.startsWith('http') ? "noopener noreferrer" : ""}
                                    className="px-8 py-3 rounded-full bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    {settings.contactBtnText || "Contact Me"}
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Employment Projects */}
            {(data.employment.length > 0) ? (
                <Section title="Major Projects (Employment)" id="projects">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.employment.map((project, i) => (
                            <ProjectCard
                                key={i}
                                title={project.title}
                                description={project.description}
                                tags={project.tags}
                                date={project.createdAt?.toDate?.().getFullYear() || ''}
                                image={project.image}
                                links={{ live: project.link }}
                            />
                        ))}
                    </div>
                </Section>
            ) : (
                /* Fallback static content so the page isn't empty on first load */
                <Section title="Major Projects (Employment)" id="projects">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProjectCard
                            title="Enterprise AI Agent Platform"
                            description="Architected a multi-agent system for automating customer support workflows, reducing ticket resolution time by 40%."
                            tags={['Python', 'LangChain', 'OpenAI', 'React']}
                            date="2023 - Present"
                        />
                        <ProjectCard
                            title="Fintech Payment Gateway"
                            description="Led the migration of a legacy payment system to a microservices architecture handling $10M+ daily volume."
                            tags={['Go', 'gRPC', 'PostgreSQL', 'Kubernetes']}
                            date="2021 - 2023"
                        />
                    </div>
                </Section>
            )}

            {/* AI Initiatives - Employment */}
            {(data.ai.length > 0) ? (
                <Section title="AI Initiatives at Work">
                    <div className="grid md:grid-cols-2 gap-8">
                        {data.ai.map((project, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-gradient-to-br from-violet-900/20 to-slate-900 border border-violet-500/20">
                                <Cpu className="text-violet-400 mb-4 h-8 w-8" />
                                <h3 className="text-xl font-bold text-slate-100 mb-3">{project.title}</h3>
                                <p className="text-slate-400">{project.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            ) : (
                <Section title="AI Initiatives at Work">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-900/20 to-slate-900 border border-violet-500/20">
                            <Cpu className="text-violet-400 mb-4 h-8 w-8" />
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Internal Knowledge Graph</h3>
                            <p className="text-slate-400">Spearheaded the development of a RAG-based knowledge retrieval system for internal documentation, improving developer onboarding speed.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-fuchsia-900/20 to-slate-900 border border-fuchsia-500/20">
                            <Code className="text-fuchsia-400 mb-4 h-8 w-8" />
                            <h3 className="text-xl font-bold text-slate-100 mb-3">Code Review Assistant</h3>
                            <p className="text-slate-400">Built a custom LLM tool integrated into GitHub Actions to provide automated security and performance suggestions on PRs.</p>
                        </div>
                    </div>
                </Section>
            )}

            {/* Weekend Side Projects (AI) */}
            {(data.weekend.length > 0) ? (
                <Section title="Weekend AI Experiments">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.weekend.map((project, i) => (
                            <ProjectCard
                                key={i}
                                title={project.title}
                                description={project.description}
                                tags={project.tags}
                                image={project.image}
                                links={{ live: project.link }}
                            />
                        ))}
                    </div>
                </Section>
            ) : (
                <Section title="Weekend AI Experiments">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ProjectCard
                            title="Personal Web Assistant"
                            description="A voice-activated assistant that manages my personal calendar and summarizes emails."
                            tags={['Whisper API', 'Node.js', 'React Native']}
                            links={{ github: '#' }}
                        />
                        <ProjectCard
                            title="Generative Art Gallery"
                            description="An infinite gallery of AI-generated art using Stable Diffusion, curated by user preferences."
                            tags={['Next.js', 'Vercel', 'Stable Diffusion']}
                            links={{ live: '#' }}
                        />
                    </div>
                </Section>
            )}

            {/* Blog Section */}
            {(data.blog.length > 0) && (
                <Section title="Engineering Blog" id="blog">
                    <div className="space-y-4">
                        {data.blog.map((post, i) => (
                            <div key={i} className="group flex flex-col md:flex-row gap-6 items-start p-6 rounded-xl hover:bg-slate-900/50 border border-transparent hover:border-slate-800 transition-all cursor-pointer" onClick={() => window.open(post.link, '_blank')}>
                                <div className="flex-shrink-0 text-slate-500 text-sm font-mono mt-1 w-32">Latest</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-200 group-hover:text-violet-400 transition-colors mb-2">{post.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{post.description}</p>
                                </div>
                                <BookOpen className="ml-auto text-slate-600 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Contact Section Footer */}
            <div id="contact"></div>

        </div>
    );
}
