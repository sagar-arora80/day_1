import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from '../components/Section';
import { ProjectCard } from '../components/ProjectCard';
import { Bookshelf } from '../components/Interests/Bookshelf';
import { ActivityBar } from '../components/Interests/ActivityBar';
import { PhotoGallery } from '../components/Interests/PhotoGallery';
import { ArrowRight, Github, Linkedin, Mail, Twitter, ChevronDown, Download, BookOpen } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { blogService } from '../services/blogService';
import { Link } from 'react-router-dom';

export default function Home() {
    const [data, setData] = useState({
        employment: [],
        weekend: [],
        ai: [],
        blog: [],
        books: [],
        photos: [],
        activities: []
    });

    const [settings, setSettings] = useState({
        heroTitle: '',
        heroSubtitle: '',
        contactBtnText: '',
        contactBtnUrl: '',
        sectionTitleEmployment: '',
        sectionTitleAi: '',
        sectionTitleWeekend: ''
    });

    const [latestBlogs, setLatestBlogs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Settings
                const settingsRef = doc(db, 'settings', 'global');
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    const settingsData = settingsSnap.data();
                    setSettings(prev => ({ ...prev, ...settingsData }));

                    // Update Title & Favicon
                    if (settingsData.brandName) document.title = settingsData.brandName;
                    if (settingsData.profilePhoto) {
                        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                        link.type = 'image/x-icon';
                        link.rel = 'shortcut icon';
                        link.href = settingsData.profilePhoto;
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                }

                // Fetch Latest Blogs
                const blogs = await blogService.getPublishedBlogs();
                setLatestBlogs(blogs.slice(0, 3));

                // Fetch Projects
                const querySnapshot = await getDocs(collection(db, 'projects'));
                const projectsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort by Rank (Ascending)
                projectsList.sort((a, b) => (a.rank || 0) - (b.rank || 0));

                setData({
                    employment: projectsList.filter(p => p.category === 'employment'),
                    weekend: projectsList.filter(p => p.category === 'weekend'),
                    ai: projectsList.filter(p => p.category === 'ai'),
                    books: projectsList.filter(p => p.category === 'book'),
                    photos: projectsList.filter(p => p.category === 'photo'),
                    activities: projectsList.filter(p => p.category === 'activity'),
                    blog: projectsList.filter(p => p.category === 'blog')
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
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
                            {settings.profilePhoto && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-48 h-48 mx-auto mb-8 rounded-full p-1 bg-gradient-to-br from-violet-500 to-fuchsia-500"
                                >
                                    <img
                                        src={settings.profilePhoto}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full border-4 border-slate-950"
                                    />
                                </motion.div>
                            )}

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent whitespace-pre-line leading-tight">
                                {settings.heroTitle}
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-line">
                                {settings.heroSubtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a href="#projects" className="px-8 py-3 rounded-full bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-700">
                                    View Work <ArrowRight size={18} />
                                </a>
                                <a
                                    href={settings.contactBtnUrl || "#contact"}
                                    target={settings.contactBtnUrl?.startsWith('http') ? "_blank" : "_self"}
                                    rel={settings.contactBtnUrl?.startsWith('http') ? "noopener noreferrer" : ""}
                                    className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
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
                <Section title={settings.sectionTitleEmployment || "Major Projects (Employment)"} id="projects">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.employment.map((project, i) => (
                            <ProjectCard
                                key={i}
                                title={project.title}
                                description={project.description}
                                tags={project.tags}
                                date={project.year || project.createdAt?.toDate?.().getFullYear() || ''}
                                image={project.image}
                                links={{ live: project.link }}
                            />
                        ))}
                    </div>
                </Section>
            ) : (
                /* Fallback static content so the page isn't empty on first load */
                <Section title={settings.sectionTitleEmployment || "Major Projects (Employment)"} id="projects">
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

            {/* Weekend Side Projects (AI) */}
            {(data.weekend.length > 0) ? (
                <Section title={settings.sectionTitleWeekend || "Weekend AI Experiments"}>
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
                <Section title={settings.sectionTitleWeekend || "Weekend AI Experiments"}>
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

            {/* Personal Interests (Mind, Body, Soul) */}
            {(data.books.length > 0 || data.activities.length > 0 || data.photos.length > 0) ? (
                <Section title="Personal Interests">
                    <Bookshelf books={data.books} />
                    <ActivityBar activities={data.activities} />
                    <PhotoGallery photos={data.photos} />
                </Section>
            ) : (
                /* Fallback Content when empty */
                <Section title="Personal Interests">
                    <div className="text-center p-8 border border-slate-800 rounded-xl bg-slate-900/50 text-slate-400">
                        <div className="mb-2">📚 🏃‍♂️ 🏔️</div>
                        Add Books, Activities, and Photos in Admin Dashboard to populate this section.
                    </div>
                </Section>
            )}

            {/* Blog Section */}
            {(latestBlogs.length > 0) && (
                <Section title="Engineering Blog" id="blog">
                    <div className="space-y-4">
                        {latestBlogs.map((post) => (
                            <Link to={`/blogs/${post.slug}`} key={post.id} className="group flex flex-col md:flex-row gap-6 items-start p-6 rounded-xl hover:bg-slate-900/50 border border-transparent hover:border-slate-800 transition-all cursor-pointer">
                                <div className="flex-shrink-0 text-slate-500 text-sm font-mono mt-1 w-32">
                                    {post.publishedAt ? new Date(post.publishedAt.toDate()).toLocaleDateString() : 'Draft'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-200 group-hover:text-violet-400 transition-colors mb-2">{post.title}</h3>
                                    <p className="text-slate-400 leading-relaxed line-clamp-2">{post.subtitle}</p>
                                </div>
                                <BookOpen className="ml-auto text-slate-600 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                        <div className="pt-4 text-center">
                            <Link to="/blogs" className="inline-flex items-center gap-2 text-violet-400 hover:text-white font-medium transition-colors">
                                Read all articles <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </Section>
            )}

            {/* Contact Section Footer */}
            <div id="contact"></div>

        </div>
    );
}
