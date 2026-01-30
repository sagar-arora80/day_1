# Project Migration Guide

## Project State: "Phase 13 Complete - Blog Platform"
**Date**: Jan 30, 2026
**Commit**: `3aad104` (Local Snapshot)

This archive contains the full source code for the `day_1` Personal Website, including recent unmerged features:
-   **Native Blog Platform**: `/blogs`, `/blogs/:slug`, Admin Editor, and Firestore Integration.
-   **Enhanced Admin Dashboard**: Rich Text Editor, Image Uploads, Project Ranking.
-   **Context Docs**: See `src/_MIGRATION_CONTEXT/` for the detailed `task.md` (Checklist) and `walkthrough.md` (Features).

## Migration Steps (New System)

1.  **Extract**:
    ```bash
    tar -xzf day_1_migration.tar.gz
    cd day_1
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    -   Ensure `.env` exists (it is included in this archive).
    -   It uses the `sagar-day-1` Firebase Project.

4.  **Start Local Server**:
    ```bash
    npm start
    ```
    -   Visit `http://localhost:3000`

5.  **Git Setup (If pushing to a new repo)**:
    Since the old remote might be restricted, you can set a new remote:
    ```bash
    git remote remove origin
    git remote add origin <NEW_REPO_URL>
    git push -u origin main
    ```

## Critical Notes
-   **Database**: The app connects to the *Live* Firestore. Your data is safe in the cloud.
-   **Hosting**: The live site `sagar-day-1.web.app` is running the old version until you deploy this code.
-   **Deploy**: Run `npm run build && firebase deploy` to update the live site.
