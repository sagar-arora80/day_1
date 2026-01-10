import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, LogOut, Edit2, X, Upload, Loader2, Settings, Save } from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'settings'
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Settings State
    const [settings, setSettings] = useState({
        brandName: 'Sagar.dev',
        heroTitle: 'Building the Future with AI & Engineering',
        heroSubtitle: "I'm Sagar Arora, a software engineer passionate about scalable systems, AI initiatives, and crafting exceptional digital experiences.",
        contactBtnText: 'Contact Me',
        contactBtnUrl: '#contact',
        linkedin: '',
        twitter: '',
        github: ''
    });
    const [savingSettings, setSavingSettings] = useState(false);

    // Project Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        image: '',
        category: 'employment',
        link: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const docRef = doc(db, 'settings', 'global');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projectsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectsList);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await setDoc(doc(db, 'settings', 'global'), settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Error saving settings: " + error.message);
        } finally {
            setSavingSettings(false);
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `project-images/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            }

            const dataToSubmit = {
                ...formData,
                image: imageUrl,
                tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(',').map(t => t.trim()),
                updatedAt: new Date()
            };

            if (!dataToSubmit.createdAt && !editingId) {
                dataToSubmit.createdAt = new Date();
            }

            if (editingId) {
                await updateDoc(doc(db, 'projects', editingId), dataToSubmit);
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'projects'), dataToSubmit);
            }

            resetForm();
            fetchProjects();
        } catch (error) {
            console.error("Error saving document: ", error);
            alert("Error saving: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', tags: '', image: '', category: 'employment', link: '' });
        setImageFile(null);
    };

    const handleEdit = (project) => {
        setActiveTab('projects');
        setEditingId(project.id);
        setFormData({
            ...project,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
        });
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            await deleteDoc(doc(db, 'projects', id));
            fetchProjects();
        }
    };

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-3xl font-bold text-white">Content Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Site Settings
                            </button>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {activeTab === 'settings' ? (
                    <div className="max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-xl border border-slate-800">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Settings className="text-violet-500" /> Global Site Settings
                        </h2>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Header & Branding</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Brand Name (Logo Text)</label>
                                        <input
                                            value={settings.brandName}
                                            onChange={e => setSettings({ ...settings, brandName: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Hero Section</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Hero Title</label>
                                        <textarea
                                            value={settings.heroTitle}
                                            onChange={e => setSettings({ ...settings, heroTitle: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none h-20"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">HTML tags fetch as text, but used roughly for layout.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Hero Subtext</label>
                                        <textarea
                                            value={settings.heroSubtitle}
                                            onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none h-24"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Call to Action (Button)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Button Text</label>
                                        <input
                                            value={settings.contactBtnText || ''}
                                            onChange={e => setSettings({ ...settings, contactBtnText: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                            placeholder="Contact Me"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Button URL</label>
                                        <input
                                            value={settings.contactBtnUrl || ''}
                                            onChange={e => setSettings({ ...settings, contactBtnUrl: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                            placeholder="#contact or https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">Social Links</h3>
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">LinkedIn URL</label>
                                        <input
                                            value={settings.linkedin}
                                            onChange={e => setSettings({ ...settings, linkedin: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Twitter/X URL</label>
                                        <input
                                            value={settings.twitter}
                                            onChange={e => setSettings({ ...settings, twitter: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">GitHub URL</label>
                                        <input
                                            value={settings.github}
                                            onChange={e => setSettings({ ...settings, github: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                            placeholder="https://github.com/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={savingSettings}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                {savingSettings ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                Save Settings
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 h-fit sticky top-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {editingId ? <Edit2 size={20} className="text-violet-500" /> : <Plus size={20} className="text-violet-500" />}
                                    {editingId ? 'Edit Item' : 'Add New Item'}
                                </h2>
                                {editingId && (
                                    <button onClick={handleCancelEdit} className="text-slate-500 hover:text-white" title="Cancel Edit">
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* ... existing form fields ... */}
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Title</label>
                                    <input
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                    >
                                        <option value="employment">Employment Project</option>
                                        <option value="weekend">Weekend Project</option>
                                        <option value="ai">AI Initiative</option>
                                        <option value="blog">Blog Post</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none h-24"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
                                    <input
                                        value={formData.tags}
                                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                        placeholder="React, AI, Python"
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Cover Image</label>
                                    <div className="flex flex-col gap-2">
                                        {/* File Input */}
                                        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-violet-500 hover:bg-slate-800/50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImageFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                            <div className="flex flex-col items-center gap-1 text-slate-500">
                                                {imageFile ? (
                                                    <span className="text-violet-400 text-sm font-medium">{imageFile.name}</span>
                                                ) : (
                                                    <>
                                                        <Upload size={20} />
                                                        <span className="text-xs">Click to upload image</span>
                                                    </>
                                                )}
                                            </div>
                                        </label>

                                        {/* Preview Existing Image */}
                                        {!imageFile && formData.image && (
                                            <div className="relative h-24 w-full rounded-lg overflow-hidden border border-slate-700 group">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs text-white">Current Image</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Link URL</label>
                                    <input
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 focus:border-violet-500 outline-none"
                                    />
                                </div>

                                <button
                                    disabled={uploading}
                                    className={`w-full font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 ${editingId ? 'bg-fuchsia-600 hover:bg-fuchsia-700' : 'bg-violet-600 hover:bg-violet-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            {editingId ? 'Updating...' : 'Uploading...'}
                                        </>
                                    ) : (
                                        <>{editingId ? 'Update Item' : 'Add Item'}</>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* List Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold mb-4">Manage Content</h2>
                            {projects.map(project => (
                                <div key={project.id} className={`flex justify-between items-start bg-slate-900/30 p-4 rounded-lg border ${editingId === project.id ? 'border-violet-500' : 'border-slate-800'} hover:border-slate-700 transition-colors`}>
                                    <div className="flex gap-4">
                                        {project.image && (
                                            <div className="w-16 h-16 rounded bg-slate-800 flex-shrink-0 overflow-hidden">
                                                <img src={project.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${project.category === 'employment' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                    project.category === 'ai' ? 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400' :
                                                        'bg-slate-700/50 border-slate-600 text-slate-400'
                                                    }`}>
                                                    {project.category.toUpperCase()}
                                                </span>
                                                <h3 className="font-semibold text-white">{project.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-400 line-clamp-1">{project.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="text-slate-500 hover:text-violet-400 p-2 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-center text-slate-500 py-10">No items found. Add one to get started.</div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
