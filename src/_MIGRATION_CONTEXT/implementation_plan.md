# Implementation Plan - Blog Platform Conversion

## Goal
Convert the existing "Portfolio with external blogs" into a "First-class Blogging Platform" where content is hosted, managed, and rendered natively.

## 1. Data Model (Firestore)
Create `blogs` collection. No schema enforcement in Firestore, but Admin will enforce:
- `slug` (string, unique ID)
- `title` (string)
- `subtitle` (string)
- `coverImage` (string, URL)
- `content` (string, Markdown)
- `tags` (array of strings)
- `status` ('draft' | 'published')
- `readingTime` (number, minutes)
- `publishedAt` (timestamp)
- `createdAt` (timestamp)

## 2. Dependencies
- `react-markdown`: For rendering content.
- `remark-gfm`: GitHub Flavored Markdown (tables, etc.).
- `rehype-highlight`: Syntax highlighting.
- `rehype-raw`: For HTML support if needed.
- `slugify`: Auto-generate slugs from titles.
- `date-fns`: Date formatting.

## 3. Admin Dashboard Updates (`/admin`)
- **Navigation**:
    - Add "Blogs" tab/sidebar item.
- **Blog Manager**:
    - List view of all blogs (Title, Status, Date, Actions).
    - "Draft" vs "Published" indicators.
- **Blog Editor**:
    - Full-page editor.
    - Fields: Title, Subtitle, Slug (editable), Tags, Cover Image (Upload), Status.
    - Markdown Editor (Textarea) + Live Preview (Split view or Toggle).
    - Auto-calculate reading time.

## 4. Public Frontend
- **Route `/blogs` (Blog List)**:
    - Replace existing "Blogs" section or redirect.
    - Grid layout card design.
    - Filter by Tag/Year.
    - Filter out `status !== 'published'`.
- **Route `/blogs/:slug` (Blog Detail)**:
    - Hero section with Cover Image & Title.
    - Meta info (Date, Read Time, Tags).
    - Content Body:
        - Typography: `prose prose-invert` (Tailwind Typography plugin might be needed, or custom styles).
        - Sticky Progress Bar.
    - "Share" buttons (optional).

## 5. Migration Helper
- Simple text area in Admin to paste Medium HTML/Text -> Convert to Markdown (basic regex/logic) -> Save as Draft.

## 6. Execution Steps
1.  [x] Install Dependencies.
2.  [] Create `BlogService.js` (Firestore wrapper).
3.  [] Implement `AdminBlogList` component.
4.  [] Implement `AdminBlogEditor` component.
5.  [] Update `AdminDashboard` to include new components.
6.  [] Create `BlogCard` and `BlogList` public components.
7.  [] Create `BlogPost` page (Markdown renderer).
8.  [] Update `App` routing.
9.  [] Verify & Polish.
