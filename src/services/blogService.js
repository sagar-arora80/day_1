import { db, storage } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import slugify from 'slugify';

const COLLECTION = 'blogs';

export const blogService = {
    // helpers
    createSlug: (title) => {
        return slugify(title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
    },

    calculateReadingTime: (content) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    },

    // CRUD
    getAllBlogs: async () => {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getPublishedBlogs: async () => {
        const q = query(
            collection(db, COLLECTION),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    getBlogBySlug: async (slug) => {
        const q = query(collection(db, COLLECTION), where('slug', '==', slug));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    createBlog: async (data) => {
        const blogData = {
            ...data,
            slug: data.slug || blogService.createSlug(data.title),
            readingTime: blogService.calculateReadingTime(data.content || ''),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            publishedAt: data.status === 'published' ? serverTimestamp() : null
        };
        return await addDoc(collection(db, COLLECTION), blogData);
    },

    updateBlog: async (id, data) => {
        const blogData = {
            ...data,
            readingTime: blogService.calculateReadingTime(data.content || ''),
            updatedAt: serverTimestamp(),
        };
        // If switching to published and no publishedAt exists
        if (data.status === 'published' && !data.publishedAt) {
            blogData.publishedAt = serverTimestamp();
        }
        return await updateDoc(doc(db, COLLECTION, id), blogData);
    },

    deleteBlog: async (id) => {
        return await deleteDoc(doc(db, COLLECTION, id));
    },

    uploadImage: async (file) => {
        const storageRef = ref(storage, `blog-covers/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    }
};
