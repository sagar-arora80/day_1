import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function AdminBlogEditor({ blog, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        slug: '',
        content: '',
        tags: '',
        status: 'draft',
        coverImage: ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (blog) {
            setFormData({
                ...blog,
                tags: blog.tags ? blog.tags.join(', ') : ''
            });
        }
    }, [blog]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await blogService.uploadImage(file);
            setFormData(prev => ({ ...prev, coverImage: url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const insertTextAtCursor = (text) => {
        const textarea = document.getElementById('content-editor');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentContent = formData.content;

        const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);

        setFormData(prev => ({ ...prev, content: newContent }));

        // Restore focus and cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const handleInlineImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show loading state in text? optional.
        const loadingPlaceholder = `\n![Uploading ${file.name}...]()\n`;
        insertTextAtCursor(loadingPlaceholder);

        try {
            const url = await blogService.uploadImage(file);
            // Replace placeholder with actual image
            const textarea = document.getElementById('content-editor');
            const newContent = formData.content.replace(loadingPlaceholder, `\n![${file.name}](${url})\n`);
            // Better to re-read current value in case user typed, but for now this is safer than regex replacing "Uploading..." if user typed it.
            // Actually, best is to just insert at cursor, but since we are async, cursor might move.
            // Simplified approach: Just insert at end or try to replace specific unique string.
            // Let's rely on state update.
            setFormData(prev => ({
                ...prev,
                content: prev.content.replace(loadingPlaceholder, `\n![${file.name}](${url})\n`)
            }));

        } catch (error) {
            console.error("Inline upload failed", error);
            alert("Image upload failed");
            setFormData(prev => ({
                ...prev,
                content: prev.content.replace(loadingPlaceholder, '')
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const dataToSave = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            if (blog?.id) {
                await blogService.updateBlog(blog.id, dataToSave);
            } else {
                await blogService.createBlog(dataToSave);
            }
            onSave();
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save blog");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <button onClick={onCancel} className="text-slate-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to List
                </button>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                    >
                        {previewMode ? <><Edit3 size={18} /> Edit</> : <><Eye size={18} /> Preview</>}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {blog ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                {/* Editor Form */}
                <div className={`space-y-6 overflow-y-auto pr-2 ${previewMode ? 'hidden lg:block' : ''}`}>
                    <div className="space-y-4 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                        {/* URL Display (Only if slug exists) */}
                        {formData.slug && (
                            <div className="bg-slate-950 border border-violet-500/30 rounded-lg p-3 flex items-center justify-between group">
                                <div className="text-sm">
                                    <span className="text-slate-500">Public URL: </span>
                                    <span className="text-violet-400 font-mono">/blogs/{formData.slug}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        const url = `${window.location.origin}/blogs/${formData.slug}`;
                                        navigator.clipboard.writeText(url);
                                        alert("URL copied!");
                                    }}
                                    className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded hover:bg-violet-500 hover:text-white transition-colors"
                                >
                                    Copy Link
                                </button>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-lg font-bold focus:border-violet-500 outline-none"
                                placeholder="Article Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Subtitle</label>
                            <input
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:border-violet-500 outline-none"
                                placeholder="Brief description..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Slug (Optional)</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm font-mono text-slate-400 focus:border-violet-500 outline-none"
                                    placeholder="auto-generated"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:border-violet-500 outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Tags (comma separated)</label>
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 focus:border-violet-500 outline-none"
                                placeholder="react, design, tutorial"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Cover Image</label>
                            <div className="flex items-center gap-4">
                                {formData.coverImage && (
                                    <img src={formData.coverImage} alt="Cover" className="w-20 h-20 object-cover rounded-lg border border-slate-700" />
                                )}
                                <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm flex items-center gap-2 transition-colors">
                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <ImageIcon size={16} />}
                                    Upload New
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm text-slate-400">Content (Markdown)</label>
                            {/* Toolbar */}
                            <div className="flex gap-1 bg-slate-800 p-1 rounded-md">
                                <button onClick={() => insertTextAtCursor('**bold text**')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Bold">
                                    <span className="font-bold text-xs">B</span>
                                </button>
                                <button onClick={() => insertTextAtCursor('*italic text*')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Italic">
                                    <span className="italic text-serif text-xs">I</span>
                                </button>
                                <div className="w-px bg-slate-700 mx-1"></div>
                                <button onClick={() => insertTextAtCursor('## ')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Heading 2">
                                    <span className="font-bold text-xs">H2</span>
                                </button>
                                <button onClick={() => insertTextAtCursor('### ')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Heading 3">
                                    <span className="font-bold text-xs">H3</span>
                                </button>
                                <div className="w-px bg-slate-700 mx-1"></div>
                                <button onClick={() => insertTextAtCursor('- ')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Bullet List">
                                    <span className="text-xs">List</span>
                                </button>
                                <button onClick={() => insertTextAtCursor('\n> ')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Quote">
                                    <span className="text-xs font-serif">""</span>
                                </button>
                                <div className="w-px bg-slate-700 mx-1"></div>
                                <label className="cursor-pointer p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Insert Image">
                                    <ImageIcon size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleInlineImageUpload} />
                                </label>
                            </div>
                        </div>
                        <textarea
                            id="content-editor"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full flex-1 min-h-[500px] bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-sm leading-relaxed focus:border-violet-500 outline-none resize-none"
                            placeholder="# Write something amazing..."
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className={`space-y-4 bg-slate-900/30 p-8 rounded-xl border border-slate-800 overflow-y-auto max-h-[calc(100vh-200px)] prose prose-invert prose-lg max-w-none ${!previewMode ? 'hidden lg:block' : ''}`}>
                    {!formData.content ? (
                        <div className="text-slate-500 text-center italic mt-20">Preview will appear here...</div>
                    ) : (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {formData.content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
}
