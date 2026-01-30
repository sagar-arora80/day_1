# Personal Website Redesign & CMS Integration

- [x] **Phase 1: Analysis & Setup**
    - [x] Clone and explore existing `day_1` repository <!-- id: 0 -->
    - [x] Analyze current tech stack and hosting setup (Firebase?) <!-- id: 1 -->
    - [x] Create implementation plan <!-- id: 2 -->

- [/] **Phase 2: Visual Overhaul (Frontend)**
    - [x] Design new "Premium" aesthetic (Dark mode, glassmorphism) <!-- id: 3 -->
    - [x] Create reusable components (ProjectCard, BlogCard, SectionHeader) <!-- id: 4 -->
    - [x] Implement new sections (Blogs, Employment Projects, AI Initiatives) <!-- id: 5 -->

- [x] **Phase 3: Dynamic Content (CMS)**
    - [x] Choose database solution (likely Firestore given `web.app` domain) <!-- id: 6 -->
    - [x] Create Admin Dashboard route (protected) <!-- id: 7 -->
    - [x] Implement CRUD operations for portfolio items <!-- id: 8 -->
    - [x] Connect public frontend to fetch data dynamically <!-- id: 9 -->
    - [x] Implement Image Upload using Firebase Storage <!-- id: 12 -->
    - [x] Create 'settings' collection in Firestore for global content (Hero, Brand) <!-- id: 13 -->
    - [x] Add 'Site Settings' section to Admin Dashboard <!-- id: 14 -->
    - [x] Refactor Navbar to show Social Icons instead of text links <!-- id: 15 -->
    - [x] Refactor Home and Layout to fetch dynamic global content <!-- id: 16 -->
    - [x] Add 'Contact Button' settings (Text + URL) to Admin and Home <!-- id: 17 -->
    - [x] Fix Github icon visibility in Navbar <!-- id: 18 -->
    - [x] Improve visual prominence of Social Icons (outline/color) <!-- id: 19 -->
    - [x] Fix Flash of Default Content (FOUC) on Home load <!-- id: 20 -->
    - [x] Debug and Fix Github Icon visibility <!-- id: 21 -->
    - [x] Reduce excessive vertical spacing between sections <!-- id: 22 -->

- [ ] **Phase 4: Verification & Deploy**
    - [x] Verify local build <!-- id: 10 -->
- [ ] **Phase 7: Final Deployment**
    - [x] Deploy to Firebase Hosting <!-- id: 37 -->
    - [x] Update Layout: Tooltips for Socials, Remove Admin Icon <!-- id: 23 -->
    - [x] Update Home: Remove 'Available' badge, Enhance CTA styling <!-- id: 24 -->
    - [x] Update Admin: Add 'Year' field to Projects, Editable Section Headers <!-- id: 25 -->
    - [x] Update Home: Wire up dynamic Section Headers and Project Year <!-- id: 26 -->
    - [x] Fix Social Tooltips visibility (Custom CSS) <!-- id: 27 -->
    - [x] Debug Section Headers editing in Admin/Home <!-- id: 28 -->
    - [x] Fix FOUC on Section Headers (Loading State) <!-- id: 29 -->
    - [x] Make entire Project Card clickable <!-- id: 30 -->
    - [x] Reduce Project Card size (padding/fonts) <!-- id: 31 -->
    - [x] Compact section spacing (reduce whitespace) <!-- id: 32 -->
- [ ] **Phase 6: Profile Photo Feature**
    - [x] Admin: Add Profile Photo upload to Settings <!-- id: 33 -->
    - [x] Home: Display Profile Photo in Hero section <!-- id: 34 -->
    - [x] Increase Profile Photo size <!-- id: 35 -->
    - [x] Reorder sections: Weekend above AI Initiatives <!-- id: 36 -->
- [ ] **Phase 8: Domain & Branding**
    - [ ] Guidelines for Custom Domain (sagar_arora.me) <!-- id: 38 -->
    - [x] specific feature: Dynamic Favicon from Profile Photo <!-- id: 39 -->
    - [x] Update Browser Tab Title ("Sagar Arora") <!-- id: 40 -->
- [x] **Phase 9: Personal Interests Section**
    - [x] Design Plan: Bookshelf & Photography Masonry <!-- id: 41 -->
    - [x] Admin: Add new Project Types (Book, Photo, Activity) <!-- id: 42 -->
    - [x] Home: Implement Bookshelf Component <!-- id: 43 -->
    - [x] Home: Implement Photography Gallery <!-- id: 44 -->
    - [x] Home: Refactor Bookshelf to Gallery View <!-- id: 45 -->
    - [x] Home: Add Swipe Navigation for Mobile <!-- id: 46 -->

- [x] **Phase 10: Image Optimization**
    - [x] Create ImageWithLoader Component (Skeleton + Fade) <!-- id: 47 -->
    - [x] Refactor PhotoGallery & Bookshelf to use Loader <!-- id: 48 -->
    - [x] Implement Preloading Logic for Ligthbox <!-- id: 49 -->

- [x] **Phase 12: Final Polish**
    - [x] Update Footer Content <!-- id: 53 -->

- [x] **Phase 13: Native Blog Platform**
    - [x] Install Dependencies (markdown, slugify) <!-- id: 54 -->
    - [x] Admin: Blog Manager (List & Delete) <!-- id: 55 -->
    - [x] Admin: Blog Editor (Create/Edit with Markdown Preview) <!-- id: 56 -->
    - [x] Frontend: Blog List Page (/blogs) <!-- id: 57 -->
    - [x] Frontend: Blog Detail Page (/blogs/:slug) <!-- id: 58 -->
    - [x] Routing & SEO Updates <!-- id: 59 -->
    - [x] Feature: Support Blogs as Projects (Internal Linking) <!-- id: 60 -->
    - [x] Feature: Rich Text Editor (Toolbar, Inline Copy, URL) <!-- id: 61 -->
